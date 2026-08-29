import type { TripImage } from "@/data/mock";
import { normalizeTripGallery } from "@/lib/trip-gallery";

/**
 * Mobarak trip / hotel / group photography for offer cards.
 * Prefer these assets over generic stock — configurable per departure in trip data.
 */
export const TRIP_CARD_PHOTOS = {
  kaaba: {
    src: "/brand/offer-hero/kaaba.png",
    caption: "Kaaba",
  },
  medina: {
    src: "/brand/offer-hero/medina.png",
    caption: "Medina",
  },
  makkahHotel: {
    src: "/brand/offer-hero/makkah.png",
    caption: "Hotel in Makkah",
  },
  medinaHotel: {
    src: "/brand/offer-hero/medina.png",
    caption: "Hotel in Medina",
  },
  lobbyMakkah: {
    src: "/brand/offer-hero/group-02.png",
    caption: "Hotellobby",
  },
  lobbyMedina: {
    src: "/brand/offer-hero/group-03.png",
    caption: "Hotellobby",
  },
  groupExcursion: {
    src: "/brand/offer-hero/ziyarat.png",
    caption: "Ausflüge",
  },
  excursionMakkah: {
    src: "/brand/offer-hero/ziyarat.png",
    caption: "Ausflüge",
  },
  mobarakGroup: {
    src: "/brand/offer-hero/group-photo.png",
    caption: "Gruppenfoto",
  },
  mobarakGroup01: {
    src: "/brand/offer-hero/group-01.png",
    caption: "Gruppenfoto",
  },
  mobarakGroup02: {
    src: "/brand/offer-hero/group-04.png",
    caption: "Gruppenfoto",
  },
  mobarakGroup03: {
    src: "/brand/offer-hero/group-05.png",
    caption: "Gruppenfoto",
  },
  mobarakGroup04: {
    src: "/brand/offer-hero/group-06.png",
    caption: "Gruppenfoto",
  },
} as const satisfies Record<string, Omit<TripImage, "sortOrder">>;

export type TripCardPhotoKey = keyof typeof TRIP_CARD_PHOTOS;

/** Build a departure gallery from Mobarak photo keys (array order = sort order). */
export function buildTripCardGallery(...keys: TripCardPhotoKey[]): TripImage[] {
  return normalizeTripGallery(
    keys.map((key, index) => ({
      ...TRIP_CARD_PHOTOS[key],
      sortOrder: index,
    })),
  );
}

/** Default gallery mix when a departure has no custom images configured. */
export const DEFAULT_TRIP_CARD_GALLERY = buildTripCardGallery(
  "kaaba",
  "makkahHotel",
  "medinaHotel",
  "lobbyMedina",
  "excursionMakkah",
  "groupExcursion",
  "mobarakGroup",
);
