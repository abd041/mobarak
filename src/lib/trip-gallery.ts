import type { TripImage } from "@/data/mock";

/**
 * Suggested captions for departure galleries (admin presets).
 * Captions remain optional — empty string = no caption shown.
 */
export const GALLERY_CAPTION_PRESETS = [
  "Hotel in Makkah",
  "Hotel in Medina",
  "Lobby in Makkah",
  "Lobby in Medina",
  "Ausflug in Makkah",
  "Ausflug in Medina",
  "Unsere Reisegruppe",
] as const;

export type GalleryCaptionPreset = (typeof GALLERY_CAPTION_PRESETS)[number];

const STORAGE_KEY = "mobarak.tripGallery";

export function normalizeTripGallery(images: readonly Partial<TripImage>[]): TripImage[] {
  const normalized = images
    .map((img, index) => ({
      src: (img.src ?? "").trim(),
      caption: (img.caption ?? "").trim() || undefined,
      sortOrder:
        typeof img.sortOrder === "number" && Number.isFinite(img.sortOrder)
          ? img.sortOrder
          : index,
    }))
    .filter((img) => img.src.length > 0);

  return sortTripGallery(normalized);
}

/** Stable ascending sort by sortOrder, then original index. */
export function sortTripGallery(images: readonly TripImage[]): TripImage[] {
  return [...images]
    .map((img, index) => ({ img, index }))
    .sort((a, b) => {
      const orderA = a.img.sortOrder ?? a.index;
      const orderB = b.img.sortOrder ?? b.index;
      if (orderA !== orderB) return orderA - orderB;
      return a.index - b.index;
    })
    .map(({ img }, index) => ({
      ...img,
      sortOrder: img.sortOrder ?? index,
      caption: img.caption?.trim() || undefined,
    }));
}

export function readGalleryOverrides(): Record<string, TripImage[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Partial<TripImage>[]>;
    const result: Record<string, TripImage[]> = {};
    for (const [id, images] of Object.entries(parsed)) {
      result[id] = normalizeTripGallery(images ?? []);
    }
    return result;
  } catch {
    return {};
  }
}

export function writeGalleryOverride(tripId: string, images: TripImage[]) {
  if (typeof window === "undefined") return;
  const all = readGalleryOverrides();
  all[tripId] = normalizeTripGallery(images);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("mobarak-availability"));
}

/** Effective gallery for a departure — admin override or trip record, sorted. */
export function getTripGallery(trip: { id: string; images: TripImage[] }): TripImage[] {
  const override = readGalleryOverrides()[trip.id];
  return normalizeTripGallery(override ?? trip.images);
}

export function moveGalleryItem(
  images: TripImage[],
  fromIndex: number,
  direction: -1 | 1,
): TripImage[] {
  const sorted = sortTripGallery(images);
  const toIndex = fromIndex + direction;
  if (toIndex < 0 || toIndex >= sorted.length) return sorted;

  const next = [...sorted];
  const a = next[fromIndex]!;
  const b = next[toIndex]!;
  next[fromIndex] = b;
  next[toIndex] = a;

  return next.map((img, index) => ({ ...img, sortOrder: index }));
}

export function reindexGallerySortOrder(images: TripImage[]): TripImage[] {
  return sortTripGallery(images).map((img, index) => ({ ...img, sortOrder: index }));
}
