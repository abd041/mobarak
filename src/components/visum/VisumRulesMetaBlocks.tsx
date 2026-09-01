import {
  AlertTriangle,
  BookUser,
  Camera,
  ClipboardList,
  FileText,
  Globe2,
  Info,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { pickLocalized } from "@/data/visum-cms";
import type { VisumRulesConfig } from "@/data/visum-rules";
import { cn } from "@/lib/utils";

const DOC_ICONS: Record<string, LucideIcon> = {
  "doc-passport": BookUser,
  "doc-photo": Camera,
  "doc-form": ClipboardList,
};

/**
 * Rules-driven eligibility / documents / notices (§38).
 * Rendered in the SEO block (§39) — not between visa cards and the enquiry form.
 */
export async function VisumRulesMetaBlocks({
  rules,
  locale,
}: {
  rules: VisumRulesConfig;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "visum" });

  const docs = rules.requiredDocuments
    .map((d) => ({
      id: d.id,
      required: d.required,
      label: pickLocalized(d.label, locale),
    }))
    .filter((d) => d.label);
  const notices = rules.notices
    .map((n) => ({
      id: n.id,
      severity: n.severity,
      text: pickLocalized(n.text, locale),
    }))
    .filter((n) => n.text);
  const eligibility = pickLocalized(rules.eligibleNationalitiesSummary, locale);
  const nations = rules.eligibleNationalities.filter(Boolean);
  const documentsHeading =
    pickLocalized(rules.documentsHeading, locale) || t("docsHeadingFallback");
  const eligibilityHeading =
    pickLocalized(rules.eligibilityHeading, locale) || t("eligibilityHeadingFallback");

  if (!docs.length && !notices.length && !eligibility && !nations.length) return null;

  return (
    <div className="space-y-5 sm:space-y-6">
      {eligibility || nations.length > 0 ? (
        <section
          aria-labelledby="visum-eligibility-heading"
          className="relative overflow-hidden rounded-2xl border border-[#dce6f0] bg-gradient-to-br from-white via-[#f7faff] to-[#eef4fb] p-5 shadow-[0_8px_28px_rgba(11,44,74,0.05)] sm:p-6"
        >
          <div
            className="pointer-events-none absolute -end-10 -top-12 h-36 w-36 rounded-full bg-[#dceaf8]/55 blur-2xl"
            aria-hidden
          />
          <div className="relative flex items-start gap-3.5 sm:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f1fa] text-[#1e5a9c] ring-1 ring-[#c5d8f0]/90 shadow-[0_2px_10px_rgba(11,44,74,0.06)] sm:h-12 sm:w-12">
              <Globe2 className="h-5 w-5" strokeWidth={2} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h4
                id="visum-eligibility-heading"
                className="text-[15px] font-bold tracking-[-0.01em] text-navy sm:text-[16px]"
              >
                {eligibilityHeading}
              </h4>
              {eligibility ? (
                <p className="mt-2 text-[13px] leading-[1.7] text-navy/80 sm:text-[14px] sm:leading-[1.75]">
                  {eligibility}
                </p>
              ) : null}
              {nations.length > 0 ? (
                <ul className="mt-3.5 flex flex-wrap gap-2">
                  {nations.map((nation) => (
                    <li
                      key={nation}
                      className="rounded-full border border-[#dce6f0] bg-white/90 px-3 py-1 text-[12px] font-semibold text-navy/80 shadow-[0_1px_4px_rgba(11,44,74,0.04)]"
                    >
                      {nation}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {docs.length > 0 ? (
        <section
          aria-labelledby="visum-documents-heading"
          className="relative overflow-hidden rounded-2xl border border-[#dce6f0] bg-white shadow-[0_10px_36px_rgba(11,44,74,0.06)]"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(232,241,250,0.9)_0%,transparent_70%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -end-8 top-8 h-28 w-28 rounded-full bg-brand-cta/5 blur-2xl"
            aria-hidden
          />

          <header className="relative flex flex-wrap items-center justify-between gap-3 border-b border-[#e8eef5] px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white shadow-[0_6px_18px_rgba(11,44,74,0.18)] sm:h-12 sm:w-12">
                <FileText className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0">
                <h4
                  id="visum-documents-heading"
                  className="text-[15px] font-bold tracking-[-0.015em] text-navy sm:text-[17px]"
                >
                  {documentsHeading}
                </h4>
                <p className="mt-0.5 text-[12px] text-navy/60 sm:text-[13px]">
                  {t("docsSubtitle")}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-[#e8f1fa] px-3 py-1 text-[11px] font-bold tabular-nums text-[#1e5a9c] ring-1 ring-[#c5d8f0]/90 sm:text-[12px]">
              {t("docsCount", { count: docs.length })}
            </span>
          </header>

          <ul className="relative grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-3.5 sm:p-5 md:grid-cols-3 md:gap-4 md:p-6">
            {docs.map((doc, index) => {
              const Icon = DOC_ICONS[doc.id] ?? FileText;
              return (
                <li
                  key={doc.id}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-2xl border border-[#e2eaf4] bg-gradient-to-br from-[#f7faff] to-white p-4",
                    "shadow-[0_2px_12px_rgba(11,44,74,0.04)] transition duration-300",
                    "hover:border-[#c5d8f0] hover:bg-white hover:shadow-[0_10px_28px_rgba(11,44,74,0.08)]",
                    "sm:min-h-[9.5rem] sm:p-5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl",
                        "bg-white text-[#1e5a9c] ring-1 ring-[#dce6f0]",
                        "shadow-[0_2px_8px_rgba(11,44,74,0.05)]",
                        "transition duration-300 group-hover:bg-[#e8f1fa] group-hover:ring-[#c5d8f0]",
                      )}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="text-[11px] font-bold tabular-nums text-navy/35 sm:text-[12px]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-3.5 flex-1 text-[14px] font-bold leading-snug tracking-[-0.01em] text-navy sm:mt-4 sm:text-[15px]">
                    {doc.label}
                  </p>

                  <span
                    className={cn(
                      "mt-3 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.04em] uppercase sm:text-[11px]",
                      doc.required
                        ? "bg-navy/5 text-navy ring-1 ring-navy/10"
                        : "bg-[#eef6ff] text-[#1e5a9c] ring-1 ring-[#c5d8f0]/80",
                    )}
                  >
                    {doc.required ? t("docsRequiredBadge") : t("docsOptionalBadge")}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {notices.length > 0 ? (
        <div className="space-y-3 sm:space-y-3.5">
          {notices.map((n) => (
            <aside
              key={n.id}
              role="note"
              className={cn(
                "flex gap-3.5 rounded-2xl border px-4 py-4 text-[13px] leading-[1.7] sm:gap-4 sm:px-5 sm:py-5 sm:text-[14px]",
                n.severity === "warning"
                  ? "border-amber-200/90 bg-gradient-to-br from-amber-50 via-amber-50/70 to-white text-navy/90 shadow-[0_4px_18px_rgba(180,120,20,0.06)]"
                  : "border-[#dce6f0] bg-gradient-to-br from-[#f7faff] to-white text-navy/85 shadow-[0_4px_16px_rgba(11,44,74,0.04)]",
              )}
            >
              {n.severity === "warning" ? (
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100/90 text-amber-800 ring-1 ring-amber-200/80 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
                </span>
              ) : (
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f1fa] text-[#1e5a9c] ring-1 ring-[#c5d8f0]/90 sm:h-10 sm:w-10">
                  <Info className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
                </span>
              )}
              <span className="min-w-0 pt-0.5">{n.text}</span>
            </aside>
          ))}
        </div>
      ) : null}
    </div>
  );
}
