"use client";

import { useCallback, useEffect, useState } from "react";
import type { UmrahTrip } from "@/data/mock";
import { trips as seedTrips } from "@/data/mock";
import { TRIPS_DATA_EVENT } from "@/lib/trips-events";

type TripsState = {
  trips: UmrahTrip[];
  loading: boolean;
  error: string | null;
};

export function useTrips(initialTrips?: UmrahTrip[]) {
  const [state, setState] = useState<TripsState>({
    trips: initialTrips ?? seedTrips,
    loading: !initialTrips,
    error: null,
  });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/trips", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch_failed");
      const data = (await res.json()) as { trips: UmrahTrip[] };
      setState({ trips: data.trips, loading: false, error: null });
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "trips_unavailable",
      }));
    }
  }, []);

  useEffect(() => {
    if (!initialTrips) void refresh();
  }, [initialTrips, refresh]);

  useEffect(() => {
    const onUpdate = () => void refresh();
    window.addEventListener(TRIPS_DATA_EVENT, onUpdate);
    return () => window.removeEventListener(TRIPS_DATA_EVENT, onUpdate);
  }, [refresh]);

  return { ...state, refresh };
}

export function notifyTripsUpdated() {
  window.dispatchEvent(new Event(TRIPS_DATA_EVENT));
}
