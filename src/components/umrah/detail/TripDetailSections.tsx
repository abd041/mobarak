import { CalendarDays, Moon, Plane, PlaneTakeoff, Users } from "lucide-react";
import { TripHotelCard } from "@/components/umrah/detail/TripHotelCard";
import { TripInclusionsSection } from "@/components/umrah/detail/TripInclusionsSection";
import { TripItinerarySection } from "@/components/umrah/detail/TripItinerarySection";
import type { Hotel as HotelType, UmrahTrip } from "@/data/mock";
import { getTripHotelStayDateLabels } from "@/lib/trip-inquiry";

export { TripDetailBookingCta } from "@/components/umrah/detail/TripDetailBookingCta";

/** next-intl translator — kept loose so section modules stay reusable */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFn = ((key: string, values?: Record<string, string | number | Date>) => string) & {
  rich?: unknown;
};

export function TripDetailMetaBar({
  trip,
  t,
  tCommon,
}: {
  trip: UmrahTrip;
  t: TFn;
  tCommon: TFn;
}) {
  const items = [
    {
      Icon: Moon,
      label: t("duration"),
      value: tCommon("nights", { count: trip.nights }),
    },
    {
      Icon: CalendarDays,
      label: t("period"),
      value: trip.dateLabel,
    },
    {
      Icon: Users,
      label: t("groupSize"),
      value: t("maxPersons", { count: trip.groupSize }),
    },
    {
      Icon: PlaneTakeoff,
      label: t("departureAirport"),
      value: trip.outbound.fromCity,
    },
    {
      Icon: Plane,
      label: t("airline"),
      value: trip.airline,
    },
  ] as const;

  return (
    <section id="overview-meta" className="trip-section scroll-mt-24">
      <h2 className="mb-4 text-lg font-bold text-navy lg:hidden">{t("tripOverview")}</h2>
      <div className="mobarak-card overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
          {items.map(({ Icon, label, value }) => (
            <div
              key={label}
              className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 sm:gap-3.5 sm:px-5 sm:py-5"
            >
              <Icon
                className="h-5 w-5 shrink-0 text-navy sm:h-[22px] sm:w-[22px]"
                strokeWidth={1.75}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-[12px] font-bold leading-tight text-navy sm:text-[13px]">
                  {label}
                </p>
                <p className="mt-0.5 text-[12px] font-medium leading-snug text-navy/85 sm:text-[13px]">
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
