/**
 * Individual Umrah offer PDF templates.
 *
 * Architecture (do not fork):
 * - ONE PDF structure: `IndividualUmrahOfferDocument`
 * - FIVE localized templates: offer_template_de | ar | en | tr | bs
 * - Labels / fixed copy / stock terms / catalog add-on wording live in the template
 * - Dynamic data (flights, hotels, prices, customer name) comes from the offer + inquiry
 *
 * Admin UI stays German. Template selection = inquiry.customer_language,
 * unless offer.pdfLanguageOverride is set.
 */
import type { IndividualUmrahInquiry } from "@/lib/individual-umrah-inquiry";
import type { IndividualUmrahOffer } from "@/lib/individual-umrah-offer";
import {
  DEFAULT_ADDON_COPY_BY_LOCALE,
  DEFAULT_OFFER_TERMS_BY_LOCALE,
  OFFER_PDF_COPY,
  OFFER_PDF_LANGUAGE_LABEL_DE,
  getOfferPdfCopy,
  offerPdfIntlLocale,
  offerPdfIsRtl,
  resolveOfferPdfLocale,
  type OfferPdfCopy,
  type OfferPdfLocale,
} from "@/lib/individual-umrah-offer-pdf-i18n";

export type OfferPdfTemplateId =
  | "offer_template_de"
  | "offer_template_ar"
  | "offer_template_en"
  | "offer_template_tr"
  | "offer_template_bs";

export type OfferPdfTemplateTerms = {
  included: string[];
  excluded: string[];
  notes: string[];
};

export type OfferPdfTemplateAddonCopy = {
  title: string;
  body: string;
};

/**
 * Localized content pack for the shared PDF structure.
 * Layout/RTL is driven by `rtl`; all chrome strings by `labels`.
 */
export type OfferPdfTemplate = {
  /** Conceptual id, e.g. offer_template_ar */
  id: OfferPdfTemplateId;
  /** Website / inquiry locale code */
  locale: OfferPdfLocale;
  /** Admin-facing German label for the auto language hint */
  labelDe: string;
  /** Right-to-left layout (Arabic) */
  rtl: boolean;
  /** Intl locale for dates / currency (Latin digits for ar) */
  intlLocale: string;
  /** Fixed PDF chrome (headlines, section titles, table headers, …) */
  labels: OfferPdfCopy;
  /** Default included / excluded / notes bullets */
  terms: OfferPdfTemplateTerms;
  /** Default catalog add-on title/body by id */
  addons: Record<string, OfferPdfTemplateAddonCopy>;
};

const TEMPLATE_ID_BY_LOCALE: Record<OfferPdfLocale, OfferPdfTemplateId> = {
  de: "offer_template_de",
  ar: "offer_template_ar",
  en: "offer_template_en",
  tr: "offer_template_tr",
  bs: "offer_template_bs",
};

function buildTemplate(locale: OfferPdfLocale): OfferPdfTemplate {
  return {
    id: TEMPLATE_ID_BY_LOCALE[locale],
    locale,
    labelDe: OFFER_PDF_LANGUAGE_LABEL_DE[locale],
    rtl: offerPdfIsRtl(locale),
    intlLocale: offerPdfIntlLocale(locale),
    labels: getOfferPdfCopy(locale),
    terms: {
      included: [...DEFAULT_OFFER_TERMS_BY_LOCALE[locale].included],
      excluded: [...DEFAULT_OFFER_TERMS_BY_LOCALE[locale].excluded],
      notes: [...DEFAULT_OFFER_TERMS_BY_LOCALE[locale].notes],
    },
    addons: { ...DEFAULT_ADDON_COPY_BY_LOCALE[locale] },
  };
}

/** Named templates — same structure, localized copy only. */
export const offer_template_de = buildTemplate("de");
export const offer_template_ar = buildTemplate("ar");
export const offer_template_en = buildTemplate("en");
export const offer_template_tr = buildTemplate("tr");
export const offer_template_bs = buildTemplate("bs");

/** Locale → template registry (single source for render + seeding). */
export const OFFER_PDF_TEMPLATES: Record<OfferPdfLocale, OfferPdfTemplate> = {
  de: offer_template_de,
  ar: offer_template_ar,
  en: offer_template_en,
  tr: offer_template_tr,
  bs: offer_template_bs,
};

export const OFFER_PDF_TEMPLATE_IDS: OfferPdfTemplateId[] = [
  "offer_template_de",
  "offer_template_ar",
  "offer_template_en",
  "offer_template_tr",
  "offer_template_bs",
];

export function getOfferPdfTemplate(locale: OfferPdfLocale): OfferPdfTemplate {
  return OFFER_PDF_TEMPLATES[locale] ?? OFFER_PDF_TEMPLATES.de;
}

export function getOfferPdfTemplateById(id: OfferPdfTemplateId): OfferPdfTemplate {
  const locale = (Object.keys(TEMPLATE_ID_BY_LOCALE) as OfferPdfLocale[]).find(
    (l) => TEMPLATE_ID_BY_LOCALE[l] === id,
  );
  return getOfferPdfTemplate(locale ?? "de");
}

/**
 * Pick the template from effective PDF language
 * (inquiry.customer_language, or offer.pdfLanguageOverride when set).
 */
export function resolveOfferPdfTemplate(
  inquiry: IndividualUmrahInquiry,
  offer?: Pick<IndividualUmrahOffer, "pdfLanguageOverride"> | null,
): OfferPdfTemplate {
  return getOfferPdfTemplate(resolveOfferPdfLocale(inquiry, offer));
}

/** Re-export locale helpers used by the shared document. */
export {
  OFFER_PDF_COPY,
  OFFER_PDF_LANGUAGE_LABEL_DE,
  resolveOfferPdfLocale,
  type OfferPdfCopy,
  type OfferPdfLocale,
};
