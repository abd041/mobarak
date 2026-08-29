"use client";

import { Container } from "@/components/ui/Container";
import { UmrahListingResultCount } from "@/components/umrah/UmrahListingResultCount";
import { UmrahListingSort } from "@/components/umrah/UmrahListingSort";
import type { TripListingSortKey } from "@/lib/trip-listing-sort";

/** Result count (left) + sort dropdown (right) — below the filter bar. */
export function UmrahListingMetaBar({
  resultCount,
  sort,
  onSortChange,
  showSort = true,
}: {
  resultCount: number;
  sort: TripListingSortKey;
  onSortChange: (sort: TripListingSortKey) => void;
  showSort?: boolean;
}) {
  return (
    <div className="border-b border-line bg-white">
      <Container className="flex min-w-0 flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-3.5">
        <UmrahListingResultCount count={resultCount} className="mt-0" />
        {showSort ? <UmrahListingSort sort={sort} onSortChange={onSortChange} /> : null}
      </Container>
    </div>
  );
}
