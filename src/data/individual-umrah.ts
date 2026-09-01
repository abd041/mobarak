export const INDIVIDUAL_UMRAH_AIRPORT_IDS = ["vie", "szg", "muc", "bud"] as const;

export type IndividualUmrahAirportId = (typeof INDIVIDUAL_UMRAH_AIRPORT_IDS)[number];

export const INDIVIDUAL_UMRAH_AIRPORTS: { id: IndividualUmrahAirportId; code: string; labelKey: string }[] = [
  { id: "vie", code: "VIE", labelKey: "airportVienna" },
  { id: "szg", code: "SZG", labelKey: "airportSalzburg" },
  { id: "muc", code: "MUC", labelKey: "airportMunich" },
  { id: "bud", code: "BUD", labelKey: "airportBudapest" },
];

export type IndividualUmrahItinerary = "makkah_only" | "makkah_medina";

export type IndividualUmrahCityOrder = "makkah_first" | "medina_first";

export const MAX_INDIVIDUAL_ROOMS = 20;
export const MAX_TRAVELLERS_PER_CATEGORY = 9;

/** §17 — at least 1 night per selected city; max stays configurable. */
export const MIN_NIGHTS_PER_CITY = 1;
export const MAX_NIGHTS_PER_CITY = 30;

/** §19 — upcoming travel months in the month dropdown (12–18 recommended). */
export const INDIVIDUAL_UMRAH_TRAVEL_MONTHS_AHEAD = 18;

/** §37 — phone country flag + dial prefix options. */
export const INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS = [
  { code: "AT", flag: "🇦🇹", dial: "+43" },
  { code: "DE", flag: "🇩🇪", dial: "+49" },
  { code: "CH", flag: "🇨🇭", dial: "+41" },
  { code: "BA", flag: "🇧🇦", dial: "+387" },
  { code: "TR", flag: "🇹🇷", dial: "+90" },
  { code: "BE", flag: "🇧🇪", dial: "+32" },
  { code: "FR", flag: "🇫🇷", dial: "+33" },
  { code: "NL", flag: "🇳🇱", dial: "+31" },
  { code: "IT", flag: "🇮🇹", dial: "+39" },
  { code: "RS", flag: "🇷🇸", dial: "+381" },
  { code: "GB", flag: "🇬🇧", dial: "+44" },
  { code: "US", flag: "🇺🇸", dial: "+1" },
  { code: "SA", flag: "🇸🇦", dial: "+966" },
  { code: "AE", flag: "🇦🇪", dial: "+971" },
  { code: "EG", flag: "🇪🇬", dial: "+20" },
] as const;

export type IndividualUmrahPhoneCountryCode =
  (typeof INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS)[number]["code"];

/** Default phone country from website locale (§37 — still editable by customer). */
export function defaultPhoneCountryForLocale(locale: string): IndividualUmrahPhoneCountryCode {
  if (locale === "tr") return "TR";
  if (locale === "bs") return "BA";
  if (locale === "ar") return "SA";
  if (locale === "en") return "GB";
  return "AT";
}

/** §12 / §13 — room count is chosen by the customer; never derived from traveller counts. */
export const INDIVIDUAL_UMRAH_ROOM_PRESETS = [1, 2, 3, 4, 5] as const;
export const INDIVIDUAL_UMRAH_ROOMS_SIX_PLUS_MIN = 6;

/** Re-export §9 age rule for CMS / form consumers. */
export {
  INDIVIDUAL_UMRAH_AGE_RULE,
  type IndividualUmrahAgeCategory,
  type IndividualUmrahTraveller,
  type IndividualUmrahTravellerCounts,
} from "@/lib/individual-umrah-age";

/** Re-export §22 travel-date storage helpers. */
export {
  buildRequestedStartDate,
  getFlexibilitySearchWindow,
  toTravelDateStorageFields,
  type IndividualUmrahTravelDateFields,
  type FlexibilitySearchWindow,
} from "@/lib/individual-umrah-date";

export const HERO_SERVICE_ICONS = [
  { id: "flights", iconKey: "flight", labelKey: "heroServiceFlights" },
  { id: "hotels", iconKey: "hotel", labelKey: "heroServiceHotels" },
  { id: "visa", iconKey: "visa", labelKey: "heroServiceVisa" },
  { id: "transfer", iconKey: "transfer", labelKey: "heroServiceTransfer" },
] as const;
