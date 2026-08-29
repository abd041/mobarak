import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HajjReviewsSection } from "@/components/hajj/HajjReviewsSection";
import { HajjExperienceSection } from "@/components/hajj/HajjExperienceSection";
import { HajjFaqSection } from "@/components/hajj/HajjFaqSection";
import { HajjFinalCtaSection } from "@/components/hajj/HajjFinalCtaSection";
import { HajjJourneySection } from "@/components/hajj/HajjJourneySection";
import { HajjLandingHero } from "@/components/hajj/HajjLandingHero";
import { HajjProcessSection } from "@/components/hajj/HajjProcessSection";
import { HajjSeoSection } from "@/components/hajj/HajjSeoSection";
import { HajjStatusBanner } from "@/components/hajj/HajjStatusBanner";
import { HajjStickyCta } from "@/components/hajj/HajjStickyCta";
import { HajjWhySection } from "@/components/hajj/HajjWhySection";
import { getHajjContent } from "@/lib/hajj-content-store.server";
import { getGoogleReviewsData } from "@/lib/google-reviews.server";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "hajj");
}

export default async function HajjLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [content, t, googleReviews] = await Promise.all([
    getHajjContent(locale),
    getTranslations("hajj"),
    getGoogleReviewsData(locale),
  ]);

  return (
    <HajjStickyCta ctaLabel={content.hero.cta}>
      <HajjLandingHero content={content.hero} />
      <HajjReviewsSection
        reviews={googleReviews.reviews}
        stats={googleReviews.stats}
        mapsUrl={googleReviews.mapsUrl}
      />
      <HajjStatusBanner content={content.status} />
      <HajjWhySection content={content.why} />
      <HajjProcessSection content={content.process} />
      <HajjJourneySection content={content.journey} />
      <HajjSeoSection content={content.seo} />
      <HajjExperienceSection content={content.experience} />
      <HajjFaqSection content={content.faqs} title={t("faqTitle")} />
      <HajjFinalCtaSection content={content.finalCta} />
    </HajjStickyCta>
  );
}
