"use client";

import { useEffect, useState } from "react";
import { Libre_Baskerville } from "next/font/google";
import { useTranslations } from "next-intl";
import { Plane } from "lucide-react";
import type { FlightLeg, UmrahTrip } from "@/data/mock";
import { getTripFlightInfo, type TripFlightInfo } from "@/lib/trip-flights";
import { cn } from "@/lib/utils";

const display = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

/** Flugdetails — two route cards matching reference. */
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
      <div className="mb-5 sm:mb-6">
        <h2
          className={cn(
            display.className,
            "m-0 text-[1.5rem] font-bold tracking-[-0.02em] text-[#111111] sm:text-[1.65rem]",
          )}
        >
          {t("offerFlightsTitle")}
        </h2>
        <p className="mt-1.5 m-0 text-[14px] font-medium text-[#3D4F5F] sm:text-[15px]">
          {t("offerFlightsSubtitle")}
        </p>
      </div>

      <div className="space-y-3 sm:space-y-3.5">
        <FlightRouteCard
          title={t("outbound")}
          leg={flights.outbound}
          directLabel={t("direct")}
          stopsLabel={t("flightStops", { count: 2 })}
          durationLabel={t("flightDurationShort", { duration: flights.outbound.duration })}
        />
        <FlightRouteCard
          title={t("inbound")}
          leg={flights.inbound}
          directLabel={t("direct")}
          stopsLabel={t("flightStops", { count: 2 })}
          durationLabel={t("flightDurationShort", { duration: flights.inbound.duration })}
        />
      </div>
    </section>
  );
}

function FlightRouteCard({
  title,
  leg,
  directLabel,
  stopsLabel,
  durationLabel,
}: {
  title: string;
  leg: FlightLeg;
  directLabel: string;
  stopsLabel: string;
  durationLabel: string;
}) {
  const dateOnly = leg.dateLabel.replace(/^[^,]*,\s*/, "");

  return (
    <article className="rounded-[14px] border border-[#E8ECF0] bg-white px-4 py-5 shadow-[0_6px_20px_rgba(9,36,92,0.06)] sm:px-6 sm:py-6">
      <p className="m-0 text-[14px] font-bold text-[#111111] sm:text-[15px]">
        {title} - {dateOnly}
      </p>

      <div className="dir-ltr-keep mt-5 grid grid-cols-[minmax(0,1fr)_minmax(5.5rem,1.15fr)_minmax(0,1fr)] items-center gap-2 sm:mt-6 sm:gap-4">
        {/* Departure */}
        <div className="min-w-0 text-start">
          <p className="m-0 text-[1.35rem] font-extrabold leading-none tracking-[-0.02em] text-[#111111] sm:text-[1.65rem]">
            {leg.fromCode}
          </p>
          <p className="mt-1.5 m-0 text-[12px] font-medium text-[#5B6B7C] sm:text-[13px]">
            {leg.fromCity}
          </p>
          <p className="mt-2 m-0 text-[1.15rem] font-extrabold leading-none tabular-nums text-[#111111] sm:text-[1.35rem]">
            {leg.departTime}
          </p>
        </div>

        {/* Center — dotted route + meta */}
        <div className="flex min-w-0 flex-col items-center px-0.5">
          <div className="relative flex w-full max-w-[11rem] items-center">
            <span className="h-0 w-full border-t border-dashed border-[#9AABB8]" aria-hidden />
            <span className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <Plane
                  className="h-4 w-4 rotate-90 text-[#111111] sm:h-[18px] sm:w-[18px]"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </span>
            </span>
          </div>
          <p className="mt-2.5 m-0 text-center text-[11px] font-medium leading-snug text-[#5B6B7C] sm:text-[12px]">
            {leg.direct ? directLabel : stopsLabel}
          </p>
          <p className="mt-0.5 m-0 text-center text-[11px] font-medium leading-snug text-[#5B6B7C] sm:text-[12px]">
            {durationLabel}
          </p>
        </div>

        {/* Arrival */}
        <div className="min-w-0 text-end">
          <p className="m-0 text-[1.35rem] font-extrabold leading-none tracking-[-0.02em] text-[#111111] sm:text-[1.65rem]">
            {leg.toCode}
          </p>
          <p className="mt-1.5 m-0 text-[12px] font-medium text-[#5B6B7C] sm:text-[13px]">
            {leg.toCity}
          </p>
          <p className="mt-2 m-0 text-[1.15rem] font-extrabold leading-none tabular-nums text-[#111111] sm:text-[1.35rem]">
            {leg.arriveTime}
          </p>
        </div>
      </div>
    </article>
  );
}
