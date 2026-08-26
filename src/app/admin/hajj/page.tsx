"use client";

import { useState } from "react";

export default function AdminHajjContentPage() {
  const [toast, setToast] = useState(false);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Hajj 2027 Inhalte</h1>
      {toast && <p className="mb-4 text-sm text-brand-green">Gespeichert (Demo)</p>}
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setToast(true);
        }}
      >
        {["Hero", "Status", "Why Mobarak", "SEO", "30+ Jahre", "FAQ", "Final CTA"].map((s) => (
          <section key={s} className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-3 font-bold">{s}</h2>
            <textarea className="w-full rounded-lg border border-line px-3 py-2" rows={3} placeholder={`${s} Inhalt DE / AR / BS / EN`} />
          </section>
        ))}
        <button type="submit" className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white">
          Speichern (Demo)
        </button>
      </form>
    </div>
  );
}
