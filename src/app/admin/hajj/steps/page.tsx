import { hajjJourney, hajjProcess } from "@/data/hajj";

export default function AdminHajjStepsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-4 text-2xl font-bold">Hajj Schritte – Vormerkung (01–10)</h1>
        <div className="space-y-2">
          {hajjProcess.map((s) => (
            <div key={s.id} className="rounded-xl border border-line bg-white p-4">
              <p className="font-semibold">{s.num} – {s.title}</p>
              <p className="text-sm text-muted">{s.short}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-xl font-bold">Hajj Journey (01–18)</h2>
        <div className="space-y-2">
          {hajjJourney.map((s) => (
            <div key={s.id} className="rounded-xl border border-line bg-white p-4">
              <p className="font-semibold">
                {s.num} – {s.title} {s.highlight ? "(hervorgehoben)" : ""}
              </p>
              <p className="text-sm text-muted">{s.short}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted">Bearbeiten/Sortieren ist Demo-UI – Persistenz folgt im Backend.</p>
    </div>
  );
}
