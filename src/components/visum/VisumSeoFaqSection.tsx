"use client";

import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ReadableParagraphs } from "@/components/visum/VisumReadableParagraphs";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export function VisumSeoFaqSection({
  heading,
  eyebrow,
  subtitle,
  items,
}: {
  heading: string;
  eyebrow: string;
  subtitle: string;
  items: FaqItem[];
}) {
  const t = useTranslations("visum");

  if (items.length === 0) return null;

  return (
    <section
      id="visum-faq"
      aria-labelledby="visum-faq-heading"
      className="relative -mx-2.5 mt-14 overflow-hidden sm:-mx-6 sm:mt-16 md:mt-20 lg:-mx-8"
    >
      {/* Full-bleed premium shell */}
      <div className="relative border-y border-[#dce6f0] bg-white px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,241,250,0.65)_0%,transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(11,44,74,0.04)_0%,transparent_45%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-[#e8f1fa]/60 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -start-12 bottom-0 h-44 w-44 rounded-full bg-brand-cta/5 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-6xl md:max-w-7xl xl:max-w-page">
          {/* Header */}
          <header className="text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#c5d8f0]/90 bg-[#f3f7fb] px-3.5 py-1 text-[10px] font-bold tracking-[0.16em] text-[#1e5a9c] uppercase sm:text-[11px]">
              <MessageCircleQuestion className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
              {eyebrow}
            </p>

            <h3
              id="visum-faq-heading"
              className="visum-display-font text-[1.55rem] font-bold leading-[1.12] tracking-[-0.025em] text-navy sm:text-[1.85rem] md:text-[2.05rem] lg:text-[2.25rem]"
            >
              {heading}
            </h3>

            {subtitle ? (
              <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-navy/72 sm:text-[15px] md:mt-5 md:text-[16px]">
                {subtitle}
              </p>
            ) : null}

            <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c5d8f0]" aria-hidden />
              <span className="rounded-full bg-[#e8f1fa] px-3 py-1 text-[11px] font-bold tabular-nums text-[#1e5a9c] ring-1 ring-[#c5d8f0]/80 sm:text-[12px]">
                {t("seoFaqCount", { count: items.length })}
              </span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c5d8f0]" aria-hidden />
            </div>
          </header>

          {/* Accordion list */}
          <div className="mt-9 space-y-3.5 sm:mt-10 md:mt-12 md:space-y-4">
            {items.map((item, index) => (
              <details
                key={item.id}
                id={item.id}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-[#dce6f0] bg-[#fafbfd]",
                  "shadow-[0_4px_22px_rgba(11,44,74,0.05)]",
                  "transition-[border-color,box-shadow,background-color] duration-300",
                  "hover:border-[#c5d8f0] hover:bg-white hover:shadow-[0_10px_30px_rgba(11,44,74,0.08)]",
                  "open:border-brand-cta/30 open:bg-white open:shadow-[0_14px_40px_rgba(11,44,74,0.10)]",
                )}
                open={index === 0}
              >
                <span
                  className="absolute start-0 top-0 bottom-0 w-1 rounded-full bg-brand-cta opacity-0 transition-opacity duration-300 group-open:opacity-100"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-brand-cta/50 to-transparent opacity-0 transition-opacity duration-300 group-open:opacity-100"
                  aria-hidden
                />

                <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 marker:content-none sm:items-center sm:gap-4 sm:px-5 sm:py-[1.2rem] md:px-6 md:py-5 [&::-webkit-details-marker]:hidden">
                  <span
                    className={cn(
                      "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold tabular-nums sm:mt-0 sm:h-11 sm:w-11 sm:text-[13px]",
                      "bg-white text-[#1e5a9c] ring-1 ring-[#dce6f0]",
                      "shadow-[0_2px_8px_rgba(11,44,74,0.06)]",
                      "transition duration-300 group-open:bg-navy group-open:text-white group-open:ring-navy group-open:shadow-[0_4px_14px_rgba(11,44,74,0.18)]",
                    )}
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1 pt-0.5 text-[14px] font-bold leading-snug tracking-[-0.018em] text-navy sm:pt-0 sm:text-[15px] md:text-[16px] md:leading-snug">
                    {item.question}
                  </span>

                  <span
                    className={cn(
                      "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:mt-0 sm:h-11 sm:w-11",
                      "bg-[#e8f1fa] ring-1 ring-[#c5d8f0] shadow-[0_2px_8px_rgba(11,44,74,0.06)]",
                      "transition duration-300 group-open:bg-navy group-open:ring-navy group-open:shadow-[0_4px_14px_rgba(11,44,74,0.18)]",
                    )}
                  >
                    <ChevronDown
                      className="h-[18px] w-[18px] text-[#1e5a9c] transition-transform duration-300 group-open:rotate-180 group-open:text-white"
                      strokeWidth={2.75}
                      aria-hidden
                    />
                  </span>
                </summary>

                {item.answer ? (
                  <div className="border-t border-[#e8eef5] px-4 pb-5 pt-0 sm:px-5 sm:pb-6 md:px-6">
                    <div className="ms-0 rounded-xl bg-[#f3f7fb]/80 px-4 py-4 sm:ms-[3.25rem] sm:px-5 sm:py-4 md:ms-[3.75rem]">
                      <ReadableParagraphs
                        text={item.answer}
                        className="text-[13px] leading-[1.78] text-navy/82 sm:text-[14px] md:text-[15px] md:leading-[1.85]"
                      />
                    </div>
                  </div>
                ) : null}
              </details>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-10 text-center sm:mt-12">
            <p className="text-[13px] text-navy/65 sm:text-[14px]">{t("seoFaqCtaHint")}</p>
            <Link
              href="#visum-anfrage"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 text-[14px] font-bold text-white shadow-[0_8px_24px_rgba(11,44,74,0.18)] transition hover:bg-navy-deep hover:shadow-[0_10px_28px_rgba(11,44,74,0.22)] sm:mt-4 sm:px-7 sm:py-3.5 sm:text-[15px]"
            >
              {t("seoFaqCta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
