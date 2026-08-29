"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OFFER_HERO_SLIDES } from "@/lib/offer-hero-slides";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 48;

export function TripOfferHeroSlider({
  active,
  onChange,
}: {
  active: number;
  onChange: (index: number) => void;
}) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const touchStartX = useRef<number | null>(null);
  const total = OFFER_HERO_SLIDES.length;

  const goTo = useCallback(
    (index: number) => {
      const clamped = ((index % total) + total) % total;
      onChange(clamped);
    },
    [onChange, total],
  );

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const diff = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;
    if (diff > 0) goPrev();
    else goNext();
  };

  return (
    <div
      className="absolute inset-0 touch-pan-y"
      aria-roledescription="carousel"
      aria-label={t("heroSliderLabel")}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {OFFER_HERO_SLIDES.map((slide, index) => {
        const isActive = index === active;

        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              isActive ? "z-[1] opacity-100" : "z-0 opacity-0",
            )}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.src}
              alt={t(slide.altKey)}
              fill
              priority={index <= 1}
              quality={85}
              sizes="100vw"
              draggable={false}
              className="offer-hero-image pointer-events-none object-cover object-center select-none lg:object-[center_42%]"
            />
          </div>
        );
      })}

      <div className="offer-hero-fade pointer-events-none absolute inset-0 z-[2] hidden lg:block" aria-hidden />
      <div className="offer-hero-mobile-scrim pointer-events-none absolute inset-0 z-[2] lg:hidden" aria-hidden />

      {/* Slider controls */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <button
          type="button"
          onClick={goPrev}
          className="offer-hero-slider-prev pointer-events-auto absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy shadow-card transition hover:bg-white sm:h-12 sm:w-12"
          aria-label={tCommon("previousImage")}
        >
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden />
        </button>

        <button
          type="button"
          onClick={goNext}
          className="offer-hero-slider-next pointer-events-auto absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy shadow-card transition hover:bg-white sm:h-12 sm:w-12"
          aria-label={tCommon("nextImage")}
        >
          <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
        </button>

        <div
          className="pointer-events-auto absolute inset-x-0 bottom-4 flex justify-center gap-2 sm:bottom-5"
          role="tablist"
          aria-label={t("heroSliderDots")}
        >
          {OFFER_HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={tCommon("goToImage", { n: index + 1 })}
              onClick={() => goTo(index)}
              className="flex h-7 w-7 items-center justify-center rounded-full"
            >
              <span
                className={cn(
                  "block rounded-full transition-all",
                  index === active
                    ? "h-2 w-2 bg-[var(--mobarak-primary)]"
                    : "h-2 w-2 bg-white/85 shadow-sm",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
