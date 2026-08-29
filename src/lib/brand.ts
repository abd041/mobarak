/** Canonical Mobarak brand logo — single source for header, footer, admin, and metadata. */
export const BRAND_LOGO = {
  src: "/brand/mobarak-logo.jpg",
  width: 447,
  height: 447,
  alt: "Mobarak Hajj & Umrah",
} as const;

/** Legacy paths replaced by {@link BRAND_LOGO.src}. */
export const LEGACY_LOGO_PATHS = [
  "/brand/mobarak-logo.png",
  "/brand/mobarak-logo-circular.png",
] as const;

export function resolveBrandLogoSrc(src: string): string {
  return LEGACY_LOGO_PATHS.includes(src as (typeof LEGACY_LOGO_PATHS)[number])
    ? BRAND_LOGO.src
    : src;
}
