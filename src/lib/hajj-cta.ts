/** Inline pre-reg CTAs — desktop only on the Hajj landing page; mobile uses HajjStickyCta there. */
export const HAJJ_DESKTOP_CTA_BLOCK = "hidden lg:block";
export const HAJJ_DESKTOP_CTA_FLEX = "hidden lg:flex";

/** Sticky pre-reg bar — Hajj landing page mobile/tablet only; not used on /vormerkung (§26). */
export const HAJJ_MOBILE_STICKY_CTA = "lg:hidden";

/** Bottom padding so landing content clears the fixed sticky CTA on small screens. */
export const HAJJ_MOBILE_PAGE_PADDING =
  "pb-[calc(3.5rem+1.5rem+max(0.75rem,env(safe-area-inset-bottom)))] lg:pb-0";

export function isHajjPreRegHref(href: string): boolean {
  return /\/hajj-\d{4}\/vormerkung/.test(href) || href.includes("vormerkung");
}
