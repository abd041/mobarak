import { NextResponse } from "next/server";
import type { HotelCatalogFields } from "@/lib/hotel-catalog";
import { saveHotelCatalogFields } from "@/lib/hotels-store.server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: HotelCatalogFields;
  try {
    body = (await request.json()) as HotelCatalogFields;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const hotel = await saveHotelCatalogFields(id, body);
  if (!hotel) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ hotel });
}
