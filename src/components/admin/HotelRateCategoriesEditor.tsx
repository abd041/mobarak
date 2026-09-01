"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  HotelMealPricing,
  HotelRoomCategory,
  IndividualUmrahHotelRate,
} from "@/lib/individual-umrah-offer";
import {
  calculateRoomStayByNights,
  emptyHotelMealPricing,
  emptyHotelRoomCategory,
  formatHotelRateDateDe,
  getOverlappingHotelRatePeriodIds,
  hotelRatePeriodsOverlap,
  suggestNextHotelRatePeriod,
} from "@/lib/individual-umrah-hotel-rates-store";
import { formatEuroDe } from "@/lib/individual-umrah-offer-pricing";

const OVERLAP_WARNING = "This rate overlaps with an existing rate period.";

function formatPeriodRangeDe(validFrom: string, validUntil: string): string {
  const fmt = (iso: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || "—";
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}`;
  };
  return `${fmt(validFrom)} – ${fmt(validUntil)}`;
}

type HotelRateCategoriesEditorProps = {
  rate: IndividualUmrahHotelRate;
  onChange: (rate: IndividualUmrahHotelRate) => void;
};

function MealOverrideFields({
  meals,
  onChange,
}: {
  meals: HotelMealPricing;
  onChange: (meals: HotelMealPricing) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <label className="block text-xs">
        <span className="mb-1 block font-medium">Breakfast</span>
        <select
          className="w-full rounded-lg border border-line px-2 py-1.5 text-sm"
          value={meals.breakfastMode}
          onChange={(e) =>
            onChange({
              ...meals,
              breakfastMode: e.target.value as HotelMealPricing["breakfastMode"],
            })
          }
        >
          <option value="included">Included</option>
          <option value="optional">Optional</option>
          <option value="priced">Priced</option>
        </select>
      </label>
      <label className="block text-xs">
        <span className="mb-1 block font-medium">Breakfast €/P/N</span>
        <input
          type="number"
          min={0}
          disabled={meals.breakfastMode === "included"}
          className="w-full rounded-lg border border-line px-2 py-1.5 text-sm disabled:bg-surface disabled:opacity-60"
          value={meals.breakfastPerPersonNight}
          onChange={(e) =>
            onChange({
              ...meals,
              breakfastPerPersonNight: Math.max(0, Number(e.target.value) || 0),
            })
          }
        />
      </label>
      <label className="block text-xs">
        <span className="mb-1 block font-medium">Lunch €/P/N</span>
        <input
          type="number"
          min={0}
          className="w-full rounded-lg border border-line px-2 py-1.5 text-sm"
          value={meals.lunchPerPersonNight}
          onChange={(e) =>
            onChange({
              ...meals,
              lunchPerPersonNight: Math.max(0, Number(e.target.value) || 0),
            })
          }
        />
      </label>
      <label className="block text-xs">
        <span className="mb-1 block font-medium">Dinner €/P/N</span>
        <input
          type="number"
          min={0}
          className="w-full rounded-lg border border-line px-2 py-1.5 text-sm"
          value={meals.dinnerPerPersonNight}
          onChange={(e) =>
            onChange({
              ...meals,
              dinnerPerPersonNight: Math.max(0, Number(e.target.value) || 0),
            })
          }
        />
      </label>
    </div>
  );
}

export function HotelRateCategoriesEditor({ rate, onChange }: HotelRateCategoriesEditorProps) {
  const [selectedId, setSelectedId] = useState(rate.categories[0]?.id ?? "");
  const [previewDate, setPreviewDate] = useState("2026-10-12");
  const [previewNights, setPreviewNights] = useState(5);

  useEffect(() => {
    if (!rate.categories.some((c) => c.id === selectedId)) {
      setSelectedId(rate.categories[0]?.id ?? "");
    }
  }, [rate.categories, selectedId]);

  const selected = useMemo(
    () => rate.categories.find((c) => c.id === selectedId) ?? null,
    [rate.categories, selectedId],
  );

  const stayPreview = useMemo(
    () =>
      selected
        ? calculateRoomStayByNights(selected.periods, previewDate, previewNights)
        : null,
    [selected, previewDate, previewNights],
  );

  const overlappingIds = useMemo(
    () =>
      selected
        ? getOverlappingHotelRatePeriodIds(selected.periods)
        : new Set<string>(),
    [selected],
  );

  function patchCategory(categoryId: string, patch: Partial<HotelRoomCategory>) {
    onChange({
      ...rate,
      categories: rate.categories.map((c) => (c.id === categoryId ? { ...c, ...patch } : c)),
    });
  }

  function updatePeriod(
    categoryId: string,
    periodIndex: number,
    patch: Partial<HotelRoomCategory["periods"][number]>,
  ) {
    onChange({
      ...rate,
      categories: rate.categories.map((c) => {
        if (c.id !== categoryId) return c;
        return {
          ...c,
          periods: c.periods.map((p, i) => (i === periodIndex ? { ...p, ...patch } : p)),
        };
      }),
    });
  }

  return (
    <div className="grid gap-6">
      <section
        id="room-categories"
        className="scroll-mt-6 rounded-2xl border border-line bg-white p-5"
      >
        <h2 className="text-lg font-bold text-navy">Zimmerkategorien</h2>
        <p className="mt-1 text-sm text-muted">
          Kategorien wie Standard, Deluxe, Triple, Family — jede mit eigenen Preisperioden.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {rate.categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={
                c.id === selectedId
                  ? "rounded-full bg-navy px-3.5 py-1.5 text-sm font-semibold text-white"
                  : "rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-semibold text-navy hover:border-brand-cta/40"
              }
            >
              {c.name}
              {!c.active ? " (aus)" : ""}
            </button>
          ))}
          <button
            type="button"
            className="rounded-full border border-dashed border-brand-cta/40 px-3.5 py-1.5 text-sm font-semibold text-brand-cta"
            onClick={() => {
              const next = emptyHotelRoomCategory(
                `Zimmerkategorie ${rate.categories.length + 1}`,
                rate.categories.length,
              );
              onChange({ ...rate, categories: [...rate.categories, next] });
              setSelectedId(next.id);
            }}
          >
            + Kategorie hinzufügen
          </button>
        </div>

        {!selected ? (
          <p className="mt-4 rounded-xl border border-line bg-surface/50 px-4 py-6 text-center text-sm text-muted">
            Noch keine Zimmerkategorien. Standard, Deluxe oder eigene Kategorie anlegen.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Kategoriename</span>
              <input
                className="w-full rounded-lg border border-line bg-white px-3 py-2"
                value={selected.name}
                onChange={(e) => patchCategory(selected.id, { name: e.target.value })}
              />
            </label>
            <label className="inline-flex items-center gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={selected.active}
                onChange={(e) => patchCategory(selected.id, { active: e.target.checked })}
              />
              Aktiv
            </label>
            <button
              type="button"
              className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-40"
              disabled={rate.categories.length <= 1}
              onClick={() => {
                if (!window.confirm(`Kategorie „${selected.name}“ löschen?`)) return;
                const next = rate.categories.filter((c) => c.id !== selected.id);
                onChange({ ...rate, categories: next });
                setSelectedId(next[0]?.id ?? "");
              }}
            >
              Kategorie löschen
            </button>
          </div>
        )}
      </section>

      {selected ? (
        <section
          id="rate-periods"
          className="scroll-mt-6 rounded-2xl border border-line bg-white p-5"
        >
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-navy">Preisperioden</h2>
              <p className="mt-1 text-sm text-muted">
                Saisonale Zeiträume mit Wochentags- und Wochenendpreisen für{" "}
                <span className="font-semibold text-navy">{selected.name}</span> (
                {selected.periods.length}). Perioden dürfen sich nicht überschneiden.
              </p>
            </div>
            <button
              type="button"
              className="rounded-xl border border-brand-cta/30 bg-[#EEF5FB] px-3 py-2 text-sm font-semibold text-brand-cta"
              onClick={() =>
                patchCategory(selected.id, {
                  periods: [
                    ...selected.periods,
                    suggestNextHotelRatePeriod(selected.periods),
                  ],
                })
              }
            >
              + Preisperiode hinzufügen
            </button>
          </div>

          {overlappingIds.size > 0 ? (
            <div
              className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
              role="alert"
            >
              <p className="font-semibold">{OVERLAP_WARNING}</p>
              <p className="mt-1 text-amber-900/80">
                Überlappende Perioden führen zu falschen Berechnungen. Passe die Daten an,
                bevor du speicherst.
              </p>
            </div>
          ) : null}

          <div className="space-y-4">

              {selected.periods.length === 0 ? (
                <p className="rounded-xl border border-line bg-surface/50 px-3 py-6 text-center text-sm text-muted">
                  Noch keine Preisperioden für diese Kategorie.
                </p>
              ) : (
                selected.periods.map((period, index) => {
                  const overlaps = overlappingIds.has(period.id);
                  const conflictWith = overlaps
                    ? selected.periods.filter(
                        (other) =>
                          other.id !== period.id &&
                          hotelRatePeriodsOverlap(period, other),
                      )
                    : [];
                  return (
                  <div
                    key={period.id}
                    className={
                      overlaps
                        ? "rounded-xl border-2 border-amber-400 bg-amber-50/60 p-3"
                        : "rounded-xl border border-line bg-surface/30 p-3"
                    }
                  >
                    {overlaps ? (
                      <p className="mb-3 text-sm font-semibold text-amber-950" role="status">
                        {OVERLAP_WARNING}
                        {conflictWith.length > 0 ? (
                          <span className="mt-0.5 block font-normal text-amber-900/80">
                            Überschneidung mit:{" "}
                            {conflictWith
                              .map((o) =>
                                formatPeriodRangeDe(o.validFrom, o.validUntil),
                              )
                              .join(", ")}
                          </span>
                        ) : null}
                      </p>
                    ) : null}
                    <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:items-end">
                      <label className="block text-xs">
                        <span className="mb-1 block font-medium">Gültig von</span>
                        <input
                          type="date"
                          required
                          className="w-full rounded-lg border border-line bg-white px-2.5 py-2 text-sm"
                          value={period.validFrom}
                          onChange={(e) =>
                            updatePeriod(selected.id, index, { validFrom: e.target.value })
                          }
                        />
                      </label>
                      <label className="block text-xs">
                        <span className="mb-1 block font-medium">Gültig bis</span>
                        <input
                          type="date"
                          required
                          className="w-full rounded-lg border border-line bg-white px-2.5 py-2 text-sm"
                          value={period.validUntil}
                          onChange={(e) =>
                            updatePeriod(selected.id, index, { validUntil: e.target.value })
                          }
                        />
                      </label>
                      <label className="block text-xs">
                        <span className="mb-1 block font-medium">So–Do € / Nacht</span>
                        <input
                          type="number"
                          min={0}
                          className="w-full rounded-lg border border-line bg-white px-2.5 py-2 text-sm"
                          value={period.weekdayPricePerRoomNight}
                          onChange={(e) =>
                            updatePeriod(selected.id, index, {
                              weekdayPricePerRoomNight: Math.max(
                                0,
                                Number(e.target.value) || 0,
                              ),
                            })
                          }
                        />
                      </label>
                      <label className="block text-xs">
                        <span className="mb-1 block font-medium">Fr–Sa € / Nacht</span>
                        <input
                          type="number"
                          min={0}
                          className="w-full rounded-lg border border-line bg-white px-2.5 py-2 text-sm"
                          value={period.weekendPricePerRoomNight}
                          onChange={(e) =>
                            updatePeriod(selected.id, index, {
                              weekendPricePerRoomNight: Math.max(
                                0,
                                Number(e.target.value) || 0,
                              ),
                            })
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className="pb-2 text-xs font-semibold text-red-600"
                        onClick={() => {
                          if (!window.confirm("Diese Preisperiode löschen?")) return;
                          patchCategory(selected.id, {
                            periods: selected.periods.filter((_, i) => i !== index),
                          });
                        }}
                      >
                        Löschen
                      </button>
                    </div>

                    <div className="mt-3 border-t border-dashed border-line pt-3">
                      <label className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-navy">
                        <input
                          type="checkbox"
                          checked={period.mealOverrides != null}
                          onChange={(e) =>
                            updatePeriod(selected.id, index, {
                              mealOverrides: e.target.checked
                                ? emptyHotelMealPricing(rate.meals)
                                : null,
                            })
                          }
                        />
                        Mahlzeiten für diese Periode überschreiben
                      </label>
                      {period.mealOverrides ? (
                        <MealOverrideFields
                          meals={period.mealOverrides}
                          onChange={(meals) =>
                            updatePeriod(selected.id, index, { mealOverrides: meals })
                          }
                        />
                      ) : (
                        <p className="text-xs text-muted">
                          Nutzt die Hotel-Defaults unter Mahlzeiten.
                        </p>
                      )}
                    </div>
                  </div>
                  );
                })
              )}
            </div>

          <div className="mt-4 rounded-xl border border-dashed border-line bg-surface/30 p-4">
            <p className="text-sm font-semibold text-navy">
              Aufenthaltsvorschau · {selected.name}
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Check-in</span>
                <input
                  type="date"
                  className="rounded-lg border border-line bg-white px-3 py-2"
                  value={previewDate}
                  onChange={(e) => setPreviewDate(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Nächte</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  className="w-24 rounded-lg border border-line bg-white px-3 py-2"
                  value={previewNights}
                  onChange={(e) =>
                    setPreviewNights(Math.max(1, Math.min(30, Number(e.target.value) || 1)))
                  }
                />
              </label>
            </div>
            {stayPreview && stayPreview.nights.length > 0 ? (
              <div className="mt-3 space-y-1 text-sm text-navy">
                {!stayPreview.complete ? (
                  <div
                    className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-amber-950"
                    role="alert"
                  >
                    <p className="font-semibold">Missing rate</p>
                    {stayPreview.missingDates.map((d) => (
                      <p key={d} className="mt-0.5 text-xs">
                        No rate available for this category on {formatHotelRateDateDe(d)}.
                      </p>
                    ))}
                  </div>
                ) : null}
                <p>
                  {stayPreview.weekdayNights} Wochentagsnacht
                  {stayPreview.weekdayNights === 1 ? "" : "e"} ·{" "}
                  {stayPreview.weekendNights} Wochenendnacht
                  {stayPreview.weekendNights === 1 ? "" : "e"}
                </p>
                <p className="font-bold">
                  {stayPreview.complete
                    ? `Zimmeraufenthalt gesamt: ${formatEuroDe(stayPreview.total)}`
                    : "Zimmeraufenthalt gesamt: — (unvollständig)"}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Keine passenden Nächte / Perioden.</p>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
