"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { cn } from "@/lib/utils";

export function TripDetailFaq({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const faqs = trip.faqs ?? [];

  if (!faqs.length) return null;

  return (
    <section id="faq" className="trip-section scroll-mt-24">
      <div className="mb-5 flex items-center gap-4 sm:mb-6">
        <span className="hidden h-px flex-1 bg-[#E4EAF2] sm:block" aria-hidden />
        <h2 className="shrink-0 text-[18px] font-bold tracking-[-0.01em] text-[#051033] sm:text-[22px]">
          {t("sectionFaq")}
        </h2>
        <span className="hidden h-px flex-1 bg-[#E4EAF2] sm:block" aria-hidden />
      </div>

      <div className="space-y-3.5 sm:space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={faq.question}
            className={cn(
              "group relative overflow-hidden rounded-[16px] border border-[#E4EAF2] bg-white",
              "shadow-[0_4px_18px_rgba(9,36,92,0.05)]",
              "transition-[background-color,box-shadow,border-color] duration-200",
              "hover:border-[#D5DEEA] hover:shadow-[0_8px_24px_rgba(9,36,92,0.08)]",
              "open:border-[#D5DEEA] open:bg-[#F7F9FC] open:shadow-[0_8px_24px_rgba(9,36,92,0.08)]",
            )}
            open={i === 0}
          >
            <span
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C5A35A]/40 to-transparent opacity-0 transition-opacity duration-200 group-open:opacity-100"
              aria-hidden
            />

            <summary
              className={cn(
                "flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:gap-5 sm:px-6 sm:py-5",
                "[&::-webkit-details-marker]:hidden",
              )}
            >
              <span className="text-[14px] font-bold leading-snug tracking-[-0.01em] text-[#051033] sm:text-[15px]">
                {faq.question}
              </span>

              <span
                className={cn(
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  "bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.98),rgba(232,240,252,0.92)_45%,rgba(210,224,245,0.78)_100%)]",
                  "shadow-[0_2px_10px_rgba(9,36,92,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]",
                  "ring-1 ring-[#C5A35A]/25 transition duration-200",
                  "group-open:ring-[#C5A35A]/40",
                )}
              >
                <ChevronDown
                  className="h-4 w-4 text-[#09245C] transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
            </summary>

            <div className="border-t border-[#E4EAF2] px-5 pb-5 pt-3.5 sm:px-6 sm:pb-6 sm:pt-4">
              <p className="text-[13px] leading-[1.7] text-[#3D4F5F] sm:text-[14px]">{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
