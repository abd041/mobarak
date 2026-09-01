"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HotelCatalogForm,
  emptyHotelCatalogFields,
} from "@/components/admin/HotelCatalogForm";
import { notifyHotelsUpdated } from "@/hooks/useHotels";
import type { HotelCatalogFields } from "@/lib/hotel-catalog";

export default function AdminHotelNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityPref, setCityPref] = useState<"medina" | "makkah">("makkah");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pref = new URLSearchParams(window.location.search).get("city");
    if (pref === "medina" || pref === "makkah") setCityPref(pref);
  }, []);

  async function onSubmit(fields: HotelCatalogFields) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error("save_failed");
      const data = (await res.json()) as { hotel: { id: string } };
      notifyHotelsUpdated();
      router.push(`/admin/hotels/${data.hotel.id}`);
    } catch {
      setError("Hotel konnte nicht angelegt werden. Bitte erneut versuchen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Hotel hinzufügen</h1>
          <p className="mt-1 text-sm text-muted">
            Einmal anlegen — danach für Gruppenreisen und Individualumrah nutzen.
          </p>
        </div>
        <Link
          href={`/admin/hotels?city=${cityPref}`}
          className="text-sm text-brand-cta"
        >
          ← Zurück zur Liste
        </Link>
      </div>

      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <HotelCatalogForm
        key={cityPref}
        initial={emptyHotelCatalogFields(cityPref)}
        submitLabel="Hotel anlegen"
        saving={saving}
        onSubmit={onSubmit}
      />
    </div>
  );
}
