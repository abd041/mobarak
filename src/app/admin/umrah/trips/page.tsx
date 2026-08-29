"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { UmrahTrip } from "@/data/mock";
import { notifyTripsUpdated } from "@/hooks/useTrips";

function statusLabel(trip: UmrahTrip) {
  if (trip.availableSeats > 0) {
    return { text: `${trip.availableSeats} Plätze`, tone: "green" as const };
  }
  if (trip.waitlistEnabled && !trip.waitlistFull) {
    return { text: "Warteliste möglich", tone: "orange" as const };
  }
  return { text: "Warteliste voll", tone: "red" as const };
}

export default function AdminTripsPage() {
  const [rows, setRows] = useState<UmrahTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  const loadTrips = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/trips", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch_failed");
      const data = (await res.json()) as { trips: UmrahTrip[] };
      setRows(data.trips);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  const persistOrder = async (nextRows: UmrahTrip[]) => {
    setSavingOrder(true);
    try {
      const res = await fetch("/api/admin/trips", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: nextRows.map((trip) => trip.id) }),
      });
      if (!res.ok) throw new Error("order_failed");
      const data = (await res.json()) as { trips: UmrahTrip[] };
      setRows(data.trips);
      notifyTripsUpdated();
    } finally {
      setSavingOrder(false);
    }
  };

  const moveTrip = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item!);
    setRows(next);
    void persistOrder(next);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Umrah Reisen</h1>
          <p className="mt-1 text-sm text-muted">
            Alle Angebote sind dynamisch — Änderungen werden serverseitig gespeichert.
          </p>
        </div>
        <Link
          href="/admin/umrah/trips/new"
          className="rounded-xl bg-brand-cta px-4 py-2.5 text-sm font-semibold text-white"
        >
          Neu
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-surface text-start">
            <tr>
              <th className="px-4 py-3 font-semibold">Reihenfolge</th>
              <th className="px-4 py-3 font-semibold">Trip ID</th>
              <th className="px-4 py-3 font-semibold">Termin</th>
              <th className="px-4 py-3 font-semibold">Nächte</th>
              <th className="px-4 py-3 font-semibold">Kapazität</th>
              <th className="px-4 py-3 font-semibold">Preis ab</th>
              <th className="px-4 py-3 font-semibold">Verfügbarkeit</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted">
                  Lade Reisen …
                </td>
              </tr>
            ) : (
              rows.map((trip, index) => {
                const s = statusLabel(trip);
                return (
                  <tr key={trip.id} className="border-t border-line">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0 || savingOrder}
                          onClick={() => moveTrip(index, -1)}
                          className="rounded-lg border border-line p-1.5 disabled:opacity-40"
                          aria-label="Nach oben"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === rows.length - 1 || savingOrder}
                          onClick={() => moveTrip(index, 1)}
                          className="rounded-lg border border-line p-1.5 disabled:opacity-40"
                          aria-label="Nach unten"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <span className="ms-1 text-xs text-muted">{trip.displayOrder}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{trip.id}</td>
                    <td className="px-4 py-3">{trip.dateLabel}</td>
                    <td className="px-4 py-3">{trip.nights}</td>
                    <td className="px-4 py-3">
                      {trip.availableSeats}/{trip.totalCapacity}
                    </td>
                    <td className="px-4 py-3">{trip.prices.quad} €</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          s.tone === "green"
                            ? "bg-brand-green-soft text-brand-green"
                            : s.tone === "orange"
                              ? "bg-brand-orange-soft text-brand-waitlist"
                              : "bg-red-50 text-brand-red"
                        }`}
                      >
                        {s.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Link
                        href={`/admin/umrah/trips/${trip.id}`}
                        className="font-semibold text-brand-cta"
                      >
                        Bearbeiten
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
