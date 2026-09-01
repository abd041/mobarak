"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { DirArrow } from "@/components/ui/DirArrow";
import { HotelDetailsModal } from "@/components/umrah/detail/HotelDetailsModal";
import type { Hotel } from "@/data/mock";
import {
  formatHotelInfoLabel,
  getHotelInfoItems,
  type HotelInfoItem,
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

function infoIcon(item: HotelInfoItem) {
  if (item.id === "walking") return MapPin;
  return item.Icon;
}

/** Card footer highlights — walking, breakfast, wifi, reception (reference order). */
function getHotelCardHighlights(hotel: Hotel): HotelInfoItem[] {
  const all = getHotelInfoItems(hotel);
  const prefer = ["walking", "breakfast", "wifi", "reception", "ac", "restaurant"] as const;
  const picked: HotelInfoItem[] = [];
  for (const id of prefer) {
    const item = all.find((entry) => entry.id === id);
    if (!item) continue;
    picked.push(item);
    if (picked.length >= 4) break;
  }
  for (const item of all) {
    if (picked.length >= 4) break;
    if (!picked.some((entry) => entry.id === item.id)) picked.push(item);
  }
  return picked;
}

/** Hotel card — Medina / Makkah; layout matches approved reference (copy unchanged). */
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
  const infoItems = getHotelCardHighlights(hotel);

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
      <article className="flex h-full flex-col rounded-[20px] border border-[#EEF0F3] bg-white shadow-[0_12px_36px_rgba(9,36,92,0.1)]">
        {/* Hero image with title overlay (reference layout) */}
        <div
          className="relative aspect-[4/3] min-h-[260px] touch-pan-y overflow-hidden rounded-t-[20px] bg-surface sm:aspect-[16/9] sm:min-h-0"
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

          {/* Soft top-left wash for overlay copy */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white/75 to-transparent to-55%"
            aria-hidden
          />

          <div className="absolute inset-x-0 top-0 z-10 p-4 sm:p-5 lg:p-6">
            <span className="inline-flex rounded-full bg-[#1F7A3F] px-3 py-1 text-[11px] font-bold tracking-[0.02em] text-white sm:text-[12px]">
              {cityLabel} – {nightsLabel}
            </span>

            <h3 className="mt-3 max-w-[min(100%,22rem)] text-[22px] leading-[1.1] font-extrabold tracking-[-0.02em] text-[#051033] sm:mt-3.5 sm:text-[26px] lg:text-[28px]">
              {hotel.name}
            </h3>

            <div
              className="mt-2 flex items-center gap-0.5 text-[#D4A017]"
              aria-label={`${hotel.stars} stars`}
            >
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star
                  key={i}
                  className="h-[15px] w-[15px] fill-current sm:h-4 sm:w-4"
                  aria-hidden
                />
              ))}
            </div>

            <p className="mt-2.5 flex items-center gap-2 text-[13px] font-semibold text-[#051033] sm:text-[14px]">
              <CalendarDays
                className="h-4 w-4 shrink-0 text-[#051033]"
                strokeWidth={1.75}
                aria-hidden
              />
              {stay.dateLabel}
            </p>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={tCommon("previousImage")}
                className="absolute top-1/2 start-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy shadow-[0_4px_14px_rgba(9,36,92,0.14)] transition hover:bg-white sm:h-11 sm:w-11"
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={tCommon("nextImage")}
                className="absolute top-1/2 end-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy shadow-[0_4px_14px_rgba(9,36,92,0.14)] transition hover:bg-white sm:h-11 sm:w-11"
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails + more photos */}
        <div
          className={cn(
            "grid gap-2 px-4 pt-4 sm:gap-2.5 sm:px-5 sm:pt-5",
            extraPhotos > 0 ? "grid-cols-5" : "grid-cols-4",
          )}
        >
          {thumbs.map((img, i) => (
            <button
              key={`${hotel.id}-thumb-${i}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={img.caption}
              aria-current={active === i ? "true" : undefined}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cta",
                active === i ? "ring-2 ring-brand-cta" : "ring-1 ring-[#E6E9EE]",
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

          {extraPhotos > 0 ? (
            <button
              type="button"
              onClick={() => goTo(active >= THUMB_COUNT ? active + 1 : THUMB_COUNT)}
              aria-label={t("morePhotos", { count: extraPhotos })}
              aria-current={active >= THUMB_COUNT ? "true" : undefined}
              className={cn(
                "flex aspect-[4/3] items-center justify-center rounded-xl border bg-white px-1 text-center text-[11px] font-bold text-brand-cta transition hover:bg-[#F5F9FD] sm:text-[12px]",
                active >= THUMB_COUNT
                  ? "border-brand-cta ring-2 ring-brand-cta"
                  : "border-brand-cta/50",
              )}
            >
              {t("morePhotos", { count: extraPhotos })}
            </button>
          ) : null}
        </div>

        {/* Amenities — equal-width columns, uniform horizontal gap */}
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-[#EEF0F3] px-4 pt-4 sm:mt-5 sm:gap-x-6 sm:gap-y-4 sm:px-5 sm:pt-5 lg:grid-cols-4">
          {infoItems.map((item) => {
            const Icon = infoIcon(item);
            return (
              <li key={item.id} className="flex min-w-0 flex-1 items-start gap-2.5">
                <Icon
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#051033]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="min-w-0 text-[12px] leading-snug font-semibold text-[#051033] sm:text-[13px]">
                  {formatHotelInfoLabel(t, item)}
                </span>
              </li>
            );
          })}
        </ul>

        {/* CTA — Hotelgalerie & Details */}
        <div className="mt-auto p-4 pt-5 sm:p-5 sm:pt-6">
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-[14px] border border-brand-cta bg-white px-4 text-[14px] font-bold text-brand-cta transition hover:bg-[#F5F9FD]"
          >
            <span className="inline-flex items-center gap-1">
              {t("hotelDetails")}
              <DirArrow />
            </span>
          </button>
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
