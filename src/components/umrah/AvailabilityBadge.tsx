"use client";

import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";

export function AvailabilityBadge({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");

  if (trip.status === "available") {
    return (
      <span className="rounded-full bg-brand-green px-2.5 py-1 text-xs font-semibold text-white">
        {t("available", { count: trip.availableSeats })}
      </span>
    );
  }

  if (trip.status === "waitlist" || (trip.availableSeats === 0 && trip.waitlistEnabled && !trip.waitlistFull)) {
    return (
      <div className="flex flex-col gap-1">
        <span className="rounded-full bg-brand-red px-2.5 py-1 text-xs font-semibold text-white">
          {t("soldOut")}
        </span>
        <span className="rounded-full bg-brand-waitlist px-2.5 py-1 text-xs font-semibold text-white">
          {t("waitlist")}
        </span>
      </div>
    );
  }

  if (trip.waitlistFull) {
    return (
      <div className="flex flex-col gap-1">
        <span className="rounded-full bg-brand-red px-2.5 py-1 text-xs font-semibold text-white">
          {t("soldOut")}
        </span>
        <span className="rounded-full bg-brand-waitlist px-2.5 py-1 text-xs font-semibold text-white">
          {t("waitlistFull")}
        </span>
      </div>
    );
  }

  return (
    <span className="rounded-full bg-brand-red px-2.5 py-1 text-xs font-semibold text-white">
      {t("soldOut")}
    </span>
  );
}
