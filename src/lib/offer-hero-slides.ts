/** Single hero plate for the Umrah group offer detail page (reference redesign). */
export const OFFER_DETAIL_HERO_IMAGE = "/brand/offer-hero/offer-detail-hero-makkah.png";

/** @deprecated Multi-slide hero — kept for any leftover imports; detail page uses OFFER_DETAIL_HERO_IMAGE. */
export type OfferHeroSlide = {
  id: string;
  src: string;
  altKey: string;
};

export const OFFER_HERO_SLIDES: OfferHeroSlide[] = [
  { id: "kaaba", src: OFFER_DETAIL_HERO_IMAGE, altKey: "heroSlideKaaba" },
  { id: "medina", src: "/brand/offer-hero/hero-bg-2.png", altKey: "heroSlideMedina" },
  { id: "group-photo", src: "/brand/offer-hero/hero-bg-3.png", altKey: "heroSlideGroup" },
  { id: "ziyarat", src: "/brand/offer-hero/hero-bg-4.png", altKey: "heroSlideZiyarat" },
];
