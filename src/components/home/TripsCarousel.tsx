"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TripCard } from "@/components/umrah/TripCard";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { getHotel } from "@/data/mock";
import { resolveHotel } from "@/lib/hotel-catalog";

export function TripsCarousel({ trips }: { trips: UmrahTrip[] }) {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const isRtl = locale === "ar";
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const ordered = isRtl ? [...trips].reverse() : trips;

  const syncActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>("[data-trip-card]")];
    if (!cards.length) return;
    const left = el.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - left);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncActiveFromScroll();
    el.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    window.addEventListener("resize", syncActiveFromScroll);
    return () => {
      el.removeEventListener("scroll", syncActiveFromScroll);
      window.removeEventListener("resize", syncActiveFromScroll);
    };
  }, [isRtl, ordered.length, syncActiveFromScroll]);

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const count = ordered.length;
    if (count === 0) return;
    const clamped = ((index % count) + count) % count;
    const card = el.querySelectorAll<HTMLElement>("[data-trip-card]")[clamped];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setActive(clamped);
  };

  return (
    <div
      className="relative overflow-visible"
      role="region"
      aria-roledescription="carousel"
      aria-label={tCommon("tripsCarousel")}
    >
      <button
        type="button"
        onClick={() => goTo(active - 1)}
        className="absolute start-1 top-[42%] z-30 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-navy shadow-md transition hover:bg-surface sm:start-0 md:-start-3 lg:-start-2 xl:-start-5"
        aria-label={tCommon("previousTrips")}
      >
        <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => goTo(active + 1)}
        className="absolute end-1 top-[42%] z-30 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-navy shadow-md transition hover:bg-surface sm:end-0 md:-end-3 lg:-end-2 xl:-end-5"
        aria-label={tCommon("nextTrips")}
      >
        <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
      </button>

      <div className="-mx-4 overflow-x-clip px-0 sm:mx-0 sm:overflow-visible">
        <div
          ref={scrollerRef}
          dir="ltr"
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pt-1 pb-2 sm:gap-5 sm:px-1"
          tabIndex={0}
          aria-live="polite"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              goTo(active - 1);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              goTo(active + 1);
            }
          }}
        >
          {ordered.map((trip) => {
            const medina = resolveHotel(getHotel(trip.medinaHotelId) as Hotel);
            const makkah = resolveHotel(getHotel(trip.makkahHotelId) as Hotel);
            return (
              <div
                key={trip.id}
                data-trip-card
                className="w-[calc(100%-1.75rem)] shrink-0 snap-start sm:w-[min(100%,360px)] lg:w-[calc((100%-2.5rem)/3)]"
                onTouchStart={(e) => {
                  if ((e.target as HTMLElement).closest("[data-trip-card-gallery]")) {
                    e.stopPropagation();
                  }
                }}
                onTouchMove={(e) => {
                  if ((e.target as HTMLElement).closest("[data-trip-card-gallery]")) {
                    e.stopPropagation();
                  }
                }}
              >
                <TripCard trip={trip} medina={medina} makkah={makkah} variant="home" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-1 sm:mt-6" dir="ltr" role="tablist">
        {ordered.map((trip, i) => (
          <button
            key={trip.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={tCommon("goToTrip", { n: i + 1 })}
            aria-current={i === active ? "true" : undefined}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full sm:h-8 sm:w-8"
          >
            <span
              className={`block rounded-full transition-all ${
                i === active
                  ? "h-2.5 w-2.5 bg-brand-orange-cta"
                  : "h-2 w-2 bg-navy/25 hover:bg-navy/45"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
