import {
  DEFAULT_INDIVIDUAL_UMRAH_CMS,
  type IndividualUmrahCmsConfig,
} from "@/data/individual-umrah-cms";

const STORAGE_KEY = "mobarak.individualUmrahCms";
export const INDIVIDUAL_UMRAH_CMS_EVENT = "mobarak-individual-umrah-cms";

function mergeConfig(parsed: Partial<IndividualUmrahCmsConfig>): IndividualUmrahCmsConfig {
  return {
    ...DEFAULT_INDIVIDUAL_UMRAH_CMS,
    ...parsed,
    airports: parsed.airports ?? DEFAULT_INDIVIDUAL_UMRAH_CMS.airports,
    travellers: { ...DEFAULT_INDIVIDUAL_UMRAH_CMS.travellers, ...(parsed.travellers ?? {}) },
    rooms: {
      ...DEFAULT_INDIVIDUAL_UMRAH_CMS.rooms,
      ...(parsed.rooms ?? {}),
      presets: parsed.rooms?.presets ?? DEFAULT_INDIVIDUAL_UMRAH_CMS.rooms.presets,
    },
    nights: { ...DEFAULT_INDIVIDUAL_UMRAH_CMS.nights, ...(parsed.nights ?? {}) },
    dateAvailability: {
      ...DEFAULT_INDIVIDUAL_UMRAH_CMS.dateAvailability,
      ...(parsed.dateAvailability ?? {}),
      blockedDates:
        parsed.dateAvailability?.blockedDates ??
        DEFAULT_INDIVIDUAL_UMRAH_CMS.dateAvailability.blockedDates,
    },
    hero: {
      ...DEFAULT_INDIVIDUAL_UMRAH_CMS.hero,
      ...(parsed.hero ?? {}),
      title: { ...DEFAULT_INDIVIDUAL_UMRAH_CMS.hero.title, ...(parsed.hero?.title ?? {}) },
      subtitle: { ...DEFAULT_INDIVIDUAL_UMRAH_CMS.hero.subtitle, ...(parsed.hero?.subtitle ?? {}) },
    },
    cta: {
      ...DEFAULT_INDIVIDUAL_UMRAH_CMS.cta,
      ...(parsed.cta ?? {}),
      label: { ...DEFAULT_INDIVIDUAL_UMRAH_CMS.cta.label, ...(parsed.cta?.label ?? {}) },
      hint: { ...DEFAULT_INDIVIDUAL_UMRAH_CMS.cta.hint, ...(parsed.cta?.hint ?? {}) },
    },
    services: parsed.services ?? DEFAULT_INDIVIDUAL_UMRAH_CMS.services,
    copy: {
      ...DEFAULT_INDIVIDUAL_UMRAH_CMS.copy,
      ...(parsed.copy ?? {}),
      formTitle: {
        ...DEFAULT_INDIVIDUAL_UMRAH_CMS.copy.formTitle,
        ...(parsed.copy?.formTitle ?? {}),
      },
      infoBox: { ...DEFAULT_INDIVIDUAL_UMRAH_CMS.copy.infoBox, ...(parsed.copy?.infoBox ?? {}) },
      successTitle: {
        ...DEFAULT_INDIVIDUAL_UMRAH_CMS.copy.successTitle,
        ...(parsed.copy?.successTitle ?? {}),
      },
      successBody: {
        ...DEFAULT_INDIVIDUAL_UMRAH_CMS.copy.successBody,
        ...(parsed.copy?.successBody ?? {}),
      },
    },
  };
}

export function readIndividualUmrahCmsOverride(): IndividualUmrahCmsConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return mergeConfig(JSON.parse(raw) as Partial<IndividualUmrahCmsConfig>);
  } catch {
    return null;
  }
}

export function writeIndividualUmrahCms(config: IndividualUmrahCmsConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event(INDIVIDUAL_UMRAH_CMS_EVENT));
}

export function getIndividualUmrahCms(): IndividualUmrahCmsConfig {
  return readIndividualUmrahCmsOverride() ?? DEFAULT_INDIVIDUAL_UMRAH_CMS;
}
