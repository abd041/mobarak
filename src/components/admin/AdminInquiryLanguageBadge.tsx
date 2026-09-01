"use client";

import type { Locale } from "@/i18n/routing";
import {
  CUSTOMER_LANGUAGE_FLAG,
  CUSTOMER_LANGUAGE_LABEL_DE,
} from "@/lib/individual-umrah-inquiry-summary";

/**
 * Prominent Admin badge: Anfragesprache → which PDF language will be generated.
 * UI chrome is German; value comes from inquiry.customer_language.
 */
export function AdminInquiryLanguageBadge({
  language,
  compact = false,
  className = "",
}: {
  language: Locale | string;
  /** Compact chip for tables */
  compact?: boolean;
  className?: string;
}) {
  const code = (language || "de") as Locale;
  const flag = CUSTOMER_LANGUAGE_FLAG[code] ?? "🏳️";
  const label = CUSTOMER_LANGUAGE_LABEL_DE[code] ?? String(language);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 whitespace-nowrap ${className}`}
        title={`Anfragesprache: ${label} — PDF wird auf ${label} erzeugt`}
      >
        <span aria-hidden>{flag}</span>
        <span className="font-semibold text-navy">{label}</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex flex-col gap-0.5 rounded-xl border border-brand-cta/25 bg-[#EEF5FB] px-3.5 py-2.5 ${className}`}
      role="status"
      aria-label={`Anfragesprache: ${label}`}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted">
        Anfragesprache
      </span>
      <span className="inline-flex items-center gap-2 text-[15px] font-bold text-navy">
        <span className="text-[1.15rem] leading-none" aria-hidden>
          {flag}
        </span>
        {label}
      </span>
      <span className="text-[11px] text-muted">
        PDF-Angebot wird auf {label} erzeugt
      </span>
    </div>
  );
}
