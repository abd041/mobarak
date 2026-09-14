"use client";

import Image from "next/image";
import { Caveat, Libre_Baskerville } from "next/font/google";
import { Building2, ChevronDown, FileText, Layers, UserRound, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";
import { hajjCampaignPreRegPath } from "@/data/hajj-campaign-types";
import type { HajjLandingV2 } from "@/data/hajj/landing-v2-content";
import { scrollToSection } from "@/lib/scroll-to-section";
import { IQ } from "@/lib/images";

const CTA_BLUE = "#1264F5";
const NAVY = "#0A1F3D";

const heroDisplay = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
});

const heroScript = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  display: "swap",
});

const MOBILE_TRUST: {
  id: string;
  label: string;
  icon: typeof UserRound;
}[] = [
  { id: "t1", label: "30+ Jahre Erfahrung", icon: UserRound },
  { id: "t2", label: "Keine Zusatzkosten", icon: FileText },
  { id: "t3", label: "Persönliche Reiseleitung", icon: Layers },
  { id: "t4", label: "Religiöse Begleitung", icon: Building2 },
  { id: "t5", label: "Mehrsprachig", icon: Users },
];

export function HajjLandingHero({
  content,
  campaignSlug = "hajj-2027",
}: {
  content: HajjLandingV2["hero"];
  campaignSlug?: string;
}) {
  const handwrittenLines = content.handwritten.split("\n");

  return (
    <section id="top" className="relative overflow-hidden bg-white">
      {/* ── Desktop — reference-faithful layout ── */}
      <div className="hajj-v2-hero relative hidden lg:block">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={content.imageSrc}
            alt=""
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-[72%_40%]"
          />
          {/* Whitish effect: solid left + soft wash behind text → photo */}
          <div className="hajj-v2-hero-fade pointer-events-none absolute inset-0 z-[1]" />
        </div>

        {/* Handwritten — navy, slight tilt, upper-right over sky */}
        <div className="pointer-events-none absolute end-[5%] top-[11%] z-20 max-w-[17rem] xl:end-[6.5%] xl:top-[12%] xl:max-w-[19rem]">
          <p
            className={`${heroScript.className} origin-bottom-left -rotate-[8deg] text-end text-[28px] leading-[1.15] tracking-[-0.01em] xl:text-[32px]`}
            style={{ color: NAVY }}
          >
            {handwrittenLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        {/* Quote card — bottom-right over courtyard */}
        <div className="absolute bottom-10 end-10 z-20 max-w-[20rem] rounded-2xl bg-white px-5 py-4 shadow-[0_10px_32px_rgba(10,31,61,0.14)] xl:bottom-12 xl:end-14 xl:max-w-[22rem]">
          <p className="text-[13px] leading-[1.55] text-[#3D4F5F] xl:text-[14px]">
            {content.quote}
          </p>
        </div>

        <Container className="relative z-10 flex h-full min-h-[inherit] items-center py-10">
          <div className="relative w-full max-w-[34rem] xl:max-w-[36rem]">
            {/* Extra soft white veil under copy so text stays crisp */}
            <div
              className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[40px]"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0) 78%)",
              }}
              aria-hidden
            />
            <p className="text-[12px] font-semibold tracking-[0.14em] text-[#7A8796] xl:text-[13px]">
              {content.label}
            </p>

            <h1
              className={`${heroDisplay.className} mt-5 text-[46px] font-bold leading-[1.08] tracking-[-0.02em] xl:text-[52px]`}
              style={{ color: NAVY }}
            >
              {content.title}
            </h1>

            <p
              className={`${heroDisplay.className} mt-4 text-[20px] font-bold leading-snug xl:text-[22px]`}
              style={{ color: NAVY }}
            >
              {content.subtitle}
            </p>

            <p className="mt-5 max-w-[30rem] text-[15px] leading-[1.7] text-[#4A5A6A] xl:text-[16px]">
              {content.body}
            </p>

            <div className="mt-9 flex flex-col items-start gap-4">
              <Link
                href={hajjCampaignPreRegPath(campaignSlug)}
                className="inline-flex items-center gap-2.5 rounded-[10px] px-7 py-[15px] text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(18,100,245,0.28)] transition hover:brightness-95"
                style={{ backgroundColor: CTA_BLUE }}
              >
                {content.cta}
                <DirArrow className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => scrollToSection("ablauf", 72)}
                className="inline-flex items-center gap-2.5 text-[15px] font-semibold transition hover:opacity-80"
                style={{ color: NAVY }}
              >
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border-[1.5px]"
                  style={{ borderColor: NAVY }}
                  aria-hidden
                >
                  <ChevronDown className="h-4 w-4" strokeWidth={2.25} />
                </span>
                {content.secondaryCta}
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Mobile / tablet ── */}
      <div className="lg:hidden">
        <div className="relative h-[22rem] overflow-hidden sm:h-[26rem]">
          <Image
            src="/brand/hajj-2027-hero-mobile-v2.png"
            alt=""
            fill
            priority
            quality={IQ.hero}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{
              background:
                "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)",
            }}
            aria-hidden
          />
        </div>

        <div className="px-5 pb-10 pt-3">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#7A8796]">
            {content.label}
          </p>
          <h1
            className={`${heroDisplay.className} mt-1.5 text-[30px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[36px]`}
            style={{ color: NAVY }}
          >
            {content.title}
          </h1>
          <p
            className={`${heroDisplay.className} mt-1.5 max-w-[24ch] text-[16px] font-bold leading-[1.35] sm:max-w-none sm:text-[20px]`}
            style={{ color: NAVY }}
          >
            {content.subtitle}
          </p>
          <p className="mt-3 text-[13px] leading-[1.6] text-[#4A5A6A] sm:text-[15px]">{content.body}</p>
          <Link
            href={hajjCampaignPreRegPath(campaignSlug)}
            className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full text-[15px] font-bold text-white"
            style={{ backgroundColor: CTA_BLUE }}
          >
            {content.cta}
            <DirArrow />
          </Link>
          <button
            type="button"
            onClick={() => scrollToSection("ablauf", 72)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2.5 text-[15px] font-semibold"
            style={{ color: NAVY }}
          >
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border-[1.5px]"
              style={{ borderColor: NAVY }}
              aria-hidden
            >
              <ChevronDown className="h-4 w-4" strokeWidth={2.25} />
            </span>
            {content.secondaryCta}
          </button>

          <ul className="mt-8 grid grid-cols-5 gap-1">
            {MOBILE_TRUST.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="flex min-w-0 flex-col items-center text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF2FF]">
                    <Icon className="h-5 w-5" style={{ color: CTA_BLUE }} strokeWidth={1.75} />
                  </span>
                  <p className="mt-1.5 text-[9px] font-semibold leading-tight text-navy">
                    {item.label}
                  </p>
                </li>
              );
            })}
          </ul>

          <blockquote className="mt-6 rounded-2xl bg-[#F4F6F8] px-4 py-4 text-[14px] leading-relaxed text-[#2F3F4F]">
            {content.quote}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
