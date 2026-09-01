import type {
  IndividualUmrahAirlineId,
  IndividualUmrahAddonId,
  IndividualUmrahTravelPriorityId,
} from "@/data/individual-umrah-final";
import type { Locale } from "@/i18n/routing";
import type { PaxFormData } from "@/lib/inquiry-form-validation";
import type { IndividualUmrahFormData } from "@/lib/individual-umrah-validation";

const STORAGE_KEY = "mobarak.individualUmrahDraft";

/**
 * §33 — Personal details entered on the final inquiry page.
 * Kept separately so Step 1 “Ändern” / continue does not wipe them.
 */
export type IndividualUmrahFinalDetails = {
  pax: PaxFormData[];
  airline: IndividualUmrahAirlineId | "";
  addons: IndividualUmrahAddonId[];
  /** Optional multi-select; empty = none chosen. */
  travelPriorities: IndividualUmrahTravelPriorityId[];
  phone: string;
  phoneCountry: string;
  email: string;
  preferredLanguage: Locale | "";
  source: string;
  sourceOtherDetail: string;
};

/** Preference payload from Step 1, plus optional final-page personal state (§33). */
export type IndividualUmrahDraft = IndividualUmrahFormData & {
  final?: IndividualUmrahFinalDetails;
};

export function writeIndividualUmrahDraft(data: IndividualUmrahDraft) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota / private mode */
  }
}

export function readIndividualUmrahDraft(): IndividualUmrahDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as IndividualUmrahDraft;
  } catch {
    return null;
  }
}

/** Write Step 1 preferences while preserving any final-page personal details (§33). */
export function writeIndividualUmrahPreferences(data: IndividualUmrahFormData) {
  const existing = readIndividualUmrahDraft();
  writeIndividualUmrahDraft({
    ...data,
    final: existing?.final,
  });
}

/** Merge / replace final-page personal details onto the current travel draft (§33). */
export function writeIndividualUmrahFinalDetails(final: IndividualUmrahFinalDetails) {
  const existing = readIndividualUmrahDraft();
  if (!existing) return;
  writeIndividualUmrahDraft({
    ...existing,
    final,
  });
}

export function clearIndividualUmrahDraft() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
