"use client";

import Image from "next/image";
import { Libre_Baskerville } from "next/font/google";
import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import { cn } from "@/lib/utils";

const inclusionsDisplay = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

/** Offer-detail inclusions — reference order (8 items). Icons reprocessed for white BG. */
const OFFER_INCLUSION_ITEMS = [
  {
    id: "flight",
    icon: "/brand/icons/offer-inclusions/flight-v2.png",
    titleKey: "offerInclFlightTitle",
    subtitleKey: "offerInclFlightSub",
  },
  {
    id: "hotel",
    icon: "/brand/icons/offer-inclusions/hotel-v2.png",
    titleKey: "offerInclHotelTitle",
    subtitleKey: "offerInclHotelSub",
  },
  {
    id: "breakfast",
    icon: "/brand/icons/offer-inclusions/breakfast-v2.png",
    titleKey: "offerInclBreakfastTitle",
    subtitleKey: "offerInclBreakfastSub",
  },
  {
    id: "transfer",
    icon: "/brand/icons/offer-inclusions/transfer-v2.png",
    titleKey: "offerInclTransferTitle",
    subtitleKey: "offerInclTransferSub",
  },
  {
    id: "guide",
    icon: "/brand/icons/offer-inclusions/guide-v2.png",
    titleKey: "offerInclGuideTitle",
    subtitleKey: "offerInclGuideSub",
  },
  {
    id: "religious",
    icon: "/brand/icons/offer-inclusions/religious-v2.png",
    titleKey: "offerInclReligiousTitle",
    subtitleKey: "offerInclReligiousSub",
  },
  {
    id: "visa",
    icon: "/brand/icons/offer-inclusions/visa-v2.png",
    titleKey: "offerInclVisaTitle",
    subtitleKey: null,
  },
  {
    id: "excursions",
    icon: "/brand/icons/offer-inclusions/excursions-v2.png",
    titleKey: "offerInclExcursionsTitle",
    subtitleKey: "offerInclExcursionsSub",
  },
] as const;

/** Im Reisepreis inklusive — header + 8-column icon row matching reference. */
export function TripInclusionsSection({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const departureCity = trip.outbound.fromCity;

  return (
    <section id="inclusions" className="trip-section scroll-mt-24">
      <div className="mb-9 sm:mb-11">
        <h2
          className={cn(
            inclusionsDisplay.className,
            "m-0 text-[1.65rem] font-bold tracking-[-0.02em] text-black sm:text-[1.85rem]",
          )}
        >
          {t("offerInclusionsTitle")}
        </h2>
        <p className="mt-2.5 m-0 max-w-2xl text-[14px] leading-snug text-[#1A1A1A] sm:text-[15px]">
          {t("offerInclusionsSubtitle")}
        </p>
      </div>

      <ul
        className="grid list-none grid-cols-3 gap-x-2 gap-y-8 p-0 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-9 lg:grid-cols-8 lg:gap-x-3 lg:gap-y-0"
        aria-label={t("offerInclusionsTitle")}
      >
        {OFFER_INCLUSION_ITEMS.map(({ id, icon, titleKey, subtitleKey }) => {
          const subtitle =
            id === "flight"
              ? t("offerInclFlightSub", { city: departureCity })
              : subtitleKey
                ? t(subtitleKey)
                : null;

          return (
            <li key={id} className="flex flex-col items-center text-center">
              <span className="relative h-12 w-12 shrink-0 sm:h-16 sm:w-16">
                <Image
                  src={icon}
                  alt=""
                  fill
                  className="object-contain object-center"
                  sizes="64px"
                  unoptimized
                  priority
                />
              </span>
              <p className="mt-2.5 m-0 text-[12px] font-bold leading-snug text-black sm:mt-3.5 sm:text-[13px]">
                {t(titleKey)}
              </p>
              {subtitle ? (
                <p className="mt-1 m-0 max-w-[6.5rem] text-[11px] font-normal leading-snug text-[#5B6B7C] sm:max-w-[9rem] sm:text-[12px] sm:text-[#1A1A1A]">
                  {subtitle}
                </p>
              ) : (
                <p className="mt-1 m-0 min-h-[1.1rem]" aria-hidden>
                  &nbsp;
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
