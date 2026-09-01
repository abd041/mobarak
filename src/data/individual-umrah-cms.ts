import {
  HERO_SERVICE_ICONS,
  INDIVIDUAL_UMRAH_AIRPORTS,
  INDIVIDUAL_UMRAH_ROOM_PRESETS,
  INDIVIDUAL_UMRAH_ROOMS_SIX_PLUS_MIN,
  INDIVIDUAL_UMRAH_TRAVEL_MONTHS_AHEAD,
  MAX_INDIVIDUAL_ROOMS,
  MAX_NIGHTS_PER_CITY,
  MAX_TRAVELLERS_PER_CATEGORY,
  MIN_NIGHTS_PER_CITY,
} from "@/data/individual-umrah";
import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";

export type LocalizedString = Record<Locale, string>;

function emptyLocalized(fallback = ""): LocalizedString {
  return Object.fromEntries(locales.map((l) => [l, fallback])) as LocalizedString;
}

function localizedFrom(
  values: Partial<LocalizedString> & { de: string },
): LocalizedString {
  const base = emptyLocalized(values.de);
  return { ...base, ...values };
}

/** §42 — admin-managed departure airport. */
export type IndividualUmrahCmsAirport = {
  id: string;
  /** IATA code e.g. VIE */
  code: string;
  enabled: boolean;
  sortOrder: number;
  labels: LocalizedString;
};

/** §42 — hero service row. */
export type IndividualUmrahCmsService = {
  id: string;
  iconKey: "flight" | "hotel" | "visa" | "transfer" | string;
  labels: LocalizedString;
};

/**
 * §42 — Individual Umrah CMS configuration (demo store; backend later).
 * Covers airports, traveller/room/night limits, months, dates, hero, CTA, services, copy.
 */
export type IndividualUmrahCmsConfig = {
  airports: IndividualUmrahCmsAirport[];
  travellers: {
    adultsMin: number;
    adultsMax: number;
    childrenMin: number;
    childrenMax: number;
    infantsMin: number;
    infantsMax: number;
  };
  rooms: {
    /** Preset dropdown values e.g. 1–5 */
    presets: number[];
    sixPlusMin: number;
    max: number;
  };
  nights: {
    minPerCity: number;
    maxPerCity: number;
  };
  /** How many upcoming months appear in the month dropdown. */
  monthsAhead: number;
  dateAvailability: {
    /** When true, blockedDates are excluded from the day picker. */
    enabled: boolean;
    blockedDates: string[];
  };
  hero: {
    imageUrl: string;
    title: LocalizedString;
    subtitle: LocalizedString;
  };
  cta: {
    label: LocalizedString;
    hint: LocalizedString;
  };
  services: IndividualUmrahCmsService[];
  /** Extra marketing / form copy editable in admin (§42 translations). */
  copy: {
    formTitle: LocalizedString;
    infoBox: LocalizedString;
    successTitle: LocalizedString;
    successBody: LocalizedString;
  };
};

const DEFAULT_AIRPORT_LABELS: Record<string, LocalizedString> = {
  vie: localizedFrom({
    de: "Wien (VIE)",
    en: "Vienna (VIE)",
    ar: "فيينا (VIE)",
    bs: "Beč (VIE)",
    tr: "Viyana (VIE)",
  }),
  szg: localizedFrom({
    de: "Salzburg (SZG)",
    en: "Salzburg (SZG)",
    ar: "سالزبورغ (SZG)",
    bs: "Salzburg (SZG)",
    tr: "Salzburg (SZG)",
  }),
  muc: localizedFrom({
    de: "München (MUC)",
    en: "Munich (MUC)",
    ar: "ميونخ (MUC)",
    bs: "Minhen (MUC)",
    tr: "Münih (MUC)",
  }),
  bud: localizedFrom({
    de: "Budapest (BUD)",
    en: "Budapest (BUD)",
    ar: "بودابست (BUD)",
    bs: "Budimpešta (BUD)",
    tr: "Budapeşte (BUD)",
  }),
};

const DEFAULT_SERVICE_LABELS: Record<string, LocalizedString> = {
  flights: localizedFrom({
    de: "Flüge",
    en: "Flights",
    ar: "الرحلات",
    bs: "Letovi",
    tr: "Uçuşlar",
  }),
  hotels: localizedFrom({
    de: "Hotels",
    en: "Hotels",
    ar: "الفنادق",
    bs: "Hoteli",
    tr: "Oteller",
  }),
  visa: localizedFrom({
    de: "Visum",
    en: "Visa",
    ar: "التأشيرة",
    bs: "Viza",
    tr: "Vize",
  }),
  transfer: localizedFrom({
    de: "Transfer",
    en: "Transfer",
    ar: "النقل",
    bs: "Transfer",
    tr: "Transfer",
  }),
};

export const DEFAULT_INDIVIDUAL_UMRAH_CMS: IndividualUmrahCmsConfig = {
  airports: INDIVIDUAL_UMRAH_AIRPORTS.map((a, index) => ({
    id: a.id,
    code: a.code,
    enabled: true,
    sortOrder: index,
    labels: DEFAULT_AIRPORT_LABELS[a.id] ?? localizedFrom({ de: a.code }),
  })),
  travellers: {
    adultsMin: 1,
    adultsMax: MAX_TRAVELLERS_PER_CATEGORY,
    childrenMin: 0,
    childrenMax: MAX_TRAVELLERS_PER_CATEGORY,
    infantsMin: 0,
    infantsMax: MAX_TRAVELLERS_PER_CATEGORY,
  },
  rooms: {
    presets: [...INDIVIDUAL_UMRAH_ROOM_PRESETS],
    sixPlusMin: INDIVIDUAL_UMRAH_ROOMS_SIX_PLUS_MIN,
    max: MAX_INDIVIDUAL_ROOMS,
  },
  nights: {
    minPerCity: MIN_NIGHTS_PER_CITY,
    maxPerCity: MAX_NIGHTS_PER_CITY,
  },
  monthsAhead: INDIVIDUAL_UMRAH_TRAVEL_MONTHS_AHEAD,
  dateAvailability: {
    enabled: false,
    blockedDates: [],
  },
  hero: {
    imageUrl: "/brand/individual-umrah-hero.png",
    title: localizedFrom({
      de: "Individuelle Umrah",
      en: "Individual Umrah",
      ar: "عمرة فردية",
      bs: "Individualna Umra",
      tr: "Bireysel Umre",
    }),
    subtitle: localizedFrom({
      de: "Planen Sie Ihre persönliche Umrah — flexibel und unverbindlich.",
      en: "Plan your personal Umrah — flexible and non-binding.",
      ar: "خطط لعمرتكم الشخصية — بمرونة ودون التزام.",
      bs: "Isplanirajte svoju ličnu Umru — fleksibilno i nezobavezujuće.",
      tr: "Kişisel Umrenizi planlayın — esnek ve bağlayıcı değil.",
    }),
  },
  cta: {
    label: localizedFrom({
      de: "Unverbindliche Anfrage senden",
      en: "Send non-binding enquiry",
      ar: "إرسال طلب غير ملزم",
      bs: "Pošaljite nezobavezujući upit",
      tr: "Bağlayıcı olmayan talep gönder",
    }),
    hint: localizedFrom({
      de: "100 % unverbindlich — wir melden uns mit einem Angebot.",
      en: "100% non-binding — we will get back with an offer.",
      ar: "غير ملزم بالكامل — سنتواصل معكم بعرض.",
      bs: "100 % nezobavezujuće — javit ćemo se s ponudom.",
      tr: "%100 bağlayıcı değil — teklifle dönüş yapacağız.",
    }),
  },
  services: HERO_SERVICE_ICONS.map((s) => ({
    id: s.id,
    iconKey: s.iconKey,
    labels: DEFAULT_SERVICE_LABELS[s.id] ?? localizedFrom({ de: s.id }),
  })),
  copy: {
    formTitle: localizedFrom({
      de: "Ihre individuelle Umrah-Anfrage",
      en: "Your individual Umrah enquiry",
      ar: "طلب العمرة الفردية",
      bs: "Vaš individualni Umra upit",
      tr: "Bireysel Umre talebiniz",
    }),
    infoBox: localizedFrom({
      de: "Nach dem Absenden prüfen wir Ihre Wünsche und erstellen ein persönliches Angebot.",
      en: "After submitting, we review your wishes and prepare a personal offer.",
      ar: "بعد الإرسال نراجع رغباتكم ونعد عرضًا شخصيًا.",
      bs: "Nakon slanja pregledamo vaše želje i pripremamo ličnu ponudu.",
      tr: "Gönderimden sonra isteklerinizi inceler ve kişisel bir teklif hazırlarız.",
    }),
    successTitle: localizedFrom({
      de: "Vielen Dank für Ihre Anfrage!",
      en: "Thank you for your enquiry!",
      ar: "شكرًا لطلبكم!",
      bs: "Hvala na upitu!",
      tr: "Talebiniz için teşekkürler!",
    }),
    successBody: localizedFrom({
      de: "Wir haben Ihre individuelle Umrah-Anfrage erhalten und melden uns in Kürze.",
      en: "We received your individual Umrah enquiry and will get back shortly.",
      ar: "استلمنا طلب العمرة الفردية وسنتواصل معكم قريبًا.",
      bs: "Primili smo vaš individualni Umra upit i javit ćemo se uskoro.",
      tr: "Bireysel Umre talebinizi aldık ve kısa sürede dönüş yapacağız.",
    }),
  },
};
