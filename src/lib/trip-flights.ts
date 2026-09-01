import type { FlightLeg, UmrahTrip } from "@/data/mock";

export const DEFAULT_AIRLINE_LOGO = "/brand/meta-icons/egyptair-logo-wide.png";
export const FLIGHT_PANEL_VISUAL = "/brand/flights-panel-plane.png";

export type TripFlightOverride = {
  airline?: string;
  airlineLogo?: string;
  baggageAllowance?: string;
  outbound?: Partial<FlightLeg>;
  inbound?: Partial<FlightLeg>;
};

export type TripFlightInfo = {
  airline: string;
  airlineLogo: string;
  baggageAllowance: string;
  outbound: FlightLeg;
  inbound: FlightLeg;
};

const STORAGE_KEY = "mobarak.tripFlights";

export function readFlightOverrides(): Record<string, TripFlightOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, TripFlightOverride>;
  } catch {
    return {};
  }
}

export function writeFlightOverride(tripId: string, value: TripFlightOverride) {
  if (typeof window === "undefined") return;
  const all = readFlightOverrides();
  all[tripId] = value;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

export function getTripFlightInfo(trip: UmrahTrip): TripFlightInfo {
  const overrides = readFlightOverrides()[trip.id] ?? {};
  return {
    airline: overrides.airline ?? trip.airline,
    airlineLogo: overrides.airlineLogo ?? trip.airlineLogo ?? DEFAULT_AIRLINE_LOGO,
    baggageAllowance: overrides.baggageAllowance ?? trip.baggageAllowance,
    outbound: { ...trip.outbound, ...overrides.outbound },
    inbound: { ...trip.inbound, ...overrides.inbound },
  };
}
