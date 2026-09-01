import type { HajjPassportTypeOption } from "@/data/hajj-passport-types";
import { buildDefaultPassportTypes, mergePassportTypes } from "@/data/hajj-passport-types";
import type { Locale } from "@/data/mock";
import { RESIDENCE_COUNTRIES } from "@/lib/residence-countries";
import arMessages from "../../messages/ar.json";
import bsMessages from "../../messages/bs.json";
import deMessages from "../../messages/de.json";
import enMessages from "../../messages/en.json";
import trMessages from "../../messages/tr.json";

export type HajjPreRegBenefitIcon = "shield" | "users" | "clipboard" | "award";

export type HajjPreRegBenefit = {
  id: string;
  icon: HajjPreRegBenefitIcon;
  title: string;
  body: string;
  emphasis?: string;
  highlight?: boolean;
};

export type HajjPreRegSourceOption = {
  value: string;
  label: string;
  enabled: boolean;
};

export type HajjPreRegResidenceCountry = {
  code: string;
  enabled: boolean;
  label?: string;
};

export type HajjPreRegContent = {
  hero: {
    label: string;
    title: string;
    /** Optional second line under title (e.g. "Hajj 2027") */
    titleLine2?: string;
    body: string;
    imageSrc: string;
  };
  benefits: HajjPreRegBenefit[];
  benefitsAriaLabel: string;
  formAriaLabel: string;
  sections: {
    travellerCount: { title: string; hint: string };
    travellerDetails: { title: string; hint: string };
    contact: { title: string; hint: string };
    source: { title: string; hint: string };
  };
  fields: {
    person: string;
    people: string;
    personColumn: string;
    sixPlusLabel: string;
    sixPlusHint: string;
    firstName: string;
    firstNamePlaceholder: string;
    lastName: string;
    lastNamePlaceholder: string;
    nationality: string;
    nationalityPlaceholder: string;
    residence: string;
    residencePlaceholder: string;
    passportType: string;
    passportTypePlaceholder: string;
    phoneNumber: string;
    phoneDialCode: string;
    phonePlaceholder: string;
    emailAddress: string;
    emailPlaceholder: string;
    fieldOptional: string;
    sourceOtherPlaceholder: string;
  };
  sourceOptions: HajjPreRegSourceOption[];
  residenceCountries: HajjPreRegResidenceCountry[];
  passportTypes: HajjPassportTypeOption[];
  privacy: {
    title: string;
    body: string;
    ssl: string;
    compliant: string;
  };
  cta: {
    submit: string;
    submitting: string;
    free: string;
    infoTitle: string;
    infoLead: string;
    infoFollowUp: string;
  };
  trust: string[];
  success: {
    title: string;
    body: string;
    backToHajj: string;
  };
  validation: {
    firstName: string;
    lastName: string;
    nationality: string;
    residence: string;
    passportType: string;
    source: string;
    phone: string;
    email: string;
  };
  seo: {
    title: string;
    description: string;
  };
};

type HajjNs = (typeof deMessages)["hajj"];
type SeoNs = (typeof deMessages)["seo"];

const HAJJ_MESSAGES: Record<Locale, HajjNs> = {
  de: deMessages.hajj,
  en: enMessages.hajj,
  ar: arMessages.hajj,
  bs: bsMessages.hajj,
  tr: trMessages.hajj,
};

const SEO_MESSAGES: Record<Locale, SeoNs> = {
  de: deMessages.seo,
  en: enMessages.seo,
  ar: arMessages.seo,
  bs: bsMessages.seo,
  tr: trMessages.seo,
};

export const HAJJ_SOURCE_OPTION_VALUES = [
  "instagram",
  "facebook",
  "google",
  "chatgpt",
  "friend",
  "know",
  "other",
] as const;

const SOURCE_LABEL_KEYS: Record<(typeof HAJJ_SOURCE_OPTION_VALUES)[number], keyof HajjNs> = {
  instagram: "sourceInstagram",
  facebook: "sourceFacebook",
  google: "sourceGoogle",
  chatgpt: "sourceChatgpt",
  friend: "sourceFriend",
  know: "sourceKnow",
  other: "sourceOther",
};

const DEFAULT_HERO_IMAGE = "/brand/hero-bg.png";
export const HAJJ_YEAR_PLACEHOLDER = "{year}";
export const DEFAULT_HAJJ_CAMPAIGN_YEAR = 2027;

function mapStrings<T>(value: T, fn: (text: string) => string): T {
  if (typeof value === "string") return fn(value) as T;
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, fn)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, mapStrings(item, fn)]),
    ) as T;
  }
  return value;
}

/** Replace `{year}` and the default campaign year in all pre-reg strings. */
export function applyHajjYear(content: HajjPreRegContent, year: number, baseYear = DEFAULT_HAJJ_CAMPAIGN_YEAR): HajjPreRegContent {
  if (year === baseYear) {
    return mapStrings(content, (text) => text.replaceAll(HAJJ_YEAR_PLACEHOLDER, String(year)));
  }
  return mapStrings(content, (text) =>
    text.replaceAll(HAJJ_YEAR_PLACEHOLDER, String(year)).replaceAll(String(baseYear), String(year)),
  );
}

export function buildDefaultPreRegContent(locale: Locale, year = DEFAULT_HAJJ_CAMPAIGN_YEAR): HajjPreRegContent {
  const h = HAJJ_MESSAGES[locale] ?? HAJJ_MESSAGES.de;
  const seo = SEO_MESSAGES[locale] ?? SEO_MESSAGES.de;

  const content: HajjPreRegContent = {
    hero: {
      label: h.label,
      title: h.preRegTitle,
      titleLine2: h.preRegTitleLine2,
      body: h.preRegBody,
      imageSrc: DEFAULT_HERO_IMAGE,
    },
    benefits: [
      {
        id: "benefit-transparent",
        icon: "shield",
        title: h.benefitTransparent,
        body: h.benefitTransparentBody,
      },
      {
        id: "benefit-no-cost",
        icon: "users",
        title: h.benefitNoCost,
        body: h.benefitNoCostBody,
      },
      {
        id: "benefit-offers",
        icon: "clipboard",
        title: h.benefitOffers,
        body: h.benefitOffersBody,
      },
      {
        id: "benefit-decide",
        icon: "award",
        title: h.benefitDecide,
        body: h.benefitDecideBody,
        emphasis: h.benefitDecideNote,
        highlight: true,
      },
    ],
    benefitsAriaLabel: h.benefitsAriaLabel,
    formAriaLabel: h.formAriaLabel,
    sections: {
      travellerCount: { title: h.travellerCount, hint: h.travellerCountHint },
      travellerDetails: { title: h.travellerDetails, hint: h.travellerDetailsHint },
      contact: { title: h.contactDetails, hint: h.contactHint },
      source: { title: h.sourceTitle, hint: h.sourceHint },
    },
    fields: {
      person: h.person,
      people: h.people,
      personColumn: h.personColumn,
      sixPlusLabel: h.sixPlusLabel,
      sixPlusHint: h.sixPlusHint,
      firstName: h.firstName,
      firstNamePlaceholder: h.firstNamePlaceholder,
      lastName: h.lastName,
      lastNamePlaceholder: h.lastNamePlaceholder,
      nationality: h.nationality,
      nationalityPlaceholder: h.nationalityPlaceholder,
      residence: h.residence,
      residencePlaceholder: h.residencePlaceholder,
      passportType: h.passportType,
      passportTypePlaceholder: h.passportTypePlaceholder,
      phoneNumber: h.phoneNumber,
      phoneDialCode: h.phoneDialCode,
      phonePlaceholder: h.phonePlaceholder,
      emailAddress: h.emailAddress,
      emailPlaceholder: h.emailPlaceholder,
      fieldOptional: h.fieldOptional,
      sourceOtherPlaceholder: h.sourceOtherPlaceholder,
    },
    sourceOptions: HAJJ_SOURCE_OPTION_VALUES.map((value) => ({
      value,
      label: h[SOURCE_LABEL_KEYS[value]],
      enabled: true,
    })),
    residenceCountries: RESIDENCE_COUNTRIES.map((country) => ({
      code: country.code,
      enabled: true,
    })),
    passportTypes: buildDefaultPassportTypes(locale),
    privacy: {
      title: h.privacyTitle,
      body: h.privacyBody,
      ssl: h.privacySsl,
      compliant: h.privacyCompliant,
    },
    cta: {
      submit: h.preRegCta,
      submitting: h.submitting,
      free: h.ctaFree,
      infoTitle: h.preRegInfoTitle,
      infoLead: h.preRegInfoLead,
      infoFollowUp: h.preRegInfoFollowUp,
    },
    trust: [h.preRegTrust1, h.preRegTrust2, h.preRegTrust3, h.preRegTrust4, h.preRegTrust5],
    success: {
      title: h.successTitle,
      body: h.successBody,
      backToHajj: h.backToHajj,
    },
    validation: {
      firstName: h.validationFirstName,
      lastName: h.validationLastName,
      nationality: h.validationNationality,
      residence: h.validationResidence,
      passportType: h.validationPassportType,
      source: h.validationSource,
      phone: h.validationPhone,
      email: h.validationEmail,
    },
    seo: {
      title: seo.hajjPreRegTitle,
      description: seo.hajjPreRegDescription,
    },
  };

  return applyHajjYear(content, year);
}

function useStoredArray<T>(stored: T[] | undefined, defaults: T[]): T[] {
  return stored?.length ? stored : defaults;
}

function mergeByKey<T extends { id?: string; value?: string; code?: string }>(
  defaults: T[],
  patch: T[] | undefined,
  key: "id" | "value" | "code",
): T[] {
  if (!patch?.length) return defaults;
  const patchMap = new Map(patch.map((item) => [item[key], item]));
  return defaults.map((item) => ({ ...item, ...patchMap.get(item[key]!) }));
}

export function mergePreRegContent(
  defaults: HajjPreRegContent,
  patch?: Partial<HajjPreRegContent>,
): HajjPreRegContent {
  if (!patch) return defaults;

  return {
    hero: { ...defaults.hero, ...patch.hero },
    benefits: useStoredArray(patch.benefits, defaults.benefits),
    benefitsAriaLabel: patch.benefitsAriaLabel ?? defaults.benefitsAriaLabel,
    formAriaLabel: patch.formAriaLabel ?? defaults.formAriaLabel,
    sections: {
      travellerCount: { ...defaults.sections.travellerCount, ...patch.sections?.travellerCount },
      travellerDetails: { ...defaults.sections.travellerDetails, ...patch.sections?.travellerDetails },
      contact: { ...defaults.sections.contact, ...patch.sections?.contact },
      source: { ...defaults.sections.source, ...patch.sections?.source },
    },
    fields: { ...defaults.fields, ...patch.fields },
    sourceOptions: mergeByKey(defaults.sourceOptions, patch.sourceOptions, "value"),
    residenceCountries: mergeByKey(defaults.residenceCountries, patch.residenceCountries, "code"),
    passportTypes: mergePassportTypes(defaults.passportTypes, patch.passportTypes),
    privacy: { ...defaults.privacy, ...patch.privacy },
    cta: { ...defaults.cta, ...patch.cta },
    trust: useStoredArray(patch.trust, defaults.trust),
    success: { ...defaults.success, ...patch.success },
    validation: { ...defaults.validation, ...patch.validation },
    seo: { ...defaults.seo, ...patch.seo },
  };
}

export type ResolvedResidenceCountry = {
  code: string;
  dial: string;
  flag: string;
  label: string;
};

export function resolveResidenceCountries(
  config: HajjPreRegResidenceCountry[],
  locale: Locale,
): ResolvedResidenceCountry[] {
  const configByCode = new Map(config.map((item) => [item.code, item]));

  return RESIDENCE_COUNTRIES.filter((country) => {
    const item = configByCode.get(country.code);
    return item ? item.enabled : true;
  }).map((country) => {
    const item = configByCode.get(country.code);
    return {
      code: country.code,
      dial: country.dial,
      flag: country.flag,
      label: item?.label?.trim() || country.labels[locale],
    };
  });
}

export function enabledSourceOptions(options: HajjPreRegSourceOption[]): HajjPreRegSourceOption[] {
  return options.filter((option) => option.enabled);
}

export function enabledResidenceCodes(config: HajjPreRegResidenceCountry[]): Set<string> {
  return new Set(
    RESIDENCE_COUNTRIES.filter((country) => {
      const item = config.find((entry) => entry.code === country.code);
      return item ? item.enabled : true;
    }).map((country) => country.code),
  );
}
