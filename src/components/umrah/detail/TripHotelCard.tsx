"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Libre_Baskerville } from "next/font/google";
import { useTranslations } from "next-intl";
import {
  CalendarDays,
  MapPin,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { DirArrow } from "@/components/ui/DirArrow";
import { HotelDetailsModal } from "@/components/umrah/detail/HotelDetailsModal";
import type { Hotel } from "@/data/mock";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

const hotelTitle = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const ICON_DARK = "#1A1A1A";
const THUMB_COUNT = 3;

type Stay = {
  nights: number;
  dateLabel: string;
  checkIn?: string;
  checkOut?: string;
};

/**
 * Hotel card — always matches reference:
 * copy left + soft-faded hero right, 3 thumbs + CTA below.
 */
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
  const images = hotel.images.length
    ? hotel.images
    : [{ src: "/brand/hero-bg.png", caption: hotel.name }];
  const [active, setActive] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const main = images[Math.min(active, images.length - 1)]!;
  const thumbs = (images.length > 1 ? images.slice(1) : images).slice(0, THUMB_COUNT);

  const walkingLabel = t("hotelCardWalking", {
    minutes: hotel.walkingMinutes,
    mosque: t("mosqueHaramShort"),
  });
  const highlightLabel =
    hotel.city === "makkah" ? t("hotelCardHighlightMakkah") : t("hotelCardHighlightMedina");

  const infoRows = [
    { id: "dates", Icon: CalendarDays, label: stay.dateLabel, bold: true },
    { id: "walking", Icon: MapPin, label: walkingLabel, bold: false },
    ...(hotel.breakfast
      ? [{ id: "breakfast", Icon: UtensilsCrossed, label: t("breakfast"), bold: false }]
      : []),
    { id: "highlight", Icon: Star, label: highlightLabel, bold: false },
  ] as const;

  const closeDetails = useCallback(() => setDetailsOpen(false), []);

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % images.length) + images.length) % images.length);
    },
    [images.length],
  );

  return (
    <>
      <article className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[#E8ECF0] bg-white shadow-[0_8px_28px_rgba(9,36,92,0.08)]">
        {/* Top — always side-by-side like reference */}
        <div className="relative flex min-h-0 flex-1 items-stretch overflow-hidden">
          <div className="relative z-10 flex w-[54%] min-w-0 flex-col bg-white px-3.5 pt-3.5 pb-2 sm:w-[52%] sm:px-5 sm:pt-5 sm:pb-3 lg:pe-1">
            <span className="inline-flex w-fit rounded-md bg-[#E8B84B] px-2 py-0.5 text-[10px] font-bold text-black sm:px-2.5 sm:py-1 sm:text-[12px]">
              {cityLabel} - {nightsLabel}
            </span>

            <h3
              className={cn(
                hotelTitle.className,
                "mt-2 m-0 text-[1.05rem] leading-[1.15] font-bold tracking-[-0.01em] text-[#111111] sm:mt-3 sm:text-[1.45rem] lg:text-[1.55rem]",
              )}
            >
              {hotel.name}
            </h3>

            <div
              className="mt-1.5 flex items-center gap-0.5 text-[#E8B84B] sm:mt-2"
              aria-label={`${hotel.stars} stars`}
            >
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-current sm:h-[15px] sm:w-[15px]"
                  aria-hidden
                />
              ))}
            </div>

            <ul className="mt-2.5 space-y-1.5 p-0 sm:mt-4 sm:space-y-2.5">
              {infoRows.map(({ id, Icon, label, bold }) => (
                <li key={id} className="flex items-start gap-1.5 sm:gap-2.5">
                  <Icon
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                    style={{ color: ICON_DARK }}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "min-w-0 text-[11px] leading-snug text-[#111111] sm:text-[13px]",
                      bold ? "font-bold" : "font-medium",
                    )}
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hero — overlaps under copy so no seam line; soft left fade */}
          <div className="relative -ms-6 w-[calc(46%+1.5rem)] min-w-0 min-h-[11.5rem] self-stretch overflow-hidden sm:-ms-8 sm:w-[calc(48%+2rem)] sm:min-h-[15rem] lg:min-h-[16rem]">
            <Image
              key={main.src}
              src={main.src}
              alt={main.caption || hotel.name}
              fill
              className="object-cover object-center"
              sizes="(max-width:640px) 50vw, 50vw"
              quality={IQ.content}
              priority={active === 0}
            />
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background:
                  "linear-gradient(90deg, #ffffff 0%, #ffffff 10%, rgba(255,255,255,0.85) 22%, rgba(255,255,255,0.4) 38%, rgba(255,255,255,0) 55%)",
              }}
            />
          </div>
        </div>

        {/* Bottom — 3 thumbs + CTA */}
        <div className="flex items-center gap-2 px-3.5 pb-3.5 pt-2 sm:gap-3 sm:px-5 sm:pb-5 sm:pt-1">
          <div className="grid min-w-0 flex-1 grid-cols-3 gap-1.5 sm:gap-2">
            {thumbs.map((img, i) => {
              const imageIndex = images.length > 1 ? i + 1 : i;
              const selected = active === imageIndex;
              return (
                <button
                  key={`${hotel.id}-thumb-${i}`}
                  type="button"
                  onClick={() => goTo(imageIndex)}
                  aria-label={img.caption}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-[7px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1264F5]",
                    selected ? "ring-2 ring-[#1264F5]" : "ring-1 ring-[#E6E9EE]",
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
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-0.5 rounded-[8px] border border-[#1264F5] bg-white px-2 text-[11px] font-bold whitespace-nowrap text-[#1264F5] transition hover:bg-[#F5F9FD] sm:h-[46px] sm:gap-1 sm:px-4 sm:text-[14px]"
          >
            <span className="inline-flex items-center gap-0.5 sm:gap-1">
              {t("hotelViewCta")}
              <DirArrow className="ms-0 scale-90 sm:scale-100" />
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
