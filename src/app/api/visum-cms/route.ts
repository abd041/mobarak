import { NextResponse } from "next/server";
import { getVisumCmsServer } from "@/lib/visum-cms-store.server";

/** Public read of Visum Service CMS (cards + SEO). */
export async function GET() {
  const config = await getVisumCmsServer();
  return NextResponse.json(config, {
    headers: { "Cache-Control": "no-store" },
  });
}
