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
    <div className={cn("flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-2", className)}>
      <label
        htmlFor="umrah-listing-sort"
        className="shrink-0 text-[13px] font-medium text-navy sm:text-[14px]"
      >
        {t("sortBy")}
      </label>
      <select
        id="umrah-listing-sort"
        className="min-h-11 w-full min-w-0 rounded-lg border border-line bg-white px-2.5 py-2 text-[13px] font-semibold text-navy sm:max-w-[12.5rem] sm:px-3 sm:text-[14px]"
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
