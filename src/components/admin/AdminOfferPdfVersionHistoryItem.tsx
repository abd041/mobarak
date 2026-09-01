"use client";

import type { IndividualUmrahInquiry } from "@/lib/individual-umrah-inquiry";
import type { IndividualUmrahOfferPdfSnapshot } from "@/lib/individual-umrah-offer";
import {
  formatOfferPdfVersionLanguageLabelDe,
  formatOfferPdfVersionParts,
  resolveOfferPdfSnapshotLanguage,
} from "@/lib/individual-umrah-offers-store";

/**
 * Spec 17 — Admin PDF version history row (German UI):
 * Angebot V1
 * 25.08.2026 – 15:42
 * Sprache: Arabisch
 */
export function AdminOfferPdfVersionHistoryItem({
  snap,
  inquiry,
  action,
}: {
  snap: IndividualUmrahOfferPdfSnapshot;
  inquiry?: IndividualUmrahInquiry | null;
  action?: React.ReactNode;
}) {
  const parts = formatOfferPdfVersionParts(snap.version, snap.generatedAt);
  const lang = resolveOfferPdfSnapshotLanguage(snap, inquiry);
  const langLabel = formatOfferPdfVersionLanguageLabelDe(lang);

  return (
    <li className="flex flex-wrap items-start justify-between gap-3 border-t border-line pt-3 text-sm first:border-t-0 first:pt-0">
      <div className="min-w-0">
        <p className="font-bold text-navy">{parts.title}</p>
        <p className="mt-0.5 text-[13px] text-muted">{parts.datetime}</p>
        <p className="mt-1 text-[13px] font-semibold text-navy">
          Sprache: <span className="text-brand-cta">{langLabel}</span>
        </p>
        {snap.offerNumber ? (
          <p className="mt-0.5 font-mono text-[11px] text-muted">{snap.offerNumber}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </li>
  );
}
