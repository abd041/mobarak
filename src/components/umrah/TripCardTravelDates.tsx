"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, Moon } from "lucide-react";
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
        "flex items-center justify-between gap-2 border-b border-[#E8EBEF] bg-[#F4F7FA] px-3 py-2",
        isListing && "md:px-3.5 md:py-2",
      )}
    >
      <p
        className={cn(
          "flex min-w-0 items-center gap-1.5 leading-tight text-[#0A1B3D]",
          isListing
            ? "text-[12px] font-extrabold tracking-[-0.02em] md:text-[13px]"
            : "text-[13px] font-bold sm:text-[14px]",
        )}
      >
        <CalendarDays
          className="h-3.5 w-3.5 shrink-0 text-[#0A1B3D] md:h-4 md:w-4"
          strokeWidth={2.25}
          aria-hidden
        />
        <span className="min-w-0 break-words">{dates}</span>
      </p>
      {nights > 0 ? (
        <span
          className={cn(
            "flex shrink-0 items-center gap-1 whitespace-nowrap text-[#0A1B3D]",
            isListing
              ? "text-[12px] font-extrabold tracking-[-0.01em] md:text-[13px]"
              : "text-[12px] font-bold sm:text-[13px]",
          )}
        >
          <Moon className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" strokeWidth={2.25} aria-hidden />
          {tCommon("nights", { count: nights })}
        </span>
      ) : null}
    </div>
  );
}
