"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { TripHotelCard } from "@/components/umrah/detail/TripHotelCard";
import { TripInclusionsSection } from "@/components/umrah/detail/TripInclusionsSection";
import { TripItinerarySection } from "@/components/umrah/detail/TripItinerarySection";
import { DirArrow } from "@/components/ui/DirArrow";
import type { Hotel as HotelType, UmrahTrip } from "@/data/mock";
import { IQ } from "@/lib/images";
import { getTripHotelStayDateLabels } from "@/lib/trip-inquiry";

export { TripDetailBookingCta } from "@/components/umrah/detail/TripDetailBookingCta";

const META_ICONS = {
  duration: "/brand/icons/offer-meta/duration.png",
  period: "/brand/icons/offer-meta/period.png",
  group: "/brand/icons/offer-meta/group.png",
  airport: "/brand/icons/offer-meta/airport.png",
  destinations: "/brand/icons/offer-meta/destinations.png",
} as const;

export function TripDetailMetaBar({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");

  const departureValue = trip.outbound.fromCode
    ? `${trip.outbound.fromCity} (${trip.outbound.fromCode})`
    : trip.outbound.fromCity;

  const items = [
    {
      id: "duration",
      icon: META_ICONS.duration,
      label: t("duration"),
      value: tCommon("nights", { count: trip.nights }),
    },
    {
      id: "period",
      icon: META_ICONS.period,
      label: t("period"),
      value: trip.dateLabel,
    },
    {
      id: "group",
      icon: META_ICONS.group,
      label: t("groupSize"),
      value: t("maxPersons", { count: trip.groupSize }),
    },
    {
      id: "airport",
      icon: META_ICONS.airport,
      label: t("metaDeparture"),
      value: departureValue,
    },
    {
      id: "destinations",
      icon: META_ICONS.destinations,
      label: t("destinations"),
      value: t("destinationsMedinaMakkah"),
    },
  ] as const;

  return (
    <section
      id="overview-meta"
      className="full-viewport-bleed trip-section scroll-mt-24 !pb-6 lg:!pb-8"
    >
      <div className="w-full border-y border-[#E8ECF0] bg-white shadow-[0_4px_18px_rgba(9,36,92,0.08)]">
        {/* Mobile: 2-col grid (reference); desktop: single horizontal strip */}
        <div className="grid w-full grid-cols-2 gap-x-3 gap-y-4 px-4 py-4 sm:gap-x-4 sm:px-6 sm:py-5 lg:flex lg:flex-nowrap lg:items-stretch lg:justify-between lg:gap-0 lg:px-8 lg:py-1 xl:px-10">
          {items.map(({ id, icon, label, value }) => (
            <div
              key={id}
              className="flex min-w-0 items-center gap-2.5 lg:flex-1 lg:basis-0 lg:justify-center lg:px-2 lg:py-4 xl:gap-3 xl:px-3"
            >
              <span className="relative h-7 w-7 shrink-0 sm:h-8 sm:w-8">
                <Image
                  src={icon}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="32px"
                  quality={IQ.thumb}
                />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-bold leading-tight text-black sm:text-[13px]">
                  {label}
                </p>
                <p className="mt-0.5 text-[12px] font-medium leading-snug text-black sm:text-[13px]">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TripDetailHotels({
  trip,
  medina,
  makkah,
  locale,
}: {
  trip: UmrahTrip;
  medina: HotelType;
  makkah: HotelType;
  locale: string;
}) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const stayDates = getTripHotelStayDateLabels(trip, locale);

  const blocks = [
    {
      hotel: medina,
      stay: { ...trip.medinaStay, dateLabel: stayDates.medina },
      cityLabel: t("medina"),
      checkInLabel: stayDates.medinaCheckIn,
      checkOutLabel: stayDates.medinaCheckOut,
    },
    {
      hotel: makkah,
      stay: { ...trip.makkahStay, dateLabel: stayDates.makkah },
      cityLabel: t("makkah"),
      checkInLabel: stayDates.makkahCheckIn,
      checkOutLabel: stayDates.makkahCheckOut,
    },
  ];

  return (
    <section id="hotels" className="trip-section scroll-mt-[5.5rem] pt-2 lg:scroll-mt-24 lg:pt-4">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h2 className="m-0 text-[1.5rem] font-extrabold tracking-[-0.02em] text-[#111111] sm:text-[1.65rem]">
            {t("ourHotels")}
          </h2>
          <p className="mt-1.5 m-0 max-w-xl text-[14px] font-medium leading-snug text-[#1A1A1A] sm:text-[15px]">
            {t("ourHotelsSubtitle")}
          </p>
        </div>
        <a
          href="#gallery"
          className="inline-flex shrink-0 items-center gap-1 text-[14px] font-bold text-[#1264F5] transition hover:opacity-80 sm:pt-1"
        >
          {t("viewAllHotelImages")}
          <DirArrow className="ms-0" />
        </a>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        {blocks.map(({ hotel, stay, cityLabel, checkInLabel, checkOutLabel }) => (
          <TripHotelCard
            key={hotel.id}
            hotel={hotel}
            stay={stay}
            cityLabel={cityLabel}
            nightsLabel={tCommon("nights", { count: stay.nights })}
            checkInLabel={checkInLabel}
            checkOutLabel={checkOutLabel}
          />
        ))}
      </div>
    </section>
  );
}

export function TripDetailServiceBlocks({ trip }: { trip: UmrahTrip }) {
  return <TripInclusionsSection trip={trip} />;
}

export function TripDetailItinerary({ trip }: { trip: UmrahTrip }) {
  return <TripItinerarySection trip={trip} />;
}
