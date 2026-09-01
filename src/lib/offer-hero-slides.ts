/** Hero slider images for the Umrah group trip offer page — 4 slides only. */
export type OfferHeroSlide = {
  id: string;
  src: string;
  altKey: string;
};

export const OFFER_HERO_SLIDES: OfferHeroSlide[] = [
  { id: "kaaba", src: "/brand/offer-hero/hero-bg-kaaba.png", altKey: "heroSlideKaaba" },
  { id: "medina", src: "/brand/offer-hero/hero-bg-2.png", altKey: "heroSlideMedina" },
  { id: "group-photo", src: "/brand/offer-hero/hero-bg-3.png", altKey: "heroSlideGroup" },
  { id: "ziyarat", src: "/brand/offer-hero/hero-bg-4.png", altKey: "heroSlideZiyarat" },
];
