"use client";

import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import { cn } from "@/lib/utils";

export function HajjFaqSection({
  content,
  title,
}: {
  content: HajjPageContent["faqs"];
  title?: string;
}) {
  const t = useTranslations("hajj");
  if (!content.length) return null;

  const heading = title ?? t("faqTitle");

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-[#E8EBEF] bg-[#F7F5F1] py-16 md:py-20 lg:py-24"
      aria-labelledby="hajj-faq-heading"
    >
      {/* Soft atmospheric wash */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.85)_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(197,163,90,0.08)_0%,transparent_45%)]"
        aria-hidden
      />

      <Container className="relative">
        <header className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <p className="mb-3 text-[11px] font-bold tracking-[0.16em] text-[#B8860B] uppercase md:text-[12px]">
            {t("faqEyebrow")}
          </p>
          <h2
            id="hajj-faq-heading"
            className="text-[28px] font-bold tracking-[-0.025em] text-[#091B3B] md:text-[34px] lg:text-[38px]"
          >
            {heading}
          </h2>
          <div
            className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[#C5A35A] to-transparent"
            aria-hidden
          />
        </header>

        <div className="mx-auto max-w-3xl space-y-3.5 md:space-y-4">
          {content.map((faq, index) => (
            <details
              key={faq.id}
              id={faq.id}
              className={cn(
                "group relative overflow-hidden rounded-[16px] border border-[#E6E2DA] bg-white/90 backdrop-blur-[2px]",
                "shadow-[0_4px_20px_rgba(9,27,59,0.04)]",
                "transition-[border-color,box-shadow,background-color] duration-300",
                "hover:border-[#D9D3C8] hover:shadow-[0_10px_28px_rgba(9,27,59,0.07)]",
                "open:border-[#C5A35A]/35 open:bg-white open:shadow-[0_12px_32px_rgba(9,27,59,0.08)]",
              )}
              open={index === 0}
            >
              <span
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#C5A35A]/55 to-transparent opacity-0 transition-opacity duration-300 group-open:opacity-100"
                aria-hidden
              />

              <summary
                className={cn(
                  "flex cursor-pointer list-none items-start gap-4 px-5 py-5 sm:items-center sm:gap-5 sm:px-6 sm:py-[1.35rem]",
                  "[&::-webkit-details-marker]:hidden",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold tabular-nums",
                    "bg-[#F7F1E6] text-[#8B6914] ring-1 ring-[#E8D9B8]/80",
                    "transition duration-300 group-open:bg-[#C5A35A] group-open:text-white group-open:ring-[#C5A35A]",
                    "sm:mt-0 sm:h-10 sm:w-10 sm:text-[13px]",
                  )}
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 pt-1 text-[15px] font-bold leading-snug tracking-[-0.015em] text-[#091B3B] sm:pt-0 sm:text-[16px] md:text-[17px]">
                  {faq.question}
                </span>

                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:mt-0 sm:h-10 sm:w-10",
                    "bg-[#FAF8F4] ring-1 ring-[#E8E4DC]",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
                    "transition duration-300 group-open:bg-[#091B3B] group-open:ring-[#091B3B]",
                  )}
                >
                  <ChevronDown
                    className="h-4 w-4 text-[#091B3B] transition-transform duration-300 group-open:rotate-180 group-open:text-white sm:h-[18px] sm:w-[18px]"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </span>
              </summary>

              <div className="border-t border-[#EEEAE3] px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
                <div className="ps-[3.25rem] pt-4 sm:ps-[3.75rem] sm:pt-5 md:ps-16">
                  <p className="text-[14px] leading-[1.75] text-[#4A5563] md:text-[15px] md:leading-[1.8]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
