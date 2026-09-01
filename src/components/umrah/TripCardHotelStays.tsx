"use client";

import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DirArrow } from "@/components/ui/DirArrow";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { getTripHotelStayDateLabels } from "@/lib/trip-inquiry";
import type { PeriodFilterKey } from "@/lib/listing-period-filters";
import { buildTripOfferFlowHref } from "@/lib/trip-flow";
import { cn } from "@/lib/utils";

function HotelStars({ count, compact = false }: { count: number; compact?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-px" aria-label={`${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "fill-brand-gold text-brand-orange-cta",
            compact ? "h-[11px] w-[11px] md:h-[12px] md:w-[12px]" : "h-[12px] w-[12px]",
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

function StayColumn({
  cityLabel,
  nightsLabel,
  dateLabel,
  hotelName,
  stars,
  detailsHref,
  detailsLabel,
  prominence = "default",
}: {
  cityLabel: string;
  nightsLabel: string;
  dateLabel: string;
  hotelName: string;
  stars: number;
  detailsHref: string;
  detailsLabel: string;
  prominence?: "listing" | "default";
}) {
  const t = useTranslations("umrah");
  const isListing = prominence === "listing";

  return (
    <div
      className={cn(
        "min-w-0",
        isListing
          ? "px-3.5 py-3 md:px-[14px] md:py-[14px]"
          : "ps-[22px] pe-[12px] py-[14px] sm:px-[16px] sm:py-[16px]",
      )}
    >
      <p
        className={cn(
          "break-words font-extrabold leading-tight text-[#0A1B3D]",
          isListing ? "text-[13px] md:text-[14px]" : "text-[14px] sm:text-[15px]",
        )}
      >
        {t("cardCityStay", { city: cityLabel, nights: nightsLabel })}
      </p>
      <p
        className={cn(
          "mt-[4px] break-words font-medium leading-snug text-[#0A1B3D]",
          isListing ? "text-[11px] md:text-[12px]" : "text-[12px] sm:text-[13px]",
        )}
      >
        {dateLabel}
      </p>
      <div className="mt-[6px] flex min-w-0 flex-wrap items-center gap-x-[6px] gap-y-[2px]">
        <span
          className={cn(
            "min-w-0 break-words font-semibold leading-tight text-[#0A1B3D]",
            isListing ? "text-[12px] md:text-[13px]" : "text-[13px] sm:text-[14px]",
          )}
        >
          {hotelName}
        </span>
        <HotelStars count={stars} compact={isListing} />
      </div>
      {!isListing ? (
        <Link
          href={detailsHref}
          className="mt-[6px] inline-block text-[11px] font-semibold text-[#1E5A9C] hover:underline"
        >
          {detailsLabel} <DirArrow />
        </Link>
      ) : null}
    </div>
  );
}

export function TripCardHotelStays({
  trip,
  medina,
  makkah,
  listingFilter = "all",
  prominence = "default",
}: {
  trip: UmrahTrip;
  medina: Hotel;
  makkah: Hotel;
  listingFilter?: PeriodFilterKey;
  prominence?: "listing" | "default";
}) {
  const locale = useLocale();
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const stayDates = getTripHotelStayDateLabels(trip, locale);
  const detailsHref = buildTripOfferFlowHref(trip, listingFilter);

  const medinaDateLabel = stayDates.medina || trip.medinaStay.dateLabel || "—";
  const makkahDateLabel = stayDates.makkah || trip.makkahStay.dateLabel || "—";

  return (
    <div className="grid min-w-0 grid-cols-2 divide-x divide-[#EEF0F3] border-b border-[#EEF0F3]">
      <StayColumn
        cityLabel={t("medina")}
        nightsLabel={tCommon("nights", { count: trip.medinaStay.nights })}
        dateLabel={medinaDateLabel}
        hotelName={medina.name}
        stars={medina.stars}
        detailsHref={detailsHref}
        detailsLabel={t("hotelDetailsShort")}
        prominence={prominence}
      />
      <StayColumn
        cityLabel={t("makkah")}
        nightsLabel={tCommon("nights", { count: trip.makkahStay.nights })}
        dateLabel={makkahDateLabel}
        hotelName={makkah.name}
        stars={makkah.stars}
        detailsHref={detailsHref}
        detailsLabel={t("hotelDetailsShort")}
        prominence={prominence}
      />
    </div>
  );
}
