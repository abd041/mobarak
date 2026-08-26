import Link from "next/link";
import { trips } from "@/data/mock";

export default function AdminTripsPage() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Umrah Reisen</h1>
        <Link
          href="/admin/umrah/trips/new"
          className="rounded-xl bg-brand-cta px-4 py-2.5 text-sm font-semibold text-white"
        >
          Neu
        </Link>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-surface text-start">
            <tr>
              <th className="px-4 py-3 font-semibold">Termin</th>
              <th className="px-4 py-3 font-semibold">Nächte</th>
              <th className="px-4 py-3 font-semibold">Plätze</th>
              <th className="px-4 py-3 font-semibold">Preis ab</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id} className="border-t border-line">
                <td className="px-4 py-3">{trip.dateLabel}</td>
                <td className="px-4 py-3">{trip.nights}</td>
                <td className="px-4 py-3">{trip.availableSeats}</td>
                <td className="px-4 py-3">{trip.prices.quad} €</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-green-soft px-2 py-1 text-xs font-semibold text-brand-green">
                    {trip.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/admin/umrah/trips/${trip.id}`} className="font-semibold text-brand-cta">
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
