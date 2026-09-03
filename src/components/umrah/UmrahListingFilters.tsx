"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import {
  PERIOD_FILTER_KEYS,
  PERIOD_FILTER_LABEL_KEYS,
  type PeriodFilterKey,
} from "@/lib/listing-period-filters";
import { useTouchAxisScroll } from "@/hooks/useTouchAxisScroll";
import { cn } from "@/lib/utils";

/** Reference: active = subtle orange fill + orange border + navy text. */
const ACTIVE_FILTER_CLASS =
  "border-[#E8890C] bg-[#FFF1E0] text-[#051033]";

const INACTIVE_FILTER_CLASS =
  "border-[#D7DEE8] bg-white text-[#051033] hover:border-[#C5CEDA]";

export function UmrahListingFilters({
  filter,
  onFilterChange,
}: {
  filter: PeriodFilterKey;
  onFilterChange: (key: PeriodFilterKey) => void;
}) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
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

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(160, Math.round(el.clientWidth * 0.55));
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }, []);

  return (
    <section
      className="relative z-20 overflow-hidden border-b border-[#EEF0F3] bg-white"
      aria-label={t("filterSectionLabel")}
    >
      <Container className="py-2.5 sm:py-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            className="absolute start-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#051033] shadow-sm md:hidden"
            aria-label={tCommon("previous")}
          >
            <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            className="absolute end-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#051033] shadow-sm md:hidden"
            aria-label={tCommon("next")}
          >
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
          </button>

          <div
            ref={scrollerRef}
            data-scroll-region="filters"
            className="axis-horizontal-scroll no-scrollbar -mx-4 flex flex-nowrap items-center gap-1.5 overflow-x-auto scroll-ps-4 px-4 [-webkit-overflow-scrolling:touch] max-md:snap-x max-md:snap-mandatory max-md:px-10 md:mx-0 md:gap-2 md:overflow-x-auto md:px-0 md:scroll-ps-0"
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
                    "relative z-0 shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap transition min-h-8 max-md:snap-start sm:px-3.5 sm:text-[13px] md:px-3 md:py-1.5 md:text-[12.5px] lg:px-3.5 lg:text-[13px]",
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
