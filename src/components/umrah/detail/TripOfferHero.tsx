"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, FileText, Luggage, Plane, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { UmrahTrip } from "@/data/mock";
import { cn } from "@/lib/utils";
import { resolveTrip, getAvailabilityBadgeLines } from "@/lib/trip-availability";
import { TripPricingCard } from "@/components/umrah/detail/TripPricingCard";
import { TripOfferHeroSlider } from "@/components/umrah/detail/TripOfferHeroSlider";
import { TripDetailBreadcrumb } from "@/components/umrah/detail/TripDetailBreadcrumb";
import { OFFER_HERO_SLIDES } from "@/lib/offer-hero-slides";

export const OFFER_HERO_IMAGE = OFFER_HERO_SLIDES[0]!.src;

const NAVY = "#09245C";
const BLUE = "#174DE8";
const GREEN = "#178B2D";
const ORANGE = "#F5A000";

function formatFullDateRange(startIso: string, endIso: string, locale: string) {
  const start = new Date(`${startIso}T12:00:00`);
  const end = new Date(`${endIso}T12:00:00`);
  const loc =
    locale === "de" ? "de-AT" : locale === "ar" ? "ar-SA" : locale === "bs" ? "bs-BA" : "en-GB";
  const dayMonth = new Intl.DateTimeFormat(loc, { day: "numeric", month: "long" });
  const full = new Intl.DateTimeFormat(loc, { day: "numeric", month: "long", year: "numeric" });
  if (start.getFullYear() === end.getFullYear()) {
    return `${dayMonth.format(start)} – ${full.format(end)}`;
  }
  return `${full.format(start)} – ${full.format(end)}`;
}

const HERO_INCLUSIONS = [
  { key: "visa", Icon: FileText, labelKey: "featVisa" },
  { key: "flight", Icon: Plane, labelKey: "featFlight" },
  { key: "baggage", Icon: Luggage, labelKey: "featBaggageShort" },
  { key: "guide", Icon: Users, labelKey: "featGuide" },
] as const;

const HERO_TONE_COLOR = {
  green: GREEN,
  red: "#C0392B",
  orange: ORANGE,
} as const;

function HeroAvailabilityPills({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const lines = getAvailabilityBadgeLines(trip);

  return (
    <div id="availability" className="flex flex-wrap items-center gap-2 scroll-mt-28">
      {lines.map((line) => {
        const color = HERO_TONE_COLOR[line.tone];
        const label =
          line.labelKey === "available"
            ? t("available", { count: line.count ?? 0 })
            : t(line.labelKey);

        return (
          <span
            key={`${line.tone}-${line.labelKey}`}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border bg-white/95 px-3 py-1.5 text-[12px] font-semibold leading-none shadow-sm backdrop-blur-sm"
            style={{ borderColor: color, color }}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            {label}
          </span>
        );
      })}
    </div>
  );
}

/** Offer hero — portrait mobile gallery + copy; desktop side-by-side with pricing card. */
export function TripOfferHero({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [live, setLive] = useState(trip);

  const titleParts = live.title.trim().split(/\s+/);
  const titleFirst = titleParts[0] ?? live.title;
  const titleRest = titleParts.slice(1).join(" ");

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

  const dateFull = formatFullDateRange(live.startDate, live.endDate, locale);
  const nightsLabel = tCommon("nights", { count: live.nights }).toUpperCase();
  const [slide, setSlide] = useState(0);

  return (
    <>
      <section
        id="overview"
        className="full-viewport-bleed relative scroll-mt-24 overflow-hidden min-h-[32rem] sm:min-h-[34rem] lg:h-[500px] lg:min-h-[500px]"
        aria-label={live.title}
      >
        <TripOfferHeroSlider active={slide} onChange={setSlide} />

        <div className="relative z-10 flex min-h-[inherit] flex-col pointer-events-none">
          <div className="pointer-events-auto hidden lg:block">
            <TripDetailBreadcrumb dateLabel={live.dateLabel} overlay />
          </div>

          <Container className="flex flex-1 flex-col justify-end pointer-events-none pb-16 lg:h-[500px] lg:min-h-[500px] lg:justify-center lg:pb-0">
            <div className="pointer-events-auto grid items-end gap-8 py-6 sm:py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-8 lg:py-6">
              <div className="flex max-w-[580px] flex-col gap-4 sm:gap-5 lg:justify-center lg:gap-4">
                <HeroAvailabilityPills trip={live} />

                <span
                  className="inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase lg:bg-[#E8F1FF]"
                  style={{ backgroundColor: "rgba(232, 241, 255, 0.95)", color: BLUE }}
                >
                  {nightsLabel}
                </span>

                <h1 className="text-[36px] leading-[1.02] font-extrabold tracking-[-0.035em] text-white sm:text-[42px] lg:text-[56px] lg:leading-[0.96] xl:text-[60px]">
                  {titleRest ? (
                    <>
                      <span className="lg:hidden">{live.title}</span>
                      <span className="hidden lg:inline" style={{ color: NAVY }}>
                        {titleFirst}
                      </span>
                      <br className="hidden lg:block" />
                      <span className="hidden lg:inline" style={{ color: BLUE }}>
                        {titleRest}
                      </span>
                    </>
                  ) : (
                    <span className="lg:text-[color:var(--navy)]">{live.title}</span>
                  )}
                </h1>

                <p className="flex items-center gap-2.5 text-[15px] font-bold text-white sm:text-[17px] lg:text-[color:var(--navy)]">
                  <CalendarDays
                    className="h-[18px] w-[18px] shrink-0 text-white lg:text-[color:var(--navy)]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span>{dateFull}</span>
                </p>

                <ul
                  className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4 sm:gap-y-0"
                  aria-label={t("inclusions")}
                >
                  {HERO_INCLUSIONS.map(({ key, Icon, labelKey }, i) => (
                    <li
                      key={key}
                      className={cn(
                        "flex flex-col items-center gap-2 px-1 text-center sm:px-2",
                        i > 0 && "sm:border-s sm:border-white/25 lg:sm:border-[#D5DCE4]/80",
                      )}
                    >
                      <Icon
                        className="h-6 w-6 text-white sm:h-7 sm:w-7 lg:text-[color:var(--navy)]"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <span className="text-[11px] leading-snug font-semibold text-white sm:text-[12px] lg:text-[color:var(--navy)]">
                        {t(labelKey)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Desktop pricing card — inline with hero */}
              <aside
                id="prices"
                className="relative hidden w-full scroll-mt-24 lg:block lg:max-w-[360px] lg:justify-self-end"
              >
                <TripPricingCard trip={live} />
              </aside>
            </div>
          </Container>
        </div>
      </section>

      {/* Mobile pricing — below hero, before hotels */}
      <Container className="relative z-20 -mt-6 lg:hidden">
        <aside id="prices" className="scroll-mt-20">
          <TripPricingCard trip={live} />
        </aside>
      </Container>
    </>
  );
}
