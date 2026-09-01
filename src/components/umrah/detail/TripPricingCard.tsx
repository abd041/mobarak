"use client";

import { User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DirArrow } from "@/components/ui/DirArrow";
import {
  TripInquiryCtaBenefits,
  useTripInquiryCtaCopy,
} from "@/components/umrah/detail/TripInquiryCtaCopy";
import { useTripFlowContext } from "@/components/umrah/TripFlowProvider";
import type { UmrahTrip } from "@/data/mock";
import {
  formatTripPriceLabel,
  getTripPriceDisplayMode,
} from "@/lib/trip-price-display";
import { cn } from "@/lib/utils";

export function TripPricingCard({
  trip,
  className,
  compact = false,
}: {
  trip: UmrahTrip;
  className?: string;
  compact?: boolean;
}) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const cta = useTripInquiryCtaCopy(trip);
  const flow = useTripFlowContext();
  const priceMode = getTripPriceDisplayMode(trip);
  const priceFromLabel = tCommon("from");
  const perPerson = tCommon("perPerson");
  const intlLocale =
    locale === "de" ? "de-AT" : locale === "ar" ? "ar-SA" : locale === "bs" ? "bs-BA" : "en-GB";

  const prices = [
    { key: "quad", label: t("room4"), amount: trip.prices.quad },
    { key: "triple", label: t("room3"), amount: trip.prices.triple },
    { key: "double", label: t("room2"), amount: trip.prices.double },
  ] as const;

  return (
    <div
      className={cn(
        "rounded-[20px] border border-[#EEF0F3] bg-white shadow-[0_16px_44px_rgba(9,36,92,0.12)]",
        compact ? "px-4 pt-5 pb-5" : "px-5 pt-5 pb-5 sm:px-6 sm:pt-5 sm:pb-5",
        className,
      )}
    >
      <h2
        className={cn(
          "border-b border-[#E6E9EE] font-bold leading-none text-[#051033]",
          compact ? "pb-3 text-[15px]" : "pb-3.5 text-[16px] lg:text-[17px]",
        )}
      >
        {t("pricePerPerson")}
      </h2>

      <ul aria-label={t("pricePerPerson")}>
        {prices.map((row, i) => (
          <li
            key={row.key}
            className={cn(
              "flex items-center justify-between gap-3",
              compact ? "py-3.5" : "py-3.5 lg:py-3.5",
              i < prices.length - 1 && "border-b border-[#E6E9EE]",
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <User
                className={cn(
                  "shrink-0 text-[#5B6B7C]",
                  compact ? "h-4 w-4" : "h-[18px] w-[18px] lg:h-5 lg:w-5 lg:text-[#051033]",
                )}
                strokeWidth={1.6}
                aria-hidden
              />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span
                  className={cn(
                    "font-bold leading-snug text-[#051033]",
                    compact ? "text-[12px]" : "text-[13px] lg:text-[14px]",
                  )}
                >
                  {row.label}
                </span>
                <span
                  className={cn(
                    "font-medium leading-none text-[#8A96A3]",
                    compact ? "text-[11px]" : "text-[12px]",
                  )}
                >
                  {perPerson}
                </span>
              </span>
            </div>
            <p
              className={cn(
                "shrink-0 font-extrabold leading-none tracking-[-0.02em] text-[var(--mobarak-price-green)]",
                compact ? "text-[18px]" : "text-[20px] lg:text-[22px]",
              )}
            >
              {formatTripPriceLabel(row.amount, priceMode, priceFromLabel, intlLocale)}
            </p>
          </li>
        ))}
      </ul>

      <Link
        href={flow.inquiryPath}
        className={cn(
          "mt-5 flex w-full items-center justify-center rounded-[14px] px-4 font-bold text-white shadow-[0_8px_20px_rgba(30,90,156,0.28)] transition hover:brightness-[0.97]",
          compact ? "min-h-[46px] py-3 text-[14px]" : "min-h-[50px] py-3.5 text-[15px]",
          cta.mode === "waitlist"
            ? "bg-brand-orange-cta"
            : cta.mode === "full"
              ? "bg-navy"
              : "bg-[linear-gradient(180deg,#3B82F6_0%,#1E5A9C_100%)]",
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          {cta.buttonLabel}
          <DirArrow className="ms-0" />
        </span>
      </Link>

      <TripInquiryCtaBenefits
        trip={trip}
        className={cn("mt-3.5 space-y-2 lg:mt-4", compact && "mt-3")}
        itemClassName="text-[12px] leading-snug text-[#051033]"
      />
    </div>
  );
}
