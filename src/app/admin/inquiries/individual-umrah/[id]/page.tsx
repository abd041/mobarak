"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import { AdminInquiryLanguageBadge } from "@/components/admin/AdminInquiryLanguageBadge";
import {
  INDIVIDUAL_UMRAH_INQUIRY_STATUSES,
  type IndividualUmrahInquiry,
  type IndividualUmrahInquiryStatus,
} from "@/lib/individual-umrah-inquiry";
import { formatIndividualUmrahInquirySummary } from "@/lib/individual-umrah-inquiry-summary";
import {
  getIndividualUmrahInquiry,
  INDIVIDUAL_UMRAH_INQUIRIES_EVENT,
  INDIVIDUAL_UMRAH_STATUS_LABELS,
  updateIndividualUmrahInquiryStatus,
} from "@/lib/individual-umrah-inquiries-store";
import {
  getOfferPdfHistory,
  INDIVIDUAL_UMRAH_OFFERS_EVENT,
} from "@/lib/individual-umrah-offers-store";
import type { IndividualUmrahOfferPdfSnapshot } from "@/lib/individual-umrah-offer";
import { AdminOfferPdfVersionHistoryItem } from "@/components/admin/AdminOfferPdfVersionHistoryItem";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-[13px] font-semibold text-navy/70 sm:pt-0.5">{label}</dt>
      <dd className="text-[15px] leading-relaxed text-navy">{children}</dd>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <h2 className="mb-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-navy/55">
        {title}
      </h2>
      <dl className="space-y-3">{children}</dl>
    </section>
  );
}

export default function AdminIndividualUmrahInquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [inquiry, setInquiry] = useState<IndividualUmrahInquiry | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pdfHistory, setPdfHistory] = useState<IndividualUmrahOfferPdfSnapshot[]>([]);

  useEffect(() => {
    const sync = () => {
      setInquiry(getIndividualUmrahInquiry(id));
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

  const summary = useMemo(
    () => (inquiry ? formatIndividualUmrahInquirySummary(inquiry, { adminLocale: "de" }) : null),
    [inquiry],
  );

  if (!inquiry || !summary) {
    return (
      <div>
        <Link href="/admin/inquiries/individual-umrah" className="text-sm text-brand-cta">
          ← Zurück
        </Link>
        <p className="mt-6 text-muted">Anfrage nicht gefunden.</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/inquiries/individual-umrah" className="text-sm text-brand-cta">
        ← Zurück zur Liste
      </Link>

      <div className="mt-4 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-cta">{summary.display_number}</p>
          <h1 className="mt-1 text-2xl font-bold text-navy md:text-[1.75rem]">
            <span dir="auto">{summary.customer.name}</span>
          </h1>
          <p className="mt-1 text-sm text-muted">Eingegangen {summary.created_at_label}</p>
          <div className="mt-3">
            <AdminInquiryLanguageBadge language={summary.customer_language} />
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <Link
            href={`/admin/inquiries/individual-umrah/${inquiry.inquiry_id}/offer`}
            className="inline-flex items-center justify-center rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white"
          >
            Angebot erstellen
          </Link>
          <p className="max-w-[14rem] text-end text-[11px] text-muted">
            Wünsche → Flüge → Hotels → Zusatzleistungen → PDF Vorschau → erzeugen →
            herunterladen → manuell senden
          </p>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Angebotsstatus</span>
            <select
              className="min-w-[14rem] rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold"
              value={inquiry.status}
              onChange={(e) => {
                const status = e.target.value as IndividualUmrahInquiryStatus;
                updateIndividualUmrahInquiryStatus(inquiry.inquiry_id, status);
                setToast(`Status: ${INDIVIDUAL_UMRAH_STATUS_LABELS[status]}`);
              }}
            >
              {INDIVIDUAL_UMRAH_INQUIRY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {INDIVIDUAL_UMRAH_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
          {toast ? <p className="text-xs text-brand-green">{toast}</p> : null}
        </div>
      </div>

      <aside
        className="mb-6 rounded-2xl border-2 border-brand-cta/25 bg-[#EEF5FB] p-5 shadow-sm md:p-6"
        aria-labelledby="iu-priorities-heading"
      >
        <h2
          id="iu-priorities-heading"
          className="text-[15px] font-bold tracking-[-0.01em] text-navy md:text-[16px]"
        >
          Was dem Kunden wichtig ist
        </h2>
        {summary.travel_priorities.length > 0 ? (
          <ul className="mt-3.5 flex flex-wrap gap-2">
            {summary.travel_priorities.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-brand-cta/20 bg-white px-3.5 py-2 text-[13px] font-semibold text-navy shadow-sm md:text-[14px]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-cta text-white">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2.5 text-[14px] text-muted">Nicht angegeben</p>
        )}
      </aside>

      {pdfHistory.length > 0 ? (
        <section className="mb-6 rounded-2xl border border-line bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-[15px] font-bold text-navy">PDF-Versionshistorie</h2>
          <p className="mt-1 text-xs text-muted">
            Jedes erzeugte PDF behält Version und Sprache (z. B. Angebot V1 · Arabisch). Neu
            erzeugen überschreibt die alte Kopie nicht.
          </p>
          <ul className="mt-3 space-y-0">
            {pdfHistory.map((snap) => (
              <AdminOfferPdfVersionHistoryItem
                key={snap.snapshotId}
                snap={snap}
                inquiry={inquiry}
                action={
                  <a
                    href={`/admin/inquiries/individual-umrah/${inquiry.inquiry_id}/offer/print?v=${snap.snapshotId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-brand-cta"
                  >
                    PDF herunterladen
                  </a>
                }
              />
            ))}
          </ul>
        </section>
      ) : null}

      <article className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-6">
          <Section title="Anfrage">
            <Field label="Anfragenummer">{summary.inquiry_number}</Field>
            <Field label="Anzeige-Nr.">{summary.display_number}</Field>
            <Field label="Angebotsstatus">
              {INDIVIDUAL_UMRAH_STATUS_LABELS[inquiry.status]}
            </Field>
            <Field label="Anfragesprache">
              <AdminInquiryLanguageBadge language={summary.customer_language} compact />
              <span className="mt-1 block text-xs font-normal text-muted">
                Dauerhaft gespeichert bei Absenden. Bestimmt die Sprache des Kunden-PDFs.
              </span>
            </Field>
          </Section>

          <Section title="Kunde">
            <Field label="Name">
              <span dir="auto">{summary.customer.name}</span>
            </Field>
            <Field label="Telefon">{summary.customer.phone}</Field>
            <Field label="E-Mail">{summary.customer.email}</Field>
            <Field label="Bevorzugte Sprache (Kontakt)">
              {summary.customer.preferred_language}
            </Field>
            <Field label="Wie hat uns der Kunde gefunden?">
              {summary.marketing_source}
              {summary.marketing_source_detail ? (
                <span className="text-muted">
                  {" "}
                  —{" "}
                  <span dir="auto">{summary.marketing_source_detail}</span>
                </span>
              ) : null}
            </Field>
            <p className="text-xs text-muted">
              Freitext vom Kunden bleibt in der Originalsprache (z.&nbsp;B. Arabisch). Die
              Feldbezeichnungen und strukturierten Werte sind immer Deutsch.
            </p>
          </Section>

          <Section title="Reisende">
            <Field label="Abflughafen">{summary.departure_airports}</Field>
            <Field label="Erwachsene">{summary.travellers.adults_line}</Field>
            <Field label="Kinder">{summary.travellers.children_line}</Field>
            <Field label="Säuglinge">{summary.travellers.infants_line}</Field>
            <Field label="Kinderbett / Zustellbett">{summary.child_bed_summary}</Field>
            <Field label="Anzahl Zimmer">{summary.rooms}</Field>
          </Section>

          <Section title="Reiseverlauf">
            <Field label="Route">{summary.route}</Field>
            <Field label="Städtereihenfolge">{summary.order ?? "— (nur Makkah)"}</Field>
            <Field label="Nächte Medina">{summary.medina_nights}</Field>
            <Field label="Nächte Makkah">{summary.makkah_nights}</Field>
          </Section>

          <Section title="Termine">
            <Field label="Wunsch-Abflugdatum">{summary.preferred_departure}</Field>
            <Field label="Flexibilität">{summary.flexibility}</Field>
          </Section>

          <Section title="Wünsche">
            <Field label="Bevorzugte Airline">{summary.preferred_airline}</Field>
            <Field label="Gewünschte Zusatzleistungen">
              {summary.addons.length > 0 ? (
                <ul className="space-y-1">
                  {summary.addons.map((addon) => (
                    <li key={addon} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-green"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      <span>{addon}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </Field>
            <Field label="Was dem Kunden wichtig ist">
              {summary.travel_priorities.length > 0 ? (
                <ul className="space-y-1">
                  {summary.travel_priorities.map((priority) => (
                    <li key={priority} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-cta"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      <span>{priority}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </Field>
          </Section>
        </div>
      </article>
    </div>
  );
}
