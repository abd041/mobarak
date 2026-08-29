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
        "flex gap-2 border-b border-[#EEF0F3] bg-white",
        isListing
          ? "flex-col items-start gap-1 px-3 py-3 sm:flex-row sm:items-center sm:justify-between md:px-4 md:py-4"
          : "items-center justify-between px-3.5 py-3 sm:px-4 sm:py-3.5",
      )}
    >
      <p
        className={cn(
          "flex min-w-0 items-center gap-1.5 leading-tight text-[#0A1B3D]",
          isListing
            ? "text-[15px] font-extrabold tracking-[-0.02em] sm:text-[16px] md:gap-2 md:text-[17px] lg:text-[18px]"
            : "text-[15px] font-bold tracking-[-0.01em] sm:text-[16px]",
        )}
      >
        <CalendarDays
          className={cn(
            "shrink-0 text-[#0A1B3D]",
            isListing
              ? "h-4 w-4 md:h-[1.15rem] md:w-[1.15rem] lg:h-5 lg:w-5"
              : "h-4 w-4 sm:h-[1.05rem] sm:w-[1.05rem]",
          )}
          strokeWidth={2.25}
          aria-hidden
        />
        <span className="min-w-0 break-words">{dates}</span>
      </p>
      {nights > 0 ? (
        <span
          className={cn(
            "text-[#0A1B3D] sm:shrink-0",
            isListing
              ? "text-[13px] font-extrabold tracking-[-0.01em] sm:whitespace-nowrap md:text-[16px] lg:text-[17px]"
              : "shrink-0 text-[14px] font-bold sm:text-[15px]",
          )}
        >
          {tCommon("nights", { count: nights })}
        </span>
      ) : null}
    </div>
  );
}
