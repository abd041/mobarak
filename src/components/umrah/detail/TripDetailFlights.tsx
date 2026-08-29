"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Luggage, Plane } from "lucide-react";
import type { FlightLeg, UmrahTrip } from "@/data/mock";
import {
  FLIGHT_PANEL_VISUAL,
  getTripFlightInfo,
  type TripFlightInfo,
} from "@/lib/trip-flights";
import { IQ } from "@/lib/images";

export function TripDetailFlights({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const [flights, setFlights] = useState<TripFlightInfo>(() => getTripFlightInfo(trip));

  useEffect(() => {
    const sync = () => setFlights(getTripFlightInfo(trip));
    sync();
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener("storage", sync);
    };
  }, [trip]);

  return (
    <section id="flights" className="trip-section scroll-mt-24">
      <div className="mobarak-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-navy sm:text-xl">
            {t("flightInfo", { airline: flights.airline })}
          </h2>
          <div className="relative h-7 w-[8.5rem] shrink-0 sm:h-8 sm:w-[9.5rem]">
            <Image
              src={flights.airlineLogo}
              alt={flights.airline}
              fill
              className="object-contain object-end"
              sizes="152px"
              quality={IQ.content}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_200px]">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr]">
            <FlightLegBlock
              title={t("outbound")}
              leg={flights.outbound}
              directLabel={t("direct")}
              durationLabel={t("flightDuration", { duration: flights.outbound.duration })}
            />

            <div className="flex flex-col items-center justify-center border-y border-line px-4 py-6 lg:border-x lg:border-y-0 lg:px-5">
              <Luggage className="h-8 w-8 text-navy" strokeWidth={1.5} aria-hidden />
              <p className="mt-2 text-[13px] font-bold text-navy">{t("baggage")}</p>
              <p className="mt-1 max-w-[8rem] text-center text-[12px] font-medium leading-snug text-navy/85">
                {flights.baggageAllowance}
              </p>
            </div>

            <FlightLegBlock
              title={t("inbound")}
              leg={flights.inbound}
              directLabel={t("direct")}
              durationLabel={t("flightDuration", { duration: flights.inbound.duration })}
            />
          </div>

          <div className="relative hidden min-h-[12rem] flex-col items-center justify-center gap-4 border-t border-line bg-surface px-4 py-8 lg:flex lg:border-t-0 lg:border-s">
            <div className="relative h-24 w-full max-w-[11rem]">
              <Image
                src={flights.airlineLogo}
                alt=""
                fill
                className="object-contain"
                sizes="176px"
                quality={IQ.content}
                aria-hidden
              />
            </div>
            <div className="relative h-20 w-20 opacity-90">
              <Image
                src={FLIGHT_PANEL_VISUAL}
                alt=""
                fill
                className="object-contain"
                sizes="80px"
                quality={IQ.content}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile aircraft visual below flight card */}
      <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface lg:hidden">
        <Image
          src={FLIGHT_PANEL_VISUAL}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={IQ.content}
          aria-hidden
        />
      </div>
    </section>
  );
}

function FlightLegBlock({
  title,
  leg,
  directLabel,
  durationLabel,
}: {
  title: string;
  leg: FlightLeg;
  directLabel: string;
  durationLabel: string;
}) {
  return (
    <div className="p-5 sm:p-6">
      <p className="mb-1 flex items-center gap-2 text-[13px] font-bold text-navy sm:text-sm">
        <Plane className="h-4 w-4 text-brand-cta" strokeWidth={1.75} aria-hidden />
        {title}
      </p>
      <p className="text-[12px] text-muted sm:text-[13px]">{leg.dateLabel}</p>

      <p className="dir-ltr-keep mt-4 text-[15px] font-bold tracking-tight text-navy sm:text-base">
        {leg.fromCode} {leg.departTime}
        <span className="mx-1.5 font-semibold text-brand-cta">→</span>
        {leg.toCode} {leg.arriveTime}
      </p>
      <p className="mt-1 text-[13px] font-medium text-navy/85">
        {leg.fromCity}
        <span className="mx-1.5 text-muted">→</span>
        {leg.toCity}
      </p>

      {leg.direct && (
        <p className="mt-3 text-[12px] font-semibold text-brand-cta sm:text-[13px]">{directLabel}</p>
      )}
      <p className="mt-1 text-[12px] font-medium text-muted sm:text-[13px]">{durationLabel}</p>
    </div>
  );
}
