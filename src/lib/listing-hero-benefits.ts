/**
 * Default hero inclusions on the Umrah group trips landing page.
 * Order matches listing reference (no 2×23 kg baggage).
 */
export type ListingHeroBenefit = {
  id: string;
  icon: string;
  labelKey: string;
};

export const LISTING_HERO_BENEFITS: ListingHeroBenefit[] = [
  { id: "visa", icon: "/brand/inclusion-icons/visa.png", labelKey: "listingBenefitVisa" },
  { id: "flight", icon: "/brand/inclusion-icons/flight.png", labelKey: "listingBenefitFlight" },
  { id: "transfer", icon: "/brand/inclusion-icons/transfer.png", labelKey: "listingBenefitTransfer" },
  { id: "guide", icon: "/brand/inclusion-icons/guide.png", labelKey: "listingBenefitGuide" },
  { id: "religious", icon: "/brand/inclusion-icons/religious.png", labelKey: "listingBenefitReligious" },
  { id: "hotels", icon: "/brand/inclusion-icons/hotel.png", labelKey: "listingBenefitHotels" },
  { id: "breakfast", icon: "/brand/inclusion-icons/breakfast.png", labelKey: "listingBenefitBreakfast" },
  { id: "excursions", icon: "/brand/inclusion-icons/excursions.png", labelKey: "listingBenefitExcursions" },
];

const benefitById = Object.fromEntries(
  LISTING_HERO_BENEFITS.map((item) => [item.id, item]),
) as Record<string, ListingHeroBenefit>;

export const LISTING_HERO_BENEFIT_ROW_1: ListingHeroBenefit[] = [
  benefitById.visa!,
  benefitById.flight!,
  benefitById.transfer!,
  benefitById.guide!,
];

export const LISTING_HERO_BENEFIT_ROW_2: ListingHeroBenefit[] = [
  benefitById.religious!,
  benefitById.hotels!,
  benefitById.breakfast!,
  benefitById.excursions!,
];

export const LISTING_HERO_BENEFIT_ROWS = [
  LISTING_HERO_BENEFIT_ROW_1,
  LISTING_HERO_BENEFIT_ROW_2,
] as const;

/** Mobile — 4 + 4 */
export const LISTING_HERO_BENEFIT_ROWS_MOBILE = [
  LISTING_HERO_BENEFIT_ROW_1,
  LISTING_HERO_BENEFIT_ROW_2,
] as const;

/** Listing-page hero background only (Umrah Gruppenreisen). */
export const LISTING_HERO_IMAGE = "/brand/umrah-listing-hero-makkah.png";

export const LISTING_HERO_IMAGE_MEDINA = "/brand/offer-hero/hero-bg-2.png";
export const LISTING_HERO_IMAGE_MAKKAH = "/brand/offer-hero/hero-bg-kaaba.png";
