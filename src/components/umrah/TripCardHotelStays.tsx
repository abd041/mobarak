"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Footprints, Star } from "lucide-react";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { getTripHotelStayDateLabels } from "@/lib/trip-inquiry";
import type { PeriodFilterKey } from "@/lib/listing-period-filters";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

function HotelStars({ count }: { count: number }) {
  return (
    <span className="mt-0.5 inline-flex shrink-0 items-center gap-px" aria-label={`${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="h-2.5 w-2.5 fill-[#FFB800] text-[#FFB800] md:h-3 md:w-3"
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
  hotel,
  prominence = "default",
}: {
  cityLabel: string;
  nightsLabel: string;
  dateLabel: string;
  hotel: Hotel;
  prominence?: "listing" | "default";
}) {
  const t = useTranslations("umrah");
  const isListing = prominence === "listing";
  const thumb =
    hotel.images[0]?.src ||
    (hotel.city === "medina" ? "/brand/offer-hero/hero-bg-2.png" : "/brand/offer-hero/hero-bg-3.png");
  const walkingLabel =
    hotel.mosque === "nabawi"
      ? t("cardWalkingNabawi", { minutes: hotel.walkingMinutes })
      : t("cardWalkingHaram", { minutes: hotel.walkingMinutes });

  return (
    <div className={cn("min-w-0 bg-white px-2.5 py-2.5", isListing && "md:px-3 md:py-2.5")}>
      <p
        className={cn(
          "leading-tight text-[#0A1B3D]",
          isListing ? "text-[12px] md:text-[13px]" : "text-[13px]",
        )}
      >
        <span className="font-extrabold">{cityLabel}</span>
        <span className="font-semibold"> ({nightsLabel})</span>
      </p>
      <p
        className={cn(
          "mt-0.5 font-normal leading-snug text-[#0A1B3D]",
          isListing ? "text-[10px] md:text-[11px]" : "text-[11px]",
        )}
      >
        {dateLabel}
      </p>

      <div className="mt-1.5 flex items-start gap-1.5 md:gap-2">
        <div className="relative h-[56px] w-[44px] shrink-0 overflow-hidden rounded-lg bg-[#EEF0F3] md:h-[60px] md:w-[48px]">
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover object-center"
            sizes="48px"
            quality={IQ.thumb}
          />
        </div>

        <div className="min-w-0 flex-1 pt-0">
          <p
            className={cn(
              "break-words font-bold leading-tight text-[#0A1B3D]",
              isListing ? "text-[11px] md:text-[12px]" : "text-[12px]",
            )}
          >
            {hotel.name}
          </p>
          <HotelStars count={hotel.stars} />
          <span className="mt-1 inline-flex max-w-full items-start gap-0.5 rounded-md border border-[#F0E4D4]/70 bg-[#FFF5E6] px-1.5 py-0.5 text-[8px] font-semibold leading-[1.3] text-[#6B4E16] md:text-[9px]">
            <Footprints className="mt-px h-2.5 w-2.5 shrink-0 text-[#6B4E16]" strokeWidth={2.5} aria-hidden />
            <span className="min-w-0">{walkingLabel}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function TripCardHotelStays({
  trip,
  medina,
  makkah,
  listingFilter: _listingFilter = "all",
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

  const medinaDateLabel = stayDates.medina || trip.medinaStay.dateLabel || "—";
  const makkahDateLabel = stayDates.makkah || trip.makkahStay.dateLabel || "—";

  return (
    <div className="grid min-w-0 grid-cols-2 divide-x divide-[#EEEEEE] border-b border-[#EEEEEE] bg-white">
      <StayColumn
        cityLabel={t("medina")}
        nightsLabel={tCommon("nights", { count: trip.medinaStay.nights })}
        dateLabel={medinaDateLabel}
        hotel={medina}
        prominence={prominence}
      />
      <StayColumn
        cityLabel={t("makkah")}
        nightsLabel={tCommon("nights", { count: trip.makkahStay.nights })}
        dateLabel={makkahDateLabel}
        hotel={makkah}
        prominence={prominence}
      />
    </div>
  );
}
