"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Hotel } from "@/data/mock";
import { hotels as seedHotels } from "@/data/mock";
import { HotelCatalogForm } from "@/components/admin/HotelCatalogForm";
import { HotelRateCategoriesEditor } from "@/components/admin/HotelRateCategoriesEditor";
import {
  getHotelCatalogFields,
  normalizeHotelCatalogFields,
  setRuntimeHotels,
  type HotelCatalogFields,
} from "@/lib/hotel-catalog";
import { notifyHotelsUpdated } from "@/hooks/useHotels";
import type { IndividualUmrahHotelRate } from "@/lib/individual-umrah-offer";
import {
  emptyIndividualUmrahHotelRate,
  getIndividualUmrahHotelRate,
  hotelRateHasOverlappingPeriods,
  upsertIndividualUmrahHotelRate,
} from "@/lib/individual-umrah-hotel-rates-store";

const SECTION_LINKS = [
  { href: "#general", label: "Allgemein" },
  { href: "#photos", label: "Fotos" },
  { href: "#room-categories", label: "Zimmerkategorien" },
  { href: "#rate-periods", label: "Preisperioden" },
  { href: "#extra-bed", label: "Extra bed" },
  { href: "#meals", label: "Mahlzeiten" },
] as const;

export default function AdminHotelEditPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [hotel, setHotel] = useState<Hotel | null>(
    () => seedHotels.find((h) => h.id === id) ?? null,
  );
  const [fields, setFields] = useState<HotelCatalogFields | null>(null);
  const [toast, setToast] = useState(false);
  const [rateToast, setRateToast] = useState(false);
  const [overlapBlocked, setOverlapBlocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rate, setRate] = useState<IndividualUmrahHotelRate>(() =>
    emptyIndividualUmrahHotelRate(id),
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/hotels", { cache: "no-store" });
        if (!res.ok) throw new Error("fetch_failed");
        const data = (await res.json()) as { hotels: Hotel[] };
        setRuntimeHotels(data.hotels);
        const resolved = data.hotels.find((item) => item.id === id) ?? null;
        if (cancelled) return;
        setHotel(resolved);
        if (resolved) {
          setFields(normalizeHotelCatalogFields({}, resolved));
        }
      } catch {
        const seed = seedHotels.find((h) => h.id === id) ?? null;
        if (cancelled) return;
        setHotel(seed);
        if (seed) setFields(getHotelCatalogFields(seed));
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    setRate(getIndividualUmrahHotelRate(id) ?? emptyIndividualUmrahHotelRate(id));
  }, [id]);

  useEffect(() => {
    if (!hotelRateHasOverlappingPeriods(rate)) setOverlapBlocked(false);
  }, [rate]);

  const cityLabel = useMemo(
    () => (hotel?.city === "medina" ? "Medina" : hotel?.city === "makkah" ? "Makkah" : "—"),
    [hotel],
  );

  const backHref =
    hotel?.city === "medina" || hotel?.city === "makkah"
      ? `/admin/hotels?city=${hotel.city}`
      : "/admin/hotels";

  if (!hotel || !fields) {
    return (
      <div>
        <Link href="/admin/hotels" className="text-sm text-brand-cta">
          ← Zurück
        </Link>
        <p className="mt-6 text-muted">Hotel nicht gefunden.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Hotel bearbeiten</h1>
          <p className="mt-1 text-sm text-muted">
            {hotel.name} · {cityLabel} · ID <code className="text-xs">{hotel.id}</code>
          </p>
        </div>
        <Link href={backHref} className="text-sm text-brand-cta">
          ← Zurück zur Liste
        </Link>
      </div>

      <nav
        className="mb-6 flex flex-wrap gap-2 rounded-xl border border-line bg-white p-2"
        aria-label="Abschnitte"
      >
        {SECTION_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-navy hover:bg-surface"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {toast ? (
        <p className="mb-4 rounded-lg bg-brand-green-soft px-3 py-2 text-sm text-brand-green">
          Hotel gespeichert — Katalog gilt für Gruppenreisen und Individualumrah.
        </p>
      ) : null}
      {rateToast ? (
        <p className="mb-4 rounded-lg bg-brand-green-soft px-3 py-2 text-sm text-brand-green">
          Zimmerkategorien und Raten gespeichert.
        </p>
      ) : null}
      {overlapBlocked ? (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          This rate overlaps with an existing rate period. Speichern ist blockiert, bis die
          Perioden einer Zimmerkategorie keine Überschneidung mehr haben.
        </p>
      ) : null}

      <HotelCatalogForm
        key={hotel.id}
        initial={fields}
        lockCity
        submitLabel="Hotel speichern"
        saving={saving}
        onSubmit={async (next) => {
          setSaving(true);
          try {
            const res = await fetch(`/api/admin/hotels/${hotel.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(next),
            });
            if (!res.ok) throw new Error("save_failed");
            const data = (await res.json()) as { hotel: Hotel };
            setHotel(data.hotel);
            setFields(normalizeHotelCatalogFields({}, data.hotel));
            notifyHotelsUpdated();
            setToast(true);
          } finally {
            setSaving(false);
          }
        }}
      />

      <form
        className="mx-auto mt-8 grid max-w-4xl gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (hotelRateHasOverlappingPeriods(rate)) {
            setOverlapBlocked(true);
            setRateToast(false);
            return;
          }
          setOverlapBlocked(false);
          upsertIndividualUmrahHotelRate({ ...rate, hotelId: hotel.id });
          setRateToast(true);
        }}
      >
        <HotelRateCategoriesEditor rate={rate} onChange={setRate} />

        <section
          id="extra-bed"
          className="scroll-mt-6 rounded-2xl border border-line bg-white p-5"
        >
          <h2 className="text-lg font-bold text-navy">Extra bed</h2>
          <p className="mt-1 text-sm text-muted">
            Interner Preis für Kinder mit Zustellbett — fließt in Zimmersummen ein, keine eigene
            PDF-Zeile.
          </p>
          <label className="mt-4 block max-w-xs text-sm">
            <span className="mb-1 block font-medium">Extra bed € / Nacht (inkl. Frühstück)</span>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-line px-3 py-2"
              value={rate.extraBedPerNight}
              onChange={(e) =>
                setRate((r) => ({ ...r, extraBedPerNight: Number(e.target.value) || 0 }))
              }
            />
          </label>
        </section>

        <section
          id="meals"
          className="scroll-mt-6 rounded-2xl border border-line bg-white p-5"
        >
          <h2 className="text-lg font-bold text-navy">Mahlzeiten</h2>
          <p className="mt-1 text-sm text-muted">
            Hotel-Defaults für Individualumrah. Optional pro Preisperiode überschreibbar. Im PDF:
            Verpflegung + optionale Mittag-/Abendzeilen.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Frühstück</span>
              <select
                className="w-full rounded-lg border border-line px-3 py-2"
                value={rate.meals.breakfastMode}
                onChange={(e) => {
                  const breakfastMode = e.target.value as
                    | "included"
                    | "optional"
                    | "priced";
                  setRate((r) => ({
                    ...r,
                    meals: { ...r.meals, breakfastMode },
                    boardLabel:
                      breakfastMode === "optional"
                        ? "Frühstück (optional)"
                        : r.boardLabel.startsWith("Frühstück")
                          ? "Frühstück"
                          : r.boardLabel,
                  }));
                }}
              >
                <option value="included">Im Zimmerpreis enthalten</option>
                <option value="optional">Optional (Preis konfigurierbar)</option>
                <option value="priced">Nicht enthalten (Preis konfigurierbar)</option>
              </select>
            </label>

            {rate.meals.breakfastMode !== "included" ? (
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Frühstück € / Person / Nacht</span>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-line px-3 py-2"
                  value={rate.meals.breakfastPerPersonNight}
                  onChange={(e) =>
                    setRate((r) => ({
                      ...r,
                      meals: {
                        ...r.meals,
                        breakfastPerPersonNight: Number(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </label>
            ) : (
              <div className="hidden md:block" />
            )}

            <label className="block text-sm">
              <span className="mb-1 block font-medium">Mittagessen € / Person / Nacht</span>
              <input
                type="number"
                min={0}
                className="w-full rounded-lg border border-line px-3 py-2"
                value={rate.meals.lunchPerPersonNight}
                onChange={(e) =>
                  setRate((r) => ({
                    ...r,
                    meals: {
                      ...r.meals,
                      lunchPerPersonNight: Number(e.target.value) || 0,
                    },
                  }))
                }
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium">Abendessen € / Person / Nacht</span>
              <input
                type="number"
                min={0}
                className="w-full rounded-lg border border-line px-3 py-2"
                value={rate.meals.dinnerPerPersonNight}
                onChange={(e) =>
                  setRate((r) => ({
                    ...r,
                    meals: {
                      ...r.meals,
                      dinnerPerPersonNight: Number(e.target.value) || 0,
                    },
                  }))
                }
              />
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="mb-1 block font-medium">Verpflegung (PDF-Label)</span>
              <input
                className="w-full rounded-lg border border-line px-3 py-2 md:max-w-md"
                value={rate.boardLabel}
                onChange={(e) => setRate((r) => ({ ...r, boardLabel: e.target.value }))}
                placeholder="Frühstück / Halbpension"
              />
              <span className="mt-1 block text-xs text-muted">
                Erscheint im Kunden-PDF als „Verpflegung: …“. Bei Halb-/Vollpension Abendessen im
                Zimmerpreis belassen.
              </span>
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="mb-1 block font-medium">Raten-Notizen</span>
              <textarea
                className="min-h-20 w-full rounded-lg border border-line px-3 py-2"
                value={rate.notes}
                onChange={(e) => setRate((r) => ({ ...r, notes: e.target.value }))}
              />
            </label>
          </div>
        </section>

        <button
          type="submit"
          className="rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={hotelRateHasOverlappingPeriods(rate)}
          title={
            hotelRateHasOverlappingPeriods(rate)
              ? "This rate overlaps with an existing rate period."
              : undefined
          }
        >
          Kategorien & Raten speichern
        </button>
      </form>
    </div>
  );
}
