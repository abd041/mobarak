import { NextResponse } from "next/server";
import {
  normalizeHotelCatalogFields,
  type HotelCatalogFields,
} from "@/lib/hotel-catalog";
import { createHotelInStore } from "@/lib/hotels-store.server";

export async function POST(request: Request) {
  let body: Partial<HotelCatalogFields> & { image?: string; breakfast?: boolean };
  try {
    body = (await request.json()) as Partial<HotelCatalogFields> & {
      image?: string;
      breakfast?: boolean;
    };
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "name_required" }, { status: 400 });
  }

  const hotel = await createHotelInStore(normalizeHotelCatalogFields(body));
  return NextResponse.json({ hotel }, { status: 201 });
}
