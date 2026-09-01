import Image from "next/image";
/**
 * Single Mobarak offer PDF structure (spec 18).
 * Localization comes from offer_template_{de|ar|en|tr|bs} — never five separate PDFs.
 * Admin stays German; this document follows customer_language (or pdfLanguageOverride).
 * Spec 14: prices / room totals / flight fares / dates / passenger counts are taken
 * from structured offer+inquiry data unchanged; language only swaps chrome & labels.
 * RTL is built into the Arabic template from the start — do not retrofit later.
 */
import {
  BookUser,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  IdCard,
  Info,
  Mail,
  Moon,
  Phone,
  Plane,
  TrainFront,
  Users,
  Globe,
  Luggage,
} from "lucide-react";
import type { IndividualUmrahInquiry } from "@/lib/individual-umrah-inquiry";
import type {
  IndividualUmrahOffer,
  OfferFlightLeg,
  OfferHotelOption,
} from "@/lib/individual-umrah-offer";
import { inquiryCityStayRanges, addonsVisibleOnPdf } from "@/lib/individual-umrah-offer-defaults";
import {
  avgPerPerson,
  ensurePerRoomBreakdown,
  roomsTotal,
  shouldShowBreakfastPriceLine,
} from "@/lib/individual-umrah-offer-pricing";
import { resolveHotelById } from "@/lib/hotel-catalog";
import { getOfferHotelMissingRateDates } from "@/lib/individual-umrah-hotel-rates-store";
import { formatTripDisplayDateRange } from "@/lib/trip-inquiry";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  formatOfferPdfAddonPriceParts,
  formatOfferPdfAirport,
  formatOfferPdfBaggageLines,
  formatOfferPdfBoard,
  formatOfferPdfDate,
  formatOfferPdfDateTime,
  formatOfferPdfEuro,
  formatOfferPdfFlightLegLines,
  formatOfferPdfMissingRate,
  localizeOfferPdfOccupancy,
  localizeOfferPdfRoomCategory,
  pluralPdf,
  resolveOfferPdfAddonCopy,
  resolveOfferPdfTermsFromOffer,
  type OfferPdfCopy,
  type OfferPdfLocale,
} from "@/lib/individual-umrah-offer-pdf-i18n";
import { resolveOfferPdfTemplate } from "@/lib/individual-umrah-offer-pdf-templates";

const NAVY = "#0B2C4A";
const ORANGE = "#E87722";
const GREEN = "#1B6B3A";
const GREEN_SOFT = "#E8F6EE";
const MUTED = "#6B7C8F";
const LINE = "#E6E8EC";

function flexibilityLabel(days: number | null, t: OfferPdfCopy): string {
  if (days === null) return t.flexUnspecified;
  if (days === 0) return t.flexExact;
  return t.flexDays(days);
}

function routeLabel(inquiry: IndividualUmrahInquiry, t: OfferPdfCopy): string {
  if (inquiry.route === "makkah_only") return t.routeMakkahOnly;
  if (inquiry.city_order === "makkah_first") return t.routeMakkahFirst;
  return t.routeMedinaFirst;
}

/** Five-column travel summary — always derived from the inquiry. */
function travelSummaryItems(
  inquiry: IndividualUmrahInquiry,
  t: OfferPdfCopy,
  lang: OfferPdfLocale,
) {
  const adults = inquiry.travellers.adult_count;
  const children = inquiry.travellers.child_count;
  const infants = inquiry.travellers.infant_count;
  const showMedina = inquiry.route === "makkah_medina" && inquiry.nights.medina_nights > 0;

  return [
    {
      Icon: Plane,
      label: t.airports,
      lines:
        inquiry.airports.length > 0
          ? inquiry.airports.map((code) => formatOfferPdfAirport(code, t))
          : ["—"],
    },
    {
      Icon: Users,
      label: t.travellers,
      lines: [
        pluralPdf(t, adults, "adultOne", "adultMany"),
        `${pluralPdf(t, children, "childOne", "childMany")}, ${pluralPdf(t, infants, "infantOne", "infantMany")}`,
        pluralPdf(t, inquiry.rooms.room_count, "roomOne", "roomMany"),
      ],
    },
    {
      Icon: Building2,
      label: t.route,
      lines: [routeLabel(inquiry, t)],
    },
    {
      Icon: Moon,
      label: t.nights,
      lines: [
        ...(showMedina
          ? [pluralPdf(t, inquiry.nights.medina_nights, "nightMedinaOne", "nightMedinaMany")]
          : []),
        pluralPdf(t, inquiry.nights.makkah_nights, "nightMakkahOne", "nightMakkahMany"),
      ],
    },
    {
      Icon: CalendarDays,
      label: t.travelStartSummary,
      lines: [
        formatOfferPdfDate(inquiry.travel_date.requested_start_date, lang),
        flexibilityLabel(inquiry.travel_date.flexibility_days, t),
      ],
    },
  ] as const;
}

function Stars({ count, t }: { count: number; t: OfferPdfCopy }) {
  return (
    <span className="text-[11px] tracking-tight text-[#E8A317]" aria-label={t.starsAria(count)}>
      {"★".repeat(Math.max(0, Math.min(5, count)))}
    </span>
  );
}

function SectionTitle({
  n,
  title,
  subtitle,
  Icon,
  rtl,
}: {
  n: number;
  title: string;
  subtitle?: string | null;
  Icon: typeof Plane;
  rtl?: boolean;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
          style={{ background: NAVY }}
        >
          {n}
        </span>
        <Icon className="h-4 w-4 shrink-0" style={{ color: NAVY }} strokeWidth={1.75} />
        <h2
          className={`text-[15px] font-bold ${rtl ? "text-start" : ""}`}
          style={{ color: NAVY }}
        >
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p
          className="mt-1 ps-[2.65rem] text-[11px] font-medium text-start"
          style={{ color: MUTED }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** Spec 43 — options are choices, never one auto-combined package total. */
function AlternativesNotice({ t }: { t: OfferPdfCopy }) {
  return (
    <p
      className="flex items-start gap-1.5 rounded-lg px-3 py-2 text-start text-[9.5px] leading-relaxed"
      style={{ background: "#F0F4F8", color: "#3D4F5F" }}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} style={{ color: "#1E5A9C" }} />
      <span>
        <strong style={{ color: NAVY }}>{t.alternativesTitle}</strong> {t.alternativesBody}
      </span>
    </p>
  );
}

/** Distance line for PDF hotel cards (approved copy). */
function hotelDistanceLabel(
  hotel: {
    city?: string;
    walkingMinutes?: number;
  } | null | undefined,
  t: OfferPdfCopy,
): string {
  const minutes = Math.max(1, hotel?.walkingMinutes ?? 3);
  const meters = Math.max(50, Math.round((minutes * 70) / 50) * 50);
  return t.distanceHaram(meters);
}

function HotelCard({
  option,
  index,
  adults,
  childrenCount,
  roomCount,
  stayStartDate,
  nights,
  t,
  lang,
  rtl,
}: {
  option: OfferHotelOption;
  index: number;
  adults: number;
  childrenCount: number;
  roomCount: number;
  stayStartDate: string | null;
  nights: number;
  t: OfferPdfCopy;
  lang: OfferPdfLocale;
  rtl: boolean;
}) {
  const hotel = resolveHotelById(option.hotelId);
  const { roomPrices, roomOccupancyLabels } = ensurePerRoomBreakdown(
    roomCount,
    option.roomPrices,
    option.roomOccupancyLabels,
  );
  const missingDates = getOfferHotelMissingRateDates(option, stayStartDate, nights);
  const pricingIncomplete = missingDates.length > 0;
  const total = roomsTotal(roomPrices);
  const avg = avgPerPerson(total, adults, childrenCount);
  const image = hotel?.images[0]?.src ?? "/brand/hero-bg.png";
  // Official catalog name — never translate (e.g. Anwar Al Madinah Mövenpick).
  const name = hotel?.name ?? option.hotelId;
  const stars = hotel?.stars ?? 5;
  const board = formatOfferPdfBoard(
    t,
    option.breakfastMode ?? "included",
    option.boardLabel,
    option.mealPlan,
    lang,
  );
  const roomCategory = localizeOfferPdfRoomCategory(
    option.roomCategoryName,
    lang,
    option.roomType,
  );

  return (
    <article
      className="overflow-hidden rounded-xl border bg-white text-start"
      style={{ borderColor: LINE }}
      dir={rtl ? "rtl" : "ltr"}
    >
      <div className="relative h-28 w-full bg-[#EEF2F6]">
        <Image src={image} alt="" fill className="object-cover" sizes="240px" />
        <span
          className="absolute start-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm"
          style={{ background: NAVY }}
        >
          {index + 1}
        </span>
      </div>

      <div className="p-3">
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <p className="text-[12px] font-bold leading-snug" style={{ color: NAVY }} dir="auto">
            {name}
          </p>
          <Stars count={stars} t={t} />
        </div>
        {roomCategory ? (
          <p className="mt-0.5 text-[9px] font-medium leading-snug" style={{ color: "#3D4F5F" }}>
            {roomCategory}
          </p>
        ) : null}

        <p className="mt-1 text-[9px] leading-snug" style={{ color: MUTED }}>
          {hotelDistanceLabel(hotel, t)}
        </p>

        {pricingIncomplete ? (
          <div
            className="mt-2.5 rounded-lg border px-2 py-2 text-start"
            style={{ borderColor: "#F5D0A9", background: "#FFF8F0" }}
          >
            <p className="text-[10px] font-bold" style={{ color: ORANGE }}>
              {t.missingRate}
            </p>
            {missingDates.map((d) => (
              <p key={d} className="mt-0.5 text-[9px] leading-snug" style={{ color: MUTED }}>
                {formatOfferPdfMissingRate(t, name, d, lang)}
              </p>
            ))}
          </div>
        ) : null}

        <div className="mt-2.5 space-y-2 border-t pt-2.5" style={{ borderColor: "#EEF0F3" }}>
          {roomPrices.map((price, i) => {
            const occ = localizeOfferPdfOccupancy(roomOccupancyLabels[i] || "—", t, lang);
            return (
              <div key={i} className="flex items-start justify-between gap-2 text-[10px]">
                <p className="min-w-0 flex-1 font-semibold leading-snug text-start" style={{ color: NAVY }}>
                  {t.roomN(i + 1)}
                  {occ !== "—" ? (
                    <span className="font-medium" style={{ color: MUTED }}>
                      {" "}
                      ({occ})
                    </span>
                  ) : null}
                </p>
                <p
                  className="shrink-0 font-bold tabular-nums"
                  dir="ltr"
                  style={{ color: pricingIncomplete ? ORANGE : NAVY, unicodeBidi: "isolate" }}
                >
                  {pricingIncomplete ? t.missingRate : formatOfferPdfEuro(price, lang)}
                </p>
              </div>
            );
          })}
          <div
            className="flex items-center justify-between gap-2 border-t pt-2 text-[10px]"
            style={{ borderColor: "#EEF0F3" }}
          >
            <p className="min-w-0 flex-1 font-semibold text-start" style={{ color: MUTED }}>
              {t.roomsTotal(roomPrices.length)}
            </p>
            <p
              className="shrink-0 font-bold tabular-nums"
              dir="ltr"
              style={{
                color: pricingIncomplete ? ORANGE : NAVY,
                unicodeBidi: "isolate",
              }}
            >
              {pricingIncomplete ? "—" : formatOfferPdfEuro(total, lang)}
            </p>
          </div>
          <p className="text-[9px] text-start" style={{ color: MUTED }}>
            {pricingIncomplete ? t.pricingIncomplete : null}
          </p>
        </div>

        <div className="mt-2.5 rounded-lg px-2.5 py-2" style={{ background: GREEN_SOFT }}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-medium text-start" style={{ color: GREEN }}>
              {t.avgPerPerson}
            </p>
            <p
              className="text-[14px] font-bold tabular-nums"
              dir="ltr"
              style={{ color: GREEN, unicodeBidi: "isolate" }}
            >
              {pricingIncomplete ? "—" : formatOfferPdfEuro(avg, lang)}
            </p>
          </div>
        </div>

        <div className="mt-2.5 space-y-1 text-[9px] leading-snug text-start" style={{ color: "#3D4F5F" }}>
          <p>{board}</p>
          {shouldShowBreakfastPriceLine(option.breakfastMode ?? "included") &&
          option.breakfastPerPersonNight > 0 ? (
            <p>
              {t.breakfast}:{" "}
              <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {t.mealPerPersonNight(formatOfferPdfEuro(option.breakfastPerPersonNight, lang))}
              </span>
            </p>
          ) : null}
          {option.lunchPerPersonNight > 0 ? (
            <p>
              {t.lunch}:{" "}
              <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {t.mealPerPersonNight(formatOfferPdfEuro(option.lunchPerPersonNight, lang))}
              </span>
            </p>
          ) : null}
          {option.dinnerPerPersonNight > 0 ? (
            <p>
              {t.dinner}:{" "}
              <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {t.mealPerPersonNight(formatOfferPdfEuro(option.dinnerPerPersonNight, lang))}
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function FlightLegCell({
  leg,
  t,
  rtl,
}: {
  leg: OfferFlightLeg;
  t: OfferPdfCopy;
  rtl: boolean;
}) {
  const detailLines = formatOfferPdfFlightLegLines(t, leg);
  return (
    <td className="px-2.5 py-2.5 align-middle leading-snug text-start" style={{ color: "#3D4F5F" }}>
      <p className="font-medium" style={{ color: NAVY }} dir="auto">
        {leg.dateLabel}
      </p>
      {/* Airport codes + times stay LTR so codes are not visually reversed */}
      <p
        className="font-semibold"
        style={{ color: NAVY, unicodeBidi: "isolate" }}
        dir="ltr"
      >
        {leg.fromCode} {leg.departTime} → {leg.toCode} {leg.arriveTime}
      </p>
      <div className={`mt-1 space-y-0.5 text-start ${rtl ? "" : ""}`} style={{ color: MUTED }}>
        {detailLines.map((line) => (
          <p key={line} dir="auto">
            {line}
          </p>
        ))}
      </div>
    </td>
  );
}

function FlightBaggageCell({
  flight,
  t,
  lang,
}: {
  flight: import("@/lib/individual-umrah-offer").OfferFlightOption;
  t: OfferPdfCopy;
  lang: OfferPdfLocale;
}) {
  const lines = formatOfferPdfBaggageLines(t, flight, lang);
  return (
    <td className="px-2.5 py-2.5 align-middle leading-snug text-start">
      <div className="flex items-start gap-1.5">
        <Luggage
          className="mt-0.5 h-3.5 w-3.5 shrink-0"
          style={{ color: GREEN }}
          strokeWidth={2.25}
        />
        <div className="min-w-0 font-semibold text-start" style={{ color: NAVY }} dir="auto">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </td>
  );
}

function AddonIcon({ id }: { id: string }) {
  if (id === "city_transfer") return <TrainFront className="h-5 w-5" strokeWidth={1.75} />;
  if (id === "visa") return <IdCard className="h-5 w-5" strokeWidth={1.75} />;
  return <BookUser className="h-5 w-5" strokeWidth={1.75} />;
}

export function IndividualUmrahOfferDocument({
  inquiry,
  offer,
}: {
  inquiry: IndividualUmrahInquiry;
  offer: IndividualUmrahOffer;
}) {
  const template = resolveOfferPdfTemplate(inquiry, offer);
  const lang = template.locale;
  const t = template.labels;
  const rtl = template.rtl;

  const adults = inquiry.travellers.adult_count;
  const childrenCount = inquiry.travellers.child_count;
  const showMedina = inquiry.route === "makkah_medina" && inquiry.nights.medina_nights > 0;
  const showMakkah = inquiry.nights.makkah_nights > 0;
  /** Approved PDF section order: 1 Flights → 2 Medina → 3 Makkah → 4 Add-ons. */
  const sectionN = {
    flights: 1,
    medina: 2,
    makkah: showMedina ? 3 : 2,
    addons: showMedina ? 4 : 3,
  } as const;
  const stays = inquiryCityStayRanges(inquiry);
  const medinaDateLabel = stays.medina
    ? formatTripDisplayDateRange(stays.medina.checkIn, stays.medina.checkOut, lang)
    : "";
  const makkahDateLabel = stays.makkah
    ? formatTripDisplayDateRange(stays.makkah.checkIn, stays.makkah.checkOut, lang)
    : "";

  const includedItems = resolveOfferPdfTermsFromOffer(offer, "included", lang);
  const excludedItems = resolveOfferPdfTermsFromOffer(offer, "excluded", lang);
  const importantNotes = resolveOfferPdfTermsFromOffer(offer, "notes", lang);

  return (
    <article
      lang={lang}
      dir={rtl ? "rtl" : "ltr"}
      className={`iu-offer-doc mx-auto overflow-hidden bg-white shadow-[0_8px_40px_rgba(11,44,74,0.12)]${
        rtl ? " iu-offer-doc--rtl" : ""
      }`}
      style={{
        width: "210mm",
        maxWidth: "100%",
        color: NAVY,
        fontFamily: rtl
          ? '"Noto Sans Arabic", Tahoma, "Segoe UI", "Arial Unicode MS", sans-serif'
          : "var(--font-dm-sans), system-ui, sans-serif",
        textAlign: rtl ? "right" : "left",
      }}
    >
      {rtl ? (
        <style>{`
          .iu-offer-doc--rtl table { direction: rtl; }
          .iu-offer-doc--rtl th,
          .iu-offer-doc--rtl td { text-align: start; }
          .iu-offer-doc--rtl .iu-label-caps {
            text-transform: none;
            letter-spacing: 0;
          }
        `}</style>
      ) : null}

      {/* —— Header —— */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/brand/hero-bg.png"
            alt=""
            fill
            className={`object-cover ${rtl ? "object-[28%_35%]" : "object-[72%_35%]"}`}
            sizes="800px"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: rtl
                ? "linear-gradient(260deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 42%, rgba(11,44,74,0.15) 70%, rgba(11,44,74,0.35) 100%)"
                : "linear-gradient(100deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 42%, rgba(11,44,74,0.15) 70%, rgba(11,44,74,0.35) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 grid grid-cols-[1.15fr_0.95fr] gap-4 p-6 pb-5">
          <div className="text-start">
            <BrandLogo height={38} priority />
            <h1
              className={`mt-7 text-[28px] font-bold leading-[1.12] ${
                rtl ? "tracking-normal" : "tracking-[-0.02em]"
              }`}
              style={{ color: NAVY }}
            >
              {t.heroTitleLine1}
              <br />
              <span style={{ color: ORANGE }}>{t.heroTitleLine2}</span>
            </h1>
            <p className="mt-4 text-[13px] font-semibold" style={{ color: NAVY }}>
              {t.greeting(offer.greetingName)}
            </p>
            <p className="mt-1.5 max-w-[22rem] text-[10.5px] leading-relaxed" style={{ color: "#3D4F5F" }}>
              {t.intro}
            </p>
            <p className="mt-1.5 text-[10.5px] font-medium leading-relaxed" style={{ color: "#3D4F5F" }}>
              {t.pricesInEuro}
            </p>
          </div>

          <div className="flex items-start justify-end pt-1">
            <div
              className="w-[12.5rem] rounded-xl p-3.5 text-start text-white shadow-lg"
              style={{ background: "rgba(11, 44, 74, 0.94)" }}
              aria-label={t.offerMetaAria}
            >
              <dl className="space-y-2.5 text-[10px] leading-snug">
                <div>
                  <dt
                    className={`iu-label-caps text-[8.5px] font-semibold text-white/60 ${
                      rtl ? "" : "uppercase tracking-[0.06em]"
                    }`}
                  >
                    {t.offerNumber}
                  </dt>
                  <dd
                    className="mt-0.5 text-[12px] font-bold tracking-wide"
                    dir="ltr"
                    style={{ unicodeBidi: "isolate" }}
                  >
                    {offer.offerNumber}
                  </dd>
                </div>
                <div>
                  <dt
                    className={`iu-label-caps text-[8.5px] font-semibold text-white/60 ${
                      rtl ? "" : "uppercase tracking-[0.06em]"
                    }`}
                  >
                    {t.createdOn}
                  </dt>
                  <dd className="mt-0.5 font-semibold">{formatOfferPdfDateTime(offer.createdAt, lang)}</dd>
                </div>
                <div>
                  <dt
                    className={`iu-label-caps text-[8.5px] font-semibold text-white/60 ${
                      rtl ? "" : "uppercase tracking-[0.06em]"
                    }`}
                  >
                    {t.travelStart}
                  </dt>
                  <dd className="mt-0.5 font-semibold">
                    {formatOfferPdfDate(inquiry.travel_date.requested_start_date, lang)}
                  </dd>
                </div>
                <div>
                  <dt
                    className={`iu-label-caps text-[8.5px] font-semibold text-white/60 ${
                      rtl ? "" : "uppercase tracking-[0.06em]"
                    }`}
                  >
                    {t.flexibility}
                  </dt>
                  <dd className="mt-0.5 font-semibold">
                    {flexibilityLabel(inquiry.travel_date.flexibility_days, t)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </header>

      {/* —— Travel summary (from inquiry) —— */}
      <section
        className="mx-6 mb-5 grid grid-cols-5 gap-2 rounded-xl px-3 py-3.5"
        style={{ background: "#F0F4F8" }}
        aria-label={t.travelSummaryAria}
      >
        {travelSummaryItems(inquiry, t, lang).map((item) => (
          <div key={item.label} className="min-w-0 px-1 text-start">
            <div className="mb-1.5 flex items-center gap-1.5" style={{ color: "#1E5A9C" }}>
              <item.Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              <span
                className={`iu-label-caps text-[8.5px] font-bold ${
                  rtl ? "" : "uppercase tracking-[0.07em]"
                }`}
                style={{ color: MUTED }}
              >
                {item.label}
              </span>
            </div>
            {item.lines.map((line, i) => (
              <p
                key={`${item.label}-${i}-${line}`}
                className="text-[10px] font-semibold leading-snug"
                style={{ color: NAVY }}
                dir="auto"
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </section>

      <div className="space-y-5 px-6 pb-5">
        <AlternativesNotice t={t} />

        {/* 1. Flugangebote — before hotels (approved design) */}
        <section>
          <SectionTitle
            n={sectionN.flights}
            title={t.flightsTitle}
            subtitle={t.flightsSubtitle}
            Icon={Plane}
            rtl={rtl}
          />
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: LINE }}>
            <table className="w-full border-collapse text-[9.5px]" dir={rtl ? "rtl" : "ltr"}>
              <thead>
                <tr style={{ background: "#F7F9FB", color: MUTED }}>
                  <th className="px-2.5 py-2 text-start font-semibold">{t.colAirline}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{t.colOutbound}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{t.colReturn}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{t.colBaggage}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{t.colDuration}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{t.colPricePerPerson}</th>
                </tr>
              </thead>
              <tbody>
                {offer.flights.map((flight) => (
                  <tr key={flight.id} className="border-t" style={{ borderColor: "#EEF0F3" }}>
                    <td className="px-2.5 py-2.5 align-middle text-start">
                      <div className="flex items-center gap-2">
                        {flight.logo ? (
                          <span className="relative h-7 w-11 shrink-0">
                            <Image
                              src={flight.logo}
                              alt=""
                              fill
                              className="object-contain"
                              sizes="44px"
                            />
                          </span>
                        ) : null}
                        <span className="font-semibold" style={{ color: NAVY }} dir="auto">
                          {/* Official airline name — never translate */}
                          {flight.airlineName}
                        </span>
                      </div>
                    </td>
                    <FlightLegCell leg={flight.outbound} t={t} rtl={rtl} />
                    <FlightLegCell leg={flight.inbound} t={t} rtl={rtl} />
                    <FlightBaggageCell flight={flight} t={t} lang={lang} />
                    <td
                      className="px-2.5 py-2.5 align-middle font-medium text-start"
                      dir="ltr"
                      style={{ unicodeBidi: "isolate" }}
                    >
                      {flight.totalDuration || "—"}
                    </td>
                    <td className="px-2.5 py-2.5 align-middle text-start">
                      <div className="inline-flex flex-col items-start gap-0.5">
                        <span
                          className="inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums"
                          style={{ background: GREEN_SOFT, color: GREEN }}
                          dir="ltr"
                        >
                          {rtl ? (
                            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                          ) : null}
                          <span style={{ unicodeBidi: "isolate" }}>
                            {formatOfferPdfEuro(flight.pricePerPerson, lang)}
                          </span>
                          {!rtl ? (
                            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                          ) : null}
                        </span>
                        <span className="text-[8px] font-medium" style={{ color: MUTED }}>
                          {t.perPerson}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 flex items-start gap-1.5 text-[9px] leading-relaxed text-start" style={{ color: MUTED }}>
            <Info className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={2} />
            {t.flightSeatNote}
          </p>
        </section>

        {/* 2. Unterkunft in Medina */}
        {showMedina ? (
          <section>
            <SectionTitle
              n={sectionN.medina}
              title={t.accommodationMedina(inquiry.nights.medina_nights)}
              subtitle={
                medinaDateLabel
                  ? t.hotelAlternativesWithDates(medinaDateLabel)
                  : t.hotelAlternatives
              }
              Icon={Building2}
              rtl={rtl}
            />
            <div className="grid grid-cols-3 gap-3">
              {offer.medinaHotels.slice(0, 3).map((hotel, index) => (
                <HotelCard
                  key={hotel.id}
                  option={hotel}
                  index={index}
                  adults={adults}
                  childrenCount={childrenCount}
                  roomCount={inquiry.rooms.room_count}
                  stayStartDate={stays.medina?.checkIn ?? null}
                  nights={inquiry.nights.medina_nights}
                  t={t}
                  lang={lang}
                  rtl={rtl}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* 3. Unterkunft in Makkah */}
        {showMakkah ? (
          <section>
            <SectionTitle
              n={sectionN.makkah}
              title={t.accommodationMakkah(inquiry.nights.makkah_nights)}
              subtitle={
                makkahDateLabel
                  ? t.hotelAlternativesWithDates(makkahDateLabel)
                  : t.hotelAlternatives
              }
              Icon={Building2}
              rtl={rtl}
            />
            <div className="grid grid-cols-3 gap-3">
              {offer.makkahHotels.slice(0, 3).map((hotel, index) => (
                <HotelCard
                  key={hotel.id}
                  option={hotel}
                  index={index}
                  adults={adults}
                  childrenCount={childrenCount}
                  roomCount={inquiry.rooms.room_count}
                  stayStartDate={stays.makkah?.checkIn ?? null}
                  nights={inquiry.nights.makkah_nights}
                  t={t}
                  lang={lang}
                  rtl={rtl}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* 4. Zusätzliche Leistungen */}
        <section>
          <SectionTitle n={sectionN.addons} title={t.addonsTitle} Icon={Check} rtl={rtl} />
          <div className="grid grid-cols-3 gap-3">
            {addonsVisibleOnPdf(offer.addons).map((addon) => {
              const isOptional = addon.pdfDisplay === "optional";
              const copy = resolveOfferPdfAddonCopy(addon, lang);
              const priceParts = formatOfferPdfAddonPriceParts(
                addon.price,
                addon.pricingType,
                lang,
              );
              return (
                <div
                  key={addon.id}
                  className="rounded-xl border p-3 text-start"
                  dir={rtl ? "rtl" : "ltr"}
                  style={{
                    borderColor: isOptional ? "#C5D7E8" : LINE,
                    background: isOptional ? "#FFFFFF" : "#F7FAFD",
                    borderStyle: isOptional ? "dashed" : "solid",
                  }}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
                      style={{ color: "#1E5A9C" }}
                    >
                      <AddonIcon id={addon.id} />
                    </div>
                    {isOptional ? (
                      <span
                        className={`iu-label-caps rounded-full px-2 py-0.5 text-[8px] font-bold ${
                          rtl ? "" : "uppercase tracking-wide"
                        }`}
                        style={{ background: "#EEF5FB", color: "#1E5A9C" }}
                      >
                        {t.optional}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[11px] font-bold leading-snug" style={{ color: NAVY }}>
                    {copy.title}
                  </p>
                  {copy.body ? (
                    <p className="mt-1 text-[9px] leading-relaxed" style={{ color: MUTED }}>
                      {copy.body}
                    </p>
                  ) : null}
                  <p className="mt-2 text-[12px] font-bold" style={{ color: GREEN }}>
                    <span dir="ltr" className="tabular-nums" style={{ unicodeBidi: "isolate" }}>
                      {priceParts.price}
                    </span>{" "}
                    <span className="text-[9px] font-medium" style={{ color: MUTED }}>
                      {priceParts.unit}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* After numbered sections: Im Preis enthalten → Nicht inkludiert → Wichtige Hinweise */}
        <section className="grid grid-cols-3 gap-3 border-t pt-4" style={{ borderColor: "#EEF0F3" }}>
          {(
            [
              {
                title: t.includedTitle,
                items: includedItems,
              },
              {
                title: t.excludedTitle,
                items: excludedItems,
              },
              {
                title: t.notesTitle,
                items: importantNotes,
              },
            ] as const
          ).map((col) => (
            <div key={col.title} className="text-start">
              <h3 className="mb-2 text-[11px] font-bold" style={{ color: NAVY }}>
                {col.title}
              </h3>
              <ul className="space-y-1.5">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-1.5 text-[9px] leading-snug"
                    style={{ color: "#3D4F5F" }}
                  >
                    <Check
                      className="mt-0.5 h-3 w-3 shrink-0"
                      style={{ color: GREEN }}
                      strokeWidth={2.5}
                    />
                    <span className="min-w-0 flex-1 text-start">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      {/* Contact information — last block (approved design) */}
      <footer className="relative overflow-hidden px-6 py-4 text-white" style={{ background: NAVY }}>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-start">
            <p className="text-[13px] font-bold">{t.footerTitle}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-white/90">
              <span
                className="inline-flex items-center gap-1.5"
                dir="ltr"
                style={{ unicodeBidi: "isolate" }}
              >
                <Phone className="h-3 w-3" strokeWidth={2} />
                +43 660 722 45 67
              </span>
              <span
                className="inline-flex items-center gap-1.5"
                dir="ltr"
                style={{ unicodeBidi: "isolate" }}
              >
                <Mail className="h-3 w-3" strokeWidth={2} />
                info@mobarak.at
              </span>
              <span
                className="inline-flex items-center gap-1.5"
                dir="ltr"
                style={{ unicodeBidi: "isolate" }}
              >
                <Globe className="h-3 w-3" strokeWidth={2} />
                www.mobarak.at
              </span>
            </div>
          </div>
          <svg
            viewBox="0 0 160 48"
            className={`h-10 w-36 shrink-0 opacity-30 ${rtl ? "-scale-x-100" : ""}`}
            aria-hidden
          >
            <path
              fill="white"
              d="M8 48V28h6v20H8zm10 0V22h5v26h-5zm9 0V30h8v18h-8zm12 0V18l6-8 6 8v30h-12zm16 0V26h7v22h-7zm11 0V14h4v34h-4zm8 0V20h10v28H74zm14 0V10h5v38h-5zm9 0V24h8v24H97zm12 0V16h6v32h-6zm10 0V28h12v20h-12zm16 0V12l8-10 8 10v36h-16z"
            />
          </svg>
        </div>
      </footer>
    </article>
  );
}
