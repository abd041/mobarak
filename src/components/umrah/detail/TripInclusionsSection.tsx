"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { getDetailInclusionItems } from "@/lib/trip-inclusions";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Inklusive Leistungen — premium fieldset bar matching offer-page reference. */
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
      <div className="relative rounded-[16px] border border-[#E4EAF2] bg-white px-3 pb-6 pt-10 shadow-[0_4px_18px_rgba(9,36,92,0.06)] sm:px-4 sm:pb-7 sm:pt-11">
        {/* Title interrupts the top border */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
          <div className="-translate-y-1/2 flex max-w-[min(100%,22rem)] items-center gap-3 bg-white px-3 sm:max-w-md sm:px-4">
            <span className="h-px flex-1 bg-[#E4EAF2]" aria-hidden />
            <h2 className="shrink-0 text-[16px] font-bold tracking-[-0.01em] text-[#051033] sm:text-[18px]">
              {t("inclusions")}
            </h2>
            <span className="h-px flex-1 bg-[#E4EAF2]" aria-hidden />
          </div>
        </div>

        {/* Mobile / tablet: compact grid */}
        <ul className="grid grid-cols-3 gap-x-2 gap-y-5 pt-1 sm:grid-cols-5 lg:hidden">
          {items.map(({ id, icon, labelKey }) => (
            <li key={id} className="flex flex-col items-center px-1 text-center">
              <div className="relative h-11 w-11 sm:h-12 sm:w-12">
                <Image
                  src={icon}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="48px"
                  quality={IQ.thumb}
                />
              </div>
              <p className="mt-2.5 max-w-[7.5rem] text-[10px] font-semibold leading-snug text-[#051033] sm:text-[11px]">
                {t(labelKey)}
              </p>
            </li>
          ))}
        </ul>

        {/* Desktop: single premium row with floating mid-height dividers */}
        <ul className="hidden lg:flex lg:items-stretch lg:justify-between lg:gap-0 lg:px-1 lg:pt-1">
          {items.map(({ id, icon, labelKey }, idx) => (
            <li
              key={id}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center px-2 py-3 text-center xl:px-2.5",
                idx < items.length - 1 &&
                  "after:absolute after:end-0 after:top-1/2 after:h-[3.25rem] after:w-px after:-translate-y-1/2 after:bg-[#E4EAF2] after:content-['']",
              )}
            >
              <div className="relative h-[52px] w-[52px] xl:h-14 xl:w-14">
                <Image
                  src={icon}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="56px"
                  quality={IQ.thumb}
                />
              </div>
              <p className="mt-3 max-w-[6.75rem] text-[11px] font-semibold leading-snug text-[#051033] xl:max-w-[7.5rem] xl:text-[12px]">
                {t(labelKey)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
