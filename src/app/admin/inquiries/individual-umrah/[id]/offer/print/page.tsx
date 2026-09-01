"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { IndividualUmrahOfferDocument } from "@/components/admin/individual-umrah-offer/IndividualUmrahOfferDocument";
import type { Hotel } from "@/data/mock";
import type { IndividualUmrahInquiry } from "@/lib/individual-umrah-inquiry";
import type { IndividualUmrahOffer } from "@/lib/individual-umrah-offer";
import { resolveOfferPdfLocale } from "@/lib/individual-umrah-offer-pdf-i18n";
import {
  buildIndividualUmrahOfferPdfBasename,
  buildIndividualUmrahOfferPdfFilename,
} from "@/lib/individual-umrah-offer-pdf-filename";
import { getIndividualUmrahInquiry } from "@/lib/individual-umrah-inquiries-store";
import {
  getIndividualUmrahOfferByInquiry,
  getOfferPdfSnapshot,
  formatOfferPdfVersionLabel,
} from "@/lib/individual-umrah-offers-store";
import { createEmptyOfferFromInquiry } from "@/lib/individual-umrah-offer-defaults";
import { setRuntimeHotels } from "@/lib/hotel-catalog";

function ensureArabicPdfFont() {
  if (document.getElementById("iu-pdf-noto-ar")) return;
  const link = document.createElement("link");
  link.id = "iu-pdf-noto-ar";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

/**
 * Spec 16: Chrome/Edge “Save as PDF” uses document.title as the suggested filename.
 */
function printWithPdfFilename(basename: string) {
  const previous = document.title;
  document.title = basename;

  const restore = () => {
    document.title = previous;
    window.removeEventListener("beforeprint", onBefore);
    window.removeEventListener("afterprint", restore);
  };
  const onBefore = () => {
    document.title = basename;
  };

  window.addEventListener("beforeprint", onBefore);
  window.addEventListener("afterprint", restore);
  window.print();
}

export default function AdminIndividualUmrahOfferPrintPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [inquiry, setInquiry] = useState<IndividualUmrahInquiry | null>(null);
  const [offer, setOffer] = useState<IndividualUmrahOffer | null>(null);
  const [versionLabel, setVersionLabel] = useState<string | null>(null);
  const [previewOnly, setPreviewOnly] = useState(false);
  const [hotelsReady, setHotelsReady] = useState(false);

  useEffect(() => {
    document.body.classList.add("iu-offer-print-mode");
    const q = new URLSearchParams(window.location.search);
    const snapshotId = q.get("v");
    setPreviewOnly(q.get("preview") === "1");

    const found = getIndividualUmrahInquiry(id);
    setInquiry(found);
    if (!found) return;

    let nextOffer: IndividualUmrahOffer;
    if (snapshotId) {
      const snap = getOfferPdfSnapshot(snapshotId);
      if (snap && snap.inquiryId === id) {
        nextOffer = snap.offer;
        setVersionLabel(formatOfferPdfVersionLabel(snap.version, snap.generatedAt));
      } else {
        nextOffer =
          getIndividualUmrahOfferByInquiry(id) ?? createEmptyOfferFromInquiry(found);
      }
    } else {
      nextOffer =
        getIndividualUmrahOfferByInquiry(id) ?? createEmptyOfferFromInquiry(found);
    }
    setOffer(nextOffer);

    if (resolveOfferPdfLocale(found, nextOffer) === "ar") {
      ensureArabicPdfFont();
    }

    return () => {
      document.body.classList.remove("iu-offer-print-mode");
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    async function loadHotels() {
      try {
        const res = await fetch("/api/hotels", { cache: "no-store" });
        if (!res.ok) throw new Error("fetch_failed");
        const data = (await res.json()) as { hotels: Hotel[] };
        if (!cancelled) {
          setRuntimeHotels(data.hotels);
          setHotelsReady(true);
        }
      } catch {
        if (!cancelled) setHotelsReady(true);
      }
    }
    void loadHotels();
    return () => {
      cancelled = true;
    };
  }, []);

  const pdfLocale = useMemo(
    () => (inquiry && offer ? resolveOfferPdfLocale(inquiry, offer) : "de"),
    [inquiry, offer],
  );
  const pdfFilename = useMemo(
    () =>
      offer
        ? buildIndividualUmrahOfferPdfFilename(offer.offerNumber, pdfLocale)
        : null,
    [offer, pdfLocale],
  );
  const pdfBasename = useMemo(
    () =>
      offer
        ? buildIndividualUmrahOfferPdfBasename(offer.offerNumber, pdfLocale)
        : null,
    [offer, pdfLocale],
  );

  useEffect(() => {
    if (!inquiry || !offer || !hotelsReady || previewOnly || !pdfBasename) return;
    const timer = window.setTimeout(() => printWithPdfFilename(pdfBasename), 400);
    return () => window.clearTimeout(timer);
  }, [inquiry, offer, hotelsReady, previewOnly, pdfBasename]);

  if (!inquiry || !offer || !hotelsReady) {
    return <p className="p-8 text-muted">Angebot wird geladen…</p>;
  }

  return (
    <div className="iu-offer-print-root min-h-screen bg-white p-4 md:p-8">
      <div className="admin-no-print mb-4 flex flex-wrap items-center gap-3 print:hidden">
        {versionLabel ? (
          <p className="me-auto text-sm font-semibold text-navy">{versionLabel}</p>
        ) : (
          <span className="me-auto" />
        )}
        {pdfFilename ? (
          <p className="text-[11px] font-medium text-muted" title="Vorgeschlagener Dateiname">
            Dateiname: <span className="font-mono text-navy">{pdfFilename}</span>
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => pdfBasename && printWithPdfFilename(pdfBasename)}
          className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white"
        >
          PDF herunterladen / Drucken
        </button>
        <button
          type="button"
          onClick={() => window.close()}
          className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-navy"
        >
          Schließen
        </button>
      </div>
      <IndividualUmrahOfferDocument inquiry={inquiry} offer={offer} />
    </div>
  );
}
