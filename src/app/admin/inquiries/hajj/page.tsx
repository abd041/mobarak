import Link from "next/link";

const rows = [
  { id: "h1", date: "2026-08-21", people: 2, lang: "de", status: "Neu" },
  { id: "h2", date: "2026-08-19", people: 4, lang: "ar", status: "Neu" },
  { id: "h3", date: "2026-08-17", people: 1, lang: "bs", status: "Gelesen" },
];

export default function AdminHajjPreregsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Hajj Voranmeldungen</h1>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 text-start">Datum</th>
              <th className="px-4 py-3 text-start">Personen</th>
              <th className="px-4 py-3 text-start">Sprache</th>
              <th className="px-4 py-3 text-start">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">{r.people}</td>
                <td className="px-4 py-3 uppercase">{r.lang}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/admin/inquiries/hajj/${r.id}`} className="font-semibold text-brand-cta">
                    Details
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
