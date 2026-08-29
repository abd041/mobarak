"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CalendarDays, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { DirArrow } from "@/components/ui/DirArrow";
import { Button } from "@/components/ui/Button";
import { HotelDetailsModal } from "@/components/umrah/detail/HotelDetailsModal";
import type { Hotel } from "@/data/mock";
import {
  formatHotelInfoLabel,
  getHotelInfoItems,
} from "@/lib/hotel-amenities";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

const THUMB_COUNT = 4;
const SWIPE_THRESHOLD = 48;

type Stay = {
  nights: number;
  dateLabel: string;
  checkIn?: string;
  checkOut?: string;
};

/** Hotel card — Medina / Makkah main section below hero. */
export function TripHotelCard({
  hotel,
  stay,
  cityLabel,
  nightsLabel,
  checkInLabel,
  checkOutLabel,
}: {
  hotel: Hotel;
  stay: Stay;
  cityLabel: string;
  nightsLabel: string;
  checkInLabel?: string;
  checkOutLabel?: string;
}) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const images = hotel.images.length
    ? hotel.images
    : [{ src: "/brand/hero-bg.png", caption: hotel.name }];
  const [active, setActive] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const main = images[Math.min(active, images.length - 1)]!;
  const extraPhotos = Math.max(0, images.length - THUMB_COUNT);
  const thumbs = images.slice(0, THUMB_COUNT);
  const infoItems = getHotelInfoItems(hotel);

  const closeDetails = useCallback(() => setDetailsOpen(false), []);

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % images.length) + images.length) % images.length);
    },
    [images.length],
  );

  const go = useCallback(
    (dir: -1 | 1) => goTo(active + dir),
    [active, goTo],
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const diff = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;
    if (diff > 0) go(-1);
    else go(1);
  };

  return (
    <>
      <article className="mobarak-card flex h-full flex-col overflow-hidden">
        {/* City, hotel name, stars, dates */}
        <div className="border-b border-line px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-[14px] font-bold text-brand-green sm:text-[15px]">
            {cityLabel} – {nightsLabel}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-[22px] leading-tight font-bold text-navy sm:text-[24px]">
              {hotel.name}
            </h3>
            <div
              className="flex items-center gap-0.5 text-brand-gold"
              aria-label={`${hotel.stars} stars`}
            >
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current sm:h-[18px] sm:w-[18px]" aria-hidden />
              ))}
            </div>
          </div>

          <p className="mt-2.5 flex items-center gap-2 text-[13px] font-medium text-navy sm:text-[14px]">
            <CalendarDays className="h-4 w-4 shrink-0 text-brand-cta" strokeWidth={1.75} aria-hidden />
            {stay.dateLabel}
          </p>
        </div>

        {/* Gallery — main image, thumbnails, hotel info */}
        <div className="border-b border-line">
          <div
            className="relative aspect-[16/10] touch-pan-y bg-surface"
            aria-roledescription="carousel"
            aria-label={t("hotelGalleryLabel", { hotel: hotel.name })}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              key={main.src}
              src={main.src}
              alt={main.caption || hotel.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              quality={IQ.content}
              priority={active === 0}
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={tCommon("previousImage")}
                  className="absolute top-1/2 start-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy shadow-card transition hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={tCommon("nextImage")}
                  className="absolute top-1/2 end-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy shadow-card transition hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2 px-4 py-4 sm:px-5">
            {thumbs.map((img, i) => (
              <button
                key={`${hotel.id}-thumb-${i}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={img.caption}
                aria-current={active === i ? "true" : undefined}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cta",
                  active === i ? "ring-2 ring-brand-cta" : "ring-1 ring-line",
                )}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100px"
                  quality={IQ.thumb}
                />
              </button>
            ))}

            {extraPhotos > 0 && (
              <button
                type="button"
                onClick={() => goTo(active >= THUMB_COUNT ? active + 1 : THUMB_COUNT)}
                aria-label={t("morePhotos", { count: extraPhotos })}
                aria-current={active >= THUMB_COUNT ? "true" : undefined}
                className={cn(
                  "flex aspect-[4/3] items-center justify-center rounded-lg border bg-surface px-1 text-center text-[11px] font-bold text-brand-cta transition hover:border-brand-cta hover:bg-white sm:text-[12px]",
                  active >= THUMB_COUNT
                    ? "border-brand-cta ring-2 ring-brand-cta"
                    : "border-brand-cta/40",
                )}
              >
                {t("morePhotos", { count: extraPhotos })}
              </button>
            )}
          </div>

          <ul className="space-y-3 border-t border-line px-4 py-4 sm:px-5 sm:py-5">
            {infoItems.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5">
                <item.Icon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]",
                    item.primary ? "text-brand-cta" : "text-brand-cta/80",
                  )}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span
                  className={cn(
                    "text-[13px] leading-snug sm:text-[14px]",
                    item.primary ? "font-semibold text-navy" : "font-medium text-muted",
                  )}
                >
                  {formatHotelInfoLabel(t, item)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <Button
            variant="outline"
            fullWidth
            onClick={() => setDetailsOpen(true)}
            className="mt-auto min-h-11 text-[13px]"
          >
            {t("hotelDetails")}
            <DirArrow />
          </Button>
        </div>
      </article>

      <HotelDetailsModal
        hotel={hotel}
        stay={stay}
        cityLabel={cityLabel}
        nightsLabel={nightsLabel}
        checkInLabel={checkInLabel}
        checkOutLabel={checkOutLabel}
        open={detailsOpen}
        onClose={closeDetails}
      />
    </>
  );
}
