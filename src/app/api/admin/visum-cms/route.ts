import { NextResponse } from "next/server";
import type { VisumCmsConfig } from "@/data/visum-cms";
import {
  getVisumCmsServer,
  resetVisumCmsServer,
  saveVisumCmsServer,
} from "@/lib/visum-cms-store.server";

export async function GET() {
  const config = await getVisumCmsServer();
  return NextResponse.json(config, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  let body: VisumCmsConfig;
  try {
    body = (await request.json()) as VisumCmsConfig;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!body?.seo || !body?.tourist || !body?.umrah || !body?.rules) {
    return NextResponse.json({ error: "invalid_config" }, { status: 400 });
  }
  const saved = await saveVisumCmsServer(body);
  return NextResponse.json(saved);
}

export async function DELETE() {
  const config = await resetVisumCmsServer();
  return NextResponse.json(config);
}
