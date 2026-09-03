/**
 * Global reusable airline catalog (Admin → Airlines).
 * Name + logo are stored once; flight offers only select an airline id.
 */
import { INDIVIDUAL_UMRAH_AIRLINES } from "@/data/individual-umrah-final";
import { newOfferEntityId } from "@/lib/individual-umrah-offer";

export type CatalogAirline = {
  id: string;
  /** Display name, e.g. "Turkish Airlines". */
  name: string;
  /** Logo path or URL, e.g. "/brand/airlines/turkish.png". */
  logo: string;
  active: boolean;
  sortOrder: number;
};

const STORAGE_KEY = "mobarak.airlinesCatalog";
export const AIRLINES_CATALOG_EVENT = "mobarak-airlines-catalog";

/** Seed matching the reusable airlines list (spec 42). */
export const SEED_AIRLINES: CatalogAirline[] = [
  {
    id: "egyptair",
    name: "Egypt Air",
    logo: "/brand/airlines/egyptair.png",
    active: true,
    sortOrder: 10,
  },
  {
    id: "pegasus",
    name: "Pegasus Airlines",
    logo: "/brand/airlines/pegasus.png",
    active: true,
    sortOrder: 20,
  },
  {
    id: "turkish",
    name: "Turkish Airlines",
    logo: "/brand/airlines/turkish.png",
    active: true,
    sortOrder: 30,
  },
  {
    id: "ajet",
    name: "A Jet",
    logo: "/brand/airlines/ajet.png",
    active: true,
    sortOrder: 40,
  },
  {
    id: "royal_jordanian",
    name: "Royal Jordanian",
    logo: "/brand/airlines/royal-jordanian.png",
    active: true,
    sortOrder: 50,
  },
  {
    id: "saudia",
    name: "Saudia Airlines",
    logo: "/brand/airlines/saudia.png",
    active: true,
    sortOrder: 60,
  },
  {
    id: "wizz_budapest",
    name: "Wizz Air ab Budapest",
    logo: "/brand/airlines/wizz.png",
    active: true,
    sortOrder: 70,
  },
];

function sortAirlines(list: CatalogAirline[]): CatalogAirline[] {
  return [...list].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "de"),
  );
}

export function normalizeCatalogAirline(
  value: Partial<CatalogAirline> & { displayName?: string },
): CatalogAirline {
  const id = (value.id ?? "").trim() || newOfferEntityId("al");
  const name = (value.name ?? value.displayName ?? "").trim() || "Airline";
  return {
    id,
    name,
    logo: (value.logo ?? "").trim(),
    active: value.active !== false,
    sortOrder: Math.max(0, Number(value.sortOrder) || 0),
  };
}

function readOverride(): CatalogAirline[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CatalogAirline>[];
    if (!Array.isArray(parsed)) return null;
    return sortAirlines(parsed.map((row) => normalizeCatalogAirline(row)));
  } catch {
    return null;
  }
}

export function writeAirlines(list: CatalogAirline[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(sortAirlines(list.map((a) => normalizeCatalogAirline(a)))),
  );
  window.dispatchEvent(new Event(AIRLINES_CATALOG_EVENT));
}

export function getAirlines(): CatalogAirline[] {
  return sortAirlines(readOverride() ?? SEED_AIRLINES.map((a) => ({ ...a })));
}

export function listActiveAirlines(): CatalogAirline[] {
  return getAirlines().filter((a) => a.active && a.name.trim());
}

export function getAirlineById(id: string | null | undefined): CatalogAirline | null {
  if (!id?.trim()) return null;
  return getAirlines().find((a) => a.id === id) ?? null;
}

export function resolveAirlineName(id: string | null | undefined): string {
  if (!id?.trim()) return "";
  const fromCatalog = getAirlineById(id);
  if (fromCatalog) return fromCatalog.name;
  const seed = INDIVIDUAL_UMRAH_AIRLINES.find((a) => a.id === id);
  return seed?.displayName ?? id;
}

export function resolveAirlineLogo(id: string | null | undefined): string {
  if (!id?.trim()) return "";
  const fromCatalog = getAirlineById(id);
  if (fromCatalog?.logo) return fromCatalog.logo;
  const seed = INDIVIDUAL_UMRAH_AIRLINES.find((a) => a.id === id);
  return seed?.logo ?? "";
}

export function createEmptyAirline(sortOrder = 100): CatalogAirline {
  return normalizeCatalogAirline({
    id: newOfferEntityId("al"),
    name: "",
    logo: "",
    active: true,
    sortOrder,
  });
}

export function resetAirlinesToSeed() {
  writeAirlines(SEED_AIRLINES.map((a) => ({ ...a })));
}
