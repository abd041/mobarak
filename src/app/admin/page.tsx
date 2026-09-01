import Link from "next/link";
import { trips } from "@/data/mock";
import { MOCK_INDIVIDUAL_UMRAH_INQUIRIES } from "@/data/individual-umrah-inquiries-mock";
import { INDIVIDUAL_UMRAH_OPEN_STATUSES } from "@/lib/individual-umrah-inquiries-store";

export default function AdminDashboardPage() {
  const openSeats = trips.filter((t) => t.availableSeats > 0).length;
  const individualOpen = MOCK_INDIVIDUAL_UMRAH_INQUIRIES.filter((i) =>
    INDIVIDUAL_UMRAH_OPEN_STATUSES.includes(i.status),
  ).length;

  const cards = [
    { label: "Umrah Reisen", value: trips.length, href: "/admin/umrah/trips" },
    { label: "Mit freien Plätzen", value: openSeats, href: "/admin/umrah/trips" },
    { label: "Umrah Anfragen", value: 4, href: "/admin/inquiries/umrah" },
    {
      label: "Indiv. Umrah Anfragen",
      value: MOCK_INDIVIDUAL_UMRAH_INQUIRIES.length,
      href: "/admin/inquiries/individual-umrah",
    },
    { label: "Offene Indiv. Anfragen", value: individualOpen, href: "/admin/inquiries/individual-umrah" },
    { label: "Hajj Voranmeldungen", value: 7, href: "/admin/inquiries/hajj" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
