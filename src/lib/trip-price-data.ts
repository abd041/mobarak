import type { UmrahTrip } from "@/data/mock";

/** Adult occupancy prices — shown on the Umrah listing cards. */
export type TripAdultPrices = {
  /** Four-bed room (1 bed in quad) */
  quad: number;
  /** Triple room (1 bed in triple) */
  triple: number;
  /** Double room (1 bed in double) */
  double: number;
};

/** Child & infant prices — offer detail page and inquiry checkout only. */
export type TripChildPrices = {
  infant: number;
  withoutBed: number;
  withBedDiscount: number;
};

const ADULT_STORAGE_KEY = "mobarak.tripPrices";
const CHILD_STORAGE_KEY = "mobarak.tripChildPrices";

function roundPrice(value: number): number {
  return Math.max(0, Math.round(value) || 0);
}

export function normalizeAdultPrices(value: Partial<TripAdultPrices>): TripAdultPrices {
  return {
    quad: roundPrice(Number(value.quad) || 0),
    triple: roundPrice(Number(value.triple) || 0),
    double: roundPrice(Number(value.double) || 0),
  };
}

export function normalizeChildPrices(value: Partial<TripChildPrices>): TripChildPrices {
  return {
    infant: roundPrice(Number(value.infant) || 0),
    withoutBed: roundPrice(Number(value.withoutBed) || 0),
    withBedDiscount: roundPrice(Number(value.withBedDiscount) || 0),
  };
}

export function readAdultPriceOverrides(): Record<string, TripAdultPrices> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ADULT_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Partial<TripAdultPrices>>;
    const result: Record<string, TripAdultPrices> = {};
    for (const [id, value] of Object.entries(parsed)) {
      result[id] = normalizeAdultPrices(value);
    }
    return result;
  } catch {
    return {};
  }
}

export function writeAdultPriceOverride(tripId: string, value: TripAdultPrices) {
  if (typeof window === "undefined") return;
  const all = readAdultPriceOverrides();
  all[tripId] = normalizeAdultPrices(value);
  window.localStorage.setItem(ADULT_STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

export function readChildPriceOverrides(): Record<string, TripChildPrices> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CHILD_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Partial<TripChildPrices>>;
    const result: Record<string, TripChildPrices> = {};
    for (const [id, value] of Object.entries(parsed)) {
      result[id] = normalizeChildPrices(value);
    }
    return result;
  } catch {
    return {};
  }
}

export function writeChildPriceOverride(tripId: string, value: TripChildPrices) {
  if (typeof window === "undefined") return;
  const all = readChildPriceOverrides();
  all[tripId] = normalizeChildPrices(value);
  window.localStorage.setItem(CHILD_STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

export function getTripAdultPrices(trip: UmrahTrip): TripAdultPrices {
  const overrides = readAdultPriceOverrides();
  return { ...trip.prices, ...(overrides[trip.id] ?? {}) };
}

export function getTripChildPrices(trip: UmrahTrip): TripChildPrices {
  const overrides = readChildPriceOverrides();
  return { ...trip.childPrices, ...(overrides[trip.id] ?? {}) };
}

/** @deprecated Use getTripAdultPrices */
export const getTripPrices = getTripAdultPrices;

/** @deprecated Use writeAdultPriceOverride */
export const writePriceOverride = writeAdultPriceOverride;

/** @deprecated Use readAdultPriceOverrides */
export const readPriceOverrides = readAdultPriceOverrides;

export type TripPrices = TripAdultPrices;
