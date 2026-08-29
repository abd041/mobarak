import type { UmrahTrip } from "@/data/mock";
import { getTripInclusions, type TripInclusionId } from "@/lib/trip-inclusions";

export type TripCardInclusionItem = {
  id: string;
  icon: string;
  labelKey: string;
  /** Row item is shown when any matching inclusion is enabled on the departure. */
  matchIds: TripInclusionId[];
};

/** Row 1 — Visum … Religiöse Begleitung (never merge or drop when enabled). */
export const TRIP_CARD_INCLUSION_ROW_1: TripCardInclusionItem[] = [
  {
    id: "visa",
    icon: "/brand/inclusion-icons/visa.png",
    labelKey: "listingBenefitVisa",
    matchIds: ["visa"],
  },
  {
    id: "flight",
    icon: "/brand/inclusion-icons/flight.png",
    labelKey: "listingBenefitFlight",
    matchIds: ["flight"],
  },
  {
    id: "baggage",
    icon: "/brand/inclusion-icons/baggage.png",
    labelKey: "listingBenefitBaggage",
    matchIds: ["baggage"],
  },
  {
    id: "guide",
    icon: "/brand/inclusion-icons/guide.png",
    labelKey: "listingBenefitGuide",
    matchIds: ["guide"],
  },
  {
    id: "religious",
    icon: "/brand/inclusion-icons/religious.png",
    labelKey: "listingBenefitReligious",
    matchIds: ["religious"],
  },
];

/** Row 2 — Transfers … Ausflüge (fixed order per listing spec). */
export const TRIP_CARD_INCLUSION_ROW_2: TripCardInclusionItem[] = [
  {
    id: "transfer",
    icon: "/brand/inclusion-icons/transfer.png",
    labelKey: "listingBenefitTransfer",
    matchIds: ["transfer"],
  },
  {
    id: "hotels",
    icon: "/brand/inclusion-icons/hotel.png",
    labelKey: "listingBenefitHotels",
    matchIds: ["hotels"],
  },
  {
    id: "breakfast",
    icon: "/brand/inclusion-icons/breakfast.png",
    labelKey: "listingBenefitBreakfast",
    matchIds: ["breakfast"],
  },
  {
    id: "excursions",
    icon: "/brand/inclusion-icons/excursions.png",
    labelKey: "listingBenefitExcursions",
    matchIds: ["excursionMakkah", "excursionMedina"],
  },
];

export const TRIP_CARD_INCLUSION_ROWS = [
  TRIP_CARD_INCLUSION_ROW_1,
  TRIP_CARD_INCLUSION_ROW_2,
] as const;

function filterActiveSlots(
  slots: readonly TripCardInclusionItem[],
  active: Set<TripInclusionId>,
): TripCardInclusionItem[] {
  return slots.filter((slot) => slot.matchIds.some((id) => active.has(id)));
}

/** Two fixed rows of compact inclusion chips for offer cards. */
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
