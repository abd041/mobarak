import type { TripInclusionId } from "@/lib/trip-inclusions";
import { DEFAULT_TRIP_INCLUSIONS } from "@/lib/trip-inclusions";
import type { HotelAmenityId } from "@/lib/hotel-amenities";
import type { TripPeriodFilterTag } from "@/lib/listing-period-filters";
import { buildTripCardGallery } from "@/lib/trip-card-images";
import type { TripPriceDisplayMode } from "@/lib/trip-price-display";
import type { TripHotelStay } from "@/lib/trip-hotel-stays";

export type { TripHotelStay };

export type Locale = "de" | "ar" | "bs" | "en" | "tr";

export type AvailabilityStatus = "available" | "waitlist" | "soldout" | "waitlist_full";

export type TripImage = {
  /** Image URL / path */
  src: string;
  /** Optional caption shown under / over the image */
  caption?: string;
  /** Display order in the gallery (ascending) */
  sortOrder: number;
};

/** Shared hotel catalog — name, image, and stars; stay dates live on the trip. */
export type Hotel = {
  id: string;
  name: string;
  city: "medina" | "makkah";
  stars: number;
  /** Walking distance to the holy mosque — configurable per hotel */
  walkingMinutes: number;
  /** Target mosque for the walking-distance line */
  mosque: "nabawi" | "haram";
  breakfast: boolean;
  /** Additional features shown below the gallery — order preserved */
  amenities: HotelAmenityId[];
  /** Optional long-form copy for the hotel details modal */
  description?: string;
  images: TripImage[];
};

export type FlightLeg = {
  dateLabel: string;
  fromCode: string;
  toCode: string;
  fromCity: string;
  toCity: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  direct: boolean;
};

export type ItineraryItem = {
  day: number;
  time?: string;
  title: string;
  icon: string;
};

export type TripFaq = {
  question: string;
  answer: string;
};

/** Expandable detail copy — empty strings fall back to i18n defaults on the page */
export type TripDetailNotes = {
  luggage?: string;
  transfers?: string;
  visa?: string;
  tourGuide?: string;
  religiousGuide?: string;
  excursions?: string;
};

export type UmrahTrip = {
  /** Stable trip / departure ID — unique per group departure. */
  id: string;
  /** Manual listing order — lower values appear first (admin-controlled). */
  displayOrder: number;
  slug: string;
  title: string;
  startDate: string;
  endDate: string;
  dateLabel: string;
  nights: number;
  /** Total bookable capacity for this departure. */
  totalCapacity: number;
  /** Remaining bookable places. */
  availableSeats: number;
  waitlistEnabled: boolean;
  /** Max waitlist places when waitlist is enabled. */
  waitlistCapacity: number;
  /** true = waitlist full; false = waitlist still available. */
  waitlistFull: boolean;
  status: AvailabilityStatus;
  groupSize: number;
  departureAirport: string;
  airline: string;
  /** Airline logo — configurable per departure */
  airlineLogo?: string;
  /** Baggage allowance line — configurable per departure */
  baggageAllowance: string;
  /** Adult occupancy prices — Vierbett / Dreibett / Zweibett (listing cards). */
  prices: { quad: number; triple: number; double: number };
  /**
   * Price wording on cards and detail pages.
   * fixed — exact departure price (default), from — minimum price prefix e.g. "ab".
   */
  priceDisplayMode?: TripPriceDisplayMode;
  /** Infant & child prices — offer page and inquiry checkout only. */
  childPrices: { infant: number; withoutBed: number; withBedDiscount: number };
  filterTags: TripPeriodFilterTag[];
  images: TripImage[];
  /** Per-package included services (order = display order on trip cards) */
  inclusions: TripInclusionId[];
  guideLanguages: string[];
  medinaHotelId: string;
  makkahHotelId: string;
  /** Per-departure Medina stay — check-in / check-out drive offer card dates. */
  medinaStay: TripHotelStay;
  /** Per-departure Makkah stay — check-in / check-out drive offer card dates. */
  makkahStay: TripHotelStay;
  outbound: FlightLeg;
  inbound: FlightLeg;
  itinerary: ItineraryItem[];
  /** Per-departure FAQs — structure ready for CMS */
  faqs: TripFaq[];
  /** Optional long-form notes for detail page sections */
  detailNotes?: TripDetailNotes;
  /**
   * When true (default), this departure is indexable in search / sitemap.
   * Set false to keep a draft or private departure out of SEO.
   */
  seoIndexable?: boolean;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  dateRelative: string;
  text: string;
  avatar?: string;
  translated?: boolean;
};

export const IMG = {
  kaaba:
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=75",
  medina:
    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=75",
  hotel:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=75",
  lobby:
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=75",
  room:
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=75",
  roomDouble:
    "https://images.unsplash.com/photo-1611892440504-42a784e83da7?auto=format&fit=crop&w=900&q=75",
  restaurant:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=75",
  bathroom:
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=75",
  breakfast:
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=75",
  plane:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=75",
  group:
    "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=900&q=75",
};

/** Representative hotel gallery — exterior, lobby, rooms, restaurant, etc. */
function buildHotelGallery(city: "medina" | "makkah", total: number): TripImage[] {
  const cityLabel = city === "medina" ? "Medina" : "Makkah";
  const pool: TripImage[] = [
    { src: IMG.hotel, caption: `Außenansicht – ${cityLabel}`, sortOrder: 0 },
    { src: IMG.lobby, caption: "Lobby", sortOrder: 1 },
    { src: IMG.roomDouble, caption: "Doppelzimmer", sortOrder: 2 },
    { src: IMG.room, caption: "Dreibett- / Vierbettzimmer", sortOrder: 3 },
    { src: IMG.restaurant, caption: "Restaurant", sortOrder: 4 },
    { src: IMG.bathroom, caption: "Badezimmer", sortOrder: 5 },
    { src: IMG.breakfast, caption: "Frühstück", sortOrder: 6 },
    { src: IMG.medina, caption: `Aussicht – ${cityLabel}`, sortOrder: 7 },
    { src: IMG.group, caption: "Aufenthaltsbereich", sortOrder: 8 },
    { src: IMG.kaaba, caption: "Umgebung", sortOrder: 9 },
    { src: IMG.lobby, caption: "Empfang", sortOrder: 10 },
    { src: IMG.roomDouble, caption: "Superior Doppelzimmer", sortOrder: 11 },
    { src: IMG.room, caption: "Familienzimmer", sortOrder: 12 },
    { src: IMG.restaurant, caption: "À-la-carte Restaurant", sortOrder: 13 },
    { src: IMG.breakfast, caption: "Frühstücksbuffet", sortOrder: 14 },
    { src: IMG.bathroom, caption: "Bad mit Dusche", sortOrder: 15 },
    { src: IMG.hotel, caption: "Eingangsbereich", sortOrder: 16 },
    { src: IMG.lobby, caption: "Lounge", sortOrder: 17 },
    { src: IMG.room, caption: "Vierbettzimmer", sortOrder: 18 },
  ];

  return pool.slice(0, total).map((img, index) => ({ ...img, sortOrder: index }));
}

export const hotels: Hotel[] = [
  {
    id: "maden",
    name: "Maden Hotel",
    city: "medina",
    stars: 5,
    walkingMinutes: 3,
    mosque: "nabawi",
    breakfast: true,
    description:
      "Das Maden Hotel liegt nur wenige Gehminuten von der Al-Masjid an-Nabawi entfernt und bietet komfortable Zimmer mit Frühstück für Ihren Medina-Aufenthalt.",
    amenities: ["wifi", "reception", "ac", "restaurant", "stars"],
    images: buildHotelGallery("medina", 16),
  },
  {
    id: "anjum",
    name: "Anjum Hotel Makkah",
    city: "makkah",
    stars: 5,
    walkingMinutes: 5,
    mosque: "haram",
    breakfast: true,
    description:
      "Das Anjum Hotel Makkah befindet sich in unmittelbarer Nähe zur Al-Masjid al-Haram und verbindet erstklassigen Komfort mit kurzen Wegen zu den heiligen Stätten.",
    amenities: ["wifi", "reception", "ac"],
    images: buildHotelGallery("makkah", 19),
  },
  {
    id: "anwar",
    name: "Anwar Al Madinah Mövenpick",
    city: "medina",
    stars: 5,
    walkingMinutes: 4,
    mosque: "nabawi",
    breakfast: true,
    amenities: ["wifi", "ac", "restaurant"],
    images: buildHotelGallery("medina", 15),
  },
];

const baseInclusions = DEFAULT_TRIP_INCLUSIONS;

const baseFaqs: TripFaq[] = [
  {
    question: "Was ist in diesem Preis enthalten?",
    answer:
      "Visum, Hin- und Rückflug, Transfers, Hotels inkl. Frühstück, Gepäck (2 × 23 kg), Reiseführer und Ausflüge in Makkah & Medina — je nach Paketkonfiguration.",
  },
  {
    question: "Wie sichere ich mir einen Platz?",
    answer:
      "Über die Schaltfläche „Jetzt anfragen“ senden Sie uns Ihre unverbindliche Anfrage. Wir bestätigen Verfügbarkeit und nächste Schritte persönlich.",
  },
  {
    question: "Kann ich Zimmerkategorien später ändern?",
    answer:
      "Ja, solange Plätze frei sind. Vierbett-, Dreibett- und Zweibettzimmer lassen sich in der Anfrage oder nach Rücksprache anpassen.",
  },
];

const baseDetailNotes: TripDetailNotes = {
  luggage: "2 × 23 kg Freigepäck pro Person inklusive. Handgepäck gemäß Airline-Regeln.",
  transfers:
    "Flughafen ↔ Hotel und Medina ↔ Makkah mit klimatisierten Gruppenbussen, inklusive.",
  visa: "Umrah-Visum inklusive — wir übernehmen die Beantragung und betreuen den Prozess.",
  tourGuide:
    "Erfahrene Reiseführer begleiten die Gruppe rund um die Uhr in den vereinbarten Sprachen.",
  religiousGuide:
    "Religiöse Begleitung und Unterstützung bei Ritualen vor Ort (sofern im Paket enthalten).",
  excursions: "Geführte Ausflüge zu den wichtigsten Orten in Makkah und Medina inklusive.",
};

export const trips: UmrahTrip[] = [
  {
    id: "trip-23-okt-2026",
    displayOrder: 10,
    slug: "23-oktober-2026",
    title: "Umrah Gruppenreise",
    startDate: "2026-10-23",
    endDate: "2026-10-31",
    dateLabel: "23.–31. Oktober 2026",
    nights: 9,
    totalCapacity: 45,
    availableSeats: 5,
    waitlistEnabled: true,
    waitlistCapacity: 20,
    waitlistFull: false,
    status: "available",
    groupSize: 45,
    departureAirport: "Wien",
    airline: "Egypt Air",
    airlineLogo: "/brand/meta-icons/egyptair-logo-wide.png",
    baggageAllowance: "2 × 23 kg inklusive",
    prices: { quad: 1250, triple: 1350, double: 1450 },
    childPrices: { infant: 450, withoutBed: 950, withBedDiscount: 100 },
    filterTags: ["oktober", "herbstferien"],
    images: buildTripCardGallery(
      "kaaba",
      "makkahHotel",
      "medinaHotel",
      "lobbyMakkah",
      "lobbyMedina",
      "groupExcursion",
      "mobarakGroup01",
      "mobarakGroup02",
    ),
    inclusions: baseInclusions,
    guideLanguages: ["ar", "de", "bs", "tr"],
    medinaHotelId: "maden",
    makkahHotelId: "anjum",
    medinaStay: {
      nights: 3,
      checkIn: "2026-10-23",
      checkOut: "2026-10-26",
      dateLabel: "23. Okt. – 26. Okt. 2026",
    },
    makkahStay: {
      nights: 6,
      checkIn: "2026-10-26",
      checkOut: "2026-10-31",
      dateLabel: "26. Okt. – 31. Okt. 2026",
    },
    outbound: {
      dateLabel: "Do, 23. Oktober 2026",
      fromCode: "VIE",
      toCode: "MED",
      fromCity: "Wien",
      toCity: "Medina",
      departTime: "14:10",
      arriveTime: "19:40",
      duration: "4h 30m",
      direct: true,
    },
    inbound: {
      dateLabel: "Fr, 31. Oktober 2026",
      fromCode: "JED",
      toCode: "VIE",
      fromCity: "Jeddah",
      toCity: "Wien",
      departTime: "15:30",
      arriveTime: "20:40",
      duration: "5h 10m",
      direct: true,
    },
    itinerary: [
      { day: 1, title: "Ankunft in Medina\nCheck-in im Hotel", icon: "mosque" },
      { day: 2, time: "Am Abend", title: "Rawda Besuch", icon: "moon" },
      { day: 3, time: "08:00", title: "Manoon", icon: "sun" },
      { day: 4, time: "14:30", title: "Vortrag über\ndie Umrah", icon: "book" },
      { day: 5, time: "10:00", title: "Abfahrt nach\nMakkah", icon: "bus" },
      { day: 6, time: "10:00", title: "Mina", icon: "pin" },
      { day: 7, time: "16:00", title: "Pamon,\nBesuchdon", icon: "mountain" },
      { day: 8, title: "Abfahrt nach Wien", icon: "plane" },
      { day: 9, title: "Freizeit", icon: "palm" },
      { day: 10, time: "08:00", title: "(Ausflug & Einkauf)", icon: "camera" },
      { day: 11, title: "Freizeitprogramm", icon: "mosque" },
      { day: 12, time: "ca. 12:30", title: "Gemeinsames Umrah\nmit der Gruppe", icon: "kaaba" },
      { day: 13, time: "ca. 10:00", title: "Abfahrt zu Jabal\nal Rahmah", icon: "hotel" },
    ],
    faqs: baseFaqs,
    detailNotes: baseDetailNotes,
    seoIndexable: true,
  },
  {
    id: "trip-25-nov-2026",
    displayOrder: 20,
    slug: "25-november-2026",
    title: "Umrah Gruppenreise",
    startDate: "2026-11-25",
    endDate: "2026-12-03",
    dateLabel: "25. Nov. – 03. Dez. 2026",
    nights: 8,
    totalCapacity: 45,
    availableSeats: 3,
    waitlistEnabled: true,
    waitlistCapacity: 15,
    waitlistFull: false,
    status: "available",
    groupSize: 45,
    departureAirport: "Wien",
    airline: "Egypt Air",
    airlineLogo: "/brand/meta-icons/egyptair-logo-wide.png",
    baggageAllowance: "2 × 23 kg inklusive",
    prices: { quad: 1290, triple: 1390, double: 1490 },
    childPrices: { infant: 450, withoutBed: 950, withBedDiscount: 100 },
    filterTags: ["november", "dezember"],
    images: buildTripCardGallery(
      "medina",
      "medinaHotel",
      "lobbyMedina",
      "makkahHotel",
      "kaaba",
      "groupExcursion",
      "mobarakGroup03",
    ),
    inclusions: baseInclusions,
    guideLanguages: ["ar", "de", "bs", "tr"],
    medinaHotelId: "anwar",
    makkahHotelId: "anjum",
    medinaStay: {
      nights: 3,
      checkIn: "2026-11-25",
      checkOut: "2026-11-28",
      dateLabel: "25. Nov – 28. Nov 2026",
    },
    makkahStay: {
      nights: 5,
      checkIn: "2026-11-28",
      checkOut: "2026-12-03",
      dateLabel: "28. Nov – 03. Dez 2026",
    },
    outbound: {
      dateLabel: "Mi, 25. November 2026",
      fromCode: "VIE",
      toCode: "MED",
      fromCity: "Wien",
      toCity: "Medina",
      departTime: "13:40",
      arriveTime: "19:10",
      duration: "4h 30m",
      direct: true,
    },
    inbound: {
      dateLabel: "Do, 03. Dezember 2026",
      fromCode: "JED",
      toCode: "VIE",
      fromCity: "Jeddah",
      toCity: "Wien",
      departTime: "16:00",
      arriveTime: "21:10",
      duration: "5h 10m",
      direct: true,
    },
    itinerary: [
      { day: 1, title: "Ankunft in Medina", icon: "plane" },
      { day: 2, title: "Programm Medina", icon: "mosque" },
      { day: 3, title: "Transfer nach Makkah", icon: "bus" },
      { day: 4, title: "Umrah", icon: "kaaba" },
      { day: 5, title: "Ausflug Makkah", icon: "camera" },
      { day: 6, title: "Freier Tag", icon: "palm" },
      { day: 7, title: "Rückreise", icon: "plane" },
    ],
    faqs: baseFaqs,
    detailNotes: baseDetailNotes,
    seoIndexable: true,
  },
  {
    id: "trip-28-dez-2026",
    displayOrder: 30,
    slug: "28-dezember-2026",
    title: "Umrah Gruppenreise",
    startDate: "2026-12-28",
    endDate: "2027-01-06",
    dateLabel: "28. Dez. 2026 – 06. Jan. 2027",
    nights: 9,
    totalCapacity: 45,
    availableSeats: 0,
    waitlistEnabled: true,
    waitlistCapacity: 10,
    waitlistFull: true,
    status: "waitlist_full",
    groupSize: 45,
    departureAirport: "Wien",
    airline: "Egypt Air",
    airlineLogo: "/brand/meta-icons/egyptair-logo-wide.png",
    baggageAllowance: "2 × 23 kg inklusive",
    prices: { quad: 1390, triple: 1490, double: 1590 },
    childPrices: { infant: 450, withoutBed: 950, withBedDiscount: 100 },
    filterTags: ["dezember", "jaenner", "weihnachtsferien"],
    images: buildTripCardGallery(
      "makkahHotel",
      "kaaba",
      "lobbyMakkah",
      "medinaHotel",
      "groupExcursion",
      "mobarakGroup03",
      "mobarakGroup04",
    ),
    inclusions: baseInclusions,
    guideLanguages: ["ar", "de", "bs", "tr"],
    medinaHotelId: "maden",
    makkahHotelId: "anjum",
    medinaStay: {
      nights: 3,
      checkIn: "2026-12-28",
      checkOut: "2026-12-31",
      dateLabel: "28. Dez – 31. Dez 2026",
    },
    makkahStay: {
      nights: 6,
      checkIn: "2026-12-31",
      checkOut: "2027-01-06",
      dateLabel: "31. Dez 2026 – 06. Jan 2027",
    },
    outbound: {
      dateLabel: "Mo, 28. Dezember 2026",
      fromCode: "VIE",
      toCode: "MED",
      fromCity: "Wien",
      toCity: "Medina",
      departTime: "14:10",
      arriveTime: "19:40",
      duration: "4h 30m",
      direct: true,
    },
    inbound: {
      dateLabel: "Di, 06. Januar 2027",
      fromCode: "JED",
      toCode: "VIE",
      fromCity: "Jeddah",
      toCity: "Wien",
      departTime: "15:30",
      arriveTime: "20:40",
      duration: "5h 10m",
      direct: true,
    },
    itinerary: [
      { day: 1, title: "Ankunft Medina", icon: "plane" },
      { day: 3, title: "Transfer Makkah", icon: "bus" },
      { day: 4, title: "Umrah", icon: "kaaba" },
      { day: 9, title: "Rückreise", icon: "plane" },
    ],
    faqs: baseFaqs,
    detailNotes: baseDetailNotes,
    seoIndexable: true,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Anna H.",
    rating: 5,
    dateRelative: "vor 2 Wochen",
    text: "Alhamdulillah eine sehr gut organisierte Reise. Das Team war immer erreichbar und hat uns während der Reise hervorragend betreut.",
  },
  {
    id: "r2",
    name: "Berat K.",
    rating: 5,
    dateRelative: "vor 1 Monat",
    text: "Von der Vorbereitung bis zur Betreuung vor Ort hat alles perfekt funktioniert. Vielen Dank an das gesamte Mobarak-Team!",
  },
  {
    id: "r3",
    name: "Mehmet A.",
    rating: 5,
    dateRelative: "vor 3 Monaten",
    text: "Die Reiseleiter und religiösen Begleiter sind sehr erfahren und kümmern sich wirklich um jeden Pilger.",
  },
];

export const googleStats = {
  rating: 4.9,
  count: 262,
};

export function getHotel(id: string) {
  return hotels.find((h) => h.id === id)!;
}

export function getTrip(slug: string) {
  return trips.find((t) => t.slug === slug);
}

