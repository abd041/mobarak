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
  "border-brand-orange-cta bg-brand-orange-soft text-brand-orange-ink";

const INACTIVE_FILTER_CLASS =
  "border-[#E6E8EC] bg-white text-navy hover:border-[#d5d9df]";

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
    <section className="overflow-hidden bg-white" aria-label={t("filterSectionLabel")}>
      <Container className="py-3.5 sm:py-4">
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-y-0 start-0 z-10 w-6 bg-gradient-to-r from-white to-transparent sm:w-8"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 end-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-10"
            aria-hidden
          />

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
                    "shrink-0 snap-start rounded-full border px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap transition min-h-11 sm:px-[1.125rem] sm:py-2.5 sm:text-[14px]",
                    active ? ACTIVE_FILTER_CLASS : INACTIVE_FILTER_CLASS,
                  )}
                >
                  {t(PERIOD_FILTER_LABEL_KEYS[key])}
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
