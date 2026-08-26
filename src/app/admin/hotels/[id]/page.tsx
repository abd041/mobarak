"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminHotelEditPage() {
  const [toast, setToast] = useState(false);
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hotel bearbeiten</h1>
        <Link href="/admin/hotels" className="text-sm text-brand-cta">← Zurück</Link>
      </div>
      {toast && <p className="mb-4 text-sm text-brand-green">Gespeichert (Demo)</p>}
      <form
        className="grid max-w-3xl gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          setToast(true);
        }}
      >
        <label className="text-sm">Name<input className="mt-1 w-full rounded-lg border border-line px-3 py-2" defaultValue="Maden Hotel" /></label>
        <label className="text-sm">Stadt
          <select className="mt-1 w-full rounded-lg border border-line px-3 py-2" defaultValue="medina">
            <option value="medina">Medina</option>
            <option value="makkah">Makkah</option>
          </select>
        </label>
        <label className="text-sm">Sterne<input type="number" className="mt-1 w-full rounded-lg border border-line px-3 py-2" defaultValue={5} /></label>
        <label className="text-sm">Gehminuten zum Haram/Nabawi<input type="number" className="mt-1 w-full rounded-lg border border-line px-3 py-2" defaultValue={3} /></label>
        <label className="text-sm md:col-span-2">Amenities (kommagetrennt)<input className="mt-1 w-full rounded-lg border border-line px-3 py-2" defaultValue="WLAN, 24h Rezeption, Klimaanlage, Restaurant" /></label>
        <label className="text-sm md:col-span-2">Galerie<input type="file" multiple className="mt-1 w-full text-sm" /></label>
        <button type="submit" className="rounded-xl bg-brand-cta px-5 py-3 text-sm font-semibold text-white md:col-span-2">Speichern (Demo)</button>
      </form>
    </div>
  );
}
