import type { Locale } from "@/data/mock";

export type HajjPassportTypeOption = {
  id: string;
  label: string;
};

/** Brief §9 — default must be Normaler Reisepass */
export const DEFAULT_HAJJ_PASSPORT_TYPE_ID = "normal";

export const HAJJ_PASSPORT_TYPE_IDS = ["normal", "diplomatic", "service", "other"] as const;

export type HajjPassportTypeId = (typeof HAJJ_PASSPORT_TYPE_IDS)[number];

const LABELS: Record<Locale, Record<HajjPassportTypeId, string>> = {
  de: {
    normal: "Normaler Reisepass",
    diplomatic: "Diplomatenpass",
    service: "Dienstpass",
    other: "Sonstiger Pass",
  },
  en: {
    normal: "Regular Passport",
    diplomatic: "Diplomatic Passport",
    service: "Service Passport",
    other: "Other Passport",
  },
  ar: {
    normal: "جواز سفر عادي",
    diplomatic: "جواز دبلوماسي",
    service: "جواز خدمة",
    other: "جواز آخر",
  },
  bs: {
    normal: "Običan pasoš",
    diplomatic: "Diplomatski pasoš",
    service: "Službeni pasoš",
    other: "Drugi pasoš",
  },
  tr: {
    normal: "Normal pasaport",
    diplomatic: "Diplomatik pasaport",
    service: "Hizmet pasaportu",
    other: "Diğer pasaport",
  },
};

export function buildDefaultPassportTypes(locale: Locale): HajjPassportTypeOption[] {
  const labels = LABELS[locale] ?? LABELS.en;
  return HAJJ_PASSPORT_TYPE_IDS.map((id) => ({ id, label: labels[id] }));
}

export function mergePassportTypes(
  defaults: HajjPassportTypeOption[],
  patch?: HajjPassportTypeOption[],
): HajjPassportTypeOption[] {
  if (!patch?.length) return defaults;
  const byId = new Map(patch.map((item) => [item.id, item]));
  return defaults.map((item) => ({ ...item, ...byId.get(item.id) }));
}
