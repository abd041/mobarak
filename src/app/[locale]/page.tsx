import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Libre_Baskerville } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeServiceCards } from "@/components/home/HomeServiceCards";
import { HomeTrustBar } from "@/components/home/HomeTrustBar";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { TripsCarousel } from "@/components/home/TripsCarousel";
import { HomeExpertCta } from "@/components/home/HomeExpertCta";
import { HomeWhyPromise } from "@/components/home/HomeWhyPromise";
import { HomePartners } from "@/components/home/HomePartners";
import { getGoogleReviewsData } from "@/lib/google-reviews.server";
import { pageMetadata } from "@/lib/page-metadata";
import { getAllTripsFromStore } from "@/lib/trips-store.server";
import { Link } from "@/i18n/navigation";
import { DirArrow } from "@/components/ui/DirArrow";

const sectionDisplay = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, trips, googleReviews] = await Promise.all([
    getTranslations("home"),
    getAllTripsFromStore(),
    getGoogleReviewsData(locale),
  ]);

  return (
    <>
      <HomeHero />
      <HomeTrustBar />
      <HomeServiceCards />

      <ReviewsSection reviews={googleReviews.reviews} />

      <section className="overflow-visible bg-white py-10 sm:py-12 md:py-14" aria-labelledby="home-trips-heading">
        <Container className="overflow-visible px-5 sm:px-8 lg:px-9">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-2 text-[12px] font-bold tracking-[0.04em] text-[#F28C18] sm:text-[13px]">
                <span className="inline-block h-[2px] w-4 rounded-full bg-[#F28C18]" aria-hidden />
                {t("tripsEyebrow")}
              </p>
              <h2
                id="home-trips-heading"
                className={`${sectionDisplay.className} text-[1.55rem] font-bold leading-tight tracking-[-0.02em] text-[#0B2A7A] sm:text-[1.85rem] md:text-[2.05rem]`}
              >
                {t("tripsTitle")}
              </h2>
              <p className="mt-1.5 text-[14px] text-[#0B2A7A]/80 sm:text-[15px]">{t("tripsSubtitle")}</p>
            </div>
            <Link
              href="/umrah-gruppenreisen"
              className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-bold text-[#1264F5] transition hover:text-[#0F56D6]"
            >
              {t("tripsViewAll")}
              <DirArrow className="text-base" />
            </Link>
          </div>
          <TripsCarousel trips={trips} />
        </Container>
      </section>

      <HomeWhyPromise />
      <HomePartners />
      <HomeExpertCta />
    </>
  );
}
