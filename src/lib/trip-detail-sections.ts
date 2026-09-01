/**
 * Stable section IDs for the trip detail page.
 * Keep these for deep links, jump nav, and future CMS mapping.
 */
export const TRIP_DETAIL_SECTION_IDS = [
  "overview",
  "gallery",
  "hotels",
  "flights",
  "luggage",
  "transfers",
  "visa",
  "guides",
  "excursions",
  "prices",
  "availability",
  "itinerary",
  "faq",
  "booking",
] as const;

export type TripDetailSectionId = (typeof TRIP_DETAIL_SECTION_IDS)[number];

/** Jump-nav entries shown on the detail page (label keys under `umrah`) */
export const TRIP_DETAIL_NAV: {
  id: TripDetailSectionId;
  labelKey: string;
}[] = [
  { id: "hotels", labelKey: "sectionHotels" },
  { id: "gallery", labelKey: "sectionGallery" },
  { id: "flights", labelKey: "sectionFlights" },
  { id: "luggage", labelKey: "sectionLuggage" },
  { id: "guides", labelKey: "sectionGuides" },
  { id: "itinerary", labelKey: "sectionItinerary" },
  { id: "faq", labelKey: "sectionFaq" },
];
