"use client";

import { useEffect, useState } from "react";
import type { UmrahTrip } from "@/data/mock";
import { resolveTrip } from "@/lib/trip-availability";
import { AvailabilityBadge } from "@/components/umrah/AvailabilityBadge";

/** Availability badge that reacts to admin localStorage overrides. */
export function LiveAvailabilityBadge({ trip }: { trip: UmrahTrip }) {
  const [live, setLive] = useState(trip);

  useEffect(() => {
    const sync = () => setLive(resolveTrip(trip));
    sync();
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener("storage", sync);
    };
  }, [trip]);

  return <AvailabilityBadge trip={live} />;
}
