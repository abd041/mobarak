import { DEFAULT_PARTNERS, type Partner } from "@/data/partners";

const STORAGE_KEY = "mobarak.partners.v7";
export const PARTNERS_EVENT = "mobarak-partners";

function sortPartners(list: Partner[]): Partner[] {
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export function readPartnersOverride(): Partner[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partner[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writePartners(list: Partner[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortPartners(list)));
  window.dispatchEvent(new Event(PARTNERS_EVENT));
}

export function getPartners(): Partner[] {
  const override = readPartnersOverride();
  return sortPartners(override ?? DEFAULT_PARTNERS);
}

/** Homepage: only partners Mobarak has enabled for public display */
export function getVisiblePartners(): Partner[] {
  return getPartners().filter((p) => p.visible && p.logoSrc.trim() && p.title.trim());
}

export function createEmptyPartner(sortOrder = 100): Partner {
  return {
    id: `partner-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    logoSrc: "",
    link: "",
    sortOrder,
    visible: false,
  };
}
