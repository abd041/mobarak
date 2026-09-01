/**
 * §9 — Age categories are determined by the traveller's age on the **return date**,
 * not on the inquiry / booking submission date.
 *
 * - Adult:  12+ years on return date
 * - Child:  2 – 11.99 years on return date  (from 2nd birthday, before 12th)
 * - Infant: under 2 years on return date
 *
 * The inquiry form currently collects counts only. Use these helpers when DOBs
 * (or exact return dates) are available.
 */

export type IndividualUmrahAgeCategory = "adult" | "child" | "infant";

/** Canonical thresholds — age evaluated on return date only. */
export const INDIVIDUAL_UMRAH_AGE_RULE = {
  /** Age must be measured against the trip return date. */
  reference: "return_date" as const,
  /** Inclusive lower bound for adults (years completed on return). */
  adultMinYears: 12,
  /** Inclusive lower bound for children (years completed on return). */
  childMinYears: 2,
} as const;

/** Future per-traveller record once DOBs are collected. */
export type IndividualUmrahTraveller = {
  /** ISO date `YYYY-MM-DD`. */
  dateOfBirth: string;
  /**
   * Derived category for the planned return date.
   * Prefer computing via {@link classifyTravellerAgeOnReturn} rather than trusting client input.
   */
  categoryOnReturn?: IndividualUmrahAgeCategory;
};

/** Count snapshot used by the inquiry form today. */
export type IndividualUmrahTravellerCounts = {
  adults: number;
  children: number;
  infants: number;
};

/** Calendar years completed on `onDate` (airline-style whole years). */
export function completedYearsOnDate(dateOfBirth: Date, onDate: Date): number {
  let years = onDate.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = onDate.getMonth() - dateOfBirth.getMonth();
  const dayDiff = onDate.getDate() - dateOfBirth.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years -= 1;
  }
  return Math.max(0, years);
}

/**
 * Classify a traveller by age on the return date (§9).
 * Child covers ages from the 2nd birthday up to (but not including) the 12th.
 */
export function classifyTravellerAgeOnReturn(
  dateOfBirth: Date,
  returnDate: Date,
): IndividualUmrahAgeCategory {
  const years = completedYearsOnDate(dateOfBirth, returnDate);
  if (years < INDIVIDUAL_UMRAH_AGE_RULE.childMinYears) return "infant";
  if (years < INDIVIDUAL_UMRAH_AGE_RULE.adultMinYears) return "child";
  return "adult";
}

/**
 * Rough return-date estimate from current form fields (outbound day + total nights).
 * Refine once real flight schedules exist; kept here so count → DOB migration has a hook.
 */
export function estimateReturnDateFromInquiry(params: {
  travelMonth: string;
  travelDay: number;
  nightsMakkah: number;
  nightsMedina: number;
}): Date | null {
  const [yearStr, monthStr] = params.travelMonth.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!year || !month || !params.travelDay) return null;

  const departure = new Date(year, month - 1, params.travelDay);
  if (Number.isNaN(departure.getTime())) return null;

  const totalNights = Math.max(0, params.nightsMakkah) + Math.max(0, params.nightsMedina);
  const returnDate = new Date(departure);
  returnDate.setDate(returnDate.getDate() + totalNights);
  return returnDate;
}

/** Aggregate DOB list into the same count shape the form uses today. */
export function countTravellersByAgeOnReturn(
  travellers: Pick<IndividualUmrahTraveller, "dateOfBirth">[],
  returnDate: Date,
): IndividualUmrahTravellerCounts {
  const counts: IndividualUmrahTravellerCounts = { adults: 0, children: 0, infants: 0 };
  for (const traveller of travellers) {
    const dob = new Date(`${traveller.dateOfBirth}T12:00:00`);
    if (Number.isNaN(dob.getTime())) continue;
    const category = classifyTravellerAgeOnReturn(dob, returnDate);
    if (category === "adult") counts.adults += 1;
    else if (category === "child") counts.children += 1;
    else counts.infants += 1;
  }
  return counts;
}
