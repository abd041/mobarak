import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { HajjCampaignLanding } from "@/components/hajj/HajjCampaignLanding";
import { getHajjCampaign } from "@/lib/hajj-campaign-store.server";
import { pageMetadata } from "@/lib/page-metadata";

const SLUG = "hajj-2027";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "hajj", { path: `/${SLUG}` });
}

export default async function Hajj2027LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const campaign = await getHajjCampaign(SLUG);
  if (!campaign || campaign.status === "draft") notFound();
  return <HajjCampaignLanding locale={locale} campaign={campaign} />;
}
