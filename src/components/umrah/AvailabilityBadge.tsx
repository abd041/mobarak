"use client";

import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { getAvailabilityBadgeLines } from "@/lib/trip-availability";
import { cn } from "@/lib/utils";

const BADGE_BASE =
  "inline-flex w-fit shrink-0 whitespace-nowrap rounded-full font-semibold leading-none text-white shadow-sm";

const TONE_CLASS = {
  green: "bg-brand-green",
  red: "bg-brand-red",
  orange: "bg-brand-orange-cta",
} as const;

/**
 * Availability pill(s) on offer cards — top-left over the image.
 *
 * - Available: green "Noch {n} Plätze verfügbar" (+ orange waitlist when enabled)
 * - Sold out: red "0 Plätze verfügbar" + orange waitlist status when applicable
 *
 * Seat count is read from `trip.availableSeats` (resolved via admin/backend overrides).
 */
export function AvailabilityBadge({
  trip,
  compact = false,
}: {
  trip: UmrahTrip;
  compact?: boolean;
}) {
  const t = useTranslations("umrah");
  const lines = getAvailabilityBadgeLines(trip);
  const badgeClass = cn(
    BADGE_BASE,
    compact
      ? "px-1.5 py-0.5 text-[9px] md:px-2.5 md:py-1 md:text-[11px]"
      : "px-2.5 py-1 text-[11px]",
  );

  if (lines.length === 1) {
    const line = lines[0]!;
    return (
      <span className={cn(badgeClass, TONE_CLASS[line.tone])}>
        {line.labelKey === "available"
          ? t("available", { count: line.count ?? 0 })
          : t(line.labelKey)}
      </span>
    );
  }

  return (
    <div className={cn("flex flex-col", compact ? "gap-0.5 md:gap-1" : "gap-1")}>
      {lines.map((line) => (
        <span key={`${line.tone}-${line.labelKey}`} className={cn(badgeClass, TONE_CLASS[line.tone])}>
          {line.labelKey === "available"
            ? t("available", { count: line.count ?? 0 })
            : t(line.labelKey)}
        </span>
      ))}
    </div>
  );
}
