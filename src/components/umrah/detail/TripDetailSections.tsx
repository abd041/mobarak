import Image from "next/image";
import {
  CalendarRange,
  Clock3,
  Plane,
  PlaneTakeoff,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { TripHotelCard } from "@/components/umrah/detail/TripHotelCard";
import { TripInclusionsSection } from "@/components/umrah/detail/TripInclusionsSection";
import { TripItinerarySection } from "@/components/umrah/detail/TripItinerarySection";
import type { Hotel as HotelType, UmrahTrip } from "@/data/mock";
import { DEFAULT_AIRLINE_LOGO } from "@/lib/trip-flights";
import { getTripHotelStayDateLabels } from "@/lib/trip-inquiry";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

export { TripDetailBookingCta } from "@/components/umrah/detail/TripDetailBookingCta";

/** next-intl translator — kept loose so section modules stay reusable */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFn = ((key: string, values?: Record<string, string | number | Date>) => string) & {
  rich?: unknown;
};

/** Soft gradient chip + gold ring — premium meta icon treatment */
function MetaPremiumIcon({ Icon }: { Icon: LucideIcon }) {
  return (
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
      <span
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.95),rgba(232,240,252,0.9)_45%,rgba(210,224,245,0.75)_100%)] shadow-[0_4px_14px_rgba(9,36,92,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-[#C5A35A]/35"
        aria-hidden
      />
      <span
        className="absolute inset-[3px] rounded-full bg-gradient-to-br from-white via-[#F4F8FD] to-[#E3ECF8] ring-1 ring-white/80"
        aria-hidden
      />
      <Icon
        className="relative z-[1] h-[19px] w-[19px] text-[#09245C]"
        strokeWidth={1.85}
        absoluteStrokeWidth
        aria-hidden
      />
    </span>
  );
}

export function TripDetailMetaBar({
  trip,
  t,
  tCommon,
}: {
  trip: UmrahTrip;
  t: TFn;
  tCommon: TFn;
}) {
  const airlineLogo = trip.airlineLogo || DEFAULT_AIRLINE_LOGO;

  const items = [
    {
      id: "duration",
      Icon: Clock3,
      label: t("duration"),
      value: tCommon("nights", { count: trip.nights }),
    },
    {
      id: "period",
      Icon: CalendarRange,
      label: t("period"),
      value: trip.dateLabel,
    },
    {
      id: "group",
      Icon: UsersRound,
      label: t("groupSize"),
      value: t("maxPersons", { count: trip.groupSize }),
    },
    {
      id: "airport",
      Icon: PlaneTakeoff,
      label: t("departureAirport"),
      value: trip.outbound.fromCity,
    },
  ] as const;

  return (
    <section id="overview-meta" className="trip-section scroll-mt-24">
      <h2 className="mb-4 text-lg font-bold text-navy lg:hidden">{t("tripOverview")}</h2>
      <div className="overflow-hidden rounded-[14px] border border-[#E4EAF2] bg-[#F7F9FC] shadow-[0_2px_10px_rgba(9,36,92,0.04)]">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
          {items.map(({ id, Icon, label, value }, index) => (
            <div
              key={id}
              className={cn(
                "relative flex min-w-0 items-center gap-3 border-b border-[#E4EAF2] px-4 py-4 sm:gap-3.5 sm:px-5 sm:py-5 lg:border-b-0",
                index > 0 && "sm:border-s sm:border-[#E4EAF2] lg:border-s-0",
                index > 0 &&
                  "lg:before:absolute lg:before:inset-y-4 lg:before:start-0 lg:before:w-px lg:before:bg-[#D8E0EC]",
              )}
            >
              <MetaPremiumIcon Icon={Icon} />
              <div className="min-w-0">
                <p className="text-[12px] font-bold leading-tight text-[#051033] sm:text-[13px]">
                  {label}
                </p>
                <p className="mt-0.5 text-[12px] font-medium leading-snug text-[#3D4F5F] sm:text-[13px]">
                  {value}
                </p>
              </div>
            </div>
          ))}

          <div
            className={cn(
              "relative flex min-w-0 items-center gap-3 px-4 py-4 sm:col-span-3 sm:border-t sm:border-[#E4EAF2] sm:gap-3.5 sm:px-5 sm:py-5 lg:col-span-1 lg:border-t-0",
              "lg:before:absolute lg:before:inset-y-4 lg:before:start-0 lg:before:w-px lg:before:bg-[#D8E0EC]",
            )}
          >
            <MetaPremiumIcon Icon={Plane} />
            <div className="min-w-0">
              <p className="text-[12px] font-bold leading-tight text-[#051033] sm:text-[13px]">
                {t("airline")}
              </p>
              <div className="relative mt-1 h-5 w-[6.5rem] sm:h-6 sm:w-[7.5rem]">
                <Image
                  src={airlineLogo}
                  alt={trip.airline}
                  fill
                  className="object-contain object-left"
                  sizes="120px"
                  quality={IQ.content}
                />
              </div>
            </div>
          </div>
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
  t,
  tCommon,
}: {
  trip: UmrahTrip;
  medina: HotelType;
  makkah: HotelType;
  locale: string;
  t: TFn;
  tCommon: TFn;
}) {
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
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
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

export function TripDetailItinerary({
  trip,
  t,
}: {
  trip: UmrahTrip;
  t: TFn;
}) {
  return <TripItinerarySection trip={trip} t={t} />;
}
