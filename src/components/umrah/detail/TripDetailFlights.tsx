"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Clock3, Luggage, PlaneLanding, PlaneTakeoff } from "lucide-react";
import type { FlightLeg, UmrahTrip } from "@/data/mock";
import { getTripFlightInfo, type TripFlightInfo } from "@/lib/trip-flights";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Aircraft visual — desktop right panel / mobile below card */
const FLIGHT_CARD_IMAGE = "/brand/flights-panel-plane.png";

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
      <div className="overflow-hidden rounded-[16px] border border-[#E4EAF2] bg-white shadow-[0_4px_18px_rgba(9,36,92,0.06)] lg:bg-[#F7F9FC]">
        {/* Header — mobile: title then logo; desktop: side by side */}
        <div className="border-b border-[#E4EAF2] px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#051033] sm:text-[22px]">
              {t("flightInfo", { airline: flights.airline })}
            </h2>
            <div className="relative h-8 w-[9.5rem] shrink-0 self-center lg:h-9 lg:w-[11rem] lg:self-auto">
              <Image
                src={flights.airlineLogo}
                alt={flights.airline}
                fill
                className="object-contain object-center lg:object-end"
                sizes="176px"
                quality={IQ.content}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <FlightLegBlock
              title={t("outbound")}
              leg={flights.outbound}
              directLabel={t("direct")}
              durationLabel={t("flightDuration", { duration: flights.outbound.duration })}
              direction="out"
            />

            {/* Baggage — mobile: icon + text row; desktop: center column */}
            <div
              className={cn(
                "flex items-center gap-3 border-y border-[#E4EAF2] px-5 py-4",
                "lg:flex-col lg:items-center lg:justify-center lg:gap-2 lg:border-x lg:border-y-0 lg:px-6 lg:py-6",
              )}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7F9FC] shadow-[0_2px_10px_rgba(9,36,92,0.08)] ring-1 ring-[#E8EEF6] lg:h-12 lg:w-12 lg:bg-white">
                <Luggage className="h-5 w-5 text-[#051033] lg:h-6 lg:w-6" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0 lg:text-center">
                <p className="hidden text-[12px] font-bold text-[#051033] lg:block">{t("baggage")}</p>
                <p className="text-[13px] font-semibold leading-snug text-[#051033] lg:mx-auto lg:mt-0 lg:max-w-[7.5rem]">
                  {flights.baggageAllowance}
                </p>
                <p className="sr-only lg:hidden">{t("baggage")}</p>
              </div>
            </div>

            <FlightLegBlock
              title={t("inbound")}
              leg={flights.inbound}
              directLabel={t("direct")}
              durationLabel={t("flightDuration", { duration: flights.inbound.duration })}
              direction="in"
            />
          </div>

          {/* Desktop right aircraft photo */}
          <div className="relative hidden min-h-full overflow-hidden border-t border-[#E4EAF2] lg:block lg:border-t-0 lg:border-s lg:border-[#E4EAF2]">
            <Image
              src={FLIGHT_CARD_IMAGE}
              alt=""
              fill
              className="object-cover object-center"
              sizes="280px"
              quality={IQ.content}
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Mobile: plane image below the card */}
      <div className="relative mt-3.5 aspect-[16/10] overflow-hidden rounded-[16px] border border-[#E4EAF2] bg-[#E8F2FB] sm:mt-4 sm:aspect-[16/9] lg:hidden">
        <Image
          src={FLIGHT_CARD_IMAGE}
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
  direction,
}: {
  title: string;
  leg: FlightLeg;
  directLabel: string;
  durationLabel: string;
  direction: "out" | "in";
}) {
  const DirectionIcon = direction === "out" ? PlaneTakeoff : PlaneLanding;

  return (
    <div className="px-5 py-5 sm:px-6 sm:py-6 lg:py-7">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <p className="flex items-center gap-2 text-[14px] font-bold text-[#051033]">
          <DirectionIcon className="h-[18px] w-[18px] text-[#051033]" strokeWidth={1.6} aria-hidden />
          {title}
        </p>
        <p className="text-[13px] font-medium text-[#5B6B7C] lg:hidden">{leg.dateLabel}</p>
      </div>
      <p className="mt-1 hidden text-[13px] font-medium text-[#5B6B7C] lg:block">{leg.dateLabel}</p>

      <div className="dir-ltr-keep mt-4 flex items-start gap-3 sm:mt-5 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-extrabold tracking-[-0.02em] text-[#051033] sm:text-[18px]">
            {leg.fromCode}{" "}
            <span className="font-bold">{leg.departTime}</span>
          </p>
          <p className="mt-1 text-[13px] font-medium text-[#3D4F5F]">{leg.fromCity}</p>
        </div>

        <span
          className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center text-[#051033]"
          aria-hidden
        >
          →
        </span>

        <div className="min-w-0 flex-1 text-end">
          <p className="text-[16px] font-extrabold tracking-[-0.02em] text-[#051033] sm:text-[18px]">
            {leg.toCode}{" "}
            <span className="font-bold">{leg.arriveTime}</span>
          </p>
          <p className="mt-1 text-[13px] font-medium text-[#3D4F5F]">{leg.toCity}</p>
        </div>
      </div>

      {leg.direct ? (
        <p className="mt-4 text-center text-[13px] font-semibold text-[#051033]">{directLabel}</p>
      ) : null}

      <p
        className={cn(
          "mt-2 flex items-center justify-center gap-1.5 text-[12px] font-medium text-[#5B6B7C] sm:text-[13px]",
          !leg.direct && "mt-4",
        )}
      >
        <Clock3 className="h-3.5 w-3.5 shrink-0 text-[#051033]" strokeWidth={1.75} aria-hidden />
        {durationLabel}
      </p>
    </div>
  );
}
