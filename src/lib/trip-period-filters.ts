import type { UmrahTrip } from "@/data/mock";
import {
  PERIOD_FILTER_KEYS,
  tripMatchesPeriodFilter,
  type PeriodFilterKey,
  type TripPeriodFilterTag,
} from "@/lib/listing-period-filters";

const STORAGE_KEY = "mobarak.tripPeriodFilters";

export function readPeriodFilterOverrides(): Record<string, TripPeriodFilterTag[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, TripPeriodFilterTag[]>;
  } catch {
    return {};
  }
}

export function writePeriodFilterOverride(tripId: string, tags: TripPeriodFilterTag[]) {
  if (typeof window === "undefined") return;
  const all = readPeriodFilterOverrides();
  all[tripId] = normalizeTripPeriodFilterTags(tags);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

/** Keeps only valid tags in UI filter order — one or more per departure. */
export function normalizeTripPeriodFilterTags(tags: readonly string[]): TripPeriodFilterTag[] {
  const allowed = new Set(
    PERIOD_FILTER_KEYS.filter((key): key is TripPeriodFilterTag => key !== "all"),
  );
  const seen = new Set<TripPeriodFilterTag>();
  const normalized: TripPeriodFilterTag[] = [];

  for (const tag of tags) {
    if (!allowed.has(tag as TripPeriodFilterTag)) continue;
    const value = tag as TripPeriodFilterTag;
    if (seen.has(value)) continue;
    seen.add(value);
    normalized.push(value);
  }

  return normalized;
}

/** Effective tags for a departure — from admin override or trip record. */
export function getTripPeriodFilterTags(trip: UmrahTrip): TripPeriodFilterTag[] {
  const override = readPeriodFilterOverrides()[trip.id];
  return normalizeTripPeriodFilterTags(override ?? trip.filterTags);
}

/**
 * Filters departures by explicitly assigned period tags.
 * Month and holiday filters are never inferred from travel dates here.
 */
export function filterTripsByPeriod(trips: UmrahTrip[], filter: PeriodFilterKey): UmrahTrip[] {
  if (filter === "all") return [...trips];
  return trips.filter((trip) =>
    tripMatchesPeriodFilter(getTripPeriodFilterTags(trip), filter),
  );
}
