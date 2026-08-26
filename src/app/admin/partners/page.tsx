"use client";

import { useState } from "react";

export default function AdminPartnersPage() {
  const [toast, setToast] = useState(false);
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Partner / Zertifizierungen</h1>
      <p className="mb-6 text-sm text-muted">
        Keine Fake-Logos. Nur freigegebene Partner – derzeit Platzhalter-Slots.
      </p>
      {toast && <p className="mb-4 text-sm text-brand-green">Gespeichert (Demo)</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setToast(true);
        }}
        className="space-y-3"
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid gap-3 rounded-xl border border-line bg-white p-4 md:grid-cols-4">
            <input className="rounded-lg border border-line px-3 py-2 text-sm" placeholder="Titel" />
            <input className="rounded-lg border border-line px-3 py-2 text-sm" placeholder="Link (optional)" />
            <input type="file" className="text-sm" />
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Sichtbar</label>
          </div>
        ))}
        <button type="submit" className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white">
          Speichern (Demo)
        </button>
      </form>
    </div>
  );
}
