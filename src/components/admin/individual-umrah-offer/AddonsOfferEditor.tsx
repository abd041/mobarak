"use client";

import { BookUser, IdCard, TrainFront } from "lucide-react";
import type { IndividualUmrahInquiry } from "@/lib/individual-umrah-inquiry";
import type {
  OfferAddonOption,
  OfferAddonPdfDisplay,
  OfferAddonPricingType,
} from "@/lib/individual-umrah-offer";
import { emptyCustomAddon } from "@/lib/individual-umrah-offer-defaults";
import {
  formatAddonPriceLabelDe,
  formatAddonPricingTypeDe,
} from "@/lib/individual-umrah-offer-pricing";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-cta";

const PRICING_TYPE_OPTIONS: { value: OfferAddonPricingType; label: string }[] = [
  { value: "per_person", label: "Pro Person" },
  { value: "per_booking", label: "Pro Buchung" },
  { value: "per_room", label: "Pro Zimmer" },
];

const PDF_DISPLAY_OPTIONS: {
  value: OfferAddonPdfDisplay;
  label: string;
  hint: string;
}[] = [
  {
    value: "selected",
    label: "Im Angebot ausgewählt",
    hint: "Als normale Zusatzleistung auf dem PDF",
  },
  {
    value: "optional",
    label: "Als optional anzeigen",
    hint: "Nicht ausgewählt — auf dem PDF als optionale Extra sichtbar",
  },
  {
    value: "hidden",
    label: "Im PDF ausblenden",
    hint: "Erscheint nicht auf dem Kunden-PDF",
  },
];

function AddonIcon({ id }: { id: string }) {
  if (id === "city_transfer") {
    return <TrainFront className="h-5 w-5" strokeWidth={1.75} aria-hidden />;
  }
  if (id === "visa") {
    return <IdCard className="h-5 w-5" strokeWidth={1.75} aria-hidden />;
  }
  return <BookUser className="h-5 w-5" strokeWidth={1.75} aria-hidden />;
}

export function AddonsOfferEditor({
  inquiry,
  addons,
  sectionNumber,
  onChange,
}: {
  inquiry: IndividualUmrahInquiry;
  addons: OfferAddonOption[];
  sectionNumber: number;
  onChange: (addons: OfferAddonOption[]) => void;
}) {
  const interested = new Set(inquiry.offer_prefs?.addons ?? []);

  function updateAddon(index: number, patch: Partial<OfferAddonOption>) {
    onChange(
      addons.map((a, i) => {
        if (i !== index) return a;
        const next = { ...a, ...patch };
        if (patch.pdfDisplay) {
          next.enabled = patch.pdfDisplay === "selected";
        }
        return next;
      }),
    );
  }

  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-navy">
            {sectionNumber}. Zusatzleistungen
          </h2>
          <p className="mt-1 text-xs text-muted">
            Standardmäßig drei PDF-Karten (Zug · Führung · Visum). Pro Leistung:{" "}
            <strong>ausgewählt</strong>, <strong>optional anzeigen</strong> oder{" "}
            <strong>ausblenden</strong>.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-navy hover:border-brand-cta/50"
          onClick={() =>
            onChange([
              ...addons,
              emptyCustomAddon({
                title: "Neue Leistung",
                pricingType: "per_person",
                price: 0,
                pdfDisplay: "selected",
              }),
            ])
          }
        >
          + Eigene Leistung
        </button>
      </div>

      <div className="space-y-4">
        {addons.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface/30 px-4 py-6 text-center text-sm text-muted">
            Noch keine Zusatzleistungen. Katalog-Defaults aus einem neuen Angebot nutzen oder
            eine eigene Leistung hinzufügen.
          </p>
        ) : null}

        {addons.map((addon, index) => {
          const customerAsked = interested.has(addon.id);
          const isCatalog = ["city_transfer", "religious_medina", "visa"].includes(addon.id);
          const display = addon.pdfDisplay ?? (addon.enabled ? "selected" : "hidden");
          const fieldsActive = display !== "hidden";

          return (
            <div
              key={addon.id}
              className={`rounded-xl border p-4 ${
                display === "hidden"
                  ? "border-line bg-surface/30"
                  : display === "optional"
                    ? "border-dashed border-brand-cta/40 bg-[#F7FAFD]"
                    : "border-line bg-white"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-[#F7FAFD] text-[#1E5A9C]"
                    title={
                      addon.id === "city_transfer" ? "Zugtransfer (kein Bus)" : undefined
                    }
                  >
                    <AddonIcon id={addon.id} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy">
                      {addon.title || "Zusatzleistung"}
                    </p>
                    {customerAsked ? (
                      <p className="mt-1 text-xs font-medium text-brand-cta">
                        Vom Kunden in der Anfrage gewählt
                      </p>
                    ) : isCatalog ? (
                      <p className="mt-1 text-xs text-muted">Nicht vom Kunden gewählt</p>
                    ) : (
                      <p className="mt-1 text-xs text-muted">Eigene Leistung</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 rounded-xl border border-brand-green/30 bg-brand-green-soft px-3 py-2">
                    <span className="text-xs font-semibold text-brand-green">Preis €</span>
                    <input
                      type="number"
                      min={0}
                      className="w-24 rounded-lg border border-line bg-white px-2 py-1.5 text-sm font-bold text-navy outline-none focus:border-brand-cta"
                      value={addon.price}
                      onChange={(e) =>
                        updateAddon(index, { price: Number(e.target.value) || 0 })
                      }
                      disabled={!fieldsActive}
                    />
                  </label>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => onChange(addons.filter((_, i) => i !== index))}
                  >
                    Entfernen
                  </button>
                </div>
              </div>

              <fieldset className="mt-3">
                <legend className="mb-1.5 text-sm font-medium text-navy">PDF-Anzeige</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {PDF_DISPLAY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-xl border px-3 py-2 text-sm ${
                        display === opt.value
                          ? "border-brand-cta bg-[#EEF5FB]"
                          : "border-line bg-white"
                      }`}
                    >
                      <span className="flex items-start gap-2">
                        <input
                          type="radio"
                          className="mt-0.5"
                          name={`addon-pdf-${addon.id}`}
                          checked={display === opt.value}
                          onChange={() => updateAddon(index, { pdfDisplay: opt.value })}
                        />
                        <span>
                          <span className="block font-semibold text-navy">{opt.label}</span>
                          <span className="mt-0.5 block text-[11px] text-muted">{opt.hint}</span>
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <label className="block text-sm md:col-span-2">
                  <span className="mb-1 block font-medium text-navy">Titel (PDF)</span>
                  <input
                    className={inputClass}
                    value={addon.title}
                    onChange={(e) => updateAddon(index, { title: e.target.value })}
                    placeholder={
                      addon.id === "city_transfer"
                        ? "Transfer Medina → Makkah"
                        : "Bezeichnung der Leistung"
                    }
                    disabled={!fieldsActive}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-navy">Preisart</span>
                  <select
                    className={inputClass}
                    value={addon.pricingType}
                    onChange={(e) =>
                      updateAddon(index, {
                        pricingType: e.target.value as OfferAddonPricingType,
                      })
                    }
                    disabled={!fieldsActive}
                  >
                    {PRICING_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <p className="rounded-lg bg-surface px-3 py-2 text-sm font-bold text-brand-green">
                  {formatAddonPriceLabelDe(addon)}
                </p>
                <p className="text-xs text-muted">
                  PDF-Einheit: {formatAddonPricingTypeDe(addon.pricingType)}
                </p>
              </div>

              <label className="mt-3 block text-sm">
                <span className="mb-1 block font-medium text-navy">Beschreibung (PDF)</span>
                <textarea
                  className={`${inputClass} min-h-[4.5rem] resize-y`}
                  value={addon.body}
                  onChange={(e) => updateAddon(index, { body: e.target.value })}
                  disabled={!fieldsActive}
                />
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );
}
