import type { UmrahTrip } from "@/data/mock";

type Translate = (key: string) => string;

/** Public trip marketing title — CMS stores German; other locales use catalog keys. */
export function getLocalizedTripTitle(
  trip: Pick<UmrahTrip, "id" | "title">,
  locale: string,
  t: Translate,
): string {
  if (locale === "de") return trip.title;
  if (trip.id === "trip-23-okt-2026" || /herbst/i.test(trip.title)) {
    return t("tripTitleAutumnHolidays");
  }
  return t("tripTitleGroupTrip");
}

/** Prefer CMS FAQs on German; other locales use translated defaults. */
export function getLocalizedTripFaqs(
  trip: Pick<UmrahTrip, "faqs">,
  locale: string,
  t: Translate,
): { question: string; answer: string }[] {
  if (locale === "de" && trip.faqs?.length) {
    return trip.faqs;
  }
  return [
    { question: t("faqDefault1Q"), answer: t("faqDefault1A") },
    { question: t("faqDefault2Q"), answer: t("faqDefault2A") },
    { question: t("faqDefault3Q"), answer: t("faqDefault3A") },
  ];
}

/**
 * CMS detail notes are German-only today.
 * Use them on `de`; fall back to message defaults elsewhere (and when CMS is empty).
 */
export function getLocalizedDetailNote(
  cmsValue: string | undefined,
  locale: string,
  fallback: string,
): string {
  if (locale === "de" && cmsValue?.trim()) return cmsValue;
  return fallback;
}
