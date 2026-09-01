"use client";

import {
  DEFAULT_OFFER_EXCLUDED_ITEMS,
  DEFAULT_OFFER_IMPORTANT_NOTES,
  DEFAULT_OFFER_INCLUDED_ITEMS,
} from "@/lib/individual-umrah-offer-defaults";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-cta";

function TermsListEditor({
  title,
  description,
  items,
  onChange,
  onReset,
}: {
  title: string;
  description: string;
  items: string[];
  onChange: (items: string[]) => void;
  onReset: () => void;
}) {
  function updateItem(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, ""]);
  }

  return (
    <div className="rounded-xl border border-line p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-navy">{title}</h3>
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-brand-cta"
          onClick={onReset}
        >
          Vorlage zurücksetzen
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <span className="mt-2 text-sm font-bold text-brand-green" aria-hidden>
              ✓
            </span>
            <input
              className={inputClass}
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="Aufzählungstext"
            />
            <button
              type="button"
              className="shrink-0 text-xs text-red-600"
              onClick={() => removeItem(index)}
            >
              Entfernen
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-3 text-xs font-semibold text-brand-cta"
        onClick={addItem}
      >
        + Zeile hinzufügen
      </button>
    </div>
  );
}

export function OfferTermsEditor({
  includedItems,
  excludedItems,
  importantNotes,
  onChange,
}: {
  includedItems: string[];
  excludedItems: string[];
  importantNotes: string[];
  onChange: (patch: {
    includedItems?: string[];
    excludedItems?: string[];
    importantNotes?: string[];
  }) => void;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-navy">Hinweise · Enthalten / Nicht inkludiert</h2>
        <p className="mt-1 text-xs text-muted">
          Vorlagen für das Kunden-PDF. Aufzählungen pro Angebot anpassen; mit „Vorlage
          zurücksetzen“ den Standardtext wiederherstellen.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <TermsListEditor
          title="Im Preis enthalten"
          description="Mit grünen Häkchen auf dem PDF."
          items={includedItems}
          onChange={(items) => onChange({ includedItems: items })}
          onReset={() => onChange({ includedItems: [...DEFAULT_OFFER_INCLUDED_ITEMS] })}
        />
        <TermsListEditor
          title="Nicht inkludiert"
          description="Leistungen, die nicht im Angebotspreis enthalten sind."
          items={excludedItems}
          onChange={(items) => onChange({ excludedItems: items })}
          onReset={() => onChange({ excludedItems: [...DEFAULT_OFFER_EXCLUDED_ITEMS] })}
        />
        <TermsListEditor
          title="Wichtige Hinweise"
          description="Abschließende Hinweise auf dem PDF."
          items={importantNotes}
          onChange={(items) => onChange({ importantNotes: items })}
          onReset={() => onChange({ importantNotes: [...DEFAULT_OFFER_IMPORTANT_NOTES] })}
        />
      </div>
    </section>
  );
}
