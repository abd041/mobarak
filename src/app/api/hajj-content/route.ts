import { NextResponse } from "next/server";
import { getHajjContentForCampaign } from "@/lib/hajj-content-store.server";
import { getHajjCampaign } from "@/lib/hajj-campaign-store.server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? "de";
  const campaign = searchParams.get("campaign") ?? "hajj-2027";
  const meta = await getHajjCampaign(campaign);
  if (!meta || meta.status === "draft") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const content = await getHajjContentForCampaign(campaign, locale);
  return NextResponse.json({ content, campaign: meta });
}
