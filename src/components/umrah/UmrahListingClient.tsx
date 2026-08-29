"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { UmrahListingEmptyState } from "@/components/umrah/UmrahListingEmptyState";
import { UmrahListingFilters } from "@/components/umrah/UmrahListingFilters";
import { UmrahListingMetaBar } from "@/components/umrah/UmrahListingMetaBar";
import { UmrahListingGrid } from "@/components/umrah/UmrahListingGrid";
import { Container } from "@/components/ui/Container";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { getHotel } from "@/data/mock";
import { useHotels } from "@/hooks/useHotels";
import { useTrips } from "@/hooks/useTrips";
import { resolveHotel } from "@/lib/hotel-catalog";
import type { PeriodFilterKey } from "@/lib/listing-period-filters";
import { filterTripsByPeriod } from "@/lib/trip-period-filters";
import {
  DEFAULT_TRIP_LISTING_SORT,
  getResolvedTripsForListing,
  sortTripsForListing,
  type TripListingSortKey,
} from "@/lib/trip-listing-sort";
import {
  LISTING_FILTER_QUERY_KEY,
  parseListingPeriodFilter,
} from "@/lib/trip-listing-url";
import { TRIPS_DATA_EVENT } from "@/lib/trips-events";

function UmrahListingClientInner({
  initialTrips,
  initialHotels,
}: {
  initialTrips?: UmrahTrip[];
  initialHotels?: Hotel[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trips: allTrips } = useTrips(initialTrips);
  const { hotels, getHotelById } = useHotels(initialHotels);

  const filterFromUrl = useMemo(
    () => parseListingPeriodFilter(searchParams.get(LISTING_FILTER_QUERY_KEY)),
    [searchParams],
  );

  const [filter, setFilter] = useState<PeriodFilterKey>(filterFromUrl);
  const [sort, setSort] = useState<TripListingSortKey>(DEFAULT_TRIP_LISTING_SORT);
  const [dataRevision, setDataRevision] = useState(0);

  useEffect(() => {
    setFilter(filterFromUrl);
  }, [filterFromUrl]);

  useEffect(() => {
    const sync = () => setDataRevision((value) => value + 1);
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener(TRIPS_DATA_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener(TRIPS_DATA_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const onFilterChange = useCallback(
    (next: PeriodFilterKey) => {
      setFilter(next);

      const params = new URLSearchParams(searchParams.toString());
      if (next === "all") {
        params.delete(LISTING_FILTER_QUERY_KEY);
      } else {
        params.set(LISTING_FILTER_QUERY_KEY, next);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const resolveTripHotel = useCallback(
    (trip: UmrahTrip, city: "medina" | "makkah") => {
      const id = city === "medina" ? trip.medinaHotelId : trip.makkahHotelId;
      const fromApi = getHotelById(id);
      if (fromApi) return fromApi;
      return resolveHotel(getHotel(id));
    },
    [getHotelById, hotels],
  );

  const filtered = useMemo(() => {
    const resolved = getResolvedTripsForListing(allTrips);
    const list = filterTripsByPeriod(resolved, filter);
    return sortTripsForListing(list, sort);
  }, [allTrips, filter, sort, dataRevision]);

  return (
    <>
      <UmrahListingFilters filter={filter} onFilterChange={onFilterChange} />
      <UmrahListingMetaBar
        resultCount={filtered.length}
        sort={sort}
        onSortChange={setSort}
        showSort={filtered.length > 0}
      />

      <Container className="min-w-0 pb-12 pt-4 sm:pb-12 sm:pt-5">
        {filtered.length === 0 ? (
          <UmrahListingEmptyState filter={filter} onShowAllDates={() => onFilterChange("all")} />
        ) : (
          <UmrahListingGrid
            trips={filtered}
            listingFilter={filter}
            getMedinaHotel={(trip) => resolveTripHotel(trip, "medina")}
            getMakkahHotel={(trip) => resolveTripHotel(trip, "makkah")}
          />
        )}
      </Container>
    </>
  );
}

export function UmrahListingClient({
  initialTrips,
  initialHotels,
}: {
  initialTrips?: UmrahTrip[];
  initialHotels?: Hotel[];
} = {}) {
  return (
    <Suspense fallback={<UmrahListingClientFallback />}>
      <UmrahListingClientInner initialTrips={initialTrips} initialHotels={initialHotels} />
    </Suspense>
  );
}

function UmrahListingClientFallback() {
  return (
    <>
      <div className="border-b border-line bg-white py-8" aria-hidden />
      <Container className="pb-12 pt-3 sm:pb-12 sm:pt-5">
        <div className="mb-5 h-10 animate-pulse rounded-lg bg-surface md:mb-6" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[32rem] animate-pulse rounded-[16px] bg-surface md:h-[28rem]" />
          ))}
        </div>
      </Container>
    </>
  );
}
