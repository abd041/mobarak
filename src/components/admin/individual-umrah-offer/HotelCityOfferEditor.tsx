"use client";

import { useEffect, useState } from "react";
import type { Hotel } from "@/data/mock";
import type { IndividualUmrahInquiry } from "@/lib/individual-umrah-inquiry";
import type { OfferHotelOption } from "@/lib/individual-umrah-offer";
import { emptyHotelOption } from "@/lib/individual-umrah-offer-defaults";
import {
  formatMissingHotelRateMessage,
  getIndividualUmrahHotelRate,
  getOfferHotelMissingRateDates,
  listActiveRoomCategories,
} from "@/lib/individual-umrah-hotel-rates-store";
import { resolveHotelById } from "@/lib/hotel-catalog";
import {
  avgPerPerson,
  ensurePerRoomBreakdown,
  formatEuroDe,
  getCalculatedRoomPrices,
  getOfferRoomPrices,
  hotelOfferPriceIsOverridden,
  roomsTotal,
} from "@/lib/individual-umrah-offer-pricing";
import {
  labelOfferMealPlan,
  type OfferMealPlanCode,
} from "@/lib/individual-umrah-offer-codes";

const MAX_HOTEL_OPTIONS = 3;

/** PDF position hints — ranking among alternatives, not a combined package. */
const PDF_ORDER_HINTS = [
  "Alternative 1",
  "Alternative 2",
  "Alternative 3",
] as const;

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-cta";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-navy">{label}</span>
      {children}
    </label>
  );
}

/** Move item from `from` to `to` (0-based); returns a new array. */
export function moveHotelOption<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

export function HotelCityOfferEditor({
  title,
  dateLabel,
  hotels: catalog,
  options,
  roomCount,
  adults,
  children,
  nights,
  stayStartDate,
  inquiry,
  onAdd,
  onChange,
  onRemove,
  onReorder,
}: {
  title: string;
  dateLabel?: string;
  hotels: Hotel[];
  options: OfferHotelOption[];
  roomCount: number;
  adults: number;
  children: number;
  nights: number;
  stayStartDate: string | null;
  inquiry: IndividualUmrahInquiry;
  onAdd: (hotelId: string, categoryId: string) => void;
  onChange: (index: number, patch: Partial<OfferHotelOption>) => void;
  onRemove: (index: number) => void;
  /** Reorder for PDF: array index = alternative number (not a package pick). */
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  const canAddMore = options.length < MAX_HOTEL_OPTIONS;
  const [categoryByHotel, setCategoryByHotel] = useState<Record<string, string>>({});
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  useEffect(() => {
    setCategoryByHotel((prev) => {
      const next = { ...prev };
      for (const hotel of catalog) {
        if (next[hotel.id]) continue;
        const cats = listActiveRoomCategories(getIndividualUmrahHotelRate(hotel.id));
        if (cats[0]?.id) next[hotel.id] = cats[0].id;
      }
      return next;
    });
  }, [catalog]);

  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-navy">{title}</h2>
        {dateLabel ? <p className="mt-0.5 text-sm text-muted">{dateLabel}</p> : null}
        <p className="mt-1 text-xs text-muted">
          Bis zu {MAX_HOTEL_OPTIONS} Hotel-Alternativen für das PDF ({options.length}/
          {MAX_HOTEL_OPTIONS}). Reihenfolge = Darstellung (1–3),{" "}
          <strong>kein</strong> kombiniertes Paket mit Flug/anderen Städten. Der Kunde wählt
          eine Option. Preise: Engine + optionaler Angebots-Override; PDF zeigt nur
          Aufenthaltssummen, Zimmerbelegung, Ø/Person und Verpflegung.
        </p>
      </div>

      <div className="mb-5 rounded-xl border border-dashed border-line bg-surface/40 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Verfügbare Hotels
        </p>
        <div className="space-y-2">
          {catalog.length === 0 ? (
            <p className="text-sm text-muted">Keine aktiven Hotels für diese Stadt.</p>
          ) : (
            catalog.map((hotel) => {
              const rate = getIndividualUmrahHotelRate(hotel.id);
              const categories = listActiveRoomCategories(rate);
              const categoryId = categoryByHotel[hotel.id] ?? categories[0]?.id ?? "";
              const timesOnOffer = options.filter((o) => o.hotelId === hotel.id).length;
              const disabled = !canAddMore || !categoryId;
              return (
                <div
                  key={hotel.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-white px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy">{hotel.name}</p>
                    <p className="text-xs text-muted">
                      {hotel.stars}★ · {hotel.walkingMinutes} Min. Fußweg
                      {timesOnOffer > 0 ? ` · ${timesOnOffer}× im Angebot` : ""}
                    </p>
                  </div>
                  <select
                    className={`${inputClass} max-w-[11rem]`}
                    value={categoryId}
                    disabled={!categories.length}
                    onChange={(e) =>
                      setCategoryByHotel((prev) => ({ ...prev, [hotel.id]: e.target.value }))
                    }
                  >
                    {categories.length === 0 ? (
                      <option value="">Keine Raten</option>
                    ) : (
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
                  <button
                    type="button"
                    disabled={disabled}
                    title={
                      !canAddMore
                        ? `Maximal ${MAX_HOTEL_OPTIONS} Hotels im Angebot`
                        : !categoryId
                          ? "Zuerst Zimmerkategorien / Raten für dieses Hotel anlegen"
                          : "Als Hoteloption zum Angebot hinzufügen"
                    }
                    className="rounded-lg bg-brand-cta px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
                    onClick={() => onAdd(hotel.id, categoryId)}
                  >
                    Hotel auswählen
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-4">
        {options.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface/30 px-4 py-6 text-center text-sm text-muted">
            Noch keine Hotels im Angebot. Mit <strong>Hotel auswählen</strong> Alternativen für
            den Kunden hinzufügen.
          </p>
        ) : null}
        {options.map((option, index) => {
          const calculatedPrices = getCalculatedRoomPrices(option, roomCount);
          const offerPrices = getOfferRoomPrices(option, roomCount);
          const { roomOccupancyLabels } = ensurePerRoomBreakdown(
            roomCount,
            option.roomPrices,
            option.roomOccupancyLabels,
          );
          const calculatedTotal = roomsTotal(calculatedPrices);
          const offerTotal = roomsTotal(offerPrices);
          const overridden = hotelOfferPriceIsOverridden(option, roomCount);
          const rate = getIndividualUmrahHotelRate(option.hotelId);
          const categories = listActiveRoomCategories(rate);
          const roleHint = PDF_ORDER_HINTS[index] ?? `Option ${index + 1}`;
          const missingDates = getOfferHotelMissingRateDates(
            option,
            stayStartDate,
            nights,
          );
          const pricingIncomplete = missingDates.length > 0;
          return (
            <div
              key={option.id}
              draggable
              onDragStart={() => setDragFrom(index)}
              onDragEnd={() => setDragFrom(null)}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragFrom === null || dragFrom === index) return;
                onReorder(dragFrom, index);
                setDragFrom(null);
              }}
              className={`rounded-xl border border-line p-4 ${
                dragFrom === index ? "opacity-60 ring-2 ring-brand-cta/40" : ""
              }`}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span
                    className="mt-0.5 cursor-grab select-none text-muted active:cursor-grabbing"
                    title="Zum Sortieren ziehen"
                    aria-hidden
                  >
                    ⋮⋮
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {catalog.find((h) => h.id === option.hotelId)?.name ?? option.hotelId}
                    </p>
                    <p className="text-xs text-muted">
                      Hotel {index + 1} im PDF · {roleHint} ·{" "}
                      {option.roomCategoryName || "Zimmerkategorie"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-muted">
                    Reihenfolge
                    <select
                      className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm font-semibold text-navy"
                      value={index + 1}
                      onChange={(e) => {
                        const to = Number(e.target.value) - 1;
                        if (!Number.isNaN(to)) onReorder(index, to);
                      }}
                    >
                      {options.map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                          {PDF_ORDER_HINTS[i] ? ` — ${PDF_ORDER_HINTS[i]}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="rounded-lg border border-line px-2 py-1.5 text-xs font-semibold text-navy disabled:opacity-40"
                    disabled={index === 0}
                    onClick={() => onReorder(index, index - 1)}
                    title="Nach oben"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-line px-2 py-1.5 text-xs font-semibold text-navy disabled:opacity-40"
                    disabled={index >= options.length - 1}
                    onClick={() => onReorder(index, index + 1)}
                    title="Nach unten"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => onRemove(index)}
                  >
                    Entfernen
                  </button>
                </div>
              </div>
              <div className="mb-3 grid gap-3 md:grid-cols-2">
                <Field label="Zimmerkategorie">
                  <select
                    className={inputClass}
                    value={option.roomCategoryId}
                    onChange={(e) => {
                      const categoryId = e.target.value;
                      const rebuilt = emptyHotelOption(option.hotelId, roomCount, {
                        nights,
                        stayStartDate,
                        categoryId,
                        inquiry,
                      });
                      onChange(index, {
                        roomCategoryId: rebuilt.roomCategoryId,
                        roomCategoryName: rebuilt.roomCategoryName,
                        calculatedRoomPrices: rebuilt.calculatedRoomPrices,
                        roomPrices: rebuilt.roomPrices,
                        roomOccupancyLabels: rebuilt.roomOccupancyLabels,
                        manualPriceOverride: false,
                        breakfastMode: rebuilt.breakfastMode,
                        breakfastPerPersonNight: rebuilt.breakfastPerPersonNight,
                        boardLabel: rebuilt.boardLabel,
                        lunchPerPersonNight: rebuilt.lunchPerPersonNight,
                        dinnerPerPersonNight: rebuilt.dinnerPerPersonNight,
                      });
                    }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {(() => {
                const hotelName =
                  resolveHotelById(option.hotelId)?.name ?? option.hotelId;
                if (missingDates.length === 0 && !option.manualPriceOverride) {
                  return null;
                }
                if (option.manualPriceOverride && missingDates.length === 0) {
                  // Override set; engine may still have gaps — recompute without override flag
                  const engineGaps = getOfferHotelMissingRateDates(
                    { ...option, manualPriceOverride: false },
                    stayStartDate,
                    nights,
                  );
                  if (engineGaps.length === 0) return null;
                  return (
                    <div className="mb-3 rounded-xl border border-line bg-surface/50 px-3 py-2 text-sm text-muted">
                      Manueller Preis — Engine hätte fehlende Raten:{" "}
                      {engineGaps
                        .map((d) => formatMissingHotelRateMessage(hotelName, d))
                        .join(" ")}
                    </div>
                  );
                }
                return (
                  <div
                    className="mb-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-950"
                    role="alert"
                  >
                    <p className="font-bold">Fehlende Rate</p>
                    <ul className="mt-1 list-inside list-disc space-y-0.5">
                      {missingDates.map((d) => (
                        <li key={d}>{formatMissingHotelRateMessage(hotelName, d)}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-amber-900/80">
                      Zimmerpreise manuell eintragen, um die Lücke zu überschreiben und das PDF
                      erzeugen zu können — fehlende Nächte werden nicht als €0 berechnet.
                    </p>
                  </div>
                );
              })()}

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: roomCount }, (_, roomIndex) => (
                  <div
                    key={roomIndex}
                    className="rounded-lg border border-line bg-surface/40 p-3"
                  >
                    <p className="text-sm font-semibold text-navy">
                      Zimmer {roomIndex + 1}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {roomOccupancyLabels[roomIndex]}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      Berechnet (Engine):{" "}
                      <span className="font-semibold text-navy">
                        {pricingIncomplete
                          ? "—"
                          : formatEuroDe(calculatedPrices[roomIndex] ?? 0)}
                      </span>
                    </p>
                    <Field label="Angebotspreis (€)">
                      <input
                        type="number"
                        min={0}
                        className={inputClass}
                        value={offerPrices[roomIndex] ?? 0}
                        onChange={(e) => {
                          const next = [...offerPrices];
                          next[roomIndex] = Math.max(0, Number(e.target.value) || 0);
                          onChange(index, {
                            calculatedRoomPrices: calculatedPrices,
                            roomPrices: next,
                            roomOccupancyLabels,
                            manualPriceOverride: true,
                          });
                        }}
                      />
                    </Field>
                    {pricingIncomplete ? (
                      <p className="mt-1 text-xs font-semibold text-amber-800">
                        Fehlende Rate
                      </p>
                    ) : null}
                    {!pricingIncomplete &&
                    overridden &&
                    (offerPrices[roomIndex] ?? 0) !==
                      (calculatedPrices[roomIndex] ?? 0) ? (
                      <p className="mt-1 text-xs font-medium text-brand-cta">
                        Override aktiv
                      </p>
                    ) : null}
                  </div>
                ))}
                <div className="flex flex-col justify-end gap-2 md:col-span-2 lg:col-span-1">
                  {overridden && !pricingIncomplete ? (
                    <button
                      type="button"
                      className="rounded-xl border border-line px-3 py-2 text-sm font-semibold text-navy hover:border-brand-cta/40"
                      onClick={() =>
                        onChange(index, {
                          calculatedRoomPrices: calculatedPrices,
                          roomPrices: [...calculatedPrices],
                          manualPriceOverride: false,
                        })
                      }
                    >
                      Auf Berechnung zurücksetzen
                    </button>
                  ) : null}
                </div>

                <Field label="Verpflegung (meal_plan)">
                  <select
                    className={inputClass}
                    value={option.mealPlan ?? "breakfast"}
                    onChange={(e) => {
                      const mealPlan = e.target.value as OfferMealPlanCode;
                      onChange(index, {
                        mealPlan,
                        boardLabel: labelOfferMealPlan(mealPlan, "de"),
                        breakfastMode:
                          mealPlan === "breakfast_optional"
                            ? "optional"
                            : option.breakfastMode === "priced"
                              ? "priced"
                              : "included",
                      });
                    }}
                  >
                    {(
                      [
                        ["breakfast", "Frühstück"],
                        ["breakfast_optional", "Frühstück (optional)"],
                        ["half_board", "Halbpension"],
                        ["full_board", "Vollpension"],
                        ["room_only", "Nur Übernachtung"],
                        ["all_inclusive", "All Inclusive"],
                      ] as const
                    ).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-muted">
                    Gespeichert als Code (z.&nbsp;B. breakfast) — PDF übersetzt automatisch.
                  </p>
                </Field>
                <Field label="Frühstück">
                  <select
                    className={inputClass}
                    value={option.breakfastMode ?? "included"}
                    onChange={(e) =>
                      onChange(index, {
                        breakfastMode: e.target.value as OfferHotelOption["breakfastMode"],
                      })
                    }
                  >
                    <option value="included">Inklusive</option>
                    <option value="optional">Optional</option>
                    <option value="priced">Mit Preis</option>
                  </select>
                </Field>
                {(option.breakfastMode === "optional" ||
                  option.breakfastMode === "priced") && (
                  <Field label="Frühstück €/P/N">
                    <input
                      type="number"
                      className={inputClass}
                      value={option.breakfastPerPersonNight ?? 0}
                      onChange={(e) =>
                        onChange(index, {
                          breakfastPerPersonNight: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </Field>
                )}
                <Field label="Mittag €/P/N">
                  <input
                    type="number"
                    className={inputClass}
                    value={option.lunchPerPersonNight}
                    onChange={(e) =>
                      onChange(index, { lunchPerPersonNight: Number(e.target.value) || 0 })
                    }
                  />
                </Field>
                <Field label="Abend €/P/N">
                  <input
                    type="number"
                    className={inputClass}
                    value={option.dinnerPerPersonNight}
                    onChange={(e) =>
                      onChange(index, { dinnerPerPersonNight: Number(e.target.value) || 0 })
                    }
                  />
                </Field>
              </div>
              <div className="mt-3 space-y-1 rounded-lg border border-line bg-white px-3 py-2 text-sm">
                <p className="text-muted">
                  Berechnet gesamt:{" "}
                  <span className="font-semibold text-navy">
                    {pricingIncomplete ? "—" : formatEuroDe(calculatedTotal)}
                  </span>
                </p>
                <p className="font-semibold text-navy">
                  Angebotspreis gesamt (PDF):{" "}
                  {pricingIncomplete && !overridden ? "—" : formatEuroDe(offerTotal)}
                </p>
                <p className="text-muted">
                  Durchschnitt pro Person{" "}
                  <span className="font-semibold text-brand-green">
                    {pricingIncomplete && !overridden
                      ? "—"
                      : formatEuroDe(avgPerPerson(offerTotal, adults, children))}
                  </span>
                  <span className="text-xs"> ({adults + children} zahlende Personen)</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
