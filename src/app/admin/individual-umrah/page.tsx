"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_INDIVIDUAL_UMRAH_CMS,
  type IndividualUmrahCmsAirport,
  type IndividualUmrahCmsConfig,
  type IndividualUmrahCmsService,
  type LocalizedString,
} from "@/data/individual-umrah-cms";
import {
  getIndividualUmrahCms,
  writeIndividualUmrahCms,
} from "@/lib/individual-umrah-cms-store";
import {
  INDIVIDUAL_UMRAH_FUTURE_FEATURES,
  INDIVIDUAL_UMRAH_V1_FEATURES,
} from "@/lib/individual-umrah-architecture";
import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";

const LOCALE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  ar: "العربية",
  bs: "Bosanski",
  tr: "Türkçe",
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-navy">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <input
        type="number"
        className="mt-1 w-full rounded-lg border border-line px-3 py-2"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const className = "mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm";
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {multiline ? (
        <textarea className={className} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={className} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export default function AdminIndividualUmrahCmsPage() {
  const [config, setConfig] = useState<IndividualUmrahCmsConfig>(DEFAULT_INDIVIDUAL_UMRAH_CMS);
  const [locale, setLocale] = useState<Locale>("de");
  const [toast, setToast] = useState<string | null>(null);
  const [blockedInput, setBlockedInput] = useState("");

  useEffect(() => {
    setConfig(getIndividualUmrahCms());
  }, []);

  function patch(partial: Partial<IndividualUmrahCmsConfig>) {
    setConfig((c) => ({ ...c, ...partial }));
  }

  function setLocalized(
    path: "hero.title" | "hero.subtitle" | "cta.label" | "cta.hint" | `copy.${keyof IndividualUmrahCmsConfig["copy"]}`,
    value: string,
  ) {
    setConfig((c) => {
      if (path === "hero.title") {
        return { ...c, hero: { ...c.hero, title: { ...c.hero.title, [locale]: value } } };
      }
      if (path === "hero.subtitle") {
        return { ...c, hero: { ...c.hero, subtitle: { ...c.hero.subtitle, [locale]: value } } };
      }
      if (path === "cta.label") {
        return { ...c, cta: { ...c.cta, label: { ...c.cta.label, [locale]: value } } };
      }
      if (path === "cta.hint") {
        return { ...c, cta: { ...c.cta, hint: { ...c.cta.hint, [locale]: value } } };
      }
      const copyKey = path.replace("copy.", "") as keyof IndividualUmrahCmsConfig["copy"];
      return {
        ...c,
        copy: {
          ...c.copy,
          [copyKey]: { ...c.copy[copyKey], [locale]: value } as LocalizedString,
        },
      };
    });
  }

  function updateAirport(id: string, partial: Partial<IndividualUmrahCmsAirport>) {
    setConfig((c) => ({
      ...c,
      airports: c.airports.map((a) => (a.id === id ? { ...a, ...partial } : a)),
    }));
  }

  function updateAirportLabel(id: string, value: string) {
    setConfig((c) => ({
      ...c,
      airports: c.airports.map((a) =>
        a.id === id ? { ...a, labels: { ...a.labels, [locale]: value } } : a,
      ),
    }));
  }

  function addAirport() {
    const id = `airport_${Date.now()}`;
    setConfig((c) => ({
      ...c,
      airports: [
        ...c.airports,
        {
          id,
          code: "XXX",
          enabled: true,
          sortOrder: c.airports.length,
          labels: Object.fromEntries(locales.map((l) => [l, ""])) as LocalizedString,
        },
      ],
    }));
  }

  function removeAirport(id: string) {
    setConfig((c) => ({ ...c, airports: c.airports.filter((a) => a.id !== id) }));
  }

  function updateService(id: string, partial: Partial<IndividualUmrahCmsService>) {
    setConfig((c) => ({
      ...c,
      services: c.services.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    }));
  }

  function updateServiceLabel(id: string, value: string) {
    setConfig((c) => ({
      ...c,
      services: c.services.map((s) =>
        s.id === id ? { ...s, labels: { ...s.labels, [locale]: value } } : s,
      ),
    }));
  }

  function addBlockedDate() {
    const date = blockedInput.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    setConfig((c) => ({
      ...c,
      dateAvailability: {
        ...c.dateAvailability,
        blockedDates: Array.from(new Set([...c.dateAvailability.blockedDates, date])).sort(),
      },
    }));
    setBlockedInput("");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Individuelle Umrah — CMS</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            §42 — Flughäfen, Limits, Nächte, Monate, Verfügbarkeit, Hero, CTA, Services und
            Übersetzungen. Demo-Speicherung im Browser (Backend folgt).
          </p>
        </div>
        <Link
          href="/admin/inquiries/individual-umrah"
          className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:border-brand-orange/40"
        >
          Anfragen ansehen →
        </Link>
      </div>

      {toast ? (
        <p className="mb-4 rounded-lg bg-brand-green-soft px-3 py-2 text-sm text-brand-green">{toast}</p>
      ) : null}

      <div className="mb-6 rounded-2xl border border-line bg-[#F7F9FB] p-4 text-sm text-navy">
        <p className="font-bold">V1-Fokus (spec 44)</p>
        <p className="mt-1 text-muted">
          Hotelkatalog + Preisberechnung · manuelle Flüge · Airlines-Katalog · Add-ons · PDF
          erzeugen. Erweiterungen (weitere Städte, E-Mail-Versand, Online-Annahme, Zahlung,
          Lieferanten-APIs) sind architektonisch vorbereitet — siehe{" "}
          <code className="text-xs">individual-umrah-architecture.ts</code> — und werden nicht
          ohne expliziten Auftrag gebaut.
        </p>
        <p className="mt-2 text-[11px] text-muted">
          V1: {INDIVIDUAL_UMRAH_V1_FEATURES.length} Bausteine · Später:{" "}
          {INDIVIDUAL_UMRAH_FUTURE_FEATURES.join(", ")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/hotels" className="font-semibold text-brand-cta">
            Hotels →
          </Link>
          <Link href="/admin/airlines" className="font-semibold text-brand-cta">
            Airlines →
          </Link>
          <Link
            href="/admin/inquiries/individual-umrah"
            className="font-semibold text-brand-cta"
          >
            Anfragen / Angebote →
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              locale === l
                ? "border-navy bg-navy text-white"
                : "border-line bg-white text-navy hover:border-navy/30"
            }`}
          >
            {LOCALE_LABELS[l]}
          </button>
        ))}
      </div>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          writeIndividualUmrahCms(config);
          setToast("Individuelle Umrah-Einstellungen gespeichert (Demo).");
        }}
      >
        <Section
          title="Abflughäfen"
          description="Verfügbare Airports, IATA-Codes und Labels (Mehrfachauswahl im Formular)."
        >
          <div className="space-y-3">
            {config.airports
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((airport) => (
                <div
                  key={airport.id}
                  className="grid gap-3 rounded-xl border border-line p-3 sm:grid-cols-2 lg:grid-cols-5"
                >
                  <label className="flex items-center gap-2 text-sm font-medium lg:col-span-1">
                    <input
                      type="checkbox"
                      checked={airport.enabled}
                      onChange={(e) => updateAirport(airport.id, { enabled: e.target.checked })}
                    />
                    Aktiv
                  </label>
                  <TextField
                    label="Code (IATA)"
                    value={airport.code}
                    onChange={(code) => updateAirport(airport.id, { code: code.toUpperCase() })}
                  />
                  <TextField
                    label={`Label (${locale})`}
                    value={airport.labels[locale]}
                    onChange={(v) => updateAirportLabel(airport.id, v)}
                  />
                  <NumberField
                    label="Reihenfolge"
                    value={airport.sortOrder}
                    onChange={(sortOrder) => updateAirport(airport.id, { sortOrder })}
                    min={0}
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeAirport(airport.id)}
                      className="rounded-lg border border-line px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Entfernen
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <button
            type="button"
            onClick={addAirport}
            className="rounded-xl border border-dashed border-line px-4 py-2 text-sm font-semibold text-navy hover:border-navy/40"
          >
            + Flughafen hinzufügen
          </button>
        </Section>

        <Section title="Reisende — Min / Max" description="Grenzen für Erwachsene, Kinder und Babys.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField
              label="Erwachsene min"
              value={config.travellers.adultsMin}
              min={1}
              onChange={(adultsMin) => patch({ travellers: { ...config.travellers, adultsMin } })}
            />
            <NumberField
              label="Erwachsene max"
              value={config.travellers.adultsMax}
              min={1}
              onChange={(adultsMax) => patch({ travellers: { ...config.travellers, adultsMax } })}
            />
            <NumberField
              label="Kinder min"
              value={config.travellers.childrenMin}
              min={0}
              onChange={(childrenMin) => patch({ travellers: { ...config.travellers, childrenMin } })}
            />
            <NumberField
              label="Kinder max"
              value={config.travellers.childrenMax}
              min={0}
              onChange={(childrenMax) => patch({ travellers: { ...config.travellers, childrenMax } })}
            />
            <NumberField
              label="Babys min"
              value={config.travellers.infantsMin}
              min={0}
              onChange={(infantsMin) => patch({ travellers: { ...config.travellers, infantsMin } })}
            />
            <NumberField
              label="Babys max"
              value={config.travellers.infantsMax}
              min={0}
              onChange={(infantsMax) => patch({ travellers: { ...config.travellers, infantsMax } })}
            />
          </div>
        </Section>

        <Section title="Zimmer-Optionen" description="Presets (1–5) sowie 6+ Minimum und Maximum.">
          <TextField
            label="Presets (kommagetrennt)"
            value={config.rooms.presets.join(", ")}
            onChange={(raw) => {
              const presets = raw
                .split(/[,\s]+/)
                .map((n) => Number(n))
                .filter((n) => Number.isInteger(n) && n > 0);
              patch({ rooms: { ...config.rooms, presets } });
            }}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              label="6+ Minimum"
              value={config.rooms.sixPlusMin}
              min={1}
              onChange={(sixPlusMin) => patch({ rooms: { ...config.rooms, sixPlusMin } })}
            />
            <NumberField
              label="Maximum"
              value={config.rooms.max}
              min={1}
              onChange={(max) => patch({ rooms: { ...config.rooms, max } })}
            />
          </div>
        </Section>

        <Section title="Nächte — Min / Max" description="Pro ausgewählter Stadt.">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              label="Minimum pro Stadt"
              value={config.nights.minPerCity}
              min={1}
              onChange={(minPerCity) => patch({ nights: { ...config.nights, minPerCity } })}
            />
            <NumberField
              label="Maximum pro Stadt"
              value={config.nights.maxPerCity}
              min={1}
              onChange={(maxPerCity) => patch({ nights: { ...config.nights, maxPerCity } })}
            />
          </div>
        </Section>

        <Section title="Monate & Datumsverfügbarkeit">
          <NumberField
            label="Monate voraus im Dropdown"
            value={config.monthsAhead}
            min={1}
            max={24}
            onChange={(monthsAhead) => patch({ monthsAhead })}
          />
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={config.dateAvailability.enabled}
              onChange={(e) =>
                patch({
                  dateAvailability: { ...config.dateAvailability, enabled: e.target.checked },
                })
              }
            />
            Datumssperren aktiv (blocked dates)
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <TextField
              label="Gesperrtes Datum (YYYY-MM-DD)"
              value={blockedInput}
              onChange={setBlockedInput}
            />
            <button
              type="button"
              onClick={addBlockedDate}
              className="rounded-lg border border-line px-3 py-2 text-sm font-semibold"
            >
              Hinzufügen
            </button>
          </div>
          {config.dateAvailability.blockedDates.length ? (
            <ul className="flex flex-wrap gap-2">
              {config.dateAvailability.blockedDates.map((d) => (
                <li key={d}>
                  <button
                    type="button"
                    onClick={() =>
                      patch({
                        dateAvailability: {
                          ...config.dateAvailability,
                          blockedDates: config.dateAvailability.blockedDates.filter((x) => x !== d),
                        },
                      })
                    }
                    className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium hover:border-red-300 hover:text-red-600"
                  >
                    {d} ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Keine gesperrten Daten.</p>
          )}
        </Section>

        <Section title="Hero — Text & Bild">
          <TextField
            label="Bild-URL / Pfad"
            value={config.hero.imageUrl}
            onChange={(imageUrl) => patch({ hero: { ...config.hero, imageUrl } })}
          />
          <TextField
            label={`Titel (${locale})`}
            value={config.hero.title[locale]}
            onChange={(v) => setLocalized("hero.title", v)}
          />
          <TextField
            label={`Untertitel (${locale})`}
            value={config.hero.subtitle[locale]}
            onChange={(v) => setLocalized("hero.subtitle", v)}
            multiline
          />
        </Section>

        <Section title="CTA">
          <TextField
            label={`Button-Text (${locale})`}
            value={config.cta.label[locale]}
            onChange={(v) => setLocalized("cta.label", v)}
          />
          <TextField
            label={`Hinweis unter CTA (${locale})`}
            value={config.cta.hint[locale]}
            onChange={(v) => setLocalized("cta.hint", v)}
            multiline
            rows={2}
          />
        </Section>

        <Section title="Service-Icons & Texte" description="Hero-/Services-Band auf der Seite.">
          {config.services.map((service) => (
            <div key={service.id} className="grid gap-3 rounded-xl border border-line p-3 sm:grid-cols-3">
              <TextField
                label="Icon-Key"
                value={service.iconKey}
                onChange={(iconKey) => updateService(service.id, { iconKey })}
              />
              <TextField
                label={`Text (${locale})`}
                value={service.labels[locale]}
                onChange={(v) => updateServiceLabel(service.id, v)}
              />
              <p className="self-end text-xs text-muted">ID: {service.id}</p>
            </div>
          ))}
        </Section>

        <Section title="Übersetzungen / Formulartexte" description={`Aktive Sprache: ${LOCALE_LABELS[locale]}`}>
          <TextField
            label="Formulartitel"
            value={config.copy.formTitle[locale]}
            onChange={(v) => setLocalized("copy.formTitle", v)}
          />
          <TextField
            label="Info-Box"
            value={config.copy.infoBox[locale]}
            onChange={(v) => setLocalized("copy.infoBox", v)}
            multiline
          />
          <TextField
            label="Erfolg — Titel"
            value={config.copy.successTitle[locale]}
            onChange={(v) => setLocalized("copy.successTitle", v)}
          />
          <TextField
            label="Erfolg — Text"
            value={config.copy.successBody[locale]}
            onChange={(v) => setLocalized("copy.successBody", v)}
            multiline
          />
        </Section>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-brand-cta px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
          >
            Speichern
          </button>
          <button
            type="button"
            onClick={() => {
              setConfig(DEFAULT_INDIVIDUAL_UMRAH_CMS);
              writeIndividualUmrahCms(DEFAULT_INDIVIDUAL_UMRAH_CMS);
              setToast("Auf Standardwerte zurückgesetzt.");
            }}
            className="rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold"
          >
            Zurücksetzen
          </button>
        </div>
      </form>
    </div>
  );
}
