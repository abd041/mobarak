import { NextResponse } from "next/server";
import { getAllTripsFromStore } from "@/lib/trips-store.server";

export async function GET() {
  const trips = await getAllTripsFromStore();
  return NextResponse.json({ trips });
}
