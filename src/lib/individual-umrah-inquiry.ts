import {
  INDIVIDUAL_UMRAH_AIRPORTS,
  INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS,
  type IndividualUmrahCityOrder,
  type IndividualUmrahItinerary,
  type IndividualUmrahPhoneCountryCode,
} from "@/data/individual-umrah";
import { buildRequestedStartDate } from "@/lib/individual-umrah-date";
import type { IndividualUmrahFormData } from "@/lib/individual-umrah-validation";
import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";

/** IATA codes persisted on the inquiry (§41). */
export type IndividualUmrahAirportCode = "VIE" | "SZG" | "MUC" | "BUD";

/**
 * Admin inquiry pipeline statuses.
 * Legacy values (`in_progress` / `offered` / `closed`) are normalized on read.
 */
export type IndividualUmrahInquiryStatus =
  | "new"
  | "offer_in_preparation"
  | "offer_created"
  | "offer_sent"
  | "customer_interested"
  | "booked"
  | "cancelled";

export const INDIVIDUAL_UMRAH_INQUIRY_STATUSES: IndividualUmrahInquiryStatus[] = [
  "new",
  "offer_in_preparation",
  "offer_created",
  "offer_sent",
  "customer_interested",
  "booked",
  "cancelled",
];

/**
 * §41 — structured Individual Umrah inquiry payload for persistence / API.
 * Flat nested groups match the product data model (not the UI form shape).
 */
export type IndividualUmrahInquiry = {
  inquiry_id: string;
  created_at: string;
  /**
   * Website locale at submit (`de` | `ar` | `tr` | `bs` | `en`).
   * Stored permanently with the inquiry — never rewritten by Admin status/offer edits.
   * Distinct from `contact.preferred_language` (customer’s stated preference).
   */
  customer_language: Locale;
  status: IndividualUmrahInquiryStatus;

  airports: IndividualUmrahAirportCode[];

  travellers: {
    adult_count: number;
    child_count: number;
    infant_count: number;
  };

  /** One entry per child; empty when `child_count === 0`. */
  children: Array<{
    requires_bed: boolean;
  }>;

  rooms: {
    room_count: number;
  };

  route: IndividualUmrahItinerary;

  /** `null` when route is Makkah only (§41). */
  city_order: IndividualUmrahCityOrder | null;

  nights: {
    makkah_nights: number;
    /** `0` when route is Makkah only. */
    medina_nights: number;
  };

  travel_date: {
    /** `YYYY-MM` from the month dropdown. */
    start_month: string;
    /** Exact customer-selected day `YYYY-MM-DD` — never rewritten by flexibility. */
    requested_start_date: string;
    /** `null` if flexibility was not selected; `0` = exact; `1`–`4` = ± days. */
    flexibility_days: number | null;
  };

  contact: {
    first_name: string;
    last_name: string;
    /** Dial prefix e.g. `+43`. */
    phone_country_code: string;
    phone_number: string;
    /** `null` when empty (optional). */
    email: string | null;
    preferred_language: Locale;
  };

  marketing: {
    /** `null` when unanswered (optional). */
    source: string | null;
    source_other_detail?: string | null;
  };

  /** Optional Step-2 fields for offer builder / PDF. */
  offer_prefs?: {
    preferred_airline: string | null;
    addons: string[];
    /** Customer travel priorities (multi-select); empty when unanswered. */
    travel_priorities?: string[];
    travellers: Array<{
      type: "adult" | "child" | "infant";
      first_name: string;
      last_name: string;
      nationality: string;
      nationality_code: string;
      passport_type: string;
    }>;
  };
};

const AIRPORT_ID_TO_CODE = Object.fromEntries(
  INDIVIDUAL_UMRAH_AIRPORTS.map((a) => [a.id, a.code as IndividualUmrahAirportCode]),
) as Record<string, IndividualUmrahAirportCode>;

function dialForPhoneCountry(code: string): string {
  const match = INDIVIDUAL_UMRAH_PHONE_DIAL_OPTIONS.find(
    (d) => d.code === (code as IndividualUmrahPhoneCountryCode),
  );
  return match?.dial ?? "+43";
}

function newInquiryId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `iu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Valid customer_language codes (website locales). */
export const INDIVIDUAL_UMRAH_CUSTOMER_LANGUAGES = locales;

export function isIndividualUmrahCustomerLanguage(
  value: string | null | undefined,
): value is Locale {
  return Boolean(value && (locales as readonly string[]).includes(value));
}

/**
 * Resolve permanent submit language from a stored inquiry.
 * Accepts legacy `language` / `website_locale` for older localStorage rows.
 */
export function resolveCustomerLanguage(
  inquiry: {
    customer_language?: string | null;
    language?: string | null;
    website_locale?: string | null;
  },
): Locale {
  const raw =
    inquiry.customer_language ?? inquiry.language ?? inquiry.website_locale ?? "de";
  return isIndividualUmrahCustomerLanguage(raw) ? raw : "de";
}

/** Ensure `customer_language` is set; keeps record shape stable for Admin/API. */
export function normalizeInquiryCustomerLanguage<T extends object>(
  inquiry: T & {
    customer_language?: string | null;
    language?: string | null;
    website_locale?: string | null;
  },
): T & { customer_language: Locale } {
  return {
    ...inquiry,
    customer_language: resolveCustomerLanguage(inquiry),
  };
}

/**
 * Map validated form state → §41 inquiry record.
 * Returns `null` if required travel date fields cannot be resolved
 * (call only after `validateIndividualUmrahForm` succeeds).
 */
export function buildIndividualUmrahInquiry(
  data: IndividualUmrahFormData,
  options: {
    /** Website locale at submit → stored as `customer_language`. */
    language: Locale;
    status?: IndividualUmrahInquiryStatus;
    inquiry_id?: string;
    created_at?: string;
  },
  finalExtras?: {
    pax?: Array<{
      type: "adult" | "child" | "infant";
      firstName: string;
      lastName: string;
      nationality: string;
      nationalityCode: string;
      passportType: string;
    }>;
    airline?: string | null;
    addons?: string[];
    travelPriorities?: string[];
    sourceOtherDetail?: string | null;
  },
): IndividualUmrahInquiry | null {
  if (data.itinerary !== "makkah_only" && data.itinerary !== "makkah_medina") {
    return null;
  }

  const requested_start_date = buildRequestedStartDate(data.travelMonth, data.travelDay);
  if (!requested_start_date || !data.travelMonth) return null;

  if (!data.preferredLanguage || !(locales as readonly string[]).includes(data.preferredLanguage)) {
    return null;
  }

  const airports = data.airports
    .map((id) => AIRPORT_ID_TO_CODE[id])
    .filter((code): code is IndividualUmrahAirportCode => Boolean(code));

  if (!airports.length) return null;

  const makkahOnly = data.itinerary === "makkah_only";

  // Only emit children that have a definitive answer (validation already requires this)
  if (data.children > 0 && data.childNeedsBed.slice(0, data.children).some((a) => a === null)) {
    return null;
  }

  const children: IndividualUmrahInquiry["children"] =
    data.children > 0
      ? data.childNeedsBed.slice(0, data.children).map((answer) => ({
          requires_bed: Boolean(answer),
        }))
      : [];

  const email = data.email.trim();
  const source = data.source.trim();
  const customer_language = isIndividualUmrahCustomerLanguage(options.language)
    ? options.language
    : "de";

  return {
    inquiry_id: options.inquiry_id ?? newInquiryId(),
    created_at: options.created_at ?? new Date().toISOString(),
    customer_language,
    status: options.status ?? "new",

    airports,

    travellers: {
      adult_count: data.adults,
      child_count: data.children,
      infant_count: data.infants,
    },

    children,

    rooms: {
      room_count: data.rooms,
    },

    route: data.itinerary,

    city_order: makkahOnly
      ? null
      : data.cityOrder === "makkah_first" || data.cityOrder === "medina_first"
        ? data.cityOrder
        : null,

    nights: {
      makkah_nights: data.nightsMakkah,
      medina_nights: makkahOnly ? 0 : data.nightsMedina,
    },

    travel_date: {
      start_month: data.travelMonth,
      requested_start_date,
      flexibility_days: data.flexibilityDays,
    },

    contact: {
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      phone_country_code: dialForPhoneCountry(data.phoneCountry),
      phone_number: data.phone.trim(),
      email: email ? email : null,
      preferred_language: data.preferredLanguage,
    },

    marketing: {
      source: source ? source : null,
      source_other_detail: finalExtras?.sourceOtherDetail?.trim()
        ? finalExtras.sourceOtherDetail.trim()
        : null,
    },
    offer_prefs: {
      preferred_airline: finalExtras?.airline?.trim() ? finalExtras.airline.trim() : null,
      addons: finalExtras?.addons ?? [],
      travel_priorities: finalExtras?.travelPriorities ?? [],
      travellers: (finalExtras?.pax ?? []).map((p) => ({
        type: p.type,
        first_name: p.firstName,
        last_name: p.lastName,
        nationality: p.nationality,
        nationality_code: p.nationalityCode,
        passport_type: p.passportType,
      })),
    },
  };
}
