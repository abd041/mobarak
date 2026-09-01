import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeServiceCards } from "@/components/home/HomeServiceCards";
import { HomeTrustBar } from "@/components/home/HomeTrustBar";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { TripsCarousel } from "@/components/home/TripsCarousel";
import { HomeWhyPromise } from "@/components/home/HomeWhyPromise";
import { HomePartners } from "@/components/home/HomePartners";
import { HomeNewsletter } from "@/components/home/HomeNewsletter";
import { getGoogleReviewsData } from "@/lib/google-reviews.server";
import { pageMetadata } from "@/lib/page-metadata";
import { getAllTripsFromStore } from "@/lib/trips-store.server";

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
      <div className="relative bg-white">
        <HomeHero />
        <HomeServiceCards />
      </div>

      <HomeTrustBar />

      <ReviewsSection reviews={googleReviews.reviews} />

      <section className="overflow-visible bg-white py-10 sm:py-14 md:py-16">
        <Container className="overflow-visible px-5 sm:px-8">
          <div className="mb-6 text-center sm:mb-8">
            <h2 className="text-[22px] font-extrabold tracking-[0.06em] text-navy sm:text-[26px] md:text-[30px]">
              {t("tripsTitle")}
            </h2>
            <p className="mt-[6px] text-sm text-muted md:text-base">{t("tripsSubtitle")}</p>
          </div>
          <TripsCarousel trips={trips} />
        </Container>
      </section>

      <HomeWhyPromise />
      <HomePartners />
      <HomeNewsletter />
    </>
  );
}
