import type { HajjPageContent } from "@/data/hajj-content-defaults";
import type { Locale } from "@/data/mock";
import {
  createHajjCampaign,
  getDefaultHajjCampaign,
  getHajjCampaign,
  getHajjContent as getCampaignHajjContent,
  listHajjCampaigns,
  listHajjCampaignSlugs,
  mergeHajjContent,
  saveHajjCampaignMeta,
  saveHajjContent as saveCampaignHajjContent,
} from "@/lib/hajj-campaign-store.server";

const DEFAULT_CAMPAIGN_SLUG = "hajj-2027";

/** @deprecated Use getHajjContent(campaignSlug, locale) */
export async function getHajjContent(locale: string): Promise<HajjPageContent> {
  const campaign = await getDefaultHajjCampaign();
  return getCampaignHajjContent(campaign.slug, locale);
}

/** @deprecated Use saveHajjContent(campaignSlug, locale, content) */
export async function saveHajjContent(locale: Locale, content: HajjPageContent): Promise<HajjPageContent> {
  const campaign = await getDefaultHajjCampaign();
  return saveCampaignHajjContent(campaign.slug, locale, content);
}

export {
  createHajjCampaign,
  getDefaultHajjCampaign,
  getHajjCampaign,
  listHajjCampaigns,
  listHajjCampaignSlugs,
  mergeHajjContent,
  saveHajjCampaignMeta,
};

export async function getHajjContentForCampaign(
  campaignSlug: string,
  locale: string,
): Promise<HajjPageContent> {
  return getCampaignHajjContent(campaignSlug, locale);
}

export async function saveHajjContentForCampaign(
  campaignSlug: string,
  locale: Locale,
  content: HajjPageContent,
): Promise<HajjPageContent> {
  return saveCampaignHajjContent(campaignSlug, locale, content);
}

export { DEFAULT_CAMPAIGN_SLUG };
