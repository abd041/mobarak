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
        compact ? "mt-[6px] text-[15px] md:text-[16px]" : "mt-[8px] text-[15px] sm:text-[17px]",
      )}
    >
      <span
        className={cn(
          "font-semibold",
          compact ? "text-[10px] md:text-[11px]" : "text-[10px] sm:text-[11px]",
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
        "flex min-w-0 flex-col items-center justify-center rounded-[10px] border border-[#E8EBEF] bg-[#F7F8FA] text-center",
        compact ? "px-[6px] py-[10px] md:px-[8px] md:py-[12px]" : "px-[6px] py-[10px] sm:px-[8px] sm:py-[12px]",
      )}
    >
      <p
        className={cn(
          "px-[2px] font-semibold leading-snug text-[#0A1B3D]",
          compact ? "text-[10px] md:text-[11px]" : "text-[10px] sm:text-[11px]",
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
          compact ? "mt-[4px] text-[10px]" : "mt-[6px] text-[10px] sm:text-[11px]",
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
    <div className="grid grid-cols-3 gap-[8px]">
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
        isListing ? "px-4 py-3 md:px-[16px] md:py-[16px]" : "ps-[22px] pe-[14px] py-[14px] sm:px-[16px]",
        className,
      )}
    >
      {grid}
    </div>
  );
}
