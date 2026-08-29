import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/data/site-settings";
import { resolveBrandLogoSrc } from "@/lib/brand";

const STORAGE_KEY = "mobarak.siteSettings";
export const SITE_SETTINGS_EVENT = "mobarak-site-settings";

export function readSiteSettingsOverride(): SiteSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      logoSrc: resolveBrandLogoSrc(parsed.logoSrc ?? DEFAULT_SITE_SETTINGS.logoSrc),
      social: { ...DEFAULT_SITE_SETTINGS.social, ...(parsed.social ?? {}) },
      services: parsed.services ?? DEFAULT_SITE_SETTINGS.services,
      importantLinks: parsed.importantLinks ?? DEFAULT_SITE_SETTINGS.importantLinks,
    };
  } catch {
    return null;
  }
}

export function writeSiteSettings(settings: SiteSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(SITE_SETTINGS_EVENT));
}

export function getSiteSettings(): SiteSettings {
  return readSiteSettingsOverride() ?? DEFAULT_SITE_SETTINGS;
}
