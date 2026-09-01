import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { SITE_URL, localizedPath, isTripSeoIndexable } from "@/lib/seo";
import { getAllTripsFromStore } from "@/lib/trips-store.server";
import { listHajjCampaigns } from "@/lib/hajj-campaign-store.server";
import { hajjCampaignLandingPath } from "@/data/hajj-campaign-types";

const STATIC_PATHS = [
  "/",
  "/umrah-gruppenreisen",
  "/individuelle-umrah",
  "/visum-service",
  "/ueber-uns",
  "/kontakt",
  "/reisebedingungen",
  "/datenschutz",
  "/agb",
  "/impressum",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();
  const trips = await getAllTripsFromStore();
  const hajjCampaigns = (await listHajjCampaigns()).filter((c) => c.status === "active");
  const hajjPaths = hajjCampaigns.map((c) => hajjCampaignLandingPath(c.slug));

  for (const locale of locales) {
    for (const path of [...STATIC_PATHS, ...hajjPaths]) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, path)}`,
        lastModified: now,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : path.includes("umrah") || path.includes("hajj") ? 0.9 : 0.6,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [l, `${SITE_URL}${localizedPath(l, path)}`]),
            ),
            "x-default": `${SITE_URL}${localizedPath("de", path)}`,
          },
        },
      });
    }

    for (const trip of trips) {
      if (!isTripSeoIndexable(trip)) continue;
      const path = `/umrah/gruppenreise/${trip.slug}`;
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, path)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [l, `${SITE_URL}${localizedPath(l, path)}`]),
            ),
            "x-default": `${SITE_URL}${localizedPath("de", path)}`,
          },
        },
      });
    }
  }

  return entries;
}
