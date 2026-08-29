import { NextResponse } from "next/server";
import type { UmrahTrip } from "@/data/mock";
import {
  deleteTripFromStore,
  getTripByIdFromStore,
  saveTripToStore,
} from "@/lib/trips-store.server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const trip = await getTripByIdFromStore(id);
  if (!trip) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ trip });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const existing = await getTripByIdFromStore(id);
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let body: Partial<UmrahTrip>;
  try {
    body = (await request.json()) as Partial<UmrahTrip>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const saved = await saveTripToStore({
    ...existing,
    ...body,
    id: existing.id,
    slug: body.slug?.trim() || existing.slug,
  });

  return NextResponse.json({ trip: saved });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = await deleteTripFromStore(id);
  if (!deleted) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
