"use client";

import { createContext, Suspense, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { UmrahTrip } from "@/data/mock";
import { resolveTrip } from "@/lib/trip-availability";
import { resolveTripFlowContext, type TripFlowContext } from "@/lib/trip-flow";

const TripFlowCtx = createContext<TripFlowContext | null>(null);

function TripFlowProviderInner({
  trip,
  children,
}: {
  trip: UmrahTrip;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const [liveTrip, setLiveTrip] = useState(trip);

  useEffect(() => {
    const sync = () => setLiveTrip(resolveTrip(trip));
    sync();
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener("storage", sync);
    };
  }, [trip]);

  const flow = useMemo(
    () => resolveTripFlowContext(liveTrip, searchParams),
    [liveTrip, searchParams],
  );

  return <TripFlowCtx.Provider value={flow}>{children}</TripFlowCtx.Provider>;
}

/** Carries trip_id (+ listing filter) through offer and inquiry pages. */
export function TripFlowProvider({
  trip,
  children,
  fallback = null,
}: {
  trip: UmrahTrip;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      <TripFlowProviderInner trip={trip}>{children}</TripFlowProviderInner>
    </Suspense>
  );
}

export function useTripFlowContext(): TripFlowContext {
  const ctx = useContext(TripFlowCtx);
  if (!ctx) {
    throw new Error("useTripFlowContext must be used within TripFlowProvider");
  }
  return ctx;
}

/** Optional context — falls back when a component is used outside the offer/inquiry shell. */
export function useTripFlowContextOptional(): TripFlowContext | null {
  return useContext(TripFlowCtx);
}
