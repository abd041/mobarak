import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HajjCampaignProvider } from "@/components/hajj/HajjCampaignProvider";
import { HajjFaqSection } from "@/components/hajj/HajjFaqSection";
import { HajjFinalCtaSection } from "@/components/hajj/HajjFinalCtaSection";
import { HajjJourneyV2Section } from "@/components/hajj/HajjJourneyV2Section";
import { HajjLandingHero } from "@/components/hajj/HajjLandingHero";
import { HajjMissionSection } from "@/components/hajj/HajjMissionSection";
import { HajjNusukSection } from "@/components/hajj/HajjNusukSection";
import { HajjReviewsSection } from "@/components/hajj/HajjReviewsSection";
import { HajjStickyCta } from "@/components/hajj/HajjStickyCta";
import { HajjTrustSection } from "@/components/hajj/HajjTrustSection";
import type { HajjCampaign } from "@/data/hajj-campaign-types";
import { getHajjLandingV2 } from "@/data/hajj/landing-v2-content";
import type { Locale } from "@/i18n/routing";
import { getHajjContentForCampaign } from "@/lib/hajj-content-store.server";
import { getGoogleReviewsData } from "@/lib/google-reviews.server";

export async function HajjCampaignLanding({
  locale,
  campaign,
}: {
  locale: string;
  campaign: HajjCampaign;
}) {
  if (campaign.status === "draft") {
    notFound();
  }

  setRequestLocale(locale);
  const v2 = getHajjLandingV2(locale as Locale);
  const [content, t, googleReviews] = await Promise.all([
    getHajjContentForCampaign(campaign.slug, locale),
    getTranslations("hajj"),
    campaign.settings.googleReviewsEnabled
      ? getGoogleReviewsData(locale)
      : Promise.resolve({ reviews: [], stats: { rating: 0, count: 0 }, mapsUrl: "" }),
  ]);

  return (
    <HajjCampaignProvider campaign={campaign}>
      {/*
        Hajj 2027 reference landing (v2):
        Hero → Trust → Reviews → Mission → Services → Nusuk →
        Journey intro/phases/chapters → FAQ → Final CTA
      */}
      <HajjStickyCta ctaLabel={v2.hero.cta} campaignSlug={campaign.slug}>
        <HajjLandingHero content={v2.hero} campaignSlug={campaign.slug} />
        <HajjTrustSection items={v2.trust} />
        {campaign.settings.googleReviewsEnabled ? (
          <HajjReviewsSection
            reviews={googleReviews.reviews}
            stats={googleReviews.stats}
            mapsUrl={googleReviews.mapsUrl}
          />
        ) : null}
        <HajjMissionSection content={v2.mission} services={v2.services} />
        <HajjNusukSection content={v2.nusuk} />
        <HajjJourneyV2Section
          journeyIntro={v2.journeyIntro}
          journeyPhases={v2.journeyPhases}
          chapters={v2.chapters}
        />
        <HajjFinalCtaSection content={v2.finalCta} campaignSlug={campaign.slug} />
        <HajjFaqSection content={content.faqs} title={t("faqTitle")} />
      </HajjStickyCta>
    </HajjCampaignProvider>
  );
}
