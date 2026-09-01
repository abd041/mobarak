"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminInquiryLanguageBadge } from "@/components/admin/AdminInquiryLanguageBadge";
import type { IndividualUmrahInquiry } from "@/lib/individual-umrah-inquiry";
import { formatIndividualUmrahInquirySummary } from "@/lib/individual-umrah-inquiry-summary";
import {
  getIndividualUmrahInquiries,
  INDIVIDUAL_UMRAH_INQUIRIES_EVENT,
  INDIVIDUAL_UMRAH_STATUS_LABELS,
} from "@/lib/individual-umrah-inquiries-store";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("de-AT", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function AdminIndividualUmrahInquiriesPage() {
  const [rows, setRows] = useState<IndividualUmrahInquiry[]>([]);

  useEffect(() => {
    const sync = () => setRows(getIndividualUmrahInquiries());
    sync();
    window.addEventListener(INDIVIDUAL_UMRAH_INQUIRIES_EVENT, sync);
    return () => window.removeEventListener(INDIVIDUAL_UMRAH_INQUIRIES_EVENT, sync);
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Individuelle Umrah — Anfragen</h1>
          <p className="mt-1 text-sm text-muted">
            Jede Kundenanfrage erscheint hier als Datensatz. Details zeigen alle erfassten Angaben.
          </p>
        </div>
        <Link
          href="/admin/individual-umrah"
          className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:border-brand-orange/40"
        >
          ← CMS Einstellungen
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 text-start">Anfrage #</th>
              <th className="px-4 py-3 text-start">Eingegangen</th>
              <th className="px-4 py-3 text-start">Kunde</th>
              <th className="px-4 py-3 text-start">Telefon</th>
              <th className="px-4 py-3 text-start">E-Mail</th>
              <th className="px-4 py-3 text-start">Anfragesprache</th>
              <th className="px-4 py-3 text-start">Route</th>
              <th className="px-4 py-3 text-start">Abflug</th>
              <th className="px-4 py-3 text-start">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-muted">
                  Keine Anfragen vorhanden.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const s = formatIndividualUmrahInquirySummary(r, { adminLocale: "de" });
                return (
                  <tr key={r.inquiry_id} className="border-t border-line">
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">{s.display_number}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{s.customer.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{s.customer.phone}</td>
                    <td className="px-4 py-3">{s.customer.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <AdminInquiryLanguageBadge
                        language={s.customer_language}
                        compact
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{s.route}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{s.preferred_departure}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-navy">
                        {INDIVIDUAL_UMRAH_STATUS_LABELS[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Link
                        href={`/admin/inquiries/individual-umrah/${r.inquiry_id}`}
                        className="font-semibold text-brand-cta"
                      >
                        Öffnen
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
