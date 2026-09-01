import { DEFAULT_VISUM_CMS, type VisumCmsConfig } from "@/data/visum-cms";
import { mergeVisumCmsConfig } from "@/lib/visum-cms-merge";

const STORAGE_KEY = "mobarak.visumCms";
export const VISUM_CMS_EVENT = "mobarak-visum-cms";

export { mergeVisumCmsConfig };

export function readVisumCmsOverride(): VisumCmsConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return mergeVisumCmsConfig(JSON.parse(raw) as Partial<VisumCmsConfig>);
  } catch {
    return null;
  }
}

export function writeVisumCms(config: VisumCmsConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event(VISUM_CMS_EVENT));
}

/** Prefer localStorage (live Admin preview), else defaults. */
export function getVisumCms(): VisumCmsConfig {
  return readVisumCmsOverride() ?? DEFAULT_VISUM_CMS;
}

export function resetVisumCms() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(VISUM_CMS_EVENT));
}
