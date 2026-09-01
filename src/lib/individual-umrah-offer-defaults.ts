import {
  resolveCustomerLanguage,
  type IndividualUmrahInquiry,
} from "@/lib/individual-umrah-inquiry";
import {
  generateOfferNumber,
  newOfferEntityId,
  OFFER_ADDON_PDF_DISPLAYS,
  OFFER_ADDON_PRICING_TYPES,
} from "@/lib/individual-umrah-offer";
import type {
  IndividualUmrahOffer,
  OfferAddonOption,
  OfferAddonPdfDisplay,
  OfferAddonPricingType,
  OfferFlightConnection,
  OfferFlightLeg,
  OfferFlightOption,
  OfferFlightSegment,
  OfferHotelOption,
} from "@/lib/individual-umrah-offer";
import {
  calculateInquiryHotelStay,
} from "@/lib/individual-umrah-offer-pricing";
import {
  getIndividualUmrahHotelRate,
  getOfferHotelMissingRateDates,
  getRoomCategory,
  resolveMealPricingForStay,
  resolveRoomStayResult,
} from "@/lib/individual-umrah-hotel-rates-store";
import {
  getAirlineById,
  resolveAirlineLogo,
  resolveAirlineName,
} from "@/lib/airlines-store";
import {
  DEFAULT_ADDON_COPY_BY_LOCALE,
  DEFAULT_OFFER_TERMS_BY_LOCALE,
} from "@/lib/individual-umrah-offer-pdf-i18n";
import { getOfferPdfTemplate } from "@/lib/individual-umrah-offer-pdf-templates";
import {
  DEFAULT_EXCLUDED_TERM_CODES,
  DEFAULT_INCLUDED_TERM_CODES,
  DEFAULT_NOTE_TERM_CODES,
  labelOfferMealPlan,
  parseBaggageSpecFromLabel,
  resolveExcludedTermCode,
  resolveIncludedTermCode,
  resolveMealPlanCodeFromLabel,
  resolveNoteTermCode,
  resolveRoomTypeCodeFromName,
  type OfferExcludedTermCode,
  type OfferIncludedTermCode,
  type OfferMealPlanCode,
  type OfferNoteTermCode,
} from "@/lib/individual-umrah-offer-codes";

function addDaysIso(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** City stay start dates derived from inquiry route / order / nights. */
export function inquiryCityStayStarts(inquiry: IndividualUmrahInquiry): {
  medina: string | null;
  makkah: string;
} {
  const start = inquiry.travel_date.requested_start_date;
  if (inquiry.route === "makkah_only") {
    return { medina: null, makkah: start };
  }
  if (inquiry.city_order === "makkah_first") {
    return {
      makkah: start,
      medina: addDaysIso(start, inquiry.nights.makkah_nights),
    };
  }
  return {
    medina: start,
    makkah: addDaysIso(start, inquiry.nights.medina_nights),
  };
}

export type CityStayRange = {
  checkIn: string;
  checkOut: string;
  nights: number;
};

/**
 * Check-in / check-out per city from departure date, city order, and night counts.
 * Check-out = check-in + nights (e.g. 3 nights: 12.10. → 15.10.).
 */
export function inquiryCityStayRanges(inquiry: IndividualUmrahInquiry): {
  medina: CityStayRange | null;
  makkah: CityStayRange | null;
} {
  const starts = inquiryCityStayStarts(inquiry);
  const medinaNights = Math.max(0, inquiry.nights.medina_nights || 0);
  const makkahNights = Math.max(0, inquiry.nights.makkah_nights || 0);

  return {
    medina:
      starts.medina && medinaNights > 0
        ? {
            checkIn: starts.medina,
            checkOut: addDaysIso(starts.medina, medinaNights),
            nights: medinaNights,
          }
        : null,
    makkah:
      makkahNights > 0
        ? {
            checkIn: starts.makkah,
            checkOut: addDaysIso(starts.makkah, makkahNights),
            nights: makkahNights,
          }
        : null,
  };
}

const DEFAULT_ADDON_PRICES: Record<string, number> = {
  city_transfer: 120,
  religious_medina: 150,
  visa: 150,
};

/** German stock add-on copy (Admin reset / fallback). */
const DEFAULT_ADDON_COPY = DEFAULT_ADDON_COPY_BY_LOCALE.de;

/** Common IATA → city label for connection PDF copy. */
const AIRPORT_CITY_LABELS: Record<string, string> = {
  IST: "Istanbul",
  SAW: "Istanbul",
  AUH: "Abu Dhabi",
  DXB: "Dubai",
  DOH: "Doha",
  CAI: "Kairo",
  AMM: "Amman",
  RUH: "Riyadh",
  JED: "Jeddah",
  MED: "Medina",
  VIE: "Wien",
  MUC: "München",
  FRA: "Frankfurt",
};

export function airportCityLabel(code: string): string {
  const c = code.trim().toUpperCase();
  return AIRPORT_CITY_LABELS[c] ?? c;
}

export function emptyFlightSegment(
  partial?: Partial<OfferFlightSegment>,
): OfferFlightSegment {
  return {
    fromCode: (partial?.fromCode ?? "").trim().toUpperCase(),
    toCode: (partial?.toCode ?? "").trim().toUpperCase(),
    departTime: (partial?.departTime ?? "").trim(),
    arriveTime: (partial?.arriveTime ?? "").trim(),
  };
}

export function emptyFlightConnection(
  partial?: Partial<OfferFlightConnection>,
): OfferFlightConnection {
  const airportCode = (partial?.airportCode ?? "").trim().toUpperCase();
  return {
    airportCode,
    cityLabel: (partial?.cityLabel ?? "").trim() || airportCityLabel(airportCode),
    duration: (partial?.duration ?? "").trim(),
  };
}

type LegacyFlightLeg = Partial<OfferFlightLeg> & {
  stopKind?: "direct" | "stops";
  stopCount?: number;
  connectionAirports?: string;
  connectionDuration?: string;
};

function syncLegEndpoints(leg: {
  segments: OfferFlightSegment[];
  dateLabel: string;
  duration: string;
  connections: OfferFlightConnection[];
}): OfferFlightLeg {
  const first = leg.segments[0];
  const last = leg.segments[leg.segments.length - 1] ?? first;
  return {
    dateLabel: leg.dateLabel,
    duration: leg.duration,
    segments: leg.segments,
    connections: leg.connections,
    fromCode: first?.fromCode ?? "",
    toCode: last?.toCode ?? "",
    departTime: first?.departTime ?? "",
    arriveTime: last?.arriveTime ?? "",
  };
}

/**
 * Normalize a journey leg. Direct = 1 segment; connections use multiple segments.
 * Migrates legacy flat stop fields into segments when needed.
 */
export function emptyFlightLeg(partial?: LegacyFlightLeg): OfferFlightLeg {
  const dateLabel = (partial?.dateLabel ?? "").trim();
  const duration = (partial?.duration ?? "").trim();

  if (Array.isArray(partial?.segments) && partial!.segments!.length > 0) {
    const segments = partial!.segments!.map((s) => emptyFlightSegment(s));
    const connections = Array.isArray(partial?.connections)
      ? partial!.connections!.map((c) => emptyFlightConnection(c))
      : [];
    // Ensure connection count matches segment gaps
    while (connections.length < segments.length - 1) {
      const hub = segments[connections.length]?.toCode ?? "";
      connections.push(
        emptyFlightConnection({ airportCode: hub, cityLabel: airportCityLabel(hub) }),
      );
    }
    return syncLegEndpoints({
      dateLabel,
      duration,
      segments,
      connections: connections.slice(0, Math.max(0, segments.length - 1)),
    });
  }

  const fromCode = (partial?.fromCode ?? "").trim().toUpperCase();
  const toCode = (partial?.toCode ?? "").trim().toUpperCase();
  const departTime = (partial?.departTime ?? "").trim();
  const arriveTime = (partial?.arriveTime ?? "").trim();

  const legacyStops =
    partial?.stopKind === "stops" ||
    (Number(partial?.stopCount) || 0) > 0 ||
    Boolean((partial?.connectionAirports ?? "").trim());

  if (!legacyStops) {
    return syncLegEndpoints({
      dateLabel,
      duration,
      segments: [
        emptyFlightSegment({ fromCode, toCode, departTime, arriveTime }),
      ],
      connections: [],
    });
  }

  // Legacy: one connection airport (+ optional duration) → two segments
  const hubs = (partial?.connectionAirports ?? "")
    .split(/[,/;]+/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
  const hub = hubs[0] || "IST";
  const connectionDuration = (partial?.connectionDuration ?? "").trim();

  const segments: OfferFlightSegment[] = [
    emptyFlightSegment({
      fromCode,
      toCode: hub,
      departTime,
      arriveTime: "",
    }),
    emptyFlightSegment({
      fromCode: hub,
      toCode,
      departTime: "",
      arriveTime,
    }),
  ];
  const connections: OfferFlightConnection[] = [
    emptyFlightConnection({
      airportCode: hub,
      cityLabel: airportCityLabel(hub),
      duration: connectionDuration,
    }),
  ];

  // Extra hubs → additional middle segments (times blank for admin to fill)
  for (let i = 1; i < hubs.length; i++) {
    const nextHub = hubs[i]!;
    const prev = segments[segments.length - 1]!;
    prev.toCode = nextHub;
    segments.push(
      emptyFlightSegment({
        fromCode: nextHub,
        toCode,
        departTime: "",
        arriveTime: i === hubs.length - 1 ? arriveTime : "",
      }),
    );
    connections.push(
      emptyFlightConnection({
        airportCode: nextHub,
        cityLabel: airportCityLabel(nextHub),
      }),
    );
  }

  return syncLegEndpoints({ dateLabel, duration, segments, connections });
}

/** Append a connection + next segment (admin “Add connection”). */
export function addFlightConnection(
  leg: OfferFlightLeg,
  hubCode = "IST",
): OfferFlightLeg {
  const hub = hubCode.trim().toUpperCase() || "IST";
  const last = leg.segments[leg.segments.length - 1] ?? emptyFlightSegment();
  const finalDest = last.toCode;
  const finalArrive = last.arriveTime;
  const updatedLast = emptyFlightSegment({
    ...last,
    toCode: hub,
    arriveTime: last.arriveTime && leg.segments.length === 1 ? "" : last.arriveTime,
  });
  if (leg.segments.length === 1) {
    updatedLast.arriveTime = "";
  }
  const segments = [
    ...leg.segments.slice(0, -1),
    updatedLast,
    emptyFlightSegment({
      fromCode: hub,
      toCode: finalDest,
      departTime: "",
      arriveTime: finalArrive,
    }),
  ];
  const connections = [
    ...leg.connections,
    emptyFlightConnection({
      airportCode: hub,
      cityLabel: airportCityLabel(hub),
      duration: "",
    }),
  ];
  return syncLegEndpoints({
    dateLabel: leg.dateLabel,
    duration: leg.duration,
    segments,
    connections,
  });
}

/** Remove last connection (revert toward direct). */
export function removeLastFlightConnection(leg: OfferFlightLeg): OfferFlightLeg {
  if (leg.segments.length <= 1) return emptyFlightLeg(leg);
  const first = leg.segments[0]!;
  const last = leg.segments[leg.segments.length - 1]!;
  if (leg.segments.length === 2) {
    return syncLegEndpoints({
      dateLabel: leg.dateLabel,
      duration: leg.duration,
      segments: [
        emptyFlightSegment({
          fromCode: first.fromCode,
          toCode: last.toCode,
          departTime: first.departTime,
          arriveTime: last.arriveTime,
        }),
      ],
      connections: [],
    });
  }
  const segments = leg.segments.slice(0, -1);
  const prev = segments[segments.length - 1]!;
  segments[segments.length - 1] = emptyFlightSegment({
    ...prev,
    toCode: last.toCode,
    arriveTime: last.arriveTime,
  });
  return syncLegEndpoints({
    dateLabel: leg.dateLabel,
    duration: leg.duration,
    segments,
    connections: leg.connections.slice(0, -1),
  });
}

export function normalizeOfferFlightOption(
  value: Partial<OfferFlightOption> & {
    baggage?: string;
    outbound?: LegacyFlightLeg;
    inbound?: LegacyFlightLeg;
  },
): OfferFlightOption {
  const checkedText =
    (value.checkedBaggage ?? "").trim() ||
    (value.baggage ?? "").trim() ||
    "2 × 23 kg Freigepäck";
  const handText = (value.handBaggage ?? "").trim();
  const checkedBaggageSpec =
    value.checkedBaggageSpec ??
    parseBaggageSpecFromLabel(checkedText, "checked") ?? {
      kind: "checked" as const,
      pieces: 2,
      kg: 23,
    };
  const handBaggageSpec =
    value.handBaggageSpec ??
    (handText
      ? parseBaggageSpecFromLabel(handText, "hand")
      : { kind: "hand" as const, pieces: 1, kg: 7 });

  return {
    id: value.id?.trim() || newOfferEntityId("fl"),
    airlineId: (value.airlineId ?? "") as OfferFlightOption["airlineId"],
    airlineName: (value.airlineName ?? "").trim(),
    logo: (value.logo ?? "").trim(),
    outbound: emptyFlightLeg(value.outbound),
    inbound: emptyFlightLeg(value.inbound),
    checkedBaggageSpec,
    handBaggageSpec,
    // German Admin cache derived from structured specs (legacy string fields)
    checkedBaggage: checkedText,
    handBaggage: handText || (handBaggageSpec ? "7 kg Handgepäck" : ""),
    totalDuration: (value.totalDuration ?? "").trim(),
    pricePerPerson: Math.max(0, Number(value.pricePerPerson) || 0),
  };
}

/** New flight option for an offer — price starts at 0; Admin enters the current fare manually. */
export function emptyFlightOption(options?: {
  inquiry?: IndividualUmrahInquiry | null;
  airlineId?: string;
}): OfferFlightOption {
  const inquiry = options?.inquiry;
  const airlineId = options?.airlineId ?? "";
  const catalog = airlineId ? getAirlineById(airlineId) : null;
  const airlineName = catalog?.name || resolveAirlineName(airlineId);
  const logo = catalog?.logo || resolveAirlineLogo(airlineId);

  const fromCode = inquiry?.airports?.[0] ?? "VIE";
  const toCode =
    inquiry?.route === "makkah_only" || inquiry?.city_order === "makkah_first"
      ? "JED"
      : "MED";

  let outboundDate = "";
  let inboundDate = "";
  if (inquiry) {
    const stays = inquiryCityStayRanges(inquiry);
    const start = inquiry.travel_date.requested_start_date;
    outboundDate = formatFlightDateLabelDe(start);
    const lastCheckOut =
      stays.makkah?.checkOut ?? stays.medina?.checkOut ?? start;
    inboundDate = formatFlightDateLabelDe(lastCheckOut);
  }

  return normalizeOfferFlightOption({
    airlineId: airlineId || "",
    airlineName,
    logo,
    outbound: emptyFlightLeg({
      dateLabel: outboundDate,
      fromCode,
      toCode,
      segments: [emptyFlightSegment({ fromCode, toCode })],
      connections: [],
    }),
    inbound: emptyFlightLeg({
      dateLabel: inboundDate,
      fromCode: toCode,
      toCode: fromCode,
      segments: [emptyFlightSegment({ fromCode: toCode, toCode: fromCode })],
      connections: [],
    }),
    checkedBaggage: "2 × 23 kg Freigepäck",
    handBaggage: "7 kg Handgepäck",
    totalDuration: "",
    pricePerPerson: 0,
  });
}

function formatFlightDateLabelDe(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [, y, m, d] = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/) ?? [];
  if (!y || !m || !d) return "";
  return `${d}.${m}.${y}`;
}

export function emptyHotelOption(
  hotelId: string,
  roomCount: number,
  options?: {
    nights?: number;
    stayStartDate?: string | null;
    categoryId?: string | null;
    /** When provided, extra beds for children with `requires_bed` are baked into room totals. */
    inquiry?: Pick<
      IndividualUmrahInquiry,
      "travellers" | "children" | "rooms"
    > | null;
  },
): OfferHotelOption {
  const rate = getIndividualUmrahHotelRate(hotelId);
  const category = getRoomCategory(rate, options?.categoryId);
  const nights = Math.max(1, options?.nights ?? 1);
  const stayResult = resolveRoomStayResult(rate, {
    stayStartDate: options?.stayStartDate,
    nights,
    categoryId: category?.id,
  });
  const baseStay = stayResult.complete && stayResult.total != null ? stayResult.total : 0;

  const inquiry = options?.inquiry;
  const roomCountSafe = Math.max(1, roomCount);

  const stay =
    inquiry && stayResult.complete
      ? calculateInquiryHotelStay({
          roomCount: roomCountSafe,
          adults: inquiry.travellers.adult_count,
          children: inquiry.travellers.child_count,
          infants: inquiry.travellers.infant_count,
          childRequiresBed: (inquiry.children ?? []).map((c) => c.requires_bed),
          baseRoomStayTotal: baseStay,
          extraBedPerNight: rate?.extraBedPerNight ?? 0,
          nights,
        })
      : null;

  const prices = stay
    ? stay.roomPrices
    : Array.from({ length: roomCountSafe }, () => (stayResult.complete ? baseStay : 0));

  const labels = stay
    ? stay.roomOccupancyLabels
    : Array.from({ length: roomCountSafe }, () => "—");

  const meals = resolveMealPricingForStay(rate, {
    stayStartDate: options?.stayStartDate,
    categoryId: category?.id,
  });
  const mealPlan: OfferMealPlanCode =
    resolveMealPlanCodeFromLabel(rate?.boardLabel, meals.breakfastMode) ??
    (meals.breakfastMode === "optional" ? "breakfast_optional" : "breakfast");
  const boardLabel = labelOfferMealPlan(mealPlan, "de");
  const roomCategoryName = category?.name ?? "Standard Room";

  return {
    id: newOfferEntityId("ht"),
    hotelId,
    roomCategoryId: category?.id ?? "",
    roomCategoryName,
    roomType: resolveRoomTypeCodeFromName(roomCategoryName),
    calculatedRoomPrices: [...prices],
    roomPrices: [...prices],
    roomOccupancyLabels: labels,
    manualPriceOverride: false,
    breakfastMode: meals.breakfastMode,
    breakfastPerPersonNight: meals.breakfastPerPersonNight,
    lunchPerPersonNight: meals.lunchPerPersonNight,
    dinnerPerPersonNight: meals.dinnerPerPersonNight,
    mealPlan,
    boardLabel,
  };
}

/** Normalize hotel option — backfill structured codes for older offers. */
export function normalizeOfferHotelOption(
  value: Partial<OfferHotelOption> & { hotelId: string },
): OfferHotelOption {
  const roomPrices = Array.isArray(value.roomPrices)
    ? value.roomPrices.map((p) => Math.max(0, Number(p) || 0))
    : [];
  const calculated =
    Array.isArray(value.calculatedRoomPrices) && value.calculatedRoomPrices.length > 0
      ? value.calculatedRoomPrices.map((p) => Math.max(0, Number(p) || 0))
      : [...roomPrices];
  const labels = Array.isArray(value.roomOccupancyLabels)
    ? value.roomOccupancyLabels.map((l) => String(l || "—"))
    : roomPrices.map(() => "—");

  const breakfastMode =
    value.breakfastMode === "optional" ||
    value.breakfastMode === "priced" ||
    value.breakfastMode === "included"
      ? value.breakfastMode
      : "included";

  const mealPlan =
    value.mealPlan ??
    resolveMealPlanCodeFromLabel(value.boardLabel, breakfastMode) ??
    (breakfastMode === "optional" ? "breakfast_optional" : "breakfast");

  const roomCategoryName = value.roomCategoryName?.trim() || "Standard Room";
  const roomType =
    value.roomType ?? resolveRoomTypeCodeFromName(roomCategoryName);

  return {
    id: value.id?.trim() || newOfferEntityId("ht"),
    hotelId: value.hotelId,
    roomCategoryId: value.roomCategoryId ?? "",
    roomCategoryName,
    roomType,
    calculatedRoomPrices: calculated,
    roomPrices,
    roomOccupancyLabels: labels,
    manualPriceOverride: Boolean(value.manualPriceOverride),
    breakfastMode,
    breakfastPerPersonNight: Math.max(0, Number(value.breakfastPerPersonNight) || 0),
    lunchPerPersonNight: Math.max(0, Number(value.lunchPerPersonNight) || 0),
    dinnerPerPersonNight: Math.max(0, Number(value.dinnerPerPersonNight) || 0),
    mealPlan,
    boardLabel: value.boardLabel?.trim() || labelOfferMealPlan(mealPlan, "de"),
  };
}

function defaultAddons(inquiry: IndividualUmrahInquiry): OfferAddonOption[] {
  const interested = new Set(inquiry.offer_prefs?.addons ?? []);
  const includeMedina = inquiry.route === "makkah_medina";
  const template = getOfferPdfTemplate(resolveCustomerLanguage(inquiry));
  const copy = template.addons;

  const ids = (
    includeMedina
      ? (["city_transfer", "religious_medina", "visa"] as const)
      : (["visa"] as const)
  );

  return ids.map((id) =>
    normalizeOfferAddon({
      id,
      pdfDisplay: interested.size
        ? interested.has(id)
          ? "selected"
          : "optional"
        : "selected",
      price: DEFAULT_ADDON_PRICES[id] ?? 0,
      pricingType: "per_person",
      title: (copy[id] ?? DEFAULT_ADDON_COPY[id])!.title,
      body: (copy[id] ?? DEFAULT_ADDON_COPY[id])!.body,
    }),
  );
}

export function normalizeOfferAddon(
  value: Partial<OfferAddonOption> & { pricePerPerson?: number; enabled?: boolean },
): OfferAddonOption {
  const pricingType: OfferAddonPricingType = OFFER_ADDON_PRICING_TYPES.includes(
    value.pricingType as OfferAddonPricingType,
  )
    ? (value.pricingType as OfferAddonPricingType)
    : "per_person";
  const price =
    Number(value.price) ||
    Number(value.pricePerPerson) ||
    0;

  let pdfDisplay: OfferAddonPdfDisplay = "selected";
  if (OFFER_ADDON_PDF_DISPLAYS.includes(value.pdfDisplay as OfferAddonPdfDisplay)) {
    pdfDisplay = value.pdfDisplay as OfferAddonPdfDisplay;
  } else if (value.enabled === false) {
    pdfDisplay = "hidden";
  } else if (value.enabled === true) {
    pdfDisplay = "selected";
  }

  return {
    id: (value.id ?? newOfferEntityId("addon")).trim() || newOfferEntityId("addon"),
    enabled: pdfDisplay === "selected",
    pdfDisplay,
    price: Math.max(0, price),
    pricingType,
    title: (value.title ?? "").trim() || "Zusätzliche Leistung",
    body: (value.body ?? "").trim(),
  };
}

/** Blank custom add-on for future / ad-hoc services (no catalog change needed). */
export function emptyCustomAddon(partial?: Partial<OfferAddonOption>): OfferAddonOption {
  return normalizeOfferAddon({
    id: newOfferEntityId("addon"),
    pdfDisplay: "selected",
    price: 0,
    pricingType: "per_person",
    title: "",
    body: "",
    ...partial,
  });
}

/** Add-ons that appear on the customer PDF (selected or optional). */
export function addonsVisibleOnPdf(addons: OfferAddonOption[]): OfferAddonOption[] {
  return addons
    .map((a) => normalizeOfferAddon(a))
    .filter((a) => a.pdfDisplay === "selected" || a.pdfDisplay === "optional");
}

/** Default PDF “Im Preis enthalten” template (German — Admin reset). */
export const DEFAULT_OFFER_INCLUDED_ITEMS = DEFAULT_OFFER_TERMS_BY_LOCALE.de.included;

/** Default PDF “Nicht inkludiert” template (German — Admin reset). */
export const DEFAULT_OFFER_EXCLUDED_ITEMS = DEFAULT_OFFER_TERMS_BY_LOCALE.de.excluded;

/** Default PDF “Wichtige Hinweise” template (German — Admin reset). */
export const DEFAULT_OFFER_IMPORTANT_NOTES = DEFAULT_OFFER_TERMS_BY_LOCALE.de.notes;

function normalizeStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return [...fallback];
  const cleaned = value.map((item) => String(item ?? "").trim()).filter(Boolean);
  return cleaned.length ? cleaned : [...fallback];
}

export function normalizeOfferTerms(offer: Partial<IndividualUmrahOffer>): {
  includedTermIds: OfferIncludedTermCode[];
  excludedTermIds: OfferExcludedTermCode[];
  noteTermIds: OfferNoteTermCode[];
  includedItems: string[];
  excludedItems: string[];
  importantNotes: string[];
} {
  const includedItems = normalizeStringList(
    offer.includedItems,
    DEFAULT_OFFER_INCLUDED_ITEMS,
  );
  const excludedItems = normalizeStringList(
    offer.excludedItems,
    DEFAULT_OFFER_EXCLUDED_ITEMS,
  );
  const importantNotes = normalizeStringList(
    offer.importantNotes,
    DEFAULT_OFFER_IMPORTANT_NOTES,
  );

  const includedTermIds =
    Array.isArray(offer.includedTermIds) && offer.includedTermIds.length > 0
      ? (offer.includedTermIds.filter(Boolean) as OfferIncludedTermCode[])
      : includedItems
          .map((t) => resolveIncludedTermCode(t))
          .filter((c): c is OfferIncludedTermCode => Boolean(c));

  const excludedTermIds =
    Array.isArray(offer.excludedTermIds) && offer.excludedTermIds.length > 0
      ? (offer.excludedTermIds.filter(Boolean) as OfferExcludedTermCode[])
      : excludedItems
          .map((t) => resolveExcludedTermCode(t))
          .filter((c): c is OfferExcludedTermCode => Boolean(c));

  const noteTermIds =
    Array.isArray(offer.noteTermIds) && offer.noteTermIds.length > 0
      ? (offer.noteTermIds.filter(Boolean) as OfferNoteTermCode[])
      : importantNotes
          .map((t) => resolveNoteTermCode(t))
          .filter((c): c is OfferNoteTermCode => Boolean(c));

  // If nothing resolved from free-text, seed stock codes
  return {
    includedTermIds:
      includedTermIds.length > 0 ? includedTermIds : [...DEFAULT_INCLUDED_TERM_CODES],
    excludedTermIds:
      excludedTermIds.length > 0 ? excludedTermIds : [...DEFAULT_EXCLUDED_TERM_CODES],
    noteTermIds: noteTermIds.length > 0 ? noteTermIds : [...DEFAULT_NOTE_TERM_CODES],
    includedItems,
    excludedItems,
    importantNotes,
  };
}

export function createEmptyOfferFromInquiry(inquiry: IndividualUmrahInquiry): IndividualUmrahOffer {
  const name = `${inquiry.contact.first_name} ${inquiry.contact.last_name}`.trim();
  const template = getOfferPdfTemplate(resolveCustomerLanguage(inquiry));
  const terms = template.terms;
  return {
    offerId: newOfferEntityId("offer"),
    offerNumber: generateOfferNumber(),
    inquiryId: inquiry.inquiry_id,
    createdAt: new Date().toISOString(),
    status: "draft",
    greetingName: name || "Kunde",
    pdfLanguageOverride: null,
    flights: [],
    medinaHotels: [],
    makkahHotels: [],
    extraCityHotels: [],
    recommendedCombinations: [],
    addons: defaultAddons(inquiry),
    includedTermIds: [...DEFAULT_INCLUDED_TERM_CODES],
    excludedTermIds: [...DEFAULT_EXCLUDED_TERM_CODES],
    noteTermIds: [...DEFAULT_NOTE_TERM_CODES],
    includedItems: [...terms.included],
    excludedItems: [...terms.excluded],
    importantNotes: [...terms.notes],
    pdfVersion: 0,
    pdfGeneratedAt: null,
    pdfContentFingerprint: null,
  };
}

export type OfferPdfReadinessItem = {
  id: "flights" | "medinaHotels" | "makkahHotels" | "addons" | "hotelRates";
  label: string;
  ready: boolean;
  required: boolean;
};

function hotelOptionsHaveCompleteRates(
  options: OfferHotelOption[],
  stayStartDate: string | null,
  nights: number,
): boolean {
  if (options.length === 0) return true;
  return options.every(
    (option) =>
      getOfferHotelMissingRateDates(option, stayStartDate, nights).length === 0,
  );
}

/** Checklist before “PDF Angebot erstellen”. */
export function getOfferPdfReadiness(
  inquiry: IndividualUmrahInquiry,
  offer: IndividualUmrahOffer,
): { ready: boolean; items: OfferPdfReadinessItem[] } {
  const needsMedina = inquiry.route === "makkah_medina";
  const starts = inquiryCityStayStarts(inquiry);
  const medinaRatesOk = hotelOptionsHaveCompleteRates(
    offer.medinaHotels,
    starts.medina,
    inquiry.nights.medina_nights,
  );
  const makkahRatesOk = hotelOptionsHaveCompleteRates(
    offer.makkahHotels,
    starts.makkah,
    inquiry.nights.makkah_nights,
  );
  const hotelRatesOk =
    (!needsMedina || medinaRatesOk) && makkahRatesOk;

  const items: OfferPdfReadinessItem[] = [
    {
      id: "flights",
      label: "Flugangebote",
      ready: offer.flights.length > 0,
      required: true,
    },
    {
      id: "medinaHotels",
      label: "Unterkunft Medina",
      ready: offer.medinaHotels.length > 0,
      required: needsMedina,
    },
    {
      id: "makkahHotels",
      label: "Unterkunft Makkah",
      ready: offer.makkahHotels.length > 0,
      required: true,
    },
    {
      id: "hotelRates",
      label: "Hotelpreise vollständig (oder manuell überschrieben)",
      ready: hotelRatesOk,
      required: true,
    },
    {
      id: "addons",
      label: "Zusätzliche Leistungen",
      // Add-ons are optional services; section is ready once configured (incl. all off).
      ready: Array.isArray(offer.addons),
      required: true,
    },
  ];
  const ready = items.every((item) => !item.required || item.ready);
  return { ready, items: items.filter((item) => item.required) };
}
