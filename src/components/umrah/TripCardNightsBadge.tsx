"use client";

import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { getTripNightCount } from "@/lib/trip-nights";
import { cn } from "@/lib/utils";

/** Small white pill on the offer image — e.g. "9 NÄCHTE". */
export function TripCardNightsBadge({
  trip,
  compact = false,
}: {
  trip: UmrahTrip;
  compact?: boolean;
}) {
  const t = useTranslations("umrah");
  const nights = getTripNightCount(trip);

  if (nights <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 whitespace-nowrap rounded-full bg-white/95 font-bold leading-none text-navy shadow-sm",
        compact
          ? "px-1.5 py-0.5 text-[9px] tracking-[0.06em] md:px-2 md:py-1 md:text-[10px]"
          : "px-2 py-1 text-[10px] tracking-[0.06em] md:text-[11px]",
      )}
    >
      {t("cardNights", { count: nights })}
    </span>
  );
}
