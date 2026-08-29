"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UmrahTrip } from "@/data/mock";
import {
  getTripInquiryCtaMode,
  type TripInquiryCtaMode,
} from "@/lib/trip-availability";
import { cn } from "@/lib/utils";

export function useTripInquiryCtaCopy(trip: UmrahTrip) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const mode = getTripInquiryCtaMode(trip);

  if (mode === "waitlist") {
    return {
      mode,
      buttonLabel: tCommon("joinWaitlist"),
      primaryBenefit: tCommon("waitlistBenefit"),
      secondaryBenefit: tCommon("freeInquiry"),
      finalTitle: t("finalCtaWaitlistTitle"),
      finalBody: t("finalCtaWaitlistBody"),
      formNotice: t("inquiryWaitlistNotice"),
    } as const;
  }

  if (mode === "full") {
    return {
      mode,
      buttonLabel: tCommon("inquireNoGuarantee"),
      primaryBenefit: tCommon("noPlaceGuarantee"),
      secondaryBenefit: tCommon("freeInquiry"),
      finalTitle: t("finalCtaFullTitle"),
      finalBody: t("finalCtaFullBody"),
      formNotice: t("inquiryFullNotice"),
    } as const;
  }

  return {
    mode,
    buttonLabel: tCommon("inquireNow"),
    primaryBenefit: tCommon("secureSpot"),
    secondaryBenefit: tCommon("freeInquiry"),
    finalTitle: t("finalCtaTitle"),
    finalBody: t("finalCtaBody"),
    formNotice: null,
  } as const;
}

export function TripInquiryCtaBenefits({
  trip,
  className,
  itemClassName,
}: {
  trip: UmrahTrip;
  className?: string;
  itemClassName?: string;
}) {
  const copy = useTripInquiryCtaCopy(trip);
  const iconTone =
    copy.mode === "full"
      ? "text-brand-orange-cta"
      : copy.mode === "waitlist"
        ? "text-brand-orange-cta"
        : "text-brand-green";

  return (
    <ul className={className}>
      <li className={cn("flex items-center gap-2 font-medium text-navy", itemClassName)}>
        <Check className={cn("h-3.5 w-3.5 shrink-0", iconTone)} strokeWidth={2.75} aria-hidden />
        {copy.primaryBenefit}
      </li>
      <li className={cn("flex items-center gap-2 font-medium text-navy", itemClassName)}>
        <Check className={cn("h-3.5 w-3.5 shrink-0", iconTone)} strokeWidth={2.75} aria-hidden />
        {copy.secondaryBenefit}
      </li>
    </ul>
  );
}

export function TripInquiryFormNotice({ trip }: { trip: UmrahTrip }) {
  const copy = useTripInquiryCtaCopy(trip);
  if (!copy.formNotice) return null;

  const tone: TripInquiryCtaMode = copy.mode;
  return (
    <div
      role="status"
      className={cn(
        "rounded-xl border px-4 py-3 text-[13px] leading-relaxed sm:text-[14px]",
        tone === "waitlist"
          ? "border-[#F5C97A]/80 bg-[#FFF8EB] text-[#8A5A00]"
          : "border-[#E8B4AE] bg-[#FDF2F0] text-[#8B2E24]",
      )}
    >
      {copy.formNotice}
    </div>
  );
}
