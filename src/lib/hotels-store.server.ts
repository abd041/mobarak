import { promises as fs } from "fs";
import path from "path";
import type { Hotel } from "@/data/mock";
import { hotels as seedHotels } from "@/data/mock";
import type { HotelCatalogFields } from "@/lib/hotel-catalog";

const DATA_DIR = path.join(process.cwd(), "data");
const HOTELS_FILE = path.join(DATA_DIR, "hotels-catalog.json");

type HotelsCatalogFile = {
  version: 1;
  overrides: Record<string, HotelCatalogFields>;
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readHotelsFile(): Promise<HotelsCatalogFile> {
  try {
    const raw = await fs.readFile(HOTELS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as HotelsCatalogFile;
    if (!parsed.overrides || typeof parsed.overrides !== "object") {
      throw new Error("invalid hotels file");
    }
    return parsed;
  } catch {
    const initial: HotelsCatalogFile = { version: 1, overrides: {} };
    await writeHotelsFile(initial);
    return initial;
  }
}

async function writeHotelsFile(file: HotelsCatalogFile) {
  await ensureDataDir();
  await fs.writeFile(HOTELS_FILE, `${JSON.stringify(file, null, 2)}\n`, "utf-8");
}

function applyCatalogFields(hotel: Hotel, fields: HotelCatalogFields): Hotel {
  const images =
    fields.image && fields.image !== hotel.images[0]?.src
      ? [
          { src: fields.image, caption: fields.name, sortOrder: 0 },
          ...hotel.images.slice(1).map((img, i) => ({ ...img, sortOrder: i + 1 })),
        ]
      : hotel.images.map((img, i) =>
          i === 0 ? { ...img, caption: fields.name, sortOrder: 0 } : { ...img, sortOrder: i },
        );

  return {
    ...hotel,
    name: fields.name,
    stars: fields.stars,
    walkingMinutes: fields.walkingMinutes,
    breakfast: fields.breakfast,
    images: images.length
      ? images
      : [{ src: fields.image || "/brand/hero-bg.png", caption: fields.name, sortOrder: 0 }],
  };
}

export async function getAllHotelsFromStore(): Promise<Hotel[]> {
  const file = await readHotelsFile();
  return seedHotels.map((hotel) => {
    const override = file.overrides[hotel.id];
    if (!override) return hotel;
    return applyCatalogFields(hotel, override);
  });
}

export async function getHotelByIdFromStore(id: string): Promise<Hotel | undefined> {
  const hotels = await getAllHotelsFromStore();
  return hotels.find((hotel) => hotel.id === id);
}

export async function saveHotelCatalogFields(
  hotelId: string,
  fields: HotelCatalogFields,
): Promise<Hotel | undefined> {
  const seed = seedHotels.find((hotel) => hotel.id === hotelId);
  if (!seed) return undefined;

  const file = await readHotelsFile();
  file.overrides[hotelId] = {
    name: fields.name.trim(),
    stars: Math.min(5, Math.max(1, Math.round(Number(fields.stars) || 1))),
    image: fields.image.trim(),
    walkingMinutes: Math.max(0, Math.round(Number(fields.walkingMinutes) || 0)),
    breakfast: Boolean(fields.breakfast),
  };
  await writeHotelsFile(file);
  return applyCatalogFields(seed, file.overrides[hotelId]);
}

/** Server-side catalog fields for admin forms (ignores browser localStorage). */
export async function getHotelCatalogFieldsFromStore(hotel: Hotel): Promise<HotelCatalogFields> {
  const file = await readHotelsFile();
  const override = file.overrides[hotel.id];
  if (override) return override;
  return {
    name: hotel.name,
    stars: hotel.stars,
    image: hotel.images[0]?.src ?? "",
    walkingMinutes: hotel.walkingMinutes,
    breakfast: hotel.breakfast,
  };
}
