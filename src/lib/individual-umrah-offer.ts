/**
 * Breakfast configuration for a hotel (or period override).
 * - included: in the room rate (typical “Verpflegung: Frühstück”)
 * - optional: available at a configurable € / person / night
 * - priced: not included; charged at a configurable € / person / night
 */
export type BreakfastMode = "included" | "optional" | "priced";

export type HotelMealPricing = {
  breakfastMode: BreakfastMode;
  /** € / person / night when breakfast is optional or priced; ignored when included. */
  breakfastPerPersonNight: number;
  /** € / person / night; 0 = not offered / already included in board. */
  lunchPerPersonNight: number;
  /** € / person / night; 0 = not offered / already included in board. */
  dinnerPerPersonNight: number;
};

/** One seasonal / date-window room rate (weekday + weekend). */
export type HotelRatePeriod = {
  id: string;
  /** Inclusive start `YYYY-MM-DD` */
  validFrom: string;
  /** Inclusive end `YYYY-MM-DD` */
  validUntil: string;
  /**
   * Sunday–Thursday room price per night (EUR).
   * Legacy single `pricePerRoomNight` values are migrated into both fields.
   */
  weekdayPricePerRoomNight: number;
  /** Friday–Saturday room price per night (EUR). */
  weekendPricePerRoomNight: number;
  /**
   * Optional meal pricing for this date window.
   * `null` = use hotel-level `meals` defaults.
   */
  mealOverrides: HotelMealPricing | null;
};

/**
 * Room category under a hotel — each category has its own seasonal rate rules.
 * Extensible without changing the pricing engine (Standard, Deluxe, Triple, Family, …).
 * Spec 44: add categories in Admin; no code change required for new category names.
 */
export type HotelRoomCategory = {
  id: string;
  name: string;
  active: boolean;
  sortOrder: number;
  periods: HotelRatePeriod[];
};

export type IndividualUmrahHotelRate = {
  hotelId: string;
  currency: "EUR";
  /** Room categories with independent rate periods. */
  categories: HotelRoomCategory[];
  /**
   * @deprecated Prefer `categories[].periods`. Migrated into a default category on read.
   */
  periods?: HotelRatePeriod[];
  /**
   * @deprecated Prefer category periods. Kept as fallback when no period matches.
   */
  baseRoomStayHint: number | null;
  /**
   * Internal extra-bed price € / night (typically incl. breakfast).
   * Baked into room totals for the customer PDF — never shown as a separate line.
   */
  extraBedPerNight: number;
  /** Default meal pricing; periods may override via `mealOverrides`. */
  meals: HotelMealPricing;
  /**
   * Customer-facing board line override (e.g. “Halbpension”).
   * Empty → derived from `meals.breakfastMode` (typically “Frühstück”).
   */
  boardLabel: string;
  notes: string;
};

/**
 * One airborne segment (origin → destination).
 * Connecting journeys use 2+ segments with `connections` between them.
 */
export type OfferFlightSegment = {
  fromCode: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
};

/** Layover between two segments. */
export type OfferFlightConnection = {
  airportCode: string;
  /** City / airport label for PDF, e.g. "Istanbul". */
  cityLabel: string;
  duration: string;
};

/**
 * One-way journey (outbound or return).
 * Always modelled as segments — a direct flight is simply one segment.
 */
export type OfferFlightLeg = {
  dateLabel: string;
  /** Total journey duration (all segments + connections). */
  duration: string;
  segments: OfferFlightSegment[];
  /** Length should be `segments.length - 1` (empty when direct). */
  connections: OfferFlightConnection[];
  /**
   * Convenience mirrors of first/last segment (kept in sync on normalize).
   * Useful for compact PDF summary line.
   */
  fromCode: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
};

export type OfferFlightOption = {
  id: string;
  /**
   * Global airline catalog id (`/admin/airlines`). Empty when custom / blank row.
   * Name + logo are copied onto the offer when selected (snapshot for the PDF).
   */
  airlineId: string;
  /** Airline name shown on the PDF (from catalog or manual). */
  airlineName: string;
  /** Logo path or URL from the airline catalog (or manual). */
  logo: string;
  outbound: OfferFlightLeg;
  inbound: OfferFlightLeg;
  /**
   * Structured checked baggage (preferred). PDF localizes Freigepäck / etc.
   * Legacy free-text `checkedBaggage` is migrated on read when this is null.
   */
  checkedBaggageSpec: import("@/lib/individual-umrah-offer-codes").OfferBaggageSpec | null;
  /**
   * Structured hand baggage (preferred).
   */
  handBaggageSpec: import("@/lib/individual-umrah-offer-codes").OfferBaggageSpec | null;
  /**
   * Checked baggage line, e.g. "2 × 23 kg Freigepäck".
   * @deprecated Prefer `checkedBaggageSpec`. Still accepted when loading older offers.
   */
  checkedBaggage: string;
  /**
   * Optional hand baggage, e.g. "7 kg Handgepäck".
   * @deprecated Prefer `handBaggageSpec`.
   */
  handBaggage: string;
  /**
   * @deprecated Prefer `checkedBaggage`. Still accepted when loading older offers.
   */
  baggage?: string;
  /** Optional combined trip duration summary for the PDF column. */
  totalDuration: string;
  /**
   * Price per person (EUR) — **always entered manually** per inquiry/offer.
   * Unlike hotels, there is no flight date-rate database: market prices change
   * constantly, so Admin types suitable options and current fares for each offer.
   */
  pricePerPerson: number;
};

export type OfferHotelOption = {
  id: string;
  hotelId: string;
  /** Selected room category for this offer option (Admin/engine; PDF may omit the id). */
  roomCategoryId: string;
  /**
   * Catalog / official room category name (may be English proper noun).
   * Prefer `roomType` for PDF translation of stock types.
   */
  roomCategoryName: string;
  /**
   * Structured room type code (standard | deluxe | …).
   * `null` = custom name — PDF keeps `roomCategoryName` as entered.
   */
  roomType: import("@/lib/individual-umrah-offer-codes").OfferRoomTypeCode | null;
  /**
   * Engine-calculated per-room stay totals (always retained internally).
   * Not shown on the customer PDF when an offer override exists.
   */
  calculatedRoomPrices: number[];
  /**
   * Offer / PDF per-room stay totals. May match `calculatedRoomPrices` or a
   * manual override (e.g. supplier special). Customer PDF shows these only.
   */
  roomPrices: number[];
  /**
   * Customer-facing occupancy per room, e.g. "2 Erwachsene + 1 Kind".
   * Extra-bed cost is already included in room totals — not itemized on the PDF.
   */
  roomOccupancyLabels: string[];
  /**
   * True when `roomPrices` were set/edited by Admin (special price or missing-rate fill).
   * Required to generate a PDF when some stay nights have no hotel rate period.
   */
  manualPriceOverride?: boolean;
  /** Resolved meal pricing snapshot for this offer option (hotel or period). */
  breakfastMode: BreakfastMode;
  breakfastPerPersonNight: number;
  lunchPerPersonNight: number;
  dinnerPerPersonNight: number;
  /**
   * Structured meal plan (`breakfast` | `half_board` | …).
   * Preferred over free-text `boardLabel` for PDF translation.
   */
  mealPlan: import("@/lib/individual-umrah-offer-codes").OfferMealPlanCode | null;
  /**
   * Legacy / custom Verpflegung text (Admin DE cache or special wording).
   * @deprecated Prefer `mealPlan`. Kept for custom free-text and older offers.
   */
  boardLabel: string;
};

export type OfferAddonPricingType = "per_person" | "per_booking" | "per_room";

export const OFFER_ADDON_PRICING_TYPES: readonly OfferAddonPricingType[] = [
  "per_person",
  "per_booking",
  "per_room",
] as const;

/**
 * How this add-on appears on the customer PDF:
 * - selected — included on the offer (normal card)
 * - optional — not selected, but still shown as an optional extra
 * - hidden — not shown on the PDF at all
 */
export type OfferAddonPdfDisplay = "selected" | "optional" | "hidden";

export const OFFER_ADDON_PDF_DISPLAYS: readonly OfferAddonPdfDisplay[] = [
  "selected",
  "optional",
  "hidden",
] as const;

export type OfferAddonOption = {
  /**
   * Catalog id (`city_transfer`, …) or a custom key for future services —
   * no schema change required to add new offer-only add-ons.
   */
  id: string;
  /**
   * @deprecated Prefer `pdfDisplay`. `true` → selected, `false` → hidden (migrated on read).
   */
  enabled?: boolean;
  /** PDF visibility — Admin chooses selected / optional / hidden. */
  pdfDisplay: OfferAddonPdfDisplay;
  /** Unit amount in EUR (meaning depends on `pricingType`). */
  price: number;
  pricingType: OfferAddonPricingType;
  title: string;
  body: string;
  /**
   * @deprecated Prefer `price` with `pricingType: "per_person"`. Migrated on read.
   */
  pricePerPerson?: number;
};

export type IndividualUmrahOfferStatus = "draft" | "ready";

/**
 * Optional Admin override for customer PDF language.
 * `null` = follow inquiry.customer_language automatically.
 */
export type OfferPdfLanguageOverride = import("@/i18n/routing").Locale | null;

export type IndividualUmrahOffer = {
  offerId: string;
  offerNumber: string;
  inquiryId: string;
  createdAt: string;
  status: IndividualUmrahOfferStatus;
  /**
   * PDF language override. `null` / omitted → automatic from inquiry language.
   * Admin may set de|ar|en|tr|bs when the customer needs a different PDF.
   */
  pdfLanguageOverride: OfferPdfLanguageOverride;
  greetingName: string;
  flights: OfferFlightOption[];
  /** V1 city block — prefer `listOfferHotelCityBlocks()` for new code. */
  medinaHotels: OfferHotelOption[];
  /** V1 city block — prefer `listOfferHotelCityBlocks()` for new code. */
  makkahHotels: OfferHotelOption[];
  /**
   * Future cities beyond Medina/Makkah (spec 44). Empty in V1.
   * Do not duplicate medina/makkah here.
   */
  extraCityHotels?: import("@/lib/individual-umrah-architecture").OfferCityHotelBlock[];
  /**
   * Explicit recommended packages (spec 43/44). Empty in V1 — never invent a
   * Flight₁+Hotel₁+Hotel₁ total without entries here.
   */
  recommendedCombinations?: import("@/lib/individual-umrah-architecture").OfferRecommendedCombination[];
  addons: OfferAddonOption[];
  /**
   * Structured included-term codes (preferred). PDF translates via offer-codes.
   * Empty → fall back to `includedItems` free-text / legacy.
   */
  includedTermIds: import("@/lib/individual-umrah-offer-codes").OfferIncludedTermCode[];
  excludedTermIds: import("@/lib/individual-umrah-offer-codes").OfferExcludedTermCode[];
  noteTermIds: import("@/lib/individual-umrah-offer-codes").OfferNoteTermCode[];
  /**
   * PDF “Im Preis enthalten” bullets — free-text / custom lines.
   * @deprecated Prefer `includedTermIds` for stock lines.
   */
  includedItems: string[];
  /**
   * PDF “Nicht inkludiert” bullets.
   * @deprecated Prefer `excludedTermIds` for stock lines.
   */
  excludedItems: string[];
  /**
   * PDF “Wichtige Hinweise” bullets.
   * @deprecated Prefer `noteTermIds` for stock lines.
   */
  importantNotes: string[];
  /** Monotonic PDF generation version (1 after first Generate). */
  pdfVersion: number;
  /** ISO timestamp of last Generate / Regenerate; null until first PDF generation. */
  pdfGeneratedAt: string | null;
  /** Fingerprint of content at last PDF generation — used to detect dirty edits. */
  pdfContentFingerprint: string | null;
};

/** Immutable snapshot kept in inquiry PDF history after Generate / Regenerate. */
export type IndividualUmrahOfferPdfSnapshot = {
  snapshotId: string;
  inquiryId: string;
  version: number;
  generatedAt: string;
  offerNumber: string;
  /**
   * Effective customer PDF language at generation time (spec 17).
   * Lets Admin see which language was sent per version (e.g. Arabisch → Deutsch).
   */
  pdfLanguage: import("@/i18n/routing").Locale;
  /** Full offer payload at generation time. */
  offer: IndividualUmrahOffer;
};

export function newOfferEntityId(prefix = "opt"): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateOfferNumber(createdAt = new Date()): string {
  const year = createdAt.getFullYear();
  const seq = String(Math.floor(1000 + Math.random() * 9000));
  return `UMR-${year}-${seq}`;
}
