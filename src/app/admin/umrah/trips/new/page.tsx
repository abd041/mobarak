"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminNewTripPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function createTrip() {
      try {
        const res = await fetch("/api/admin/trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (!res.ok) throw new Error("create_failed");
        const data = (await res.json()) as { trip: { id: string } };
        if (!cancelled) {
          router.replace(`/admin/umrah/trips/${data.trip.id}`);
        }
      } catch {
        if (!cancelled) router.replace("/admin/umrah/trips");
      }
    }

    void createTrip();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="rounded-2xl border border-line bg-white p-8 text-center">
      <p className="text-sm text-muted">Neue Umrah-Reise wird angelegt …</p>
    </div>
  );
}
