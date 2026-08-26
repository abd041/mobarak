"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminTripFormPage() {
  const [toast, setToast] = useState(false);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Umrah Reise bearbeiten</h1>
        <Link href="/admin/umrah/trips" className="text-sm text-brand-cta">
          ← Zurück
        </Link>
      </div>
      {toast && (
        <p className="mb-4 rounded-lg bg-brand-green-soft px-3 py-2 text-sm text-brand-green">
          Gespeichert (Demo)
        </p>
      )}
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          setToast(true);
        }}
      >
        <Section title="Basis">
          <Field label="Titel" defaultValue="Umrah Gruppenreise" />
          <Field label="Slug" defaultValue="23-oktober-2026" />
          <Field label="Startdatum" defaultValue="2026-10-23" type="date" />
          <Field label="Enddatum" defaultValue="2026-10-31" type="date" />
          <Field label="Nächte" defaultValue="9" type="number" />
          <Field label="Gruppengröße" defaultValue="45" type="number" />
        </Section>
        <Section title="Verfügbarkeit">
          <Field label="Freie Plätze" defaultValue="5" type="number" />
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked /> Warteliste aktiv
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" /> Warteliste voll
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked /> Sichtbar
          </label>
        </Section>
        <Section title="Preise">
          <Field label="Vierbett" defaultValue="1250" type="number" />
          <Field label="Dreibett" defaultValue="1350" type="number" />
          <Field label="Zweibett" defaultValue="1450" type="number" />
          <Field label="Baby" defaultValue="450" type="number" />
          <Field label="Kind ohne Bett" defaultValue="950" type="number" />
        </Section>
        <Section title="Hotels & Entfernung">
          <Field label="Medina Hotel ID" defaultValue="maden" />
          <Field label="Makkah Hotel ID" defaultValue="anjum" />
          <Field label="Gehminuten Medina" defaultValue="3" type="number" />
          <Field label="Gehminuten Makkah" defaultValue="5" type="number" />
        </Section>
        <Section title="Reiseleiter-Sprachen (Inhalt)">
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Arabisch</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Deutsch</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Bosnisch</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Türkisch</label>
        </Section>
        <Section title="Übersetzungen">
          <p className="text-sm text-muted">Tabs DE / AR / BS / EN – Demo-Felder</p>
          <Field label="Titel AR" />
          <Field label="Titel BS" />
          <Field label="Titel EN" />
        </Section>
        <button type="submit" className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white">
          Speichern (Demo)
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

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-line px-3 py-2"
      />
    </label>
  );
}
