import { notFound } from "next/navigation";
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
import { HajjCampaignProvider } from "@/components/hajj/HajjCampaignProvider";
import type { HajjCampaign } from "@/data/hajj-campaign-types";
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
        §47 page structure (desktop & mobile — same section order):
        Header (layout) → Hero → Google rating + reviews → Status → Why →
        Process (desktop: 2×5 grid; mobile: vertical stack) →
        Journey (desktop: 2-row scroll; mobile: large stacked cards) →
        SEO → Experience → FAQ → Final CTA.
        Mobile: single-column layouts, review slider, no inline pre-reg CTAs
        (one sticky bar via HajjStickyCta). Cards show short copy; full text in modal.
      */}
      <HajjStickyCta ctaLabel={content.hero.cta} campaignSlug={campaign.slug}>
        <HajjLandingHero content={content.hero} campaignSlug={campaign.slug} />
        {campaign.settings.googleReviewsEnabled ? (
          <HajjReviewsSection
            reviews={googleReviews.reviews}
            stats={googleReviews.stats}
            mapsUrl={googleReviews.mapsUrl}
          />
        ) : null}
        <HajjStatusBanner content={content.status} campaignSlug={campaign.slug} />
        <HajjWhySection content={content.why} />
        <HajjProcessSection content={content.process} />
        <HajjJourneySection content={content.journey} />
        <HajjSeoSection content={content.seo} />
        <HajjExperienceSection content={content.experience} />
        <HajjFaqSection content={content.faqs} title={t("faqTitle")} />
        <HajjFinalCtaSection content={content.finalCta} campaignSlug={campaign.slug} />
      </HajjStickyCta>
    </HajjCampaignProvider>
  );
}
