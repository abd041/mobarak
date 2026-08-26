import Link from "next/link";

export default async function AdminUmrahInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <Link href="/admin/inquiries/umrah" className="text-sm text-brand-cta">← Zurück</Link>
      <h1 className="mt-4 mb-6 text-2xl font-bold">Umrah Anfrage {id}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-3 font-bold">Reise</h2>
          <p>Umrah Gruppenreise – 23. Okt – 31. Okt 2026</p>
          <p className="text-sm text-muted">trip_id: trip-23-okt-2026</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-3 font-bold">Kontakt</h2>
          <p>Telefon: +43 …</p>
          <p>E-Mail: example@mail.com</p>
          <p>Sprache: Deutsch</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 md:col-span-2">
          <h2 className="mb-3 font-bold">Reisende (Mock)</h2>
          <ul className="space-y-2 text-sm">
            <li>Erwachsener 1 – Max Mustermann – AT – Normaler Reisepass</li>
            <li>Erwachsener 2 – Anna Mustermann – AT – Normaler Reisepass</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
