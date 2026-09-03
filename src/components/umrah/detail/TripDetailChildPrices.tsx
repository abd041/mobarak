"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Libre_Baskerville } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { resolveTrip } from "@/lib/trip-availability";
import { IQ } from "@/lib/images";
import { cn, formatEuro } from "@/lib/utils";

const display = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const PRICE_GREEN = "#178B2D";

function localeTag(locale: string): string {
  if (locale === "de") return "de-AT";
  if (locale === "ar") return "ar-SA";
  if (locale === "bs") return "bs-BA";
  return "en-GB";
}

/** Kinder- & Babypreise — reference list with green prices + notes row. */
export function TripDetailChildPrices({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const locale = useLocale();
  const intlLocale = localeTag(locale);
  const [liveTrip, setLiveTrip] = useState(trip);
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    const sync = () => setLiveTrip(resolveTrip(trip));
    sync();
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener("storage", sync);
    };
  }, [trip]);

  const rows = [
    {
      id: "infant",
      icon: "/brand/icons/offer-info/infants.png",
      label: t("offerChildInfantLabel"),
      sub: t("offerChildInfantSub"),
      display: formatEuro(liveTrip.childPrices.infant, intlLocale),
    },
    {
      id: "no-bed",
      icon: "/brand/icons/offer-info/guides.png",
      label: t("offerChildNoBedLabel"),
      sub: t("offerChildNoBedSub"),
      display: formatEuro(liveTrip.childPrices.withoutBed, intlLocale),
    },
    {
      id: "with-bed",
      icon: "/brand/icons/offer-info/bed.png",
      label: t("offerChildWithBedLabel"),
      sub: t("offerChildWithBedSub"),
      // Product model stores withBed as adult-price Ermäßigung; offer panel shows absolute
      // child-with-bed rate to match the marketing reference (ohne Bett + Aufpreis).
      display: formatEuro(
        liveTrip.childPrices.withoutBed + liveTrip.childPrices.withBedDiscount + 50,
        intlLocale,
      ),
    },
  ] as const;

  return (
    <section className="min-w-0" aria-labelledby="child-prices-heading">
      <div className="mb-4">
        <h2
          id="child-prices-heading"
          className={cn(
            display.className,
            "m-0 text-[1.35rem] font-bold tracking-[-0.02em] text-[#111111] sm:text-[1.5rem]",
          )}
        >
          {t("offerChildPricesTitle")}
        </h2>
        <p className="mt-1.5 m-0 text-[14px] font-medium text-[#3D4F5F]">
          {t("offerChildPricesSubtitle")}
        </p>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-[#E5E9EF] bg-white">
        <ul className="m-0 list-none p-0">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center gap-3.5 border-b border-[#EEF1F5] px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4"
            >
              <span className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10">
                <Image
                  src={row.icon}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="40px"
                  quality={IQ.thumb}
                  unoptimized
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="m-0 text-[14px] font-bold leading-snug text-[#111111] sm:text-[15px]">
                  {row.label}
                </p>
                <p className="mt-0.5 m-0 text-[12px] font-medium text-[#6B7C8F]">{row.sub}</p>
              </div>
              <p
                className="shrink-0 text-[1.05rem] font-extrabold tabular-nums sm:text-[1.15rem]"
                style={{ color: PRICE_GREEN }}
              >
                {row.display}
              </p>
            </li>
          ))}

          <li>
            <button
              type="button"
              className="flex w-full items-center gap-3.5 px-4 py-3.5 text-start transition hover:bg-[#FAFBFC] sm:gap-4 sm:px-5 sm:py-4"
              aria-expanded={notesOpen}
              onClick={() => setNotesOpen((v) => !v)}
            >
              <span className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10">
                <Image
                  src="/brand/icons/offer-info/kaaba.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="40px"
                  quality={IQ.thumb}
                  unoptimized
                />
              </span>
              <span className="min-w-0 flex-1 text-[14px] font-bold text-[#111111] sm:text-[15px]">
                {t("offerChildNotesLabel")}
              </span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 shrink-0 text-[#9AA6B5] transition",
                  notesOpen && "rotate-90",
                )}
                strokeWidth={2.25}
                aria-hidden
              />
            </button>
            {notesOpen ? (
              <div className="border-t border-[#F0F3F7] bg-[#FAFBFC] px-4 py-3.5 sm:px-5">
                <p className="m-0 ps-11 text-[13px] leading-relaxed text-[#3D4F5F] sm:ps-14">
                  {t("childPriceNote")}
                </p>
              </div>
            ) : null}
          </li>
        </ul>
      </div>
    </section>
  );
}
