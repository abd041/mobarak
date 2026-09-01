import type { Locale } from "@/data/mock";

export type HajjPassportTypeOption = {
  id: string;
  label: string;
};

export const HAJJ_PASSPORT_TYPE_IDS = ["normal", "convention", "travel", "diplomatic"] as const;

export type HajjPassportTypeId = (typeof HAJJ_PASSPORT_TYPE_IDS)[number];

const LABELS: Record<Locale, Record<HajjPassportTypeId, string>> = {
  de: {
    normal: "Normaler Reisepass",
    convention: "Konventionspass",
    travel: "Reisedokument",
    diplomatic: "Diplomatenpass",
  },
  en: {
    normal: "Regular Passport",
    convention: "Convention Passport",
    travel: "Travel Document",
    diplomatic: "Diplomatic Passport",
  },
  ar: {
    normal: "جواز سفر عادي",
    convention: "جواز اتفاقية",
    travel: "وثيقة سفر",
    diplomatic: "جواز دبلوماسي",
  },
  bs: {
    normal: "Običan pasoš",
    convention: "Konvencijski pasoš",
    travel: "Putni dokument",
    diplomatic: "Diplomatski pasoš",
  },
  tr: {
    normal: "Normal pasaport",
    convention: "Konvansiyonel pasaport",
    travel: "Seyahat belgesi",
    diplomatic: "Diplomatik pasaport",
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
