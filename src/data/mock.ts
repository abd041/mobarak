export type Locale = "de" | "ar" | "bs" | "en";

export type AvailabilityStatus = "available" | "waitlist" | "soldout" | "waitlist_full";

export type TripImage = {
  src: string;
  caption: string;
};

export type Hotel = {
  id: string;
  name: string;
  city: "medina" | "makkah";
  stars: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  walkingMinutes: number;
  mosque: "nabawi" | "haram";
  breakfast: boolean;
  amenities: string[];
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

export type UmrahTrip = {
  id: string;
  slug: string;
  title: string;
  startDate: string;
  endDate: string;
  dateLabel: string;
  nights: number;
  availableSeats: number;
  waitlistEnabled: boolean;
  waitlistFull: boolean;
  status: AvailabilityStatus;
  groupSize: number;
  departureAirport: string;
  airline: string;
  prices: { quad: number; triple: number; double: number };
  childPrices: { infant: number; withoutBed: number; withBedDiscount: number };
  filterTags: string[];
  images: TripImage[];
  inclusions: string[];
  guideLanguages: string[];
  medinaHotelId: string;
  makkahHotelId: string;
  outbound: FlightLeg;
  inbound: FlightLeg;
  itinerary: ItineraryItem[];
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
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=80",
  medina:
    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1600&q=80",
  hotel:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  lobby:
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
  room:
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
  plane:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  group:
    "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80",
};

export const hotels: Hotel[] = [
  {
    id: "maden",
    name: "Maden Hotel",
    city: "medina",
    stars: 5,
    nights: 3,
    checkIn: "23. Okt. 2026",
    checkOut: "26. Okt. 2026",
    walkingMinutes: 3,
    mosque: "nabawi",
    breakfast: true,
    amenities: ["WLAN", "24h Rezeption", "Klimaanlage", "Restaurant"],
    images: [
      { src: IMG.hotel, caption: "Hotel in Medina" },
      { src: IMG.lobby, caption: "Lobby in Medina" },
      { src: IMG.room, caption: "4-Bettzimmer in Medina" },
    ],
  },
  {
    id: "anjum",
    name: "Anjum Hotel Makkah",
    city: "makkah",
    stars: 5,
    nights: 6,
    checkIn: "26. Okt. 2026",
    checkOut: "31. Okt. 2026",
    walkingMinutes: 5,
    mosque: "haram",
    breakfast: true,
    amenities: ["WLAN", "24h Rezeption", "Klimaanlage", "Restaurant"],
    images: [
      { src: IMG.kaaba, caption: "Hotel in Makkah" },
      { src: IMG.lobby, caption: "Lobby in Makkah" },
      { src: IMG.room, caption: "4-Bettzimmer in Makkah" },
    ],
  },
  {
    id: "anwar",
    name: "Anwar Al Madinah Mövenpick",
    city: "medina",
    stars: 5,
    nights: 4,
    checkIn: "25. Nov. 2026",
    checkOut: "29. Nov. 2026",
    walkingMinutes: 4,
    mosque: "nabawi",
    breakfast: true,
    amenities: ["WLAN", "Restaurant", "Klimaanlage"],
    images: [
      { src: IMG.medina, caption: "Hotel in Medina" },
      { src: IMG.lobby, caption: "Lobby in Medina" },
    ],
  },
];

const baseInclusions = [
  "visa",
  "flight",
  "baggage",
  "guide",
  "religious",
  "transfer",
  "hotels",
  "breakfast",
  "excursions",
];

export const trips: UmrahTrip[] = [
  {
    id: "trip-23-okt-2026",
    slug: "23-oktober-2026",
    title: "Umrah Gruppenreise",
    startDate: "2026-10-23",
    endDate: "2026-10-31",
    dateLabel: "23. Okt. – 31. Okt. 2026",
    nights: 9,
    availableSeats: 5,
    waitlistEnabled: true,
    waitlistFull: false,
    status: "available",
    groupSize: 45,
    departureAirport: "Wien",
    airline: "Egypt Air",
    prices: { quad: 1250, triple: 1350, double: 1450 },
    childPrices: { infant: 450, withoutBed: 950, withBedDiscount: 100 },
    filterTags: ["oktober", "herbstferien"],
    images: [
      { src: IMG.kaaba, caption: "Kaaba" },
      { src: IMG.hotel, caption: "Hotel in Makkah" },
      { src: IMG.medina, caption: "Hotel in Medina" },
      { src: IMG.group, caption: "Unsere Reisegruppe" },
    ],
    inclusions: baseInclusions,
    guideLanguages: ["ar", "de", "bs", "tr"],
    medinaHotelId: "maden",
    makkahHotelId: "anjum",
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
      { day: 1, title: "Ankunft in Medina / Check-in", icon: "plane" },
      { day: 1, time: "Abend", title: "Rawda Besuch", icon: "moon" },
      { day: 2, time: "08:00", title: "Mazarat", icon: "sun" },
      { day: 2, time: "14:30", title: "Vortrag über die Umrah", icon: "book" },
      { day: 3, time: "10:00", title: "Abfahrt nach Makkah", icon: "bus" },
      { day: 3, time: "11:00", title: "Miqat", icon: "pin" },
      { day: 3, time: "ca. 21:30", title: "Gemeinsame Umrah", icon: "kaaba" },
      { day: 4, title: "Freitagsgebet", icon: "mosque" },
      { day: 5, time: "08:00", title: "Ausflug in Makkah", icon: "camera" },
      { day: 6, title: "Freier Tag", icon: "palm" },
      { day: 7, title: "Abfahrt nach Wien", icon: "plane" },
    ],
  },
  {
    id: "trip-25-nov-2026",
    slug: "25-november-2026",
    title: "Umrah Gruppenreise",
    startDate: "2026-11-25",
    endDate: "2026-12-03",
    dateLabel: "25. Nov. – 03. Dez. 2026",
    nights: 8,
    availableSeats: 3,
    waitlistEnabled: true,
    waitlistFull: false,
    status: "available",
    groupSize: 45,
    departureAirport: "Wien",
    airline: "Egypt Air",
    prices: { quad: 1290, triple: 1390, double: 1490 },
    childPrices: { infant: 450, withoutBed: 950, withBedDiscount: 100 },
    filterTags: ["november"],
    images: [
      { src: IMG.medina, caption: "Medina" },
      { src: IMG.kaaba, caption: "Makkah" },
      { src: IMG.lobby, caption: "Lobby in Medina" },
    ],
    inclusions: baseInclusions,
    guideLanguages: ["ar", "de", "bs", "tr"],
    medinaHotelId: "anwar",
    makkahHotelId: "anjum",
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
  },
  {
    id: "trip-28-dez-2026",
    slug: "28-dezember-2026",
    title: "Umrah Gruppenreise",
    startDate: "2026-12-28",
    endDate: "2027-01-06",
    dateLabel: "28. Dez. 2026 – 06. Jan. 2027",
    nights: 9,
    availableSeats: 0,
    waitlistEnabled: true,
    waitlistFull: false,
    status: "soldout",
    groupSize: 45,
    departureAirport: "Wien",
    airline: "Egypt Air",
    prices: { quad: 1390, triple: 1490, double: 1590 },
    childPrices: { infant: 450, withoutBed: 950, withBedDiscount: 100 },
    filterTags: ["dezember", "jaenner", "weihnachtsferien"],
    images: [
      { src: IMG.kaaba, caption: "Kaaba" },
      { src: IMG.group, caption: "Unsere Reisegruppe" },
      { src: IMG.hotel, caption: "Hotel in Makkah" },
    ],
    inclusions: baseInclusions,
    guideLanguages: ["ar", "de", "bs", "tr"],
    medinaHotelId: "maden",
    makkahHotelId: "anjum",
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
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Ahmad K.",
    rating: 5,
    dateRelative: "vor 2 Wochen",
    text: "Alhamdulillah eine sehr gut organisierte Reise. Das Team war immer erreichbar und hat uns während der Reise hervorragend betreut.",
  },
  {
    id: "r2",
    name: "Safija B.",
    rating: 5,
    dateRelative: "vor 1 Monat",
    text: "Von der Vorbereitung bis zur Betreuung vor Ort hat alles perfekt funktioniert. Vielen Dank an das gesamte Mobarak-Team!",
  },
  {
    id: "r3",
    name: "Muhammed H.",
    rating: 5,
    dateRelative: "vor 3 Monaten",
    text: "Die Reiseleiter und religiösen Begleiter sind sehr erfahren und kümmern sich wirklich um jeden Pilger.",
  },
];

export const googleStats = {
  rating: 4.9,
  count: 1248,
};

export function getHotel(id: string) {
  return hotels.find((h) => h.id === id)!;
}

export function getTrip(slug: string) {
  return trips.find((t) => t.slug === slug);
}

export const FILTER_KEYS = [
  "all",
  "oktober",
  "herbstferien",
  "november",
  "dezember",
  "weihnachtsferien",
  "jaenner",
  "februar",
  "semesterferien",
  "ramadan",
  "maerz",
  "osterferien",
] as const;

export const FILTER_LABELS_DE: Record<(typeof FILTER_KEYS)[number], string> = {
  all: "Alle Termine",
  oktober: "Oktober",
  herbstferien: "Herbstferien",
  november: "November",
  dezember: "Dezember",
  weihnachtsferien: "Weihnachtsferien",
  jaenner: "Jänner",
  februar: "Februar",
  semesterferien: "Semesterferien",
  ramadan: "Ramadan",
  maerz: "März",
  osterferien: "Osterferien",
};
