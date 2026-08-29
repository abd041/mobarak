export type ItineraryActivity = {
  icon: string;
  title: string;
  time?: string;
};

export type ItineraryDay = {
  day: number;
  locationLabel?: string;
  activities: ItineraryActivity[];
};

const ICON_FILES: Record<string, string> = {
  mosque: "day-01",
  moon: "day-02",
  sun: "day-03",
  book: "day-04",
  bus: "day-05",
  pin: "day-06",
  mountain: "day-07",
  plane: "day-08",
  palm: "day-09",
  camera: "day-10",
  kaaba: "day-11",
  hotel: "day-12",
};

export function itineraryIconSrc(icon: string): string {
  const file = ICON_FILES[icon] ?? icon;
  return `/brand/itinerary-icons/${file}.png`;
}
