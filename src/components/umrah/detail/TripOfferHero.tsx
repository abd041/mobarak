"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Luggage,
  Plane,
  Users,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { UmrahTrip } from "@/data/mock";
import { cn } from "@/lib/utils";
import { resolveTrip, getAvailabilityBadgeLines } from "@/lib/trip-availability";
import { TripPricingCard } from "@/components/umrah/detail/TripPricingCard";
import { TripOfferHeroSlider } from "@/components/umrah/detail/TripOfferHeroSlider";
import { TripDetailBreadcrumb } from "@/components/umrah/detail/TripDetailBreadcrumb";
import { OFFER_HERO_SLIDES } from "@/lib/offer-hero-slides";

export const OFFER_HERO_IMAGE = OFFER_HERO_SLIDES[0]!.src;

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
  { key: "visa", Icon: FileText, line1: "featVisaL1", line2: "featVisaL2" },
  { key: "flight", Icon: Plane, line1: "featFlightL1", line2: "featFlightL2" },
  { key: "baggage", Icon: Luggage, line1: "featBaggageL1", line2: "featBaggageL2" },
  { key: "guide", Icon: Users, line1: "featGuideL1", line2: "featGuideL2" },
] as const;

const PILL_STYLE = {
  green: {
    color: "#178B2D",
    bg: "#E8F6EC",
    border: "rgba(23, 139, 45, 0.28)",
    Icon: Check,
  },
  orange: {
    color: "#C47A00",
    bg: "#FFF4E5",
    border: "rgba(196, 122, 0, 0.3)",
    Icon: Clock3,
  },
  red: {
    color: "#C0392B",
    bg: "#FDECEA",
    border: "rgba(192, 57, 43, 0.28)",
    Icon: X,
  },
} as const;

function AvailabilityPill({
  tone,
  label,
}: {
  tone: keyof typeof PILL_STYLE;
  label: string;
}) {
  const style = PILL_STYLE[tone];
  const Icon = style.Icon;

  return (
    <span
      className="inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-semibold leading-none sm:text-[13px]"
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.color,
      }}
    >
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: style.color }}
        aria-hidden
      >
        <Icon className="h-2.5 w-2.5" strokeWidth={3} />
      </span>
      {label}
    </span>
  );
}

/** Offer hero — portrait mobile gallery + copy; desktop side-by-side with pricing card. */
export function TripOfferHero({ trip }: { trip: UmrahTrip }) {
  const t = useTranslations("umrah");
  const tCommon = useTranslations("common");
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

  const dateFull = formatFullDateRange(live.startDate, live.endDate, locale);
  const nightsLabel = tCommon("nights", { count: live.nights }).toUpperCase();
  const [slide, setSlide] = useState(0);
  const availabilityLines = getAvailabilityBadgeLines(live);
  const greenAvailability = availabilityLines.find((line) => line.tone === "green");
  const otherAvailability = availabilityLines.filter((line) => line.tone !== "green");

  const titleParts = live.title.trim().split(/\s+/);
  const titleFirst = titleParts[0] ?? live.title;
  const titleRest = titleParts.slice(1).join(" ");

  const renderAvailabilityPill = (line: (typeof availabilityLines)[number]) => {
    const label =
      line.labelKey === "available"
        ? t("available", { count: line.count ?? 0 })
        : t(line.labelKey);
    return (
      <AvailabilityPill
        key={`${line.tone}-${line.labelKey}`}
        tone={line.tone}
        label={label}
      />
    );
  };

  return (
    <>
      <section
        id="overview"
        className="offer-hero-bg full-viewport-bleed relative z-10 scroll-mt-24 overflow-hidden lg:overflow-hidden"
        aria-label={live.title}
      >
        <div className="absolute inset-0 overflow-hidden">
          <TripOfferHeroSlider active={slide} onChange={setSlide} />
        </div>

        <div className="relative z-10 flex h-full flex-col pointer-events-none">
          <div className="pointer-events-auto hidden lg:block">
            <TripDetailBreadcrumb dateLabel={live.dateLabel} overlay />
          </div>

          <Container className="flex min-h-0 flex-1 flex-col pointer-events-none pb-8 lg:justify-start lg:pb-5 lg:pt-0">
            {/* Mobile: green availability sits high on the photo */}
            {greenAvailability ? (
              <div
                id="availability"
                className="pointer-events-auto pt-5 sm:pt-6 lg:hidden"
              >
                {renderAvailabilityPill(greenAvailability)}
              </div>
            ) : null}

            {/* Mobile: rest lower; desktop: full stack near top */}
            <div
              className={cn(
                "pointer-events-auto mt-auto max-w-[580px] pt-10 pb-2 sm:pt-12 lg:mt-0 lg:max-w-[580px] lg:py-0 lg:pt-0",
              )}
            >
              <div className="flex flex-col items-start gap-5 scroll-mt-28 lg:scroll-mt-28">
                {/* Desktop keeps all pills together */}
                <div
                  id={greenAvailability ? undefined : "availability"}
                  className="hidden flex-col items-start gap-5 lg:flex"
                >
                  {availabilityLines.map(renderAvailabilityPill)}
                </div>

                {/* Mobile: waitlist / other pills stay with title block */}
                {otherAvailability.length > 0 ? (
                  <div className="flex flex-col items-start gap-5 lg:hidden">
                    {otherAvailability.map(renderAvailabilityPill)}
                  </div>
                ) : null}

                <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-[#E8F1FF] px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-[#09245C] uppercase sm:text-[12px]">
                  {nightsLabel}
                </span>

                <h1 className="m-0 text-[36px] leading-[0.98] font-extrabold tracking-[-0.035em] text-white sm:text-[42px] lg:text-[52px] lg:leading-[0.94] xl:text-[56px]">
                  {titleRest ? (
                    <>
                      <span className="lg:hidden">{live.title}</span>
                      <span className="hidden lg:inline text-[#051033]">{titleFirst}</span>
                      <br className="hidden lg:block" />
                      <span className="hidden lg:inline text-[#174DE8]">{titleRest}</span>
                    </>
                  ) : (
                    <span className="lg:text-[#051033]">{live.title}</span>
                  )}
                </h1>

                <p className="m-0 flex items-center gap-2.5 text-[15px] font-bold text-white sm:text-[17px] lg:text-[color:var(--navy)]">
                  <CalendarDays
                    className="h-[18px] w-[18px] shrink-0 text-white lg:text-[color:var(--navy)]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span>{dateFull}</span>
                </p>

                <div className="flex w-full flex-col items-start gap-3">
                  <ul
                    className="m-0 flex w-full max-w-full list-none flex-nowrap items-start justify-between gap-0 p-0 sm:w-fit sm:justify-start"
                    aria-label={t("inclusions")}
                  >
                    {HERO_INCLUSIONS.map(({ key, Icon, line1, line2 }, i) => (
                      <li
                        key={key}
                        className={cn(
                          "relative flex min-w-0 flex-1 flex-col items-center gap-1.5 px-1.5 text-center sm:flex-none sm:gap-2 sm:px-3.5",
                          i > 0 &&
                            "border-s border-white/35 sm:border-s-[1.5px] sm:border-[#C5A35A]/90 lg:border-[#B08D3A]",
                        )}
                      >
                        <Icon
                          className="h-6 w-6 shrink-0 text-white sm:h-7 sm:w-7 lg:text-[#051033]"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                        <span className="flex flex-col items-center text-[9px] leading-[1.2] font-semibold text-white sm:whitespace-nowrap sm:text-[12px] sm:leading-[1.25] lg:text-[#051033]">
                          <span>{t(line1)}</span>
                          <span>{t(line2)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Mobile slide dots — under inclusions (desktop keeps arrow only) */}
                  <div
                    className="flex w-full items-center justify-center gap-2 sm:w-fit sm:self-center lg:hidden"
                    role="tablist"
                    aria-label={t("heroSliderLabel")}
                  >
                    {OFFER_HERO_SLIDES.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={index === slide}
                        aria-label={`${index + 1} / ${OFFER_HERO_SLIDES.length}`}
                        onClick={() => setSlide(index)}
                        className={cn(
                          "h-2 w-2 rounded-full transition",
                          index === slide ? "bg-white" : "bg-white/40",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Desktop card: centered in full 500px hero — equal top & bottom gap */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden lg:flex lg:items-center">
          <Container className="flex w-full justify-end">
            <aside id="prices" className="pointer-events-auto w-full max-w-[360px] scroll-mt-24">
              <TripPricingCard trip={live} />
            </aside>
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
