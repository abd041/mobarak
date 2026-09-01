/** §14 — preferred airline (optional). Logos under /public/brand/airlines (ChatGPT Sep 1, 04:06). */
export const INDIVIDUAL_UMRAH_AIRLINES = [
  { id: "egyptair", displayName: "Egypt Air", nameKey: "airlineEgyptAir", logo: "/brand/airlines/egyptair.png" },
  { id: "pegasus", displayName: "Pegasus Airlines", nameKey: "airlinePegasus", logo: "/brand/airlines/pegasus.png" },
  { id: "turkish", displayName: "Turkish Airlines", nameKey: "airlineTurkish", logo: "/brand/airlines/turkish.png" },
  { id: "ajet", displayName: "A Jet", nameKey: "airlineAjet", logo: "/brand/airlines/ajet.png" },
  { id: "royal_jordanian", displayName: "Royal Jordanian", nameKey: "airlineRoyalJordanian", logo: "/brand/airlines/royal-jordanian.png" },
  { id: "saudia", displayName: "Saudia Airlines", nameKey: "airlineSaudia", logo: "/brand/airlines/saudia.png" },
  { id: "wizz_budapest", displayName: "Wizz Air ab Budapest", nameKey: "airlineWizzBudapest", logo: "/brand/airlines/wizz.png" },
] as const;

export type IndividualUmrahAirlineId = (typeof INDIVIDUAL_UMRAH_AIRLINES)[number]["id"];

export function getAirlineDisplayName(id: string): string {
  return INDIVIDUAL_UMRAH_AIRLINES.find((a) => a.id === id)?.displayName ?? id;
}

/**
 * §36 — Final add-ons (all optional, multi-select):
 * 1. city_transfer — train; only when Medina included; direction from city order
 * 2. religious_medina — guide icon; only when Medina included
 * 3. visa — passport/visa icon; always shown
 *
 * Spec 44: append catalog rows (and/or custom offer add-on ids) without changing
 * `OfferAddonOption` shape — ids remain free-form strings on the offer.
 */
export const INDIVIDUAL_UMRAH_ADDONS = [
  {
    id: "city_transfer",
    titleKey: "addonTransferTitle",
    bodyKey: "addonTransferBody",
    icon: "train" as const,
    iconSrc: "/brand/icons/individual-umrah/addons/train.png",
  },
  {
    id: "religious_medina",
    titleKey: "addonReligiousTitle",
    bodyKey: "addonReligiousBody",
    icon: "guide" as const,
    iconSrc: "/brand/icons/individual-umrah/addons/guide.png",
  },
  {
    id: "visa",
    titleKey: "addonVisaTitle",
    bodyKey: "addonVisaBody",
    icon: "visa" as const,
    iconSrc: "/brand/icons/individual-umrah/addons/visa.png",
  },
] as const;

export type IndividualUmrahAddonId = (typeof INDIVIDUAL_UMRAH_ADDONS)[number]["id"];

/**
 * Travel priorities on the final inquiry (optional, multi-select, no default).
 * Helps admin choose hotels and flights.
 */
export const INDIVIDUAL_UMRAH_TRAVEL_PRIORITIES = [
  { id: "near_haram", labelKey: "priorityNearHaram" },
  { id: "luxury_hotel", labelKey: "priorityLuxuryHotel" },
  { id: "low_price", labelKey: "priorityLowPrice" },
  { id: "enough_baggage", labelKey: "priorityEnoughBaggage" },
  { id: "baggage_not_important", labelKey: "priorityBaggageNotImportant" },
] as const;

export type IndividualUmrahTravelPriorityId =
  (typeof INDIVIDUAL_UMRAH_TRAVEL_PRIORITIES)[number]["id"];

const MEDINA_ADDON_IDS = new Set<IndividualUmrahAddonId>([
  "city_transfer",
  "religious_medina",
]);

/**
 * §36 — Medina-linked add-ons only when itinerary includes Medina.
 * Makkah-only → Visum only.
 */
export function addonsForItinerary(
  itinerary: "makkah_only" | "makkah_medina" | "",
): (typeof INDIVIDUAL_UMRAH_ADDONS)[number][] {
  if (itinerary === "makkah_medina") return [...INDIVIDUAL_UMRAH_ADDONS];
  return INDIVIDUAL_UMRAH_ADDONS.filter((addon) => !MEDINA_ADDON_IDS.has(addon.id));
}

export function pruneAddonsForItinerary(
  selected: IndividualUmrahAddonId[],
  itinerary: "makkah_only" | "makkah_medina" | "",
): IndividualUmrahAddonId[] {
  const allowed = new Set(addonsForItinerary(itinerary).map((addon) => addon.id));
  return selected.filter((id) => allowed.has(id));
}

/**
 * §36 — transfer title/body follow city order.
 * Medina zuerst → Transfer Medina → Makkah
 * Makkah zuerst → Transfer Makkah → Medina
 */
export function transferCopyKeys(cityOrder: "makkah_first" | "medina_first" | "") {
  if (cityOrder === "makkah_first") {
    return {
      titleKey: "addonTransferTitleMakkahFirst" as const,
      bodyKey: "addonTransferBodyMakkahFirst" as const,
    };
  }
  return {
    titleKey: "addonTransferTitleMedinaFirst" as const,
    bodyKey: "addonTransferBodyMedinaFirst" as const,
  };
}

/** §12 — passport type only (no passport number at inquiry stage). */
export const INDIVIDUAL_UMRAH_PASSPORT_TYPES = [
  { id: "normal", labelKey: "passportNormal" },
  { id: "convention", labelKey: "passportConvention" },
  { id: "travel", labelKey: "passportTravel" },
  { id: "diplomatic", labelKey: "passportDiplomatic" },
] as const;
