import type { Hotel } from "@/data/mock";
import { hotels as seedHotels } from "@/data/mock";

/** Editable hotel catalog fields — name, image, and star rating. */
export type HotelCatalogFields = {
  name: string;
  stars: number;
  /** Primary hotel image URL */
  image: string;
  walkingMinutes: number;
  breakfast: boolean;
};

const STORAGE_KEY = "mobarak.hotelCatalog";

export function readHotelCatalogOverrides(): Record<string, Partial<HotelCatalogFields>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Partial<HotelCatalogFields>>;
  } catch {
    return {};
  }
}

export function writeHotelCatalogOverride(hotelId: string, value: HotelCatalogFields) {
  if (typeof window === "undefined") return;
  const all = readHotelCatalogOverrides();
  all[hotelId] = {
    name: value.name.trim(),
    stars: Math.min(5, Math.max(1, Math.round(Number(value.stars) || 1))),
    image: value.image.trim(),
    walkingMinutes: Math.max(0, Math.round(Number(value.walkingMinutes) || 0)),
    breakfast: Boolean(value.breakfast),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

export function getHotelCatalogFields(hotel: Hotel): HotelCatalogFields {
  const override = readHotelCatalogOverrides()[hotel.id];
  return {
    name: override?.name?.trim() || hotel.name,
    stars: override?.stars ?? hotel.stars,
    image: override?.image?.trim() || hotel.images[0]?.src || "",
    walkingMinutes: override?.walkingMinutes ?? hotel.walkingMinutes,
    breakfast: override?.breakfast ?? hotel.breakfast,
  };
}

/** Resolve a hotel record with catalog overrides applied. */
export function resolveHotel(hotel: Hotel): Hotel {
  const fields = getHotelCatalogFields(hotel);
  const images =
    fields.image && fields.image !== hotel.images[0]?.src
      ? [
          { src: fields.image, caption: fields.name, sortOrder: 0 },
          ...hotel.images.slice(1).map((img, i) => ({ ...img, sortOrder: i + 1 })),
        ]
      : hotel.images.map((img, i) =>
          i === 0 ? { ...img, caption: fields.name, sortOrder: 0 } : { ...img, sortOrder: i },
        );

  return {
    ...hotel,
    name: fields.name,
    stars: fields.stars,
    walkingMinutes: fields.walkingMinutes,
    breakfast: fields.breakfast,
    images: images.length
      ? images
      : [{ src: fields.image || "/brand/hero-bg.png", caption: fields.name, sortOrder: 0 }],
  };
}

export function resolveHotelById(id: string): Hotel | undefined {
  const hotel = seedHotels.find((h) => h.id === id);
  return hotel ? resolveHotel(hotel) : undefined;
}

export function listResolvedHotels(): Hotel[] {
  return seedHotels.map(resolveHotel);
}
