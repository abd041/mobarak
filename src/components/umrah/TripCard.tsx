"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { resolveTrip } from "@/lib/trip-availability";
import type { PeriodFilterKey } from "@/lib/listing-period-filters";
import { AvailabilityBadge } from "@/components/umrah/AvailabilityBadge";
import { TripCardGallery } from "@/components/umrah/TripCardGallery";
import { TripCardGuideLanguages } from "@/components/umrah/TripCardGuideLanguages";
import { TripCardHotelStays } from "@/components/umrah/TripCardHotelStays";
import { TripCardInclusions } from "@/components/umrah/TripCardInclusions";
import { TripCardOfferCta } from "@/components/umrah/TripCardOfferCta";
import { TripCardPrices } from "@/components/umrah/TripCardPrices";
import { TripCardTravelDates } from "@/components/umrah/TripCardTravelDates";
import { TripOfferBadges } from "@/components/umrah/TripOfferBadges";
import { cn } from "@/lib/utils";

const CARD_SHELL =
  "trip-offer-card flex h-full w-full min-h-0 min-w-0 max-w-full flex-col overflow-hidden rounded-xl border border-[#E8EBEF] bg-white shadow-[0_2px_12px_rgba(11,44,74,0.06)]";

/**
 * Umrah listing / homepage offer card — matches approved reference layout.
 */
export function TripCard({
  trip,
  medina,
  makkah,
  variant = "grid",
  listingFilter = "all",
  galleryInView,
  preloadLead,
}: {
  trip: UmrahTrip;
  medina: Hotel;
  makkah: Hotel;
  variant?: "grid" | "home" | "mobile-split";
  listingFilter?: PeriodFilterKey;
  galleryInView?: boolean;
  preloadLead?: boolean;
}) {
  const [liveTrip, setLiveTrip] = useState(trip);
  const isListing = variant === "grid";
  const prominence = isListing || variant === "home" ? "listing" : "default";

  useEffect(() => {
    const sync = () => setLiveTrip(resolveTrip(trip));
    sync();
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener("storage", sync);
    };
  }, [trip]);

  return (
    <article data-offer-card className={CARD_SHELL}>
      <TripCardGallery
        images={liveTrip.images}
        tripId={liveTrip.id}
        prominence={prominence}
        layout="default"
        galleryInView={galleryInView}
        preloadLead={preloadLead}
        badges={
          <div
            className={cn(
              "absolute z-10 flex flex-col gap-0.5",
              "start-2 top-2 md:start-2.5 md:top-2.5 md:gap-1",
            )}
          >
            <AvailabilityBadge trip={liveTrip} compact={prominence === "listing"} />
            <TripOfferBadges trip={liveTrip} compact={prominence === "listing"} />
          </div>
        }
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TripCardTravelDates trip={liveTrip} prominence={prominence} />

        <TripCardHotelStays
          trip={liveTrip}
          medina={medina}
          makkah={makkah}
          listingFilter={listingFilter}
          prominence={prominence}
        />

        <TripCardInclusions trip={liveTrip} prominence={prominence} />

        <TripCardGuideLanguages trip={liveTrip} prominence={prominence} />

        <div className="mt-auto flex flex-col gap-2 bg-white px-3 py-2.5 md:gap-2.5 md:px-3.5 md:py-3">
          <TripCardPrices trip={liveTrip} prominence={prominence} embedded className="w-full" />
          <TripCardOfferCta
            trip={liveTrip}
            listingFilter={listingFilter}
            prominence={prominence}
            fullWidth
          />
        </div>
      </div>
    </article>
  );
}
