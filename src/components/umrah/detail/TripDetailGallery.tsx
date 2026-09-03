"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Libre_Baskerville } from "next/font/google";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { TripImage } from "@/data/mock";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

const display = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const PREVIEW = 4;

/** Bildergalerie — mobile: 4-up with +N overlay; desktop: 4 thumbs + dark tile. */
export function TripDetailGallery({ images }: { images: TripImage[] }) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const slides = images.length > 0 ? images : [];
  const [lightbox, setLightbox] = useState<number | null>(null);

  const preview = useMemo(() => slides.slice(0, PREVIEW), [slides]);
  const extra = Math.max(0, slides.length - PREVIEW);

  if (!slides.length) return null;

  return (
    <section id="gallery" className="trip-section scroll-mt-24 pt-2">
      <div className="mb-5">
        <h2
          className={cn(
            display.className,
            "m-0 text-[1.5rem] font-bold tracking-[-0.02em] text-[#111111] sm:text-[1.65rem]",
          )}
        >
          {t("offerGalleryTitle")}
        </h2>
        <p className="mt-1.5 m-0 text-[14px] font-medium text-[#3D4F5F] sm:text-[15px]">
          {t("offerGallerySubtitle")}
        </p>
      </div>

      {/* Mobile / tablet: 4 thumbs in one row; last gets +N overlay */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 lg:hidden">
        {preview.map((img, i) => {
          const isLast = i === preview.length - 1;
          const showMore = isLast && extra > 0;
          return (
            <button
              key={`m-${img.src}-${i}`}
              type="button"
              onClick={() => setLightbox(showMore ? PREVIEW : i)}
              className="relative aspect-square overflow-hidden rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1264F5]"
              aria-label={
                showMore ? t("offerGalleryMore", { count: extra }) : img.caption || undefined
              }
            >
              <Image
                src={img.src}
                alt={img.caption || ""}
                fill
                className="object-cover"
                sizes="25vw"
                quality={IQ.content}
              />
              {showMore ? (
                <span className="absolute inset-0 flex flex-col items-center justify-center bg-[#3A2418]/78 text-white">
                  <span className="text-[1.1rem] font-extrabold leading-none tracking-tight sm:text-[1.35rem]">
                    +{extra}
                  </span>
                  <span className="mt-1 px-0.5 text-center text-[9px] font-semibold leading-tight sm:text-[11px]">
                    {t("offerGalleryMoreLabel")}
                  </span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Desktop: 4 thumbs + separate “+N Weitere Bilder” tile */}
      <div className="hidden grid-cols-5 gap-3 lg:grid">
        {preview.map((img, i) => (
          <button
            key={`d-${img.src}-${i}`}
            type="button"
            onClick={() => setLightbox(i)}
            className="relative aspect-[4/3] overflow-hidden rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1264F5]"
          >
            <Image
              src={img.src}
              alt={img.caption || ""}
              fill
              className="object-cover transition hover:scale-[1.02]"
              sizes="20vw"
              quality={IQ.content}
            />
          </button>
        ))}

        {extra > 0 ? (
          <button
            type="button"
            onClick={() => setLightbox(PREVIEW)}
            className="relative flex aspect-[4/3] flex-col items-center justify-center rounded-[10px] bg-[#5C3A2E] text-white transition hover:brightness-110"
            aria-label={t("offerGalleryMore", { count: extra })}
          >
            <span className="text-[2rem] font-extrabold leading-none tracking-tight">+{extra}</span>
            <span className="mt-1.5 text-[14px] font-semibold">{t("offerGalleryMoreLabel")}</span>
          </button>
        ) : null}
      </div>

      {lightbox != null ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal
          aria-label={t("offerGalleryTitle")}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 end-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            aria-label={tCommon("close")}
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={slides[Math.min(lightbox, slides.length - 1)]!.src}
              alt={slides[Math.min(lightbox, slides.length - 1)]!.caption || ""}
              fill
              className="object-contain"
              sizes="100vw"
              quality={IQ.hero}
              priority
            />
          </div>
          {slides.length > 1 ? (
            <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
              <button
                type="button"
                className="rounded-full bg-white/90 px-4 py-2 text-[13px] font-bold text-[#111]"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((i) =>
                    i == null ? 0 : (i - 1 + slides.length) % slides.length,
                  );
                }}
              >
                ←
              </button>
              <button
                type="button"
                className="rounded-full bg-white/90 px-4 py-2 text-[13px] font-bold text-[#111]"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((i) => (i == null ? 0 : (i + 1) % slides.length));
                }}
              >
                →
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
