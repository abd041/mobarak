import Image from "next/image";
import { Caveat, Libre_Baskerville, Noto_Naskh_Arabic } from "next/font/google";
import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";

const HERO_SRC = "/brand/home-hero-makkah.png";

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

const heroArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["600", "700"],
  display: "swap",
  preload: false,
});

/**
 * Homepage hero — pixel-faithful clone of the approved Makkah reference.
 */
export async function HomeHero() {
  const t = await getTranslations("home");
  const tSeo = await getTranslations("seo");

  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      aria-labelledby="home-hero-heading"
    >
      <div className="home-hero-bg relative w-full overflow-hidden">
        <Image
          src={HERO_SRC}
          alt={tSeo("ogImageAlt")}
          fill
          priority
          quality={95}
          sizes="100vw"
          className="home-hero-photo absolute inset-0 h-full w-full object-cover"
        />

        {/* Left-to-right white fade over hero image — reference match */}
        <div className="home-hero-fade pointer-events-none absolute inset-0 z-10" aria-hidden />

        {/* Upper-right handwritten slogan — reference tilt, line break, brush underline */}
        <div className="home-hero-signature pointer-events-none absolute z-30">
          <div className="home-hero-signature-inner">
            <p className={`${heroScript.className} home-hero-signature-text`}>
              <span className="home-hero-signature-line1">{t("heroSloganLine1")}</span>
              <span className="home-hero-signature-line2">{t("heroSloganLine2")}</span>
            </p>
            <svg
              viewBox="0 0 240 22"
              className="home-hero-signature-stroke"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 14C28 7.5 58 5 92 6.5C132 8.2 168 14.5 204 11.5C214 10.6 224 9.2 234 8"
                stroke="url(#homeHeroSloganStroke)"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="homeHeroSloganStroke" x1="0" y1="0" x2="240" y2="0">
                  <stop offset="0%" stopColor="#0B2A7A" />
                  <stop offset="10%" stopColor="#0B2A7A" />
                  <stop offset="16%" stopColor="#E8A117" />
                  <stop offset="100%" stopColor="#F0B429" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Left copy stack */}
        <div className="home-hero-copy relative z-30 flex h-full flex-col justify-center py-10 md:flex-row md:items-center md:justify-start md:py-0 md:pb-14 md:pt-4">
          <Container className="w-full md:px-8 lg:px-10 xl:px-12">
            <div className="home-hero-copy-inner max-w-[21rem] sm:max-w-[22rem] md:max-w-[28rem] lg:max-w-[32rem]">
              <p
                lang="ar"
                dir="rtl"
                className={`${heroArabic.className} text-left text-[1.2rem] leading-none font-bold text-[#0B2A7A] md:text-[1.55rem] lg:text-[1.65rem]`}
              >
                {t("heroLabbaykArabic")}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-[#3D4F5F] md:mt-1.5 md:text-[13px]">
                {t("heroLabbaykTranslation")}
              </p>

              <p className="mt-3 text-[10px] font-extrabold tracking-[0.14em] text-[#F28C18] uppercase md:mt-3.5 md:text-[12px] md:tracking-[0.12em]">
                {t("heroEyebrow")}
              </p>

              <h1
                id="home-hero-heading"
                className={`${heroDisplay.className} mt-2 text-[1.72rem] leading-[1.12] font-bold tracking-[-0.01em] text-[#0B2A7A] md:mt-2.5 md:text-[2.45rem] md:leading-[1.1] lg:mt-3 lg:text-[2.75rem] lg:leading-[1.08]`}
              >
                {t("heroTitleLine1")}
                <br />
                {t("heroTitleLine2")}
              </h1>

              <p className="mt-2.5 text-[13px] leading-[1.45] font-medium text-[#123B91]/90 md:mt-3 md:max-w-[26rem] md:text-[15px] lg:text-[16px]">
                {t("heroBodyLine1")}
                <br />
                {t("heroBodyLine2")}
              </p>

              <Link
                href="/umrah-gruppenreisen"
                className="mt-4 inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl bg-[#1264F5] px-5 text-[13px] font-bold text-white shadow-[0_8px_22px_rgba(18,100,245,0.28)] transition hover:bg-[#0F56D6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1264F5] sm:mt-[1.125rem] md:mt-5 md:min-h-[2.9rem] md:rounded-full md:px-6 md:text-[14px]"
              >
                {t("heroCta")}
                <span aria-hidden className="text-[1.05em] leading-none">
                  →
                </span>
              </Link>
            </div>
          </Container>
        </div>

        {/* Bottom-right location badge */}
        <div className="absolute inset-e-3 bottom-3 z-30 sm:inset-e-4 sm:bottom-3.5 md:inset-e-6 md:bottom-20 lg:inset-e-8 lg:bottom-[5.25rem] xl:inset-e-10 xl:bottom-[5.5rem]">
          <div className="inline-flex max-w-[16.5rem] items-start gap-2.5 rounded-xl bg-[#0A1B3D]/78 px-3.5 py-2.5 shadow-[0_10px_28px_rgba(10,27,61,0.28)] backdrop-blur-[2px] sm:max-w-[18.5rem] sm:gap-3 sm:rounded-[14px] sm:px-4 sm:py-3">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-white sm:h-[18px] sm:w-[18px]"
              strokeWidth={2.25}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-[12.5px] font-bold leading-snug text-white sm:text-[13.5px]">
                {t("heroLocationTitle")}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-white/88 sm:text-[12px]">
                {t("heroLocationSubtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
