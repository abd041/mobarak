import type { Hotel, TripImage } from "@/data/mock";
import { hotels as seedHotels } from "@/data/mock";
import {
  mealPlansIncludeBreakfast,
  normalizeMealPlans,
  type HotelMealPlanId,
} from "@/lib/hotel-meal-plans";

/** Editable hotel catalog fields — one record per hotel (Medina or Makkah). */
export type HotelCatalogFields = {
  name: string;
  city: "medina" | "makkah";
  stars: number;
  /** One or more image URLs / paths */
  images: string[];
  /** Walking minutes to Haram / Nabawi */
  walkingMinutes: number;
  description: string;
  mealPlans: HotelMealPlanId[];
  notes: string;
  active: boolean;
};

const STORAGE_KEY = "mobarak.hotelCatalog";

function mosqueForCity(city: "medina" | "makkah"): "nabawi" | "haram" {
  return city === "medina" ? "nabawi" : "haram";
}

function imagesFromUrls(urls: string[], caption: string): TripImage[] {
  const cleaned = urls.map((u) => u.trim()).filter(Boolean);
  if (!cleaned.length) {
    return [{ src: "/brand/hero-bg.png", caption, sortOrder: 0 }];
  }
  return cleaned.map((src, sortOrder) => ({ src, caption, sortOrder }));
}

export function normalizeHotelCatalogFields(
  value: Partial<HotelCatalogFields> & { image?: string; breakfast?: boolean },
  fallback?: Partial<Hotel>,
): HotelCatalogFields {
  const city =
    value.city === "makkah" || value.city === "medina"
      ? value.city
      : fallback?.city === "makkah"
        ? "makkah"
        : "medina";

  let images =
    Array.isArray(value.images) && value.images.length
      ? value.images.map(String)
      : value.image?.trim()
        ? [value.image.trim()]
        : (fallback?.images ?? []).map((img) => img.src);

  if (!images.length) images = [fallback?.images?.[0]?.src || "/brand/hero-bg.png"];

  const mealPlans = normalizeMealPlans(
    value.mealPlans ??
      (value.breakfast === false
        ? ["room_only"]
        : fallback?.mealPlans ?? ["breakfast"]),
  );

  return {
    name: (value.name ?? fallback?.name ?? "").trim() || "Hotel",
    city,
    stars: Math.min(5, Math.max(1, Math.round(Number(value.stars ?? fallback?.stars) || 1))),
    images,
    walkingMinutes: Math.max(
      0,
      Math.round(Number(value.walkingMinutes ?? fallback?.walkingMinutes) || 0),
    ),
    description: String(value.description ?? fallback?.description ?? "").trim(),
    mealPlans,
    notes: String(value.notes ?? fallback?.notes ?? "").trim(),
    active: value.active ?? fallback?.active ?? true,
  };
}

export function applyHotelCatalogFields(hotel: Hotel, fields: HotelCatalogFields): Hotel {
  const normalized = normalizeHotelCatalogFields(fields, hotel);
  return {
    ...hotel,
    name: normalized.name,
    city: normalized.city,
    mosque: mosqueForCity(normalized.city),
    stars: normalized.stars,
    walkingMinutes: normalized.walkingMinutes,
    breakfast: mealPlansIncludeBreakfast(normalized.mealPlans),
    mealPlans: normalized.mealPlans,
    description: normalized.description || undefined,
    notes: normalized.notes || undefined,
    active: normalized.active,
    images: imagesFromUrls(normalized.images, normalized.name),
  };
}

export function getHotelCatalogFields(hotel: Hotel): HotelCatalogFields {
  const override = readHotelCatalogOverrides()[hotel.id];
  return normalizeHotelCatalogFields(override ?? {}, hotel);
}

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
  all[hotelId] = normalizeHotelCatalogFields(value);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

/** Resolve a hotel record with catalog overrides applied. */
export function resolveHotel(hotel: Hotel): Hotel {
  return applyHotelCatalogFields(hotel, getHotelCatalogFields(hotel));
}

/** Optional runtime registry so custom hotels resolve in PDF / offer UIs after fetch. */
let runtimeHotels: Hotel[] | null = null;

export function setRuntimeHotels(hotels: Hotel[]) {
  runtimeHotels = hotels;
}

export function resolveHotelById(id: string): Hotel | undefined {
  const fromRuntime = runtimeHotels?.find((h) => h.id === id);
  if (fromRuntime) return fromRuntime;
  const hotel = seedHotels.find((h) => h.id === id);
  return hotel ? resolveHotel(hotel) : undefined;
}

export function listResolvedHotels(): Hotel[] {
  if (runtimeHotels) return runtimeHotels;
  return seedHotels.map(resolveHotel);
}

export function emptyHotelCatalogFields(city: "medina" | "makkah" = "makkah"): HotelCatalogFields {
  return {
    name: "",
    city,
    stars: 5,
    images: [""],
    walkingMinutes: 5,
    description: "",
    mealPlans: ["breakfast"],
    notes: "",
    active: true,
  };
}
