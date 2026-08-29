"use client";

import { ChevronDown, User } from "lucide-react";
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
import { scrollToSection } from "@/lib/scroll-to-section";
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
        "rounded-[20px] border border-line bg-white shadow-[0_16px_48px_rgba(9,36,92,0.12)]",
        compact ? "px-4 py-4" : "px-5 py-6 sm:px-6 sm:py-8",
        className,
      )}
    >
      <h2
        className={cn(
          "border-b border-line font-bold leading-none text-navy",
          compact ? "pb-3 text-[15px]" : "pb-4 text-[17px] lg:pb-6",
        )}
      >
        {t("pricePerPerson")}
      </h2>

      <ul aria-label={t("pricePerPerson")}>
        {prices.map((row, i) => (
          <li
            key={row.key}
            className={cn(
              "flex items-start justify-between gap-4",
              compact ? "py-3" : "py-4 lg:py-[1.35rem]",
              i < prices.length - 1 && "border-b border-line",
            )}
          >
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <User
                className={cn("mt-0.5 shrink-0 text-navy", compact ? "h-4 w-4" : "h-[19px] w-[19px]")}
                strokeWidth={1.75}
                aria-hidden
              />
              <span
                className={cn(
                  "font-semibold leading-snug text-navy",
                  compact ? "text-[12px]" : "text-[13px] lg:text-[14px]",
                )}
              >
                {row.label}
              </span>
            </div>
            <div className="shrink-0 text-end">
              <p
                className={cn(
                  "font-extrabold leading-none tracking-[-0.02em] text-[var(--mobarak-price-green)]",
                  compact ? "text-[18px]" : "text-[21px] lg:text-[22px]",
                )}
              >
                {formatTripPriceLabel(row.amount, priceMode, priceFromLabel, intlLocale)}
              </p>
              <p className="mt-1 text-[12px] leading-none text-muted">{tCommon("perPerson")}</p>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scrollToSection("hotels", 80)}
        className="mt-5 flex w-full items-center justify-center gap-1 py-3 text-[13px] font-semibold text-brand-cta lg:hidden"
      >
        {t("moreOfferInfo")}
        <ChevronDown className="h-4 w-4" strokeWidth={2.25} aria-hidden />
      </button>

      <Link
        href={flow.inquiryPath}
        className={cn(
          "hidden w-full items-center justify-center gap-2 rounded-xl px-4 font-bold text-white transition hover:brightness-95 lg:flex",
          compact ? "mt-4 min-h-[46px] py-3 text-[14px]" : "mt-7 min-h-[52px] py-4 text-[15px] lg:mt-8",
          cta.mode === "waitlist"
            ? "bg-brand-orange-cta"
            : cta.mode === "full"
              ? "bg-navy"
              : "bg-[var(--mobarak-primary)]",
        )}
      >
        {cta.buttonLabel}
        <DirArrow />
      </Link>

      <TripInquiryCtaBenefits
        trip={trip}
        className={cn("hidden space-y-2 lg:block", compact ? "mt-3" : "mt-5 lg:mt-6 lg:space-y-3")}
        itemClassName="text-[12px] leading-snug"
      />
    </div>
  );
}
