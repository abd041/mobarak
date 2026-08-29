import type { AvailabilityStatus, UmrahTrip } from "@/data/mock";
import {
  formatTripDateLabel,
  getTripBasics,
} from "@/lib/trip-basics";
import { getTripHotelStayBundle } from "@/lib/trip-hotel-stays";
import { getTripGallery } from "@/lib/trip-gallery";
import { getTripInclusions } from "@/lib/trip-inclusions";
import { getTripPeriodFilterTags } from "@/lib/trip-period-filters";
import { getTripPriceDisplayMode } from "@/lib/trip-price-display";
import {
  getTripAdultPrices,
  getTripChildPrices,
  type TripAdultPrices,
  type TripChildPrices,
} from "@/lib/trip-price-data";

export type { TripAdultPrices, TripChildPrices };
export type TripPrices = TripAdultPrices;

export {
  getTripAdultPrices,
  getTripChildPrices,
  getTripPrices,
  readAdultPriceOverrides as readPriceOverrides,
  writeAdultPriceOverride as writePriceOverride,
  writeChildPriceOverride,
} from "@/lib/trip-price-data";

export type TripAvailability = {
  totalCapacity: number;
  availableSeats: number;
  waitlistEnabled: boolean;
  waitlistCapacity: number;
  waitlistFull: boolean;
};

const STORAGE_KEY = "mobarak.tripAvailability";

export function deriveStatus(a: TripAvailability): AvailabilityStatus {
  if (a.availableSeats > 0) return "available";
  if (a.waitlistEnabled && !a.waitlistFull) return "waitlist";
  if (a.waitlistEnabled && a.waitlistFull) return "waitlist_full";
  if (a.waitlistFull) return "waitlist_full";
  return "soldout";
}

export type AvailabilityPresentation =
  | { kind: "available"; seats: number }
  | { kind: "waitlist" }
  | { kind: "soldout" }
  | { kind: "waitlist_full" };

export type AvailabilityBadgeLine = {
  tone: "green" | "red" | "orange";
  labelKey: "available" | "soldOut" | "waitlist" | "waitlistFull";
  /** Populated for the green availability line — driven by trip.availableSeats (backend/admin). */
  count?: number;
};

/** Stacked badge lines for offer cards — mirrors detail hero availability pills. */
export function getAvailabilityBadgeLines(trip: UmrahTrip): AvailabilityBadgeLine[] {
  const seats = Math.max(0, trip.availableSeats);
  const availability: TripAvailability = {
    totalCapacity: trip.totalCapacity,
    availableSeats: seats,
    waitlistEnabled: trip.waitlistEnabled,
    waitlistCapacity: trip.waitlistCapacity,
    waitlistFull: trip.waitlistFull,
  };
  const status = trip.status ?? deriveStatus(availability);
  const lines: AvailabilityBadgeLine[] = [];

  if (status === "available" || seats > 0) {
    lines.push({ tone: "green", labelKey: "available", count: seats });
    if (trip.waitlistEnabled) {
      lines.push({ tone: "orange", labelKey: "waitlist" });
    }
    return lines;
  }

  lines.push({ tone: "red", labelKey: "soldOut" });

  if (trip.waitlistEnabled) {
    lines.push({
      tone: "orange",
      labelKey: trip.waitlistFull ? "waitlistFull" : "waitlist",
    });
  }

  return lines;
}

/** Single source of truth for availability labels — driven by trip/backend fields only. */
export function getAvailabilityPresentation(trip: UmrahTrip): AvailabilityPresentation {
  const status =
    trip.status ??
    deriveStatus({
      totalCapacity: trip.totalCapacity,
      availableSeats: trip.availableSeats,
      waitlistEnabled: trip.waitlistEnabled,
      waitlistCapacity: trip.waitlistCapacity,
      waitlistFull: trip.waitlistFull,
    });

  switch (status) {
    case "available":
      return { kind: "available", seats: Math.max(0, trip.availableSeats) };
    case "waitlist":
      return { kind: "waitlist" };
    case "waitlist_full":
      return { kind: "waitlist_full" };
    default:
      return { kind: "soldout" };
  }
}

/**
 * Inquiry / booking CTA mode for detail + inquiry pages.
 * - available: normal place inquiry
 * - waitlist: group full, waitlist open
 * - full: group full and waitlist closed/full — inquiry must not imply a guaranteed place
 */
export type TripInquiryCtaMode = "available" | "waitlist" | "full";

export function getTripInquiryCtaMode(trip: UmrahTrip): TripInquiryCtaMode {
  const presentation = getAvailabilityPresentation(trip);
  if (presentation.kind === "available") return "available";
  if (presentation.kind === "waitlist") return "waitlist";
  return "full";
}

function normalizeAvailability(value: Partial<TripAvailability>): TripAvailability {
  return {
    totalCapacity: Math.max(0, Math.round(Number(value.totalCapacity) || 0)),
    availableSeats: Math.max(0, Math.round(Number(value.availableSeats) || 0)),
    waitlistEnabled: Boolean(value.waitlistEnabled),
    waitlistCapacity: Math.max(0, Math.round(Number(value.waitlistCapacity) || 0)),
    waitlistFull: Boolean(value.waitlistFull),
  };
}

export function readAvailabilityOverrides(): Record<string, TripAvailability> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Partial<TripAvailability>>;
    const normalized: Record<string, TripAvailability> = {};
    for (const [id, value] of Object.entries(parsed)) {
      normalized[id] = normalizeAvailability(value);
    }
    return normalized;
  } catch {
    return {};
  }
}

export function writeAvailabilityOverride(tripId: string, value: TripAvailability) {
  if (typeof window === "undefined") return;
  const all = readAvailabilityOverrides();
  all[tripId] = normalizeAvailability(value);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

export function getTripAvailability(
  trip: UmrahTrip,
): TripAvailability & { status: AvailabilityStatus } {
  const overrides = readAvailabilityOverrides();
  const base: TripAvailability = {
    totalCapacity: trip.totalCapacity,
    availableSeats: trip.availableSeats,
    waitlistEnabled: trip.waitlistEnabled,
    waitlistCapacity: trip.waitlistCapacity,
    waitlistFull: trip.waitlistFull,
  };
  const merged = normalizeAvailability({ ...base, ...(overrides[trip.id] ?? {}) });
  return { ...merged, status: deriveStatus(merged) };
}

export function resolveTrip(trip: UmrahTrip): UmrahTrip {
  const a = getTripAvailability(trip);
  const prices = getTripAdultPrices(trip);
  const childPrices = getTripChildPrices(trip);
  const basics = getTripBasics(trip);
  const hotels = getTripHotelStayBundle(trip);
  return {
    ...trip,
    title: basics.title,
    startDate: basics.startDate,
    endDate: basics.endDate,
    nights: basics.nights,
    groupSize: basics.groupSize,
    departureAirport: basics.departureAirport,
    dateLabel: formatTripDateLabel(basics.startDate, basics.endDate, trip.dateLabel),
    totalCapacity: a.totalCapacity,
    availableSeats: a.availableSeats,
    waitlistEnabled: a.waitlistEnabled,
    waitlistCapacity: a.waitlistCapacity,
    waitlistFull: a.waitlistFull,
    status: a.status,
    prices,
    childPrices,
    medinaHotelId: hotels.medinaHotelId,
    makkahHotelId: hotels.makkahHotelId,
    medinaStay: hotels.medinaStay,
    makkahStay: hotels.makkahStay,
    displayOrder: trip.displayOrder ?? 100,
    images: getTripGallery(trip),
    inclusions: getTripInclusions(trip),
    filterTags: getTripPeriodFilterTags(trip),
    priceDisplayMode: getTripPriceDisplayMode(trip),
  };
}
