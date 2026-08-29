"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DirArrow } from "@/components/ui/DirArrow";
import type { UmrahTrip } from "@/data/mock";
import type { PeriodFilterKey } from "@/lib/listing-period-filters";
import { buildTripOfferFlowHref } from "@/lib/trip-flow";
import { cn } from "@/lib/utils";

/** Primary CTA on listing cards — sole main navigation to the departure offer page. */
export function TripCardOfferCta({
  trip,
  listingFilter = "all",
  prominence = "default",
  fullWidth = false,
}: {
  trip: UmrahTrip;
  listingFilter?: PeriodFilterKey;
  prominence?: "listing" | "default";
  /** Full-width CTA on listing cards — easier tap target between departures. */
  fullWidth?: boolean;
}) {
  const tCommon = useTranslations("common");
  const isListing = prominence === "listing";

  return (
    <Link
      href={buildTripOfferFlowHref(trip, listingFilter)}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-cta font-bold text-white shadow-[0_2px_8px_rgba(30,90,156,0.28)] transition hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta",
        isListing
          ? "min-h-11 w-full px-4 py-3 text-[13px] leading-snug md:min-h-[48px] md:text-[14px]"
          : "min-h-11 w-full gap-1.5 px-4 py-3.5 text-[14px] sm:min-h-[52px] sm:text-[15px]",
        fullWidth && "w-full",
      )}
    >
      {tCommon("moreInfoTrip")}
      <DirArrow />
    </Link>
  );
}
