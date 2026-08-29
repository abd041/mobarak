"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { UmrahTrip } from "@/data/mock";
import type { PeriodFilterKey } from "@/lib/listing-period-filters";
import { resolveTripFlowContext, type TripFlowContext } from "@/lib/trip-flow";

/** Read trip flow context from the current URL (offer / inquiry pages). */
export function useTripFlow(trip: UmrahTrip): TripFlowContext {
  const searchParams = useSearchParams();
  return useMemo(
    () => resolveTripFlowContext(trip, searchParams),
    [trip, searchParams],
  );
}

/** Build flow context when leaving the Umrah listing for a departure offer. */
export function useListingTripFlow(
  trip: UmrahTrip,
  listingFilter: PeriodFilterKey,
): TripFlowContext {
  return useMemo(
    () => resolveTripFlowContext(trip, null, listingFilter),
    [trip, listingFilter],
  );
}
