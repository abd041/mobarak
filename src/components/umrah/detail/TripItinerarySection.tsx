"use client";

import Image from "next/image";
import { Libre_Baskerville } from "next/font/google";
import { useTranslations } from "next-intl";
import { ChevronRight, Plane, Star } from "lucide-react";
import { DirArrow } from "@/components/ui/DirArrow";
import type { UmrahTrip } from "@/data/mock";
import { getHotel, IMG } from "@/data/mock";
import { IQ } from "@/lib/images";
import { cn } from "@/lib/utils";

const display = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const GREEN_TOP = "#14B85E";
const GREEN_BOTTOM = "#00873E";

function shortHotelName(name: string | undefined, fallback: string): string {
  if (!name) return fallback;
  return name
    .replace(/\s+Hotel\s+(Makkah|Medina|Madinah).*$/i, "")
    .replace(/^Le Méridien Medina$/i, "Le Meridien")
    .replace(/^Anjum Hotel Makkah$/i, "Anjum")
    .trim();
}

function DayBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-[6px] px-2.5 py-[5px] text-[11px] font-extrabold leading-none tracking-[0.01em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(0,80,30,0.22)]",
        className,
      )}
      style={{
        background: `linear-gradient(180deg, ${GREEN_TOP} 0%, ${GREEN_BOTTOM} 100%)`,
      }}
    >
      {children}
    </span>
  );
}

type TimelineCard = {
  badge: string;
  iconSrc?: string;
  title: string;
  subtitle: string;
  customIcon?: "kaaba";
};

function KaabaIcon({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-9 w-9" : "h-11 w-11 sm:h-12 sm:w-12";
  return (
    <span className={cn("relative inline-block shrink-0", box)} aria-hidden>
      <span className="absolute inset-[3px] rounded-[3px] bg-[#1A120C]" />
      <span className="absolute inset-x-[6px] top-[12px] h-[4px] rounded-sm bg-[#E8A317]" />
      <span className="absolute top-[2px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#E8A317]" />
    </span>
  );
}

function TimelineCardView({ card }: { card: TimelineCard }) {
  return (
    <div className="relative flex h-full min-w-[10.5rem] flex-1 flex-col items-center rounded-[14px] bg-white px-3 pt-10 pb-3.5 text-center shadow-[0_4px_16px_rgba(15,40,80,0.09)] sm:min-w-0">
      <DayBadge className="absolute top-2.5 start-2.5">{card.badge}</DayBadge>
      {card.customIcon === "kaaba" ? (
        <KaabaIcon />
      ) : card.iconSrc ? (
        <span className="relative h-11 w-11 shrink-0 sm:h-12 sm:w-12">
          <Image
            src={card.iconSrc}
            alt=""
            fill
            className="object-contain object-center"
            sizes="48px"
            unoptimized
          />
        </span>
      ) : null}
      <p className="mt-2.5 m-0 text-[13px] font-bold leading-snug text-[#001A41]">{card.title}</p>
      <p className="mt-1 m-0 text-[11px] font-medium leading-snug text-[#4A6080]">{card.subtitle}</p>
    </div>
  );
}

function TimelineRow({ cards }: { cards: TimelineCard[] }) {
  return (
    <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto pb-1 lg:overflow-visible lg:pb-0">
      {cards.map((card, i) => (
        <div key={`${card.badge}-${card.title}`} className="flex min-w-0 flex-1 items-center">
          {i > 0 ? (
            <ChevronRight
              className="mx-1 h-4 w-4 shrink-0 text-[#1A1A1A] sm:mx-1.5"
              strokeWidth={2.75}
              aria-hidden
            />
          ) : null}
          <TimelineCardView card={card} />
        </div>
      ))}
    </div>
  );
}

/** Mobile city header card — image left, copy right (reference). */
function MobileCityCard({
  imageSrc,
  imageAlt,
  badge,
  title,
  tagline,
  nightsLabel,
  hotelLabel,
}: {
  imageSrc: string;
  imageAlt: string;
  badge: string;
  title: string;
  tagline: string;
  nightsLabel: string;
  hotelLabel: string;
}) {
  return (
    <article className="flex items-center gap-3 rounded-[14px] bg-white p-3 shadow-[0_4px_16px_rgba(15,40,80,0.07)]">
      <div className="relative h-[5.75rem] w-[5.75rem] shrink-0 overflow-hidden rounded-[10px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="92px"
          quality={IQ.content}
        />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <DayBadge>{badge}</DayBadge>
        <h3
          className={cn(
            display.className,
            "mt-1.5 m-0 text-[1.25rem] leading-none font-bold text-[#111111]",
          )}
        >
          {title}
        </h3>
        <p className="mt-1 m-0 text-[12px] font-medium text-[#2A3A4D]">{tagline}</p>
        <p className="mt-2 m-0 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px]">
          <Star className="h-3 w-3 fill-[#F0B429] text-[#F0B429]" aria-hidden />
          <span className="font-bold text-[#C9A227]">{nightsLabel}</span>
          <span className="text-[#6B7C8F]">{hotelLabel}</span>
        </p>
      </div>
    </article>
  );
}

/** Mobile activity row — badge | icon | text (reference). */
function MobileActivityCard({ card }: { card: TimelineCard }) {
  return (
    <article className="flex items-center gap-3 rounded-[14px] bg-white px-3 py-3.5 shadow-[0_4px_16px_rgba(15,40,80,0.07)]">
      <DayBadge className="shrink-0">{card.badge}</DayBadge>
      {card.customIcon === "kaaba" ? (
        <KaabaIcon size="sm" />
      ) : card.iconSrc ? (
        <span className="relative h-9 w-9 shrink-0">
          <Image
            src={card.iconSrc}
            alt=""
            fill
            className="object-contain object-center"
            sizes="36px"
            unoptimized
          />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[14px] font-bold leading-snug text-[#111111]">{card.title}</p>
        <p className="mt-0.5 m-0 text-[12px] font-medium leading-snug text-[#5B6B7C]">
          {card.subtitle}
        </p>
      </div>
    </article>
  );
}

/** Reiseprogramm — mobile list cards + desktop storyboard. */
export function TripItinerarySection({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const medinaHotel = getHotel(trip.medinaHotelId);
  const makkahHotel = getHotel(trip.makkahHotelId);
  const returnCity = trip.inbound.toCity;

  const totalDays = 13;
  const medinaNights = trip.medinaStay.nights;
  const makkahNights = trip.makkahStay.nights;

  const medinaEvents: TimelineCard[] = [
    {
      badge: t("dayLabel", { day: 1 }),
      iconSrc: "/brand/itinerary-icons/day-13.png",
      title: t("itinEventArriveTitle"),
      subtitle: t("itinEventArriveSub"),
    },
    {
      badge: t("dayLabel", { day: 2 }),
      iconSrc: "/brand/itinerary-icons/day-02.png",
      title: t("itinEventEveningTitle"),
      subtitle: t("itinEventEveningSub"),
    },
    {
      badge: t("dayLabel", { day: 3 }),
      iconSrc: "/brand/itinerary-icons/day-03.png",
      title: t("itinEventManasikTitle"),
      subtitle: t("itinEventManasikSub"),
    },
    {
      badge: t("dayLabel", { day: 4 }),
      iconSrc: "/brand/itinerary-icons/day-04.png",
      title: t("itinEventTalkTitle"),
      subtitle: t("itinEventTalkSub"),
    },
  ];

  const makkahEvents: TimelineCard[] = [
    {
      badge: t("dayLabel", { day: 5 }),
      iconSrc: "/brand/itinerary-icons/day-05.png",
      title: t("itinEventToMakkahTitle"),
      subtitle: t("itinEventToMakkahSub"),
    },
    {
      badge: t("dayRangeLabel", { start: 6, end: 11 }),
      customIcon: "kaaba",
      title: t("itinEventUmrahTitle"),
      subtitle: t("itinEventUmrahSub"),
    },
    {
      badge: t("dayLabel", { day: 12 }),
      iconSrc: "/brand/itinerary-icons/day-09.png",
      title: t("itinEventFreeTitle"),
      subtitle: t("itinEventFreeSub"),
    },
  ];

  return (
    <section id="itinerary" className="trip-section scroll-mt-24">
      <div className="mb-5 flex flex-col gap-2.5 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h2
            className={cn(
              display.className,
              "m-0 text-[1.6rem] font-bold tracking-[-0.02em] text-[#111111] sm:text-[1.8rem]",
            )}
          >
            {t("offerItineraryTitle")}
          </h2>
          <p className="mt-1.5 m-0 max-w-xl text-[14px] leading-snug text-[#4A5F78] sm:text-[15px]">
            {t("offerItinerarySubtitle", { days: totalDays })}
          </p>
        </div>
        <a
          href="#gallery"
          className="inline-flex shrink-0 items-center gap-1 pt-1 text-[14px] font-bold text-[#1264F5] transition hover:opacity-80"
        >
          {t("viewDetailedProgram")}
          <DirArrow className="ms-0" />
        </a>
      </div>

      {/* ── Mobile: vertical white cards (reference) ── */}
      <div className="space-y-2.5 rounded-[16px] bg-[#F4F7FB] p-3 sm:p-4 lg:hidden">
        <MobileCityCard
          imageSrc={IMG.medina}
          imageAlt={t("medina")}
          badge={t("dayRangeLabel", { start: 1, end: 3 })}
          title={t("medina")}
          tagline={t("itinMedinaTagline")}
          nightsLabel={tCommon("nights", { count: medinaNights })}
          hotelLabel={t("itinHotelLabel", {
            hotel: shortHotelName(medinaHotel?.name, "Le Meridien"),
          })}
        />
        {medinaEvents.map((card) => (
          <MobileActivityCard key={`m-${card.badge}-${card.title}`} card={card} />
        ))}

        <MobileCityCard
          imageSrc={IMG.kaaba}
          imageAlt={t("makkah")}
          badge={t("dayRangeLabel", { start: 5, end: 12 })}
          title={t("makkah")}
          tagline={t("itinMakkahTagline")}
          nightsLabel={tCommon("nights", { count: makkahNights })}
          hotelLabel={t("itinHotelLabel", {
            hotel: shortHotelName(makkahHotel?.name, "Anjum"),
          })}
        />
        {makkahEvents.map((card) => (
          <MobileActivityCard key={`k-${card.badge}-${card.title}`} card={card} />
        ))}

        <article className="relative overflow-hidden rounded-[14px] bg-white shadow-[0_4px_16px_rgba(15,40,80,0.07)]">
          <div className="relative flex min-h-[6.5rem] items-center">
            <div className="relative h-full min-h-[6.5rem] w-[55%] shrink-0">
              <Image
                src={IMG.plane}
                alt=""
                fill
                className="object-cover object-[center_40%]"
                sizes="55vw"
                quality={IQ.content}
              />
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.55) 70%, #ffffff 100%)",
                }}
              />
              <DayBadge className="absolute top-2.5 start-2.5 z-10">
                {t("dayLabel", { day: 13 })}
              </DayBadge>
            </div>
            <div className="relative z-10 min-w-0 flex-1 pe-3 ps-1">
              <h3 className="m-0 text-[14px] font-bold leading-snug text-[#111111]">
                {t("itinReturnTitle", { city: returnCity })}
              </h3>
              <p className="mt-1 m-0 text-[12px] font-medium text-[#5B6B7C]">
                {t("itinReturnSub")}
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* ── Desktop: storyboard rows ── */}
      <div className="hidden space-y-3.5 lg:block">
        <div className="rounded-[16px] bg-[#F0F7FF] p-[18px]">
          <div className="flex flex-row items-center gap-4 xl:gap-5">
            <div className="relative h-[148px] w-[148px] shrink-0 overflow-hidden rounded-[12px]">
              <Image
                src={IMG.medina}
                alt={t("medina")}
                fill
                className="object-cover"
                sizes="148px"
                quality={IQ.content}
                priority
              />
            </div>
            <div className="w-[10.75rem] shrink-0 xl:w-[11.5rem]">
              <DayBadge>{t("dayRangeLabel", { start: 1, end: 3 })}</DayBadge>
              <h3
                className={cn(
                  display.className,
                  "mt-2 m-0 text-[1.55rem] leading-none font-bold text-[#111111]",
                )}
              >
                {t("medina")}
              </h3>
              <p className="mt-1.5 m-0 text-[13px] font-medium text-[#2A3A4D]">
                {t("itinMedinaTagline")}
              </p>
              <p className="mt-3 m-0 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px]">
                <Star className="h-3.5 w-3.5 fill-[#F0B429] text-[#F0B429]" aria-hidden />
                <span className="font-bold text-[#C9A227]">
                  {tCommon("nights", { count: medinaNights })}
                </span>
                <span className="text-[#6B7C8F]">
                  {t("itinHotelLabel", {
                    hotel: shortHotelName(medinaHotel?.name, "Le Meridien"),
                  })}
                </span>
              </p>
            </div>
            <TimelineRow cards={medinaEvents} />
          </div>
        </div>

        <div className="rounded-[16px] bg-[#FFF9F0] p-[18px]">
          <div className="flex flex-row items-center gap-4 xl:gap-5">
            <div className="relative h-[148px] w-[148px] shrink-0 overflow-hidden rounded-[12px]">
              <Image
                src={IMG.kaaba}
                alt={t("makkah")}
                fill
                className="object-cover"
                sizes="148px"
                quality={IQ.content}
              />
            </div>
            <div className="w-[10.75rem] shrink-0 xl:w-[11.5rem]">
              <DayBadge>{t("dayRangeLabel", { start: 5, end: 12 })}</DayBadge>
              <h3
                className={cn(
                  display.className,
                  "mt-2 m-0 text-[1.55rem] leading-none font-bold text-[#111111]",
                )}
              >
                {t("makkah")}
              </h3>
              <p className="mt-1.5 m-0 text-[13px] font-medium text-[#2A3A4D]">
                {t("itinMakkahTagline")}
              </p>
              <p className="mt-3 m-0 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px]">
                <Star className="h-3.5 w-3.5 fill-[#F0B429] text-[#F0B429]" aria-hidden />
                <span className="font-bold text-[#C9A227]">
                  {tCommon("nights", { count: makkahNights })}
                </span>
                <span className="text-[#6B7C8F]">
                  {t("itinHotelLabel", {
                    hotel: shortHotelName(makkahHotel?.name, "Anjum"),
                  })}
                </span>
              </p>
            </div>
            <TimelineRow cards={makkahEvents} />
          </div>
        </div>

        <div className="rounded-[16px] bg-[#F0F7FF] p-[18px]">
          <div className="flex flex-row items-center gap-5">
            <div className="relative h-[88px] w-[220px] shrink-0 overflow-hidden rounded-[12px]">
              <Image
                src={IMG.plane}
                alt=""
                fill
                className="object-cover object-[center_40%]"
                sizes="220px"
                quality={IQ.content}
              />
            </div>
            <div className="min-w-0 flex-1">
              <DayBadge>{t("dayLabel", { day: 13 })}</DayBadge>
              <h3
                className={cn(
                  display.className,
                  "mt-2 m-0 text-[1.3rem] font-bold text-[#111111]",
                )}
              >
                {t("itinReturnTitle", { city: returnCity })}
              </h3>
              <p className="mt-1 m-0 text-[13px] font-medium text-[#4A5F78]">
                {t("itinReturnSub")}
              </p>
            </div>
            <div className="ms-auto flex shrink-0 items-center gap-2 text-[#0B2C4A]">
              <Plane className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              <span className="text-[14px] font-bold">
                {t("itinDepartCity", { city: returnCity })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
