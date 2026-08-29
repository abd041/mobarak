import {
  PERIOD_FILTER_KEYS,
  type PeriodFilterKey,
} from "@/lib/listing-period-filters";

/** Query key for the Umrah listing period filter — e.g. ?filter=weihnachtsferien */
export const LISTING_FILTER_QUERY_KEY = "filter";

const VALID_FILTERS = new Set<string>(PERIOD_FILTER_KEYS);

/** Parse `?filter=` from the URL — unknown or empty values map to "all". */
export function parseListingPeriodFilter(value: string | null | undefined): PeriodFilterKey {
  if (!value || !VALID_FILTERS.has(value)) return "all";
  return value as PeriodFilterKey;
}

/** Build search params for a listing filter (omits param when "all"). */
export function buildListingFilterQuery(filter: PeriodFilterKey): string {
  if (filter === "all") return "";
  const params = new URLSearchParams();
  params.set(LISTING_FILTER_QUERY_KEY, filter);
  return params.toString();
}

/** Full path + optional filter query for sharing / canonical URLs. */
export function getListingPathWithFilter(
  filter: PeriodFilterKey,
  basePath = "/umrah-gruppenreisen",
): string {
  const query = buildListingFilterQuery(filter);
  return query ? `${basePath}?${query}` : basePath;
}
