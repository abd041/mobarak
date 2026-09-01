import { NextResponse } from "next/server";
import type { Locale } from "@/data/mock";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import {
  getHajjContentForCampaign,
  saveHajjContentForCampaign,
} from "@/lib/hajj-content-store.server";
import {
  createHajjCampaign,
  getHajjCampaign,
  listHajjCampaigns,
  saveHajjCampaignMeta,
} from "@/lib/hajj-campaign-store.server";

const LOCALES: Locale[] = ["de", "en", "ar", "bs", "tr"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = (searchParams.get("locale") ?? "de") as Locale;
  const campaign = searchParams.get("campaign") ?? "hajj-2027";

  if (searchParams.get("list") === "campaigns") {
    const campaigns = await listHajjCampaigns();
    return NextResponse.json({ campaigns });
  }

  const meta = await getHajjCampaign(campaign);
  const content = await getHajjContentForCampaign(campaign, locale);
  return NextResponse.json({ content, locale, locales: LOCALES, campaign: meta });
}

export async function PUT(request: Request) {
  let body: {
    locale?: Locale;
    content?: HajjPageContent;
    campaign?: string;
    meta?: {
      label?: string;
      status?: "draft" | "active" | "archived";
      isDefault?: boolean;
      preRegEnabled?: boolean;
      settings?: { googleReviewsEnabled?: boolean };
    };
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const campaignSlug = body.campaign ?? "hajj-2027";
  const locale = body.locale ?? "de";

  if (body.meta) {
    const existing = await getHajjCampaign(campaignSlug);
    if (!existing) {
      return NextResponse.json({ error: "campaign_not_found" }, { status: 404 });
    }
    const saved = await saveHajjCampaignMeta(campaignSlug, {
      ...body.meta,
      settings: body.meta.settings
        ? { ...existing.settings, ...body.meta.settings }
        : undefined,
    });
    return NextResponse.json({ campaign: saved });
  }

  if (!body.content) {
    return NextResponse.json({ error: "missing_content" }, { status: 400 });
  }

  const saved = await saveHajjContentForCampaign(campaignSlug, locale, body.content);
  return NextResponse.json({ content: saved, locale, campaign: campaignSlug });
}

export async function POST(request: Request) {
  let body: { year?: number; cloneFromSlug?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!body.year) {
    return NextResponse.json({ error: "missing_year" }, { status: 400 });
  }
  try {
    const campaign = await createHajjCampaign({
      year: body.year,
      cloneFromSlug: body.cloneFromSlug,
    });
    return NextResponse.json({ campaign });
  } catch (error) {
    if (error instanceof Error && error.message === "campaign_exists") {
      return NextResponse.json({ error: "campaign_exists" }, { status: 409 });
    }
    throw error;
  }
}
