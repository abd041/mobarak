"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  DEFAULT_SITE_SETTINGS,
  type FooterLink,
  type SiteSettings,
} from "@/data/site-settings";
import { getSiteSettings, writeSiteSettings } from "@/lib/site-settings-store";

export default function AdminSettingsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    setSettings(getSiteSettings());
  }, []);

  function patch(partial: Partial<SiteSettings>) {
    setSettings((s) => ({ ...s, ...partial }));
  }

  function updateLink(
    listKey: "services" | "importantLinks",
    id: string,
    partial: Partial<FooterLink>,
  ) {
    setSettings((s) => ({
      ...s,
      [listKey]: s[listKey].map((l) => (l.id === id ? { ...l, ...partial } : l)),
    }));
  }

  function addLink(listKey: "services" | "importantLinks") {
    setSettings((s) => ({
      ...s,
      [listKey]: [
        ...s[listKey],
        {
          id: `${listKey}-${Date.now()}`,
          label: "",
          href: "/",
          visible: true,
        },
      ],
    }));
  }

  function removeLink(listKey: "services" | "importantLinks", id: string) {
    setSettings((s) => ({
      ...s,
      [listKey]: s[listKey].filter((l) => l.id !== id),
    }));
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Einstellungen / Footer</h1>
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Logo, Beschreibung, Social Links, Leistungen, wichtige Links und Kontakt — alles für den
        Footer editierbar. Speichern aktualisiert die Website sofort (Demo ohne Backend).
      </p>

      {toast && (
        <p className="mb-4 rounded-lg bg-brand-green-soft px-3 py-2 text-sm text-brand-green">
          {toast}
        </p>
      )}

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          writeSiteSettings(settings);
          setToast("Footer-Einstellungen gespeichert.");
        }}
      >
        <Section title="Mobarak Information">
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Logo (Pfad oder URL)</span>
            <input
              className="w-full rounded-lg border border-line px-3 py-2"
              value={settings.logoSrc}
              onChange={(e) => patch({ logoSrc: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              className="mt-2 block text-xs text-muted"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === "string") patch({ logoSrc: reader.result });
                };
                reader.readAsDataURL(file);
              }}
            />
            <div className="mt-3 flex h-16 items-center">
              {settings.logoSrc ? (
                settings.logoSrc.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.logoSrc} alt="" className="h-14 w-auto object-contain" />
                ) : (
                  <Image
                    src={settings.logoSrc}
                    alt=""
                    width={160}
                    height={56}
                    unoptimized
                    className="h-14 w-auto object-contain"
                  />
                )
              ) : null}
            </div>
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Kurzbeschreibung</span>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-line px-3 py-2"
              value={settings.tagline}
              onChange={(e) => patch({ tagline: e.target.value })}
            />
          </label>
        </Section>

        <Section title="Social Media">
          {(
            [
              ["facebook", "Facebook URL"],
              ["instagram", "Instagram URL"],
              ["youtube", "YouTube URL"],
              ["tiktok", "TikTok URL"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="mb-1 block font-medium">{label}</span>
              <input
                className="w-full rounded-lg border border-line px-3 py-2"
                placeholder="https://… (leer = ausgeblendet)"
                value={settings.social[key]}
                onChange={(e) =>
                  patch({ social: { ...settings.social, [key]: e.target.value } })
                }
              />
            </label>
          ))}
        </Section>

        <Section title="Unsere Leistungen">
          <div className="md:col-span-2 space-y-3">
            {settings.services.map((link) => (
              <LinkEditor
                key={link.id}
                link={link}
                onChange={(p) => updateLink("services", link.id, p)}
                onRemove={() => removeLink("services", link.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => addLink("services")}
              className="text-sm font-semibold text-brand-cta"
            >
              + Leistung hinzufügen
            </button>
          </div>
        </Section>

        <Section title="Wichtige Links">
          <p className="text-sm text-muted md:col-span-2">
            Der Link „Datenschutz“ wird auch im Datenschutzhinweis auf der Anfrageseite
            verwendet.
          </p>
          <div className="md:col-span-2 space-y-3">
            {settings.importantLinks.map((link) => (
              <LinkEditor
                key={link.id}
                link={link}
                onChange={(p) => updateLink("importantLinks", link.id, p)}
                onRemove={() => removeLink("importantLinks", link.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => addLink("importantLinks")}
              className="text-sm font-semibold text-brand-cta"
            >
              + Link hinzufügen
            </button>
          </div>
        </Section>

        <Section title="Kontakt">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Telefon</span>
            <input
              className="w-full rounded-lg border border-line px-3 py-2"
              value={settings.phone}
              onChange={(e) => patch({ phone: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">E-Mail</span>
            <input
              className="w-full rounded-lg border border-line px-3 py-2"
              value={settings.email}
              onChange={(e) => patch({ email: e.target.value })}
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Adresse / Standort</span>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-line px-3 py-2"
              value={settings.address}
              onChange={(e) => patch({ address: e.target.value })}
            />
          </label>
        </Section>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white"
          >
            Speichern
          </button>
          <button
            type="button"
            className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-medium text-muted"
            onClick={() => {
              setSettings(DEFAULT_SITE_SETTINGS);
              writeSiteSettings(DEFAULT_SITE_SETTINGS);
              setToast("Auf Standardwerte zurückgesetzt.");
            }}
          >
            Zurücksetzen
          </button>
        </div>
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

function LinkEditor({
  link,
  onChange,
  onRemove,
}: {
  link: FooterLink;
  onChange: (p: Partial<FooterLink>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-2 rounded-xl border border-line bg-surface p-3 md:grid-cols-[1fr_1fr_auto_auto]">
      <input
        className="rounded-lg border border-line px-3 py-2 text-sm"
        placeholder="Titel"
        value={link.label}
        onChange={(e) => onChange({ label: e.target.value })}
      />
      <input
        className="rounded-lg border border-line px-3 py-2 text-sm"
        placeholder="/pfad oder URL"
        value={link.href}
        onChange={(e) => onChange({ href: e.target.value })}
      />
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={link.visible}
          onChange={(e) => onChange({ visible: e.target.checked })}
        />
        Sichtbar
      </label>
      <button type="button" onClick={onRemove} className="text-sm text-red-600 hover:underline">
        Entfernen
      </button>
    </div>
  );
}
