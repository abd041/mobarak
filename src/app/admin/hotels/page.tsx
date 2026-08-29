"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { hotels as seedHotels } from "@/data/mock";
import { listResolvedHotels } from "@/lib/hotel-catalog";

export default function AdminHotelsPage() {
  const [rows, setRows] = useState(seedHotels);

  useEffect(() => {
    const sync = () => setRows(listResolvedHotels());
    sync();
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <Link
          href="/admin/hotels/new"
          className="rounded-xl bg-brand-cta px-4 py-2.5 text-sm font-semibold text-white"
        >
          Neu
        </Link>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 text-start">Bild</th>
              <th className="px-4 py-3 text-start">Name</th>
              <th className="px-4 py-3 text-start">Stadt</th>
              <th className="px-4 py-3 text-start">Sterne</th>
              <th className="px-4 py-3 text-start">Gehminuten</th>
              <th className="px-4 py-3 text-start"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <div className="relative h-12 w-16 overflow-hidden rounded-md bg-surface">
                    {h.images[0]?.src ? (
                      <Image
                        src={h.images[0].src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{h.name}</td>
                <td className="px-4 py-3 capitalize">{h.city}</td>
                <td className="px-4 py-3">{h.stars}</td>
                <td className="px-4 py-3">{h.walkingMinutes}</td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/admin/hotels/${h.id}`} className="font-semibold text-brand-cta">
                    Bearbeiten
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
