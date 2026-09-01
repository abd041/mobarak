import type { HajjExperienceSlide, HajjJourneyStep } from "@/data/hajj-content-defaults";

export const JOURNEY_IMAGES = [
  "/brand/offer-hero/hero-bg-kaaba.png",
  "/brand/offer-hero/hero-bg-2.png",
  "/brand/offer-hero/hero-bg-3.png",
  "/brand/offer-hero/hero-bg-4.png",
  "/brand/offer-hero/hero-bg-kaaba.png",
  "/brand/offer-hero/hero-bg-2.png",
  "/brand/offer-hero/hero-bg-3.png",
  "/brand/offer-hero/hero-bg-4.png",
  "/brand/offer-hero/hero-bg-kaaba.png",
  "/brand/offer-hero/hero-bg-2.png",
  "/brand/offer-hero/hero-bg-3.png",
  "/brand/offer-hero/hero-bg-4.png",
  "/brand/offer-hero/hero-bg-kaaba.png",
  "/brand/offer-hero/hero-bg-2.png",
  "/brand/offer-hero/hero-bg-3.png",
  "/brand/offer-hero/hero-bg-4.png",
  "/brand/offer-hero/hero-bg-kaaba.png",
  "/brand/offer-hero/hero-bg-3.png",
] as const;

export function attachJourneyImages<T extends Omit<HajjJourneyStep, "imageSrc">>(
  steps: T[],
): HajjJourneyStep[] {
  return steps.map((step, index) => ({
    ...step,
    imageSrc: JOURNEY_IMAGES[index] ?? "/brand/offer-hero/hero-bg-kaaba.png",
  }));
}

export function experienceSlides(
  labels: [string, string, string, string],
): HajjExperienceSlide[] {
  return [
    { id: "exp-1990", label: labels[0], imageSrc: "/brand/offer-hero/hero-bg-kaaba.png" },
    { id: "exp-2000", label: labels[1], imageSrc: "/brand/offer-hero/hero-bg-2.png" },
    { id: "exp-2010", label: labels[2], imageSrc: "/brand/offer-hero/hero-bg-3.png" },
    { id: "exp-today", label: labels[3], imageSrc: "/brand/offer-hero/hero-bg-4.png" },
  ];
}

export function withCampaignYear<T>(value: T, year: number, baseYear = 2027): T {
  if (year === baseYear) {
    return mapYearStrings(value, (text) => text.replace(/\{year\}/g, String(year)));
  }
  return mapYearStrings(value, (text) =>
    text.replace(/\{year\}/g, String(year)).replaceAll(String(baseYear), String(year)),
  );
}

function mapYearStrings<T>(value: T, fn: (text: string) => string): T {
  if (typeof value === "string") return fn(value) as T;
  if (Array.isArray(value)) return value.map((item) => mapYearStrings(item, fn)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, mapYearStrings(item, fn)]),
    ) as T;
  }
  return value;
}
