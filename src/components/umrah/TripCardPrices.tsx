"use client";

import { useLocale, useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import {
  getTripPriceDisplayMode,
  type TripPriceDisplayMode,
} from "@/lib/trip-price-display";
import { cn, formatEuro } from "@/lib/utils";

const PRICE_ROWS = [
  { key: "quad", roomKey: "room4" },
  { key: "triple", roomKey: "room3" },
  { key: "double", roomKey: "room2" },
] as const;

function localeTag(locale: string): string {
  if (locale === "de") return "de-AT";
  if (locale === "ar") return "ar-SA";
  if (locale === "bs") return "bs-BA";
  return "en-GB";
}

function PriceAmount({
  amount,
  locale,
  compact,
}: {
  amount: number;
  locale: string;
  compact: boolean;
}) {
  const formatted = formatEuro(amount, localeTag(locale));

  return (
    <p
      className={cn(
        "font-extrabold leading-none tracking-[-0.02em] text-[#1A9B3A]",
        compact ? "mt-1 text-[15px] md:text-[16px]" : "mt-2 text-[16px] sm:text-[18px]",
      )}
    >
      {formatted}
    </p>
  );
}

function PriceBox({
  roomLabel,
  amount,
  perLabel,
  locale,
  compact,
}: {
  roomLabel: string;
  amount: number;
  perLabel: string;
  locale: string;
  compact: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center justify-center rounded-lg border border-[#E8EBEF] bg-[#F7F9FB] text-center",
        compact ? "px-1 py-2 md:px-1.5 md:py-2" : "px-1.5 py-3",
      )}
    >
      <p
        className={cn(
          "px-0.5 font-bold leading-[1.2] text-[#0A1B3D]",
          compact ? "text-[8px] md:text-[9px]" : "text-[10px]",
        )}
      >
        {roomLabel}
      </p>
      <PriceAmount amount={amount} locale={locale} compact={compact} />
      <p
        className={cn(
          "font-medium text-[#5B6B7C]",
          compact ? "mt-0.5 text-[8px] md:text-[9px]" : "mt-1 text-[10px]",
        )}
      >
        {perLabel}
      </p>
    </div>
  );
}

/** Listing card — three occupancy prices side by side (quad / triple / double). */
export function TripCardPrices({
  trip,
  prominence = "default",
  embedded = false,
  className,
}: {
  trip: UmrahTrip;
  prominence?: "listing" | "default";
  embedded?: boolean;
  className?: string;
  showPrefix?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const isListing = prominence === "listing";

  const grid = (
    <div className="grid grid-cols-3 gap-1.5 md:gap-2">
      {PRICE_ROWS.map(({ key, roomKey }) => (
        <PriceBox
          key={key}
          compact={isListing}
          roomLabel={t(roomKey)}
          amount={trip.prices[key]}
          perLabel={tCommon("perPerson")}
          locale={locale}
        />
      ))}
    </div>
  );

  if (embedded) {
    return <div className={cn("min-w-0", className)}>{grid}</div>;
  }

  return (
    <div
      className={cn(
        "mt-auto border-t border-[#E8EBEF] bg-white px-3.5 py-3.5",
        isListing && "md:px-4 md:py-4",
        className,
      )}
    >
      {grid}
    </div>
  );
}
