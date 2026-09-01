import { MOCK_INDIVIDUAL_UMRAH_INQUIRIES } from "@/data/individual-umrah-inquiries-mock";
import {
  INDIVIDUAL_UMRAH_INQUIRY_STATUSES,
  normalizeInquiryCustomerLanguage,
  type IndividualUmrahInquiry,
  type IndividualUmrahInquiryStatus,
} from "@/lib/individual-umrah-inquiry";

const STORAGE_KEY = "mobarak.individualUmrahInquiries";
export const INDIVIDUAL_UMRAH_INQUIRIES_EVENT = "mobarak-individual-umrah-inquiries";

type StoredState = {
  patches: Array<{ inquiry_id: string; status?: string }>;
  /** Customer-submitted inquiries (frontend-first until backend). */
  submitted: IndividualUmrahInquiry[];
};

function emptyState(): StoredState {
  return { patches: [], submitted: [] };
}

/** Map legacy status values from earlier frontend milestones. */
const LEGACY_STATUS_MAP: Record<string, IndividualUmrahInquiryStatus> = {
  new: "new",
  in_progress: "offer_in_preparation",
  offered: "offer_sent",
  closed: "cancelled",
};

export function normalizeIndividualUmrahInquiryStatus(
  status: string | undefined | null,
): IndividualUmrahInquiryStatus {
  if (!status) return "new";
  if ((INDIVIDUAL_UMRAH_INQUIRY_STATUSES as string[]).includes(status)) {
    return status as IndividualUmrahInquiryStatus;
  }
  return LEGACY_STATUS_MAP[status] ?? "new";
}

function normalizeStoredInquiry(inquiry: IndividualUmrahInquiry): IndividualUmrahInquiry {
  return normalizeInquiryCustomerLanguage({
    ...inquiry,
    status: normalizeIndividualUmrahInquiryStatus(inquiry.status),
  });
}

function readState(): StoredState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as
      | StoredState
      | Array<{ inquiry_id: string; status?: string }>;
    // Migrate legacy patch-only array
    if (Array.isArray(parsed)) {
      return { patches: parsed, submitted: [] };
    }
    return {
      patches: parsed.patches ?? [],
      submitted: (parsed.submitted ?? []).map((inquiry) => normalizeStoredInquiry(inquiry)),
    };
  } catch {
    return emptyState();
  }
}

function writeState(state: StoredState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(INDIVIDUAL_UMRAH_INQUIRIES_EVENT));
}

function applyPatch(
  inquiry: IndividualUmrahInquiry,
  patches: StoredState["patches"],
): IndividualUmrahInquiry {
  const patch = patches.find((p) => p.inquiry_id === inquiry.inquiry_id);
  const status = normalizeIndividualUmrahInquiryStatus(patch?.status ?? inquiry.status);
  // Status patches never rewrite customer_language
  return normalizeInquiryCustomerLanguage({ ...inquiry, status });
}

/** Merge mock seed + submitted inquiries with status overrides. */
export function getIndividualUmrahInquiries(): IndividualUmrahInquiry[] {
  const state = readState();
  const submittedIds = new Set(state.submitted.map((i) => i.inquiry_id));
  const mocks = MOCK_INDIVIDUAL_UMRAH_INQUIRIES.filter((i) => !submittedIds.has(i.inquiry_id)).map(
    (i) => applyPatch(i, state.patches),
  );
  const submitted = state.submitted.map((i) => applyPatch(i, state.patches));
  return [...submitted, ...mocks].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function getIndividualUmrahInquiry(id: string): IndividualUmrahInquiry | null {
  return getIndividualUmrahInquiries().find((i) => i.inquiry_id === id) ?? null;
}

export function updateIndividualUmrahInquiryStatus(
  inquiryId: string,
  status: IndividualUmrahInquiryStatus,
) {
  const state = readState();
  state.patches = state.patches.filter((p) => p.inquiry_id !== inquiryId);
  state.patches.push({ inquiry_id: inquiryId, status });
  writeState(state);
}

/** Append a customer-submitted inquiry (frontend-first persistence). */
export function addIndividualUmrahInquiry(inquiry: IndividualUmrahInquiry) {
  const state = readState();
  const normalized = normalizeStoredInquiry(inquiry);
  state.submitted = [
    normalized,
    ...state.submitted.filter((i) => i.inquiry_id !== normalized.inquiry_id),
  ];
  writeState(state);
}

export const INDIVIDUAL_UMRAH_STATUS_LABELS: Record<IndividualUmrahInquiryStatus, string> = {
  new: "Neue Anfrage",
  offer_in_preparation: "Angebot in Vorbereitung",
  offer_created: "Angebot erstellt",
  offer_sent: "Angebot gesendet",
  customer_interested: "Kunde interessiert",
  booked: "Gebucht",
  cancelled: "Storniert",
};

/** Statuses still considered “open” on the admin dashboard. */
export const INDIVIDUAL_UMRAH_OPEN_STATUSES: IndividualUmrahInquiryStatus[] = [
  "new",
  "offer_in_preparation",
  "offer_created",
  "offer_sent",
  "customer_interested",
];
