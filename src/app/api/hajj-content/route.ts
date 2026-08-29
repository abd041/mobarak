import { NextResponse } from "next/server";
import { getHajjContent } from "@/lib/hajj-content-store.server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? "de";
  const content = await getHajjContent(locale);
  return NextResponse.json({ content });
}
