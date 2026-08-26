import Link from "next/link";
import { trips } from "@/data/mock";

export default function AdminDashboardPage() {
  const openSeats = trips.filter((t) => t.availableSeats > 0).length;

  const cards = [
    { label: "Umrah Reisen", value: trips.length, href: "/admin/umrah/trips" },
    { label: "Mit freien Plätzen", value: openSeats, href: "/admin/umrah/trips" },
    { label: "Umrah Anfragen", value: 4, href: "/admin/inquiries/umrah" },
    { label: "Hajj Voranmeldungen", value: 7, href: "/admin/inquiries/hajj" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-line bg-white p-5 shadow-sm hover:border-brand-orange/40"
          >
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-navy">{c.value}</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        Alle Kennzahlen sind Mock-Daten für die UI-Milestone. Speichern/Auth folgt im Backend.
      </p>
    </div>
  );
}
