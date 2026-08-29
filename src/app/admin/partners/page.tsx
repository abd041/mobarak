"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  createEmptyPartner,
  getPartners,
  writePartners,
} from "@/lib/partners-store";
import type { Partner } from "@/data/partners";
import { DEFAULT_PARTNERS } from "@/data/partners";

export default function AdminPartnersPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    setPartners(getPartners());
  }, []);

  function update(id: string, patch: Partial<Partner>) {
    setPartners((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function remove(id: string) {
    setPartners((list) => list.filter((p) => p.id !== id));
  }

  function addBlank() {
    const maxSort = partners.reduce((m, p) => Math.max(m, p.sortOrder), 0);
    setPartners((list) => [...list, createEmptyPartner(maxSort + 10)]);
  }

  function resetToDefaults() {
    if (
      !confirm(
        "Auf Standard-Katalog zurücksetzen? Alle Einträge werden wieder unsichtbar (nur freigeben, wenn Anzeige erlaubt ist).",
      )
    ) {
      return;
    }
    setPartners(DEFAULT_PARTNERS.map((p) => ({ ...p })));
    writePartners(DEFAULT_PARTNERS);
    setToast("Standard-Katalog geladen — alle Logos sind ausgeblendet.");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Partner / Zertifizierungen</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Nur Logos anzeigen, für die Mobarak eine Freigabe hat. Keine Fake-Akkreditierungen.
            Sichtbare Einträge erscheinen unter „VERTRAUEN DURCH ZERTIFIZIERUNG &amp; PARTNERSCHAFT“.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addBlank}
            className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy"
          >
            + Partner hinzufügen
          </button>
          <button
            type="button"
            onClick={resetToDefaults}
            className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-muted"
          >
            Katalog zurücksetzen
          </button>
        </div>
      </div>

      {toast && (
        <p className="mb-4 rounded-lg bg-brand-green-soft px-3 py-2 text-sm text-brand-green">
          {toast}
        </p>
      )}

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          writePartners(partners);
          setToast(
            `Gespeichert — ${partners.filter((p) => p.visible).length} sichtbar auf der Homepage.`,
          );
        }}
      >
        {partners.length === 0 && (
          <p className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-muted">
            Noch keine Partner. Fügen Sie nur freigegebene Logos hinzu.
          </p>
        )}

        {partners.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl border bg-white p-4 shadow-sm ${
              p.visible ? "border-brand-green/40" : "border-line opacity-90"
            }`}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                <input
                  type="checkbox"
                  checked={p.visible}
                  onChange={(e) => update(p.id, { visible: e.target.checked })}
                />
                Auf Website anzeigen
              </label>
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Entfernen
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-[120px_1fr_1fr_100px]">
              <div className="flex h-24 items-center justify-center rounded-xl border border-line bg-surface p-2">
                {p.logoSrc ? (
                  <Image
                    src={p.logoSrc}
                    alt={p.title || "Logo"}
                    width={100}
                    height={60}
                    unoptimized
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-muted">Kein Logo</span>
                )}
              </div>

              <label className="block text-sm md:col-span-2">
                <span className="mb-1 block font-medium">Logo-URL / Pfad</span>
                <input
                  value={p.logoSrc}
                  onChange={(e) => update(p.id, { logoSrc: e.target.value })}
                  placeholder="/brand/partners/….png oder https://…"
                  className="w-full rounded-lg border border-line px-3 py-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-xs text-muted"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === "string") {
                        update(p.id, { logoSrc: reader.result });
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-medium">Sortierung</span>
                <input
                  type="number"
                  value={p.sortOrder}
                  onChange={(e) =>
                    update(p.id, { sortOrder: Number(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-line px-3 py-2"
                />
              </label>

              <label className="block text-sm md:col-span-2">
                <span className="mb-1 block font-medium">Titel</span>
                <input
                  value={p.title}
                  onChange={(e) => update(p.id, { title: e.target.value })}
                  placeholder="z. B. IATA"
                  className="w-full rounded-lg border border-line px-3 py-2"
                  required
                />
              </label>

              <label className="block text-sm md:col-span-2">
                <span className="mb-1 block font-medium">Link (optional)</span>
                <input
                  value={p.link ?? ""}
                  onChange={(e) => update(p.id, { link: e.target.value })}
                  placeholder="https://…"
                  className="w-full rounded-lg border border-line px-3 py-2"
                />
              </label>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white"
        >
          Speichern
        </button>
      </form>
    </div>
  );
}
