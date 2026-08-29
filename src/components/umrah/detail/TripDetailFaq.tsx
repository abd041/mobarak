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
      <div className="trip-section-heading">
        <h2 className="shrink-0 text-xl font-bold text-navy sm:text-2xl">{t("sectionFaq")}</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={faq.question}
            className="mobarak-card group overflow-hidden"
            open={i === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-bold sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
              <span className="text-navy">{faq.question}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-brand-cta transition group-open:rotate-180",
                )}
                aria-hidden
              />
            </summary>
            <div className="border-t border-line px-5 pb-5 pt-3 text-[14px] leading-relaxed text-muted sm:px-6 sm:pb-6">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
