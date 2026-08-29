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
  mode,
  fromLabel,
  aroundLabel,
  locale,
  compact,
}: {
  amount: number;
  mode: TripPriceDisplayMode;
  fromLabel: string;
  aroundLabel: string;
  locale: string;
  compact: boolean;
}) {
  const formatted = formatEuro(amount, localeTag(locale));
  const prefix = mode === "from" ? fromLabel : aroundLabel;

  return (
    <p
      className={cn(
        "font-extrabold leading-none tracking-[-0.02em] text-[var(--mobarak-price-green)]",
        compact ? "mt-1 text-[13px] md:mt-1.5 md:text-[15px] lg:mt-2 lg:text-[17px]" : "mt-2 text-[15px] sm:text-[17px]",
      )}
    >
      <span
        className={cn(
          "font-semibold",
          compact ? "text-[9px] md:text-[10px] lg:text-[11px]" : "text-[10px] sm:text-[11px]",
        )}
      >
        {prefix}{" "}
      </span>
      {formatted}
    </p>
  );
}

function PriceBox({
  roomLabel,
  amount,
  priceMode,
  fromLabel,
  aroundLabel,
  perLabel,
  locale,
  compact,
}: {
  roomLabel: string;
  amount: number;
  priceMode: TripPriceDisplayMode;
  fromLabel: string;
  aroundLabel: string;
  perLabel: string;
  locale: string;
  compact: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center justify-center rounded-[10px] border border-[#E5E0D6] bg-[#FBF7F0] text-center",
        compact ? "px-1 py-2 md:px-1.5 md:py-2.5 lg:px-2 lg:py-3" : "px-1.5 py-2.5 sm:px-2 sm:py-3",
      )}
    >
      <p
        className={cn(
          "px-0.5 font-semibold leading-snug text-[#0A1B3D]",
          compact ? "text-[9px] md:text-[10px] lg:text-[11px]" : "text-[9px] sm:text-[10px] lg:text-[11px]",
        )}
      >
        {roomLabel}
      </p>
      <PriceAmount
        amount={amount}
        mode={priceMode}
        fromLabel={fromLabel}
        aroundLabel={aroundLabel}
        locale={locale}
        compact={compact}
      />
      <p
        className={cn(
          "font-medium text-[#1A1A1A]",
          compact ? "mt-0.5 text-[8px] md:mt-1 md:text-[9px] lg:text-[10px]" : "mt-1.5 text-[9px] sm:text-[10px]",
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
  /** When true, render only the price grid (parent supplies footer chrome). */
  embedded?: boolean;
  className?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const priceMode = getTripPriceDisplayMode(trip);
  const priceFromLabel = tCommon("from");
  const priceAroundLabel = tCommon("around");
  const isListing = prominence === "listing";

  const grid = (
    <div className="grid grid-cols-3 gap-1.5 md:gap-2">
      {PRICE_ROWS.map(({ key, roomKey }) => (
        <PriceBox
          key={key}
          compact={isListing}
          roomLabel={t(roomKey)}
          amount={trip.prices[key]}
          priceMode={priceMode}
          fromLabel={priceFromLabel}
          aroundLabel={priceAroundLabel}
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
        "mt-auto border-t border-[#EEF0F3]",
        isListing ? "px-2.5 py-2.5 md:px-4 md:py-4" : "px-3.5 py-3.5 sm:px-4 sm:py-4",
        className,
      )}
    >
      {grid}
    </div>
  );
}
