/**
 * Individual Umrah offer pricing — shared by admin builder and PDF document.
 *
 * ## Spec 14 — Language never changes numbers
 * All hotel / room / flight / add-on math runs once on structured data (EUR integers,
 * night counts, passenger counts). PDF language is a **presentation layer only**:
 * it must not recalculate, convert currency, or alter passenger/date values.
 *
 * ## Admin / price engine (internal)
 * Knows seasonal periods (€100/night vs €150/night), weekday/weekend supplements,
 * extra bed €/night, meal €/P/N, room category, date-dependent nightly math.
 * Those inputs calculate `OfferHotelOption.calculatedRoomPrices`.
 * Admin may set a different `roomPrices` (offer override); both are retained.
 *
 * ## Customer PDF (public)
 * Shows only: stay dates, room allocation, **offer** room stay totals (`roomPrices`),
 * average per person, meal plan, optional lunch/dinner €/P/N.
 * Never show nightly room rates, weekday/weekend splits, seasonal tables,
 * extra-bed lines, calculated vs override internals, or the calculation path.
 *
 * Avg per person = offer room stay total / (adults + children); infants excluded.
 * Extra-bed fees are internal and must be folded into room totals (never a PDF line).
 *
 * ## Flights (manual)
 * Flight options and `pricePerPerson` are typed per inquiry — no date-rate database.
 * Fares change constantly; Admin enters current suitable options for each offer.
 *
 * ## Alternatives ≠ package total (spec 43)
 * Flights, Medina hotels, and Makkah hotels on one offer are **choices**, not one
 * combined package. Never sum Flight₁ + Medina₁ + Makkah₁ into a misleading grand
 * total unless Admin explicitly defines a recommended combination (not V1).
 */

import type {
  BreakfastMode,
  OfferAddonPricingType,
  OfferHotelOption,
} from "@/lib/individual-umrah-offer";

export type RoomOccupancy = {
  adults: number;
  children: number;
  infants: number;
  /** Children with `requires_bed` assigned to this room. */
  extraBeds: number;
};

export function payingTravellerCount(adults: number, children: number): number {
  return Math.max(1, Math.round(adults) + Math.round(children));
}

export function roomsTotal(roomPrices: number[]): number {
  return roomPrices.reduce((sum, price) => sum + (Number(price) || 0), 0);
}

/**
 * Ensure one price + occupancy label per booked room (never a single combined line).
 * Pads with the last known price / “—” when arrays are short; trims when too long.
 */
export function ensurePerRoomBreakdown(
  roomCount: number,
  roomPrices: number[],
  roomOccupancyLabels?: string[] | null,
): { roomPrices: number[]; roomOccupancyLabels: string[] } {
  const count = Math.max(1, Math.round(roomCount) || 1);
  const prices: number[] = [];
  const labels: string[] = [];
  const fallbackPrice = Number(roomPrices[0]) || 0;
  for (let i = 0; i < count; i++) {
    prices.push(
      roomPrices[i] !== undefined && roomPrices[i] !== null
        ? Number(roomPrices[i]) || 0
        : fallbackPrice,
    );
    labels.push((roomOccupancyLabels?.[i] ?? "").trim() || "—");
  }
  return { roomPrices: prices, roomOccupancyLabels: labels };
}

/** Engine-calculated per-room totals (falls back to offer prices for older offers). */
export function getCalculatedRoomPrices(
  option: Pick<OfferHotelOption, "roomPrices" | "roomOccupancyLabels"> & {
    calculatedRoomPrices?: number[] | null;
  },
  roomCount: number,
): number[] {
  const source =
    Array.isArray(option.calculatedRoomPrices) && option.calculatedRoomPrices.length > 0
      ? option.calculatedRoomPrices
      : option.roomPrices;
  return ensurePerRoomBreakdown(roomCount, source, option.roomOccupancyLabels).roomPrices;
}

/** Offer / PDF per-room totals. */
export function getOfferRoomPrices(
  option: Pick<OfferHotelOption, "roomPrices" | "roomOccupancyLabels">,
  roomCount: number,
): number[] {
  return ensurePerRoomBreakdown(roomCount, option.roomPrices, option.roomOccupancyLabels)
    .roomPrices;
}

/** True when Admin set an offer price different from the engine calculation. */
export function hotelOfferPriceIsOverridden(
  option: Pick<OfferHotelOption, "roomPrices" | "roomOccupancyLabels" | "manualPriceOverride"> & {
    calculatedRoomPrices?: number[] | null;
  },
  roomCount: number,
): boolean {
  if (option.manualPriceOverride) return true;
  const calculated = getCalculatedRoomPrices(option, roomCount);
  const offer = getOfferRoomPrices(option, roomCount);
  if (calculated.length !== offer.length) return true;
  return calculated.some((price, i) => price !== offer[i]);
}

export function avgPerPerson(
  roomStayTotal: number,
  adults: number,
  children: number,
): number {
  const divisor = payingTravellerCount(adults, children);
  return Math.round(roomStayTotal / divisor);
}

export function addonLineTotal(
  priceOrAddon:
    | number
    | { price?: number; pricePerPerson?: number; pricingType?: OfferAddonPricingType },
  payingPaxOrCtx:
    | number
    | { payingPax: number; rooms: number },
): number {
  if (typeof priceOrAddon === "number") {
    return (Number(priceOrAddon) || 0) * (Number(payingPaxOrCtx) || 0);
  }
  const price =
    Number(priceOrAddon.price) ||
    Number(priceOrAddon.pricePerPerson) ||
    0;
  const type = priceOrAddon.pricingType ?? "per_person";
  if (typeof payingPaxOrCtx === "number") {
    return type === "per_person" ? price * payingPaxOrCtx : price;
  }
  if (type === "per_person") return price * payingPaxOrCtx.payingPax;
  if (type === "per_room") return price * payingPaxOrCtx.rooms;
  return price;
}

/** German unit label for PDF / admin, e.g. "pro Person". */
export function formatAddonPricingTypeDe(
  pricingType: OfferAddonPricingType | string | undefined,
): string {
  if (pricingType === "per_booking") return "pro Buchung";
  if (pricingType === "per_room") return "pro Zimmer";
  return "pro Person";
}

/** e.g. "€150 pro Person" */
export function formatAddonPriceLabelDe(addon: {
  price?: number;
  pricePerPerson?: number;
  pricingType?: OfferAddonPricingType | string;
}): string {
  const amount = Number(addon.price) || Number(addon.pricePerPerson) || 0;
  return `${formatEuroDe(amount)} ${formatAddonPricingTypeDe(addon.pricingType)}`;
}

export function formatEuroDe(amount: number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/** “€20 pro Person / Nacht” for meal lines on the customer PDF. */
export function formatMealPerPersonNightDe(amount: number): string {
  return `${formatEuroDe(amount)} pro Person / Nacht`;
}

/**
 * Verpflegung label for PDF / offer display.
 * Prefers an explicit board label (e.g. Halbpension), else derives from breakfast mode.
 */
export function formatBoardLabelDe(
  breakfastMode: BreakfastMode,
  boardLabel?: string | null,
): string {
  const custom = (boardLabel ?? "").trim();
  if (custom && !/^frühstück/i.test(custom)) {
    return custom;
  }
  if (breakfastMode === "optional") return "Frühstück (optional)";
  return custom || "Frühstück";
}

export function shouldShowBreakfastPriceLine(breakfastMode: BreakfastMode): boolean {
  return breakfastMode === "optional" || breakfastMode === "priced";
}

/** PDF lines for a journey leg — summary + optional connection breakdown. */
export function formatFlightLegDetailLinesDe(leg: {
  fromCode?: string;
  toCode?: string;
  departTime?: string;
  arriveTime?: string;
  duration?: string;
  segments?: Array<{
    fromCode: string;
    toCode: string;
    departTime: string;
    arriveTime: string;
  }>;
  connections?: Array<{
    airportCode: string;
    cityLabel: string;
    duration: string;
  }>;
}): string[] {
  const segments = leg.segments?.length
    ? leg.segments
    : [
        {
          fromCode: leg.fromCode ?? "",
          toCode: leg.toCode ?? "",
          departTime: leg.departTime ?? "",
          arriveTime: leg.arriveTime ?? "",
        },
      ];
  const connections = leg.connections ?? [];
  const lines: string[] = [];

  if (segments.length <= 1) {
    lines.push("Direktflug");
  } else {
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]!;
      lines.push(
        `${seg.fromCode} ${seg.departTime} → ${seg.toCode} ${seg.arriveTime}`.replace(
          /\s+/g,
          " ",
        ).trim(),
      );
      const conn = connections[i];
      if (conn) {
        const place = conn.cityLabel || conn.airportCode || "Umstieg";
        const wait = conn.duration ? `: ${conn.duration}` : "";
        lines.push(`Umstieg ${place}${wait}`);
      }
    }
  }

  if (leg.duration?.trim()) {
    lines.push(`Dauer ${leg.duration.trim()}`);
  }
  return lines;
}

/** @deprecated Prefer formatFlightLegDetailLinesDe — kept for simple stop labels. */
export function formatFlightStopsLabelDe(leg: {
  stopKind?: "direct" | "stops";
  stopCount?: number;
  connectionAirports?: string;
  connectionDuration?: string;
  segments?: unknown[];
}): string {
  if (leg.segments && Array.isArray(leg.segments) && leg.segments.length > 1) {
    const n = leg.segments.length - 1;
    return n === 1 ? "1 Stopp" : `${n} Stopps`;
  }
  if (!leg.stopKind || leg.stopKind === "direct" || !leg.stopCount) {
    return "Direktflug";
  }
  const stops =
    leg.stopCount === 1 ? "1 Stopp" : `${leg.stopCount} Stopps`;
  const parts = [stops];
  if (leg.connectionAirports?.trim()) parts.push(leg.connectionAirports.trim());
  if (leg.connectionDuration?.trim()) {
    parts.push(`Umstieg ${leg.connectionDuration.trim()}`);
  }
  return parts.join(" · ");
}

/** Checked + optional hand baggage for PDF. */
export function formatFlightBaggageLines(flight: {
  checkedBaggage?: string;
  handBaggage?: string;
  baggage?: string;
}): string[] {
  const checked =
    (flight.checkedBaggage ?? "").trim() || (flight.baggage ?? "").trim();
  const hand = (flight.handBaggage ?? "").trim();
  const lines: string[] = [];
  if (checked) lines.push(checked);
  if (hand) lines.push(hand);
  return lines.length ? lines : ["—"];
}

function pluralDe(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

/** Customer-facing occupancy label (no prices). */
export function formatRoomOccupancyLabelDe(occ: RoomOccupancy): string {
  const parts: string[] = [];
  if (occ.adults > 0) parts.push(pluralDe(occ.adults, "Erwachsener", "Erwachsene"));
  if (occ.children > 0) parts.push(pluralDe(occ.children, "Kind", "Kinder"));
  if (occ.infants > 0) parts.push(pluralDe(occ.infants, "Baby", "Babys"));
  return parts.join(" + ") || "—";
}

/**
 * Guest placement without Doppelzimmer fill for empty rooms.
 * Used for extra-bed pricing so spare rooms stay at the base room rate.
 */
function placeGuestsInRooms(input: {
  roomCount: number;
  adults: number;
  children: number;
  infants: number;
  childRequiresBed: boolean[];
}): RoomOccupancy[] {
  const roomCount = Math.max(1, Math.round(input.roomCount) || 1);
  const rooms: RoomOccupancy[] = Array.from({ length: roomCount }, () => ({
    adults: 0,
    children: 0,
    infants: 0,
    extraBeds: 0,
  }));

  let remainingAdults = Math.max(0, Math.round(input.adults) || 0);
  for (let r = 0; r < roomCount && remainingAdults > 0; r++) {
    const take = Math.min(2, remainingAdults);
    rooms[r]!.adults = take;
    remainingAdults -= take;
  }
  if (remainingAdults > 0) {
    rooms[roomCount - 1]!.adults += remainingAdults;
  }

  const firstOccupiedIdx = rooms.findIndex((r) => r.adults > 0);
  const firstOccupied = firstOccupiedIdx >= 0 ? firstOccupiedIdx : 0;

  const childCount = Math.max(0, Math.round(input.children) || 0);
  for (let i = 0; i < childCount; i++) {
    rooms[firstOccupied]!.children += 1;
    if (input.childRequiresBed[i]) {
      rooms[firstOccupied]!.extraBeds += 1;
    }
  }

  const infants = Math.max(0, Math.round(input.infants) || 0);
  for (let i = 0; i < infants; i++) {
    rooms[firstOccupied]!.infants += 1;
  }

  return rooms;
}

/**
 * Distribute travellers across booked rooms for pricing / PDF labels.
 *
 * Rules (Doppelzimmer-first):
 * - Fill rooms with up to 2 adults each, starting at Zimmer 1.
 * - Children / infants attach to the first room that has adults (family stays together).
 * - Children with `requires_bed` add an extra-bed count on their room.
 * - Extra booked rooms with no travellers are still charged as Doppelzimmer and
 *   labelled “2 Erwachsene” (standard double occupancy).
 *
 * Example: 2 adults + 1 child (bed) + 2 rooms →
 *   Zimmer 1 – 2 Erwachsene + 1 Kind (+ 1 extra bed)
 *   Zimmer 2 – 2 Erwachsene
 */
export function distributeRoomOccupancy(input: {
  roomCount: number;
  adults: number;
  children: number;
  infants: number;
  /** Parallel to children count; true = needs extra bed. */
  childRequiresBed: boolean[];
}): RoomOccupancy[] {
  const rooms = placeGuestsInRooms(input);
  for (const room of rooms) {
    if (room.adults === 0 && room.children === 0 && room.infants === 0) {
      room.adults = 2;
    }
  }
  return rooms;
}

/**
 * Full hotel stay calculation for an inquiry (per-room totals, labels, avg).
 * Extra-bed fees are folded into room totals — never returned as a separate line.
 */
export function calculateInquiryHotelStay(input: {
  roomCount: number;
  adults: number;
  children: number;
  infants: number;
  childRequiresBed: boolean[];
  /** Base room stay total for one room (night-by-night category rates). */
  baseRoomStayTotal: number;
  extraBedPerNight: number;
  nights: number;
}): {
  occupancy: RoomOccupancy[];
  roomPrices: number[];
  roomOccupancyLabels: string[];
  roomsTotal: number;
  avgPerPerson: number;
  payingTravellers: number;
} {
  const nights = Math.max(0, Math.round(input.nights) || 0);
  const base = Math.max(0, Number(input.baseRoomStayTotal) || 0);
  const placed = placeGuestsInRooms(input);
  const occupancy = distributeRoomOccupancy(input);

  const roomPrices = placed.map(
    (occ) =>
      base + extraBedStayTotal(input.extraBedPerNight, occ.extraBeds, nights),
  );

  const labels = occupancy.map((occ) => formatRoomOccupancyLabelDe(occ));
  const total = roomsTotal(roomPrices);

  return {
    occupancy,
    roomPrices,
    roomOccupancyLabels: labels,
    roomsTotal: total,
    avgPerPerson: avgPerPerson(total, input.adults, input.children),
    payingTravellers: payingTravellerCount(input.adults, input.children),
  };
}

/** Extra-bed stay add-on for one room (internal — fold into room total). */
export function extraBedStayTotal(
  extraBedPerNight: number,
  extraBeds: number,
  nights: number,
): number {
  return (
    Math.max(0, Number(extraBedPerNight) || 0) *
    Math.max(0, Math.round(extraBeds) || 0) *
    Math.max(0, Math.round(nights) || 0)
  );
}
