import { NextResponse } from "next/server";
import { getAllHotelsFromStore } from "@/lib/hotels-store.server";

export async function GET() {
  const hotels = await getAllHotelsFromStore();
  return NextResponse.json({ hotels });
}
