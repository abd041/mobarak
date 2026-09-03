import type { UmrahTrip } from "@/data/mock";
import { getTripInclusions, type TripInclusionId } from "@/lib/trip-inclusions";

export type TripCardInclusionItem = {
  id: string;
  icon: string;
  linesKey: string;
  matchIds: TripInclusionId[];
};

/** Design row 1 — Visum, Flug, Transfer (baggage removed per listing reference). */
export const TRIP_CARD_INCLUSION_ROW_1: TripCardInclusionItem[] = [
  {
    id: "visa",
    icon: "/brand/inclusion-icons/visa.png",
    linesKey: "cardInclVisaLines",
    matchIds: ["visa"],
  },
  {
    id: "flight",
    icon: "/brand/inclusion-icons/flight.png",
    linesKey: "cardInclFlightLines",
    matchIds: ["flight"],
  },
  {
    id: "transfer",
    icon: "/brand/inclusion-icons/transfer.png",
    linesKey: "cardInclTransferLines",
    matchIds: ["transfer"],
  },
];

/** Design row 2 — Ausflüge, Hotels inkl. Frühstück, Reiseführer. */
export const TRIP_CARD_INCLUSION_ROW_2: TripCardInclusionItem[] = [
  {
    id: "excursions",
    icon: "/brand/inclusion-icons/excursions.png",
    linesKey: "cardInclExcursionsLines",
    matchIds: ["excursionMakkah", "excursionMedina"],
  },
  {
    id: "hotelsBreakfast",
    icon: "/brand/inclusion-icons/hotel.png",
    linesKey: "cardInclHotelsBreakfastLines",
    matchIds: ["hotels", "breakfast"],
  },
  {
    id: "guide",
    icon: "/brand/inclusion-icons/guide.png",
    linesKey: "cardInclGuideLines",
    matchIds: ["guide"],
  },
];

function filterActiveSlots(
  slots: readonly TripCardInclusionItem[],
  active: Set<TripInclusionId>,
): TripCardInclusionItem[] {
  return slots.filter((slot) => slot.matchIds.some((id) => active.has(id)));
}

/** Two fixed rows (3 + 3) matching the offer-card listing reference. */
export function getTripCardInclusionRows(trip: UmrahTrip): {
  row1: TripCardInclusionItem[];
  row2: TripCardInclusionItem[];
} {
  const active = new Set(getTripInclusions(trip));
  return {
    row1: filterActiveSlots(TRIP_CARD_INCLUSION_ROW_1, active),
    row2: filterActiveSlots(TRIP_CARD_INCLUSION_ROW_2, active),
  };
}
