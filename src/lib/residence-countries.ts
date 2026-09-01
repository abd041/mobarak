import type { Locale } from "@/data/mock";

export type ResidenceCountry = {
  code: string;
  dial: string;
  flag: string;
  labels: Record<Locale, string>;
};

/** Hajj pre-registration residence countries (§17). Extend only via admin when required. */
export const RESIDENCE_COUNTRIES: ResidenceCountry[] = [
  {
    code: "AT",
    dial: "+43",
    flag: "🇦🇹",
    labels: {
      de: "Österreich",
      en: "Austria",
      ar: "النمسا",
      tr: "Avusturya",
      bs: "Austrija",
    },
  },
  {
    code: "DE",
    dial: "+49",
    flag: "🇩🇪",
    labels: {
      de: "Deutschland",
      en: "Germany",
      ar: "ألمانيا",
      tr: "Almanya",
      bs: "Njemačka",
    },
  },
  {
    code: "CH",
    dial: "+41",
    flag: "🇨🇭",
    labels: {
      de: "Schweiz",
      en: "Switzerland",
      ar: "سويسرا",
      tr: "İsviçre",
      bs: "Švicarska",
    },
  },
  {
    code: "SI",
    dial: "+386",
    flag: "🇸🇮",
    labels: {
      de: "Slowenien",
      en: "Slovenia",
      ar: "سلوفينيا",
      tr: "Slovenya",
      bs: "Slovenija",
    },
  },
  {
    code: "BE",
    dial: "+32",
    flag: "🇧🇪",
    labels: {
      de: "Belgien",
      en: "Belgium",
      ar: "بلجيكا",
      tr: "Belçika",
      bs: "Belgija",
    },
  },
  {
    code: "FR",
    dial: "+33",
    flag: "🇫🇷",
    labels: {
      de: "Frankreich",
      en: "France",
      ar: "فرنسا",
      tr: "Fransa",
      bs: "Francuska",
    },
  },
  {
    code: "NL",
    dial: "+31",
    flag: "🇳🇱",
    labels: {
      de: "Niederlande",
      en: "Netherlands",
      ar: "هولندا",
      tr: "Hollanda",
      bs: "Nizozemska",
    },
  },
  {
    code: "IT",
    dial: "+39",
    flag: "🇮🇹",
    labels: {
      de: "Italien",
      en: "Italy",
      ar: "إيطاليا",
      tr: "İtalya",
      bs: "Italija",
    },
  },
  {
    code: "SK",
    dial: "+421",
    flag: "🇸🇰",
    labels: {
      de: "Slowakei",
      en: "Slovakia",
      ar: "سلوفاكيا",
      tr: "Slovakya",
      bs: "Slovačka",
    },
  },
  {
    code: "RS",
    dial: "+381",
    flag: "🇷🇸",
    labels: {
      de: "Serbien",
      en: "Serbia",
      ar: "صربيا",
      tr: "Sırbistan",
      bs: "Srbija",
    },
  },
];

export function residenceLabel(code: string, locale: Locale): string {
  const country = RESIDENCE_COUNTRIES.find((item) => item.code === code);
  return country?.labels[locale] ?? code;
}
