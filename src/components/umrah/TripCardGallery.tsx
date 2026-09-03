"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Heart, MapPin } from "lucide-react";
import type { TripImage } from "@/data/mock";
import { useTouchAxisScroll } from "@/hooks/useTouchAxisScroll";
import { cn } from "@/lib/utils";
import { IQ, getTripCardGallerySizes, shouldLoadGallerySlide } from "@/lib/images";

const WISHLIST_KEY = "mobarak.tripWishlist";

function readWishlist(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeWishlist(ids: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify([...ids]));
}

export function TripCardGallery({
  images,
  badges,
  tripId,
  prominence = "default",
  layout = "default",
  galleryInView = true,
  preloadLead = false,
}: {
  images: TripImage[];
  badges?: React.ReactNode;
  tripId?: string;
  prominence?: "listing" | "default";
  layout?: "default" | "listing-split";
  galleryInView?: boolean;
  preloadLead?: boolean;
}) {
  const tCommon = useTranslations("common");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(() => new Set<number>());
  const [wishlisted, setWishlisted] = useState(false);
  const slides = images.length > 0 ? images : [{ src: "", caption: undefined, sortOrder: 0 }];
  const last = Math.max(0, slides.length - 1);
  const isListingSplit = layout === "listing-split";
  const imageSizes = getTripCardGallerySizes(
    isListingSplit ? "listing-split" : "default",
    prominence,
  );

  useTouchAxisScroll(scrollerRef);

  useEffect(() => {
    if (!tripId) return;
    setWishlisted(readWishlist().has(tripId));
  }, [tripId]);

  useEffect(() => {
    if (!galleryInView) return;
    setLoaded((prev) => {
      if (prev.has(0)) return prev;
      const next = new Set(prev);
      next.add(0);
      return next;
    });
  }, [galleryInView]);

  const syncActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth || 1;
    setActive(Math.max(0, Math.min(last, Math.round(el.scrollLeft / w))));
  }, [last]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncActive();
    el.addEventListener("scroll", syncActive, { passive: true });
    window.addEventListener("resize", syncActive);
    return () => {
      el.removeEventListener("scroll", syncActive);
      window.removeEventListener("resize", syncActive);
    };
  }, [slides.length, syncActive]);

  useEffect(() => {
    if (!galleryInView) return;
    setLoaded((prev) => {
      const next = new Set(prev);
      next.add(active);
      if (active > 0) next.add(active - 1);
      if (active < last) next.add(active + 1);
      return next;
    });
  }, [active, galleryInView, last]);

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(last, index));
    setLoaded((prev) => {
      const next = new Set(prev);
      next.add(clamped);
      if (clamped > 0) next.add(clamped - 1);
      if (clamped < last) next.add(clamped + 1);
      return next;
    });
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setActive(clamped);
  };

  const onGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!tripId) return;
    const next = readWishlist();
    if (next.has(tripId)) next.delete(tripId);
    else next.add(tripId);
    writeWishlist(next);
    setWishlisted(next.has(tripId));
  };

  const currentSlide = slides[Math.min(active, slides.length - 1)];
  const captionTitle = currentSlide?.caption?.trim() ?? "";
  const captionSubtitle = currentSlide?.captionSubtitle?.trim() ?? "";
  const showCaption = Boolean(captionTitle);

  return (
    <div
      data-trip-card-gallery
      className={cn(
        "group/gallery relative shrink-0 overflow-hidden bg-[#e8ebef]",
        isListingSplit
          ? "w-[35%] max-w-[8.75rem] shrink-0 self-stretch min-h-0 md:w-full md:max-w-none md:self-auto md:aspect-[16/10]"
          : prominence === "listing"
            ? "aspect-[16/10]"
            : "aspect-[3/2]",
      )}
      onClick={onGalleryClick}
      role="region"
      aria-roledescription="carousel"
      aria-label={tCommon("imageGallery")}
    >
      <div
        className={cn(
          isListingSplit && "absolute inset-0 md:relative md:h-full md:w-full",
          !isListingSplit && "h-full",
        )}
      >
        <div
          ref={scrollerRef}
          dir="ltr"
          data-scroll-region="gallery"
          className="axis-horizontal-scroll no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto [-webkit-overflow-scrolling:touch]"
          tabIndex={0}
          onClick={onGalleryClick}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              e.stopPropagation();
              goTo(active - 1);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              e.stopPropagation();
              goTo(active + 1);
            }
          }}
        >
          {slides.map((img, i) => {
            const show = galleryInView && shouldLoadGallerySlide(i, loaded);
            const isLeadSlide = preloadLead && galleryInView && i === 0;
            return (
              <div
                key={`${img.src}-${i}`}
                className="relative h-full min-w-full shrink-0 snap-center snap-always bg-surface"
              >
                {show && img.src ? (
                  <Image
                    src={img.src}
                    alt={img.caption || ""}
                    fill
                    className="trip-card-photo pointer-events-none object-cover object-center select-none"
                    sizes={imageSizes}
                    quality={IQ.card}
                    priority={isLeadSlide}
                    loading={isLeadSlide ? "eager" : "lazy"}
                    fetchPriority={isLeadSlide ? "high" : "auto"}
                    draggable={false}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {badges}

      {tripId ? (
        <button
          type="button"
          onClick={toggleWishlist}
          className={cn(
            "absolute end-2 top-2 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-[2px] transition hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:end-2.5 md:top-2.5 md:h-8 md:w-8",
            isListingSplit && "end-1.5 top-1.5 md:end-2.5 md:top-2.5",
          )}
          aria-label={wishlisted ? tCommon("removeFromWishlist") : tCommon("addToWishlist")}
          aria-pressed={wishlisted}
        >
          <Heart
            className={cn("h-3.5 w-3.5 md:h-4 md:w-4", wishlisted && "fill-white")}
            strokeWidth={2}
            aria-hidden
          />
        </button>
      ) : null}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/55 via-black/15 to-transparent",
          isListingSplit ? "px-1.5 pt-8 pb-1.5 md:px-2.5 md:pb-2" : "px-2.5 pt-10 pb-2",
        )}
      >
        <div className="flex items-end justify-between gap-2">
          {showCaption ? (
            <div
              className={cn(
                "min-w-0 max-w-[72%] rounded-md bg-black/55 px-2 py-1 backdrop-blur-[2px]",
                isListingSplit && "hidden md:block",
              )}
            >
              <p className="flex items-center gap-1 truncate text-[10px] font-bold leading-tight text-white sm:text-[11px]">
                <MapPin className="h-2.5 w-2.5 shrink-0" strokeWidth={2.25} aria-hidden />
                <span className="truncate">{captionTitle}</span>
              </p>
              {captionSubtitle ? (
                <p className="mt-0.5 truncate ps-3.5 text-[9px] leading-snug text-white/90 sm:text-[10px]">
                  {captionSubtitle}
                </p>
              ) : null}
            </div>
          ) : (
            <span aria-hidden className={cn(isListingSplit && "hidden md:inline")} />
          )}
          {slides.length > 1 ? (
            <span
              className={cn(
                "shrink-0 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold tabular-nums text-[#0A1B3D] shadow-sm",
                isListingSplit && "md:ms-auto",
              )}
              aria-live="polite"
            >
              {active + 1}/{slides.length}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
