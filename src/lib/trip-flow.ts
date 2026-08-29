import type { UmrahTrip } from "@/data/mock";
import type { PeriodFilterKey } from "@/lib/listing-period-filters";
import {
  getListingPathWithFilter,
  LISTING_FILTER_QUERY_KEY,
  parseListingPeriodFilter,
} from "@/lib/trip-listing-url";
import { getTripInquiryPath, getTripOfferPath } from "@/lib/trip-inquiry";

/** Query key for the selected departure — e.g. ?trip_id=trip-23-okt-2026 */
export const TRIP_ID_QUERY_KEY = "trip_id";

export type TripFlowSearchParams = Pick<URLSearchParams, "get" | "toString">;

export type TripFlowContext = {
  tripId: string;
  tripSlug: string;
  listingFilter: PeriodFilterKey;
  offerPath: string;
  inquiryPath: string;
  listingPath: string;
};

function buildFlowQuery(tripId: string, listingFilter: PeriodFilterKey): string {
  const params = new URLSearchParams();
  params.set(TRIP_ID_QUERY_KEY, tripId);
  if (listingFilter !== "all") {
    params.set(LISTING_FILTER_QUERY_KEY, listingFilter);
  }
  return params.toString();
}

function appendFlowQuery(
  path: string,
  tripId: string,
  listingFilter: PeriodFilterKey,
): string {
  const query = buildFlowQuery(tripId, listingFilter);
  return `${path}?${query}`;
}

/** Offer page href from the Umrah listing (or homepage carousel). */
export function buildTripOfferFlowHref(
  trip: UmrahTrip,
  listingFilter: PeriodFilterKey = "all",
): string {
  return appendFlowQuery(getTripOfferPath(trip.slug), trip.id, listingFilter);
}

/** Inquiry checkout href — preserves trip_id (+ listing filter when set). */
export function buildTripInquiryFlowHref(
  trip: UmrahTrip,
  listingFilter: PeriodFilterKey = "all",
): string {
  return appendFlowQuery(getTripInquiryPath(trip.slug), trip.id, listingFilter);
}

function resolveListingFilter(
  searchParams: TripFlowSearchParams | null,
  listingFilterFallback: PeriodFilterKey,
): PeriodFilterKey {
  if (!searchParams) return listingFilterFallback;
  return parseListingPeriodFilter(searchParams.get(LISTING_FILTER_QUERY_KEY));
}

function resolveTripId(trip: UmrahTrip, searchParams: TripFlowSearchParams | null): string {
  const fromUrl = searchParams?.get(TRIP_ID_QUERY_KEY);
  if (fromUrl && fromUrl === trip.id) return fromUrl;
  return trip.id;
}

/** Resolve flow context for offer / inquiry pages from the current URL. */
export function resolveTripFlowContext(
  trip: UmrahTrip,
  searchParams: TripFlowSearchParams | null,
  listingFilterFallback: PeriodFilterKey = "all",
): TripFlowContext {
  const listingFilter = resolveListingFilter(searchParams, listingFilterFallback);
  const tripId = resolveTripId(trip, searchParams);

  return {
    tripId,
    tripSlug: trip.slug,
    listingFilter,
    offerPath: appendFlowQuery(getTripOfferPath(trip.slug), tripId, listingFilter),
    inquiryPath: appendFlowQuery(getTripInquiryPath(trip.slug), tripId, listingFilter),
    listingPath: getListingPathWithFilter(listingFilter),
  };
}
