"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AIRLINES_CATALOG_EVENT,
  createEmptyAirline,
  getAirlines,
  resetAirlinesToSeed,
  writeAirlines,
  type CatalogAirline,
} from "@/lib/airlines-store";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand-cta";

export default function AdminAirlinesPage() {
  const [airlines, setAirlines] = useState<CatalogAirline[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setAirlines(getAirlines());
    const onUpdate = () => setAirlines(getAirlines());
    window.addEventListener(AIRLINES_CATALOG_EVENT, onUpdate);
    return () => window.removeEventListener(AIRLINES_CATALOG_EVENT, onUpdate);
  }, []);

  function update(id: string, patch: Partial<CatalogAirline>) {
    setAirlines((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function remove(id: string) {
    if (!window.confirm("Airline aus dem Katalog entfernen?")) return;
    setAirlines((list) => list.filter((a) => a.id !== id));
  }

  function addBlank() {
    const maxSort = airlines.reduce((m, a) => Math.max(m, a.sortOrder), 0);
    setAirlines((list) => [...list, createEmptyAirline(maxSort + 10)]);
  }

  function save() {
    writeAirlines(airlines);
    setToast("Airlines gespeichert — verfügbar bei Flugangeboten und Anfragen.");
  }

  function reset() {
    if (
      !window.confirm(
        "Auf Standard-Airlines zurücksetzen? Eigene Einträge gehen verloren.",
      )
    ) {
      return;
    }
    resetAirlinesToSeed();
    setAirlines(getAirlines());
    setToast("Standard-Airlines wiederhergestellt.");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Airlines</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Globale Airline-Stammdaten (Name + Logo). Beim Flugangebot nur noch auswählen —
            Logo muss nicht jedes Mal neu hinterlegt werden.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addBlank}
            className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy"
          >
            + Airline hinzufügen
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-muted"
          >
            Katalog zurücksetzen
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-xl bg-brand-cta px-4 py-2.5 text-sm font-semibold text-white"
          >
            Speichern
          </button>
        </div>
      </div>

      {toast ? (
        <p className="mb-4 rounded-lg bg-brand-green-soft px-3 py-2 text-sm text-brand-green">
          {toast}
        </p>
      ) : null}

      <div className="space-y-4">
        {airlines.length === 0 ? (
          <p className="rounded-2xl border border-line bg-white px-4 py-10 text-center text-sm text-muted">
            Noch keine Airlines.{" "}
            <button type="button" className="font-semibold text-brand-cta" onClick={addBlank}>
              + Airline hinzufügen
            </button>
          </p>
        ) : (
          airlines.map((airline) => (
            <div
              key={airline.id}
              className="grid gap-4 rounded-2xl border border-line bg-white p-4 md:grid-cols-[5rem_1fr_1fr_auto] md:items-end"
            >
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-line bg-surface md:mx-0">
                {airline.logo.trim() ? (
                  <Image
                    src={airline.logo.trim()}
                    alt=""
                    fill
                    className="object-contain p-1.5"
                    sizes="64px"
                    unoptimized={airline.logo.startsWith("http")}
                  />
                ) : (
                  <span className="text-[10px] text-muted">Logo</span>
                )}
              </div>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-navy">Name</span>
                <input
                  className={inputClass}
                  value={airline.name}
                  onChange={(e) => update(airline.id, { name: e.target.value })}
                  placeholder="z. B. Turkish Airlines"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-navy">Logo (Pfad / URL)</span>
                <input
                  className={inputClass}
                  value={airline.logo}
                  onChange={(e) => update(airline.id, { logo: e.target.value })}
                  placeholder="/brand/airlines/… oder https://…"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={airline.active}
                    onChange={(e) => update(airline.id, { active: e.target.checked })}
                  />
                  <span className="font-medium">Aktiv</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-red-600"
                  onClick={() => remove(airline.id)}
                >
                  Löschen
                </button>
              </div>

              <p className="text-xs text-muted md:col-span-4">
                ID <code className="text-[11px]">{airline.id}</code> · Sortierung{" "}
                <input
                  type="number"
                  className="ms-1 w-16 rounded border border-line px-1.5 py-0.5 text-xs"
                  value={airline.sortOrder}
                  onChange={(e) =>
                    update(airline.id, { sortOrder: Number(e.target.value) || 0 })
                  }
                />
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
