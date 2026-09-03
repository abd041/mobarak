"use client";

import { useTranslations } from "next-intl";
import { Clock, Users } from "lucide-react";
import type { UmrahTrip } from "@/data/mock";
import { getAvailabilityBadgeLines } from "@/lib/trip-availability";
import { cn } from "@/lib/utils";

const BADGE_BASE =
  "inline-flex w-fit shrink-0 items-center gap-0.5 whitespace-nowrap rounded-md font-semibold leading-none shadow-sm";

const TONE_CLASS = {
  green: "bg-[#1F8A4C] px-1.5 py-[3px] text-[9px] text-white md:px-2 md:py-[4px] md:text-[10px]",
  red: "bg-[#C0392B] px-1.5 py-[3px] text-[9px] text-white md:px-2 md:py-[4px] md:text-[10px]",
  orange:
    "border border-[#E8D4A8]/80 bg-[#FAEBD0] px-1.5 py-[3px] text-[9px] font-semibold text-[#6B4E16] md:px-2 md:py-[4px] md:text-[10px]",
} as const;

/**
 * Availability pill(s) on offer cards — top-left over the image.
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
  const badgeClass = cn(BADGE_BASE, compact && "gap-0.5");
  const iconClass = "h-2.5 w-2.5 shrink-0 md:h-3 md:w-3";

  const renderLine = (line: (typeof lines)[number]) => {
    const label =
      line.labelKey === "available"
        ? t("available", { count: line.count ?? 0 })
        : t(line.labelKey);

    if (line.tone === "green" && line.labelKey === "available") {
      return (
        <span key={`${line.tone}-${line.labelKey}`} className={cn(badgeClass, TONE_CLASS.green)}>
          <Users className={iconClass} strokeWidth={2.25} aria-hidden />
          {label}
        </span>
      );
    }

    if (
      line.tone === "orange" &&
      (line.labelKey === "waitlist" || line.labelKey === "waitlistFull")
    ) {
      return (
        <span key={`${line.tone}-${line.labelKey}`} className={cn(badgeClass, TONE_CLASS.orange)}>
          <Clock className={iconClass} strokeWidth={2.25} aria-hidden />
          {label}
        </span>
      );
    }

    if (line.tone === "red") {
      return (
        <span key={`${line.tone}-${line.labelKey}`} className={cn(badgeClass, TONE_CLASS.red)}>
          <Users className={iconClass} strokeWidth={2.25} aria-hidden />
          {label}
        </span>
      );
    }

    return (
      <span key={`${line.tone}-${line.labelKey}`} className={cn(badgeClass, TONE_CLASS[line.tone])}>
        {label}
      </span>
    );
  };

  if (lines.length === 1) {
    return renderLine(lines[0]!);
  }

  return (
    <div className={cn("flex flex-col", compact ? "gap-0.5" : "gap-1")}>
      {lines.map(renderLine)}
    </div>
  );
}
