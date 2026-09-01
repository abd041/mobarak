/**
 * Individual Umrah — extension architecture (spec 44).
 *
 * ## Important final rule — two language concepts (spec 18)
 *
 * There are **two separate language concepts**. Do not mix them.
 *
 * | Concept | Language | Scope |
 * |---|---|---|
 * | **Internal system** | **Always German** | Admin UI, Login, offer builder, structured Admin labels |
 * | **Customer-facing** | **Inquiry language** (`customer_language`) | Offer PDF + future customer emails / WhatsApp |
 *
 * Examples:
 * - Arabic inquiry → German Admin → Arabic PDF (RTL)
 * - German inquiry → German Admin → German PDF
 * - English inquiry → German Admin → English PDF
 * - Turkish / Bosnian likewise
 *
 * Optional Admin `pdfLanguageOverride` only changes the **customer PDF**, never Admin UI.
 *
 * This separation is intentional from day one: one PDF structure + localized templates
 * (`offer_template_de|ar|en|tr|bs`) with RTL for Arabic. Retrofitting proper RTL later
 * would be considerably harder — do not fork into five PDF systems or localize Admin.
 *
 * Supporting rules:
 * - Admin UI is always German (labels + structured values like „2 Erwachsene“,
 *   „Medina zuerst“). Customer free-text stays as entered with `dir=auto`.
 * - `customer_language` is permanent on the inquiry (website locale at submit).
 * - PDF: ONE renderer (`IndividualUmrahOfferDocument`) + templates; hotel/airline
 *   names and Euro amounts stay unchanged; labels translate.
 *
 * ## Structured Admin data vs translated customer text (spec 13)
 * Store **codes**, not display strings, whenever possible:
 * - `mealPlan = breakfast` → PDF: Frühstück / الإفطار / Breakfast / …
 * - `city = medina|makkah`, flight type from segments, baggage specs `{pieces,kg,kind}`,
 *   `roomType`, catalog add-on ids, `includedTermIds` / `excludedTermIds` / `noteTermIds`
 * Registry + label maps: `individual-umrah-offer-codes.ts`.
 * Free-text is only for true custom content (proper nouns, special notes).
 * This avoids manually translating every offer.
 *
 * ## Price data must never change by translation (spec 14)
 * Language is a **presentation layer only**. Calculate once from structured data:
 * flight `pricePerPerson`, hotel `roomPrices`, add-on `price`, stay dates, passenger
 * counts. Then render the translated PDF. Translation must never change:
 * prices, hotel calculations, room totals, flight prices, calendar dates, or
 * passenger numbers. Euro amounts always use Latin digits („150 €“); date values
 * stay Gregorian (month names may localize).
 *
 * ## German Admin / Arabic PDF example (spec 15)
 *
 * **Step 1 — Customer**  
 * Visits Arabic website → submits Individual Umrah inquiry → system saves
 * `customer_language = ar`.
 *
 * **Step 2 — Admin opens inquiry**  
 * Admin UI stays **completely German**, e.g. Neue Individuelle Umrah Anfrage,
 * Hotels auswählen, Flüge hinzufügen, Zusatzleistungen, Angebot erstellen, …
 * Anfragesprache badge: Arabisch. Free-text from the customer may still be Arabic.
 *
 * **Step 3 — Admin selects offer options (German UI)**  
 * Medina Hotel A / B, Makkah Hotel A / B, Turkish Airlines, Saudia, Transfer, Visa
 * (and prices). Stored as structured data + EUR — not as Arabic strings.
 *
 * **Step 4 — PDF Vorschau**  
 * Admin clicks **PDF Vorschau** → preview uses `offer_template_ar` automatically
 * (from `customer_language`, unless Angebotssprache override). Arabic **RTL** layout.
 *
 * **Step 5 — PDF herunterladen**  
 * Admin clicks **PDF herunterladen** → customer PDF is Arabic (same template).
 * Hotel/airline names and Euro amounts unchanged; labels translated.
 *
 * ## PDF file name (spec 16)
 * Automatic Latin ASCII filenames (never Arabic characters in the file name):
 * - German: `Mobarak_Umrah_Angebot_UMR-2026-4587.pdf`
 * - Arabic: `Mobarak_Umrah_Offer_UMR-2026-4587_AR.pdf`
 * - Other locales: `Mobarak_Umrah_Offer_…_EN|_TR|_BS.pdf`
 * Suggested via `document.title` on print/Save as PDF
 * (`individual-umrah-offer-pdf-filename.ts`).
 *
 * ## Version history includes language (spec 17)
 * Each generated PDF snapshot stores `pdfLanguage` at generation time. Admin history:
 * Angebot V1 / 25.08.2026 – 15:42 / Sprache: Arabisch — so we know which version
 * was sent in which language (e.g. V3 later in Deutsch).
 *
 * ## V1 scope (ship now — do not expand without an explicit product ask)
 * - Hotel catalog + Admin rate engine (categories, periods, meals, extra bed)
 * - Manual flight options (prices typed per offer; airlines from global catalog)
 * - Add-ons on the offer
 * - Automatic PDF generation / version history
 * - Alternatives stay uncombined (no misleading package grand total)
 *
 * ## Designed for later (plug in — do not rebuild)
 * - More cities beyond Medina / Makkah
 * - More hotel room categories (already free-form per hotel)
 * - More meal-plan catalog rows
 * - More add-on catalog entries / custom offer add-ons
 * - Automatic email / WhatsApp send
 * - Customer online offer acceptance
 * - Payment
 * - Supplier API rate feeds
 *
 * Module map (keep boundaries):
 * - Catalog: hotels API, airlines-store, meal-plans, add-on seed catalog
 * - Pricing engine: individual-umrah-hotel-rates-store (+ offer-pricing helpers)
 * - Offer document: IndividualUmrahOffer + editors + PDF document
 * - Delivery / acceptance / payment / suppliers: ports below (stubs until implemented)
 */

import type {
  IndividualUmrahOffer,
  OfferHotelOption,
} from "@/lib/individual-umrah-offer";
import type { IndividualUmrahInquiry } from "@/lib/individual-umrah-inquiry";

/** V1 city ids — also used as hotel.city values today. */
export const INDIVIDUAL_UMRAH_V1_CITY_IDS = ["medina", "makkah"] as const;
export type IndividualUmrahV1CityId = (typeof INDIVIDUAL_UMRAH_V1_CITY_IDS)[number];

/**
 * Extensible city id. V1 only uses medina | makkah.
 * Future cities (e.g. jeddah layover hotel) register here without renaming V1 fields.
 */
export type IndividualUmrahCityId = IndividualUmrahV1CityId | (string & {});

export type IndividualUmrahCityDefinition = {
  id: IndividualUmrahCityId;
  label: string;
  /** Distance / landmark hint for Admin & PDF copy. */
  landmarkLabelDe: string;
  /** Included in V1 product surface. */
  v1: boolean;
  sortOrder: number;
};

/** Registry — append rows for new cities; wire UI gradually. */
export const INDIVIDUAL_UMRAH_CITY_REGISTRY: IndividualUmrahCityDefinition[] = [
  {
    id: "medina",
    label: "Medina",
    landmarkLabelDe: "Prophetenmoschee",
    v1: true,
    sortOrder: 10,
  },
  {
    id: "makkah",
    label: "Makkah",
    landmarkLabelDe: "Haram",
    v1: true,
    sortOrder: 20,
  },
];

export function listV1OfferCities(): IndividualUmrahCityDefinition[] {
  return INDIVIDUAL_UMRAH_CITY_REGISTRY.filter((c) => c.v1).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

export function getCityDefinition(
  cityId: string,
): IndividualUmrahCityDefinition | null {
  return INDIVIDUAL_UMRAH_CITY_REGISTRY.find((c) => c.id === cityId) ?? null;
}

/**
 * Hotel alternatives for one city on an offer.
 * V1 stores Medina/Makkah as dedicated arrays; extra cities use `extraCityHotels`.
 */
export type OfferCityHotelBlock = {
  cityId: IndividualUmrahCityId;
  options: OfferHotelOption[];
};

/**
 * Normalize offer hotel sections into ordered city blocks (V1 + future cities).
 * Prefer this iterator in new PDF / readiness / sidebar code.
 */
export function listOfferHotelCityBlocks(
  offer: Pick<IndividualUmrahOffer, "medinaHotels" | "makkahHotels" | "extraCityHotels">,
  inquiry?: Pick<IndividualUmrahInquiry, "route" | "nights"> | null,
): OfferCityHotelBlock[] {
  const needsMedina =
    !inquiry ||
    (inquiry.route === "makkah_medina" && (inquiry.nights.medina_nights ?? 0) > 0);

  const blocks: OfferCityHotelBlock[] = [];
  if (needsMedina) {
    blocks.push({ cityId: "medina", options: offer.medinaHotels ?? [] });
  }
  blocks.push({ cityId: "makkah", options: offer.makkahHotels ?? [] });

  for (const extra of offer.extraCityHotels ?? []) {
    if (!extra?.cityId || extra.cityId === "medina" || extra.cityId === "makkah") {
      continue;
    }
    blocks.push({
      cityId: extra.cityId,
      options: Array.isArray(extra.options) ? extra.options : [],
    });
  }
  return blocks;
}

/** Future offer lifecycle — V1 UI only uses draft | ready. */
export type IndividualUmrahOfferLifecycleStatus =
  | "draft"
  | "ready"
  | "sent"
  | "viewed"
  | "accepted"
  | "declined"
  | "paid"
  | "expired"
  | "cancelled";

/**
 * Explicit recommended combination (not V1).
 * Spec 43: never invent Flight₁+Hotel₁+Hotel₁ totals without this.
 */
export type OfferRecommendedCombination = {
  id: string;
  label: string;
  flightOptionId: string | null;
  /** cityId → offer hotel option id */
  hotelOptionIdsByCity: Record<string, string>;
  addonOptionIds: string[];
  notes?: string;
};

/** —— Integration ports (no V1 implementation) —— */

export type OfferDeliveryChannel = "email" | "whatsapp" | "sms" | "link";

export type OfferDeliveryRequest = {
  offerId: string;
  inquiryId: string;
  channel: OfferDeliveryChannel;
  recipient: string;
  locale?: string;
  /** PDF snapshot id when sending a frozen version. */
  pdfSnapshotId?: string;
};

export type OfferDeliveryPort = {
  send(request: OfferDeliveryRequest): Promise<{ ok: boolean; messageId?: string }>;
};

export type OfferAcceptancePort = {
  /** Public token / link for customer to view & accept. */
  createAcceptanceSession(offerId: string): Promise<{ url: string; expiresAt: string }>;
  recordDecision(input: {
    offerId: string;
    decision: "accepted" | "declined";
    combinationId?: string;
  }): Promise<void>;
};

export type OfferPaymentPort = {
  createCheckout(input: {
    offerId: string;
    amountEur: number;
    currency?: "EUR";
  }): Promise<{ checkoutUrl: string }>;
};

/**
 * Supplier rate feed — later replaces / augments Admin-entered periods.
 * Engine input stays `IndividualUmrahHotelRate`; adapters map vendor payloads into that shape.
 */
export type SupplierHotelRatesPort = {
  pullHotelRates(hotelId: string): Promise<unknown>;
};

/** Documented V1 checklist for Admin / agents. */
export const INDIVIDUAL_UMRAH_V1_FEATURES = [
  "hotel_catalog",
  "hotel_rate_engine",
  "manual_flights",
  "airline_catalog",
  "offer_addons",
  "pdf_generation",
  "pdf_version_history",
  "manual_price_override",
  "missing_rate_guard",
  "alternatives_not_package_total",
] as const;

export const INDIVIDUAL_UMRAH_FUTURE_FEATURES = [
  "additional_cities",
  "additional_meal_plans",
  "additional_addons",
  "automatic_email_send",
  "customer_online_acceptance",
  "payment",
  "supplier_api_rates",
  "recommended_combinations",
] as const;

export type IndividualUmrahV1Feature = (typeof INDIVIDUAL_UMRAH_V1_FEATURES)[number];
export type IndividualUmrahFutureFeature =
  (typeof INDIVIDUAL_UMRAH_FUTURE_FEATURES)[number];
