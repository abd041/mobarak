"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { hotels } from "@/data/mock";
import {
  getHotelCatalogFields,
  type HotelCatalogFields,
} from "@/lib/hotel-catalog";
import { notifyHotelsUpdated } from "@/hooks/useHotels";

export default function AdminHotelEditPage() {
  const params = useParams<{ id: string }>();
  const hotel = useMemo(
    () => hotels.find((h) => h.id === params.id) ?? hotels[0]!,
    [params.id],
  );

  const [toast, setToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState<HotelCatalogFields>(() => getHotelCatalogFields(hotel));

  useEffect(() => {
    let cancelled = false;

    async function loadFields() {
      try {
        const res = await fetch("/api/hotels", { cache: "no-store" });
        if (!res.ok) throw new Error("fetch_failed");
        const data = (await res.json()) as { hotels: typeof hotels };
        const resolved = data.hotels.find((item) => item.id === hotel.id);
        if (!cancelled && resolved) {
          setFields({
            name: resolved.name,
            stars: resolved.stars,
            image: resolved.images[0]?.src ?? "",
            walkingMinutes: resolved.walkingMinutes,
            breakfast: resolved.breakfast,
          });
        }
      } catch {
        if (!cancelled) setFields(getHotelCatalogFields(hotel));
      }
    }

    void loadFields();
    return () => {
      cancelled = true;
    };
  }, [hotel]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hotel bearbeiten</h1>
          <p className="mt-1 text-sm text-muted">
            Katalog · ID <code className="text-xs">{hotel.id}</code> · {hotel.city}
          </p>
        </div>
        <Link href="/admin/hotels" className="text-sm text-brand-cta">
          ← Zurück
        </Link>
      </div>

      {toast && (
        <p className="mb-4 rounded-lg bg-brand-green-soft px-3 py-2 text-sm text-brand-green">
          Hotel gespeichert — Name, Bild und Sterne aktualisieren Angebotskarten sofort.
        </p>
      )}

      <form
        className="grid max-w-3xl gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            const res = await fetch(`/api/admin/hotels/${hotel.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(fields),
            });
            if (!res.ok) throw new Error("save_failed");
            notifyHotelsUpdated();
            setToast(true);
          } finally {
            setSaving(false);
          }
        }}
      >
        <p className="md:col-span-2 text-sm text-muted">
          Hotelname, Bild und Sterne gehören zum Hotel-Katalog. Check-in, Check-out und Nächte
          werden pro Abflug unter Umrah Reisen konfiguriert und automatisch auf der Karte
          angezeigt.
        </p>

        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium">Hotelname</span>
          <input
            className="w-full rounded-lg border border-line px-3 py-2"
            value={fields.name}
            onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Sterne</span>
          <input
            type="number"
            min={1}
            max={5}
            className="w-full rounded-lg border border-line px-3 py-2"
            value={fields.stars}
            onChange={(e) =>
              setFields((f) => ({ ...f, stars: Math.max(1, Math.min(5, Number(e.target.value) || 1)) }))
            }
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Gehminuten zum Haram/Nabawi</span>
          <input
            type="number"
            min={0}
            className="w-full rounded-lg border border-line px-3 py-2"
            value={fields.walkingMinutes}
            onChange={(e) =>
              setFields((f) => ({
                ...f,
                walkingMinutes: Math.max(0, Number(e.target.value) || 0),
              }))
            }
          />
        </label>

        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium">Hotelbild (URL / Pfad)</span>
          <input
            className="w-full rounded-lg border border-line px-3 py-2"
            value={fields.image}
            onChange={(e) => setFields((f) => ({ ...f, image: e.target.value }))}
            placeholder="/brand/offer-hero/..."
          />
        </label>

        {fields.image ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line md:col-span-2">
            <Image
              src={fields.image}
              alt={fields.name}
              fill
              className="object-cover"
              sizes="640px"
              unoptimized={fields.image.startsWith("http")}
            />
          </div>
        ) : null}

        <label className="inline-flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={fields.breakfast}
            onChange={(e) => setFields((f) => ({ ...f, breakfast: e.target.checked }))}
          />
          Frühstück inklusive
        </label>

        <button
          type="submit"
          className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white md:col-span-2"
        >
          Speichern
        </button>
      </form>
    </div>
  );
}
