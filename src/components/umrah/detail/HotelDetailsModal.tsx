"use client";

import { useId } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, Star, X } from "lucide-react";
import type { Hotel } from "@/data/mock";
import {
  formatHotelInfoLabel,
  getHotelInfoItems,
} from "@/lib/hotel-amenities";
import { IQ } from "@/lib/images";
import { useDialogA11y } from "@/lib/use-dialog-a11y";
import { cn } from "@/lib/utils";

type Stay = {
  nights: number;
  dateLabel: string;
  checkIn?: string;
  checkOut?: string;
};

export function HotelDetailsModal({
  hotel,
  stay,
  cityLabel,
  nightsLabel,
  checkInLabel,
  checkOutLabel,
  open,
  onClose,
}: {
  hotel: Hotel;
  stay: Stay;
  cityLabel: string;
  nightsLabel: string;
  checkInLabel?: string;
  checkOutLabel?: string;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const titleId = useId();
  const descId = useId();
  const dialogRef = useDialogA11y(open, onClose);
  const infoItems = getHotelInfoItems(hotel);
  const images = hotel.images.length
    ? hotel.images
    : [{ src: "/brand/hero-bg.png", caption: hotel.name }];
  const description =
    locale === "de" && hotel.description?.trim() ? hotel.description : null;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 md:items-center md:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-auto rounded-t-2xl bg-white shadow-xl md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
      >
        <button
          type="button"
          data-dialog-close
          className="absolute end-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-sm hover:bg-white"
          onClick={onClose}
          aria-label={tCommon("close")}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="border-b border-line px-5 py-6 pe-14 sm:px-6">
          <p className="text-sm font-bold text-brand-green">
            {cityLabel} – {nightsLabel}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 id={titleId} className="text-2xl font-bold text-[#111111]">
              {hotel.name}
            </h2>
            <div className="flex items-center gap-0.5 text-brand-gold" aria-hidden>
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[#111111]">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#1A1A1A]" strokeWidth={1.75} aria-hidden />
            {stay.dateLabel}
          </p>
          {description && (
            <p id={descId} className="mt-4 text-sm leading-relaxed text-muted">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-6">
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#111111]">
              {t("hotelDetailsGallery")}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((img, i) => (
                <figure key={`${hotel.id}-modal-${i}`} className="overflow-hidden rounded-xl">
                  <div className="relative aspect-[4/3] bg-surface">
                    <Image
                      src={img.src}
                      alt={img.caption || hotel.name}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 50vw, 240px"
                      quality={IQ.content}
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="mt-1.5 text-[11px] font-medium text-muted sm:text-xs">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#111111]">
              {t("hotelDetailsFeatures")}
            </h3>
            <ul className="space-y-2.5">
              {infoItems.map((item) => (
                <li key={item.id} className="flex items-start gap-2.5">
                  <item.Icon
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      item.primary ? "text-[#1A1A1A]" : "text-[#1A1A1A]/80",
                    )}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "text-sm leading-snug",
                      item.primary ? "font-semibold text-[#111111]" : "font-medium text-muted",
                    )}
                  >
                    {formatHotelInfoLabel(t, item)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid gap-3 rounded-xl border border-line bg-surface p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-[#111111]">{t("hotelCheckIn")}</dt>
              <dd className="mt-0.5 text-muted">{checkInLabel || stay.dateLabel}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#111111]">{t("hotelCheckOut")}</dt>
              <dd className="mt-0.5 text-muted">{checkOutLabel || stay.dateLabel}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
