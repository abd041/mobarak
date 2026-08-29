/** Shared image quality presets — sharp enough, not oversized. */
export const IQ = {
  /** LCP / hero */
  hero: 75,
  /** Trip cards, galleries */
  card: 68,
  /** Small thumbs / icons in cards */
  thumb: 65,
  /** Content sections */
  content: 75,
  /** Logos / flat graphics */
  logo: 90,
} as const;

/** Responsive `sizes` for offer-card galleries (listing split + grid breakpoints). */
export function getTripCardGallerySizes(
  layout: "default" | "listing-split",
  prominence: "listing" | "default",
): string {
  if (prominence === "listing") {
    return "(max-width: 767px) 100vw, (max-width: 1024px) 46vw, 400px";
  }
  return "(max-width: 767px) 92vw, (max-width: 1024px) 45vw, 360px";
}

/** Only fetch slides the user has reached (or the first slide once the card is near the viewport). */
export function shouldLoadGallerySlide(
  index: number,
  loaded: ReadonlySet<number>,
): boolean {
  return loaded.has(index);
}
