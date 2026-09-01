/**
 * Automatic customer-PDF download filenames (spec 16).
 *
 * Always Latin ASCII — never Arabic/Unicode characters in the filename
 * (avoids broken downloads on systems that mishandle non-Latin names).
 *
 * Examples:
 * - de → Mobarak_Umrah_Angebot_UMR-2026-4587.pdf
 * - ar → Mobarak_Umrah_Offer_UMR-2026-4587_AR.pdf
 * - en → Mobarak_Umrah_Offer_UMR-2026-4587_EN.pdf
 */
import type { OfferPdfLocale } from "@/lib/individual-umrah-offer-pdf-i18n";

const LANG_SUFFIX: Record<OfferPdfLocale, string> = {
  de: "",
  ar: "_AR",
  en: "_EN",
  tr: "_TR",
  bs: "_BS",
};

/**
 * Sanitize offer number for filenames (keep letters, digits, hyphen).
 */
export function sanitizeOfferNumberForFilename(offerNumber: string): string {
  const cleaned = offerNumber.trim().replace(/[^A-Za-z0-9-]+/g, "-").replace(/-+/g, "-");
  return cleaned.replace(/^-|-$/g, "") || "UMR";
}

/**
 * Suggested Save-as-PDF filename (includes `.pdf`).
 */
export function buildIndividualUmrahOfferPdfFilename(
  offerNumber: string,
  locale: OfferPdfLocale,
): string {
  const num = sanitizeOfferNumberForFilename(offerNumber);
  if (locale === "de") {
    return `Mobarak_Umrah_Angebot_${num}.pdf`;
  }
  const suffix = LANG_SUFFIX[locale] || `_${locale.toUpperCase()}`;
  return `Mobarak_Umrah_Offer_${num}${suffix}.pdf`;
}

/**
 * Filename without extension — browsers often append `.pdf` from the print dialog.
 */
export function buildIndividualUmrahOfferPdfBasename(
  offerNumber: string,
  locale: OfferPdfLocale,
): string {
  return buildIndividualUmrahOfferPdfFilename(offerNumber, locale).replace(/\.pdf$/i, "");
}
