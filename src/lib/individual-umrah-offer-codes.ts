/**
 * Structured Admin data codes → PDF translation layer.
 *
 * Principle (spec 13): store codes, never language-bound display strings as the
 * source of truth. Admin UI shows German labels; the customer PDF resolves codes
 * into de|ar|en|tr|bs via this module / offer PDF templates.
 *
 * Free-text is allowed only for true custom content (proper nouns, special notes).
 */
import type { Locale } from "@/i18n/routing";
import type { HotelMealPlanId } from "@/lib/hotel-meal-plans";
import { HOTEL_MEAL_PLANS } from "@/lib/hotel-meal-plans";

export type OfferCodeLocale = Locale;

/* ─── Cities ─────────────────────────────────────────────────────────────── */

export const OFFER_CITY_CODES = ["medina", "makkah"] as const;
export type OfferCityCode = (typeof OFFER_CITY_CODES)[number];

export const OFFER_CITY_LABEL: Record<
  OfferCityCode,
  Record<OfferCodeLocale, string>
> = {
  medina: {
    de: "Medina",
    en: "Medina",
    ar: "المدينة",
    tr: "Medine",
    bs: "Medina",
  },
  makkah: {
    de: "Makkah",
    en: "Makkah",
    ar: "مكة",
    tr: "Mekke",
    bs: "Mekka",
  },
};

export function isOfferCityCode(value: string | null | undefined): value is OfferCityCode {
  return Boolean(value && (OFFER_CITY_CODES as readonly string[]).includes(value));
}

export function labelOfferCity(
  code: OfferCityCode,
  lang: OfferCodeLocale,
): string {
  return OFFER_CITY_LABEL[code][lang] ?? OFFER_CITY_LABEL[code].de;
}

/* ─── Meal plans ─────────────────────────────────────────────────────────── */

/** Offer / PDF meal plan codes (extends hotel catalog plans + optional breakfast). */
export const OFFER_MEAL_PLAN_CODES = [
  "room_only",
  "breakfast",
  "breakfast_optional",
  "half_board",
  "full_board",
  "all_inclusive",
] as const;

export type OfferMealPlanCode = (typeof OFFER_MEAL_PLAN_CODES)[number];

export const OFFER_MEAL_PLAN_LABEL: Record<
  OfferMealPlanCode,
  Record<OfferCodeLocale, string>
> = {
  room_only: {
    de: "Nur Übernachtung",
    en: "Room only",
    ar: "مبيت فقط",
    tr: "Sadece konaklama",
    bs: "Samo noćenje",
  },
  breakfast: {
    de: "Frühstück inklusive",
    en: "Breakfast included",
    ar: "الإفطار مشمول",
    tr: "Kahvaltı dahil",
    bs: "Doručak uključen",
  },
  breakfast_optional: {
    de: "Frühstück (optional)",
    en: "Breakfast (optional)",
    ar: "الإفطار (اختياري)",
    tr: "Kahvaltı (opsiyonel)",
    bs: "Doručak (opcionalno)",
  },
  half_board: {
    de: "Halbpension",
    en: "Half board",
    ar: "نصف إقامة",
    tr: "Yarım pansiyon",
    bs: "Polupansion",
  },
  full_board: {
    de: "Vollpension",
    en: "Full board",
    ar: "إقامة كاملة",
    tr: "Tam pansiyon",
    bs: "Pun pansion",
  },
  all_inclusive: {
    de: "All Inclusive",
    en: "All inclusive",
    ar: "شامل كليًا",
    tr: "Her şey dahil",
    bs: "All inclusive",
  },
};

/** Short Admin German labels (select options). */
export const OFFER_MEAL_PLAN_LABEL_DE: Record<OfferMealPlanCode, string> = {
  room_only: "Nur Übernachtung",
  breakfast: "Frühstück",
  breakfast_optional: "Frühstück (optional)",
  half_board: "Halbpension",
  full_board: "Vollpension",
  all_inclusive: "All Inclusive",
};

export function isOfferMealPlanCode(
  value: string | null | undefined,
): value is OfferMealPlanCode {
  return Boolean(value && (OFFER_MEAL_PLAN_CODES as readonly string[]).includes(value));
}

export function labelOfferMealPlan(
  code: OfferMealPlanCode,
  lang: OfferCodeLocale,
): string {
  return OFFER_MEAL_PLAN_LABEL[code][lang] ?? OFFER_MEAL_PLAN_LABEL[code].de;
}

/** Map free-text / legacy board labels → structured meal_plan code. */
export function resolveMealPlanCodeFromLabel(
  label: string | null | undefined,
  breakfastMode?: "included" | "optional" | "priced" | null,
): OfferMealPlanCode | null {
  const key = (label ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (
    key === "all inclusive" ||
    key === "all-inclusive" ||
    key === "ai" ||
    key === "her sey dahil" ||
    key.includes("شامل")
  ) {
    return "all_inclusive";
  }
  if (
    key === "halbpension" ||
    key === "half board" ||
    key === "half-board" ||
    key === "hb" ||
    key === "yarim pansiyon" ||
    key === "polupansion" ||
    key.includes("نصف")
  ) {
    return "half_board";
  }
  if (
    key === "vollpension" ||
    key === "full board" ||
    key === "full-board" ||
    key === "fb" ||
    key === "tam pansiyon" ||
    key === "pun pansion" ||
    key.includes("كاملة")
  ) {
    return "full_board";
  }
  if (
    key === "nur ubernachtung" ||
    key === "nur übernachtung" ||
    key === "room only" ||
    key === "ro" ||
    key === "sadece konaklama" ||
    key === "samo nocenje" ||
    key.includes("مبيت فقط")
  ) {
    return "room_only";
  }
  if (
    key.includes("optional") ||
    key.includes("اختياري") ||
    key.includes("opsiyonel") ||
    key.includes("opcionalno")
  ) {
    return "breakfast_optional";
  }
  if (
    !key ||
    key === "fruhstuck" ||
    key === "frühstück" ||
    key === "fruhstuck inklusive" ||
    key === "frühstück inklusive" ||
    key === "breakfast" ||
    key === "breakfast included" ||
    key === "kahvalti" ||
    key === "kahvaltı" ||
    key === "kahvalti dahil" ||
    key === "dorucak" ||
    key === "dorucak ukljucen" ||
    key.includes("افطار") ||
    key.includes("إفطار")
  ) {
    if (breakfastMode === "optional") return "breakfast_optional";
    return "breakfast";
  }

  if (breakfastMode === "optional") return "breakfast_optional";
  if (breakfastMode === "included" || breakfastMode === "priced") return "breakfast";
  return null;
}

export function hotelCatalogMealPlanToOfferCode(
  id: HotelMealPlanId | string | null | undefined,
): OfferMealPlanCode | null {
  if (!id) return null;
  if (id === "breakfast") return "breakfast";
  if (id === "half_board") return "half_board";
  if (id === "full_board") return "full_board";
  if (id === "room_only") return "room_only";
  return isOfferMealPlanCode(id) ? id : null;
}

export function mealPlanCodeFromBreakfastMode(
  mode: "included" | "optional" | "priced",
): OfferMealPlanCode {
  if (mode === "optional") return "breakfast_optional";
  return "breakfast";
}

/** Admin select options (German UI). */
export function offerMealPlanAdminOptions(): {
  value: OfferMealPlanCode;
  label: string;
}[] {
  return OFFER_MEAL_PLAN_CODES.map((value) => ({
    value,
    label: OFFER_MEAL_PLAN_LABEL_DE[value],
  }));
}

export function hotelMealPlanAdminOptions(): {
  value: HotelMealPlanId;
  label: string;
}[] {
  return HOTEL_MEAL_PLANS.map((p) => ({ value: p.id, label: p.label }));
}

/* ─── Flight type ────────────────────────────────────────────────────────── */

export const OFFER_FLIGHT_TYPE_CODES = ["direct", "stops"] as const;
export type OfferFlightTypeCode = (typeof OFFER_FLIGHT_TYPE_CODES)[number];

export function flightTypeFromSegmentCount(segmentCount: number): OfferFlightTypeCode {
  return segmentCount <= 1 ? "direct" : "stops";
}

export function labelOfferFlightType(
  code: OfferFlightTypeCode,
  stopCount: number,
  lang: OfferCodeLocale,
): string {
  if (code === "direct") {
    const map: Record<OfferCodeLocale, string> = {
      de: "Direktflug",
      en: "Direct flight",
      ar: "رحلة مباشرة",
      tr: "Direkt uçuş",
      bs: "Direktni let",
    };
    return map[lang];
  }
  const map: Record<OfferCodeLocale, (n: number) => string> = {
    de: (n) => (n === 1 ? "1 Stopp" : `${n} Stopps`),
    en: (n) => (n === 1 ? "1 stop" : `${n} stops`),
    ar: (n) => (n === 1 ? "توقف واحد" : n === 2 ? "توقفان" : `${n} توقفات`),
    tr: (n) => (n === 1 ? "1 aktarma" : `${n} aktarma`),
    bs: (n) => (n === 1 ? "1 stajanje" : `${n} stajanja`),
  };
  return map[lang](Math.max(1, stopCount));
}

/* ─── Baggage ────────────────────────────────────────────────────────────── */

export const OFFER_BAGGAGE_KIND_CODES = ["checked", "hand"] as const;
export type OfferBaggageKindCode = (typeof OFFER_BAGGAGE_KIND_CODES)[number];

export type OfferBaggageSpec = {
  kind: OfferBaggageKindCode;
  /** Number of pieces (checked). Hand baggage usually 1. */
  pieces: number;
  /** kg per piece (or total for hand). */
  kg: number;
};

export const OFFER_BAGGAGE_KIND_LABEL: Record<
  OfferBaggageKindCode,
  Record<OfferCodeLocale, string>
> = {
  checked: {
    de: "Freigepäck",
    en: "checked baggage",
    ar: "أمتعة مسجّلة",
    tr: "kayıtlı bagaj",
    bs: "predani prtljag",
  },
  hand: {
    de: "Handgepäck",
    en: "hand baggage",
    ar: "أمتعة يدوية",
    tr: "el bagajı",
    bs: "ručni prtljag",
  },
};

export function labelOfferBaggageSpec(
  spec: OfferBaggageSpec,
  lang: OfferCodeLocale,
): string {
  const word = OFFER_BAGGAGE_KIND_LABEL[spec.kind][lang];
  if (spec.kind === "hand" || spec.pieces <= 1) {
    return `${spec.kg} kg ${word}`;
  }
  return `${spec.pieces} × ${spec.kg} kg ${word}`;
}

/** Parse legacy Admin strings like „2 × 23 kg Freigepäck“. */
export function parseBaggageSpecFromLabel(
  label: string | null | undefined,
  fallbackKind: OfferBaggageKindCode,
): OfferBaggageSpec | null {
  const raw = (label ?? "").trim();
  if (!raw || raw === "—") return null;

  const piecesMatch = raw.match(/(\d+)\s*[×xX]\s*(\d+)\s*kg/i);
  if (piecesMatch) {
    return {
      kind: fallbackKind,
      pieces: Math.max(1, Number(piecesMatch[1]) || 1),
      kg: Math.max(0, Number(piecesMatch[2]) || 0),
    };
  }
  const kgMatch = raw.match(/(\d+)\s*kg/i);
  if (kgMatch) {
    return {
      kind: fallbackKind,
      pieces: 1,
      kg: Math.max(0, Number(kgMatch[1]) || 0),
    };
  }
  return null;
}

/* ─── Room types ─────────────────────────────────────────────────────────── */

export const OFFER_ROOM_TYPE_CODES = [
  "standard",
  "standard_double",
  "standard_twin",
  "deluxe",
  "deluxe_double",
  "suite",
  "family",
  "triple",
  "quad",
] as const;

export type OfferRoomTypeCode = (typeof OFFER_ROOM_TYPE_CODES)[number];

export const OFFER_ROOM_TYPE_LABEL: Record<
  OfferRoomTypeCode,
  Record<OfferCodeLocale, string>
> = {
  standard: {
    de: "Standardzimmer",
    en: "Standard Room",
    ar: "غرفة قياسية",
    tr: "Standart Oda",
    bs: "Standardna soba",
  },
  standard_double: {
    de: "Standard Doppelzimmer",
    en: "Standard Double",
    ar: "غرفة مزدوجة قياسية",
    tr: "Standart Çift Kişilik",
    bs: "Standardni dvokrevetni",
  },
  standard_twin: {
    de: "Standard Twin",
    en: "Standard Twin",
    ar: "غرفة توأم قياسية",
    tr: "Standart Twin",
    bs: "Standardni twin",
  },
  deluxe: {
    de: "Deluxe-Zimmer",
    en: "Deluxe Room",
    ar: "غرفة ديلوكس",
    tr: "Deluxe Oda",
    bs: "Deluxe soba",
  },
  deluxe_double: {
    de: "Deluxe Doppelzimmer",
    en: "Deluxe Double",
    ar: "غرفة ديلوكس مزدوجة",
    tr: "Deluxe Çift Kişilik",
    bs: "Deluxe dvokrevetni",
  },
  suite: {
    de: "Suite",
    en: "Suite",
    ar: "جناح",
    tr: "Suit",
    bs: "Suite",
  },
  family: {
    de: "Familienzimmer",
    en: "Family Room",
    ar: "غرفة عائلية",
    tr: "Aile Odası",
    bs: "Porodična soba",
  },
  triple: {
    de: "Dreibettzimmer",
    en: "Triple Room",
    ar: "غرفة ثلاثية",
    tr: "Üç Kişilik Oda",
    bs: "Trokrevetna soba",
  },
  quad: {
    de: "Vierbettzimmer",
    en: "Quad Room",
    ar: "غرفة رباعية",
    tr: "Dört Kişilik Oda",
    bs: "Četverokrevetna soba",
  },
};

const ROOM_NAME_TO_CODE: Array<{ match: RegExp; code: OfferRoomTypeCode }> = [
  { match: /deluxe\s*double|deluxe\s*doppel/i, code: "deluxe_double" },
  { match: /standard\s*double|standard\s*doppel/i, code: "standard_double" },
  { match: /standard\s*twin/i, code: "standard_twin" },
  { match: /family|familien/i, code: "family" },
  { match: /triple|dreibett|ثلاث/i, code: "triple" },
  { match: /quad|vierbett|رباع/i, code: "quad" },
  { match: /suite|جناح|suit/i, code: "suite" },
  { match: /deluxe|ديلوكس/i, code: "deluxe" },
  { match: /standard|قياسي|standart/i, code: "standard" },
];

export function isOfferRoomTypeCode(
  value: string | null | undefined,
): value is OfferRoomTypeCode {
  return Boolean(value && (OFFER_ROOM_TYPE_CODES as readonly string[]).includes(value));
}

export function resolveRoomTypeCodeFromName(
  name: string | null | undefined,
): OfferRoomTypeCode | null {
  const raw = (name ?? "").trim();
  if (!raw) return null;
  for (const row of ROOM_NAME_TO_CODE) {
    if (row.match.test(raw)) return row.code;
  }
  return null;
}

export function labelOfferRoomType(
  code: OfferRoomTypeCode,
  lang: OfferCodeLocale,
): string {
  return OFFER_ROOM_TYPE_LABEL[code][lang] ?? OFFER_ROOM_TYPE_LABEL[code].de;
}

/* ─── Catalog add-ons (ids are already structured) ───────────────────────── */

export const OFFER_CATALOG_ADDON_CODES = [
  "city_transfer",
  "religious_medina",
  "visa",
] as const;

export type OfferCatalogAddonCode = (typeof OFFER_CATALOG_ADDON_CODES)[number];

export function isOfferCatalogAddonCode(
  value: string | null | undefined,
): value is OfferCatalogAddonCode {
  return Boolean(
    value && (OFFER_CATALOG_ADDON_CODES as readonly string[]).includes(value),
  );
}

/* ─── Included / excluded / notes term codes ─────────────────────────────── */

export const OFFER_INCLUDED_TERM_CODES = [
  "accommodation",
  "flight",
  "taxes_fees",
  "personal_support",
] as const;

export const OFFER_EXCLUDED_TERM_CODES = [
  "visa_unless_selected",
  "travel_insurance",
  "meals_unless_included",
  "personal_expenses",
] as const;

export const OFFER_NOTE_TERM_CODES = [
  "non_binding",
  "availability_changes",
  "recheck_after_confirm",
] as const;

export type OfferIncludedTermCode = (typeof OFFER_INCLUDED_TERM_CODES)[number];
export type OfferExcludedTermCode = (typeof OFFER_EXCLUDED_TERM_CODES)[number];
export type OfferNoteTermCode = (typeof OFFER_NOTE_TERM_CODES)[number];

export const OFFER_INCLUDED_TERM_LABEL: Record<
  OfferIncludedTermCode,
  Record<OfferCodeLocale, string>
> = {
  accommodation: {
    de: "Unterkunft in Medina und Makkah gemäß Auswahl",
    en: "Accommodation in Medina and Makkah as selected",
    ar: "الإقامة في المدينة ومكة حسب الاختيار",
    tr: "Seçime göre Medine ve Mekke’de konaklama",
    bs: "Smještaj u Medini i Mekki prema odabiru",
  },
  flight: {
    de: "Flug gemäß ausgewählter Airline",
    en: "Flight with the selected airline",
    ar: "الطيران وفق شركة الطيران المختارة",
    tr: "Seçilen havayolu ile uçuş",
    bs: "Let odabranom aviokompanijom",
  },
  taxes_fees: {
    de: "Steuern und Gebühren",
    en: "Taxes and fees",
    ar: "الضرائب والرسوم",
    tr: "Vergiler ve harçlar",
    bs: "Porezi i naknade",
  },
  personal_support: {
    de: "Persönliche Betreuung vor, während und nach der Reise",
    en: "Personal support before, during and after the journey",
    ar: "رعاية شخصية قبل وأثناء وبعد الرحلة",
    tr: "Yolculuk öncesi, sırası ve sonrası kişisel destek",
    bs: "Lična podrška prije, tokom i nakon putovanja",
  },
};

export const OFFER_EXCLUDED_TERM_LABEL: Record<
  OfferExcludedTermCode,
  Record<OfferCodeLocale, string>
> = {
  visa_unless_selected: {
    de: "Visum – falls nicht ausgewählt",
    en: "Visa – if not selected",
    ar: "التأشيرة – إن لم تُختَر",
    tr: "Vize – seçilmemişse",
    bs: "Viza – ako nije odabrana",
  },
  travel_insurance: {
    de: "Reiseversicherung",
    en: "Travel insurance",
    ar: "تأمين السفر",
    tr: "Seyahat sigortası",
    bs: "Putno osiguranje",
  },
  meals_unless_included: {
    de: "Mahlzeiten – sofern nicht in Hotelrate enthalten",
    en: "Meals – unless included in the hotel rate",
    ar: "الوجبات – ما لم تكن مشمولة في سعر الفندق",
    tr: "Yemekler – otel ücretine dahil değilse",
    bs: "Obroci – ako nisu uključeni u hotelsku cijenu",
  },
  personal_expenses: {
    de: "Persönliche Ausgaben",
    en: "Personal expenses",
    ar: "المصاريف الشخصية",
    tr: "Kişisel harcamalar",
    bs: "Lični troškovi",
  },
};

export const OFFER_NOTE_TERM_LABEL: Record<
  OfferNoteTermCode,
  Record<OfferCodeLocale, string>
> = {
  non_binding: {
    de: "Dieses Angebot ist unverbindlich.",
    en: "This offer is non-binding.",
    ar: "هذا العرض غير ملزم.",
    tr: "Bu teklif bağlayıcı değildir.",
    bs: "Ova ponuda nije obavezujuća.",
  },
  availability_changes: {
    de: "Verfügbarkeit und Preise können sich jederzeit ändern.",
    en: "Availability and prices may change at any time.",
    ar: "قد تتغير التوافر والأسعار في أي وقت.",
    tr: "Müsaitlik ve fiyatlar her an değişebilir.",
    bs: "Dostupnost i cijene se mogu promijeniti u bilo kojem trenutku.",
  },
  recheck_after_confirm: {
    de: "Nach Bestätigung prüfen wir alle ausgewählten Leistungen erneut und senden Ihnen anschließend die verbindliche Buchungsbestätigung.",
    en: "After confirmation we re-check all selected services and then send you the binding booking confirmation.",
    ar: "بعد التأكيد نعيد التحقق من جميع الخدمات المختارة ثم نرسل لكم تأكيد الحجز الملزم.",
    tr: "Onaydan sonra seçilen tüm hizmetleri yeniden kontrol eder ve bağlayıcı rezervasyon onayını göndeririz.",
    bs: "Nakon potvrde ponovo provjeravamo sve odabrane usluge i šaljemo vam obavezujuću potvrdu rezervacije.",
  },
};

function invertTermLabels<T extends string>(
  map: Record<T, Record<OfferCodeLocale, string>>,
): Map<string, T> {
  const out = new Map<string, T>();
  for (const [code, labels] of Object.entries(map) as [T, Record<OfferCodeLocale, string>][]) {
    for (const text of Object.values(labels)) {
      out.set(text, code);
    }
  }
  return out;
}

const INCLUDED_TEXT_TO_CODE = invertTermLabels(OFFER_INCLUDED_TERM_LABEL);
const EXCLUDED_TEXT_TO_CODE = invertTermLabels(OFFER_EXCLUDED_TERM_LABEL);
const NOTE_TEXT_TO_CODE = invertTermLabels(OFFER_NOTE_TERM_LABEL);

export function resolveIncludedTermCode(text: string): OfferIncludedTermCode | null {
  return INCLUDED_TEXT_TO_CODE.get(text.trim()) ?? null;
}

export function resolveExcludedTermCode(text: string): OfferExcludedTermCode | null {
  return EXCLUDED_TEXT_TO_CODE.get(text.trim()) ?? null;
}

export function resolveNoteTermCode(text: string): OfferNoteTermCode | null {
  return NOTE_TEXT_TO_CODE.get(text.trim()) ?? null;
}

export function isOfferIncludedTermCode(
  value: string | null | undefined,
): value is OfferIncludedTermCode {
  return Boolean(
    value && (OFFER_INCLUDED_TERM_CODES as readonly string[]).includes(value),
  );
}

export function isOfferExcludedTermCode(
  value: string | null | undefined,
): value is OfferExcludedTermCode {
  return Boolean(
    value && (OFFER_EXCLUDED_TERM_CODES as readonly string[]).includes(value),
  );
}

export function isOfferNoteTermCode(
  value: string | null | undefined,
): value is OfferNoteTermCode {
  return Boolean(
    value && (OFFER_NOTE_TERM_CODES as readonly string[]).includes(value),
  );
}

export function labelIncludedTerm(
  code: OfferIncludedTermCode,
  lang: OfferCodeLocale,
): string {
  return OFFER_INCLUDED_TERM_LABEL[code][lang];
}

export function labelExcludedTerm(
  code: OfferExcludedTermCode,
  lang: OfferCodeLocale,
): string {
  return OFFER_EXCLUDED_TERM_LABEL[code][lang];
}

export function labelNoteTerm(code: OfferNoteTermCode, lang: OfferCodeLocale): string {
  return OFFER_NOTE_TERM_LABEL[code][lang];
}

/** Default stock term codes for new offers. */
export const DEFAULT_INCLUDED_TERM_CODES: OfferIncludedTermCode[] = [
  ...OFFER_INCLUDED_TERM_CODES,
];
export const DEFAULT_EXCLUDED_TERM_CODES: OfferExcludedTermCode[] = [
  ...OFFER_EXCLUDED_TERM_CODES,
];
export const DEFAULT_NOTE_TERM_CODES: OfferNoteTermCode[] = [...OFFER_NOTE_TERM_CODES];
