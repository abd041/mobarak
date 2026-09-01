import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  Car,
  Landmark,
  Luggage,
  Plane,
  ShieldCheck,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";
import type { UmrahTrip } from "@/data/mock";

/**
 * Catalog of includable services — enable/disable per departure in admin.
 * Cards and detail bars render from this list + the trip's active IDs (never hard-coded per card).
 */
export const TRIP_INCLUSION_IDS = [
  "visa",
  "flight",
  "baggage",
  "guide",
  "religious",
  "transfer",
  "hotels",
  "breakfast",
  "excursionMakkah",
  "excursionMedina",
] as const;

export type TripInclusionId = (typeof TRIP_INCLUSION_IDS)[number];

/** Legacy combined key — expanded to Makkah + Medina when reading older data. */
const LEGACY_EXCURSIONS = "excursions";

/** Default set for standard Umrah group packages. */
export const DEFAULT_TRIP_INCLUSIONS: TripInclusionId[] = [...TRIP_INCLUSION_IDS];

export type InclusionCatalogItem = {
  id: TripInclusionId;
  icon: string;
  /** Detail-page bar label */
  barLabelKey: string;
  /** Feature / long label */
  labelKey: string;
  /** Compact card title */
  cardTitleKey: string;
  /** Optional card subtitle (e.g. "inklusive") */
  cardSubtitleKey?: string;
  /** Prefer full-width on the card grid */
  cardWide?: boolean;
  Icon: LucideIcon;
  adminLabel: string;
};

/** Single source of truth for inclusion display metadata. */
export const INCLUSION_CATALOG: InclusionCatalogItem[] = [
  {
    id: "visa",
    icon: "/brand/inclusion-icons/visa.png",
    barLabelKey: "incBarVisa",
    labelKey: "featVisa",
    cardTitleKey: "featVisaL1",
    cardSubtitleKey: "includedShort",
    Icon: ShieldCheck,
    adminLabel: "Visum",
  },
  {
    id: "flight",
    icon: "/brand/inclusion-icons/flight.png",
    barLabelKey: "incBarFlight",
    labelKey: "featFlight",
    cardTitleKey: "featFlightL1",
    cardSubtitleKey: "includedShort",
    Icon: Plane,
    adminLabel: "Flug",
  },
  {
    id: "baggage",
    icon: "/brand/inclusion-icons/baggage.png",
    barLabelKey: "incBarBaggage",
    labelKey: "featBaggage",
    cardTitleKey: "featBaggageL1",
    cardSubtitleKey: "includedShort",
    Icon: Luggage,
    adminLabel: "Gepäck",
  },
  {
    id: "guide",
    icon: "/brand/inclusion-icons/guide.png",
    barLabelKey: "incBarGuide",
    labelKey: "featGuide",
    cardTitleKey: "cardGuideL1",
    cardSubtitleKey: "includedShort",
    Icon: UserRound,
    adminLabel: "Reiseleiter",
  },
  {
    id: "religious",
    icon: "/brand/inclusion-icons/religious.png",
    barLabelKey: "incBarReligious",
    labelKey: "featReligious",
    cardTitleKey: "featReligious",
    cardSubtitleKey: "includedShort",
    Icon: BookOpen,
    adminLabel: "Religiöse Begleitung",
  },
  {
    id: "transfer",
    icon: "/brand/inclusion-icons/transfer.png",
    barLabelKey: "incBarTransfer",
    labelKey: "featTransfer",
    cardTitleKey: "cardTransferL1",
    cardSubtitleKey: "includedShort",
    Icon: Car,
    adminLabel: "Transfers",
  },
  {
    id: "hotels",
    icon: "/brand/inclusion-icons/hotel.png",
    barLabelKey: "incBarHotels",
    labelKey: "featHotels",
    cardTitleKey: "featHotels",
    cardSubtitleKey: "includedShort",
    cardWide: true,
    Icon: Building2,
    adminLabel: "Hotels",
  },
  {
    id: "breakfast",
    icon: "/brand/inclusion-icons/breakfast.png",
    barLabelKey: "incBarBreakfast",
    labelKey: "featBreakfast",
    cardTitleKey: "featBreakfast",
    cardSubtitleKey: "includedShort",
    Icon: UtensilsCrossed,
    adminLabel: "Frühstück",
  },
  {
    id: "excursionMakkah",
    icon: "/brand/inclusion-icons/excursion-makkah.svg",
    barLabelKey: "incBarExcursionMakkah",
    labelKey: "featExcursionMakkah",
    cardTitleKey: "featExcursionMakkah",
    cardSubtitleKey: "includedShort",
    Icon: Landmark,
    adminLabel: "Ausflüge Makkah",
  },
  {
    id: "excursionMedina",
    icon: "/brand/inclusion-icons/excursion-medina.svg",
    barLabelKey: "incBarExcursionMedina",
    labelKey: "featExcursionMedina",
    cardTitleKey: "featExcursionMedina",
    cardSubtitleKey: "includedShort",
    Icon: Landmark,
    adminLabel: "Ausflüge Medina",
  },
];

/** Detail page bar — same catalog order. */
export const DETAIL_INCLUSION_ITEMS = INCLUSION_CATALOG.map(
  ({ id, icon, barLabelKey }) => ({
    id,
    icon,
    labelKey: barLabelKey,
  }),
);

export const INCLUSION_META: Record<
  TripInclusionId,
  { labelKey: string; barLabelKey: string; Icon: LucideIcon; adminLabel: string }
> = Object.fromEntries(
  INCLUSION_CATALOG.map((item) => [
    item.id,
    {
      labelKey: item.labelKey,
      barLabelKey: item.barLabelKey,
      Icon: item.Icon,
      adminLabel: item.adminLabel,
    },
  ]),
) as Record<
  TripInclusionId,
  { labelKey: string; barLabelKey: string; Icon: LucideIcon; adminLabel: string }
>;

const STORAGE_KEY = "mobarak.tripInclusions";

export function isTripInclusionId(value: string): value is TripInclusionId {
  return (TRIP_INCLUSION_IDS as readonly string[]).includes(value);
}

/** Normalize stored/seed IDs — expands legacy "excursions" and drops unknowns. */
export function normalizeTripInclusions(ids: readonly string[]): TripInclusionId[] {
  const seen = new Set<TripInclusionId>();
  const result: TripInclusionId[] = [];

  for (const raw of ids) {
    if (raw === LEGACY_EXCURSIONS) {
      for (const id of ["excursionMakkah", "excursionMedina"] as const) {
        if (!seen.has(id)) {
          seen.add(id);
          result.push(id);
        }
      }
      continue;
    }
    if (!isTripInclusionId(raw) || seen.has(raw)) continue;
    seen.add(raw);
    result.push(raw);
  }

  return TRIP_INCLUSION_IDS.filter((id) => seen.has(id));
}

export function readInclusionOverrides(): Record<string, TripInclusionId[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    const result: Record<string, TripInclusionId[]> = {};
    for (const [id, value] of Object.entries(parsed)) {
      result[id] = normalizeTripInclusions(value ?? []);
    }
    return result;
  } catch {
    return {};
  }
}

export function writeInclusionOverride(tripId: string, inclusions: TripInclusionId[]) {
  if (typeof window === "undefined") return;
  const all = readInclusionOverrides();
  all[tripId] = normalizeTripInclusions(inclusions);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

/** Effective enabled services for a departure — from admin override or trip record. */
export function getTripInclusions(trip: UmrahTrip): TripInclusionId[] {
  const override = readInclusionOverrides()[trip.id];
  return normalizeTripInclusions(override ?? trip.inclusions);
}

export function getDetailInclusionItems(trip: UmrahTrip) {
  const active = new Set(getTripInclusions(trip));
  return DETAIL_INCLUSION_ITEMS.filter((item) => active.has(item.id));
}

export function getInclusionCatalogItem(id: TripInclusionId): InclusionCatalogItem {
  return INCLUSION_CATALOG.find((item) => item.id === id)!;
}
