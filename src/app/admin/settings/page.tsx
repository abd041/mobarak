"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [toast, setToast] = useState(false);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Einstellungen</h1>
      {toast && <p className="mb-4 text-sm text-brand-green">Gespeichert (Demo)</p>}
      <form
        className="grid max-w-2xl gap-4 rounded-2xl border border-line bg-white p-5"
        onSubmit={(e) => {
          e.preventDefault();
          setToast(true);
        }}
      >
        <label className="text-sm">Telefon<input className="mt-1 w-full rounded-lg border border-line px-3 py-2" defaultValue="+43 660 722 45 67" /></label>
        <label className="text-sm">E-Mail<input className="mt-1 w-full rounded-lg border border-line px-3 py-2" defaultValue="info@mobarak.at" /></label>
        <label className="text-sm">Adresse<input className="mt-1 w-full rounded-lg border border-line px-3 py-2" defaultValue="Wien, Österreich" /></label>
        <label className="text-sm">Standard-Sprache
          <select className="mt-1 w-full rounded-lg border border-line px-3 py-2" defaultValue="de">
            <option value="de">Deutsch</option>
            <option value="ar">العربية</option>
            <option value="bs">Bosanski</option>
            <option value="en">English</option>
          </select>
        </label>
        <button type="submit" className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white">
          Speichern (Demo)
        </button>
      </form>
    </div>
  );
}
