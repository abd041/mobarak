import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { IQ } from "@/lib/images";

/** Step 2 enquiry hero — ChatGPT Image Sep 1, 2026, 03:45 */
const HERO_IMAGE = "/brand/individual-umrah-final-hero.png";

export async function IndividualUmrahFinalHero() {
  const t = await getTranslations("individualUmrahFinal");

  return (
    <section
      className="individual-umrah-final-hero relative overflow-hidden bg-white"
      aria-labelledby="individual-umrah-final-heading"
    >
      {/* Mobile — warm cream atmosphere (reference) */}
      <div className="individual-umrah-final-hero-mobile-wash pointer-events-none absolute inset-0 z-[1] md:hidden" aria-hidden />

      {/* Desktop / tablet — photo + left cream scrim behind copy */}
      <div className="absolute inset-0 max-md:hidden" aria-hidden>
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          quality={IQ.hero}
          sizes="100vw"
          className="individual-umrah-final-hero-photo object-cover"
        />
        <div className="individual-umrah-final-hero-scrim absolute inset-0" />
      </div>

      <Container className="relative z-10 flex flex-col max-md:px-0 md:h-full md:items-start md:justify-center md:py-12 lg:py-14">
        <div className="relative z-20 max-w-xl px-4 py-8 max-md:max-w-none max-md:pb-5 sm:px-6 md:max-w-2xl md:py-10">
          <span className="mb-3 inline-block rounded-[6px] border border-brand-orange/45 bg-[#FFF8EE] px-2.5 py-1 text-[9px] font-bold tracking-[0.16em] text-brand-orange-ink uppercase sm:mb-4 sm:rounded-full sm:px-3.5 sm:text-[11px] sm:tracking-[0.14em]">
            {t("heroBadge")}
          </span>

          <h1
            id="individual-umrah-final-heading"
            className="text-[28px] font-bold leading-[1.08] tracking-[-0.025em] text-navy max-md:font-serif sm:text-[36px] lg:text-[44px]"
          >
            {t("heroTitleBefore")}{" "}
            <span className="font-serif italic text-brand-orange">{t("heroTitleAccent")}</span>{" "}
            {t("heroTitleAfter")}
          </h1>

          <p className="relative z-20 mt-3 max-w-[34rem] text-[14px] leading-[1.65] text-[#3D4F5F] max-md:whitespace-pre-line sm:mt-4 sm:text-[15px] md:text-[16px]">
            {t("heroSubtitle")}
          </p>
        </div>

        {/* Mobile — Kaaba photo below copy (reference) */}
        <div className="relative z-0 w-full max-md:-mt-2 md:hidden" aria-hidden>
          <div className="individual-umrah-final-hero-mobile-fade pointer-events-none absolute inset-x-0 top-0 z-10" />
          <div className="individual-umrah-final-hero-mobile-photo-wrap relative aspect-[4/3] min-h-[18rem] w-full overflow-hidden sm:min-h-[20rem]">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              priority
              quality={IQ.hero}
              sizes="100vw"
              className="individual-umrah-final-hero-mobile-photo object-cover"
            />
            <div className="individual-umrah-final-hero-mobile-glow pointer-events-none absolute inset-0" />
          </div>
        </div>
      </Container>

      {/* Screen-reader alt for the decorative background photo */}
      <span className="sr-only">{t("heroImageAlt")}</span>
    </section>
  );
}
