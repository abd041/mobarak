import type { LucideIcon } from "lucide-react";
import {
  AirVent,
  Coffee,
  Footprints,
  Headphones,
  Star,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import type { Hotel } from "@/data/mock";

/** Configurable hotel feature — shown below the gallery when listed on the hotel record. */
export type HotelAmenityId = "wifi" | "reception" | "ac" | "restaurant" | "stars";

export const HOTEL_AMENITY_IDS: HotelAmenityId[] = [
  "wifi",
  "reception",
  "ac",
  "restaurant",
  "stars",
];

const AMENITY_META: Record<
  HotelAmenityId,
  { Icon: LucideIcon; labelKey: string }
> = {
  wifi: { Icon: Wifi, labelKey: "amenityWifi" },
  reception: { Icon: Headphones, labelKey: "amenityReception" },
  ac: { Icon: AirVent, labelKey: "amenityAc" },
  restaurant: { Icon: UtensilsCrossed, labelKey: "amenityRestaurant" },
  stars: { Icon: Star, labelKey: "hotelStarsAmenity" },
};

export type HotelInfoItem = {
  id: string;
  Icon: LucideIcon;
  labelKey: string;
  labelValues?: Record<string, string | number>;
  /** Walking distance & breakfast — emphasised in the card layout */
  primary?: boolean;
};

/** Ordered info rows for a hotel card — walking, breakfast, then configured amenities. */
export function getHotelInfoItems(hotel: Hotel): HotelInfoItem[] {
  const items: HotelInfoItem[] = [
    {
      id: "walking",
      Icon: Footprints,
      labelKey: "walkingTo",
      labelValues: {
        minutes: hotel.walkingMinutes,
        mosque: hotel.mosque,
      },
      primary: true,
    },
  ];

  if (hotel.breakfast) {
    items.push({
      id: "breakfast",
      Icon: Coffee,
      labelKey: "breakfast",
      primary: true,
    });
  }

  for (const id of hotel.amenities) {
    const meta = AMENITY_META[id];
    if (!meta) continue;
    items.push({
      id,
      Icon: meta.Icon,
      labelKey: meta.labelKey,
      labelValues: id === "stars" ? { count: hotel.stars } : undefined,
    });
  }

  return items;
}

type TFn = (key: string, values?: Record<string, string | number>) => string;

export function formatHotelInfoLabel(t: TFn, item: HotelInfoItem): string {
  if (item.labelKey === "walkingTo" && item.labelValues) {
    const mosqueKey = item.labelValues.mosque as string;
    return t("walkingTo", {
      minutes: item.labelValues.minutes as number,
      mosque: mosqueKey === "nabawi" ? t("nabawi") : t("haram"),
    });
  }
  if (item.labelValues) return t(item.labelKey, item.labelValues);
  return t(item.labelKey);
}
