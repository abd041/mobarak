import type { HajjPageContent } from "@/data/hajj-content-defaults";
import type { Locale } from "@/data/mock";

export type HajjCampaignStatus = "draft" | "active" | "archived";

export type HajjCampaignSettings = {
  /** Show Google reviews block on the landing page */
  googleReviewsEnabled: boolean;
};

export type HajjCampaign = {
  slug: string;
  year: number;
  label: string;
  status: HajjCampaignStatus;
  /** Primary campaign for site nav / footer links */
  isDefault: boolean;
  preRegEnabled: boolean;
  settings: HajjCampaignSettings;
  locales: Partial<Record<Locale, HajjPageContent>>;
  createdAt: string;
  updatedAt: string;
};

export type HajjCampaignsFile = {
  version: 2;
  campaigns: HajjCampaign[];
};

export function hajjCampaignLandingPath(slug: string): string {
  return `/${slug}`;
}

export function hajjCampaignPreRegPath(slug: string): string {
  return `/${slug}/vormerkung`;
}

export function isHajjCampaignPath(pathname: string): boolean {
  return (
    /^\/hajj-\d{4}(\/|$)/.test(pathname) || /^\/hajj\/campaign\/hajj-\d{4}(\/|$)/.test(pathname)
  );
}

/** §26 — pre-registration form: no sticky mobile CTA (landing page only). */
export function isHajjPreRegPath(pathname: string): boolean {
  return /\/vormerkung\/?$/.test(pathname);
}

export function parseHajjCampaignSlug(pathname: string): string | null {
  const publicMatch = pathname.match(/^\/(hajj-\d{4})(?:\/|$)/);
  if (publicMatch) return publicMatch[1];
  const internalMatch = pathname.match(/^\/hajj\/campaign\/(hajj-\d{4})(?:\/|$)/);
  return internalMatch?.[1] ?? null;
}
