/**
 * Default hero inclusions on the Umrah group trips landing page.
 * Marketing strip — independent of per-trip enable/disable flags.
 */
export type ListingHeroBenefit = {
  id: string;
  icon: string;
  labelKey: string;
};

export const LISTING_HERO_BENEFITS: ListingHeroBenefit[] = [
  { id: "visa", icon: "/brand/inclusion-icons/visa.png", labelKey: "listingBenefitVisa" },
  { id: "flight", icon: "/brand/inclusion-icons/flight.png", labelKey: "listingBenefitFlight" },
  { id: "baggage", icon: "/brand/inclusion-icons/baggage.png", labelKey: "listingBenefitBaggage" },
  { id: "guide", icon: "/brand/inclusion-icons/guide.png", labelKey: "listingBenefitGuide" },
  { id: "religious", icon: "/brand/inclusion-icons/religious.png", labelKey: "listingBenefitReligious" },
  { id: "hotels", icon: "/brand/inclusion-icons/hotel.png", labelKey: "listingBenefitHotels" },
  { id: "breakfast", icon: "/brand/inclusion-icons/breakfast.png", labelKey: "listingBenefitBreakfast" },
  { id: "transfer", icon: "/brand/inclusion-icons/transfer.png", labelKey: "listingBenefitTransfer" },
  { id: "excursions", icon: "/brand/inclusion-icons/excursions.png", labelKey: "listingBenefitExcursions" },
];

const benefitById = Object.fromEntries(
  LISTING_HERO_BENEFITS.map((item) => [item.id, item]),
) as Record<string, ListingHeroBenefit>;

/** Row 1 — five services (Visum … Religiöse Begleitung). Desktop. */
export const LISTING_HERO_BENEFIT_ROW_1: ListingHeroBenefit[] = [
  benefitById.visa!,
  benefitById.flight!,
  benefitById.baggage!,
  benefitById.guide!,
  benefitById.religious!,
];

/** Row 2 — four services (Hotels … Ausflüge). Desktop. */
export const LISTING_HERO_BENEFIT_ROW_2: ListingHeroBenefit[] = [
  benefitById.hotels!,
  benefitById.breakfast!,
  benefitById.transfer!,
  benefitById.excursions!,
];

export const LISTING_HERO_BENEFIT_ROWS = [
  LISTING_HERO_BENEFIT_ROW_1,
  LISTING_HERO_BENEFIT_ROW_2,
] as const;

/** Mobile — 4 on top, 5 on bottom (section sits below the hero photo). */
export const LISTING_HERO_BENEFIT_ROWS_MOBILE = [
  [
    benefitById.visa!,
    benefitById.flight!,
    benefitById.baggage!,
    benefitById.guide!,
  ],
  [
    benefitById.religious!,
    benefitById.hotels!,
    benefitById.breakfast!,
    benefitById.transfer!,
    benefitById.excursions!,
  ],
] as const;

export const LISTING_HERO_IMAGE = "/brand/umrah-listing-hero.png";

export const LISTING_HERO_IMAGE_MEDINA = "/brand/offer-hero/hero-bg-2.png";
export const LISTING_HERO_IMAGE_MAKKAH = "/brand/offer-hero/hero-bg-kaaba.png";
