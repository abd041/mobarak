export const REVIEW_LOCALES = ["de", "ar", "bs", "en", "tr"] as const;
export type ReviewLocale = (typeof REVIEW_LOCALES)[number];

export function normalizeReviewLocale(locale: string): ReviewLocale {
  if (
    locale === "ar" ||
    locale === "bs" ||
    locale === "en" ||
    locale === "tr"
  ) {
    return locale;
  }
  return "de";
}

/** Google Translate / Places language codes */
export const REVIEW_LOCALE_TO_GOOGLE: Record<ReviewLocale, string> = {
  de: "de",
  ar: "ar",
  bs: "bs",
  en: "en",
  tr: "tr",
};
