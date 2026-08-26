"use client";

import { useState } from "react";

export default function AdminHomepagePage() {
  const [toast, setToast] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Startseite Inhalte</h1>
        {toast && (
          <span className="rounded-full bg-brand-green-soft px-3 py-1 text-sm font-semibold text-brand-green">
            Gespeichert (Demo)
          </span>
        )}
      </div>
      <form onSubmit={save} className="space-y-6">
        {["Hero", "Service-Karten", "Trust", "Newsletter", "SEO"].map((section) => (
          <section key={section} className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-4 font-bold">{section}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block text-sm md:col-span-2">
                <span className="mb-1 block font-medium">Titel (DE)</span>
                <input className="w-full rounded-lg border border-line px-3 py-2" defaultValue={section} />
              </label>
              <label className="block text-sm md:col-span-2">
                <span className="mb-1 block font-medium">Text (DE)</span>
                <textarea className="w-full rounded-lg border border-line px-3 py-2" rows={3} />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Übersetzung AR / BS / EN</span>
                <input className="w-full rounded-lg border border-line px-3 py-2" placeholder="Tabs später im Backend" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Bild</span>
                <input type="file" className="w-full text-sm" />
              </label>
            </div>
          </section>
        ))}
        <button type="submit" className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white">
          Speichern (Demo)
        </button>
      </form>
    </div>
  );
}
