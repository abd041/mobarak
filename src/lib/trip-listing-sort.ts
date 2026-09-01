import type { UmrahTrip } from "@/data/mock";
import { resolveTrip } from "@/lib/trip-availability";

export const TRIP_LISTING_SORT_KEYS = [
  "next",
  "priceAsc",
  "priceDesc",
  "seats",
] as const;

export type TripListingSortKey = (typeof TRIP_LISTING_SORT_KEYS)[number];

export const DEFAULT_TRIP_LISTING_SORT: TripListingSortKey = "next";

/** Default listing order — soonest departure first (Trip 1 → Trip 2 → Trip 3 …). */

/** Lowest displayed card price (Vierbett) — used for price sorting. */
export function getListingSortPrice(trip: UmrahTrip): number {
  return trip.prices.quad;
}

export function sortTripsForListing(
  trips: UmrahTrip[],
  sort: TripListingSortKey,
): UmrahTrip[] {
  const list = [...trips];

  list.sort((a, b) => {
    if (sort === "priceAsc") {
      const diff = getListingSortPrice(a) - getListingSortPrice(b);
      return diff !== 0 ? diff : a.startDate.localeCompare(b.startDate);
    }
    if (sort === "priceDesc") {
      const diff = getListingSortPrice(b) - getListingSortPrice(a);
      return diff !== 0 ? diff : a.startDate.localeCompare(b.startDate);
    }
    if (sort === "seats") {
      const diff = b.availableSeats - a.availableSeats;
      return diff !== 0 ? diff : a.startDate.localeCompare(b.startDate);
    }
    const orderDiff = (a.displayOrder ?? 100) - (b.displayOrder ?? 100);
    if (orderDiff !== 0) return orderDiff;
    return a.startDate.localeCompare(b.startDate);
  });

  return list;
}

/** Resolve admin overrides before filtering or sorting the listing.
 * Only call with `applyClientOverrides: true` after mount — localStorage
 * overrides differ from SSR and would cause hydration mismatches.
 */
export function getResolvedTripsForListing(
  trips: UmrahTrip[],
  options?: { applyClientOverrides?: boolean },
): UmrahTrip[] {
  if (!options?.applyClientOverrides) return trips;
  return trips.map(resolveTrip);
}
