import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { HajjPreRegForm } from "@/components/hajj/HajjPreRegForm";
import { HajjCampaignProvider } from "@/components/hajj/HajjCampaignProvider";
import { hajjCampaignLandingPath } from "@/data/hajj-campaign-types";
import { getHajjCampaign, listHajjCampaignSlugs } from "@/lib/hajj-campaign-store.server";
import { getHajjContentForCampaign } from "@/lib/hajj-content-store.server";
import { hajjPreRegPageMetadata } from "@/lib/page-metadata";

export async function generateStaticParams() {
  const slugs = await listHajjCampaignSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const campaign = await getHajjCampaign(slug);
  if (!campaign) return {};
  const content = await getHajjContentForCampaign(slug, locale);
  return hajjPreRegPageMetadata(locale, {
    path: `${hajjCampaignLandingPath(slug)}/vormerkung`,
    title: content.preReg.seo.title,
    description: content.preReg.seo.description,
  });
}

export default async function HajjCampaignPreRegPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const campaign = await getHajjCampaign(slug);
  if (!campaign || !campaign.preRegEnabled || campaign.status === "draft") {
    notFound();
  }
  setRequestLocale(locale);
  const content = await getHajjContentForCampaign(slug, locale);

  return (
    // §26 — pre-registration uses only the in-form final CTA; no HajjStickyCta wrapper
    <HajjCampaignProvider campaign={campaign}>
      <HajjPreRegForm campaignSlug={campaign.slug} preReg={content.preReg} />
    </HajjCampaignProvider>
  );
}
