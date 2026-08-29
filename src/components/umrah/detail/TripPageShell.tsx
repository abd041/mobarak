export function TripPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface">
      <div className="trip-page-shell" data-trip-page-shell="">
        {children}
      </div>
    </div>
  );
}
