/** Travel-period filters for the Umrah group trips listing page. */
export const PERIOD_FILTER_KEYS = [
  "all",
  "oktober",
  "herbstferien",
  "november",
  "dezember",
  "weihnachtsferien",
  "jaenner",
  "februar",
  "semesterferien",
  "ramadan",
  "maerz",
  "osterferien",
] as const;

export type PeriodFilterKey = (typeof PERIOD_FILTER_KEYS)[number];

/** Assignable backend tags — never inferred from travel dates on the frontend. */
export type TripPeriodFilterTag = Exclude<PeriodFilterKey, "all">;

/** Calendar month filters — assigned per departure in admin/backend. */
export const MONTH_PERIOD_FILTER_TAGS = [
  "oktober",
  "november",
  "dezember",
  "jaenner",
  "februar",
  "maerz",
] as const satisfies readonly TripPeriodFilterTag[];

/** School-holiday and special-period filters — separate backend tags. */
export const HOLIDAY_PERIOD_FILTER_TAGS = [
  "herbstferien",
  "weihnachtsferien",
  "semesterferien",
  "ramadan",
  "osterferien",
] as const satisfies readonly TripPeriodFilterTag[];

export type MonthPeriodFilterTag = (typeof MONTH_PERIOD_FILTER_TAGS)[number];
export type HolidayPeriodFilterTag = (typeof HOLIDAY_PERIOD_FILTER_TAGS)[number];

export const PERIOD_FILTER_LABEL_KEYS: Record<PeriodFilterKey, string> = {
  all: "filterAll",
  oktober: "filterOktober",
  herbstferien: "filterHerbstferien",
  november: "filterNovember",
  dezember: "filterDezember",
  weihnachtsferien: "filterWeihnachtsferien",
  jaenner: "filterJaenner",
  februar: "filterFebruar",
  semesterferien: "filterSemesterferien",
  ramadan: "filterRamadan",
  maerz: "filterMaerz",
  osterferien: "filterOsterferien",
};

export const PERIOD_FILTER_TAG_META: Record<
  TripPeriodFilterTag,
  { category: "month" | "holiday"; adminLabel: string }
> = {
  oktober: { category: "month", adminLabel: "Oktober" },
  november: { category: "month", adminLabel: "November" },
  dezember: { category: "month", adminLabel: "Dezember" },
  jaenner: { category: "month", adminLabel: "Jänner" },
  februar: { category: "month", adminLabel: "Februar" },
  maerz: { category: "month", adminLabel: "März" },
  herbstferien: { category: "holiday", adminLabel: "Herbstferien" },
  weihnachtsferien: { category: "holiday", adminLabel: "Weihnachtsferien" },
  semesterferien: { category: "holiday", adminLabel: "Semesterferien" },
  ramadan: { category: "holiday", adminLabel: "Ramadan" },
  osterferien: { category: "holiday", adminLabel: "Osterferien" },
};

export function isTripPeriodFilterTag(value: string): value is TripPeriodFilterTag {
  return value in PERIOD_FILTER_TAG_META;
}

/** Tag-based match only — does not derive months or holidays from start/end dates. */
export function tripMatchesPeriodFilter(
  tags: readonly TripPeriodFilterTag[],
  filter: PeriodFilterKey,
): boolean {
  if (filter === "all") return true;
  return tags.includes(filter);
}
