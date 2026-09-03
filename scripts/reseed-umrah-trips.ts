import { promises as fs } from "fs";
import path from "path";
import { trips } from "../src/data/mock";
import { normalizeTrip, sortTripsByDisplayOrder } from "../src/lib/trip-normalize";

async function main() {
  const out = {
    version: 1 as const,
    trips: sortTripsByDisplayOrder(trips.map((trip) => normalizeTrip(trip))),
  };
  const file = path.join(process.cwd(), "data", "umrah-trips.json");
  await fs.writeFile(file, `${JSON.stringify(out, null, 2)}\n`, "utf-8");
  console.log(`wrote ${out.trips.length} trips → ${file}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
