import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { HajjCampaignProvider } from "@/components/hajj/HajjCampaignProvider";
import { HajjPreRegForm } from "@/components/hajj/HajjPreRegForm";
import { getHajjCampaign } from "@/lib/hajj-campaign-store.server";
import { getHajjContentForCampaign } from "@/lib/hajj-content-store.server";
import { hajjPreRegPageMetadata } from "@/lib/page-metadata";

const SLUG = "hajj-2027";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getHajjContentForCampaign(SLUG, locale);
  return hajjPreRegPageMetadata(locale, {
    path: `/${SLUG}/vormerkung`,
    title: content.preReg.seo.title,
    description: content.preReg.seo.description,
  });
}

export default async function Hajj2027PreRegPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const campaign = await getHajjCampaign(SLUG);
  if (!campaign || campaign.status === "draft" || !campaign.preRegEnabled) {
    notFound();
  }
  const content = await getHajjContentForCampaign(SLUG, locale);

  return (
    <HajjCampaignProvider campaign={campaign}>
      <HajjPreRegForm campaignSlug={campaign.slug} preReg={content.preReg} />
    </HajjCampaignProvider>
  );
}
