import type { UmrahTrip } from "@/data/mock";
import { deriveStatus } from "@/lib/trip-availability";
import { formatTripDateLabel } from "@/lib/trip-basics";
import { reindexGallerySortOrder } from "@/lib/trip-gallery";

/** Apply derived fields and stable sort order before serving trips. */
export function normalizeTrip(trip: UmrahTrip): UmrahTrip {
  const availability = {
    totalCapacity: trip.totalCapacity,
    availableSeats: trip.availableSeats,
    waitlistEnabled: trip.waitlistEnabled,
    waitlistCapacity: trip.waitlistCapacity,
    waitlistFull: trip.waitlistFull,
  };

  return {
    ...trip,
    displayOrder: Number.isFinite(trip.displayOrder) ? trip.displayOrder : 100,
    images: reindexGallerySortOrder(trip.images ?? []),
    dateLabel: formatTripDateLabel(trip.startDate, trip.endDate, trip.dateLabel),
    status: deriveStatus(availability),
    seoIndexable: trip.seoIndexable ?? true,
  };
}

export function sortTripsByDisplayOrder(trips: UmrahTrip[]): UmrahTrip[] {
  return [...trips].sort(
    (a, b) =>
      (a.displayOrder ?? 100) - (b.displayOrder ?? 100) ||
      a.startDate.localeCompare(b.startDate) ||
      a.id.localeCompare(b.id),
  );
}
