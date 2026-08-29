"use client";

import { useCallback, useEffect, useState } from "react";
import type { Hotel } from "@/data/mock";
import { hotels as seedHotels } from "@/data/mock";
import { resolveHotel } from "@/lib/hotel-catalog";
import { HOTELS_DATA_EVENT } from "@/lib/trips-events";

type HotelsState = {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
};

export function useHotels(initialHotels?: Hotel[]) {
  const [state, setState] = useState<HotelsState>({
    hotels: initialHotels ?? seedHotels.map(resolveHotel),
    loading: !initialHotels,
    error: null,
  });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/hotels", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch_failed");
      const data = (await res.json()) as { hotels: Hotel[] };
      setState({ hotels: data.hotels, loading: false, error: null });
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "hotels_unavailable",
      }));
    }
  }, []);

  useEffect(() => {
    if (!initialHotels) void refresh();
  }, [initialHotels, refresh]);

  useEffect(() => {
    const onUpdate = () => void refresh();
    window.addEventListener(HOTELS_DATA_EVENT, onUpdate);
    return () => window.removeEventListener(HOTELS_DATA_EVENT, onUpdate);
  }, [refresh]);

  const getHotelById = useCallback(
    (id: string) => state.hotels.find((hotel) => hotel.id === id),
    [state.hotels],
  );

  return { ...state, refresh, getHotelById };
}

export function notifyHotelsUpdated() {
  window.dispatchEvent(new Event(HOTELS_DATA_EVENT));
}
