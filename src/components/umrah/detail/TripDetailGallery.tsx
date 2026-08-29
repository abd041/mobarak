"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { TripImage } from "@/data/mock";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

export function TripDetailGallery({ images }: { images: TripImage[] }) {
  const t = useTranslations("umrah");
  const slides = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);

  if (!slides.length) return null;

  const main = slides[Math.min(active, slides.length - 1)]!;

  return (
    <section id="gallery" className="trip-section scroll-mt-24 pt-2">
      <div className="trip-section-heading">
        <h2 className="shrink-0 text-xl font-bold text-navy sm:text-2xl">
          {t("sectionGallery")}
        </h2>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="mobarak-card relative aspect-[16/10] overflow-hidden bg-surface">
          <Image
            src={main.src}
            alt={main.caption || ""}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 65vw"
            quality={IQ.content}
            priority
          />
          {main.caption ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-5 pb-4 pt-12">
              <p className="text-[14px] font-medium text-white">{main.caption}</p>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-4 gap-2 lg:grid-cols-2 lg:grid-rows-4">
          {slides.slice(0, 8).map((img, i) => (
            <button
              key={`${img.src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl transition",
                active === i
                  ? "ring-2 ring-[#174DE8] ring-offset-2"
                  : "opacity-90 hover:opacity-100",
              )}
            >
              <Image
                src={img.src}
                alt=""
                fill
                className="object-cover"
                sizes="150px"
                quality={IQ.thumb}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
