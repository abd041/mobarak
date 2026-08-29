import type { UmrahTrip } from "@/data/mock";

/** Total nights for a departure — from trip data, with date-based fallback. */
export function getTripNightCount(trip: UmrahTrip): number {
  if (trip.nights > 0) return trip.nights;

  if (trip.startDate && trip.endDate) {
    const start = new Date(`${trip.startDate}T12:00:00`);
    const end = new Date(`${trip.endDate}T12:00:00`);
    const dayMs = 1000 * 60 * 60 * 24;
    const diff = Math.round((end.getTime() - start.getTime()) / dayMs);
    if (diff > 0) return diff;
  }

  const splitNights = trip.medinaStay.nights + trip.makkahStay.nights;
  return splitNights > 0 ? splitNights : 0;
}
