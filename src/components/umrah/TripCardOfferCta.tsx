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
  fullWidth?: boolean;
}) {
  const tCommon = useTranslations("common");
  const isListing = prominence === "listing";

  return (
    <Link
      href={buildTripOfferFlowHref(trip, listingFilter)}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1264F5] font-bold text-white shadow-[0_2px_8px_rgba(18,100,245,0.28)] transition hover:bg-[#0F56D6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1264F5]",
        isListing
          ? "min-h-[40px] w-full px-3 py-2.5 text-[12px] leading-snug md:min-h-[42px] md:text-[13px]"
          : "min-h-[46px] w-full px-4 py-3 text-[14px]",
        fullWidth && "w-full",
      )}
    >
      {tCommon("moreInfoTrip")}
      <DirArrow />
    </Link>
  );
}
