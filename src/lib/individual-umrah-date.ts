/**
 * §22 — Flexibility meaning
 *
 * If the customer selects start date 12 October and ± 2 days, Mobarak may search
 * departures between 10 October and 14 October.
 *
 * Persist both fields separately. Never overwrite `requested_start_date` with the
 * search window bounds.
 */

/** ISO calendar date `YYYY-MM-DD` — the customer's chosen start day. */
export type RequestedStartDate = string;

export type IndividualUmrahTravelDateFields = {
  /** Customer's exact selected travel start (§22). Never rewritten by flexibility. */
  requested_start_date: RequestedStartDate;
  /**
   * §40 — when flexibility is selected, store the allowed ± day range (`0`–`4`).
   * `null` = not selected (§39 optional); do not invent a search window.
   */
  flexibility_days: number | null;
};

/** Inclusive departure search window derived for offer logic — not a stored replacement date. */
export type FlexibilitySearchWindow = {
  earliest_departure: RequestedStartDate;
  latest_departure: RequestedStartDate;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toIsoDate(d: Date): RequestedStartDate {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseIsoDate(iso: RequestedStartDate): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return d;
}

/**
 * Build `requested_start_date` from the month dropdown (`YYYY-MM`) + day chip.
 * Returns `null` if incomplete or invalid.
 */
export function buildRequestedStartDate(
  travelMonth: string,
  travelDay: number | null,
): RequestedStartDate | null {
  if (!travelMonth || travelDay == null) return null;
  const [yearStr, monthStr] = travelMonth.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!year || !month) return null;
  const d = new Date(year, month - 1, travelDay);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== travelDay) {
    return null;
  }
  return toIsoDate(d);
}

/**
 * Search window for departures: [start − flexibility, start + flexibility].
 * Does not modify `requested_start_date`.
 *
 * Example: 2026-10-12 + flexibility_days 2 → 2026-10-10 … 2026-10-14
 */
export function getFlexibilitySearchWindow(
  requestedStartDate: RequestedStartDate,
  flexibilityDays: number,
): FlexibilitySearchWindow | null {
  const start = parseIsoDate(requestedStartDate);
  if (!start || flexibilityDays < 0) return null;

  const earliest = new Date(start);
  earliest.setDate(earliest.getDate() - flexibilityDays);
  const latest = new Date(start);
  latest.setDate(latest.getDate() + flexibilityDays);

  return {
    earliest_departure: toIsoDate(earliest),
    latest_departure: toIsoDate(latest),
  };
}

/**
 * §22 / §40 — persist start date; store `flexibility_days` only when the customer selected it.
 * Search window is derived separately via `getFlexibilitySearchWindow` when flexibility ≠ null.
 */
export function toTravelDateStorageFields(
  travelMonth: string,
  travelDay: number | null,
  flexibilityDays: number | null,
): IndividualUmrahTravelDateFields | null {
  const requested_start_date = buildRequestedStartDate(travelMonth, travelDay);
  if (!requested_start_date) return null;
  return {
    requested_start_date,
    flexibility_days: flexibilityDays,
  };
}
