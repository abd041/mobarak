"use client";

import { useState } from "react";
import Image from "next/image";
import { Amiri, Caveat, Libre_Baskerville } from "next/font/google";
import {
  ArrowRight,
  Box,
  Check,
  ChevronRight,
  IdCard,
  Landmark,
  Luggage,
  Plane,
  Tent,
  UserRound,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { HajjLandingV2, LandingJourneyCard } from "@/data/hajj/landing-v2-content";
import { IQ } from "@/lib/images";

const NAVY = "#0A1F3D";
const GOLD = "#C4A35A";
const ACCENT = "#1264F5";
const PHASE_BROWN = "#8B6A42";
const PHASE_CREAM = "#F6F0E8";

const display = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const handwritten = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const arabicCalligraphy = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["700"],
  display: "swap",
});

const MOBILE_PHASE_ICONS = [UserRound, IdCard, Landmark, Box, Tent, Plane, Luggage] as const;

const MOBILE_PHASE_LABELS: { title: string; subtitle?: string }[] = [
  { title: "Vormerkung & Information" },
  { title: "Nusuk Registrierung" },
  { title: "Medina" },
  { title: "Makkah & Umrah" },
  { title: "Hajj-Tage", subtitle: "(Mina, Arafat, Muzdalifah)" },
  { title: "Rückkehr nach Makkah" },
  { title: "Rückreise" },
];

function CheckItem({ children }: { children: string }) {
  return (
    <li className="flex gap-2 text-[13px] leading-snug text-[#4A5A6A]">
      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: ACCENT }} strokeWidth={2.6} aria-hidden />
      <span>{children}</span>
    </li>
  );
}

function PhotoCard({
  title,
  items,
  imageSrc,
  index,
  numbered = true,
}: LandingJourneyCard & { index: number; numbered?: boolean }) {
  const num = String(index).padStart(2, "0");
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(7,31,53,0.06)]">
      <div className="relative h-[132px] w-full">
        <Image
          src={imageSrc}
          alt=""
          fill
          quality={IQ.card}
          sizes="(max-width: 768px) 100vw, 22vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h4 className="flex items-center gap-2 text-[14px] font-bold" style={{ color: NAVY }}>
          {numbered ? (
            <span
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: GOLD }}
            >
              {num}
            </span>
          ) : null}
          {title}
        </h4>
        <ul className="mt-2.5 space-y-1.5">
          {items.map((item) => (
            <CheckItem key={item}>{item}</CheckItem>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ChapterHead({
  num,
  title,
  subtitle,
  intro,
}: {
  num: string;
  title: string;
  subtitle: string;
  intro?: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <span
          className={`${display.className} flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[18px] text-white sm:h-14 sm:w-14 sm:text-[26px]`}
          style={{ backgroundColor: GOLD }}
        >
          {num}
        </span>
        <div>
          <h3
            className={`${display.className} text-[22px] leading-tight md:text-[32px]`}
            style={{ color: NAVY }}
          >
            {title}
          </h3>
          <p className="mt-1 max-w-xl text-[12px] leading-[1.45] text-[#5A6A7A] md:mt-1.5 md:text-[15px] md:leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
      {intro ? (
        <p className="hidden max-w-md text-[13px] leading-relaxed text-[#5A6A7A] lg:block lg:pt-1 lg:text-end md:text-[14px]">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

/** Spiritual Talbiyah panel — not a content card */
function TalbiyahVisual({
  arabic,
  translit,
  className,
}: {
  arabic: string;
  translit: string;
  className?: string;
}) {
  return (
    <aside
      className={`relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-[28px] px-5 py-10 text-center sm:min-h-[280px] ${className ?? ""}`}
      style={{
        background:
          "radial-gradient(ellipse at 50% 42%, #1A2740 0%, #0F1A2E 55%, #0A1424 100%)",
      }}
      aria-label={`${arabic}. ${translit}`}
    >
      <Image
        src="/brand/hajj-journey/talbiyah.png"
        alt=""
        fill
        className="object-cover object-center opacity-[0.22]"
        sizes="320px"
        quality={IQ.content}
      />
      <div
        className="pointer-events-none absolute inset-[14px] rounded-[20px] border border-[#C4A35A]/35"
        aria-hidden
      />
      <p
        dir="rtl"
        lang="ar"
        className={`${arabicCalligraphy.className} relative z-10 max-w-[14rem] text-[34px] leading-[1.45] text-[#F3E6C8] md:text-[40px]`}
      >
        {arabic}
      </p>
      <p className="relative z-10 mt-6 text-[14px] font-medium tracking-[0.02em] text-[#E8D9B0] md:text-[15px]">
        {translit}
      </p>
    </aside>
  );
}

const PHASE_ICONS = [
  "/brand/hajj-journey/phase-01.png",
  "/brand/hajj-journey/phase-02.png",
  "/brand/hajj-journey/phase-03.png",
  "/brand/hajj-journey/phase-04.png",
  "/brand/hajj-journey/phase-05.png",
  "/brand/hajj-journey/phase-06.png",
  "/brand/hajj-journey/phase-07.png",
] as const;

const RITUAL_ICONS = [
  "/brand/hajj-journey/ritual-01.png",
  "/brand/hajj-journey/ritual-02.png",
  "/brand/hajj-journey/ritual-03.png",
  "/brand/hajj-journey/ritual-04.png",
  "/brand/hajj-journey/ritual-05.png",
  "/brand/hajj-journey/ritual-06.png",
] as const;

const MOBILE_HAJJ_DATES = [
  "08. Dhul-Hijjah",
  "09. Dhul-Hijjah",
  "Nacht 9./10. Dhul-Hijjah",
  "10. Dhul-Hijjah",
  "11.–13. Dhul-Hijjah",
] as const;

const MOBILE_HAJJ_TITLES = [
  "Mina – Yawm at-Tarwiyah",
  "Arafat – der Höhepunkt",
  "Muzdalifah",
  "Jamarat & Eid al-Adha",
  "Tage des Tashriq",
] as const;

function MobileMore({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-[12px] font-semibold text-white"
      style={{ backgroundColor: ACCENT }}
    >
      {open ? "Weniger anzeigen" : label}
      <ArrowRight className={`h-4 w-4 transition ${open ? "rotate-90" : ""}`} />
    </button>
  );
}

function MobileTitleList({
  cards,
  start = 0,
  labels,
}: {
  cards: LandingJourneyCard[];
  start?: number;
  labels?: readonly string[];
}) {
  return (
    <ol className="mt-4 overflow-hidden rounded-xl border border-[#E5E9EF] bg-white">
      {cards.map((card, i) => (
        <li
          key={card.title}
          className="flex min-h-14 items-center gap-3 border-b border-[#EEF1F5] px-3.5 py-4 last:border-b-0"
        >
          <span
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tracking-wide text-white"
            style={{ backgroundColor: GOLD }}
          >
            {String(i + 1 + start).padStart(2, "0")}
          </span>
          <span
            className="min-w-0 flex-1 text-[14px] font-semibold leading-snug tracking-[-0.01em]"
            style={{ color: NAVY }}
          >
            {labels?.[i] ?? card.title}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#8A94A6]" strokeWidth={1.8} aria-hidden />
        </li>
      ))}
    </ol>
  );
}

export function HajjJourneyV2Section({
  journeyIntro,
  journeyPhases,
  chapters,
}: {
  journeyIntro: HajjLandingV2["journeyIntro"];
  journeyPhases: HajjLandingV2["journeyPhases"];
  chapters: HajjLandingV2["chapters"];
}) {
  const [medina, toMakkah, umrah, hajjDays, closing] = chapters;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  return (
    <section id="ablauf" className="scroll-mt-20 bg-white">
      <Container className="py-10 md:py-16 lg:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[12px] font-bold tracking-[0.16em]" style={{ color: GOLD }}>
              {journeyIntro.eyebrow}
            </p>
            <h2
              className={`${display.className} mt-2.5 text-[28px] leading-[1.15] tracking-[-0.02em] md:mt-3 md:text-[40px]`}
              style={{ color: NAVY }}
            >
              {journeyIntro.title}
            </h2>
            <p className="mt-3 max-w-2xl text-[12.5px] leading-[1.55] text-[#4A5A6A] md:mt-4 md:text-[16px] md:leading-[1.7]">
              {journeyIntro.body}
            </p>
          </div>
          <div className="relative hidden lg:block">
            <Image
              src="/brand/hajj-journey/deco-quote-minaret.png"
              alt={journeyIntro.handwritten.replace("\n", " ")}
              width={720}
              height={380}
              className="ms-auto h-auto w-full max-w-[36rem] object-contain object-right"
              unoptimized
            />
          </div>
        </div>

        <ol className="relative mt-12 hidden lg:flex">
          <span
            className="pointer-events-none absolute top-[18px] start-[6%] end-[6%] border-t border-dashed"
            style={{ borderColor: `${GOLD}99` }}
            aria-hidden
          />
          {journeyPhases.map((phase, index) => (
            <li key={phase.id} className="relative flex min-w-0 flex-1 flex-col items-center text-center">
              <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white">
                <Image
                  src={`${PHASE_ICONS[index] ?? PHASE_ICONS[0]}?v=5`}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                  unoptimized
                />
              </span>
              <p className="mt-2.5 max-w-[7.4rem] text-[11px] font-semibold leading-snug" style={{ color: NAVY }}>
                {phase.label}
              </p>
            </li>
          ))}
        </ol>

        <div className="relative mt-6 lg:hidden">
          <ol className="space-y-3.5">
            {journeyPhases.map((phase, index) => {
              const Icon = MOBILE_PHASE_ICONS[index] ?? UserRound;
              const label = MOBILE_PHASE_LABELS[index];
              return (
                <li key={phase.id} className="flex items-center gap-3.5">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: PHASE_CREAM }}
                  >
                    <Icon className="h-5 w-5" style={{ color: PHASE_BROWN }} strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-snug" style={{ color: NAVY }}>
                      {label?.title ?? phase.label}
                    </p>
                    {label?.subtitle ? (
                      <p className="mt-0.5 text-[12px] leading-snug text-[#6B7785]">{label.subtitle}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
          <svg
            viewBox="0 0 48 72"
            className="pointer-events-none absolute -bottom-1 end-0 h-14 w-9 opacity-35"
            aria-hidden
          >
            <path
              fill={PHASE_BROWN}
              d="M22 2h4v8h-4zm-8 10h20l-2 6H16zm2 8h16v40c0 2-2 4-4 4H20c-2 0-4-2-4-4zm6 6h4v6h-4zm-3 12h10v18H19z"
            />
            <path fill={PHASE_BROWN} d="M10 28h6v36h-3c-2 0-3-1-3-3zm22 0h6v33c0 2-1 3-3 3h-3z" />
          </svg>
        </div>
      </Container>

      {medina ? (
        <div id="medina" className="scroll-mt-20 border-t border-[#F0F2F5] py-8 md:py-16">
          <Container>
            <ChapterHead
              num={medina.num}
              title={medina.title}
              subtitle={medina.subtitle}
              intro={medina.intro}
            />
            <div className="hidden gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_minmax(15rem,17rem)]">
              {medina.cards?.map((card, i) => (
                <PhotoCard key={card.title} {...card} index={i + 1} />
              ))}
              {medina.quote ? (
                <aside className="relative flex min-h-[220px] items-start overflow-hidden rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(7,31,53,0.06)] sm:col-span-2 xl:col-span-1">
                  <Image
                    src="/brand/hajj-journey/medina-quote-bg.png"
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="280px"
                    quality={IQ.content}
                  />
                  <p className="relative z-10 text-[14px] leading-relaxed text-[#2F3F4F]">
                    {medina.quote}
                  </p>
                </aside>
              ) : null}
            </div>
            <div className="lg:hidden">
              <div className="relative h-44 overflow-hidden rounded-xl">
                <Image
                  src="/brand/booking-cta-medina.png"
                  alt=""
                  fill
                  className="object-cover object-[center_52%]"
                  sizes="100vw"
                  unoptimized
                />
              </div>
              {medina.cards ? (
                <MobileTitleList cards={medina.cards} />
              ) : null}
              {expanded.medina ? (
                <div className="mt-3 grid gap-3">
                  {medina.cards?.map((card, i) => (
                    <PhotoCard key={card.title} {...card} index={i + 1} />
                  ))}
                </div>
              ) : null}
              {medina.quote ? (
                <aside className="relative mt-3 min-h-24 overflow-hidden rounded-xl bg-[#F5F7F9] p-4">
                  <Image
                    src="/brand/hajj-journey/deco-minaret-top.png"
                    alt=""
                    fill
                    className="object-contain opacity-65"
                    style={{ objectPosition: "right bottom" }}
                    sizes="100vw"
                  />
                  <p className="relative z-10 max-w-[72%] text-[11px] leading-[1.55] text-[#2F3F4F]">
                    {medina.quote}
                  </p>
                </aside>
              ) : null}
              <MobileMore
                label="Mehr zu Medina"
                open={!!expanded.medina}
                onToggle={() => toggle("medina")}
              />
            </div>
          </Container>
        </div>
      ) : null}

      {toMakkah ? (
        <div id="medina-makkah" className="scroll-mt-20 border-t border-[#F0F2F5] py-8 md:py-16">
          <Container>
            <ChapterHead
              num={toMakkah.num}
              title={toMakkah.title}
              subtitle={toMakkah.subtitle}
              intro={toMakkah.intro}
            />
            <div className="hidden gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_minmax(15rem,17rem)]">
              {toMakkah.cards?.map((card, i) => (
                <PhotoCard key={card.title} {...card} index={i + 1} />
              ))}
              {toMakkah.arabicBlock ? (
                <TalbiyahVisual
                  arabic={toMakkah.arabicBlock.arabic}
                  translit={toMakkah.arabicBlock.translit}
                  className="sm:col-span-2 xl:col-span-1"
                />
              ) : null}
            </div>
            <div className="lg:hidden">
              <div className="relative h-48 overflow-hidden rounded-xl sm:h-56">
                <Image
                  src="/brand/hajj-journey/makkah-miqat-clear.png"
                  alt=""
                  fill
                  className="object-cover object-[center_45%]"
                  sizes="100vw"
                  quality={IQ.content}
                />
              </div>
              {toMakkah.cards ? (
                <MobileTitleList
                  cards={toMakkah.cards}
                  start={4}
                  labels={[
                    "Vorbereitung auf den Ihram",
                    "Miqat",
                    "Weiterreise nach Makkah",
                    "Ankunft & Check-in",
                  ]}
                />
              ) : null}
              {toMakkah.arabicBlock ? (
                <TalbiyahVisual
                  arabic={toMakkah.arabicBlock.arabic}
                  translit={toMakkah.arabicBlock.translit}
                  className="mt-3 min-h-[200px] rounded-2xl py-8"
                />
              ) : null}
              {expanded.toMakkah ? (
                <div className="mt-3 grid gap-3">
                  {toMakkah.cards?.map((card, i) => (
                    <PhotoCard key={card.title} {...card} index={i + 1} />
                  ))}
                </div>
              ) : null}
              <MobileMore
                label="Mehr zu Makkah & Umrah"
                open={!!expanded.toMakkah}
                onToggle={() => toggle("toMakkah")}
              />
            </div>
          </Container>
        </div>
      ) : null}

      {umrah ? (
        <div id="umrah" className="scroll-mt-20 border-t border-[#F0F2F5] py-8 md:py-16">
          <Container>
            <ChapterHead
              num={umrah.num}
              title={umrah.title}
              subtitle={umrah.subtitle}
              intro={umrah.intro}
            />
            <div className="border-0 px-0 py-0 lg:rounded-[22px] lg:border lg:border-[#E6EAEF] lg:px-6 lg:py-8">
              <div className="relative mb-5 h-44 overflow-hidden rounded-xl lg:hidden">
                <Image
                  src="/brand/offer-hero/offer-detail-hero-makkah.png"
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </div>
              <ol className="hidden lg:flex lg:items-start">
                {umrah.ritualSteps?.map((step, index) => {
                  const last = index === (umrah.ritualSteps?.length ?? 0) - 1;
                  return (
                    <li key={step.title} className="flex min-w-0 flex-1 items-start">
                      <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                        <Image
                          src={RITUAL_ICONS[index] ?? RITUAL_ICONS[0]}
                          alt=""
                          width={72}
                          height={72}
                          className="h-[68px] w-[68px] object-contain"
                          unoptimized
                        />
                        <p className="mt-3 text-[14px] font-bold" style={{ color: NAVY }}>
                          {step.title}
                        </p>
                        <p className="mt-1 max-w-[8.6rem] text-[12px] leading-snug text-[#5A6A7A]">
                          {step.body}
                        </p>
                      </div>
                      {last ? null : (
                        <span
                          className="mt-7 flex w-7 shrink-0 items-center justify-center"
                          aria-hidden
                        >
                          <ArrowRight className="h-4 w-4 text-[#C5CDD6]" strokeWidth={2} />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
              <ol className="grid grid-cols-3 gap-x-2 gap-y-4 lg:hidden">
                {umrah.ritualSteps?.map((step, index) => {
                  return (
                    <li key={step.title} className="flex flex-col items-center text-center">
                      <Image
                        src={RITUAL_ICONS[index] ?? RITUAL_ICONS[0]}
                        alt=""
                        width={56}
                        height={56}
                        className="h-12 w-12 object-contain"
                        unoptimized
                      />
                      <p className="mt-1.5 text-[11px] font-bold leading-tight" style={{ color: NAVY }}>
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-[9px] leading-tight text-[#5A6A7A]">{step.body}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
            <a
              href="#faq"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-[12px] font-semibold text-white lg:hidden"
              style={{ backgroundColor: ACCENT }}
            >
              Mehr zur Umrah
              <ArrowRight className="h-4 w-4" />
            </a>
          </Container>
        </div>
      ) : null}

      {hajjDays ? (
        <div id="hajj-tage" className="scroll-mt-20 border-t border-[#F0F2F5] py-8 md:py-16">
          <Container>
            <ChapterHead
              num={hajjDays.num}
              title={hajjDays.title}
              subtitle={hajjDays.subtitle}
              intro={hajjDays.intro}
            />
            <div className="hidden items-stretch gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-5">
              {hajjDays.dayCards?.map((day) => {
                const isHighlight = !!day.highlight;
                return (
                  <article
                    key={day.title}
                    className={
                      isHighlight
                        ? "relative z-[1] overflow-hidden rounded-2xl bg-white shadow-[0_16px_40px_rgba(7,31,53,0.14)] ring-2 ring-[#C4A35A]/55 xl:-translate-y-2"
                        : "overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(7,31,53,0.06)]"
                    }
                  >
                    <div
                      className="relative w-full"
                      style={{ height: isHighlight ? 188 : 158 }}
                    >
                      <Image
                        src={day.imageSrc ?? ""}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 20vw"
                        unoptimized
                        priority={isHighlight}
                      />
                      <div
                        className={
                          isHighlight
                            ? "absolute inset-x-0 top-0 bg-gradient-to-b from-black/65 via-black/30 to-transparent px-3.5 pb-12 pt-3.5"
                            : "absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent px-3.5 pb-10 pt-3"
                        }
                      >
                        <p className="text-[11px] font-semibold tracking-wide text-white">
                          {day.date}
                        </p>
                        <h4
                          className={
                            isHighlight
                              ? "mt-1 text-[15px] font-bold leading-snug text-white xl:text-[16px]"
                              : "mt-0.5 text-[14px] font-bold leading-snug text-white"
                          }
                        >
                          {day.title}
                        </h4>
                      </div>
                    </div>
                    <ul className={`space-y-1.5 ${isHighlight ? "p-4 pt-4" : "p-4"}`}>
                      {day.items.map((item) => (
                        <CheckItem key={item}>{item}</CheckItem>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
            <div className="grid gap-3.5 lg:hidden">
              {hajjDays.dayCards?.map((day, index) => {
                const isHighlight = !!day.highlight;
                return (
                  <article
                    key={day.title}
                    className={
                      isHighlight
                        ? "overflow-hidden rounded-2xl shadow-[0_12px_28px_rgba(7,31,53,0.14)] ring-2 ring-[#C4A35A]/50"
                        : "overflow-hidden rounded-2xl shadow-[0_8px_22px_rgba(7,31,53,0.1)]"
                    }
                  >
                    <div
                      className="relative w-full"
                      style={{ height: isHighlight ? 152 : 132 }}
                    >
                      <Image
                        src={day.imageSrc ?? ""}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="100vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/20" />
                      <div className="absolute inset-0 flex items-center justify-between gap-3 px-4 py-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold tracking-[0.04em] text-white/90">
                            {MOBILE_HAJJ_DATES[index] ?? day.date}
                          </p>
                          <h4
                            className={`${display.className} mt-1 text-[18px] font-bold leading-tight tracking-[-0.02em] text-white`}
                          >
                            {MOBILE_HAJJ_TITLES[index] ?? day.title}
                          </h4>
                        </div>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
                          <ChevronRight
                            className="h-4 w-4"
                            style={{ color: ACCENT }}
                            strokeWidth={2.2}
                            aria-hidden
                          />
                        </span>
                      </div>
                    </div>
                    {expanded.hajjDays ? (
                      <ul className="space-y-1.5 bg-white p-3.5">
                        {day.items.map((item) => (
                          <CheckItem key={item}>{item}</CheckItem>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                );
              })}
              <MobileMore
                label="Mehr zu den Hajj-Tagen"
                open={!!expanded.hajjDays}
                onToggle={() => toggle("hajjDays")}
              />
            </div>
          </Container>
        </div>
      ) : null}

      {closing ? (
        <div className="border-t border-[#F0F2F5] py-8 md:py-16">
          <Container>
            <ChapterHead
              num={closing.num}
              title={closing.title}
              subtitle={closing.subtitle}
              intro={closing.intro}
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.85fr]">
              {closing.cards?.map((card, i) => (
                <PhotoCard key={card.title} {...card} index={i + 1} numbered={false} />
              ))}
              {closing.closingImageSrc ? (
                <aside className="relative min-h-[220px] overflow-hidden rounded-2xl sm:col-span-2 sm:min-h-[260px] xl:col-span-1 xl:min-h-full">
                  <Image
                    src={closing.closingImageSrc}
                    alt=""
                    fill
                    className="object-cover object-[center_18%]"
                    sizes="(max-width: 1280px) 100vw, 38vw"
                    quality={IQ.card}
                  />
                  {/* Soft veil so live handwritten stays editable over any baked text */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-white/25 to-transparent"
                    aria-hidden
                  />
                  {closing.closingHandwritten ? (
                    <p
                      className={`${handwritten.className} absolute start-5 top-6 max-w-[15rem] -rotate-[6deg] text-[28px] leading-[1.15] sm:start-7 sm:top-8 sm:text-[32px] xl:text-[34px]`}
                      style={{ color: NAVY }}
                    >
                      {closing.closingHandwritten.split("\n").map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  ) : null}
                </aside>
              ) : null}
            </div>
          </Container>
        </div>
      ) : null}
    </section>
  );
}
