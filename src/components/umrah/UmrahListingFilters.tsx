"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import {
  PERIOD_FILTER_KEYS,
  PERIOD_FILTER_LABEL_KEYS,
  type PeriodFilterKey,
} from "@/lib/listing-period-filters";
import { useTouchAxisScroll } from "@/hooks/useTouchAxisScroll";
import { cn } from "@/lib/utils";

const ACTIVE_FILTER_CLASS =
  "border-[#E8890C] bg-white text-[#E8890C] md:border-[#F0D4A8] md:bg-[#FBEED9] md:text-[#C4780A]";

const INACTIVE_FILTER_CLASS =
  "border-[#E5E7EB] bg-white text-[#051033] hover:border-[#D5D9DF]";

export function UmrahListingFilters({
  filter,
  onFilterChange,
}: {
  filter: PeriodFilterKey;
  onFilterChange: (key: PeriodFilterKey) => void;
}) {
  const t = useTranslations("umrah");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Partial<Record<PeriodFilterKey, HTMLButtonElement | null>>>({});
  const isFirstRender = useRef(true);

  useTouchAxisScroll(scrollerRef);

  /** Keep the active chip visible after the customer changes filter. */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const btn = buttonRefs.current[filter];
    if (!btn) return;
    btn.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [filter]);

  return (
    <section
      className="relative z-20 overflow-hidden border-b border-[#EEF0F3] bg-white"
      aria-label={t("filterSectionLabel")}
    >
      <Container className="py-3 sm:py-3.5">
        <div
          ref={scrollerRef}
          data-scroll-region="filters"
          className="axis-horizontal-scroll no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-ps-4 px-4 [-webkit-overflow-scrolling:touch]"
          role="group"
          aria-label={t("filterSectionLabel")}
        >
          {PERIOD_FILTER_KEYS.map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                ref={(el) => {
                  buttonRefs.current[key] = el;
                }}
                type="button"
                onClick={() => onFilterChange(key)}
                aria-pressed={active}
                className={cn(
                  "relative z-0 shrink-0 snap-start rounded-full border px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition min-h-10 sm:px-4 sm:py-2.5 sm:text-[14px]",
                  active ? ACTIVE_FILTER_CLASS : INACTIVE_FILTER_CLASS,
                )}
              >
                {t(PERIOD_FILTER_LABEL_KEYS[key])}
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
