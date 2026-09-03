"use client";

import { useTranslations } from "next-intl";
import {
  TRIP_LISTING_SORT_KEYS,
  type TripListingSortKey,
} from "@/lib/trip-listing-sort";
import { cn } from "@/lib/utils";

const SORT_LABEL_KEYS: Record<TripListingSortKey, string> = {
  next: "sortNext",
  priceAsc: "sortPriceAsc",
  priceDesc: "sortPriceDesc",
  seats: "sortSeats",
};

export function UmrahListingSort({
  sort,
  onSortChange,
  className,
}: {
  sort: TripListingSortKey;
  onSortChange: (sort: TripListingSortKey) => void;
  className?: string;
}) {
  const t = useTranslations("umrah");

  return (
    <div className={cn("flex min-w-0 shrink-0 items-center justify-end gap-1.5 sm:gap-2", className)}>
      <label
        htmlFor="umrah-listing-sort"
        className="hidden shrink-0 text-[12px] font-medium text-navy sm:inline sm:text-[13px]"
      >
        {t("sortBy")}
      </label>
      <select
        id="umrah-listing-sort"
        aria-label={t("sortBy")}
        className="min-h-8 max-w-[10.5rem] min-w-0 rounded-md border border-line bg-white px-2 py-1 text-[12px] font-semibold text-navy sm:min-h-9 sm:max-w-[12rem] sm:px-2.5 sm:py-1.5 sm:text-[13px]"
        value={sort}
        onChange={(e) => onSortChange(e.target.value as TripListingSortKey)}
      >
        {TRIP_LISTING_SORT_KEYS.map((key) => (
          <option key={key} value={key}>
            {t(SORT_LABEL_KEYS[key])}
          </option>
        ))}
      </select>
    </div>
  );
}
