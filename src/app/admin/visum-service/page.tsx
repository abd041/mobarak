"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_VISUM_CMS,
  createEmptyEntryItem,
  createEmptyFaqItem,
  createEmptyLink,
  type LocalizedString,
  type VisumCmsCard,
  type VisumCmsConfig,
  type VisumCmsEntryItem,
  type VisumCmsFaqItem,
  type VisumCmsInternalLink,
  type VisumCmsSeo,
} from "@/data/visum-cms";
import {
  mergeVisumCmsConfig,
  resetVisumCms,
  writeVisumCms,
} from "@/lib/visum-cms-store";
import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";
import { AdminVisumRulesEditor } from "@/app/admin/visum-service/AdminVisumRulesEditor";

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
                className="mt-1 w-full rounded-lg border border-line px-3 py-2"
                rows={rows}
                value={value[loc] ?? ""}
                onChange={(e) => onChange({ ...value, [loc]: e.target.value })}
              />
            ) : (
              <input
                className="mt-1 w-full rounded-lg border border-line px-3 py-2"
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

function emptyLocalized(): LocalizedString {
  return Object.fromEntries(locales.map((l) => [l, ""])) as LocalizedString;
}

function CardEditor({
  title,
  card,
  onChange,
}: {
  title: string;
  card: VisumCmsCard;
  onChange: (next: VisumCmsCard) => void;
}) {
  return (
    <Section
      title={title}
      description="Design/Darstellung der Karte. Gültigkeit, Aufenthalt und Einreise kommen aus «Visa Rules / Daten»."
    >
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          className="h-4 w-4 accent-navy"
          checked={card.enabled}
          onChange={(e) => onChange({ ...card, enabled: e.target.checked })}
        />
        Auf der Visum-Service-Seite anzeigen
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          className="h-4 w-4 accent-navy"
          checked={card.showRulesOnCard !== false}
          onChange={(e) =>
            onChange({ ...card, showRulesOnCard: e.target.checked })
          }
        />
        Regel-Daten als Stichpunkte anzeigen (empfohlen)
      </label>

      <LocalizedFields
        label="Titel (Design)"
        value={card.title}
        onChange={(title) => onChange({ ...card, title })}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-navy">
            Extra-Stichpunkte (Marketing, nach den Regeln)
          </p>
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface"
            onClick={() =>
              onChange({
                ...card,
                extraPoints: [...(card.extraPoints ?? []), emptyLocalized()],
              })
            }
          >
            + Stichpunkt
          </button>
        </div>
        {(card.extraPoints ?? []).map((point, index) => (
          <div key={index} className="rounded-xl border border-line bg-surface/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">Extra {index + 1}</span>
              <button
                type="button"
                className="text-xs font-medium text-brand-red hover:underline"
                onClick={() =>
                  onChange({
                    ...card,
                    extraPoints: (card.extraPoints ?? []).filter((_, i) => i !== index),
                  })
                }
              >
                Entfernen
              </button>
            </div>
            <LocalizedFields
              label=""
              value={point}
              onChange={(next) => {
                const extraPoints = (card.extraPoints ?? []).map((p, i) =>
                  i === index ? next : p,
                );
                onChange({ ...card, extraPoints });
              }}
            />
          </div>
        ))}
      </div>

      <LocalizedFields
        label="Fußzeile (Desktop-Karte)"
        value={card.footer}
        onChange={(footer) => onChange({ ...card, footer })}
        multiline
      />
    </Section>
  );
}

function EntryItemEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: VisumCmsEntryItem;
  index: number;
  onChange: (next: VisumCmsEntryItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-navy">Einreise-Punkt {index + 1}</span>
        <button
          type="button"
          className="text-xs font-medium text-brand-red hover:underline"
          onClick={onRemove}
        >
          Entfernen
        </button>
      </div>
      <div className="space-y-3">
        <LocalizedFields
          label="Überschrift"
          value={item.title}
          onChange={(title) => onChange({ ...item, title })}
        />
        <LocalizedFields
          label="Text"
          value={item.body}
          onChange={(body) => onChange({ ...item, body })}
          multiline
          rows={3}
        />
      </div>
    </div>
  );
}

function FaqItemEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: VisumCmsFaqItem;
  index: number;
  onChange: (next: VisumCmsFaqItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-navy">FAQ {index + 1}</span>
        <button
          type="button"
          className="text-xs font-medium text-brand-red hover:underline"
          onClick={onRemove}
        >
          Entfernen
        </button>
      </div>
      <div className="space-y-3">
        <LocalizedFields
          label="Frage"
          value={item.question}
          onChange={(question) => onChange({ ...item, question })}
        />
        <LocalizedFields
          label="Antwort"
          value={item.answer}
          onChange={(answer) => onChange({ ...item, answer })}
          multiline
          rows={3}
        />
      </div>
    </div>
  );
}

function LinkEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: VisumCmsInternalLink;
  index: number;
  onChange: (next: VisumCmsInternalLink) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-navy">Link {index + 1}</span>
        <button
          type="button"
          className="text-xs font-medium text-brand-red hover:underline"
          onClick={onRemove}
        >
          Entfernen
        </button>
      </div>
      <div className="space-y-3">
        <LocalizedFields
          label="Linktext"
          value={item.label}
          onChange={(label) => onChange({ ...item, label })}
        />
        <label className="block text-sm">
          <span className="text-muted">Pfad (ohne Locale, z. B. /kontakt)</span>
          <input
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            value={item.href}
            onChange={(e) => onChange({ ...item, href: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

function updateSeo(config: VisumCmsConfig, seo: VisumCmsSeo): VisumCmsConfig {
  return { ...config, seo };
}

export default function AdminVisumServicePage() {
  const [config, setConfig] = useState<VisumCmsConfig>(DEFAULT_VISUM_CMS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/visum-cms", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: VisumCmsConfig | null) => {
        if (cancelled || !data) return;
        setConfig(mergeVisumCmsConfig(data));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    writeVisumCms(config);
    try {
      const res = await fetch("/api/admin/visum-cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("save_failed");
      const savedConfig = (await res.json()) as VisumCmsConfig;
      setConfig(mergeVisumCmsConfig(savedConfig));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Speichern auf dem Server fehlgeschlagen. Lokal gespeichert (Vorschau).");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    setError(null);
    resetVisumCms();
    try {
      await fetch("/api/admin/visum-cms", { method: "DELETE" });
    } catch {
      // ignore
    }
    setConfig(DEFAULT_VISUM_CMS);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  const seo = config.seo;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Visum Service</h1>
          <p className="mt-1 text-sm text-muted">
            <strong>Visa Rules</strong> = Vorschriften/Daten ·{" "}
            <strong>Karten &amp; SEO</strong> = Design/Inhalte. Änderungen auf{" "}
            <Link href="/de/visum-service" className="font-medium text-brand-cta underline">
              /de/visum-service
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold hover:bg-white"
          >
            Standard wiederherstellen
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-60"
          >
            {saving ? "Speichern…" : saved ? "Gespeichert" : "Speichern"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-navy">
          {error}
        </p>
      ) : null}

      <div className="rounded-2xl border border-navy/15 bg-[#f3f7fb] p-4 text-sm text-navy/85">
        <p className="font-semibold text-navy">§41 — Seitenaufbau</p>
        <p className="mt-1">
          Oberer Bereich (Hero → Formular → Trust) = genehmigte Screenshots — nicht umgestalten.
          Darunter: SEO/Info (Admin). Themen: Saudi Arabia Visa · Tourist Visa · Umrah Visa · Entry Requirements.
        </p>
      </div>

      <AdminVisumRulesEditor
        rules={config.rules}
        onChange={(rules) => setConfig({ ...config, rules })}
      />

      <Section title="Design · Abschnittsüberschrift (Karten)">
        <LocalizedFields
          label="Überschrift"
          value={config.sectionTitle}
          onChange={(sectionTitle) => setConfig({ ...config, sectionTitle })}
        />
      </Section>

      <CardEditor
        title="Design · Touristen Visum (blau)"
        card={config.tourist}
        onChange={(tourist) => setConfig({ ...config, tourist })}
      />

      <CardEditor
        title="Design · Umrah Visum (grün)"
        card={config.umrah}
        onChange={(umrah) => setConfig({ ...config, umrah })}
      />

      <Section
        title="SEO · Meta-Tags"
        description="Steuern title und description der öffentlichen Visum-Service-Seite (SSR)."
      >
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            className="h-4 w-4 accent-navy"
            checked={seo.enabled}
            onChange={(e) =>
              setConfig(updateSeo(config, { ...seo, enabled: e.target.checked }))
            }
          />
          SEO-Block unter dem Formular anzeigen
        </label>
        <LocalizedFields
          label="Meta Title"
          value={seo.metaTitle}
          onChange={(metaTitle) => setConfig(updateSeo(config, { ...seo, metaTitle }))}
        />
        <LocalizedFields
          label="Meta Description"
          value={seo.metaDescription}
          onChange={(metaDescription) =>
            setConfig(updateSeo(config, { ...seo, metaDescription }))
          }
          multiline
          rows={3}
        />
      </Section>

      <Section
        title="1 · Saudi Arabia Visa"
        description="Haupt-SEO-Block: Überschrift + Einleitung unter dem Conversion-Design."
      >
        <LocalizedFields
          label="Überschrift (H2)"
          value={seo.heading}
          onChange={(heading) => setConfig(updateSeo(config, { ...seo, heading }))}
        />
        <LocalizedFields
          label="Einleitung"
          value={seo.intro}
          onChange={(intro) => setConfig(updateSeo(config, { ...seo, intro }))}
          multiline
          rows={4}
        />
      </Section>

      <Section
        title="2 · Tourist Visa"
        description="SEO-Abschnitt Touristenvisum (unter dem Formular)."
      >
        <LocalizedFields
          label="Überschrift (H3)"
          value={seo.touristHeading}
          onChange={(touristHeading) =>
            setConfig(updateSeo(config, { ...seo, touristHeading }))
          }
        />
        <LocalizedFields
          label="Text"
          value={seo.touristBody}
          onChange={(touristBody) =>
            setConfig(updateSeo(config, { ...seo, touristBody }))
          }
          multiline
          rows={5}
        />
      </Section>

      <Section
        title="3 · Umrah Visa"
        description="SEO-Abschnitt Umrah Visum (unter dem Formular)."
      >
        <LocalizedFields
          label="Überschrift (H3)"
          value={seo.umrahHeading}
          onChange={(umrahHeading) =>
            setConfig(updateSeo(config, { ...seo, umrahHeading }))
          }
        />
        <LocalizedFields
          label="Text"
          value={seo.umrahBody}
          onChange={(umrahBody) => setConfig(updateSeo(config, { ...seo, umrahBody }))}
          multiline
          rows={4}
        />
      </Section>

      <Section
        title="4 · Saudi Arabia Entry Requirements"
        description="Einreisebestimmungen — Checkliste + Disclaimer."
      >
        <LocalizedFields
          label="Abschnittsüberschrift"
          value={seo.entryHeading}
          onChange={(entryHeading) =>
            setConfig(updateSeo(config, { ...seo, entryHeading }))
          }
        />
        <LocalizedFields
          label="Hinweis / Disclaimer"
          value={seo.disclaimer}
          onChange={(disclaimer) => setConfig(updateSeo(config, { ...seo, disclaimer }))}
          multiline
          rows={4}
        />
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface"
            onClick={() =>
              setConfig(
                updateSeo(config, {
                  ...seo,
                  entryItems: [...seo.entryItems, createEmptyEntryItem()],
                }),
              )
            }
          >
            + Einreise-Punkt
          </button>
        </div>
        {seo.entryItems.map((item, index) => (
          <EntryItemEditor
            key={item.id}
            item={item}
            index={index}
            onChange={(next) => {
              const entryItems = seo.entryItems.map((e, i) => (i === index ? next : e));
              setConfig(updateSeo(config, { ...seo, entryItems }));
            }}
            onRemove={() => {
              const entryItems = seo.entryItems.filter((_, i) => i !== index);
              setConfig(updateSeo(config, { ...seo, entryItems }));
            }}
          />
        ))}
      </Section>

      <Section
        title="SEO · FAQ (optional)"
        description="Accordion unter den vier Kernthemen — ebenfalls Admin-editierbar."
      >
        <LocalizedFields
          label="FAQ-Überschrift"
          value={seo.faqHeading}
          onChange={(faqHeading) => setConfig(updateSeo(config, { ...seo, faqHeading }))}
        />
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface"
            onClick={() =>
              setConfig(
                updateSeo(config, {
                  ...seo,
                  faqs: [...seo.faqs, createEmptyFaqItem()],
                }),
              )
            }
          >
            + FAQ
          </button>
        </div>
        {seo.faqs.map((item, index) => (
          <FaqItemEditor
            key={item.id}
            item={item}
            index={index}
            onChange={(next) => {
              const faqs = seo.faqs.map((f, i) => (i === index ? next : f));
              setConfig(updateSeo(config, { ...seo, faqs }));
            }}
            onRemove={() => {
              const faqs = seo.faqs.filter((_, i) => i !== index);
              setConfig(updateSeo(config, { ...seo, faqs }));
            }}
          />
        ))}
      </Section>

      <Section
        title="SEO · Interne Links"
        description="Verlinkungen zu anderen Seiten (ohne Locale-Präfix)."
      >
        <LocalizedFields
          label="Links-Überschrift"
          value={seo.linksHeading}
          onChange={(linksHeading) =>
            setConfig(updateSeo(config, { ...seo, linksHeading }))
          }
        />
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface"
            onClick={() =>
              setConfig(
                updateSeo(config, {
                  ...seo,
                  links: [...seo.links, createEmptyLink()],
                }),
              )
            }
          >
            + Link
          </button>
        </div>
        {seo.links.map((item, index) => (
          <LinkEditor
            key={item.id}
            item={item}
            index={index}
            onChange={(next) => {
              const links = seo.links.map((l, i) => (i === index ? next : l));
              setConfig(updateSeo(config, { ...seo, links }));
            }}
            onRemove={() => {
              const links = seo.links.filter((_, i) => i !== index);
              setConfig(updateSeo(config, { ...seo, links }));
            }}
          />
        ))}
      </Section>
    </div>
  );
}
