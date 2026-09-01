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
  const compact = isListing || variant === "home";

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
        prominence={compact ? "listing" : "default"}
        layout="default"
        galleryInView={galleryInView}
        preloadLead={preloadLead}
        nightsBadge={<TripCardNightsBadge trip={liveTrip} compact={compact} />}
        badges={
          <div
            className={cn(
              "absolute z-10 flex flex-col gap-1",
              compact ? "start-2.5 top-2.5 md:start-[12px] md:top-[12px] md:gap-[6px]" : "start-[12px] top-[12px] gap-[6px]",
            )}
          >
            <AvailabilityBadge trip={liveTrip} compact={compact} />
            {liveTrip.departureAirport ? (
              <span
                className={cn(
                  "inline-flex w-fit shrink-0 whitespace-nowrap rounded-full border border-[#E8A23A]/55 bg-white/95 font-semibold leading-none text-brand-orange-ink shadow-sm",
                  compact
                    ? "px-[6px] py-[3px] text-[9px] md:px-[10px] md:py-[4px] md:text-[11px]"
                    : "px-[10px] py-[4px] text-[11px]",
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
        <TripCardTravelDates trip={liveTrip} prominence={compact ? "listing" : "default"} />

        {/* 4 Medina & Makkah */}
        <TripCardHotelStays
          trip={liveTrip}
          medina={medina}
          makkah={makkah}
          listingFilter={listingFilter}
          prominence={compact ? "listing" : "default"}
        />

        {/* 5–7 Included services, prices, CTA — stacked like reference */}
        <TripCardInclusions trip={liveTrip} prominence={compact ? "listing" : "default"} />

        <div className="mt-auto flex flex-col gap-3 border-t border-[#EEF0F3] px-4 py-3 md:gap-[14px] md:px-[16px] md:py-[16px]">
          <TripCardPrices
            trip={liveTrip}
            prominence={compact ? "listing" : "default"}
            embedded
            className="w-full"
          />
          <TripCardOfferCta
            trip={liveTrip}
            listingFilter={listingFilter}
            prominence={compact ? "listing" : "default"}
            fullWidth
          />
        </div>
      </div>
    </article>
  );
}
