import type { UmrahTrip } from "@/data/mock";

/** Inquiry form date line — e.g. 23.10.–31.10.2026 */
export function formatTripInquiryDateRange(startDate: string, endDate: string): string {
  const [sy, sm, sd] = startDate.split("-").map(Number);
  const [ey, em, ed] = endDate.split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");

  if (sy === ey) {
    return `${pad(sd!)}.${pad(sm!)}.–${pad(ed!)}.${pad(em!)}.${ey}`;
  }
  return `${pad(sd!)}.${pad(sm!)}.${sy}–${pad(ed!)}.${pad(em!)}.${ey}`;
}

/** Human-readable trip line passed to the inquiry form — not selectable by the customer. */
export function getTripInquiryLabel(trip: UmrahTrip): string {
  return `${trip.title} – ${formatTripInquiryDateRange(trip.startDate, trip.endDate)}`;
}

/** Long date range for inquiry summary — e.g. 23. Oktober – 31. Oktober 2026 */
export function formatTripDisplayDateRange(startIso: string, endIso: string, locale: string): string {
  const start = new Date(`${startIso}T12:00:00`);
  const end = new Date(`${endIso}T12:00:00`);
  const loc =
    locale === "de"
      ? "de-AT"
      : locale === "ar"
        ? "ar-SA-u-nu-latn"
        : locale === "tr"
          ? "tr-TR"
          : locale === "bs"
            ? "bs-BA"
            : "en-GB";
  const dayMonth = new Intl.DateTimeFormat(loc, { day: "numeric", month: "long" });
  const full = new Intl.DateTimeFormat(loc, { day: "numeric", month: "long", year: "numeric" });
  if (start.getFullYear() === end.getFullYear()) {
    return `${dayMonth.format(start)} – ${full.format(end)}`;
  }
  return `${full.format(start)} – ${full.format(end)}`;
}

/** Main card date line — e.g. 23. Okt. – 31. Okt. 2026 */
export function getTripCardDateLabel(trip: UmrahTrip, locale: string): string {
  if (trip.startDate && trip.endDate) {
    return formatHotelStayDateRange(trip.startDate, trip.endDate, locale);
  }
  return trip.dateLabel;
}

function inquiryLocale(locale: string): string {
  return locale === "de"
    ? "de-AT"
    : locale === "ar"
      ? "ar-SA"
      : locale === "tr"
        ? "tr-TR"
        : locale === "bs"
          ? "bs-BA"
          : "en-GB";
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Hotel stay line — e.g. 23. – 26. Oktober 2026 */
export function formatHotelStayDateRange(startIso: string, endIso: string, locale: string): string {
  const start = new Date(`${startIso}T12:00:00`);
  const end = new Date(`${endIso}T12:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
  const loc = inquiryLocale(locale);

  // Same month + year → "23. – 26. Oktober 2026" (client offer-card style)
  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()
  ) {
    const dayFmt = new Intl.DateTimeFormat(loc, { day: "numeric" });
    const monthYear = new Intl.DateTimeFormat(loc, {
      month: "long",
      year: "numeric",
    }).format(end);
    return `${dayFmt.format(start)}. – ${dayFmt.format(end)}. ${monthYear}`;
  }

  const startLabel = new Intl.DateTimeFormat(loc, {
    day: "numeric",
    month: "long",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat(loc, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(end);
  return `${startLabel} – ${endLabel}`;
}

/** Single hotel date — e.g. 23. Okt. 2026 */
export function formatHotelDayLabel(iso: string, locale: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(inquiryLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Medina / Makkah stay dates — from per-trip check-in / check-out (auto on offer card). */
export function getTripHotelStayDateLabels(trip: UmrahTrip, locale: string) {
  const medinaCheckIn = trip.medinaStay.checkIn || trip.startDate;
  const medinaCheckOut =
    trip.medinaStay.checkOut ||
    (medinaCheckIn ? addDaysIso(medinaCheckIn, trip.medinaStay.nights) : "");
  const makkahCheckIn = trip.makkahStay.checkIn || medinaCheckOut;
  const makkahCheckOut = trip.makkahStay.checkOut || trip.endDate;

  return {
    medina:
      formatHotelStayDateRange(medinaCheckIn, medinaCheckOut, locale) ||
      trip.medinaStay.dateLabel ||
      "",
    makkah:
      formatHotelStayDateRange(makkahCheckIn, makkahCheckOut, locale) ||
      trip.makkahStay.dateLabel ||
      "",
    medinaCheckIn: formatHotelDayLabel(medinaCheckIn, locale),
    medinaCheckOut: formatHotelDayLabel(medinaCheckOut, locale),
    makkahCheckIn: formatHotelDayLabel(makkahCheckIn, locale),
    makkahCheckOut: formatHotelDayLabel(makkahCheckOut, locale),
  };
}

/** Flight leg date — e.g. Do, 23. Oktober 2026 */
export function formatFlightLegDateLabel(iso: string, locale: string): string {
  const d = new Date(`${iso}T12:00:00`);
  const loc = inquiryLocale(locale);
  const weekday = new Intl.DateTimeFormat(loc, { weekday: "short" })
    .format(d)
    .replace(/\.$/, "");
  const date = new Intl.DateTimeFormat(loc, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
  return `${weekday}, ${date}`;
}

export function getTripOfferPath(slug: string): string {
  return `/umrah/gruppenreise/${slug}`;
}

export function getTripInquiryPath(slug: string): string {
  return `${getTripOfferPath(slug)}/anfrage`;
}
