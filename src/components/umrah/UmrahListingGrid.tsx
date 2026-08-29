"use client";

import { TripCard } from "@/components/umrah/TripCard";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { useInView } from "@/hooks/useInView";
import type { PeriodFilterKey } from "@/lib/listing-period-filters";

function CardSlot({
  trip,
  getMedinaHotel,
  getMakkahHotel,
  listingFilter,
  preloadLead,
}: {
  trip: UmrahTrip;
  getMedinaHotel: (trip: UmrahTrip) => Hotel;
  getMakkahHotel: (trip: UmrahTrip) => Hotel;
  listingFilter: PeriodFilterKey;
  preloadLead: boolean;
}) {
  const [ref, inView] = useInView<HTMLLIElement>();

  return (
    <li ref={ref} data-trip-card className="flex min-h-0 min-w-0 max-w-full">
      <TripCard
        variant="grid"
        trip={trip}
        medina={getMedinaHotel(trip)}
        makkah={getMakkahHotel(trip)}
        listingFilter={listingFilter}
        galleryInView={inView}
        preloadLead={preloadLead && inView}
      />
    </li>
  );
}

/**
 * Responsive offer layout — chronological by default (Nächster Termin):
 * - Mobile: one card per row, stacked vertically (Trip 1 → Trip 2 → Trip 3 …)
 * - Tablet (md): 2 cards per row, same DOM order left-to-right then next row
 * - Desktop (lg): 3 cards per row
 */
export function UmrahListingGrid({
  trips,
  getMedinaHotel,
  getMakkahHotel,
  listingFilter = "all",
}: {
  trips: UmrahTrip[];
  getMedinaHotel: (trip: UmrahTrip) => Hotel;
  getMakkahHotel: (trip: UmrahTrip) => Hotel;
  listingFilter?: PeriodFilterKey;
}) {
  return (
    <ul
      className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3"
      data-scroll-region="offers"
      aria-label="Umrah Angebote"
    >
      {trips.map((trip, index) => (
        <CardSlot
          key={trip.id}
          trip={trip}
          getMedinaHotel={getMedinaHotel}
          getMakkahHotel={getMakkahHotel}
          listingFilter={listingFilter}
          preloadLead={index === 0}
        />
      ))}
    </ul>
  );
}
