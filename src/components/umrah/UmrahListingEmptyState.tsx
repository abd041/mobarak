"use client";

import { useTranslations } from "next-intl";
import { CalendarX } from "lucide-react";
import {
  PERIOD_FILTER_LABEL_KEYS,
  type PeriodFilterKey,
} from "@/lib/listing-period-filters";

export function UmrahListingEmptyState({
  filter,
  onShowAllDates,
}: {
  filter: PeriodFilterKey;
  onShowAllDates: () => void;
}) {
  const t = useTranslations("umrah");

  const message =
    filter === "all"
      ? t("emptyFilter")
      : t("emptyFilterForPeriod", {
          period: t(PERIOD_FILTER_LABEL_KEYS[filter]),
        });

  return (
    <div
      className="rounded-2xl border border-line bg-white px-6 py-12 text-center shadow-[0_4px_18px_rgba(9,30,66,0.04)] sm:px-10 sm:py-14"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surface text-[#5B6B7C]">
        <CalendarX className="h-7 w-7" strokeWidth={1.5} aria-hidden />
      </div>
      <p className="mx-auto max-w-md text-[16px] font-semibold leading-snug text-navy sm:text-[17px]">
        {message}
      </p>
      {filter !== "all" ? (
        <button
          type="button"
          onClick={onShowAllDates}
          className="mt-6 text-[15px] font-semibold text-brand-cta underline-offset-2 hover:underline"
        >
          {t("otherDates")}
        </button>
      ) : null}
    </div>
  );
}
