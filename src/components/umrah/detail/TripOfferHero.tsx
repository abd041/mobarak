"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Caveat, Libre_Baskerville } from "next/font/google";
import { useLocale, useTranslations } from "next-intl";
import { Clock3, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { UmrahTrip } from "@/data/mock";
import { cn } from "@/lib/utils";
import { resolveTrip, getAvailabilityBadgeLines } from "@/lib/trip-availability";
import { getLocalizedTripTitle } from "@/lib/trip-localized-copy";
import { TripPricingCard } from "@/components/umrah/detail/TripPricingCard";
import { OFFER_DETAIL_HERO_IMAGE } from "@/lib/offer-hero-slides";
import { IQ } from "@/lib/images";

const heroDisplay = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const heroScript = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const OFFER_HERO_ICONS = {
  destinations: "/brand/icons/offer-hero/destinations.png",
  guide: "/brand/icons/offer-hero/guide.png",
  organized: "/brand/icons/offer-hero/shield.png",
  seats: "/brand/icons/offer-hero/seats.png",
} as const;

const HERO_FEATURES = [
  {
    key: "destinations",
    icon: OFFER_HERO_ICONS.destinations,
    line1Key: "offerHeroFeatDestinationsLine1",
    line2Key: "offerHeroFeatDestinationsLine2",
  },
  {
    key: "guide",
    icon: OFFER_HERO_ICONS.guide,
    line1Key: "offerHeroFeatGuideLine1",
    line2Key: "offerHeroFeatGuideLine2",
  },
  {
    key: "organized",
    icon: OFFER_HERO_ICONS.organized,
    line1Key: "offerHeroFeatOrganizedLine1",
    line2Key: "offerHeroFeatOrganizedLine2",
  },
] as const;

function splitTitle(title: string): { line1: string; line2: string } {
  const parts = title.trim().split(/\s+/);
  if (parts.length <= 1) return { line1: title, line2: "" };
  return { line1: parts[0]!, line2: parts.slice(1).join(" ") };
}

/** Offer hero — reference left copy stack + floating pricing card. */
export function TripOfferHero({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const locale = useLocale();
  const [live, setLive] = useState(trip);

  useEffect(() => {
    const sync = () => setLive(resolveTrip(trip));
    sync();
    window.addEventListener("mobarak-availability", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mobarak-availability", sync);
      window.removeEventListener("storage", sync);
    };
  }, [trip]);

  const displayTitle = getLocalizedTripTitle(live, locale, t);
  const { line1, line2 } = splitTitle(displayTitle);
  const availabilityLines = getAvailabilityBadgeLines(live);
  const primaryAvailability = availabilityLines[0];

  const availabilityLabel =
    primaryAvailability?.labelKey === "available"
      ? t("availableShort", { count: primaryAvailability.count ?? 0 })
      : primaryAvailability
        ? t(primaryAvailability.labelKey)
        : null;

  const availabilityTone = primaryAvailability?.tone ?? "green";

  return (
    <>
      <section
        id="overview"
        className="offer-hero-bg full-viewport-bleed relative z-10 scroll-mt-24 overflow-hidden"
        aria-label={displayTitle}
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <Image
            src={OFFER_DETAIL_HERO_IMAGE}
            alt=""
            fill
            priority
            quality={IQ.hero}
            sizes="100vw"
            className="offer-hero-image object-cover"
          />
          <div className="offer-hero-fade absolute inset-0" />
        </div>

        {/* Handwritten slogan — upper right (mobile + desktop) */}
        <div
          className="pointer-events-none absolute z-20"
          style={{ insetInlineEnd: "min(4%, 1.25rem)", top: "10%" }}
          aria-hidden
        >
          <div className="origin-center rotate-[7deg] md:rotate-[7deg]">
            <p
              className={`${heroScript.className} text-end text-[1.15rem] leading-[1.05] font-bold text-black sm:text-[1.45rem] md:text-[1.65rem] xl:text-[1.9rem]`}
            >
              <span className="block">{t("offerHeroSloganLine1")}</span>
              <span className="block">{t("offerHeroSloganLine2")}</span>
              <span className="block">{t("offerHeroSloganLine3")}</span>
            </p>
            <svg
              viewBox="0 0 200 18"
              className="ms-auto mt-0.5 h-auto w-[6.5rem] sm:w-[8.5rem] md:mt-1 md:w-[9.5rem] xl:w-[11rem]"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 11C22 6 48 4 78 5.5C112 7.2 142 12 172 9.5C180 8.8 188 7.6 196 7"
                stroke="#111111"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="relative z-10 flex min-h-[480px] flex-col justify-center lg:min-h-[560px]">
          <Container className="py-10 sm:py-12 lg:py-12">
            <div className="relative z-10 max-w-[min(100%,32rem)] lg:max-w-[min(100%,34rem)]">
              {/* Eyebrow badge */}
              <span className="inline-flex w-fit items-center rounded-md bg-[#F5E6C8] px-3 py-1.5 text-[11px] font-extrabold tracking-[0.1em] text-[#1A1A1A] uppercase sm:text-[12px] sm:tracking-[0.12em]">
                {t("offerHeroEyebrow")}
              </span>

              {/* Title — two lines */}
              <h1
                className={`${heroDisplay.className} mt-4 m-0 text-[2.15rem] leading-[1.05] font-bold tracking-[-0.02em] text-[#111111] sm:text-[2.55rem] lg:text-[3.05rem] xl:text-[3.25rem]`}
              >
                <span className="block">{line1}</span>
                {line2 ? <span className="block">{line2}</span> : null}
              </h1>

              {/* Equal spacing above & below subtitle */}
              <p className="mt-4 mb-4 m-0 max-w-[28rem] text-[14px] font-medium leading-[1.35] text-[#111111] sm:text-[15px] lg:text-[16px]">
                <span className="block">{t("offerHeroSubtitleLine1")}</span>
                <span className="block">{t("offerHeroSubtitleLine2")}</span>
              </p>

              {/* Features — icon left + 2-line label (reference) */}
              <ul
                className="m-0 flex list-none flex-row flex-wrap items-center gap-x-5 gap-y-3 p-0 sm:gap-x-7"
                aria-label={t("offerHeroFeaturesLabel")}
              >
                {HERO_FEATURES.map(({ key, icon, line1Key, line2Key }) => (
                  <li key={key} className="flex items-center gap-2.5">
                    <span className="relative h-10 w-10 shrink-0 sm:h-11 sm:w-11">
                      <Image
                        src={icon}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="44px"
                        quality={IQ.thumb}
                        unoptimized
                      />
                    </span>
                    <span className="text-[12px] font-bold leading-[1.15] text-[#111111] sm:text-[13px]">
                      <span className="block whitespace-nowrap">{t(line1Key)}</span>
                      <span className="block whitespace-nowrap">{t(line2Key)}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {availabilityLabel ? (
                <div id="availability" className="mt-4 scroll-mt-28">
                  <span
                    className={cn(
                      "inline-flex w-fit items-center gap-2.5 rounded-xl px-4 py-2.5 text-[14px] font-bold text-white shadow-[0_4px_14px_rgba(16,137,62,0.28)] sm:text-[15px]",
                      availabilityTone === "green" && "bg-[#10893E]",
                      availabilityTone === "orange" && "bg-[#E8890C]",
                      availabilityTone === "red" && "bg-[#C0392B]",
                    )}
                  >
                    {availabilityTone === "green" ? (
                      <span className="relative h-5 w-5 shrink-0">
                        <Image
                          src={OFFER_HERO_ICONS.seats}
                          alt=""
                          fill
                          className="object-contain brightness-0 invert"
                          sizes="20px"
                          quality={IQ.thumb}
                        />
                      </span>
                    ) : availabilityTone === "orange" ? (
                      <Clock3 className="h-[18px] w-[18px] shrink-0 text-white" strokeWidth={2.25} aria-hidden />
                    ) : (
                      <X className="h-[18px] w-[18px] shrink-0 text-white" strokeWidth={2.25} aria-hidden />
                    )}
                    <span className="text-white">{availabilityLabel}</span>
                  </span>
                </div>
              ) : null}
            </div>
          </Container>
        </div>

        {/* Desktop pricing card */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden lg:flex lg:items-center">
          <Container className="flex w-full justify-end">
            <aside id="prices" className="pointer-events-auto w-full max-w-[22.5rem] scroll-mt-24 xl:max-w-[24rem]">
              <TripPricingCard trip={live} />
            </aside>
          </Container>
        </div>
      </section>

      <Container className="relative z-20 -mt-5 lg:hidden">
        <aside id="prices" className="scroll-mt-20">
          <TripPricingCard trip={live} ctaMode="moreInfo" />
        </aside>
      </Container>
    </>
  );
}
