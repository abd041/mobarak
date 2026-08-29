"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TripImage } from "@/data/mock";
import { useTouchAxisScroll } from "@/hooks/useTouchAxisScroll";
import { cn } from "@/lib/utils";
import { IQ, getTripCardGallerySizes, shouldLoadGallerySlide } from "@/lib/images";

export function TripCardGallery({
  images,
  badges,
  nightsBadge,
  prominence = "default",
  layout = "default",
  /** Card is near the viewport — defer all gallery bytes until true. */
  galleryInView = true,
  /** Preload the first slide with high priority (first listing card only). */
  preloadLead = false,
}: {
  images: TripImage[];
  badges?: React.ReactNode;
  nightsBadge?: React.ReactNode;
  prominence?: "listing" | "default";
  /** Listing mobile: image column stretches to match content + CTA height. */
  layout?: "default" | "listing-split";
  galleryInView?: boolean;
  preloadLead?: boolean;
}) {
  const tCommon = useTranslations("common");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(() => new Set<number>());
  const slides = images.length > 0 ? images : [{ src: "", caption: undefined, sortOrder: 0 }];
  const last = Math.max(0, slides.length - 1);
  const isListingSplit = layout === "listing-split";
  const imageSizes = getTripCardGallerySizes(
    isListingSplit ? "listing-split" : "default",
    prominence,
  );

  useTouchAxisScroll(scrollerRef);

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

  const onControlClick = (e: React.MouseEvent, indexOrDir: number, isDir?: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDir) goTo(active + indexOrDir);
    else goTo(indexOrDir);
  };

  const onGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const caption = slides[Math.min(active, slides.length - 1)]?.caption?.trim() ?? "";
  const canGoPrev = active > 0;
  const canGoNext = active < last;

  const navButtonClass = cn(
    "absolute top-1/2 z-30 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/35 bg-black/20 text-white backdrop-blur-[1px] transition hover:bg-black/35 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
    isListingSplit
      ? "touch-target h-11 w-11 opacity-90 md:h-8 md:w-8 md:min-h-0 md:min-w-0 md:opacity-0 md:group-hover/gallery:opacity-100 md:group-focus-within/gallery:opacity-100"
      : "touch-target h-11 w-11 max-sm:opacity-90 sm:h-8 sm:w-8 sm:min-h-0 sm:min-w-0 sm:opacity-0 sm:group-hover/gallery:opacity-100 sm:group-focus-within/gallery:opacity-100",
  );
  const showCaption = Boolean(caption);

  return (
    <div
      data-trip-card-gallery
      className={cn(
        "group/gallery relative shrink-0 overflow-hidden bg-[#e8ebef]",
        isListingSplit
          ? "w-[35%] max-w-[8.75rem] shrink-0 self-stretch min-h-0 md:w-full md:max-w-none md:self-auto md:aspect-[4/3] lg:aspect-[3/2]"
          : prominence === "listing"
            ? "aspect-[4/3] md:aspect-[4/3] lg:aspect-[3/2]"
            : "aspect-[5/4] sm:aspect-[4/3]",
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

      {nightsBadge ? (
        <div
          className={cn(
            "pointer-events-none absolute z-10",
            isListingSplit ? "end-1 top-1 md:end-3 md:top-3" : "end-3 top-3",
          )}
        >
          {nightsBadge}
        </div>
      ) : null}

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(e) => onControlClick(e, -1, true)}
            disabled={!canGoPrev}
            className={cn(
              navButtonClass,
              isListingSplit ? "start-0.5 md:start-2" : "start-2",
              !canGoPrev && "invisible pointer-events-none",
            )}
            aria-label={tCommon("previousImage")}
          >
            <ChevronLeft
              className={cn(isListingSplit ? "h-3.5 w-3.5 md:h-4 md:w-4" : "h-4 w-4")}
              strokeWidth={2.25}
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={(e) => onControlClick(e, 1, true)}
            disabled={!canGoNext}
            className={cn(
              navButtonClass,
              isListingSplit ? "end-0.5 md:end-2" : "end-2",
              !canGoNext && "invisible pointer-events-none",
            )}
            aria-label={tCommon("nextImage")}
          >
            <ChevronRight
              className={cn(isListingSplit ? "h-3.5 w-3.5 md:h-4 md:w-4" : "h-4 w-4")}
              strokeWidth={2.25}
              aria-hidden
            />
          </button>
        </>
      ) : null}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/50 via-black/10 to-transparent",
          isListingSplit ? "px-1.5 pt-5 pb-1.5 md:px-3 md:pt-8 md:pb-2.5" : "px-3 pt-8 pb-2.5",
        )}
      >
        <div
          className={cn(
            "flex items-end gap-2",
            isListingSplit ? "justify-center md:justify-between" : "justify-between",
          )}
        >
          {showCaption && caption ? (
            <span
              className={cn(
                "max-w-[70%] truncate rounded-md bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white",
                isListingSplit && "hidden md:inline-block",
              )}
            >
              {caption}
            </span>
          ) : (
            <span aria-hidden className={cn(isListingSplit && "hidden md:inline")} />
          )}
          {slides.length > 1 ? (
            <div
              className={cn(
                "pointer-events-auto relative z-30 flex items-center gap-0.5",
                isListingSplit && "md:ms-auto",
              )}
              dir="ltr"
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => onControlClick(e, i)}
                  aria-label={tCommon("goToImage", { n: i + 1 })}
                  aria-current={i === active ? "true" : undefined}
                  className={cn(
                    "touch-target flex cursor-pointer items-center justify-center rounded-full",
                    isListingSplit ? "h-11 w-11 md:h-7 md:w-7 md:min-h-0 md:min-w-0" : "h-11 w-11 sm:h-7 sm:w-7 sm:min-h-0 sm:min-w-0",
                  )}
                >
                  <span
                    className={cn(
                      "block rounded-full transition-all",
                      isListingSplit
                        ? i === active
                          ? "h-1 w-2.5 bg-white md:h-1.5 md:w-3.5"
                          : "h-1 w-1 bg-white/75 md:h-1.5 md:w-1.5"
                        : i === active
                          ? "h-1.5 w-3.5 bg-white"
                          : "h-1.5 w-1.5 bg-white/75",
                    )}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
