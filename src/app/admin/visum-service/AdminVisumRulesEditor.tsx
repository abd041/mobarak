"use client";

import {
  createEmptyDocumentRule,
  createEmptyNoticeRule,
  createEmptyVisaTypeRule,
  type VisumDocumentRule,
  type VisumEntryMode,
  type VisumNoticeRule,
  type VisumRulesConfig,
  type VisumVisaTypeRule,
} from "@/data/visum-rules";
import type { LocalizedString } from "@/data/visum-cms";
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
    <section className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-5 shadow-sm">
      <h2 className="text-lg font-bold text-navy">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function LocalizedFields({
  label,
  value,
  onChange,
  multiline,
  rows = 2,
}: {
  label: string;
  value: LocalizedString;
  onChange: (next: LocalizedString) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div>
      {label ? <p className="mb-2 text-sm font-semibold text-navy">{label}</p> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {locales.map((loc) => (
          <label key={loc} className="block text-sm">
            <span className="text-muted">{LOCALE_LABELS[loc]}</span>
            {multiline ? (
              <textarea
                className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
                rows={rows}
                value={value[loc] ?? ""}
                onChange={(e) => onChange({ ...value, [loc]: e.target.value })}
              />
            ) : (
              <input
                className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
                value={value[loc] ?? ""}
                onChange={(e) => onChange({ ...value, [loc]: e.target.value })}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function VisaTypeEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: VisumVisaTypeRule;
  index: number;
  onChange: (next: VisumVisaTypeRule) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-navy">
          Visumtyp {index + 1}
          {item.code ? (
            <span className="ms-2 font-mono text-xs font-normal text-muted">
              ({item.code})
            </span>
          ) : null}
        </span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 accent-navy"
              checked={item.enabled}
              onChange={(e) => onChange({ ...item, enabled: e.target.checked })}
            />
            Aktiv
          </label>
          <button
            type="button"
            className="text-xs font-medium text-brand-red hover:underline"
            onClick={onRemove}
          >
            Entfernen
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted">ID (tourist / umrah / …)</span>
            <input
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-mono text-sm"
              value={item.id}
              onChange={(e) => onChange({ ...item, id: e.target.value.trim() })}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Code</span>
            <input
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-mono text-sm"
              value={item.code}
              onChange={(e) => onChange({ ...item, code: e.target.value.trim() })}
            />
          </label>
        </div>
        <LocalizedFields
          label="Name"
          value={item.name}
          onChange={(name) => onChange({ ...item, name })}
        />
        <LocalizedFields
          label="Zweck / Kurzbeschreibung"
          value={item.purpose}
          onChange={(purpose) => onChange({ ...item, purpose })}
        />
        <LocalizedFields
          label="Gültigkeit (Visa validity)"
          value={item.validity}
          onChange={(validity) => onChange({ ...item, validity })}
        />
        <LocalizedFields
          label="Max. Aufenthalt (Maximum stay)"
          value={item.maxStay}
          onChange={(maxStay) => onChange({ ...item, maxStay })}
        />
        <label className="block text-sm">
          <span className="text-muted">Einreise (Multiple / Single)</span>
          <select
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
            value={item.entryMode}
            onChange={(e) =>
              onChange({ ...item, entryMode: e.target.value as VisumEntryMode })
            }
          >
            <option value="multiple">Multiple entry</option>
            <option value="single">Single entry</option>
            <option value="other">Other</option>
          </select>
        </label>
        <LocalizedFields
          label="Einreise-Label (Anzeige)"
          value={item.entryLabel}
          onChange={(entryLabel) => onChange({ ...item, entryLabel })}
        />
      </div>
    </div>
  );
}

function DocumentEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: VisumDocumentRule;
  index: number;
  onChange: (next: VisumDocumentRule) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-navy">Dokument {index + 1}</span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 accent-navy"
              checked={item.required}
              onChange={(e) => onChange({ ...item, required: e.target.checked })}
            />
            Pflicht
          </label>
          <button
            type="button"
            className="text-xs font-medium text-brand-red hover:underline"
            onClick={onRemove}
          >
            Entfernen
          </button>
        </div>
      </div>
      <LocalizedFields
        label="Bezeichnung"
        value={item.label}
        onChange={(label) => onChange({ ...item, label })}
      />
    </div>
  );
}

function NoticeEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: VisumNoticeRule;
  index: number;
  onChange: (next: VisumNoticeRule) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-navy">Hinweis {index + 1}</span>
        <button
          type="button"
          className="text-xs font-medium text-brand-red hover:underline"
          onClick={onRemove}
        >
          Entfernen
        </button>
      </div>
      <label className="mb-3 block text-sm">
        <span className="text-muted">Typ</span>
        <select
          className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2"
          value={item.severity}
          onChange={(e) =>
            onChange({
              ...item,
              severity: e.target.value as VisumNoticeRule["severity"],
            })
          }
        >
          <option value="info">Info</option>
          <option value="warning">Warning</option>
        </select>
      </label>
      <LocalizedFields
        label="Text"
        value={item.text}
        onChange={(text) => onChange({ ...item, text })}
        multiline
        rows={3}
      />
    </div>
  );
}

/** §38 — Editable visa regulations/data (separate from design/SEO content). */
export function AdminVisumRulesEditor({
  rules,
  onChange,
}: {
  rules: VisumRulesConfig;
  onChange: (next: VisumRulesConfig) => void;
}) {
  const nationsText = rules.eligibleNationalities.join("\n");

  return (
    <>
      <Section
        title="Visa Rules / Daten"
        description="Strukturierte Visumregeln — getrennt von Design & SEO-Texten. Hier ändern, wenn Behörden Vorschriften anpassen. Kein Code-Deploy nötig."
      >
        <label className="block text-sm">
          <span className="font-semibold text-navy">
            Pass-Mindestgültigkeit (Monate)
          </span>
          <input
            type="number"
            min={0}
            max={120}
            className="mt-1 w-full max-w-xs rounded-lg border border-line bg-white px-3 py-2"
            value={rules.passportMinValidityMonths}
            onChange={(e) =>
              onChange({
                ...rules,
                passportMinValidityMonths: Number(e.target.value) || 0,
              })
            }
          />
        </label>
        <LocalizedFields
          label="Passgültigkeit · Anzeigetext / Formular-Hinweis"
          value={rules.passportValidityRequirement}
          onChange={(passportValidityRequirement) =>
            onChange({ ...rules, passportValidityRequirement })
          }
          multiline
          rows={3}
        />
        <LocalizedFields
          label="Berechtigte Nationalitäten · Überschrift"
          value={rules.eligibilityHeading}
          onChange={(eligibilityHeading) =>
            onChange({ ...rules, eligibilityHeading })
          }
        />
        <LocalizedFields
          label="Berechtigte Nationalitäten · Zusammenfassung"
          value={rules.eligibleNationalitiesSummary}
          onChange={(eligibleNationalitiesSummary) =>
            onChange({ ...rules, eligibleNationalitiesSummary })
          }
          multiline
          rows={3}
        />
        <label className="block text-sm">
          <span className="font-semibold text-navy">
            Nationalitäten-Liste (eine pro Zeile, optional)
          </span>
          <textarea
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 font-mono text-sm"
            rows={4}
            value={nationsText}
            onChange={(e) =>
              onChange({
                ...rules,
                eligibleNationalities: e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder={"AT\nDE\nCH\n…"}
          />
        </label>
        <LocalizedFields
          label="Unterlagen · Überschrift"
          value={rules.documentsHeading}
          onChange={(documentsHeading) => onChange({ ...rules, documentsHeading })}
        />
      </Section>

      <Section
        title="Visa Types"
        description="Gültigkeit, max. Aufenthalt, Single/Multiple Entry — steuert die Karten-Stichpunkte."
      >
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium hover:bg-surface"
            onClick={() =>
              onChange({
                ...rules,
                visaTypes: [...rules.visaTypes, createEmptyVisaTypeRule()],
              })
            }
          >
            + Visumtyp
          </button>
        </div>
        {rules.visaTypes.map((item, index) => (
          <VisaTypeEditor
            key={item.id}
            item={item}
            index={index}
            onChange={(next) => {
              const visaTypes = rules.visaTypes.map((t, i) =>
                i === index ? next : t,
              );
              onChange({ ...rules, visaTypes });
            }}
            onRemove={() => {
              const visaTypes = rules.visaTypes.filter((_, i) => i !== index);
              onChange({ ...rules, visaTypes });
            }}
          />
        ))}
      </Section>

      <Section title="Required documents" description="Unterlagenliste auf der Visum-Service-Seite.">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium hover:bg-surface"
            onClick={() =>
              onChange({
                ...rules,
                requiredDocuments: [
                  ...rules.requiredDocuments,
                  createEmptyDocumentRule(),
                ],
              })
            }
          >
            + Dokument
          </button>
        </div>
        {rules.requiredDocuments.map((item, index) => (
          <DocumentEditor
            key={item.id}
            item={item}
            index={index}
            onChange={(next) => {
              const requiredDocuments = rules.requiredDocuments.map((d, i) =>
                i === index ? next : d,
              );
              onChange({ ...rules, requiredDocuments });
            }}
            onRemove={() => {
              const requiredDocuments = rules.requiredDocuments.filter(
                (_, i) => i !== index,
              );
              onChange({ ...rules, requiredDocuments });
            }}
          />
        ))}
      </Section>

      <Section
        title="Notices / Warnings"
        description="Hinweise und Warnungen unter den Visum-Karten."
      >
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium hover:bg-surface"
            onClick={() =>
              onChange({
                ...rules,
                notices: [...rules.notices, createEmptyNoticeRule()],
              })
            }
          >
            + Hinweis
          </button>
        </div>
        {rules.notices.map((item, index) => (
          <NoticeEditor
            key={item.id}
            item={item}
            index={index}
            onChange={(next) => {
              const notices = rules.notices.map((n, i) => (i === index ? next : n));
              onChange({ ...rules, notices });
            }}
            onRemove={() => {
              const notices = rules.notices.filter((_, i) => i !== index);
              onChange({ ...rules, notices });
            }}
          />
        ))}
      </Section>
    </>
  );
}
