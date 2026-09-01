import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { IQ } from "@/lib/images";

const HERO_SRC = "/brand/home-hero-bg.png";

export async function HomeHero() {
  const t = await getTranslations("home");
  const tSeo = await getTranslations("seo");

  return (
    <section
      className="relative w-full bg-white"
      aria-labelledby="home-hero-heading"
    >
      {/* Section + photo band locked to 500px (same as other marketing heroes) */}
      <div className="home-hero-bg relative h-[500px] min-h-[500px] max-h-[500px] w-full overflow-hidden">
        <Image
          src={HERO_SRC}
          alt={tSeo("ogImageAlt")}
          fill
          priority
          quality={IQ.hero}
          sizes="100vw"
          className="home-hero-photo absolute inset-0 h-full w-full object-cover"
        />
        <div className="home-hero-scrim pointer-events-none absolute inset-0 z-20" />

        {/* Mobile: text sits in the bottom wash; desktop stays vertically centered */}
        <div className="relative z-30 flex h-full items-end pb-28 md:items-center md:pb-0">
          <Container className="w-full">
            <div className="max-w-[17.5rem] sm:max-w-110 lg:ms-1 lg:max-w-145">
              <p className="text-[12px] font-extrabold tracking-[0.14em] text-brand-orange-ink uppercase sm:text-[13px] sm:font-bold sm:tracking-[0.12em] lg:text-[15px] lg:tracking-[0.09em]">
                {t("heroEyebrow")}
              </p>

              <h1
                id="home-hero-heading"
                className="mt-2.5 text-[28px] leading-[1.12] font-extrabold tracking-[-0.02em] text-[#081A3A] sm:mt-3 sm:text-[38px] sm:leading-[1.1] sm:font-bold sm:tracking-[-0.01em] lg:mt-3.5 lg:text-[48px] lg:leading-[1.06] lg:tracking-[-0.035em]"
              >
                {t("heroTitleLine1")}
                <br />
                {t("heroTitleLine2")}
              </h1>

              <p className="mt-2.5 max-w-112.5 text-[13.5px] leading-[1.55] font-medium text-[#3D4F5F] sm:mt-4 sm:text-[15px] sm:leading-[1.5] sm:font-normal lg:mt-4 lg:text-[17px] lg:leading-[1.45] lg:font-medium lg:tracking-[0.015em]">
                {t("heroBody")}
              </p>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
