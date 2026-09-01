import type {
  IndividualUmrahOffer,
  IndividualUmrahOfferPdfSnapshot,
} from "@/lib/individual-umrah-offer";
import { newOfferEntityId } from "@/lib/individual-umrah-offer";
import { SEED_INDIVIDUAL_UMRAH_OFFER } from "@/data/individual-umrah-offer-mock";
import {
  normalizeOfferAddon,
  normalizeOfferFlightOption,
  normalizeOfferHotelOption,
  normalizeOfferTerms,
} from "@/lib/individual-umrah-offer-defaults";
import type { OfferCityHotelBlock } from "@/lib/individual-umrah-architecture";
import {
  isIndividualUmrahCustomerLanguage,
  type IndividualUmrahInquiry,
} from "@/lib/individual-umrah-inquiry";
import {
  OFFER_PDF_LANGUAGE_LABEL_DE,
  resolveOfferPdfLocale,
  type OfferPdfLocale,
} from "@/lib/individual-umrah-offer-pdf-i18n";

const STORAGE_KEY = "mobarak.individualUmrahOffers";
const HISTORY_KEY = "mobarak.individualUmrahOfferPdfHistory";
export const INDIVIDUAL_UMRAH_OFFERS_EVENT = "mobarak-individual-umrah-offers";

function normalizeExtraCityHotels(
  value: IndividualUmrahOffer["extraCityHotels"],
): OfferCityHotelBlock[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((block) => block && typeof block.cityId === "string" && block.cityId.trim())
    .filter((block) => block.cityId !== "medina" && block.cityId !== "makkah")
    .map((block) => ({
      cityId: block.cityId.trim(),
      options: (block.options ?? []).map((h) => normalizeOfferHotelOption(h)),
    }));
}

function normalizePdfLanguageOverride(
  value: IndividualUmrahOffer["pdfLanguageOverride"] | undefined,
): IndividualUmrahOffer["pdfLanguageOverride"] {
  if (value && isIndividualUmrahCustomerLanguage(value)) return value;
  return null;
}

function normalizeOffer(offer: IndividualUmrahOffer): IndividualUmrahOffer {
  return {
    ...offer,
    pdfLanguageOverride: normalizePdfLanguageOverride(offer.pdfLanguageOverride),
    flights: (offer.flights ?? []).map((f) => normalizeOfferFlightOption(f)),
    medinaHotels: (offer.medinaHotels ?? []).map((h) => normalizeOfferHotelOption(h)),
    makkahHotels: (offer.makkahHotels ?? []).map((h) => normalizeOfferHotelOption(h)),
    extraCityHotels: normalizeExtraCityHotels(offer.extraCityHotels),
    recommendedCombinations: Array.isArray(offer.recommendedCombinations)
      ? offer.recommendedCombinations
      : [],
    addons: (offer.addons ?? []).map((a) => normalizeOfferAddon(a)),
    ...normalizeOfferTerms(offer),
    pdfVersion: Math.max(0, Number(offer.pdfVersion) || 0),
    pdfGeneratedAt: offer.pdfGeneratedAt ?? null,
    pdfContentFingerprint: offer.pdfContentFingerprint ?? null,
  };
}

/** Stable fingerprint of customer-facing offer content (ignores PDF meta). */
export function offerContentFingerprint(offer: IndividualUmrahOffer): string {
  const payload = {
    pdfLanguageOverride: offer.pdfLanguageOverride ?? null,
    greetingName: offer.greetingName,
    flights: offer.flights,
    medinaHotels: offer.medinaHotels,
    makkahHotels: offer.makkahHotels,
    extraCityHotels: offer.extraCityHotels ?? [],
    recommendedCombinations: offer.recommendedCombinations ?? [],
    addons: offer.addons,
    includedTermIds: offer.includedTermIds ?? [],
    excludedTermIds: offer.excludedTermIds ?? [],
    noteTermIds: offer.noteTermIds ?? [],
    includedItems: offer.includedItems,
    excludedItems: offer.excludedItems,
    importantNotes: offer.importantNotes,
  };
  return JSON.stringify(payload);
}

export function isOfferPdfDirty(offer: IndividualUmrahOffer): boolean {
  if (!offer.pdfGeneratedAt || !offer.pdfContentFingerprint) return false;
  return offerContentFingerprint(offer) !== offer.pdfContentFingerprint;
}

function readStored(): IndividualUmrahOffer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as IndividualUmrahOffer[]).map(normalizeOffer);
  } catch {
    return [];
  }
}

function writeStored(offers: IndividualUmrahOffer[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
  window.dispatchEvent(new Event(INDIVIDUAL_UMRAH_OFFERS_EVENT));
}

function normalizeSnapshotPdfLanguage(
  snap: Partial<IndividualUmrahOfferPdfSnapshot> & {
    offer?: IndividualUmrahOffer;
  },
): OfferPdfLocale {
  if (snap.pdfLanguage && isIndividualUmrahCustomerLanguage(snap.pdfLanguage)) {
    return snap.pdfLanguage;
  }
  const override = snap.offer?.pdfLanguageOverride;
  if (override && isIndividualUmrahCustomerLanguage(override)) {
    return override;
  }
  return "de";
}

function readHistory(): IndividualUmrahOfferPdfSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as IndividualUmrahOfferPdfSnapshot[]).map((s) => {
      const offer = normalizeOffer(s.offer);
      return {
        ...s,
        offer,
        pdfLanguage: normalizeSnapshotPdfLanguage({ ...s, offer }),
      };
    });
  } catch {
    return [];
  }
}

function writeHistory(snapshots: IndividualUmrahOfferPdfSnapshot[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(snapshots));
  window.dispatchEvent(new Event(INDIVIDUAL_UMRAH_OFFERS_EVENT));
}

/**
 * Effective PDF language on a history row (spec 17).
 * Prefer stored `pdfLanguage`; legacy rows resolve from inquiry + offer when provided.
 */
export function resolveOfferPdfSnapshotLanguage(
  snap: IndividualUmrahOfferPdfSnapshot,
  inquiry?: IndividualUmrahInquiry | null,
): OfferPdfLocale {
  if (snap.pdfLanguage && isIndividualUmrahCustomerLanguage(snap.pdfLanguage)) {
    return snap.pdfLanguage;
  }
  if (inquiry) {
    return resolveOfferPdfLocale(inquiry, snap.offer);
  }
  return normalizeSnapshotPdfLanguage(snap);
}

/** Seed offer (PDF sample) plus any admin-saved offers; saved wins on same inquiryId. */
export function getIndividualUmrahOffers(): IndividualUmrahOffer[] {
  const stored = readStored();
  const byInquiry = new Map<string, IndividualUmrahOffer>();
  byInquiry.set(
    SEED_INDIVIDUAL_UMRAH_OFFER.inquiryId,
    normalizeOffer(SEED_INDIVIDUAL_UMRAH_OFFER),
  );
  for (const offer of stored) {
    byInquiry.set(offer.inquiryId, normalizeOffer(offer));
  }
  return Array.from(byInquiry.values());
}

export function getIndividualUmrahOfferByInquiry(
  inquiryId: string,
): IndividualUmrahOffer | null {
  return getIndividualUmrahOffers().find((o) => o.inquiryId === inquiryId) ?? null;
}

export function saveIndividualUmrahOffer(offer: IndividualUmrahOffer) {
  const stored = readStored().filter((o) => o.inquiryId !== offer.inquiryId);
  stored.push(normalizeOffer(offer));
  writeStored(stored);
}

/** PDF versions for an inquiry, newest first. */
export function getOfferPdfHistory(
  inquiryId: string,
): IndividualUmrahOfferPdfSnapshot[] {
  return readHistory()
    .filter((s) => s.inquiryId === inquiryId)
    .sort((a, b) => b.version - a.version || b.generatedAt.localeCompare(a.generatedAt));
}

export function getOfferPdfSnapshot(
  snapshotId: string,
): IndividualUmrahOfferPdfSnapshot | null {
  return readHistory().find((s) => s.snapshotId === snapshotId) ?? null;
}

export function getLatestOfferPdfSnapshot(
  inquiryId: string,
): IndividualUmrahOfferPdfSnapshot | null {
  return getOfferPdfHistory(inquiryId)[0] ?? null;
}

/**
 * Persist offer + **append** an immutable PDF history snapshot.
 * Never overwrites prior versions — Generate / Regenerate always adds Angebot Vn.
 * Spec 17: each snapshot stores the effective PDF language at generation time.
 */
export function generateOfferPdfVersion(
  offer: IndividualUmrahOffer,
  inquiry: IndividualUmrahInquiry,
): { offer: IndividualUmrahOffer; snapshot: IndividualUmrahOfferPdfSnapshot } {
  const fingerprint = offerContentFingerprint(offer);
  const generatedAt = new Date().toISOString();
  const existingVersions = getOfferPdfHistory(offer.inquiryId).map((s) => s.version);
  const version =
    Math.max(0, Number(offer.pdfVersion) || 0, ...existingVersions) + 1;
  const pdfLanguage = resolveOfferPdfLocale(inquiry, offer);
  const next: IndividualUmrahOffer = normalizeOffer({
    ...offer,
    status: "ready",
    pdfVersion: version,
    pdfGeneratedAt: generatedAt,
    pdfContentFingerprint: fingerprint,
  });
  const snapshot: IndividualUmrahOfferPdfSnapshot = {
    snapshotId: newOfferEntityId("pdf"),
    inquiryId: next.inquiryId,
    version,
    generatedAt,
    offerNumber: next.offerNumber,
    pdfLanguage,
    offer: structuredClone(next),
  };
  saveIndividualUmrahOffer(next);
  writeHistory([snapshot, ...readHistory()]);
  return { offer: next, snapshot };
}

/** Compact one-liner: „Angebot V1 – 25.08.2026 – 15:42“. */
export function formatOfferPdfVersionLabel(
  version: number,
  generatedAt: string,
): string {
  const parts = formatOfferPdfVersionParts(version, generatedAt);
  return `${parts.title} – ${parts.datetime}`;
}

/** Spec 17 Admin history: title + datetime lines. */
export function formatOfferPdfVersionParts(
  version: number,
  generatedAt: string,
): { title: string; datetime: string } {
  const title = `Angebot V${version}`;
  const d = new Date(generatedAt);
  if (Number.isNaN(d.getTime())) {
    return { title, datetime: "—" };
  }
  const date = new Intl.DateTimeFormat("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("de-AT", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return { title, datetime: `${date} – ${time}` };
}

export function formatOfferPdfVersionLanguageLabelDe(
  locale: OfferPdfLocale,
): string {
  return OFFER_PDF_LANGUAGE_LABEL_DE[locale] ?? locale;
}
