"use client";

import { useTranslations } from "next-intl";
import { Plane, Sparkles, Tag } from "lucide-react";
import type { TripOfferBadgeId, UmrahTrip } from "@/data/mock";
import { getTripOfferBadgeIds } from "@/lib/trip-offer-badges";
import { cn } from "@/lib/utils";

const BADGE_BASE =
  "inline-flex w-fit max-w-full shrink-0 items-center gap-0.5 whitespace-nowrap rounded-md font-semibold leading-none shadow-sm";

const BADGE_CLASS: Record<TripOfferBadgeId, string> = {
  popular: "bg-[#F28C18] px-1.5 py-[3px] text-[9px] text-white md:px-2 md:py-[4px] md:text-[10px]",
  direct_flight:
    "bg-[#1264F5] px-1.5 py-[3px] text-[9px] text-white md:px-2 md:py-[4px] md:text-[10px]",
  early_bird:
    "border border-[#E8D4A8]/80 bg-[#FAEBD0] px-1.5 py-[3px] text-[9px] font-semibold text-[#6B4E16] md:px-2 md:py-[4px] md:text-[10px]",
};

const BADGE_ICON = {
  popular: Sparkles,
  direct_flight: Plane,
  early_bird: Tag,
} as const;

/**
 * Marketing pills on offer cards — stacked under availability, compact like reference.
 */
export function TripOfferBadges({
  trip,
  compact = false,
}: {
  trip: UmrahTrip;
  compact?: boolean;
}) {
  const t = useTranslations("umrah");
  const badges = getTripOfferBadgeIds(trip);
  if (badges.length === 0) return null;

  const badgeClass = cn(BADGE_BASE, compact && "gap-0.5");
  const iconClass = "h-2.5 w-2.5 shrink-0 md:h-3 md:w-3";

  return (
    <>
      {badges.map((id) => {
        const Icon = BADGE_ICON[id];
        const label =
          id === "direct_flight"
            ? t("badgeDirectFlight", { airport: trip.departureAirport })
            : id === "popular"
              ? t("badgePopular")
              : t("badgeEarlyBird");

        return (
          <span key={id} className={cn(badgeClass, BADGE_CLASS[id])}>
            <Icon className={iconClass} strokeWidth={2.25} aria-hidden />
            <span className="truncate">{label}</span>
          </span>
        );
      })}
    </>
  );
}
