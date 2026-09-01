"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import type { UmrahTrip } from "@/data/mock";
import { getTripCardDateLabel } from "@/lib/trip-inquiry";
import { getTripNightCount } from "@/lib/trip-nights";
import { cn } from "@/lib/utils";

/** Main trip line on offer cards — strongest text in the content column. */
export function TripCardTravelDates({
  trip,
  prominence = "default",
}: {
  trip: UmrahTrip;
  prominence?: "listing" | "default";
}) {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const dates = getTripCardDateLabel(trip, locale);
  const nights = getTripNightCount(trip);
  const isListing = prominence === "listing";

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-[10px] border-b border-[#EEF0F3] bg-white",
        isListing
          ? "px-4 py-3 md:px-[16px] md:py-[14px]"
          : "ps-[22px] pe-[14px] py-[12px] sm:px-[16px]",
      )}
    >
      <p
        className={cn(
          "flex min-w-0 items-center gap-[8px] leading-tight text-[#0A1B3D]",
          isListing
            ? "text-[15px] font-extrabold tracking-[-0.02em] md:text-[16px]"
            : "text-[15px] font-bold tracking-[-0.01em] sm:text-[16px]",
        )}
      >
        <CalendarDays
          className="h-[18px] w-[18px] shrink-0 text-[#0A1B3D] md:h-[20px] md:w-[20px]"
          strokeWidth={2.25}
          aria-hidden
        />
        <span className="min-w-0 break-words">{dates}</span>
      </p>
      {nights > 0 ? (
        <span
          className={cn(
            "shrink-0 whitespace-nowrap text-[#0A1B3D]",
            isListing
              ? "text-[14px] font-extrabold tracking-[-0.01em] md:text-[16px]"
              : "text-[14px] font-bold sm:text-[15px]",
          )}
        >
          {tCommon("nights", { count: nights })}
        </span>
      ) : null}
    </div>
  );
}
