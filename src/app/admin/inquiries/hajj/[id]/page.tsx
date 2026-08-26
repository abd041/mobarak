import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <Link href="/admin/inquiries/hajj" className="text-sm text-brand-cta">← Zurück</Link>
      <h1 className="mt-4 mb-6 text-2xl font-bold">Hajj Voranmeldung {id}</h1>
      <div className="rounded-2xl border border-line bg-white p-5 text-sm">
        <p>Personen: 2</p>
        <p>Person 1: … / Wohnsitz: AT</p>
        <p>Person 2: … / Wohnsitz: AT</p>
        <p>Telefon: +43 …</p>
        <p>Quelle: Google</p>
      </div>
    </div>
  );
}
