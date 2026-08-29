import { NextResponse } from "next/server";
import { getTripBySlugFromStore } from "@/lib/trips-store.server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const trip = await getTripBySlugFromStore(slug);
  if (!trip) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ trip });
}
