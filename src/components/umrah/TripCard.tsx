"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Footprints, Languages, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { formatEuro } from "@/lib/utils";
import { AvailabilityBadge } from "@/components/umrah/AvailabilityBadge";

export function TripCard({
  trip,
  medina,
  makkah,
  variant = "grid",
}: {
  trip: UmrahTrip;
  medina: Hotel;
  makkah: Hotel;
  variant?: "grid" | "home" | "mobile-split";
}) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const [imgIndex, setImgIndex] = useState(0);
  const image = trip.images[imgIndex] ?? trip.images[0];

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + trip.images.length) % trip.images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % trip.images.length);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Image
          src={image.src}
          alt={image.caption}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute start-3 top-3 z-10 flex flex-col gap-1">
          <AvailabilityBadge trip={trip} />
        </div>
        <span className="absolute end-3 top-3 z-10 rounded-md bg-white/95 px-2 py-1 text-xs font-bold text-brand-cta">
          {tCommon("nights", { count: trip.nights })}
        </span>
        <span className="absolute bottom-3 start-3 z-10 rounded bg-black/55 px-2 py-1 text-xs text-white">
          {image.caption}
        </span>
        <button
          type="button"
          onClick={prev}
          className="absolute start-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute end-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </button>
        <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1">
          {trip.images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i === imgIndex ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-base font-bold text-navy">{trip.dateLabel}</p>
          <span className="shrink-0 text-sm text-muted">
            {tCommon("nights", { count: trip.nights })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <HotelMini
            hotel={medina}
            label={t("medina")}
            walking={t("walkingTo", { minutes: medina.walkingMinutes, mosque: t("nabawi") })}
          />
          <HotelMini
            hotel={makkah}
            label={t("makkah")}
            walking={t("walkingTo", { minutes: makkah.walkingMinutes, mosque: t("haram") })}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-navy/80">
          <Languages className="h-3.5 w-3.5 shrink-0 text-brand-orange" />
          <span>
            <span className="font-semibold">{t("guideLanguages")}: </span>
            {t("guideLanguagesValue")}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-[11px] leading-tight text-navy/70">
          <span>{t("visaIncl")}</span>
          <span>{t("flightIncl")}</span>
          <span>{t("baggageIncl")}</span>
          <span>{t("guideIncl")}</span>
          <span>{t("hotelsIncl")}</span>
          <span>{t("transferIncl")}</span>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2">
          <PriceBox label={t("room4")} price={trip.prices.quad} per={tCommon("perPerson")} />
          <PriceBox label={t("room3")} price={trip.prices.triple} per={tCommon("perPerson")} />
          <PriceBox label={t("room2")} price={trip.prices.double} per={tCommon("perPerson")} />
        </div>

        <Link
          href={`/umrah/gruppenreise/${trip.slug}`}
          className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-brand-cta px-4 py-3 text-sm font-semibold text-white hover:bg-navy"
        >
          {tCommon("moreInfoTrip")} →
        </Link>
      </div>
    </article>
  );
}

function HotelMini({
  hotel,
  label,
  walking,
}: {
  hotel: Hotel;
  label: string;
  walking: string;
}) {
  return (
    <div className="rounded-lg bg-surface p-2">
      <p className="font-semibold text-navy">
        {label} ({hotel.nights}N)
      </p>
      <p className="text-navy/80">
        {hotel.checkIn} – {hotel.checkOut}
      </p>
      <p className="mt-1 flex items-center gap-1 font-medium text-navy">
        {hotel.name}{" "}
        <span className="inline-flex text-brand-gold">
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-brand-gold text-brand-gold" />
          ))}
        </span>
      </p>
      <p className="mt-1 flex items-start gap-1 text-[10px] text-muted">
        <Footprints className="mt-0.5 h-3 w-3 shrink-0 text-brand-orange" />
        {walking}
      </p>
    </div>
  );
}

function PriceBox({
  label,
  price,
  per,
}: {
  label: string;
  price: number;
  per: string;
}) {
  return (
    <div className="rounded-lg border border-line px-1.5 py-2">
      <p className="text-[10px] leading-tight text-navy/70">{label}</p>
      <p className="text-sm font-bold text-brand-green">{formatEuro(price)}</p>
      <p className="text-[10px] text-muted">{per}</p>
    </div>
  );
}
