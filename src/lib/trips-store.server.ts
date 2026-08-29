import { promises as fs } from "fs";
import path from "path";
import { trips as seedTrips, type UmrahTrip } from "@/data/mock";
import { normalizeTrip, sortTripsByDisplayOrder } from "@/lib/trip-normalize";

const DATA_DIR = path.join(process.cwd(), "data");
const TRIPS_FILE = path.join(DATA_DIR, "umrah-trips.json");

type TripsFile = {
  version: 1;
  trips: UmrahTrip[];
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readTripsFile(): Promise<TripsFile> {
  try {
    const raw = await fs.readFile(TRIPS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as TripsFile;
    if (!Array.isArray(parsed.trips)) throw new Error("invalid trips file");
    return parsed;
  } catch {
    const initial: TripsFile = {
      version: 1,
      trips: seedTrips.map((trip) => normalizeTrip(trip)),
    };
    await writeTripsFile(initial);
    return initial;
  }
}

async function writeTripsFile(file: TripsFile) {
  await ensureDataDir();
  await fs.writeFile(TRIPS_FILE, `${JSON.stringify(file, null, 2)}\n`, "utf-8");
}

export async function getAllTripsFromStore(): Promise<UmrahTrip[]> {
  const file = await readTripsFile();
  return sortTripsByDisplayOrder(file.trips.map(normalizeTrip));
}

export async function getTripByIdFromStore(id: string): Promise<UmrahTrip | undefined> {
  const trips = await getAllTripsFromStore();
  return trips.find((trip) => trip.id === id || trip.slug === id);
}

export async function getTripBySlugFromStore(slug: string): Promise<UmrahTrip | undefined> {
  const trips = await getAllTripsFromStore();
  return trips.find((trip) => trip.slug === slug);
}

export async function saveTripToStore(trip: UmrahTrip): Promise<UmrahTrip> {
  const file = await readTripsFile();
  const normalized = normalizeTrip(trip);
  const index = file.trips.findIndex((item) => item.id === normalized.id);

  if (index >= 0) {
    file.trips[index] = normalized;
  } else {
    file.trips.push(normalized);
  }

  await writeTripsFile(file);
  return normalized;
}

export async function deleteTripFromStore(id: string): Promise<boolean> {
  const file = await readTripsFile();
  const next = file.trips.filter((trip) => trip.id !== id);
  if (next.length === file.trips.length) return false;
  await writeTripsFile({ version: 1, trips: next });
  return true;
}

export async function reorderTripsInStore(orderedIds: string[]): Promise<UmrahTrip[]> {
  const file = await readTripsFile();
  const byId = new Map(file.trips.map((trip) => [trip.id, trip]));

  orderedIds.forEach((id, index) => {
    const trip = byId.get(id);
    if (trip) trip.displayOrder = (index + 1) * 10;
  });

  for (const trip of file.trips) {
    if (!orderedIds.includes(trip.id) && trip.displayOrder == null) {
      trip.displayOrder = (orderedIds.length + 1) * 10;
    }
  }

  await writeTripsFile(file);
  return getAllTripsFromStore();
}

export function createTripTemplate(partial?: Partial<UmrahTrip>): UmrahTrip {
  const template = seedTrips[0]!;
  const now = Date.now();
  const id = partial?.id ?? `trip-${now}`;
  const slug = partial?.slug ?? `neue-reise-${now}`;

  return normalizeTrip({
    ...template,
    ...partial,
    id,
    slug,
    displayOrder: partial?.displayOrder ?? 999,
    title: partial?.title ?? "Neue Umrah Gruppenreise",
    startDate: partial?.startDate ?? template.startDate,
    endDate: partial?.endDate ?? template.endDate,
    dateLabel: partial?.dateLabel ?? template.dateLabel,
    nights: partial?.nights ?? template.nights,
    totalCapacity: partial?.totalCapacity ?? 40,
    availableSeats: partial?.availableSeats ?? 40,
    waitlistEnabled: partial?.waitlistEnabled ?? true,
    waitlistCapacity: partial?.waitlistCapacity ?? 15,
    waitlistFull: partial?.waitlistFull ?? false,
    status: "available",
    seoIndexable: partial?.seoIndexable ?? false,
  });
}
