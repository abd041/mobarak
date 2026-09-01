import { MAX_NIGHTS_PER_CITY, MIN_NIGHTS_PER_CITY } from "@/data/individual-umrah";
import type { IndividualUmrahTraveller, IndividualUmrahTravellerCounts } from "@/lib/individual-umrah-age";
import {
  buildRequestedStartDate,
  type IndividualUmrahTravelDateFields,
} from "@/lib/individual-umrah-date";
import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";

export type IndividualUmrahFormData = IndividualUmrahTravellerCounts & {
  airports: string[];
  /**
   * Counts only for now. Categories must reflect age on the **return date** (§9),
   * not the inquiry date — see `individual-umrah-age.ts`.
   */
  /**
   * §10 / §11 — one answer per child (index 0 = Kind 1). `null` = unanswered.
   * Empty when `children === 0`.
   */
  childNeedsBed: (boolean | null)[];
  /** §13 — independent of traveller counts; customer chooses freely. */
  rooms: number;
  itinerary: "makkah_only" | "makkah_medina" | "";
  cityOrder: "makkah_first" | "medina_first" | "";
  nightsMedina: number;
  nightsMakkah: number;
  travelMonth: string;
  travelDay: number | null;
  /**
   * §21 / §22 / §39 — optional. `null` unanswered; `0` = exact date; `1`–`4` = ± days.
   * Original `requested_start_date` is never modified.
   */
  flexibilityDays: number | null;
  /**
   * §35 — contact details required to respond to the inquiry.
   * Email is optional; phone is mandatory.
   */
  firstName: string;
  lastName: string;
  /** National number without dial prefix (§37). */
  phone: string;
  /** ISO country code for flag + prefix (§37). */
  phoneCountry: string;
  email: string;
  /** Defaults to website locale; remains editable. */
  preferredLanguage: Locale | "";
  /** §38 / §39 — optional marketing source; empty = unanswered. */
  source: string;
  /**
   * Optional future field once DOBs are collected; classify with
   * `classifyTravellerAgeOnReturn` / `countTravellersByAgeOnReturn`.
   */
  travellers?: IndividualUmrahTraveller[];
};

/** Persisted inquiry shape for travel start (§22 storage keys). */
export type IndividualUmrahInquiryTravelDates = IndividualUmrahTravelDateFields;

/**
 * §39 — field-level errors only (shown under each field; no single top banner).
 */
export type IndividualUmrahFormErrors = Partial<
  Record<
    | "airports"
    | "travellers"
    | "rooms"
    | "itinerary"
    | "cityOrder"
    | "nights"
    | "travelMonth"
    | "travelDay"
    | "childBed"
    | "firstName"
    | "lastName"
    | "phone"
    | "email"
    | "preferredLanguage",
    string
  >
>;

export type IndividualUmrahValidationMessages = {
  airports: string;
  travellers: string;
  rooms: string;
  itinerary: string;
  cityOrder: string;
  nights: string;
  travelMonth: string;
  travelDay: string;
  childBed: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  preferredLanguage: string;
};

/** Keep existing per-child answers when the children counter changes (§11). */
export function resizeChildNeedsBed(
  prev: (boolean | null)[],
  nextCount: number,
): (boolean | null)[] {
  if (nextCount <= 0) return [];
  return Array.from({ length: nextCount }, (_, i) => prev[i] ?? null);
}

function isValidNightsForCity(nights: number): boolean {
  return (
    Number.isInteger(nights) &&
    nights >= MIN_NIGHTS_PER_CITY &&
    nights <= MAX_NIGHTS_PER_CITY
  );
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 6;
}

/**
 * §39 — preference fields only (Step 1 → final inquiry page).
 * Contact / marketing are collected on the final submit page.
 */
export function validateIndividualUmrahPreferences(
  data: IndividualUmrahFormData,
  messages: Pick<
    IndividualUmrahValidationMessages,
    | "airports"
    | "travellers"
    | "rooms"
    | "itinerary"
    | "cityOrder"
    | "nights"
    | "travelMonth"
    | "travelDay"
    | "childBed"
  >,
): IndividualUmrahFormErrors {
  const errors: IndividualUmrahFormErrors = {};

  if (!data.airports.length) errors.airports = messages.airports;
  if (data.adults < 1) errors.travellers = messages.travellers;

  if (data.children > 0) {
    const answers = data.childNeedsBed;
    const incomplete =
      answers.length !== data.children || answers.some((answer) => answer === null);
    if (incomplete) errors.childBed = messages.childBed;
  }

  if (data.rooms < 1) errors.rooms = messages.rooms;
  if (!data.itinerary) errors.itinerary = messages.itinerary;

  if (data.itinerary === "makkah_medina" && !data.cityOrder) {
    errors.cityOrder = messages.cityOrder;
  }

  // Step 5 always collects Makkah nights; Medina nights when both cities are selected
  if (!isValidNightsForCity(data.nightsMakkah)) errors.nights = messages.nights;
  if (data.itinerary === "makkah_medina" && !isValidNightsForCity(data.nightsMedina)) {
    errors.nights = messages.nights;
  }

  if (!data.travelMonth) {
    errors.travelMonth = messages.travelMonth;
  } else if (data.travelDay === null || !buildRequestedStartDate(data.travelMonth, data.travelDay)) {
    errors.travelDay = messages.travelDay;
  }

  return errors;
}

/**
 * Full form validation (preferences + contact) — used when everything is on one page.
 */
export function validateIndividualUmrahForm(
  data: IndividualUmrahFormData,
  messages: IndividualUmrahValidationMessages,
): IndividualUmrahFormErrors {
  const errors = validateIndividualUmrahPreferences(data, messages);

  if (!data.firstName.trim()) errors.firstName = messages.firstName;
  if (!data.lastName.trim()) errors.lastName = messages.lastName;
  if (!data.phone.trim() || !isValidPhone(data.phone)) errors.phone = messages.phone;
  if (data.email.trim() && !isValidEmail(data.email.trim())) errors.email = messages.email;
  if (!data.preferredLanguage || !(locales as readonly string[]).includes(data.preferredLanguage)) {
    errors.preferredLanguage = messages.preferredLanguage;
  }

  return errors;
}

export function hasIndividualUmrahFormErrors(errors: IndividualUmrahFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * §22 / §40 — map UI fields to stored `requested_start_date` + optional `flexibility_days`.
 * When flexibility is selected (`0`–`4`), callers derive the allowed ± search window.
 * When unanswered (`null`), do not invent a range.
 */
export function toInquiryTravelDateFields(
  data: Pick<IndividualUmrahFormData, "travelMonth" | "travelDay" | "flexibilityDays">,
): IndividualUmrahInquiryTravelDates | null {
  const requested_start_date = buildRequestedStartDate(data.travelMonth, data.travelDay);
  if (!requested_start_date) return null;
  return {
    requested_start_date,
    flexibility_days: data.flexibilityDays,
  };
}
