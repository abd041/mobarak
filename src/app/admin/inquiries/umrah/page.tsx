import Link from "next/link";

const rows = [
  { id: "u1", date: "2026-08-20", trip: "23. Okt – 31. Okt 2026", contact: "+43 …", lang: "de", status: "Neu" },
  { id: "u2", date: "2026-08-18", trip: "25. Nov – 03. Dez 2026", contact: "+43 …", lang: "ar", status: "Gelesen" },
  { id: "u3", date: "2026-08-15", trip: "23. Okt – 31. Okt 2026", contact: "+49 …", lang: "bs", status: "Neu" },
  { id: "u4", date: "2026-08-12", trip: "28. Dez – 06. Jan 2027", contact: "+43 …", lang: "en", status: "Gelesen" },
];

export default function AdminUmrahInquiriesPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Umrah Anfragen</h1>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 text-start">Datum</th>
              <th className="px-4 py-3 text-start">Reise</th>
              <th className="px-4 py-3 text-start">Kontakt</th>
              <th className="px-4 py-3 text-start">Sprache</th>
              <th className="px-4 py-3 text-start">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">{r.trip}</td>
                <td className="px-4 py-3">{r.contact}</td>
                <td className="px-4 py-3 uppercase">{r.lang}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/admin/inquiries/umrah/${r.id}`} className="font-semibold text-brand-cta">
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
