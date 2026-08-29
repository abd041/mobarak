import { NextResponse } from "next/server";
import type { Locale } from "@/data/mock";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import { getHajjContent, saveHajjContent } from "@/lib/hajj-content-store.server";

const LOCALES: Locale[] = ["de", "en", "ar", "bs", "tr"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = (searchParams.get("locale") ?? "de") as Locale;
  const content = await getHajjContent(locale);
  return NextResponse.json({ content, locale, locales: LOCALES });
}

export async function PUT(request: Request) {
  let body: { locale?: Locale; content?: HajjPageContent };
  try {
    body = (await request.json()) as { locale?: Locale; content?: HajjPageContent };
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const locale = body.locale ?? "de";
  if (!body.content) {
    return NextResponse.json({ error: "missing_content" }, { status: 400 });
  }

  const saved = await saveHajjContent(locale, body.content);
  return NextResponse.json({ content: saved, locale });
}
