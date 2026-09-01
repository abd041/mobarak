"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { trips, type UmrahTrip } from "@/data/mock";
import {
  deriveStatus,
  getTripAvailability,
  getTripChildPrices,
  getTripPrices,
  type TripAvailability,
  type TripChildPrices,
  type TripPrices,
} from "@/lib/trip-availability";
import {
  getTripBasics,
  type TripBasics,
} from "@/lib/trip-basics";
import {
  getTripHotelStayBundle,
  normalizeTripHotelStay,
  nightsBetweenIso,
  syncMakkahStayFromNights,
  syncStaysAfterMedinaNightsChange,
  type TripHotelStay,
  type TripHotelStayBundle,
} from "@/lib/trip-hotel-stays";
import {
  GALLERY_CAPTION_PRESETS,
  getTripGallery,
  moveGalleryItem,
  reindexGallerySortOrder,
} from "@/lib/trip-gallery";
import type { TripImage, Hotel } from "@/data/mock";
import { resolveHotel } from "@/lib/hotel-catalog";
import { useHotels } from "@/hooks/useHotels";
import {
  getTripFlightInfo,
  type TripFlightInfo,
} from "@/lib/trip-flights";
import { AvailabilityBadge } from "@/components/umrah/AvailabilityBadge";
import {
  INCLUSION_META,
  TRIP_INCLUSION_IDS,
  getTripInclusions,
  type TripInclusionId,
} from "@/lib/trip-inclusions";
import {
  HOLIDAY_PERIOD_FILTER_TAGS,
  MONTH_PERIOD_FILTER_TAGS,
  PERIOD_FILTER_TAG_META,
  type TripPeriodFilterTag,
} from "@/lib/listing-period-filters";
import { getTripPeriodFilterTags } from "@/lib/trip-period-filters";
import {
  formatTripPriceLabel,
  getTripPriceDisplayMode,
  type TripPriceDisplayMode,
} from "@/lib/trip-price-display";
import { notifyTripsUpdated } from "@/hooks/useTrips";

export default function AdminTripFormPage() {
  const params = useParams<{ id: string }>();
  const { hotels } = useHotels();
  const seedTrip = useMemo(
    () => trips.find((t) => t.id === params.id || t.slug === params.id) ?? trips[0]!,
    [params.id],
  );
  const [trip, setTrip] = useState<UmrahTrip>(seedTrip);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(seedTrip.displayOrder ?? 100);
  const [basics, setBasics] = useState<TripBasics>(() => getTripBasics(trip));
  const [availability, setAvailability] = useState<TripAvailability>(() => ({
    totalCapacity: trip.totalCapacity,
    availableSeats: trip.availableSeats,
    waitlistEnabled: trip.waitlistEnabled,
    waitlistCapacity: trip.waitlistCapacity,
    waitlistFull: trip.waitlistFull,
  }));
  const [prices, setPrices] = useState<TripPrices>(() => ({ ...trip.prices }));
  const [childPrices, setChildPrices] = useState<TripChildPrices>(() => ({ ...trip.childPrices }));
  const [flights, setFlights] = useState<TripFlightInfo>(() => getTripFlightInfo(trip));
  const [inclusions, setInclusions] = useState<TripInclusionId[]>(() => getTripInclusions(trip));
  const [periodFilters, setPeriodFilters] = useState<TripPeriodFilterTag[]>(() =>
    getTripPeriodFilterTags(trip),
  );
  const [priceDisplayMode, setPriceDisplayMode] = useState<TripPriceDisplayMode>(() =>
    getTripPriceDisplayMode(trip),
  );
  const [hotelStays, setHotelStays] = useState<TripHotelStayBundle>(() =>
    getTripHotelStayBundle(trip),
  );
  const [gallery, setGallery] = useState<TripImage[]>(() => getTripGallery(trip));

  useEffect(() => {
    let cancelled = false;

    async function loadTrip() {
      try {
        const res = await fetch(`/api/admin/trips/${params.id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("not_found");
        const data = (await res.json()) as { trip: UmrahTrip };
        if (cancelled) return;
        setTrip(data.trip);
        setDisplayOrder(data.trip.displayOrder ?? 100);
        setBasics(getTripBasics(data.trip));
        setAvailability(getTripAvailability(data.trip));
        setPrices(getTripPrices(data.trip));
        setChildPrices(getTripChildPrices(data.trip));
        setFlights(getTripFlightInfo(data.trip));
        setInclusions(getTripInclusions(data.trip));
        setPeriodFilters(getTripPeriodFilterTags(data.trip));
        setPriceDisplayMode(getTripPriceDisplayMode(data.trip));
        setHotelStays(getTripHotelStayBundle(data.trip));
        setGallery(getTripGallery(data.trip));
      } catch {
        if (!cancelled) setTrip(seedTrip);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadTrip();
    return () => {
      cancelled = true;
    };
  }, [params.id, seedTrip]);

  const previewTrip = {
    ...trip,
    ...basics,
    ...availability,
    prices,
    status: deriveStatus(availability),
  };

  return (
    <div>
      {loading ? (
        <p className="mb-4 text-sm text-muted">Reise wird geladen …</p>
      ) : null}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Umrah Reise bearbeiten</h1>
          <p className="mt-1 text-sm text-muted">
            Abflug-Datensatz · ID <code className="text-xs">{trip.id}</code>
          </p>
        </div>
        <Link href="/admin/umrah/trips" className="text-sm text-brand-cta">
          ← Zurück
        </Link>
      </div>

      {toast && (
        <p className="mb-4 rounded-lg bg-brand-green-soft px-3 py-2 text-sm text-brand-green">
          Angebot gespeichert — Listing, Detailseite und SEO nutzen die aktualisierten Daten.
        </p>
      )}

      <form
        className="space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          setToast(false);
          try {
            const payload: Partial<UmrahTrip> = {
              ...basics,
              displayOrder: Math.max(0, Number(displayOrder) || 0),
              totalCapacity: Math.max(0, Number(availability.totalCapacity) || 0),
              availableSeats: Math.max(0, Number(availability.availableSeats) || 0),
              waitlistEnabled: availability.waitlistEnabled,
              waitlistCapacity: Math.max(0, Number(availability.waitlistCapacity) || 0),
              waitlistFull: availability.waitlistFull,
              prices,
              childPrices,
              priceDisplayMode,
              filterTags: periodFilters,
              images: gallery,
              inclusions,
              medinaHotelId: hotelStays.medinaHotelId,
              makkahHotelId: hotelStays.makkahHotelId,
              medinaStay: hotelStays.medinaStay,
              makkahStay: hotelStays.makkahStay,
              airline: flights.airline,
              airlineLogo: flights.airlineLogo,
              baggageAllowance: flights.baggageAllowance,
              outbound: flights.outbound,
              inbound: flights.inbound,
            };

            const res = await fetch(`/api/admin/trips/${trip.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("save_failed");
            const data = (await res.json()) as { trip: UmrahTrip };
            setTrip(data.trip);
            notifyTripsUpdated();
            setToast(true);
          } catch {
            setToast(false);
          } finally {
            setSaving(false);
          }
        }}
      >
        <Section title="Basisdaten (Abflug)">
          <p className="md:col-span-2 text-sm text-muted">
            Jeder Gruppenabflug ist ein eigener Datensatz. Trip-ID ist stabil und dient als
            Schlüssel für Verfügbarkeit, Preise und Filter.
          </p>
          <Field label="Trip ID" value={trip.id} readOnly />
          <Field
            label="Titel"
            value={basics.title}
            onChange={(v) => setBasics((b) => ({ ...b, title: v }))}
          />
          <Field
            label="Startdatum"
            type="date"
            value={basics.startDate}
            onChange={(v) => setBasics((b) => ({ ...b, startDate: v }))}
          />
          <Field
            label="Enddatum"
            type="date"
            value={basics.endDate}
            onChange={(v) => setBasics((b) => ({ ...b, endDate: v }))}
          />
          <Field
            label="Anzahl Nächte"
            type="number"
            value={String(basics.nights)}
            onChange={(v) => setBasics((b) => ({ ...b, nights: Math.max(0, Number(v) || 0) }))}
          />
          <Field
            label="Gruppengröße"
            type="number"
            value={String(basics.groupSize)}
            onChange={(v) => setBasics((b) => ({ ...b, groupSize: Math.max(0, Number(v) || 0) }))}
          />
          <Field
            label="Abflughafen"
            value={basics.departureAirport}
            onChange={(v) => setBasics((b) => ({ ...b, departureAirport: v }))}
          />
          <Field
            label="Anzeigereihenfolge"
            type="number"
            value={String(displayOrder)}
            onChange={(v) => setDisplayOrder(Math.max(0, Number(v) || 0))}
          />
          <Field label="Slug (URL)" value={trip.slug} readOnly />
        </Section>

        <Section title="Verfügbarkeit">
          <p className="md:col-span-2 text-sm text-muted">
            Steuert Kapazität, freie Plätze und Warteliste — inkl. Badge auf dem Trip-Bild.
          </p>

          <Field
            label="Gesamtkapazität"
            type="number"
            value={String(availability.totalCapacity)}
            onChange={(v) =>
              setAvailability((a) => ({
                ...a,
                totalCapacity: Math.max(0, Number(v) || 0),
              }))
            }
          />
          <Field
            label="Freie Plätze"
            type="number"
            value={String(availability.availableSeats)}
            onChange={(v) =>
              setAvailability((a) => ({
                ...a,
                availableSeats: Math.max(0, Number(v) || 0),
              }))
            }
          />

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={availability.waitlistEnabled}
              onChange={(e) =>
                setAvailability((a) => ({ ...a, waitlistEnabled: e.target.checked }))
              }
            />
            Warteliste aktiv
          </label>

          <Field
            label="Wartelisten-Kapazität"
            type="number"
            value={String(availability.waitlistCapacity)}
            onChange={(v) =>
              setAvailability((a) => ({
                ...a,
                waitlistCapacity: Math.max(0, Number(v) || 0),
              }))
            }
          />

          <label className="md:col-span-2 block text-sm">
            <span className="mb-1 block font-medium">Warteliste Status</span>
            <select
              className="w-full rounded-lg border border-line px-3 py-2"
              value={availability.waitlistFull ? "full" : "available"}
              disabled={!availability.waitlistEnabled}
              onChange={(e) =>
                setAvailability((a) => ({
                  ...a,
                  waitlistFull: e.target.value === "full",
                }))
              }
            >
              <option value="available">Warteliste verfügbar</option>
              <option value="full">Warteliste voll</option>
            </select>
          </label>

          <div className="md:col-span-2 rounded-xl border border-line bg-surface p-4">
            <p className="mb-3 text-sm font-semibold text-navy">Badge-Vorschau</p>
            <div className="relative h-28 overflow-hidden rounded-lg bg-[#2c3e50]">
              <div className="absolute start-3 top-3">
                <AvailabilityBadge trip={previewTrip} />
              </div>
              <p className="absolute bottom-3 start-3 text-xs text-white/70">
                Status: <strong>{deriveStatus(availability)}</strong>
                {" · "}
                {availability.availableSeats}/{availability.totalCapacity} Plätze
                {availability.waitlistEnabled
                  ? ` · WL ${availability.waitlistCapacity} (${availability.waitlistFull ? "voll" : "offen"})`
                  : ""}
              </p>
            </div>
          </div>
        </Section>

        <Section title="Hotels — Medina & Makkah">
          <p className="md:col-span-2 text-sm text-muted">
            Pro Abflug: Hotel (Name, Bild, Sterne aus dem Katalog) plus Check-in, Check-out und
            Nächte. Die Hoteldaten erscheinen automatisch auf der Angebotskarte.
          </p>

          <HotelStayEditor
            city="Medina"
            hotelId={hotelStays.medinaHotelId}
            stay={hotelStays.medinaStay}
            hotelOptions={hotels.filter((h) => h.city === "medina" && h.active)}
            onHotelIdChange={(id) => setHotelStays((s) => ({ ...s, medinaHotelId: id }))}
            onStayChange={(stay) => {
              setHotelStays((s) => {
                const medinaStay = normalizeTripHotelStay(stay);
                const makkahStay = normalizeTripHotelStay({
                  ...s.makkahStay,
                  checkIn: medinaStay.checkOut || s.makkahStay.checkIn,
                  nights:
                    medinaStay.checkOut && s.makkahStay.checkOut
                      ? nightsBetweenIso(medinaStay.checkOut, s.makkahStay.checkOut)
                      : s.makkahStay.nights,
                });
                return { ...s, medinaStay, makkahStay };
              });
            }}
            onNightsChange={(nights) => {
              setHotelStays((s) => {
                const derived = syncStaysAfterMedinaNightsChange(
                  basics.startDate || trip.startDate,
                  basics.endDate || trip.endDate,
                  nights,
                );
                return {
                  ...s,
                  medinaStay: derived.medinaStay,
                  makkahStay: {
                    ...derived.makkahStay,
                    // keep trip end as Makkah check-out when possible
                    checkOut: basics.endDate || trip.endDate || derived.makkahStay.checkOut,
                    nights: nightsBetweenIso(
                      derived.makkahStay.checkIn,
                      basics.endDate || trip.endDate || derived.makkahStay.checkOut,
                    ),
                  },
                };
              });
            }}
          />

          <HotelStayEditor
            city="Makkah"
            hotelId={hotelStays.makkahHotelId}
            stay={hotelStays.makkahStay}
            hotelOptions={hotels.filter((h) => h.city === "makkah" && h.active)}
            onHotelIdChange={(id) => setHotelStays((s) => ({ ...s, makkahHotelId: id }))}
            onStayChange={(stay) =>
              setHotelStays((s) => ({ ...s, makkahStay: normalizeTripHotelStay(stay) }))
            }
            onNightsChange={(nights) => {
              setHotelStays((s) => ({
                ...s,
                makkahStay: syncMakkahStayFromNights(s.medinaStay.checkOut, nights),
              }));
            }}
          />
        </Section>

        <Section title="Galerie (pro Abflug)">
          <p className="md:col-span-2 text-sm text-muted">
            Jeder Abflug braucht eine eigene Galerie. Pro Bild: Bildpfad, optionale Beschriftung und
            Sortierreihenfolge. Die Reihenfolge steuert Karten-Karussell und Detailgalerie.
          </p>

          <div className="md:col-span-2 space-y-3">
            {gallery.map((img, index) => (
              <div
                key={`${img.src}-${index}`}
                className="grid gap-3 rounded-xl border border-line bg-surface/50 p-3 sm:grid-cols-[88px_1fr_auto]"
              >
                <div className="overflow-hidden rounded-lg border border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src || "/brand/hero-bg.png"}
                    alt={img.caption || ""}
                    className="aspect-[4/3] h-auto w-full object-cover"
                  />
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block text-sm sm:col-span-2">
                    <span className="mb-1 block font-medium">Bild (URL / Pfad)</span>
                    <input
                      className="w-full rounded-lg border border-line px-3 py-2"
                      value={img.src}
                      onChange={(e) => {
                        const src = e.target.value;
                        setGallery((prev) =>
                          prev.map((item, i) => (i === index ? { ...item, src } : item)),
                        );
                      }}
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium">Beschriftung (optional)</span>
                    <input
                      list="gallery-caption-presets"
                      className="w-full rounded-lg border border-line px-3 py-2"
                      value={img.caption ?? ""}
                      placeholder="z. B. Hotel in Makkah"
                      onChange={(e) => {
                        const caption = e.target.value;
                        setGallery((prev) =>
                          prev.map((item, i) =>
                            i === index
                              ? { ...item, caption: caption.trim() || undefined }
                              : item,
                          ),
                        );
                      }}
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium">Sortierung</span>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-line px-3 py-2"
                      value={img.sortOrder}
                      onChange={(e) => {
                        const sortOrder = Number(e.target.value) || 0;
                        setGallery((prev) =>
                          reindexGallerySortOrder(
                            prev.map((item, i) =>
                              i === index ? { ...item, sortOrder } : item,
                            ),
                          ),
                        );
                      }}
                    />
                  </label>
                </div>

                <div className="flex flex-row gap-2 sm:flex-col sm:justify-center">
                  <button
                    type="button"
                    className="rounded-lg border border-line bg-white px-2 py-1 text-xs font-semibold disabled:opacity-40"
                    disabled={index === 0}
                    onClick={() => setGallery((prev) => moveGalleryItem(prev, index, -1))}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-line bg-white px-2 py-1 text-xs font-semibold disabled:opacity-40"
                    disabled={index >= gallery.length - 1}
                    onClick={() => setGallery((prev) => moveGalleryItem(prev, index, 1))}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-brand-red"
                    onClick={() =>
                      setGallery((prev) =>
                        reindexGallerySortOrder(prev.filter((_, i) => i !== index)),
                      )
                    }
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            ))}

            <datalist id="gallery-caption-presets">
              {GALLERY_CAPTION_PRESETS.map((caption) => (
                <option key={caption} value={caption} />
              ))}
            </datalist>

            <button
              type="button"
              className="rounded-xl border border-dashed border-line px-4 py-3 text-sm font-semibold text-brand-cta"
              onClick={() =>
                setGallery((prev) => [
                  ...prev,
                  {
                    src: "/brand/offer-hero/hero-bg-3.png",
                    caption: "Unsere Reisegruppe",
                    sortOrder: prev.length,
                  },
                ])
              }
            >
              + Bild hinzufügen
            </button>
          </div>
        </Section>

        <Section title="Inkludierte Leistungen (pro Abflug)">
          <p className="md:col-span-2 text-sm text-muted">
            Leistungen pro Abflug ein- oder ausschalten. Karten und Detailseite rendern nur die
            aktivierten Einträge aus dem Katalog — nichts ist fest in die Karte eingebaut.
          </p>
          <div className="md:col-span-2 grid gap-2 sm:grid-cols-2">
            {TRIP_INCLUSION_IDS.map((id) => {
              const active = inclusions.includes(id);
              return (
                <label
                  key={id}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    active ? "border-brand-green bg-brand-green-soft/40" : "border-line opacity-60"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => {
                      setInclusions((prev) => {
                        const next = e.target.checked
                          ? [...prev, id]
                          : prev.filter((item) => item !== id);
                        return TRIP_INCLUSION_IDS.filter((item) => next.includes(item));
                      });
                    }}
                  />
                  {INCLUSION_META[id].adminLabel}
                </label>
              );
            })}
          </div>
          <p className="md:col-span-2 text-xs text-muted">
            Aktiv:{" "}
            {inclusions.length > 0
              ? inclusions.map((id) => INCLUSION_META[id].adminLabel).join(" · ")
              : "Keine — Karte zeigt keine Leistungszeile."}
          </p>
        </Section>

        <Section title="Listing-Filter (Monate & Ferien)">
          <p className="md:col-span-2 text-sm text-muted">
            Steuert die Filter auf der Umrah-Gruppenreisen-Seite. Mehrfachauswahl möglich — Tags
            werden nicht aus Reisedaten abgeleitet.
          </p>

          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-semibold text-navy">Monatsfilter</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {MONTH_PERIOD_FILTER_TAGS.map((tag) => {
                const active = periodFilters.includes(tag);
                return (
                  <label
                    key={tag}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                      active ? "border-brand-orange-cta bg-brand-orange-soft/50" : "border-line"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => {
                        setPeriodFilters((prev) =>
                          e.target.checked
                            ? [...prev, tag]
                            : prev.filter((item) => item !== tag),
                        );
                      }}
                    />
                    {PERIOD_FILTER_TAG_META[tag].adminLabel}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-semibold text-navy">Ferienfilter</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {HOLIDAY_PERIOD_FILTER_TAGS.map((tag) => {
                const active = periodFilters.includes(tag);
                return (
                  <label
                    key={tag}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                      active ? "border-brand-orange-cta bg-brand-orange-soft/50" : "border-line"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => {
                        setPeriodFilters((prev) =>
                          e.target.checked
                            ? [...prev, tag]
                            : prev.filter((item) => item !== tag),
                        );
                      }}
                    />
                    {PERIOD_FILTER_TAG_META[tag].adminLabel}
                  </label>
                );
              })}
            </div>
          </div>

          <p className="md:col-span-2 text-xs text-muted">
            Aktive Tags:{" "}
            {periodFilters.length > 0
              ? periodFilters.map((tag) => PERIOD_FILTER_TAG_META[tag].adminLabel).join(" · ")
              : "Keine — Reise erscheint nur bei „Alle Termine“."}
          </p>
        </Section>

        <Section title="Preise (pro Abflug)">
          <p className="md:col-span-2 text-sm text-muted">
            Erwachsenenpreise erscheinen auf der Umrah-Gruppenreisen-Landingpage (3 Spalten).
            Kinder- und Babypreise nur auf der Angebotsseite und im Checkout — damit die Karte
            übersichtlich bleibt.
          </p>

          <p className="md:col-span-2 text-sm font-semibold text-navy">Erwachsene (Landingpage)</p>
          <Field
            label="Vierbettzimmer — 1 Bett (€)"
            type="number"
            value={String(prices.quad)}
            onChange={(v) => setPrices((p) => ({ ...p, quad: Number(v) || 0 }))}
          />
          <Field
            label="Dreibettzimmer — 1 Bett (€)"
            type="number"
            value={String(prices.triple)}
            onChange={(v) => setPrices((p) => ({ ...p, triple: Number(v) || 0 }))}
          />
          <Field
            label="Zweibettzimmer — 1 Bett (€)"
            type="number"
            value={String(prices.double)}
            onChange={(v) => setPrices((p) => ({ ...p, double: Number(v) || 0 }))}
          />

          <p className="md:col-span-2 mt-2 text-sm font-semibold text-navy">
            Kinder & Babys (Angebotsseite & Checkout)
          </p>
          <Field
            label="Baby / Kleinkind (€)"
            type="number"
            value={String(childPrices.infant)}
            onChange={(v) => setChildPrices((p) => ({ ...p, infant: Number(v) || 0 }))}
          />
          <Field
            label="Kind ohne Bett (€)"
            type="number"
            value={String(childPrices.withoutBed)}
            onChange={(v) => setChildPrices((p) => ({ ...p, withoutBed: Number(v) || 0 }))}
          />
          <Field
            label="Kind mit Bett — Ermäßigung (€)"
            type="number"
            value={String(childPrices.withBedDiscount)}
            onChange={(v) =>
              setChildPrices((p) => ({ ...p, withBedDiscount: Number(v) || 0 }))
            }
          />
          <p className="md:col-span-2 text-xs text-muted">
            „Kind mit Bett“ ist eine Ermäßigung vom Erwachsenenpreis (wird auf der Website als
            Rabatt angezeigt).
          </p>

          <label className="md:col-span-2 block text-sm">
            <span className="mb-1 block font-medium">Preis-Anzeige</span>
            <select
              className="w-full rounded-lg border border-line px-3 py-2"
              value={priceDisplayMode}
              onChange={(e) => setPriceDisplayMode(e.target.value as TripPriceDisplayMode)}
            >
              <option value="fixed">Festpreis — z. B. 1.250 €</option>
              <option value="from">Ab-Preis — z. B. ab 1.250 €</option>
            </select>
            <span className="mt-1 block text-xs text-muted">
              „Ab“ nur verwenden, wenn der Betrag ein Mindestpreis ist — nicht bei festen
              Abflugpreisen.
            </span>
          </label>
          <div className="md:col-span-2 grid grid-cols-3 gap-3 rounded-xl border border-line bg-surface p-4 text-center">
            {(
              [
                ["Vierbett", prices.quad],
                ["Dreibett", prices.triple],
                ["Zweibett", prices.double],
              ] as const
            ).map(([label, amount]) => (
              <div key={label}>
                <p className="text-[10px] font-medium text-[#1A1A1A]">{label}</p>
                <p className="mt-1 text-sm font-extrabold text-[#1F8A4C]">
                  {formatTripPriceLabel(amount, priceDisplayMode, "ab")}
                </p>
                <p className="text-[10px] text-[#1A1A1A]">pro Person</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Fluginformationen (pro Abflug)">
          <p className="md:col-span-2 text-sm text-muted">
            Steuert die Flugkarte auf der Reisedetailseite — Airline, Gepäck, Hin- und Rückflug.
          </p>
          <Field
            label="Airline"
            value={flights.airline}
            onChange={(v) => setFlights((f) => ({ ...f, airline: v }))}
          />
          <Field
            label="Airline-Logo (Pfad)"
            value={flights.airlineLogo}
            onChange={(v) => setFlights((f) => ({ ...f, airlineLogo: v }))}
          />
          <Field
            label="Gepäck"
            value={flights.baggageAllowance}
            onChange={(v) => setFlights((f) => ({ ...f, baggageAllowance: v }))}
          />

          <p className="md:col-span-2 mt-2 text-sm font-semibold text-navy">Hinflug</p>
          <Field
            label="Datum"
            value={flights.outbound.dateLabel}
            onChange={(v) =>
              setFlights((f) => ({ ...f, outbound: { ...f.outbound, dateLabel: v } }))
            }
          />
          <Field
            label="Von (Code)"
            value={flights.outbound.fromCode}
            onChange={(v) =>
              setFlights((f) => ({ ...f, outbound: { ...f.outbound, fromCode: v } }))
            }
          />
          <Field
            label="Nach (Code)"
            value={flights.outbound.toCode}
            onChange={(v) =>
              setFlights((f) => ({ ...f, outbound: { ...f.outbound, toCode: v } }))
            }
          />
          <Field
            label="Abflugzeit"
            value={flights.outbound.departTime}
            onChange={(v) =>
              setFlights((f) => ({ ...f, outbound: { ...f.outbound, departTime: v } }))
            }
          />
          <Field
            label="Ankunftszeit"
            value={flights.outbound.arriveTime}
            onChange={(v) =>
              setFlights((f) => ({ ...f, outbound: { ...f.outbound, arriveTime: v } }))
            }
          />
          <Field
            label="Von (Stadt)"
            value={flights.outbound.fromCity}
            onChange={(v) =>
              setFlights((f) => ({ ...f, outbound: { ...f.outbound, fromCity: v } }))
            }
          />
          <Field
            label="Nach (Stadt)"
            value={flights.outbound.toCity}
            onChange={(v) =>
              setFlights((f) => ({ ...f, outbound: { ...f.outbound, toCity: v } }))
            }
          />
          <Field
            label="Flugdauer"
            value={flights.outbound.duration}
            onChange={(v) =>
              setFlights((f) => ({ ...f, outbound: { ...f.outbound, duration: v } }))
            }
          />
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={flights.outbound.direct}
              onChange={(e) =>
                setFlights((f) => ({
                  ...f,
                  outbound: { ...f.outbound, direct: e.target.checked },
                }))
              }
            />
            Direktflug (Hinflug)
          </label>

          <p className="md:col-span-2 mt-4 text-sm font-semibold text-navy">Rückflug</p>
          <Field
            label="Datum"
            value={flights.inbound.dateLabel}
            onChange={(v) =>
              setFlights((f) => ({ ...f, inbound: { ...f.inbound, dateLabel: v } }))
            }
          />
          <Field
            label="Von (Code)"
            value={flights.inbound.fromCode}
            onChange={(v) =>
              setFlights((f) => ({ ...f, inbound: { ...f.inbound, fromCode: v } }))
            }
          />
          <Field
            label="Nach (Code)"
            value={flights.inbound.toCode}
            onChange={(v) =>
              setFlights((f) => ({ ...f, inbound: { ...f.inbound, toCode: v } }))
            }
          />
          <Field
            label="Abflugzeit"
            value={flights.inbound.departTime}
            onChange={(v) =>
              setFlights((f) => ({ ...f, inbound: { ...f.inbound, departTime: v } }))
            }
          />
          <Field
            label="Ankunftszeit"
            value={flights.inbound.arriveTime}
            onChange={(v) =>
              setFlights((f) => ({ ...f, inbound: { ...f.inbound, arriveTime: v } }))
            }
          />
          <Field
            label="Von (Stadt)"
            value={flights.inbound.fromCity}
            onChange={(v) =>
              setFlights((f) => ({ ...f, inbound: { ...f.inbound, fromCity: v } }))
            }
          />
          <Field
            label="Nach (Stadt)"
            value={flights.inbound.toCity}
            onChange={(v) =>
              setFlights((f) => ({ ...f, inbound: { ...f.inbound, toCity: v } }))
            }
          />
          <Field
            label="Flugdauer"
            value={flights.inbound.duration}
            onChange={(v) =>
              setFlights((f) => ({ ...f, inbound: { ...f.inbound, duration: v } }))
            }
          />
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={flights.inbound.direct}
              onChange={(e) =>
                setFlights((f) => ({
                  ...f,
                  inbound: { ...f.inbound, direct: e.target.checked },
                }))
              }
            />
            Direktflug (Rückflug)
          </label>
        </Section>

        <Section title="SEO">
          <p className="md:col-span-2 text-sm text-muted">
            Jede Abflug-Seite kann einzeln indexiert werden. Steuert <code>sitemap.xml</code>,
            Canonical/hreflang und robots index/noindex.
          </p>
          <label className="md:col-span-2 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={trip.seoIndexable !== false} readOnly />
            In Suchmaschinen indexieren (
            <code className="text-xs">/umrah/gruppenreise/{trip.slug}</code>)
          </label>
          <p className="md:col-span-2 text-xs text-muted">
            Feld <code>seoIndexable</code> in den Reisedaten — aktuell{" "}
            <strong>{trip.seoIndexable !== false ? "aktiv" : "deaktiviert"}</strong>.
          </p>
        </Section>

        <button
          type="submit"
          disabled={saving || loading}
          className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Speichern …" : "Änderungen speichern"}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="mb-4 font-bold">{title}</h2>
      <div className="grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}

function HotelStayEditor({
  city,
  hotelId,
  stay,
  hotelOptions,
  onHotelIdChange,
  onStayChange,
  onNightsChange,
}: {
  city: string;
  hotelId: string;
  stay: TripHotelStay;
  hotelOptions: Hotel[];
  onHotelIdChange: (id: string) => void;
  onStayChange: (stay: TripHotelStay) => void;
  onNightsChange: (nights: number) => void;
}) {
  const hotel = resolveHotel(hotelOptions.find((h) => h.id === hotelId) ?? hotelOptions[0]!);
  const image = hotel.images[0]?.src;

  return (
    <div className="md:col-span-2 rounded-xl border border-line bg-surface/60 p-4">
      <p className="mb-3 text-sm font-bold text-navy">{city}</p>
      <div className="grid gap-3 md:grid-cols-[140px_1fr]">
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image || "/brand/hero-bg.png"}
            alt={hotel.name}
            className="aspect-[4/3] h-auto w-full object-cover"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Hotel</span>
            <select
              className="w-full rounded-lg border border-line px-3 py-2"
              value={hotelId}
              onChange={(e) => onHotelIdChange(e.target.value)}
            >
              {hotelOptions.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.stars}★)
                </option>
              ))}
            </select>
          </label>
          <p className="text-sm text-muted sm:col-span-2">
            Name: <strong className="text-navy">{hotel.name}</strong>
            {" · "}
            Sterne: <strong className="text-navy">{hotel.stars}</strong>
          </p>
          <Field
            label="Check-in"
            type="date"
            value={stay.checkIn}
            onChange={(v) => onStayChange({ ...stay, checkIn: v })}
          />
          <Field
            label="Check-out"
            type="date"
            value={stay.checkOut}
            onChange={(v) => onStayChange({ ...stay, checkOut: v })}
          />
          <Field
            label="Anzahl Nächte"
            type="number"
            value={String(stay.nights)}
            onChange={(v) => onNightsChange(Math.max(0, Number(v) || 0))}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  value,
  onChange,
  type = "text",
  readOnly = false,
}: {
  label: string;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        value={value}
        readOnly={readOnly}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full rounded-lg border border-line px-3 py-2 ${
          readOnly ? "bg-surface text-muted" : ""
        }`}
      />
    </label>
  );
}
