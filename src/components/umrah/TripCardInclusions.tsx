"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { IQ } from "@/lib/images";
import {
  getTripCardInclusionRows,
  type TripCardInclusionItem,
} from "@/lib/trip-card-inclusions";
import { cn } from "@/lib/utils";

function InclusionItem({
  item,
  label,
  compact,
}: {
  item: TripCardInclusionItem;
  label: string;
  compact: boolean;
}) {
  return (
    <li className="flex min-w-0 items-start gap-1">
      <div
        className={cn(
          "relative mt-px shrink-0",
          compact ? "h-3.5 w-3.5 md:h-4 md:w-4" : "h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem]",
        )}
      >
        <Image
          src={item.icon}
          alt=""
          fill
          className="object-contain"
          sizes="18px"
          quality={IQ.thumb}
        />
      </div>
      <span
        className={cn(
          "min-w-0 font-semibold leading-[1.3] text-[#1A1A1A]",
          compact ? "text-[10px] md:text-[10px] lg:text-[11px]" : "text-[9px] sm:text-[10px] lg:text-[11px]",
        )}
      >
        {label}
      </span>
    </li>
  );
}

/** Included services — two compact rows; every enabled service is shown (never merged away). */
export function TripCardInclusions({
  trip,
  prominence = "default",
}: {
  trip: UmrahTrip;
  prominence?: "listing" | "default";
}) {
  const t = useTranslations("umrah");
  const { row1, row2 } = getTripCardInclusionRows(trip);
  const isListing = prominence === "listing";

  if (row1.length === 0 && row2.length === 0) return null;

  const rows = [row1, row2].filter((row) => row.length > 0);

  return (
    <div
      className={cn(
        "border-b border-[#EEF0F3] bg-white",
        isListing ? "px-3 py-3 md:px-4 md:py-3.5" : "px-3.5 py-3 sm:px-4 sm:py-3.5",
      )}
    >
      <div className={cn("flex flex-col", isListing ? "gap-2 md:gap-2.5" : "gap-2.5")}>
        {rows.map((row, rowIndex) => (
          <ul
            key={rowIndex}
            className={cn(
              "grid gap-x-2 gap-y-1.5",
              rowIndex === 0
                ? isListing
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                : isListing
                  ? "grid-cols-2 sm:grid-cols-4"
                  : "grid-cols-2 lg:grid-cols-4",
            )}
          >
            {row.map((item) => (
              <InclusionItem
                key={item.id}
                item={item}
                label={t(item.labelKey)}
                compact={isListing}
              />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
