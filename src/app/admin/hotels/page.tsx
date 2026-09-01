"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Hotel } from "@/data/mock";
import { hotels as seedHotels } from "@/data/mock";
import { hasIndividualUmrahHotelRate } from "@/lib/individual-umrah-hotel-rates-store";
import { HOTEL_MEAL_PLANS } from "@/lib/hotel-meal-plans";
import { setRuntimeHotels } from "@/lib/hotel-catalog";
import { HOTELS_DATA_EVENT } from "@/lib/trips-events";

type CityTab = "medina" | "makkah";

function mealPlanLabels(hotel: Hotel): string {
  const map = Object.fromEntries(HOTEL_MEAL_PLANS.map((p) => [p.id, p.label]));
  return hotel.mealPlans.map((id) => map[id] ?? id).join(", ") || "—";
}

export default function AdminHotelsPage() {
  const [rows, setRows] = useState<Hotel[]>(seedHotels);
  const [tab, setTab] = useState<CityTab>("medina");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pref = new URLSearchParams(window.location.search).get("city");
    if (pref === "medina" || pref === "makkah") setTab(pref);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/hotels", { cache: "no-store" });
        if (!res.ok) throw new Error("fetch_failed");
        const data = (await res.json()) as { hotels: Hotel[] };
        setRuntimeHotels(data.hotels);
        setRows(data.hotels);
      } catch {
        setRows(seedHotels);
      }
    }

    void load();
    const onUpdate = () => void load();
    window.addEventListener(HOTELS_DATA_EVENT, onUpdate);
    window.addEventListener("mobarak-individual-umrah-hotel-rates", onUpdate);
    return () => {
      window.removeEventListener(HOTELS_DATA_EVENT, onUpdate);
      window.removeEventListener("mobarak-individual-umrah-hotel-rates", onUpdate);
    };
  }, []);

  const medina = useMemo(
    () => rows.filter((h) => h.city === "medina").sort((a, b) => a.name.localeCompare(b.name)),
    [rows],
  );
  const makkah = useMemo(
    () => rows.filter((h) => h.city === "makkah").sort((a, b) => a.name.localeCompare(b.name)),
    [rows],
  );

  const hotels = tab === "medina" ? medina : makkah;

  function setCityTab(next: CityTab) {
    setTab(next);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("city", next);
      window.history.replaceState({}, "", url.toString());
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Hotels</h1>
          <p className="mt-1 text-sm text-muted">
            Hotelkatalog für Medina und Makkah — einmal anlegen, für Gruppen- und Individualumrah
            nutzen.
          </p>
        </div>
        <Link
          href={`/admin/hotels/new?city=${tab}`}
          className="rounded-xl bg-brand-cta px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Hotel hinzufügen
        </Link>
      </div>

      <div
        className="mb-5 flex gap-1 rounded-xl border border-line bg-white p-1"
        role="tablist"
        aria-label="Stadt"
      >
        {(
          [
            { id: "medina" as const, label: "Medina", count: medina.length },
            { id: "makkah" as const, label: "Makkah", count: makkah.length },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setCityTab(item.id)}
            className={
              tab === item.id
                ? "flex-1 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white"
                : "flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-navy hover:bg-surface"
            }
          >
            {item.label}
            <span className={tab === item.id ? "ms-2 text-white/70" : "ms-2 text-muted"}>
              ({item.count})
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 text-start">Bild</th>
              <th className="px-4 py-3 text-start">Name</th>
              <th className="px-4 py-3 text-start">Sterne</th>
              <th className="px-4 py-3 text-start">Entfernung</th>
              <th className="px-4 py-3 text-start">Verpflegung</th>
              <th className="px-4 py-3 text-start">Status</th>
              <th className="px-4 py-3 text-start">IU-Raten</th>
              <th className="px-4 py-3 text-start" />
            </tr>
          </thead>
          <tbody>
            {hotels.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted">
                  Noch keine Hotels in {tab === "medina" ? "Medina" : "Makkah"}.{" "}
                  <Link
                    href={`/admin/hotels/new?city=${tab}`}
                    className="font-semibold text-brand-cta"
                  >
                    + Hotel hinzufügen
                  </Link>
                </td>
              </tr>
            ) : (
              hotels.map((h) => (
                <tr key={h.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-md bg-surface">
                      {h.images[0]?.src ? (
                        <Image
                          src={h.images[0].src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-navy">{h.name}</div>
                    <div className="text-xs text-muted">{h.id}</div>
                  </td>
                  <td className="px-4 py-3">{h.stars}★</td>
                  <td className="px-4 py-3 whitespace-nowrap">{h.walkingMinutes} Min.</td>
                  <td className="max-w-[14rem] truncate px-4 py-3" title={mealPlanLabels(h)}>
                    {mealPlanLabels(h)}
                  </td>
                  <td className="px-4 py-3">
                    {h.active ? (
                      <span className="inline-flex rounded-full bg-brand-green-soft px-2.5 py-1 text-xs font-semibold text-brand-green">
                        Aktiv
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted">
                        Inaktiv
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {hasIndividualUmrahHotelRate(h.id) ? (
                      <span className="font-medium text-brand-green">Raten gesetzt</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Link href={`/admin/hotels/${h.id}`} className="font-semibold text-brand-cta">
                      Bearbeiten
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
