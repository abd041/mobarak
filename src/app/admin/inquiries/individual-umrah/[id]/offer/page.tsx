"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, Circle } from "lucide-react";
import { useHotels } from "@/hooks/useHotels";
import {
  getIndividualUmrahInquiry,
  INDIVIDUAL_UMRAH_INQUIRIES_EVENT,
  updateIndividualUmrahInquiryStatus,
} from "@/lib/individual-umrah-inquiries-store";
import {
  generateOfferPdfVersion,
  getIndividualUmrahOfferByInquiry,
  getLatestOfferPdfSnapshot,
  getOfferPdfHistory,
  formatOfferPdfVersionLabel,
  formatOfferPdfVersionLanguageLabelDe,
  INDIVIDUAL_UMRAH_OFFERS_EVENT,
  isOfferPdfDirty,
  saveIndividualUmrahOffer,
} from "@/lib/individual-umrah-offers-store";
import { AdminOfferPdfVersionHistoryItem } from "@/components/admin/AdminOfferPdfVersionHistoryItem";
import type {
  IndividualUmrahOffer,
  IndividualUmrahOfferPdfSnapshot,
  OfferHotelOption,
} from "@/lib/individual-umrah-offer";
import {
  addonsVisibleOnPdf,
  createEmptyOfferFromInquiry,
  emptyHotelOption,
  getOfferPdfReadiness,
  inquiryCityStayRanges,
  inquiryCityStayStarts,
} from "@/lib/individual-umrah-offer-defaults";
import {
  formatMissingHotelRateMessage,
  getOfferHotelMissingRateDates,
} from "@/lib/individual-umrah-hotel-rates-store";
import { resolveHotelById } from "@/lib/hotel-catalog";
import {
  resolveCustomerLanguage,
  type IndividualUmrahInquiry,
} from "@/lib/individual-umrah-inquiry";
import {
  avgPerPerson,
  ensurePerRoomBreakdown,
  formatAddonPriceLabelDe,
  formatEuroDe,
  formatFlightBaggageLines,
  getCalculatedRoomPrices,
  hotelOfferPriceIsOverridden,
  roomsTotal,
} from "@/lib/individual-umrah-offer-pricing";
import { IndividualUmrahOfferDocument } from "@/components/admin/individual-umrah-offer/IndividualUmrahOfferDocument";
import { HotelCityOfferEditor, moveHotelOption } from "@/components/admin/individual-umrah-offer/HotelCityOfferEditor";
import { AddonsOfferEditor } from "@/components/admin/individual-umrah-offer/AddonsOfferEditor";
import { OfferTermsEditor } from "@/components/admin/individual-umrah-offer/OfferTermsEditor";
import { FlightOffersEditor } from "@/components/admin/individual-umrah-offer/FlightOffersEditor";
import { formatTripDisplayDateRange } from "@/lib/trip-inquiry";
import { AdminInquiryLanguageBadge } from "@/components/admin/AdminInquiryLanguageBadge";
import { formatIndividualUmrahInquirySummary } from "@/lib/individual-umrah-inquiry-summary";
import {
  hasOfferPdfLanguageOverride,
  OFFER_PDF_LANGUAGE_LABEL_DE,
  resolveOfferPdfLocale,
  type OfferPdfLocale,
} from "@/lib/individual-umrah-offer-pdf-i18n";
import { resolveOfferPdfTemplate } from "@/lib/individual-umrah-offer-pdf-templates";
import { buildIndividualUmrahOfferPdfFilename } from "@/lib/individual-umrah-offer-pdf-filename";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-navy">{label}</span>
      {children}
    </label>
  );
}

const inputClass = "w-full rounded-lg border border-line px-3 py-2 text-sm";

const WORKFLOW_STEPS = [
  "Kundenwünsche",
  "Flugangebote",
  "Hotels Medina",
  "Hotels Makkah",
  "Zusatzleistungen",
  "Preise prüfen",
  "PDF Vorschau",
  "PDF erzeugen",
  "PDF herunterladen",
  "Manuell senden",
] as const;

export default function AdminIndividualUmrahOfferPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [inquiry, setInquiry] = useState<IndividualUmrahInquiry | null>(null);
  const [offer, setOffer] = useState<IndividualUmrahOffer | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfHistory, setPdfHistory] = useState<IndividualUmrahOfferPdfSnapshot[]>([]);
  const { hotels } = useHotels();

  useEffect(() => {
    const sync = () => {
      const found = getIndividualUmrahInquiry(id);
      setInquiry(found);
      if (!found) {
        setOffer(null);
        setPdfHistory([]);
        return;
      }
      const existing = getIndividualUmrahOfferByInquiry(id);
      setOffer(existing ?? createEmptyOfferFromInquiry(found));
      setPdfHistory(getOfferPdfHistory(id));
    };
    sync();
    window.addEventListener(INDIVIDUAL_UMRAH_INQUIRIES_EVENT, sync);
    window.addEventListener(INDIVIDUAL_UMRAH_OFFERS_EVENT, sync);
    return () => {
      window.removeEventListener(INDIVIDUAL_UMRAH_INQUIRIES_EVENT, sync);
      window.removeEventListener(INDIVIDUAL_UMRAH_OFFERS_EVENT, sync);
    };
  }, [id]);

  useEffect(() => {
    if (!inquiry || !offer) return;
    if (resolveOfferPdfLocale(inquiry, offer) !== "ar") return;
    if (document.getElementById("iu-pdf-noto-ar")) return;
    const link = document.createElement("link");
    link.id = "iu-pdf-noto-ar";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, [inquiry, offer]);

  const medinaHotels = useMemo(
    () => hotels.filter((h) => h.city === "medina" && h.active),
    [hotels],
  );
  const makkahHotels = useMemo(
    () => hotels.filter((h) => h.city === "makkah" && h.active),
    [hotels],
  );

  const pdfReadiness = useMemo(() => {
    if (!inquiry || !offer) return null;
    return getOfferPdfReadiness(inquiry, offer);
  }, [inquiry, offer]);

  const pdfDirty = offer ? isOfferPdfDirty(offer) : false;
  const hasGeneratedPdf = Boolean(offer?.pdfGeneratedAt && (offer.pdfVersion ?? 0) > 0);
  const latestSnapshot = pdfHistory[0] ?? null;
  const autoLanguage = inquiry ? resolveCustomerLanguage(inquiry) : "de";
  const autoLanguageLabel = OFFER_PDF_LANGUAGE_LABEL_DE[autoLanguage];
  const pdfLocale = inquiry && offer ? resolveOfferPdfLocale(inquiry, offer) : null;
  const pdfTemplate =
    inquiry && offer ? resolveOfferPdfTemplate(inquiry, offer) : null;
  const pdfLanguageOverridden = hasOfferPdfLanguageOverride(offer);
  const pdfLanguageHint = pdfTemplate
    ? pdfLanguageOverridden
      ? `PDF-Vorlage: ${pdfTemplate.id} · manuell auf ${pdfTemplate.labelDe} gesetzt`
      : `PDF-Vorlage: ${pdfTemplate.id} · automatisch aus Anfragesprache (${pdfTemplate.labelDe})`
    : null;
  const pdfDownloadFilename =
    offer && pdfLocale
      ? buildIndividualUmrahOfferPdfFilename(offer.offerNumber, pdfLocale)
      : null;

  const summary = useMemo(
    () =>
      inquiry
        ? formatIndividualUmrahInquirySummary(inquiry, { adminLocale: "de" })
        : null,
    [inquiry],
  );

  const workflowDone = useMemo(() => {
    if (!inquiry || !offer || !pdfReadiness) {
      return WORKFLOW_STEPS.map(() => false);
    }
    const showMedina = inquiry.route === "makkah_medina";
    return [
      true, // preferences always visible once inquiry open
      offer.flights.length > 0,
      !showMedina || offer.medinaHotels.length > 0,
      offer.makkahHotels.length > 0,
      offer.addons.length > 0,
      true, // live calculation always present
      showPreview || hasGeneratedPdf,
      hasGeneratedPdf,
      hasGeneratedPdf && Boolean(latestSnapshot),
      hasGeneratedPdf, // manual send after download — marked ready when PDF exists
    ];
  }, [inquiry, offer, pdfReadiness, showPreview, hasGeneratedPdf, latestSnapshot]);

  if (!inquiry || !offer) {
    return (
      <div>
        <Link href="/admin/inquiries/individual-umrah" className="text-sm text-brand-cta">
          ← Zurück
        </Link>
        <p className="mt-6 text-muted">Anfrage nicht gefunden.</p>
      </div>
    );
  }

  const roomCount = inquiry.rooms.room_count;
  const adults = inquiry.travellers.adult_count;
  const children = inquiry.travellers.child_count;
  const showMedina = inquiry.route === "makkah_medina";
  const stays = inquiryCityStayRanges(inquiry);
  const medinaDateLabel = stays.medina
    ? formatTripDisplayDateRange(stays.medina.checkIn, stays.medina.checkOut, "de")
    : "";
  const makkahDateLabel = stays.makkah
    ? formatTripDisplayDateRange(stays.makkah.checkIn, stays.makkah.checkOut, "de")
    : "";

  function patchOffer(next: IndividualUmrahOffer) {
    setOffer(next);
  }

  function setPdfLanguageOverride(value: string) {
    const nextOverride: OfferPdfLocale | null =
      value === "auto" ? null : (value as OfferPdfLocale);
    patchOffer({ ...offer!, pdfLanguageOverride: nextOverride });
    const label =
      nextOverride === null
        ? `Automatisch: ${autoLanguageLabel}`
        : OFFER_PDF_LANGUAGE_LABEL_DE[nextOverride];
    setToast(
      `Angebotssprache: ${label}. Bitte PDF neu erzeugen, falls bereits eine Version existiert.`,
    );
  }

  function updateHotel(
    city: "medina" | "makkah",
    index: number,
    patch: Partial<OfferHotelOption>,
  ) {
    const key = city === "medina" ? "medinaHotels" : "makkahHotels";
    const list = offer![key].map((h, i) => (i === index ? { ...h, ...patch } : h));
    patchOffer({ ...offer!, [key]: list });
  }

  function save() {
    if (!offer) return;
    saveIndividualUmrahOffer({ ...offer, status: offer.status === "ready" ? "ready" : "draft" });
    setToast("Angebot gespeichert");
  }

  function openPrint(opts?: { snapshotId?: string; preview?: boolean; download?: boolean }) {
    const q = new URLSearchParams();
    if (opts?.snapshotId) q.set("v", opts.snapshotId);
    if (opts?.preview) q.set("preview", "1");
    const qs = q.toString();
    window.open(
      `/admin/inquiries/individual-umrah/${id}/offer/print${qs ? `?${qs}` : ""}`,
      "_blank",
    );
  }

  function previewPdf() {
    saveIndividualUmrahOffer(offer!);
    setShowPreview(true);
    setToast("PDF-Vorschau aktualisiert");
  }

  function generateOrRegeneratePdf(kind: "generate" | "regenerate") {
    const current = offer;
    const currentInquiry = inquiry;
    if (!current || !currentInquiry) return;
    const readiness = getOfferPdfReadiness(currentInquiry, current);
    if (!readiness.ready) {
      const missing = readiness.items
        .filter((item) => !item.ready)
        .map((item) => item.label)
        .join(", ");
      setToast(
        readiness.items.some((item) => item.id === "hotelRates" && !item.ready)
          ? "Fehlende Rate — Hotelpreise unvollständig. Raten ergänzen oder Zimmerpreise manuell überschreiben."
          : `Bitte zuerst auswählen: ${missing}`,
      );
      return;
    }
    const { offer: next, snapshot } = generateOfferPdfVersion(current, currentInquiry);
    setOffer(next);
    setPdfHistory(getOfferPdfHistory(id));
    updateIndividualUmrahInquiryStatus(currentInquiry.inquiry_id, "offer_created");
    setShowPreview(true);
    setToast(
      kind === "regenerate"
        ? `${formatOfferPdfVersionLabel(snapshot.version, snapshot.generatedAt)} · Sprache: ${formatOfferPdfVersionLanguageLabelDe(snapshot.pdfLanguage)} — ältere Versionen bleiben erhalten.`
        : `${formatOfferPdfVersionLabel(snapshot.version, snapshot.generatedAt)} · Sprache: ${formatOfferPdfVersionLanguageLabelDe(snapshot.pdfLanguage)} erzeugt.`,
    );
    openPrint({ snapshotId: snapshot.snapshotId, download: true });
  }

  function downloadPdf() {
    const snap = latestSnapshot ?? getLatestOfferPdfSnapshot(id);
    if (snap) {
      openPrint({ snapshotId: snap.snapshotId, download: true });
      setToast(`Heruntergeladen: ${formatOfferPdfVersionLabel(snap.version, snap.generatedAt)}`);
      return;
    }
    setToast("Bitte zuerst PDF erzeugen.");
  }

  return (
    <div className="pb-24">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={`/admin/inquiries/individual-umrah/${id}`}
            className="text-sm text-brand-cta"
          >
            ← Zurück zur Anfrage
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-navy">Angebot erstellen</h1>
          <p className="mt-1 text-sm text-muted">
            <span dir="auto">
              {inquiry.contact.first_name} {inquiry.contact.last_name}
            </span>{" "}
            · {offer.offerNumber}
            {hasGeneratedPdf ? ` · PDF v${offer.pdfVersion}` : ""}
            {pdfDirty ? " · geändert" : ""}
          </p>
          <div className="mt-3">
            <AdminInquiryLanguageBadge language={inquiry.customer_language} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={save}
            className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy"
          >
            Speichern
          </button>
          <button
            type="button"
            onClick={previewPdf}
            className="rounded-xl border border-brand-cta/30 bg-[#EEF5FB] px-4 py-2.5 text-sm font-semibold text-brand-cta"
          >
            PDF Vorschau
          </button>
          {!hasGeneratedPdf ? (
            <button
              type="button"
              onClick={() => generateOrRegeneratePdf("generate")}
              disabled={!pdfReadiness?.ready}
              className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              PDF Angebot erstellen
            </button>
          ) : pdfDirty ? (
            <button
              type="button"
              onClick={() => generateOrRegeneratePdf("regenerate")}
              disabled={!pdfReadiness?.ready}
              className="rounded-xl bg-brand-cta px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              PDF neu erzeugen
            </button>
          ) : (
            <button
              type="button"
              onClick={() => generateOrRegeneratePdf("generate")}
              disabled={!pdfReadiness?.ready}
              className="rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-45"
            >
              PDF Angebot erstellen
            </button>
          )}
          <button
            type="button"
            onClick={downloadPdf}
            disabled={!hasGeneratedPdf && !latestSnapshot}
            className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            PDF herunterladen
          </button>
        </div>
      </div>

      {toast ? (
        <p className="mb-4 rounded-lg bg-brand-green-soft px-3 py-2 text-sm text-brand-green">
          {toast}
        </p>
      ) : null}

      <nav
        className="mb-6 overflow-x-auto rounded-2xl border border-line bg-white p-4 shadow-sm"
        aria-label="Angebots-Workflow"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Workflow (V1)
        </p>
        <ol className="flex min-w-max gap-2">
          {WORKFLOW_STEPS.map((label, index) => {
            const done = workflowDone[index];
            return (
              <li
                key={label}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold ${
                  done
                    ? "border-brand-green/30 bg-brand-green-soft text-brand-green"
                    : "border-line bg-surface/50 text-muted"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-navy">
                  {index + 1}
                </span>
                {label}
                {index < WORKFLOW_STEPS.length - 1 ? (
                  <span className="ms-1 text-muted" aria-hidden>
                    →
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-[11px] text-muted">
          Automatic PDF generation &amp; download are in scope. Sending the PDF to the
          customer is <strong>manual</strong> for V1 (no WhatsApp / email send).
        </p>
      </nav>

      {summary ? (
        <aside className="mb-6 rounded-2xl border-2 border-brand-cta/25 bg-[#EEF5FB] p-5 shadow-sm">
          <h2 className="text-[15px] font-bold text-navy">Kundenwünsche</h2>
          <p className="mt-1 text-xs text-muted">
            Bei der Auswahl von Flügen, Hotels und Zusatzleistungen beachten.
          </p>
          <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Prioritäten
              </p>
              {summary.travel_priorities.length > 0 ? (
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {summary.travel_priorities.map((label) => (
                    <li
                      key={label}
                      className="rounded-full border border-brand-cta/20 bg-white px-2.5 py-1 text-[12px] font-semibold text-navy"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-muted">Nicht angegeben</p>
              )}
            </div>
            <div className="space-y-1.5 text-[13px] text-navy">
              <p>
                <span className="text-muted">Bevorzugte Airline:</span>{" "}
                <strong>{summary.preferred_airline}</strong>
              </p>
              <p>
                <span className="text-muted">Interesse Zusatzleistungen:</span>{" "}
                <strong>{summary.addons_line}</strong>
              </p>
              <p>
                <span className="text-muted">Route:</span> <strong>{summary.route}</strong>
                {summary.order ? (
                  <>
                    {" "}
                    · <strong>{summary.order}</strong>
                  </>
                ) : null}
              </p>
              <p>
                <span className="text-muted">Nächte:</span>{" "}
                <strong>
                  {summary.medina_nights !== "—" ? `${summary.medina_nights} · ` : ""}
                  {summary.makkah_nights}
                </strong>
              </p>
            </div>
          </div>
        </aside>
      ) : null}

      <div className="mb-6 rounded-2xl border border-line bg-white p-4 text-sm text-navy md:p-5">
        <p className="font-semibold">Anfrage-Zusammenfassung</p>
        <p className="mt-2 text-muted">
          {inquiry.airports.join(", ")} · {adults} Erw. / {children} Kind /{" "}
          {inquiry.travellers.infant_count} Baby · {roomCount} Zimmer ·{" "}
          {inquiry.nights.medina_nights ? `${inquiry.nights.medina_nights}N Medina · ` : ""}
          {inquiry.nights.makkah_nights}N Makkah · {inquiry.travel_date.requested_start_date}
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="space-y-8">
          <FlightOffersEditor
            inquiry={inquiry}
            flights={offer.flights}
            onChange={(flights) => patchOffer({ ...offer, flights })}
          />

          {showMedina ? (
            <HotelCityOfferEditor
              title="2. Unterkunft Medina"
              dateLabel={medinaDateLabel}
              hotels={medinaHotels}
              options={offer.medinaHotels}
              roomCount={roomCount}
              adults={adults}
              children={children}
              nights={inquiry.nights.medina_nights}
              stayStartDate={inquiryCityStayStarts(inquiry).medina}
              inquiry={inquiry}
              onAdd={(hotelId, categoryId) =>
                patchOffer({
                  ...offer,
                  medinaHotels: [
                    ...offer.medinaHotels,
                    emptyHotelOption(hotelId, roomCount, {
                      nights: inquiry.nights.medina_nights,
                      stayStartDate: inquiryCityStayStarts(inquiry).medina,
                      categoryId,
                      inquiry,
                    }),
                  ].slice(0, 3),
                })
              }
              onChange={(index, patch) => updateHotel("medina", index, patch)}
              onRemove={(index) =>
                patchOffer({
                  ...offer,
                  medinaHotels: offer.medinaHotels.filter((_, i) => i !== index),
                })
              }
              onReorder={(from, to) =>
                patchOffer({
                  ...offer,
                  medinaHotels: moveHotelOption(offer.medinaHotels, from, to),
                })
              }
            />
          ) : null}

          <HotelCityOfferEditor
            title={`${showMedina ? "3" : "2"}. Unterkunft Makkah`}
            dateLabel={makkahDateLabel}
            hotels={makkahHotels}
            options={offer.makkahHotels}
            roomCount={roomCount}
            adults={adults}
            children={children}
            nights={inquiry.nights.makkah_nights}
            stayStartDate={inquiryCityStayStarts(inquiry).makkah}
            inquiry={inquiry}
            onAdd={(hotelId, categoryId) =>
              patchOffer({
                ...offer,
                makkahHotels: [
                  ...offer.makkahHotels,
                  emptyHotelOption(hotelId, roomCount, {
                    nights: inquiry.nights.makkah_nights,
                    stayStartDate: inquiryCityStayStarts(inquiry).makkah,
                    categoryId,
                    inquiry,
                  }),
                ].slice(0, 3),
              })
            }
            onChange={(index, patch) => updateHotel("makkah", index, patch)}
            onRemove={(index) =>
              patchOffer({
                ...offer,
                makkahHotels: offer.makkahHotels.filter((_, i) => i !== index),
              })
            }
            onReorder={(from, to) =>
              patchOffer({
                ...offer,
                makkahHotels: moveHotelOption(offer.makkahHotels, from, to),
              })
            }
          />

          <AddonsOfferEditor
            inquiry={inquiry}
            addons={offer.addons}
            sectionNumber={showMedina ? 4 : 3}
            onChange={(addons) => patchOffer({ ...offer, addons })}
          />

          <OfferTermsEditor
            includedItems={offer.includedItems}
            excludedItems={offer.excludedItems}
            importantNotes={offer.importantNotes}
            onChange={(patch) => patchOffer({ ...offer, ...patch })}
          />

          <Field label="Name für Anrede (PDF)">
            <input
              className={inputClass}
              value={offer.greetingName}
              onChange={(e) => patchOffer({ ...offer, greetingName: e.target.value })}
              placeholder="Mustermann"
            />
          </Field>
          <p className="mt-1 text-xs text-muted">
            PDF: „Sehr geehrter Herr / Sehr geehrte Frau {offer.greetingName || "…"},“
          </p>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-navy">PDF-Steuerung</h2>
            <p className="mt-1 text-xs text-muted">
              Entwurf ansehen, versioniertes PDF erzeugen / neu erzeugen, dann herunterladen.
              Ältere Versionen bleiben in der Anfrage-Historie.
            </p>
            <div className="mt-3">
              <AdminInquiryLanguageBadge language={inquiry.customer_language} />
            </div>
            <label className="mt-3 block text-sm">
              <span className="mb-1 block font-semibold text-navy">Angebotssprache</span>
              <select
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-navy"
                value={offer.pdfLanguageOverride ?? "auto"}
                onChange={(e) => setPdfLanguageOverride(e.target.value)}
              >
                <option value="auto">Automatisch: {autoLanguageLabel}</option>
                {(["de", "ar", "en", "tr", "bs"] as const).map((code) => (
                  <option key={code} value={code}>
                    {OFFER_PDF_LANGUAGE_LABEL_DE[code]}
                  </option>
                ))}
              </select>
              <span className="mt-1.5 block text-[11px] leading-snug text-muted">
                Standard folgt der Anfragesprache. Bei Bedarf manuell ändern (z.&nbsp;B.
                Arabisch → Deutsch) und PDF neu erzeugen.
                {pdfLocale ? (
                  <>
                    {" "}
                    Aktuell:{" "}
                    <strong className="text-navy">
                      {OFFER_PDF_LANGUAGE_LABEL_DE[pdfLocale]}
                    </strong>
                    {pdfLanguageOverridden ? " (manuell)" : " (automatisch)"}.
                  </>
                ) : null}
              </span>
            </label>
            {pdfLanguageHint ? (
              <p className="mt-2 text-[11px] font-medium text-muted">{pdfLanguageHint}</p>
            ) : null}
            <ul className="mt-3 space-y-2">
              {pdfReadiness?.items.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-sm">
                  {item.ready ? (
                    <Check className="h-4 w-4 shrink-0 text-brand-green" strokeWidth={2.5} />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted" strokeWidth={2} />
                  )}
                  <span className={item.ready ? "text-navy" : "text-muted"}>{item.label}</span>
                </li>
              ))}
            </ul>
            {pdfDirty ? (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800">
                Inhalt oder Angebotssprache haben sich seit PDF v{offer.pdfVersion} geändert.
                Bitte <strong>PDF neu erzeugen</strong> — die vorherige Version bleibt erhalten.
              </p>
            ) : null}
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={previewPdf}
                className="w-full rounded-xl border border-brand-cta/30 bg-[#EEF5FB] px-4 py-2.5 text-sm font-semibold text-brand-cta"
              >
                PDF Vorschau
              </button>
              {pdfDirty && hasGeneratedPdf ? (
                <button
                  type="button"
                  onClick={() => generateOrRegeneratePdf("regenerate")}
                  disabled={!pdfReadiness?.ready}
                  className="w-full rounded-xl bg-brand-cta px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-45"
                >
                  PDF neu erzeugen
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => generateOrRegeneratePdf("generate")}
                  disabled={!pdfReadiness?.ready}
                  className="w-full rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-45"
                >
                  PDF Angebot erstellen
                </button>
              )}
              <button
                type="button"
                onClick={downloadPdf}
                disabled={!hasGeneratedPdf && !latestSnapshot}
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-navy disabled:opacity-45"
              >
                PDF herunterladen
              </button>
            </div>
            <p className="mt-3 text-[11px] text-muted">
              Nach dem Herunterladen: PDF manuell an den Kunden senden (E-Mail / WhatsApp). Automatischer
              Versand ist nicht Teil von V1.
            </p>
            {pdfDownloadFilename ? (
              <p className="mt-2 text-[11px] text-muted">
                Dateiname:{" "}
                <span className="font-mono font-semibold text-navy">{pdfDownloadFilename}</span>
              </p>
            ) : null}
            {hasGeneratedPdf ? (
              <p className="mt-2 text-[11px] text-muted">
                Zuletzt erzeugt: v{offer.pdfVersion}
                {offer.pdfGeneratedAt
                  ? ` · ${new Date(offer.pdfGeneratedAt).toLocaleString("de-AT")}`
                  : ""}
              </p>
            ) : null}
          </div>

          {pdfHistory.length > 0 ? (
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-navy">PDF-Versionshistorie</h2>
              <p className="mt-1 text-[11px] text-muted">
                Jedes Erzeugen / Neu-Erzeugen legt eine neue Version inkl. Sprache an. Ältere
                Kopien werden nie überschrieben.
              </p>
              <ul className="mt-3 space-y-0">
                {pdfHistory.map((snap) => (
                  <AdminOfferPdfVersionHistoryItem
                    key={snap.snapshotId}
                    snap={snap}
                    inquiry={inquiry}
                    action={
                      <button
                        type="button"
                        className="font-semibold text-brand-cta"
                        onClick={() => openPrint({ snapshotId: snap.snapshotId })}
                      >
                        Herunterladen
                      </button>
                    }
                  />
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-navy">Optionen (Alternativen)</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              Flüge, Medina- und Makkah-Hotels sind <strong>Auswahlmöglichkeiten</strong> — kein
              Gesamtpaket. Es gibt keine Summe aus „Flug 1 + Hotel 1 + Hotel 1“, solange keine
              empfohlene Kombination explizit festgelegt wird.
            </p>
            <div className="mt-3 space-y-2 text-sm">
              {offer.flights.map((f, i) => {
                const baggage = formatFlightBaggageLines(f);
                const baggageText = baggage[0] === "—" ? null : baggage.join(" · ");
                return (
                  <div key={f.id} className="space-y-0.5">
                    <p className="flex justify-between gap-2">
                      <span className="text-muted">{f.airlineName || `Flug ${i + 1}`}</span>
                      <span className="font-semibold text-brand-green">
                        {formatEuroDe(f.pricePerPerson)}{" "}
                        <span className="text-xs font-medium">pro Person</span>
                      </span>
                    </p>
                    {baggageText ? (
                      <p className="text-[11px] text-navy">{baggageText}</p>
                    ) : (
                      <p className="text-[11px] text-amber-700">Gepäck fehlt</p>
                    )}
                  </div>
                );
              })}
              {offer.medinaHotels.map((h) => {
                const stayStart = inquiryCityStayStarts(inquiry).medina;
                const nights = inquiry.nights.medina_nights;
                const missingDates = getOfferHotelMissingRateDates(h, stayStart, nights);
                const hotelName = resolveHotelById(h.hotelId)?.name ?? h.hotelId;
                const { roomPrices, roomOccupancyLabels } = ensurePerRoomBreakdown(
                  roomCount,
                  h.roomPrices,
                  h.roomOccupancyLabels,
                );
                const calculated = getCalculatedRoomPrices(h, roomCount);
                const calculatedTotal = roomsTotal(calculated);
                const total = roomsTotal(roomPrices);
                const overridden = hotelOfferPriceIsOverridden(h, roomCount);
                return (
                  <div key={h.id} className="space-y-1 border-t border-line pt-2">
                    <p className="text-xs font-semibold text-navy">{hotelName}</p>
                    {missingDates.length > 0 ? (
                      <div className="rounded-lg bg-amber-50 px-2 py-1.5 text-[11px] text-amber-950">
                        <p className="font-bold">Fehlende Rate</p>
                        {missingDates.map((d) => (
                          <p key={d}>{formatMissingHotelRateMessage(hotelName, d)}</p>
                        ))}
                      </div>
                    ) : null}
                    {overridden && missingDates.length === 0 ? (
                      <p className="text-[11px] text-muted">
                        Berechnet {formatEuroDe(calculatedTotal)} → Angebot{" "}
                        <span className="font-semibold text-navy">{formatEuroDe(total)}</span>
                      </p>
                    ) : null}
                    {roomPrices.map((price, i) => (
                      <div key={i} className="flex justify-between gap-2 text-xs">
                        <span className="text-muted">
                          Zimmer {i + 1}
                          {roomOccupancyLabels[i] !== "—"
                            ? ` · ${roomOccupancyLabels[i]}`
                            : ""}
                        </span>
                        <span className="font-medium">
                          {missingDates.length > 0 ? "Fehlende Rate" : formatEuroDe(price)}
                        </span>
                      </div>
                    ))}
                    <p className="flex justify-between gap-2 text-sm">
                      <span className="text-muted">
                        Gesamtpreis für {roomPrices.length} Zimmer
                      </span>
                      <span className="font-semibold">
                        {missingDates.length > 0 ? (
                          "—"
                        ) : (
                          <>
                            {formatEuroDe(total)} · Ø{" "}
                            <span className="text-brand-green">
                              {formatEuroDe(avgPerPerson(total, adults, children))}
                            </span>
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                );
              })}
              {offer.makkahHotels.map((h) => {
                const stayStart = inquiryCityStayStarts(inquiry).makkah;
                const nights = inquiry.nights.makkah_nights;
                const missingDates = getOfferHotelMissingRateDates(h, stayStart, nights);
                const hotelName = resolveHotelById(h.hotelId)?.name ?? h.hotelId;
                const { roomPrices, roomOccupancyLabels } = ensurePerRoomBreakdown(
                  roomCount,
                  h.roomPrices,
                  h.roomOccupancyLabels,
                );
                const calculated = getCalculatedRoomPrices(h, roomCount);
                const calculatedTotal = roomsTotal(calculated);
                const total = roomsTotal(roomPrices);
                const overridden = hotelOfferPriceIsOverridden(h, roomCount);
                return (
                  <div key={h.id} className="space-y-1 border-t border-line pt-2">
                    <p className="text-xs font-semibold text-navy">{hotelName}</p>
                    {missingDates.length > 0 ? (
                      <div className="rounded-lg bg-amber-50 px-2 py-1.5 text-[11px] text-amber-950">
                        <p className="font-bold">Fehlende Rate</p>
                        {missingDates.map((d) => (
                          <p key={d}>{formatMissingHotelRateMessage(hotelName, d)}</p>
                        ))}
                      </div>
                    ) : null}
                    {overridden && missingDates.length === 0 ? (
                      <p className="text-[11px] text-muted">
                        Berechnet {formatEuroDe(calculatedTotal)} → Angebot{" "}
                        <span className="font-semibold text-navy">{formatEuroDe(total)}</span>
                      </p>
                    ) : null}
                    {roomPrices.map((price, i) => (
                      <div key={i} className="flex justify-between gap-2 text-xs">
                        <span className="text-muted">
                          Zimmer {i + 1}
                          {roomOccupancyLabels[i] !== "—"
                            ? ` · ${roomOccupancyLabels[i]}`
                            : ""}
                        </span>
                        <span className="font-medium">
                          {missingDates.length > 0 ? "Fehlende Rate" : formatEuroDe(price)}
                        </span>
                      </div>
                    ))}
                    <p className="flex justify-between gap-2 text-sm">
                      <span className="text-muted">
                        Gesamtpreis für {roomPrices.length} Zimmer
                      </span>
                      <span className="font-semibold">
                        {missingDates.length > 0 ? (
                          "—"
                        ) : (
                          <>
                            {formatEuroDe(total)} · Ø{" "}
                            <span className="text-brand-green">
                              {formatEuroDe(avgPerPerson(total, adults, children))}
                            </span>
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                );
              })}
              {addonsVisibleOnPdf(offer.addons).length > 0 ? (
                <div className="space-y-1 border-t border-line pt-2">
                  <p className="text-xs font-semibold text-navy">Zusätzliche Leistungen</p>
                  {addonsVisibleOnPdf(offer.addons).map((a) => (
                      <p key={a.id} className="flex justify-between gap-2 text-xs">
                        <span className="text-muted">
                          {a.title}
                          {a.pdfDisplay === "optional" ? " (optional)" : ""}
                        </span>
                        <span className="font-semibold text-brand-green">
                          {formatAddonPriceLabelDe(a)}
                        </span>
                      </p>
                    ))}
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </div>

      {showPreview ? (
        <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-[#E8ECF0] p-4">
          <IndividualUmrahOfferDocument inquiry={inquiry} offer={offer} />
        </div>
      ) : null}
    </div>
  );
}
