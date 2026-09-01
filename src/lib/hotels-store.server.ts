import { promises as fs } from "fs";
import path from "path";
import type { Hotel } from "@/data/mock";
import { hotels as seedHotels } from "@/data/mock";
import {
  applyHotelCatalogFields,
  normalizeHotelCatalogFields,
  type HotelCatalogFields,
} from "@/lib/hotel-catalog";

const DATA_DIR = path.join(process.cwd(), "data");
const HOTELS_FILE = path.join(DATA_DIR, "hotels-catalog.json");

type HotelsCatalogFile = {
  version: 2;
  overrides: Record<string, HotelCatalogFields>;
  /** Hotels created in Admin (not part of the seed catalog). */
  custom: Hotel[];
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function slugifyHotelId(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || `hotel-${Date.now().toString(36)}`;
}

async function readHotelsFile(): Promise<HotelsCatalogFile> {
  try {
    const raw = await fs.readFile(HOTELS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as {
      version?: number;
      overrides?: Record<string, Partial<HotelCatalogFields> & { image?: string; breakfast?: boolean }>;
      custom?: Hotel[];
    };

    const overrides: Record<string, HotelCatalogFields> = {};
    for (const [id, value] of Object.entries(parsed.overrides ?? {})) {
      const seed = seedHotels.find((h) => h.id === id);
      overrides[id] = normalizeHotelCatalogFields(value, seed);
    }

    return {
      version: 2,
      overrides,
      custom: Array.isArray(parsed.custom) ? parsed.custom : [],
    };
  } catch {
    const initial: HotelsCatalogFile = { version: 2, overrides: {}, custom: [] };
    await writeHotelsFile(initial);
    return initial;
  }
}

async function writeHotelsFile(file: HotelsCatalogFile) {
  await ensureDataDir();
  await fs.writeFile(
    HOTELS_FILE,
    `${JSON.stringify({ version: 2, overrides: file.overrides, custom: file.custom }, null, 2)}\n`,
    "utf-8",
  );
}

function baseHotelList(file: HotelsCatalogFile): Hotel[] {
  const customIds = new Set(file.custom.map((h) => h.id));
  const seeds = seedHotels.filter((h) => !customIds.has(h.id));
  return [...seeds, ...file.custom];
}

export async function getAllHotelsFromStore(): Promise<Hotel[]> {
  const file = await readHotelsFile();
  return baseHotelList(file).map((hotel) => {
    const withDefaults: Hotel = {
      ...hotel,
      mealPlans: hotel.mealPlans?.length ? hotel.mealPlans : ["breakfast"],
      active: hotel.active ?? true,
      notes: hotel.notes ?? "",
      breakfast: hotel.breakfast ?? true,
    };
    const override = file.overrides[hotel.id];
    return override ? applyHotelCatalogFields(withDefaults, override) : withDefaults;
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
  const file = await readHotelsFile();
  const base = baseHotelList(file).find((hotel) => hotel.id === hotelId);
  if (!base) return undefined;

  const normalized = normalizeHotelCatalogFields(fields, base);
  file.overrides[hotelId] = normalized;

  // Keep custom array records in sync for fields that define the hotel itself
  const customIndex = file.custom.findIndex((h) => h.id === hotelId);
  if (customIndex >= 0) {
    file.custom[customIndex] = applyHotelCatalogFields(file.custom[customIndex]!, normalized);
  }

  await writeHotelsFile(file);
  return applyHotelCatalogFields(base, normalized);
}

export async function createHotelInStore(fields: HotelCatalogFields): Promise<Hotel> {
  const file = await readHotelsFile();
  const normalized = normalizeHotelCatalogFields(fields);
  let id = slugifyHotelId(normalized.name);
  const existingIds = new Set(baseHotelList(file).map((h) => h.id));
  if (existingIds.has(id)) {
    id = `${id}-${Date.now().toString(36)}`;
  }

  const hotel = applyHotelCatalogFields(
    {
      id,
      name: normalized.name,
      city: normalized.city,
      stars: normalized.stars,
      walkingMinutes: normalized.walkingMinutes,
      mosque: normalized.city === "medina" ? "nabawi" : "haram",
      breakfast: true,
      mealPlans: normalized.mealPlans,
      amenities: ["wifi", "ac"],
      description: normalized.description,
      notes: normalized.notes,
      active: normalized.active,
      images: [],
    },
    normalized,
  );

  file.custom.push(hotel);
  file.overrides[id] = normalized;
  await writeHotelsFile(file);
  return hotel;
}

/** Server-side catalog fields for admin forms (ignores browser localStorage). */
export async function getHotelCatalogFieldsFromStore(hotel: Hotel): Promise<HotelCatalogFields> {
  const file = await readHotelsFile();
  const override = file.overrides[hotel.id];
  if (override) return override;
  return normalizeHotelCatalogFields({}, hotel);
}
