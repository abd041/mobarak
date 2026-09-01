import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { HajjCampaignLanding } from "@/components/hajj/HajjCampaignLanding";
import { getHajjCampaign, listHajjCampaignSlugs } from "@/lib/hajj-campaign-store.server";
import { pageMetadata } from "@/lib/page-metadata";

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
  return pageMetadata(locale, "hajj", { path: `/${slug}` });
}

export default async function HajjCampaignPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const campaign = await getHajjCampaign(slug);
  if (!campaign) notFound();
  return <HajjCampaignLanding locale={locale} campaign={campaign} />;
}
