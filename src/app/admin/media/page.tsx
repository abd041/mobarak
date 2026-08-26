export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Medien</h1>
      <div className="mb-4">
        <button type="button" className="rounded-xl bg-brand-cta px-4 py-2.5 text-sm font-semibold text-white">
          Upload (Demo)
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-line bg-white text-xs text-muted">
            Bild {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
