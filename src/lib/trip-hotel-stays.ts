import type { UmrahTrip } from "@/data/mock";

/** Per-departure Medina or Makkah stay — dates drive the offer card automatically. */
export type TripHotelStay = {
  nights: number;
  /** ISO YYYY-MM-DD */
  checkIn: string;
  /** ISO YYYY-MM-DD */
  checkOut: string;
  /** Optional legacy display fallback */
  dateLabel?: string;
};

export type TripHotelStayBundle = {
  medinaHotelId: string;
  makkahHotelId: string;
  medinaStay: TripHotelStay;
  makkahStay: TripHotelStay;
};

const STORAGE_KEY = "mobarak.tripHotelStays";

export function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function nightsBetweenIso(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T12:00:00`);
  const end = new Date(`${checkOut}T12:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const diff = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return Math.max(0, diff);
}

export function normalizeTripHotelStay(
  value: Partial<TripHotelStay> | undefined,
  fallback?: TripHotelStay,
): TripHotelStay {
  const checkIn = (value?.checkIn ?? fallback?.checkIn ?? "").trim();
  const checkOut = (value?.checkOut ?? fallback?.checkOut ?? "").trim();
  let nights = Math.max(0, Math.round(Number(value?.nights ?? fallback?.nights) || 0));

  if (checkIn && checkOut) {
    nights = nightsBetweenIso(checkIn, checkOut);
  } else if (checkIn && nights > 0 && !checkOut) {
    return {
      checkIn,
      checkOut: addDaysIso(checkIn, nights),
      nights,
      dateLabel: value?.dateLabel ?? fallback?.dateLabel,
    };
  }

  return {
    checkIn,
    checkOut,
    nights,
    dateLabel: value?.dateLabel ?? fallback?.dateLabel,
  };
}

/** Rebuild Medina → Makkah stays from trip window + Medina nights. */
export function deriveHotelStaysFromTripDates(
  startDate: string,
  endDate: string,
  medinaNights: number,
): { medinaStay: TripHotelStay; makkahStay: TripHotelStay } {
  const medinaCheckIn = startDate;
  const medinaCheckOut = addDaysIso(startDate, Math.max(0, medinaNights));
  const makkahCheckIn = medinaCheckOut;
  const makkahCheckOut = endDate || medinaCheckOut;
  return {
    medinaStay: normalizeTripHotelStay({
      checkIn: medinaCheckIn,
      checkOut: medinaCheckOut,
      nights: medinaNights,
    }),
    makkahStay: normalizeTripHotelStay({
      checkIn: makkahCheckIn,
      checkOut: makkahCheckOut,
    }),
  };
}

/** When Medina nights change — keep trip start, shift Makkah window. */
export function syncStaysAfterMedinaNightsChange(
  startDate: string,
  endDate: string,
  medinaNights: number,
): { medinaStay: TripHotelStay; makkahStay: TripHotelStay } {
  return deriveHotelStaysFromTripDates(startDate, endDate, medinaNights);
}

/** When Makkah nights change — keep Medina check-out as Makkah check-in. */
export function syncMakkahStayFromNights(
  medinaCheckOut: string,
  makkahNights: number,
): TripHotelStay {
  const checkIn = medinaCheckOut;
  const checkOut = addDaysIso(checkIn, Math.max(0, makkahNights));
  return normalizeTripHotelStay({ checkIn, checkOut, nights: makkahNights });
}

export function readHotelStayOverrides(): Record<string, TripHotelStayBundle> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, TripHotelStayBundle>;
  } catch {
    return {};
  }
}

export function writeHotelStayOverride(tripId: string, value: TripHotelStayBundle) {
  if (typeof window === "undefined") return;
  const all = readHotelStayOverrides();
  all[tripId] = {
    medinaHotelId: value.medinaHotelId,
    makkahHotelId: value.makkahHotelId,
    medinaStay: normalizeTripHotelStay(value.medinaStay),
    makkahStay: normalizeTripHotelStay(value.makkahStay),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

export function getTripHotelStayBundle(trip: UmrahTrip): TripHotelStayBundle {
  const override = readHotelStayOverrides()[trip.id];
  const base: TripHotelStayBundle = {
    medinaHotelId: trip.medinaHotelId,
    makkahHotelId: trip.makkahHotelId,
    medinaStay: normalizeTripHotelStay(trip.medinaStay),
    makkahStay: normalizeTripHotelStay(trip.makkahStay),
  };
  if (!override) return base;
  return {
    medinaHotelId: override.medinaHotelId || base.medinaHotelId,
    makkahHotelId: override.makkahHotelId || base.makkahHotelId,
    medinaStay: normalizeTripHotelStay(override.medinaStay, base.medinaStay),
    makkahStay: normalizeTripHotelStay(override.makkahStay, base.makkahStay),
  };
}
