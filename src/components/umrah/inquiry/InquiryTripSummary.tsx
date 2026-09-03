"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Hotel, UmrahTrip } from "@/data/mock";
import { formatEuro, formatEuroReduction } from "@/lib/utils";
import {
  formatFlightLegDateLabel,
  formatTripDisplayDateRange,
  getTripHotelStayDateLabels,
} from "@/lib/trip-inquiry";
import { getTripFlightInfo, type TripFlightInfo } from "@/lib/trip-flights";
import { formatHotelInfoLabel, getHotelInfoItems } from "@/lib/hotel-amenities";
import { IQ } from "@/lib/images";
import { getLocalizedTripTitle } from "@/lib/trip-localized-copy";

const INQUIRY_SUMMARY_ITEMS = ["visaIncl", "flightIncl", "featBaggageShort", "featGuide"] as const;

const INQUIRY_SUMMARY_ICONS: Record<(typeof INQUIRY_SUMMARY_ITEMS)[number], string> = {
  visaIncl: "/brand/inclusion-icons/visa.png",
  flightIncl: "/brand/inclusion-icons/flight.png",
  featBaggageShort: "/brand/inclusion-icons/baggage.png",
  featGuide: "/brand/inclusion-icons/guide.png",
};

function HotelSummaryRow({
  hotel,
  cityLabel,
  nightsCount,
  dateLabel,
}: {
  hotel: Hotel;
  cityLabel: string;
  nightsCount: number;
  dateLabel: string;
}) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const thumb = hotel.images[0]?.src ?? "/brand/hero-bg.png";
  const walkingItem = getHotelInfoItems(hotel).find((item) => item.id === "walking");
  const walkingLabel = walkingItem ? formatHotelInfoLabel(t, walkingItem) : null;

  return (
    <div className="flex gap-3.5">
      <div className="relative h-[5.25rem] w-[5.25rem] shrink-0 overflow-hidden rounded-[10px] bg-surface shadow-[0_2px_8px_rgba(9,36,92,0.08)]">
        <Image
          src={thumb}
          alt={hotel.name}
          fill
          className="object-cover"
          sizes="84px"
          quality={IQ.thumb}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium text-[#5B6B7C]">
          {cityLabel} – {tCommon("nights", { count: nightsCount })}
        </p>

        <p className="mt-1 text-[15px] font-bold leading-tight text-navy">
          {hotel.name}{" "}
          <span className="text-brand-gold" aria-label={`${hotel.stars} stars`}>
            {"★".repeat(hotel.stars)}
          </span>
        </p>

        <ul className="mt-2 space-y-1">
          <li className="text-[11px] font-medium leading-snug text-navy">
            <span aria-hidden>📅 </span>
            {dateLabel}
          </li>
          {walkingLabel && (
            <li className="text-[11px] font-medium leading-snug text-navy">
              <span aria-hidden>📍 </span>
              {walkingLabel}
            </li>
          )}
          {hotel.breakfast && (
            <li className="text-[11px] font-medium leading-snug text-navy">
              <span aria-hidden>☕ </span>
              {t("breakfast")}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function FlightLegBlock({
  dir,
  leg,
  dateLabel,
  t,
}: {
  dir: "outbound" | "inbound";
  leg: TripFlightInfo["outbound"];
  dateLabel: string;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  return (
    <div>
      <p className="text-[12px] font-bold text-navy">{t(dir)}</p>
      <p className="mt-0.5 text-[11px] font-medium text-navy">{dateLabel}</p>

      <p className="dir-ltr-keep mt-2 text-[13px] font-bold leading-snug text-navy">
        {leg.fromCode} {leg.departTime}
        <span className="mx-1 font-semibold" aria-hidden>
          →
        </span>
        {leg.toCode} {leg.arriveTime}
      </p>
      <p className="mt-1 text-[11px] font-medium text-navy">
        {leg.fromCity} → {leg.toCity}
      </p>

      {leg.direct && (
        <p className="mt-2 text-[11px] font-medium text-navy">{t("direct")}</p>
      )}
      <p className="text-[11px] font-medium text-navy">
        {t("flightDuration", { duration: leg.duration })}
      </p>
    </div>
  );
}

function FlightSummary({
  flights,
  trip,
  locale,
  t,
}: {
  flights: TripFlightInfo;
  trip: UmrahTrip;
  locale: string;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const outboundDate = formatFlightLegDateLabel(trip.startDate, locale);
  const inboundDate = formatFlightLegDateLabel(trip.endDate, locale);

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-bold leading-snug text-navy">
          {t("flightInfo", { airline: flights.airline })}
        </h3>
        <div className="relative h-7 w-[5.75rem] shrink-0">
          <Image
            src={flights.airlineLogo}
            alt={flights.airline}
            fill
            className="object-contain object-end"
            sizes="92px"
            quality={IQ.content}
          />
        </div>
      </div>

      <div className="space-y-4">
        <FlightLegBlock
          dir="outbound"
          leg={flights.outbound}
          dateLabel={outboundDate}
          t={t}
        />
        <FlightLegBlock dir="inbound" leg={flights.inbound} dateLabel={inboundDate} t={t} />
      </div>

      <div className="mt-4">
        <p className="text-[12px] font-bold text-navy">{t("baggage")}</p>
        <p className="mt-0.5 text-[11px] font-medium text-navy">{flights.baggageAllowance}</p>
      </div>
    </div>
  );
}

function OverviewCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-bold leading-tight text-navy">{label}</p>
      <p className="mt-0.5 text-[11px] font-medium text-navy">{value}</p>
    </div>
  );
}

function PriceRow({
  title,
  subtitle,
  price,
}: {
  title: string;
  subtitle?: string;
  price: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3 last:border-b-0 last:pb-0 first:pt-0">
      <div className="min-w-0">
        <p className="text-[13px] font-bold leading-snug text-navy">{title}</p>
        {subtitle && (
          <p className="mt-1 text-[11px] font-medium leading-snug text-[#5B6B7C]">{subtitle}</p>
        )}
      </div>
      <p className="shrink-0 text-[15px] font-bold leading-none text-navy">{price}</p>
    </div>
  );
}

/** Left column — selected trip summary for inquiry checkout. */
export function InquiryTripSummary({
  trip,
  medina,
  makkah,
}: {
  trip: UmrahTrip;
  medina: Hotel;
  makkah: Hotel;
}) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const locale = useLocale();
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

  const euroLocale =
    locale === "de" ? "de-AT" : locale === "ar" ? "ar-SA" : locale === "bs" ? "bs-BA" : "en-GB";

  const dateFull = formatTripDisplayDateRange(trip.startDate, trip.endDate, locale);
  const hotelStayDates = getTripHotelStayDateLabels(trip, locale);
  const displayTitle = getLocalizedTripTitle(trip, locale, t);
  const heroImage = trip.images[0] ?? { src: "/brand/hero-bg.png", caption: displayTitle };

  return (
    <aside className="h-fit lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-[16px] border border-line bg-white shadow-[var(--shadow-card)]">
        {/* Summary hero */}
        <div className="px-5 pt-5 sm:px-6">
          <h2 className="text-[15px] font-bold leading-snug text-navy">{t("inquiryTitle")}</h2>

          <span className="mt-2 inline-flex rounded-[5px] bg-brand-green-soft px-2 py-[3px] text-[10px] font-bold tracking-[0.06em] text-brand-green uppercase">
            {tCommon("nights", { count: trip.nights })}
          </span>

          <p className="mt-3 text-[22px] font-bold leading-tight tracking-[-0.01em] text-navy">
            {displayTitle}
          </p>

          <p className="mt-2 text-[13px] font-semibold text-navy">
            <span aria-hidden>📅 </span>
            {dateFull}
          </p>

          <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-[10px] bg-surface">
            <Image
              src={heroImage.src}
              alt={heroImage.caption || displayTitle}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 400px"
              quality={IQ.content}
              priority
            />
          </div>

          <ul className="mt-4 grid grid-cols-4 gap-2 pb-5">
            {INQUIRY_SUMMARY_ITEMS.map((key) => (
              <li key={key} className="flex flex-col items-center gap-1.5 text-center">
                <div className="relative h-9 w-9 shrink-0">
                  <Image
                    src={INQUIRY_SUMMARY_ICONS[key]}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="36px"
                    quality={IQ.thumb}
                  />
                </div>
                <span className="text-[9px] font-semibold leading-tight text-navy sm:text-[10px]">
                  {t(key)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hotels */}
        <div className="border-t border-line px-5 py-5 sm:px-6">
          <h3 className="text-[15px] font-bold text-navy">{t("inquiryHotels")}</h3>
          <div className="mt-4 space-y-5">
            <HotelSummaryRow
              hotel={medina}
              cityLabel={t("medina")}
              nightsCount={trip.medinaStay.nights}
              dateLabel={hotelStayDates.medina}
            />
            <HotelSummaryRow
              hotel={makkah}
              cityLabel={t("makkah")}
              nightsCount={trip.makkahStay.nights}
              dateLabel={hotelStayDates.makkah}
            />
          </div>
        </div>

        {/* Flights */}
        <div className="border-t border-line px-5 py-5 sm:px-6">
          <FlightSummary flights={flights} trip={trip} locale={locale} t={t} />
        </div>

        {/* Reiseübersicht */}
        <div className="border-t border-line px-5 py-5 sm:px-6">
          <h3 className="text-[15px] font-bold text-navy">{t("inquiryTripOverview")}</h3>
          <div className="mt-4 grid grid-cols-2 gap-y-4">
            <div className="pe-4 sm:pe-5">
              <OverviewCell label={t("duration")} value={tCommon("nights", { count: trip.nights })} />
            </div>
            <div className="border-s border-line ps-4 sm:ps-5">
              <OverviewCell
                label={t("groupSize")}
                value={t("maxPersons", { count: trip.groupSize })}
              />
            </div>
            <div className="pe-4 sm:pe-5">
              <OverviewCell label={t("departureAirport")} value={trip.departureAirport} />
            </div>
            <div className="border-s border-line ps-4 sm:ps-5">
              <OverviewCell label={t("airline")} value={flights.airline} />
            </div>
          </div>
        </div>

        {/* Kinder- & Babypreise */}
        <div className="border-t border-line px-5 py-5 sm:px-6">
          <div className="rounded-xl border border-line bg-white p-5 sm:p-6">
            <h3 className="text-[15px] font-bold text-navy">{t("inquiryChildPrices")}</h3>
            <div className="mt-4">
              <PriceRow
                title={t("infantPrice")}
                subtitle={t("inclFlightVisa")}
                price={formatEuro(trip.childPrices.infant, euroLocale)}
              />
              <PriceRow
                title={t("childNoBed")}
                price={formatEuro(trip.childPrices.withoutBed, euroLocale)}
              />
              <PriceRow
                title={t("childWithBed")}
                price={formatEuroReduction(trip.childPrices.withBedDiscount, euroLocale)}
              />
            </div>
            <div className="mt-4 rounded-lg border border-brand-cta/20 bg-brand-cta/5 px-4 py-3.5">
              <div className="flex gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-cta" aria-hidden />
                <p className="text-[12px] leading-relaxed text-navy">
                  <span className="font-bold">{t("inquiryExampleLabel")}</span> {t("childPriceNoteBody")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
