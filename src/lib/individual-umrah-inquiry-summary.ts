/**
 * Admin-facing inquiry summary labels.
 * Spec: Admin UI is **always German** — structured field labels/values are German
 * regardless of inquiry.customer_language. Free-text the customer typed
 * (e.g. marketing “other” detail, names) is shown unchanged in the original language.
 */
import { INDIVIDUAL_UMRAH_AIRPORTS } from "@/data/individual-umrah";
import {
  INDIVIDUAL_UMRAH_ADDONS,
  INDIVIDUAL_UMRAH_TRAVEL_PRIORITIES,
  type IndividualUmrahTravelPriorityId,
} from "@/data/individual-umrah-final";
import { resolveAirlineName } from "@/lib/airlines-store";
import {
  resolveCustomerLanguage,
  type IndividualUmrahInquiry,
} from "@/lib/individual-umrah-inquiry";
import type { Locale } from "@/i18n/routing";

const AIRPORT_CITY_EN: Record<string, string> = {
  VIE: "Vienna",
  SZG: "Salzburg",
  MUC: "Munich",
  BUD: "Budapest",
};

const AIRPORT_CITY_DE: Record<string, string> = {
  VIE: "Wien",
  SZG: "Salzburg",
  MUC: "München",
  BUD: "Budapest",
};

const LANGUAGE_LABELS_DE: Record<Locale, string> = {
  de: "Deutsch",
  en: "Englisch",
  ar: "Arabisch",
  bs: "Bosnisch",
  tr: "Türkisch",
};

/** Exported for Admin badges (Anfragesprache). */
export const CUSTOMER_LANGUAGE_LABEL_DE = LANGUAGE_LABELS_DE;

export const CUSTOMER_LANGUAGE_FLAG: Record<Locale, string> = {
  de: "🇦🇹",
  en: "🇬🇧",
  ar: "🇸🇦",
  bs: "🇧🇦",
  tr: "🇹🇷",
};

const LANGUAGE_LABELS_EN: Record<Locale, string> = {
  de: "German",
  en: "English",
  ar: "Arabic",
  bs: "Bosnian",
  tr: "Turkish",
};

const AIRLINE_LABELS: Record<string, string> = {
  egyptair: "Egypt Air",
  pegasus: "Pegasus",
  turkish: "Turkish Airlines",
  ajet: "AJet",
  royal_jordanian: "Royal Jordanian",
  saudia: "Saudia",
  wizz_budapest: "Wizz Air",
};

const ADDON_LABELS: Record<string, string> = {
  city_transfer: "Transfer Medina → Makkah",
  religious_medina: "Religiöse Reiseführung in Medina",
  visa: "Visum für Saudi-Arabien",
};

const PRIORITY_LABELS_DE: Record<IndividualUmrahTravelPriorityId, string> = {
  near_haram: "Nähe zum Haram ist wichtig",
  luxury_hotel: "Luxushotel ist wichtig",
  low_price: "Günstiger Preis ist wichtig",
  enough_baggage: "Ich brauche ausreichend Gepäck",
  baggage_not_important: "Gepäck ist mir nicht so wichtig",
};

const PRIORITY_LABELS_EN: Record<IndividualUmrahTravelPriorityId, string> = {
  near_haram: "Proximity to the Haram is important",
  luxury_hotel: "Luxury hotel is important",
  low_price: "Favourable price is important",
  enough_baggage: "Ich brauche ausreichend Gepäck",
  baggage_not_important: "Gepäck ist mir nicht so wichtig",
};

/** Customer baggage preference from the inquiry (German form wording for Admin). */
export function inquiryBaggagePreferenceLabel(
  inquiry: IndividualUmrahInquiry,
): string | null {
  const priorities = inquiry.offer_prefs?.travel_priorities ?? [];
  if (priorities.includes("enough_baggage")) {
    return PRIORITY_LABELS_DE.enough_baggage;
  }
  if (priorities.includes("baggage_not_important")) {
    return PRIORITY_LABELS_DE.baggage_not_important;
  }
  return null;
}

const MARKETING_SOURCE_LABELS_DE: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  google: "Google",
  chatgpt: "ChatGPT",
  friend: "Empfehlung von Freunden",
  know: "Kennt uns bereits",
  other: "Sonstiges",
};

const MARKETING_SOURCE_LABELS_EN: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  google: "Google",
  chatgpt: "ChatGPT",
  friend: "Recommended by a friend",
  know: "Already knows us",
  other: "Other",
};

/**
 * Full admin-readable inquiry record (all customer-collected fields).
 */
export type IndividualUmrahInquirySummary = {
  title: string;
  inquiry_number: string;
  display_number: string;
  departure_airports: string;
  adults: string;
  children: string;
  infants: string;
  travellers: {
    adults_line: string;
    children_line: string;
    infants_line: string;
  };
  /** One line per child, or null when no children. */
  child_beds: string[] | null;
  /** Combined line e.g. "Ja" / "Nein" / "—" when none. */
  child_bed_summary: string;
  rooms: string;
  route: string;
  order: string | null;
  medina_nights: string;
  makkah_nights: string;
  preferred_departure: string;
  flexibility: string;
  preferred_airline: string;
  addons: string[];
  addons_line: string;
  travel_priorities: string[];
  travel_priorities_line: string;
  customer: {
    name: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    preferred_language: string;
  };
  marketing_source: string;
  marketing_source_detail: string | null;
  created_at_label: string;
  /** Human-readable label for Admin (always from `customer_language`). */
  website_language: string;
  /** Permanent submit locale code: de | ar | tr | bs | en. */
  customer_language: Locale;
  status: IndividualUmrahInquiry["status"];
};

/** Display id like `#1024` from `iu-2026-1024` or any trailing digits. */
export function formatInquiryDisplayNumber(inquiryId: string): string {
  const match = inquiryId.match(/(\d+)\s*$/);
  if (match?.[1]) {
    const n = match[1];
    return `#${n.length >= 4 ? n.slice(-4) : n.padStart(4, "0")}`;
  }
  return `#${inquiryId.slice(0, 8)}`;
}

function airportCityName(code: string, adminLocale: "de" | "en"): string {
  const map = adminLocale === "de" ? AIRPORT_CITY_DE : AIRPORT_CITY_EN;
  if (map[code]) return `${map[code]} (${code})`;
  const fromData = INDIVIDUAL_UMRAH_AIRPORTS.find((a) => a.code === code);
  return fromData ? `${fromData.code}` : code;
}

function formatPreferredDeparture(isoDate: string, adminLocale: "de" | "en"): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  const tag = adminLocale === "de" ? "de-AT" : "en-GB";
  return new Intl.DateTimeFormat(tag, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function pluralDe(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

function formatAirline(id: string | null | undefined): string {
  if (!id?.trim()) return "—";
  return AIRLINE_LABELS[id] ?? (resolveAirlineName(id) || id);
}

function formatAddon(id: string, _cityOrder: IndividualUmrahInquiry["city_order"]): string {
  if (id === "city_transfer") return ADDON_LABELS.city_transfer!;
  return ADDON_LABELS[id] ?? INDIVIDUAL_UMRAH_ADDONS.find((a) => a.id === id)?.id ?? id;
}

function formatPriority(id: string, adminLocale: "de" | "en"): string {
  const map = adminLocale === "de" ? PRIORITY_LABELS_DE : PRIORITY_LABELS_EN;
  if (id in map) return map[id as IndividualUmrahTravelPriorityId];
  const known = INDIVIDUAL_UMRAH_TRAVEL_PRIORITIES.find((p) => p.id === id);
  return known?.id ?? id;
}

function formatMarketingSource(
  source: string | null,
  detail: string | null | undefined,
  adminLocale: "de" | "en",
): { label: string; detail: string | null } {
  if (!source?.trim()) return { label: "—", detail: null };
  const map = adminLocale === "de" ? MARKETING_SOURCE_LABELS_DE : MARKETING_SOURCE_LABELS_EN;
  const label = map[source] ?? source;
  const extra = detail?.trim() ? detail.trim() : null;
  return { label, detail: extra };
}

/**
 * Build admin summary lines from a structured inquiry.
 * Always German for coded fields (travellers, route, nights, priorities, …).
 * Customer free-text is returned as stored (may be Arabic/etc.).
 */
export function formatIndividualUmrahInquirySummary(
  inquiry: IndividualUmrahInquiry,
  _options?: { adminLocale?: "de" | "en" },
): IndividualUmrahInquirySummary {
  // Admin area never switches language — ignore customer_language for labels.
  void _options;
  const display_number = formatInquiryDisplayNumber(inquiry.inquiry_id);

  const departure_airports = inquiry.airports
    .map((code) => airportCityName(code, "de"))
    .join(" · ");

  const child_beds =
    inquiry.children.length > 0
      ? inquiry.children.map((c, i) => {
          const answer = c.requires_bed ? "Ja" : "Nein";
          if (inquiry.children.length === 1) return answer;
          return `Kind ${i + 1}: ${answer}`;
        })
      : null;

  const child_bed_summary =
    inquiry.children.length === 0
      ? "—"
      : inquiry.children.length === 1
        ? inquiry.children[0]!.requires_bed
          ? "Ja"
          : "Nein"
        : inquiry.children.map((c) => (c.requires_bed ? "Ja" : "Nein")).join(", ");

  const flexibility =
    inquiry.travel_date.flexibility_days === null
      ? "Nicht angegeben"
      : inquiry.travel_date.flexibility_days === 0
        ? "Exaktes Datum"
        : `± ${inquiry.travel_date.flexibility_days} ${inquiry.travel_date.flexibility_days === 1 ? "Tag" : "Tage"}`;

  let created_at_label = inquiry.created_at;
  try {
    created_at_label = new Intl.DateTimeFormat("de-AT", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(inquiry.created_at));
  } catch {
    /* keep iso */
  }

  const prefs = inquiry.offer_prefs;
  const addons = (prefs?.addons ?? []).map((id) => formatAddon(id, inquiry.city_order));
  const travel_priorities = (prefs?.travel_priorities ?? []).map((id) =>
    formatPriority(id, "de"),
  );
  const marketing = formatMarketingSource(
    inquiry.marketing.source,
    inquiry.marketing.source_other_detail,
    "de",
  );

  const siteLang = resolveCustomerLanguage(inquiry);

  return {
    title: `Individuelle Umrah Anfrage ${display_number}`,
    inquiry_number: inquiry.inquiry_id,
    display_number,
    departure_airports: departure_airports || "—",
    adults: String(inquiry.travellers.adult_count),
    children: String(inquiry.travellers.child_count),
    infants: String(inquiry.travellers.infant_count),
    travellers: {
      adults_line: pluralDe(inquiry.travellers.adult_count, "Erwachsener", "Erwachsene"),
      children_line: pluralDe(inquiry.travellers.child_count, "Kind", "Kinder"),
      infants_line: pluralDe(inquiry.travellers.infant_count, "Säugling", "Säuglinge"),
    },
    child_beds,
    child_bed_summary,
    rooms: String(inquiry.rooms.room_count),
    route: inquiry.route === "makkah_only" ? "Nur Makkah" : "Makkah + Medina",
    order:
      inquiry.city_order === "makkah_first"
        ? "Makkah zuerst"
        : inquiry.city_order === "medina_first"
          ? "Medina zuerst"
          : null,
    medina_nights:
      inquiry.route === "makkah_medina"
        ? pluralDe(inquiry.nights.medina_nights, "Nacht Medina", "Nächte Medina")
        : "—",
    makkah_nights: pluralDe(
      inquiry.nights.makkah_nights,
      "Nacht Makkah",
      "Nächte Makkah",
    ),
    preferred_departure: formatPreferredDeparture(
      inquiry.travel_date.requested_start_date,
      "de",
    ),
    flexibility,
    preferred_airline: formatAirline(prefs?.preferred_airline),
    addons,
    addons_line: addons.length > 0 ? addons.join(" · ") : "—",
    travel_priorities,
    travel_priorities_line:
      travel_priorities.length > 0 ? travel_priorities.join(" · ") : "—",
    customer: {
      name: `${inquiry.contact.first_name} ${inquiry.contact.last_name}`.trim(),
      first_name: inquiry.contact.first_name,
      last_name: inquiry.contact.last_name,
      phone: `${inquiry.contact.phone_country_code} ${inquiry.contact.phone_number}`.trim(),
      email: inquiry.contact.email?.trim() || "—",
      preferred_language:
        LANGUAGE_LABELS_DE[(inquiry.contact.preferred_language as Locale) ?? "de"] ??
        inquiry.contact.preferred_language,
    },
    marketing_source: marketing.label,
    /** Original free-text — keep as customer wrote it (any language). */
    marketing_source_detail: marketing.detail,
    created_at_label,
    website_language: LANGUAGE_LABELS_DE[siteLang] ?? siteLang,
    customer_language: siteLang,
    status: inquiry.status,
  };
}
