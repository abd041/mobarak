"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { resolveTrip } from "@/lib/trip-availability";
import type { PeriodFilterKey } from "@/lib/listing-period-filters";
import { AvailabilityBadge } from "@/components/umrah/AvailabilityBadge";
import { TripCardGallery } from "@/components/umrah/TripCardGallery";
import { TripCardHotelStays } from "@/components/umrah/TripCardHotelStays";
import { TripCardInclusions } from "@/components/umrah/TripCardInclusions";
import { TripCardNightsBadge } from "@/components/umrah/TripCardNightsBadge";
import { TripCardOfferCta } from "@/components/umrah/TripCardOfferCta";
import { TripCardPrices } from "@/components/umrah/TripCardPrices";
import { TripCardTravelDates } from "@/components/umrah/TripCardTravelDates";
import { cn } from "@/lib/utils";

const LISTING_CARD_SHELL =
  "flex h-full w-full min-h-0 min-w-0 max-w-full flex-col overflow-hidden rounded-[16px] border border-[#E8EBEF] bg-white shadow-[0_2px_10px_rgba(9,30,66,0.05)] md:rounded-[14px]";

/**
 * Umrah listing / homepage offer card.
 *
 * Listing layout:
 * - Mobile + desktop: vertical card — large swipeable gallery on top, compare block below
 * - Stacked cards on mobile for quick departure comparison
 *
 * Content hierarchy:
 * 1. Availability + nights (on image)
 * 2. Image gallery
 * 3. Travel dates
 * 4. Medina & Makkah hotels
 * 5. Included services
 * 6. Prices
 * 7. More information CTA
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
  /** Defer gallery images until the card is near the viewport (listing grid). */
  galleryInView?: boolean;
  /** High-priority preload for the first slide (first listing card only). */
  preloadLead?: boolean;
}) {
  const t = useTranslations("umrah");
  const [liveTrip, setLiveTrip] = useState(trip);
  const isListing = variant === "grid";

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
    <article
      data-offer-card
      className={cn(
        isListing
          ? LISTING_CARD_SHELL
          : "flex h-full flex-col overflow-hidden rounded-[14px] border border-[#E8EBEF] bg-white shadow-[0_6px_22px_rgba(9,30,66,0.07)]",
      )}
    >
      {/* 1–2 Availability + image */}
      <TripCardGallery
        images={liveTrip.images}
        prominence={isListing || variant === "home" ? "listing" : "default"}
        layout="default"
        galleryInView={galleryInView}
        preloadLead={preloadLead}
        nightsBadge={<TripCardNightsBadge trip={liveTrip} compact={isListing} />}
        badges={
          <div
            className={cn(
              "absolute z-10 flex flex-col gap-1",
              isListing ? "start-1.5 top-1.5 md:start-3 md:top-3 md:gap-1.5" : "start-3 top-3 gap-1.5",
            )}
          >
            <AvailabilityBadge trip={liveTrip} compact={isListing} />
            {liveTrip.departureAirport ? (
              <span
                className={cn(
                  "inline-flex w-fit shrink-0 whitespace-nowrap rounded-full border border-[#E8A23A]/55 bg-white/95 font-semibold leading-none text-brand-orange-ink shadow-sm",
                  isListing
                    ? "px-1.5 py-0.5 text-[9px] md:px-2.5 md:py-1 md:text-[11px]"
                    : "px-2.5 py-1 text-[11px]",
                )}
              >
                {t("flightsFrom", { airport: liveTrip.departureAirport })}
              </span>
            ) : null}
          </div>
        }
      />

      <div className={cn(isListing && "flex min-w-0 flex-1 flex-col")}>
        {/* 3 Travel dates */}
        <TripCardTravelDates trip={liveTrip} prominence={isListing ? "listing" : "default"} />

        {/* 4 Medina & Makkah */}
        <TripCardHotelStays
          trip={liveTrip}
          medina={medina}
          makkah={makkah}
          listingFilter={listingFilter}
          prominence={isListing ? "listing" : "default"}
        />

        {/* 5–7 Included services, prices, CTA — stacked like reference */}
        <TripCardInclusions
          trip={liveTrip}
          prominence={isListing || variant === "home" ? "listing" : "default"}
        />

        <div className="mt-auto flex flex-col gap-3 border-t border-[#EEF0F3] px-3 py-3 md:gap-3.5 md:px-4 md:py-4">
          <TripCardPrices
            trip={liveTrip}
            prominence={isListing || variant === "home" ? "listing" : "default"}
            embedded
            className="w-full"
          />
          <TripCardOfferCta
            trip={liveTrip}
            listingFilter={listingFilter}
            prominence={isListing || variant === "home" ? "listing" : "default"}
            fullWidth
          />
        </div>
      </div>
    </article>
  );
}
