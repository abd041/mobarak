/**
 * Hotel rate catalog + stay calculator for Individual Umrah offers.
 *
 * This module is the **Admin price engine**: seasonal periods, weekday/weekend
 * nightly prices, extra bed €/night, meals, room categories. Outputs stay totals
 * that the customer PDF displays without exposing this calculation.
 */
import type {
  BreakfastMode,
  HotelMealPricing,
  HotelRatePeriod,
  HotelRoomCategory,
  IndividualUmrahHotelRate,
  OfferHotelOption,
} from "@/lib/individual-umrah-offer";
import { newOfferEntityId } from "@/lib/individual-umrah-offer";

const STORAGE_KEY = "mobarak.individualUmrahHotelRates";
const SEED_REVISION_KEY = "mobarak.individualUmrahHotelRates.seedRevision";
/** Bump when seed rates must replace stale localStorage (e.g. example config updates). */
const SEED_REVISION = 37;
export const INDIVIDUAL_UMRAH_HOTEL_RATES_EVENT = "mobarak-individual-umrah-hotel-rates";

export function emptyHotelMealPricing(
  partial?: Partial<HotelMealPricing>,
): HotelMealPricing {
  return {
    breakfastMode: partial?.breakfastMode ?? "included",
    breakfastPerPersonNight: Math.max(0, Number(partial?.breakfastPerPersonNight) || 0),
    lunchPerPersonNight: Math.max(0, Number(partial?.lunchPerPersonNight) || 0),
    dinnerPerPersonNight: Math.max(0, Number(partial?.dinnerPerPersonNight) || 0),
  };
}

export function normalizeHotelMealPricing(value: unknown): HotelMealPricing {
  const v = (value && typeof value === "object" ? value : {}) as Partial<HotelMealPricing> & {
    lunchPerPersonNight?: number;
    dinnerPerPersonNight?: number;
  };
  const mode = v.breakfastMode;
  const breakfastMode: BreakfastMode =
    mode === "optional" || mode === "priced" || mode === "included" ? mode : "included";
  return emptyHotelMealPricing({
    breakfastMode,
    breakfastPerPersonNight: v.breakfastPerPersonNight,
    lunchPerPersonNight: v.lunchPerPersonNight,
    dinnerPerPersonNight: v.dinnerPerPersonNight,
  });
}

function period(
  id: string,
  validFrom: string,
  validUntil: string,
  weekdayPricePerRoomNight: number,
  weekendPricePerRoomNight = weekdayPricePerRoomNight,
  mealOverrides: HotelMealPricing | null = null,
): HotelRatePeriod {
  return {
    id,
    validFrom,
    validUntil,
    weekdayPricePerRoomNight,
    weekendPricePerRoomNight,
    mealOverrides,
  };
}

function category(
  id: string,
  name: string,
  periods: HotelRatePeriod[],
  sortOrder: number,
): HotelRoomCategory {
  return {
    id,
    name,
    active: true,
    sortOrder,
    periods,
  };
}

const SEASONAL_STANDARD = [
  period("rp-std-1", "2026-09-01", "2026-10-20", 100, 120),
  period("rp-std-2", "2026-10-21", "2026-12-20", 150, 175),
  period("rp-std-3", "2026-12-21", "2027-01-10", 250, 290),
  period("rp-std-4", "2027-01-11", "2027-02-28", 130, 150),
];

/** Le Méridien Medina — sample stay 12–14 Oct 2026 (3 weekday nights × €350 = €1,050/room). */
const MADEN_STANDARD = [
  period("rp-maden-std-1", "2026-09-01", "2026-10-20", 350, 380),
  period("rp-maden-std-2", "2026-10-21", "2026-12-20", 150, 175),
  period("rp-maden-std-3", "2026-12-21", "2027-01-10", 250, 290),
  period("rp-maden-std-4", "2027-01-11", "2027-02-28", 130, 150),
];

const MADEN_DELUXE = [
  period("rp-maden-dlx-1", "2026-09-01", "2026-10-20", 350, 380),
  period("rp-maden-dlx-2", "2026-10-21", "2026-12-20", 180, 210),
  period("rp-maden-dlx-3", "2026-12-21", "2027-01-10", 290, 330),
  period("rp-maden-dlx-4", "2027-01-11", "2027-02-28", 160, 185),
];

/** Seed rates — categories with independent seasonal / weekday-weekend rules. */
export const SEED_INDIVIDUAL_UMRAH_HOTEL_RATES: IndividualUmrahHotelRate[] = [
  {
    hotelId: "maden",
    currency: "EUR",
    categories: [
      category("rc-maden-standard", "Standard Room", MADEN_STANDARD, 0),
      category("rc-maden-deluxe", "Deluxe Room", MADEN_DELUXE, 1),
      category(
        "rc-maden-family",
        "Family Room",
        [
          period("rp-maden-fam-1", "2026-09-01", "2026-10-20", 400, 430),
          period("rp-maden-fam-2", "2026-10-21", "2026-12-20", 220, 250),
        ],
        2,
      ),
    ],
    baseRoomStayHint: null,
    extraBedPerNight: 30,
    meals: emptyHotelMealPricing({
      breakfastMode: "included",
      lunchPerPersonNight: 20,
      dinnerPerPersonNight: 20,
    }),
    boardLabel: "Frühstück",
    notes: "Room categories + seasonal periods — editable in Admin",
  },
  {
    // Example rate config (spec 37) — Anwar Al Madinah Mövenpick · Standard Double
    hotelId: "anwar",
    currency: "EUR",
    categories: [
      category(
        "rc-anwar-standard",
        "Standard Double",
        [
          period("rp-anwar-std-1", "2026-09-20", "2026-10-20", 100, 125),
          period("rp-anwar-std-2", "2026-10-21", "2026-12-20", 150, 180),
        ],
        0,
      ),
      category(
        "rc-anwar-triple",
        "Triple Room",
        [
          period("rp-anwar-trp-1", "2026-09-20", "2026-10-20", 120, 145),
          period("rp-anwar-trp-2", "2026-10-21", "2026-12-20", 175, 210),
        ],
        1,
      ),
    ],
    baseRoomStayHint: null,
    extraBedPerNight: 30,
    meals: emptyHotelMealPricing({
      breakfastMode: "included",
      lunchPerPersonNight: 20,
      dinnerPerPersonNight: 20,
    }),
    boardLabel: "Frühstück",
    notes: "Example: Standard Double So–Do/Fr–Sa periods + Extra bed €30 (inkl. Frühstück)",
  },
  {
    hotelId: "season-star",
    currency: "EUR",
    categories: [
      category(
        "rc-season-standard",
        "Standard Room",
        [
          period("rp-season-std-1", "2026-09-01", "2026-10-20", 260, 290),
          period("rp-season-std-2", "2026-10-21", "2027-02-28", 100, 120),
        ],
        0,
      ),
    ],
    baseRoomStayHint: null,
    extraBedPerNight: 20,
    meals: emptyHotelMealPricing({
      breakfastMode: "included",
      lunchPerPersonNight: 15,
      dinnerPerPersonNight: 15,
    }),
    boardLabel: "Frühstück",
    notes: "",
  },
  {
    hotelId: "swissotel",
    currency: "EUR",
    categories: [
      category("rc-swiss-standard", "Standard Room", SEASONAL_STANDARD, 0),
      category(
        "rc-swiss-deluxe",
        "Deluxe Room",
        [
          period("rp-swiss-dlx-1", "2026-09-01", "2026-10-20", 420, 460),
          period("rp-swiss-dlx-2", "2026-10-21", "2026-12-20", 380, 420),
          period("rp-swiss-dlx-3", "2026-12-21", "2027-01-10", 520, 580),
          period("rp-swiss-dlx-4", "2027-01-11", "2027-02-28", 360, 400),
        ],
        1,
      ),
    ],
    baseRoomStayHint: null,
    extraBedPerNight: 40,
    meals: emptyHotelMealPricing({
      breakfastMode: "included",
      lunchPerPersonNight: 0,
      dinnerPerPersonNight: 0,
    }),
    boardLabel: "Halbpension",
    notes: "",
  },
  {
    hotelId: "clock-tower",
    currency: "EUR",
    categories: [
      category(
        "rc-clock-standard",
        "Standard Room",
        [
          period("rp-clock-std-1", "2026-09-01", "2026-10-20", 480, 520),
          period("rp-clock-std-2", "2026-10-21", "2027-02-28", 400, 450),
        ],
        0,
      ),
      category(
        "rc-clock-deluxe",
        "Deluxe Room",
        [
          period("rp-clock-dlx-1", "2026-09-01", "2026-10-20", 540, 580),
          period("rp-clock-dlx-2", "2026-10-21", "2027-02-28", 460, 500),
        ],
        1,
      ),
    ],
    baseRoomStayHint: null,
    extraBedPerNight: 45,
    meals: emptyHotelMealPricing({
      breakfastMode: "included",
      lunchPerPersonNight: 0,
      dinnerPerPersonNight: 0,
    }),
    boardLabel: "Halbpension",
    notes: "",
  },
  {
    hotelId: "elaf-kinda",
    currency: "EUR",
    categories: [
      category(
        "rc-elaf-standard",
        "Standard Room",
        [
          period("rp-elaf-std-1", "2026-09-01", "2026-10-20", 280, 310),
          period("rp-elaf-std-2", "2026-10-21", "2027-02-28", 220, 250),
        ],
        0,
      ),
    ],
    baseRoomStayHint: null,
    extraBedPerNight: 22,
    meals: emptyHotelMealPricing({
      breakfastMode: "included",
      lunchPerPersonNight: 22,
      dinnerPerPersonNight: 22,
    }),
    boardLabel: "Frühstück",
    notes: "",
  },
  {
    hotelId: "anjum",
    currency: "EUR",
    categories: [
      category("rc-anjum-standard", "Standard Room", SEASONAL_STANDARD, 0),
      category(
        "rc-anjum-deluxe",
        "Deluxe Room",
        [
          period("rp-anjum-dlx-1", "2026-09-01", "2026-10-20", 140, 165),
          period("rp-anjum-dlx-2", "2026-10-21", "2026-12-20", 190, 220),
          period("rp-anjum-dlx-3", "2026-12-21", "2027-01-10", 300, 340),
          period("rp-anjum-dlx-4", "2027-01-11", "2027-02-28", 170, 195),
        ],
        1,
      ),
    ],
    baseRoomStayHint: null,
    extraBedPerNight: 35,
    meals: emptyHotelMealPricing({
      breakfastMode: "included",
      lunchPerPersonNight: 0,
      dinnerPerPersonNight: 0,
    }),
    boardLabel: "Halbpension",
    notes: "Room categories + seasonal periods — editable in Admin",
  },
];

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * Inclusive date-range overlap for two rate periods (same room category).
 * Example: 01 Oct–31 Oct overlaps 15 Oct–15 Nov.
 */
export function hotelRatePeriodsOverlap(
  a: Pick<HotelRatePeriod, "validFrom" | "validUntil">,
  b: Pick<HotelRatePeriod, "validFrom" | "validUntil">,
): boolean {
  if (!isIsoDate(a.validFrom) || !isIsoDate(a.validUntil)) return false;
  if (!isIsoDate(b.validFrom) || !isIsoDate(b.validUntil)) return false;
  return a.validFrom <= b.validUntil && b.validFrom <= a.validUntil;
}

/** Period IDs that overlap at least one other period in the list. */
export function getOverlappingHotelRatePeriodIds(
  periods: HotelRatePeriod[],
): Set<string> {
  const overlapping = new Set<string>();
  for (let i = 0; i < periods.length; i++) {
    const left = periods[i]!;
    for (let j = i + 1; j < periods.length; j++) {
      const right = periods[j]!;
      if (hotelRatePeriodsOverlap(left, right)) {
        overlapping.add(left.id);
        overlapping.add(right.id);
      }
    }
  }
  return overlapping;
}

/** True when any room category has overlapping rate periods. */
export function hotelRateHasOverlappingPeriods(
  rate: IndividualUmrahHotelRate,
): boolean {
  return rate.categories.some(
    (c) => getOverlappingHotelRatePeriodIds(c.periods).size > 0,
  );
}

export function addDaysIso(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Saudi / Umrah weekend nights: Friday and Saturday.
 * JS: 0=Sun … 5=Fri, 6=Sat.
 */
export function isWeekendNight(dateIso: string): boolean {
  if (!isIsoDate(dateIso)) return false;
  const day = new Date(`${dateIso}T12:00:00`).getDay();
  return day === 5 || day === 6;
}

export function normalizeHotelRatePeriod(
  value: Partial<HotelRatePeriod> & {
    pricePerRoomNight?: number;
    weekdayPricePerRoomNight?: number;
    weekendPricePerRoomNight?: number;
  },
): HotelRatePeriod {
  const validFrom = isIsoDate(value.validFrom ?? "") ? value.validFrom! : "";
  let validUntil = isIsoDate(value.validUntil ?? "") ? value.validUntil! : "";
  if (validFrom && validUntil && validUntil < validFrom) {
    validUntil = validFrom;
  }

  const legacy =
    value.pricePerRoomNight === undefined || value.pricePerRoomNight === null
      ? null
      : Math.max(0, Number(value.pricePerRoomNight) || 0);

  const weekday =
    value.weekdayPricePerRoomNight !== undefined && value.weekdayPricePerRoomNight !== null
      ? Math.max(0, Number(value.weekdayPricePerRoomNight) || 0)
      : (legacy ?? 0);

  const weekend =
    value.weekendPricePerRoomNight !== undefined && value.weekendPricePerRoomNight !== null
      ? Math.max(0, Number(value.weekendPricePerRoomNight) || 0)
      : (legacy ?? weekday);

  return {
    id: value.id?.trim() || newOfferEntityId("rp"),
    validFrom,
    validUntil,
    weekdayPricePerRoomNight: weekday,
    weekendPricePerRoomNight: weekend,
    mealOverrides:
      value.mealOverrides === null || value.mealOverrides === undefined
        ? null
        : normalizeHotelMealPricing(value.mealOverrides),
  };
}

/** Chronological order for Admin listing and stable lookups. */
export function sortHotelRatePeriods(periods: HotelRatePeriod[]): HotelRatePeriod[] {
  return [...periods].sort((a, b) => {
    const from = (a.validFrom || "9999").localeCompare(b.validFrom || "9999");
    if (from !== 0) return from;
    return (a.validUntil || "").localeCompare(b.validUntil || "");
  });
}

export function normalizeHotelRoomCategory(
  value: Partial<HotelRoomCategory> & { name?: string },
  sortOrderFallback = 0,
): HotelRoomCategory {
  return {
    id: value.id?.trim() || newOfferEntityId("rc"),
    name: (value.name ?? "").trim() || "Standard Room",
    active: value.active ?? true,
    sortOrder: Number.isFinite(value.sortOrder) ? Number(value.sortOrder) : sortOrderFallback,
    periods: sortHotelRatePeriods(
      Array.isArray(value.periods) ? value.periods.map((p) => normalizeHotelRatePeriod(p)) : [],
    ),
  };
}

function migrateLegacyPeriodsToCategories(
  rate: Partial<IndividualUmrahHotelRate>,
): HotelRoomCategory[] {
  if (Array.isArray(rate.categories) && rate.categories.length > 0) {
    return rate.categories.map((c, i) => normalizeHotelRoomCategory(c, i));
  }
  const legacyPeriods = Array.isArray(rate.periods)
    ? rate.periods.map((p) => normalizeHotelRatePeriod(p))
    : [];
  return [
    normalizeHotelRoomCategory(
      {
        name: "Standard Room",
        active: true,
        sortOrder: 0,
        periods: legacyPeriods,
      },
      0,
    ),
  ];
}

export function normalizeIndividualUmrahHotelRate(
  rate: Partial<IndividualUmrahHotelRate> & {
    hotelId: string;
    /** Legacy flat meal fields (pre–meal-pricing object). */
    lunchPerPersonNight?: number;
    dinnerPerPersonNight?: number;
  },
): IndividualUmrahHotelRate {
  const categories = migrateLegacyPeriodsToCategories(rate).sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
  );

  const boardLabel = (rate.boardLabel ?? "").trim();
  const mealsFromRate = rate.meals
    ? normalizeHotelMealPricing(rate.meals)
    : emptyHotelMealPricing({
        breakfastMode: "included",
        lunchPerPersonNight: rate.lunchPerPersonNight,
        dinnerPerPersonNight: rate.dinnerPerPersonNight,
      });

  return {
    hotelId: rate.hotelId,
    currency: "EUR",
    categories,
    meals: mealsFromRate,
    extraBedPerNight: Math.max(0, Number(rate.extraBedPerNight) || 0),
    baseRoomStayHint:
      rate.baseRoomStayHint === null || rate.baseRoomStayHint === undefined
        ? null
        : Math.max(0, Number(rate.baseRoomStayHint) || 0),
    boardLabel: boardLabel || defaultBoardLabelFromMeals(mealsFromRate),
    notes: (rate.notes ?? "").trim(),
  };
}

export function defaultBoardLabelFromMeals(meals: HotelMealPricing): string {
  if (meals.breakfastMode === "optional") return "Frühstück (optional)";
  if (meals.breakfastMode === "priced") return "Frühstück";
  return "Frühstück";
}

/**
 * Resolve meal pricing for a stay: period override (check-in night) wins over hotel defaults.
 */
export function resolveMealPricingForStay(
  rate: IndividualUmrahHotelRate | null | undefined,
  options?: {
    stayStartDate?: string | null;
    categoryId?: string | null;
  },
): HotelMealPricing {
  const hotelMeals = rate?.meals ?? emptyHotelMealPricing();
  if (!rate || !options?.stayStartDate) return hotelMeals;
  const category = getRoomCategory(rate, options.categoryId);
  if (!category) return hotelMeals;
  const covering = findRatePeriodForDate(category.periods, options.stayStartDate);
  return covering?.mealOverrides ?? hotelMeals;
}

/** Suggest a new period starting the day after the latest existing `validUntil`. */
export function suggestNextHotelRatePeriod(periods: HotelRatePeriod[]): HotelRatePeriod {
  const sorted = sortHotelRatePeriods(periods.filter((p) => p.validUntil));
  const last = sorted[sorted.length - 1];
  if (!last?.validUntil) return emptyHotelRatePeriod();
  const nextFrom = addDaysIso(last.validUntil, 1);
  return normalizeHotelRatePeriod({
    id: newOfferEntityId("rp"),
    validFrom: nextFrom,
    validUntil: "",
    weekdayPricePerRoomNight: last.weekdayPricePerRoomNight,
    weekendPricePerRoomNight: last.weekendPricePerRoomNight,
    mealOverrides: last.mealOverrides
      ? normalizeHotelMealPricing(last.mealOverrides)
      : null,
  });
}

export function emptyHotelRatePeriod(): HotelRatePeriod {
  return normalizeHotelRatePeriod({
    id: newOfferEntityId("rp"),
    validFrom: "",
    validUntil: "",
    weekdayPricePerRoomNight: 0,
    weekendPricePerRoomNight: 0,
  });
}

export function emptyHotelRoomCategory(name = "Standard Room", sortOrder = 0): HotelRoomCategory {
  return normalizeHotelRoomCategory(
    {
      id: newOfferEntityId("rc"),
      name,
      active: true,
      sortOrder,
      periods: [],
    },
    sortOrder,
  );
}

export function listActiveRoomCategories(rate: IndividualUmrahHotelRate | null | undefined): HotelRoomCategory[] {
  if (!rate) return [];
  return rate.categories.filter((c) => c.active);
}

export function getRoomCategory(
  rate: IndividualUmrahHotelRate | null | undefined,
  categoryId?: string | null,
): HotelRoomCategory | null {
  if (!rate?.categories.length) return null;
  if (categoryId) {
    const found = rate.categories.find((c) => c.id === categoryId);
    if (found) return found;
  }
  return listActiveRoomCategories(rate)[0] ?? rate.categories[0] ?? null;
}

/**
 * Find the rate period covering `dateIso` (YYYY-MM-DD).
 * If several periods overlap, prefer the one with the latest `validFrom`.
 */
export function findRatePeriodForDate(
  periods: HotelRatePeriod[],
  dateIso: string,
): HotelRatePeriod | null {
  if (!isIsoDate(dateIso)) return null;
  const matches = periods.filter(
    (p) =>
      isIsoDate(p.validFrom) &&
      isIsoDate(p.validUntil) &&
      p.validFrom <= dateIso &&
      dateIso <= p.validUntil,
  );
  if (!matches.length) return null;
  return [...matches].sort((a, b) => b.validFrom.localeCompare(a.validFrom))[0] ?? null;
}

export function nightlyPriceFromPeriod(period: HotelRatePeriod, dateIso: string): number {
  return isWeekendNight(dateIso)
    ? period.weekendPricePerRoomNight
    : period.weekdayPricePerRoomNight;
}

export type RoomStayNightBreakdown = {
  date: string;
  kind: "weekday" | "weekend";
  price: number;
  periodId: string | null;
  /** True when no rate period covers this night. */
  missingRate: boolean;
};

export type RoomStayCalculation = {
  total: number;
  nights: RoomStayNightBreakdown[];
  weekdayNights: number;
  weekendNights: number;
  weekdaySubtotal: number;
  weekendSubtotal: number;
  /** ISO night dates with no covering rate period. */
  missingDates: string[];
  /** False when any night lacks a rate — do not treat `total` as a complete price. */
  complete: boolean;
};

/**
 * Calculate one-room stay total night-by-night for a category’s periods.
 * Does NOT multiply all nights by a single average price.
 * Nights without a period are flagged (`missingRate`) and priced as 0 in the
 * breakdown only — callers must check `complete` and must not silently sell €0.
 */
export function calculateRoomStayByNights(
  periods: HotelRatePeriod[],
  stayStartDate: string,
  nights: number,
): RoomStayCalculation {
  const count = Math.max(0, Math.round(nights) || 0);
  const breakdown: RoomStayNightBreakdown[] = [];
  let weekdayNights = 0;
  let weekendNights = 0;
  let weekdaySubtotal = 0;
  let weekendSubtotal = 0;

  if (!isIsoDate(stayStartDate) || count === 0) {
    return {
      total: 0,
      nights: [],
      weekdayNights: 0,
      weekendNights: 0,
      weekdaySubtotal: 0,
      weekendSubtotal: 0,
      missingDates: [],
      complete: count === 0,
    };
  }

  for (let i = 0; i < count; i++) {
    const date = addDaysIso(stayStartDate, i);
    const periodMatch = findRatePeriodForDate(periods, date);
    const weekend = isWeekendNight(date);
    const missingRate = !periodMatch;
    const price = periodMatch ? nightlyPriceFromPeriod(periodMatch, date) : 0;
    breakdown.push({
      date,
      kind: weekend ? "weekend" : "weekday",
      price,
      periodId: periodMatch?.id ?? null,
      missingRate,
    });
    if (weekend) {
      weekendNights += 1;
      weekendSubtotal += price;
    } else {
      weekdayNights += 1;
      weekdaySubtotal += price;
    }
  }

  const missingDates = breakdown.filter((n) => n.missingRate).map((n) => n.date);

  return {
    total: weekdaySubtotal + weekendSubtotal,
    nights: breakdown,
    weekdayNights,
    weekendNights,
    weekdaySubtotal,
    weekendSubtotal,
    missingDates,
    complete: missingDates.length === 0,
  };
}

export type ResolveRoomStayResult = {
  /** Stay total when `complete`; otherwise `null` (never invent a silent €0 total). */
  total: number | null;
  missingDates: string[];
  complete: boolean;
  usedLegacyHint: boolean;
};

/**
 * Resolve stay for a hotel category on a given start date.
 * Incomplete period coverage → `complete: false` and `total: null`.
 */
export function resolveRoomStayResult(
  rate: IndividualUmrahHotelRate | null | undefined,
  options: {
    stayStartDate?: string | null;
    nights: number;
    categoryId?: string | null;
  },
): ResolveRoomStayResult {
  const nights = Math.max(0, Math.round(options.nights) || 0);
  if (nights === 0) {
    return { total: null, missingDates: [], complete: false, usedLegacyHint: false };
  }

  if (!rate) {
    const missingDates =
      options.stayStartDate && isIsoDate(options.stayStartDate)
        ? Array.from({ length: nights }, (_, i) => addDaysIso(options.stayStartDate!, i))
        : [];
    return {
      total: null,
      missingDates,
      complete: false,
      usedLegacyHint: false,
    };
  }

  const category = getRoomCategory(rate, options.categoryId);
  if (options.stayStartDate && category && category.periods.length > 0) {
    const calc = calculateRoomStayByNights(
      category.periods,
      options.stayStartDate,
      nights,
    );
    if (calc.complete) {
      return {
        total: calc.total,
        missingDates: [],
        complete: true,
        usedLegacyHint: false,
      };
    }
    // Partial or full gap — never return a total that silently zeros missing nights.
    return {
      total: null,
      missingDates: calc.missingDates,
      complete: false,
      usedLegacyHint: false,
    };
  }

  if (rate.baseRoomStayHint != null) {
    return {
      total: Math.max(0, rate.baseRoomStayHint),
      missingDates: [],
      complete: true,
      usedLegacyHint: true,
    };
  }

  // No periods and no hint — every night of the stay is missing.
  const missingDates =
    options.stayStartDate && isIsoDate(options.stayStartDate)
      ? Array.from({ length: nights }, (_, i) => addDaysIso(options.stayStartDate!, i))
      : [];

  return {
    total: null,
    missingDates,
    complete: false,
    usedLegacyHint: false,
  };
}

/**
 * Resolve stay total for a hotel category on a given start date.
 * Returns `0` only when complete (or legacy hint). Incomplete stays return `0`
 * but prefer `resolveRoomStayResult` so callers can detect gaps.
 * @deprecated Prefer `resolveRoomStayResult` for offer pricing.
 */
export function resolveRoomStayTotal(
  rate: IndividualUmrahHotelRate | null | undefined,
  options: {
    stayStartDate?: string | null;
    nights: number;
    categoryId?: string | null;
  },
): number {
  const result = resolveRoomStayResult(rate, options);
  return result.complete && result.total != null ? result.total : 0;
}

/** Format ISO date as DD.MM.YYYY for Admin / PDF messages. */
export function formatHotelRateDateDe(iso: string): string {
  if (!isIsoDate(iso)) return iso || "—";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

/**
 * Spec 39 message (Admin + PDF preview, always German), e.g.
 * "Keine Rate verfügbar für Anwar Al Madinah Mövenpick am 21.12.2026."
 */
export function formatMissingHotelRateMessage(
  hotelName: string,
  dateIso: string,
): string {
  return `Keine Rate verfügbar für ${hotelName} am ${formatHotelRateDateDe(dateIso)}.`;
}

/**
 * Missing night dates for an offer hotel option (empty when Admin overrode prices).
 */
export function getOfferHotelMissingRateDates(
  option: Pick<OfferHotelOption, "hotelId" | "roomCategoryId" | "manualPriceOverride">,
  stayStartDate: string | null | undefined,
  nights: number,
): string[] {
  if (option.manualPriceOverride) return [];
  const result = resolveRoomStayResult(getIndividualUmrahHotelRate(option.hotelId), {
    stayStartDate,
    nights,
    categoryId: option.roomCategoryId,
  });
  return result.complete ? [] : result.missingDates;
}

function readAll(): Record<string, IndividualUmrahHotelRate> {
  const map: Record<string, IndividualUmrahHotelRate> = {};
  for (const rate of SEED_INDIVIDUAL_UMRAH_HOTEL_RATES) {
    map[rate.hotelId] = normalizeIndividualUmrahHotelRate(rate);
  }
  if (typeof window === "undefined") return map;
  try {
    const storedRevision = window.localStorage.getItem(SEED_REVISION_KEY);
    const needsSeedRefresh = storedRevision !== String(SEED_REVISION);

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const overrides = JSON.parse(raw) as Record<string, Partial<IndividualUmrahHotelRate>>;
      for (const [hotelId, value] of Object.entries(overrides)) {
        // Spec 37: force Anwar example rates from seed when revision bumps.
        if (needsSeedRefresh && hotelId === "anwar") continue;
        map[hotelId] = normalizeIndividualUmrahHotelRate({ ...value, hotelId });
      }
    }

    if (needsSeedRefresh) {
      window.localStorage.setItem(SEED_REVISION_KEY, String(SEED_REVISION));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    }

    return map;
  } catch {
    return map;
  }
}

function writeAll(rates: Record<string, IndividualUmrahHotelRate>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rates));
  window.dispatchEvent(new Event(INDIVIDUAL_UMRAH_HOTEL_RATES_EVENT));
}

export function getIndividualUmrahHotelRates(): IndividualUmrahHotelRate[] {
  return Object.values(readAll());
}

export function getIndividualUmrahHotelRate(hotelId: string): IndividualUmrahHotelRate | null {
  return readAll()[hotelId] ?? null;
}

export function upsertIndividualUmrahHotelRate(rate: IndividualUmrahHotelRate) {
  const all = readAll();
  all[rate.hotelId] = normalizeIndividualUmrahHotelRate(rate);
  writeAll(all);
}

export function emptyIndividualUmrahHotelRate(hotelId: string): IndividualUmrahHotelRate {
  return normalizeIndividualUmrahHotelRate({
    hotelId,
    categories: [emptyHotelRoomCategory("Standard Room", 0)],
    baseRoomStayHint: null,
    extraBedPerNight: 30,
    meals: emptyHotelMealPricing({
      breakfastMode: "included",
      lunchPerPersonNight: 20,
      dinnerPerPersonNight: 20,
    }),
    boardLabel: "Frühstück",
    notes: "",
  });
}

/** True when any category has a complete date-based period (or legacy hint). */
export function hasIndividualUmrahHotelRate(hotelId: string): boolean {
  const rate = readAll()[hotelId];
  if (!rate) return false;
  if (
    rate.categories.some((c) =>
      c.periods.some(
        (p) =>
          p.validFrom &&
          p.validUntil &&
          (p.weekdayPricePerRoomNight > 0 || p.weekendPricePerRoomNight > 0),
      ),
    )
  ) {
    return true;
  }
  return rate.baseRoomStayHint != null && rate.baseRoomStayHint > 0;
}
