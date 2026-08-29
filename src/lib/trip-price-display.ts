import type { UmrahTrip } from "@/data/mock";
import { formatEuro } from "@/lib/utils";

/** How list/detail prices are worded for a departure. */
export type TripPriceDisplayMode = "fixed" | "from";

const STORAGE_KEY = "mobarak.tripPriceDisplay";

export function readPriceDisplayOverrides(): Record<string, TripPriceDisplayMode> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, TripPriceDisplayMode>;
  } catch {
    return {};
  }
}

export function writePriceDisplayOverride(tripId: string, mode: TripPriceDisplayMode) {
  if (typeof window === "undefined") return;
  const all = readPriceDisplayOverrides();
  all[tripId] = mode;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

/**
 * fixed — exact departure price, e.g. "1.250 €"
 * from  — minimum/from price, e.g. "ab 1.250 €"
 */
export function getTripPriceDisplayMode(trip: UmrahTrip): TripPriceDisplayMode {
  const override = readPriceDisplayOverrides()[trip.id];
  if (override) return override;
  return trip.priceDisplayMode ?? "fixed";
}

export function formatTripPriceLabel(
  amount: number,
  mode: TripPriceDisplayMode,
  priceFromLabel: string,
  locale = "de-AT",
): string {
  const formatted = formatEuro(amount, locale);
  if (mode === "from") return `${priceFromLabel} ${formatted}`;
  return formatted;
}
