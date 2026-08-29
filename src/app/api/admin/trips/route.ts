import { NextResponse } from "next/server";
import {
  createTripTemplate,
  getAllTripsFromStore,
  reorderTripsInStore,
  saveTripToStore,
} from "@/lib/trips-store.server";
import type { UmrahTrip } from "@/data/mock";

export async function GET() {
  const trips = await getAllTripsFromStore();
  return NextResponse.json({ trips });
}

export async function POST(request: Request) {
  let body: Partial<UmrahTrip> | undefined;
  try {
    body = (await request.json()) as Partial<UmrahTrip>;
  } catch {
    body = undefined;
  }

  const trip = createTripTemplate(body);
  const saved = await saveTripToStore(trip);
  return NextResponse.json({ trip: saved }, { status: 201 });
}

export async function PUT(request: Request) {
  let body: { order?: string[] };
  try {
    body = (await request.json()) as { order?: string[] };
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!Array.isArray(body.order) || body.order.length === 0) {
    return NextResponse.json({ error: "invalid_order" }, { status: 400 });
  }

  const trips = await reorderTripsInStore(body.order);
  return NextResponse.json({ trips });
}
