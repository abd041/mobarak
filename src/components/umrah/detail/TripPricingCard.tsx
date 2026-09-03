"use client";

import Image from "next/image";
import { BedDouble, Check, Speech } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DirArrow } from "@/components/ui/DirArrow";
import { useTripInquiryCtaCopy } from "@/components/umrah/detail/TripInquiryCtaCopy";
import { useTripFlowContext } from "@/components/umrah/TripFlowProvider";
import type { UmrahTrip } from "@/data/mock";
import { cn, formatEuro } from "@/lib/utils";

const GUIDE_LANG_META: Record<string, { flagSrc: string; labelKey: string }> = {
  ar: { flagSrc: "/brand/flags/saudi-arabia.png", labelKey: "guideLangAr" },
  de: { flagSrc: "/brand/flags/germany.png", labelKey: "guideLangDe" },
  bs: { flagSrc: "/brand/flags/bosnia.png", labelKey: "guideLangBs" },
  tr: { flagSrc: "/brand/flags/turkey.png", labelKey: "guideLangTr" },
  en: { flagSrc: "/brand/flags/united-kingdom.png", labelKey: "guideLangEn" },
};

function localeTag(locale: string): string {
  if (locale === "de") return "de-AT";
  if (locale === "ar") return "ar-SA";
  if (locale === "bs") return "bs-BA";
  return "en-GB";
}

/** Offer pricing card — matches reference mock (banner, lead price, langs, rooms, CTA). */
export function TripPricingCard({
  trip,
  className,
  compact = false,
  /** Mobile hero: text link instead of inquire button (desktop keeps inquire). */
  ctaMode = "inquire",
}: {
  trip: UmrahTrip;
  className?: string;
  compact?: boolean;
  ctaMode?: "inquire" | "moreInfo";
}) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const cta = useTripInquiryCtaCopy(trip);
  const flow = useTripFlowContext();
  const intlLocale = localeTag(locale);

  const leadAmount = Math.min(trip.prices.quad, trip.prices.triple, trip.prices.double);
  const leadFormatted = formatEuro(leadAmount, intlLocale);

  const prices = [
    { key: "quad", label: t("room4Short"), amount: trip.prices.quad },
    { key: "triple", label: t("room3Short"), amount: trip.prices.triple },
    { key: "double", label: t("room2Short"), amount: trip.prices.double },
  ] as const;

  const langs = (trip.guideLanguages ?? []).filter((code) => GUIDE_LANG_META[code]);

  const trustLines = [
    t("pricingTrustFree"),
    t("pricingTrustAdvice"),
    t("pricingTrustNoObligation"),
  ];

  const scrollToOfferDetails = () => {
    document
      .getElementById("overview-meta")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={cn(
        "relative rounded-[18px] border border-[#E8ECF0] bg-white shadow-[0_18px_48px_rgba(9,36,92,0.16)]",
        className,
      )}
    >
      {/* Yellow banner — top left */}
      <div className="flex justify-start px-5 pt-3 sm:px-6">
        <span className="rounded-full bg-[#F5A000] px-4 py-1.5 text-[10px] font-extrabold tracking-[0.14em] text-black uppercase sm:px-5 sm:text-[11px] sm:tracking-[0.16em]">
          {t("pricingCardBanner")}
        </span>
      </div>

      <div className={cn(compact ? "px-4 pt-3 pb-4" : "px-5 pt-3.5 pb-5 sm:px-6")}>
        {/* Lead price */}
        <p className="text-[14px] font-semibold text-[#111111]">{t("pricingCardLeadLabel")}</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 leading-none">
          <span className="text-[2rem] font-extrabold tracking-[-0.03em] text-[var(--mobarak-price-green)] sm:text-[2.15rem]">
            {leadFormatted}
          </span>
          <span className="text-[15px] font-semibold text-[#111111]">{tCommon("perPersonShort")}</span>
        </p>
        <p className="mt-2 text-[12px] font-medium leading-snug text-[#111111]">
          {t("pricingCardIncludes")}
        </p>

        {/* Guide languages — one row: 2-line label + flags */}
        {langs.length > 0 ? (
          <div className="mt-4 flex items-center gap-2 overflow-hidden rounded-[10px] bg-[#E8F6EC] px-3 py-2.5">
            <div className="flex min-w-0 shrink-0 items-center gap-1.5">
              <Speech
                className="h-4 w-4 shrink-0 text-(--mobarak-price-green)"
                strokeWidth={2.25}
                aria-hidden
              />
              <p className="text-[11px] font-semibold leading-[1.15] text-[#111111]">
                {(t.raw("pricingCardGuideLanguagesLines") as string[]).map((line, i) => (
                  <span key={`guide-lang-line-${i}`} className="block whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </p>
            </div>
            <ul className="ms-auto flex min-w-0 shrink items-start justify-end gap-2 sm:gap-2.5">
              {langs.map((code) => {
                const meta = GUIDE_LANG_META[code]!;
                return (
                  <li key={code} className="flex flex-col items-center gap-0.5">
                    <span className="relative block h-7 w-7 overflow-hidden rounded-full border-2 border-white shadow-[0_1px_4px_rgba(11,44,74,0.14)]">
                      <Image
                        src={meta.flagSrc}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="28px"
                        quality={100}
                        unoptimized
                      />
                    </span>
                    <span className="max-w-[3.25rem] truncate text-center text-[8px] font-medium leading-tight text-[#111111]">
                      {t(meta.labelKey)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {/* Room prices */}
        <ul className="mt-4 space-y-0" aria-label={t("pricePerPerson")}>
          {prices.map((row) => (
            <li
              key={row.key}
              className="flex items-center justify-between gap-3 border-b border-[#F0F2F5] py-2.5 last:border-b-0"
            >
              <span className="inline-flex min-w-0 items-center gap-2.5">
                <BedDouble
                  className="h-[18px] w-[18px] shrink-0 text-[#1A1A1A]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="text-[13px] font-semibold text-[#111111]">{row.label}</span>
              </span>
              <span className="text-[15px] font-extrabold tabular-nums text-[var(--mobarak-price-green)]">
                {formatEuro(row.amount, intlLocale)}
              </span>
            </li>
          ))}
        </ul>

        {ctaMode === "moreInfo" ? (
          <button
            type="button"
            onClick={scrollToOfferDetails}
            className="mt-4 flex w-full items-center justify-center gap-1 py-2 text-[15px] font-bold text-[#1264F5] transition hover:opacity-80"
          >
            {t("moreOfferInfo")}
            <span aria-hidden>↓</span>
          </button>
        ) : (
          <>
            <Link
              href={flow.inquiryPath}
              className={cn(
                "mt-4 flex w-full items-center justify-center rounded-[12px] px-4 font-bold text-white shadow-[0_8px_20px_rgba(18,100,245,0.28)] transition hover:brightness-[0.97]",
                compact
                  ? "min-h-[46px] py-3 text-[14px]"
                  : "min-h-[50px] py-3 text-[14px] sm:text-[15px]",
                cta.mode === "waitlist"
                  ? "bg-brand-orange-cta"
                  : cta.mode === "full"
                    ? "bg-navy"
                    : "bg-[#1264F5]",
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                {cta.buttonLabel}
                <DirArrow className="ms-0" />
              </span>
            </Link>

            <ul className="mt-3.5 space-y-1.5">
              {trustLines.map((line) => (
                <li
                  key={line}
                  className="flex items-center gap-2 text-[12px] font-medium leading-snug text-[#111111]"
                >
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-[var(--mobarak-price-green)]"
                    strokeWidth={2.75}
                    aria-hidden
                  />
                  {line}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
