"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import {
  emptyHotelCatalogFields,
  type HotelCatalogFields,
} from "@/lib/hotel-catalog";
import { HOTEL_MEAL_PLANS, type HotelMealPlanId } from "@/lib/hotel-meal-plans";

const inputClass = "w-full rounded-lg border border-line px-3 py-2 text-sm";

function SectionCard({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-2xl border border-line bg-white p-5"
    >
      <h2 className="text-lg font-bold text-navy">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

type HotelCatalogFormProps = {
  initial: HotelCatalogFields;
  /** When set, city cannot be changed (hotel already exists in a city). */
  lockCity?: boolean;
  submitLabel: string;
  saving?: boolean;
  onSubmit: (fields: HotelCatalogFields) => Promise<void> | void;
};

export function HotelCatalogForm({
  initial,
  lockCity = false,
  submitLabel,
  saving = false,
  onSubmit,
}: HotelCatalogFormProps) {
  const [fields, setFields] = useState<HotelCatalogFields>(initial);

  function updateImage(index: number, value: string) {
    setFields((f) => {
      const images = [...f.images];
      images[index] = value;
      return { ...f, images };
    });
  }

  function addImage() {
    setFields((f) => ({ ...f, images: [...f.images, ""] }));
  }

  function removeImage(index: number) {
    setFields((f) => {
      const images = f.images.filter((_, i) => i !== index);
      return { ...f, images: images.length ? images : [""] };
    });
  }

  function toggleMealPlan(id: HotelMealPlanId) {
    setFields((f) => {
      const has = f.mealPlans.includes(id);
      const mealPlans = has
        ? f.mealPlans.filter((plan) => plan !== id)
        : [...f.mealPlans, id];
      return { ...f, mealPlans: mealPlans.length ? mealPlans : ["room_only"] };
    });
  }

  return (
    <form
      className="mx-auto grid max-w-4xl gap-6"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit({
          ...fields,
          name: fields.name.trim(),
          images: fields.images.map((src) => src.trim()).filter(Boolean),
        });
      }}
    >
      <SectionCard
        id="general"
        title="Allgemeine Informationen"
        description="Name, Stadt, Sterne, Entfernung und Beschreibung."
      >
        <p className="text-sm text-muted md:col-span-2">
          Hotels werden einmal angelegt und können für Gruppenumrah und individuelle Umrah
          wiederverwendet werden.
        </p>

        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium">Hotelname</span>
          <input
            className={inputClass}
            required
            value={fields.name}
            onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Stadt</span>
          <select
            className={inputClass}
            value={fields.city}
            disabled={lockCity}
            onChange={(e) =>
              setFields((f) => ({
                ...f,
                city: e.target.value === "medina" ? "medina" : "makkah",
              }))
            }
          >
            <option value="medina">Medina</option>
            <option value="makkah">Makkah</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Sterne</span>
          <input
            type="number"
            min={1}
            max={5}
            className={inputClass}
            value={fields.stars}
            onChange={(e) =>
              setFields((f) => ({
                ...f,
                stars: Math.max(1, Math.min(5, Number(e.target.value) || 1)),
              }))
            }
          />
        </label>

        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium">
            Entfernung zum Haram / zur Prophetenmoschee (Gehminuten)
          </span>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={fields.walkingMinutes}
            onChange={(e) =>
              setFields((f) => ({
                ...f,
                walkingMinutes: Math.max(0, Number(e.target.value) || 0),
              }))
            }
          />
          <span className="mt-1 block text-xs text-muted">
            Medina → Prophetenmoschee · Makkah → Haram
          </span>
        </label>

        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium">Beschreibung</span>
          <textarea
            className={`min-h-28 ${inputClass}`}
            value={fields.description}
            onChange={(e) => setFields((f) => ({ ...f, description: e.target.value }))}
            placeholder="Kurzbeschreibung für Angebote und Detailseiten"
          />
        </label>

        <fieldset className="md:col-span-2">
          <legend className="mb-2 text-sm font-medium">Verfügbare Verpflegungsarten (Katalog)</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {HOTEL_MEAL_PLANS.map((plan) => {
              const checked = fields.mealPlans.includes(plan.id);
              return (
                <label
                  key={plan.id}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface/40 px-3 py-2.5 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMealPlan(plan.id)}
                  />
                  {plan.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium">Interne Notizen</span>
          <textarea
            className={`min-h-20 ${inputClass}`}
            value={fields.notes}
            onChange={(e) => setFields((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Nur für das Team"
          />
        </label>

        <label className="inline-flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={fields.active}
            onChange={(e) => setFields((f) => ({ ...f, active: e.target.checked }))}
          />
          <span className="font-medium">Aktiv</span>
          <span className="text-muted">
            (inaktive Hotels bleiben im Admin, sind aber nicht neu auswählbar)
          </span>
        </label>
      </SectionCard>

      <SectionCard
        id="photos"
        title="Fotos"
        description="Bild-URLs / Pfade für Katalog und Angebots-PDF."
      >
        <div className="md:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Hotelbilder</span>
            <button
              type="button"
              onClick={addImage}
              className="text-sm font-semibold text-brand-cta"
            >
              + Bild hinzufügen
            </button>
          </div>
          <div className="space-y-3">
            {fields.images.map((src, index) => (
              <div
                key={`img-${index}`}
                className="flex flex-col gap-2 sm:flex-row sm:items-start"
              >
                <input
                  className={inputClass}
                  placeholder="/brand/... oder https://..."
                  value={src}
                  onChange={(e) => updateImage(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm text-muted hover:text-navy"
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>
          {fields.images[0]?.trim() ? (
            <div className="relative mt-3 aspect-[16/10] max-w-md overflow-hidden rounded-xl border border-line">
              <Image
                src={fields.images[0].trim()}
                alt={fields.name || "Hotel"}
                fill
                className="object-cover"
                sizes="480px"
                unoptimized={fields.images[0].startsWith("http")}
              />
            </div>
          ) : null}
        </div>
      </SectionCard>

      <button
        type="submit"
        disabled={saving || !fields.name.trim()}
        className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Speichern…" : submitLabel}
      </button>
    </form>
  );
}

export { emptyHotelCatalogFields };
