import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { IQ } from "@/lib/images";

/** Hero benefits — ChatGPT Image Sep 1, 2026, 05:22 (shield / clock / document) */
const BENEFIT_ICONS = {
  reliable: "/brand/icons/visum-service/hero/reliable.png",
  fast: "/brand/icons/visum-service/hero/fast.png",
  easy: "/brand/icons/visum-service/hero/easy.png",
} as const;

const BENEFITS = [
  { iconSrc: BENEFIT_ICONS.reliable, titleKey: "benefitReliableTitle", bodyKey: "benefitReliableBody" },
  { iconSrc: BENEFIT_ICONS.fast, titleKey: "benefitFastTitle", bodyKey: "benefitFastBody" },
  { iconSrc: BENEFIT_ICONS.easy, titleKey: "benefitEasyTitle", bodyKey: "benefitEasyBody" },
] as const;

/** Hero — ChatGPT Image Sep 1, 2026, 04:53 (Makkah + visa composite) */
const HERO_IMAGE = "/brand/visum-service-hero.png";

/**
 * Hero: composite Makkah + Saudi visa artwork (reference design).
 */
export async function VisumServiceHero() {
  const t = await getTranslations("visum");

  return (
    <section className="relative bg-white md:overflow-hidden">
      {/* Desktop — text + benefits over composite photo */}
      <div className="visum-hero-bg relative hidden w-full overflow-hidden md:block">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          quality={IQ.hero}
          sizes="100vw"
          className="visum-hero-photo object-cover"
        />
        <div className="visum-hero-scrim absolute inset-0" aria-hidden />

        <div className="relative mx-auto flex h-full max-w-page items-center px-4 py-9 sm:px-6 lg:px-8 lg:py-14">
          <div className="relative z-10 max-w-xl lg:max-w-2xl">
            <h1 className="visum-display-font text-[2rem] leading-[1.08] font-bold tracking-tight text-navy sm:text-[2.6rem] md:text-[3.15rem]">
              <span className="text-navy">{t("heroTitleLine1")}</span>
              <br />
              <span className="text-brand-orange-cta">{t("heroTitleLine2")}</span>
            </h1>
            <p className="mt-3.5 max-w-md text-[14px] leading-relaxed text-navy/80 sm:text-[15px] md:mt-4 md:text-[16px]">
              {t("heroSubtitle")}
            </p>

            <ul className="mt-8 flex items-start gap-6 lg:gap-8">
              {BENEFITS.map(({ iconSrc, titleKey, bodyKey }) => (
                <li key={titleKey} className="flex max-w-[11.5rem] items-center gap-2.5">
                  <Image
                    src={iconSrc}
                    alt=""
                    width={32}
                    height={32}
                    className="h-7 w-7 shrink-0 object-contain lg:h-8 lg:w-8"
                  />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-bold leading-snug text-navy [text-shadow:0_1px_10px_rgba(255,255,255,0.9)] lg:text-[14px]">
                      {t(titleKey)}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-navy/80 [text-shadow:0_1px_8px_rgba(255,255,255,0.85)] lg:text-[12px] lg:leading-relaxed">
                      {t(bodyKey)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile — full-bleed hero, left wash, left-aligned copy, overlapping benefit card */}
      <div className="relative pb-2 md:hidden">
        <div className="visum-hero-mobile-shell relative w-full">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            quality={IQ.hero}
            sizes="100vw"
            className="visum-hero-mobile-photo object-cover"
          />
          <div className="visum-hero-mobile-scrim pointer-events-none absolute inset-0 z-[1]" aria-hidden />

          <div className="relative z-10 flex flex-col items-start px-4 pt-[5.25rem] pb-28 text-start sm:px-5 sm:pt-[5.75rem] sm:pb-32">
            <h1 className="visum-display-font max-w-[17rem] text-[1.6875rem] leading-[1.12] font-bold tracking-[-0.01em] text-navy sm:max-w-[19rem]">
              <span className="text-navy">{t("heroTitleLine1")}</span>
              <br />
              <span className="text-brand-orange-cta">{t("heroTitleLine2")}</span>
            </h1>
            <p className="mt-4 max-w-[14.75rem] whitespace-pre-line text-[14px] leading-[1.55] text-navy/75 sm:max-w-[15.5rem]">
              {t("heroSubtitleMobile")}
            </p>
          </div>
        </div>

        <div className="relative z-20 -mt-12 px-4 sm:-mt-14">
          <ul className="grid grid-cols-3 divide-x divide-[#E8EAEE] overflow-hidden rounded-xl border border-[#ECEEF2] bg-white px-1 py-4 shadow-[0_10px_32px_rgba(11,44,74,0.10)] sm:px-1.5 sm:py-4">
            {BENEFITS.map(({ iconSrc, titleKey, bodyKey }) => (
              <li key={titleKey} className="flex min-w-0 items-start gap-2 px-2 sm:gap-2.5 sm:px-2.5">
                <Image
                  src={iconSrc}
                  alt=""
                  width={40}
                  height={40}
                  className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
                />
                <span className="min-w-0 text-start">
                  <span className="block text-[11px] font-bold leading-tight text-navy sm:text-[12px]">
                    {t(titleKey)}
                  </span>
                  <span className="mt-0.5 block text-[9px] leading-snug text-navy/75 sm:text-[10px] sm:leading-relaxed">
                    {t(bodyKey)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
