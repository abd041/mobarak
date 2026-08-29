"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { getDetailInclusionItems } from "@/lib/trip-inclusions";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Inklusive Leistungen — 3-column grid on mobile; horizontal bar on desktop. */
export function TripInclusionsSection({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const [items, setItems] = useState(() => getDetailInclusionItems(trip));

  useEffect(() => {
    const sync = () => setItems(getDetailInclusionItems(trip));
    sync();
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener("storage", sync);
    };
  }, [trip]);

  if (items.length === 0) return null;

  return (
    <section id="inclusions" className="trip-section scroll-mt-24">
      <div className="mobarak-card relative px-3 pb-7 pt-11 sm:px-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
          <div className="-translate-y-1/2 flex w-full max-w-md items-center gap-3 bg-white px-4 sm:max-w-lg">
            <div className="h-px flex-1 bg-line" />
            <h2 className="shrink-0 text-lg font-bold text-navy sm:text-xl">{t("inclusions")}</h2>
            <div className="h-px flex-1 bg-line" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-5 pt-1 lg:flex lg:overflow-visible lg:pt-0">
          {items.map(({ id, icon, labelKey }, idx) => (
            <div
              key={id}
              className={cn(
                "flex flex-col items-center px-1 py-2 text-center sm:px-2",
                "lg:min-w-0 lg:flex-1 lg:py-3",
                idx < items.length - 1 && "lg:border-e lg:border-line",
              )}
            >
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                <Image
                  src={icon}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="56px"
                  quality={IQ.thumb}
                />
              </div>
              <p className="mt-2.5 max-w-[7.5rem] text-[10px] leading-snug font-semibold text-navy sm:mt-3 sm:max-w-[8.5rem] sm:text-[12px]">
                {t(labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
