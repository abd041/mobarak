import type { UmrahTrip } from "@/data/mock";

/** Editable basic fields for a group departure record. */
export type TripBasics = {
  title: string;
  startDate: string;
  endDate: string;
  nights: number;
  groupSize: number;
  departureAirport: string;
};

const STORAGE_KEY = "mobarak.tripBasics";

export function readBasicsOverrides(): Record<string, TripBasics> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, TripBasics>;
  } catch {
    return {};
  }
}

export function writeBasicsOverride(tripId: string, value: TripBasics) {
  if (typeof window === "undefined") return;
  const all = readBasicsOverrides();
  all[tripId] = normalizeTripBasics(value);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

export function normalizeTripBasics(value: Partial<TripBasics> & Pick<TripBasics, "title">): TripBasics {
  return {
    title: value.title.trim() || "Umrah Gruppenreise",
    startDate: value.startDate?.trim() || "",
    endDate: value.endDate?.trim() || "",
    nights: Math.max(0, Math.round(Number(value.nights) || 0)),
    groupSize: Math.max(0, Math.round(Number(value.groupSize) || 0)),
    departureAirport: value.departureAirport?.trim() || "",
  };
}

export function getTripBasics(trip: UmrahTrip): TripBasics {
  const override = readBasicsOverrides()[trip.id];
  const base: TripBasics = {
    title: trip.title,
    startDate: trip.startDate,
    endDate: trip.endDate,
    nights: trip.nights,
    groupSize: trip.groupSize,
    departureAirport: trip.departureAirport,
  };
  return override ? { ...base, ...normalizeTripBasics({ ...base, ...override }) } : base;
}

/** Short display label derived from start/end when both are set. */
export function formatTripDateLabel(startDate: string, endDate: string, fallback: string): string {
  if (!startDate || !endDate) return fallback;
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return fallback;

  const fmt = new Intl.DateTimeFormat("de-AT", { day: "numeric", month: "short", year: "numeric" });
  const startFmt = new Intl.DateTimeFormat("de-AT", { day: "numeric", month: "short" });
  if (start.getFullYear() === end.getFullYear()) {
    return `${startFmt.format(start)} – ${fmt.format(end)}`;
  }
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}
