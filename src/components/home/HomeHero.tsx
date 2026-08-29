import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { IQ } from "@/lib/images";

const HERO_SRC = "/brand/home-hero-bg.png";

export async function HomeHero() {
  const t = await getTranslations("home");
  const tSeo = await getTranslations("seo");

  return (
    <section className="relative w-full bg-white" aria-labelledby="home-hero-heading">
      <div className="home-hero-bg relative w-full overflow-hidden">
        <Image
          src={HERO_SRC}
          alt={tSeo("ogImageAlt")}
          fill
          priority
          quality={IQ.hero}
          sizes="100vw"
          className="home-hero-photo object-cover"
        />
        <div className="home-hero-scrim pointer-events-none absolute inset-0 z-20" />

        <div className="relative z-30 flex h-full items-start pt-10 sm:pt-16 lg:pt-22">
          <Container className="w-full">
            <div className="max-w-[18rem] sm:max-w-110 lg:ms-1 lg:max-w-145">
              <p className="text-[11px] font-bold tracking-[0.12em] text-brand-orange-ink uppercase sm:text-[13px] lg:text-[15px] lg:tracking-[0.09em]">
                {t("heroEyebrow")}
              </p>

              <h1
                id="home-hero-heading"
                className="mt-2.5 text-[26px] leading-[1.1] font-bold tracking-[-0.01em] text-[#081A3A] sm:mt-3 sm:text-[38px] lg:mt-3.5 lg:text-[48px] lg:leading-[1.06] lg:tracking-[-0.035em]"
              >
                {t("heroTitleLine1")}
                <br />
                {t("heroTitleLine2")}
              </h1>

              <p className="mt-3 max-w-112.5 text-[14px] leading-[1.5] text-[#3D4F5F] sm:mt-4 sm:text-[15px] lg:mt-4 lg:text-[17px] lg:leading-[1.45] lg:font-medium lg:tracking-[0.015em]">
                {t("heroBody")}
              </p>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
