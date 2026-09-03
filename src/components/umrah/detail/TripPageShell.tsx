export function TripPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <div className="trip-page-shell" data-trip-page-shell="">
        {children}
      </div>
    </div>
  );
}
