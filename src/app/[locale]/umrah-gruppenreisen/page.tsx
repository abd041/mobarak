import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MobarakTrustBar } from "@/components/shared/MobarakTrustBar";
import { UmrahListingClient } from "@/components/umrah/UmrahListingClient";
import { UmrahListingHero } from "@/components/umrah/UmrahListingHero";
import { UmrahListingInclusions } from "@/components/umrah/UmrahListingInclusions";
import { PERIOD_FILTER_LABEL_KEYS } from "@/lib/listing-period-filters";
import { getAllHotelsFromStore } from "@/lib/hotels-store.server";
import { pageMetadata } from "@/lib/page-metadata";
import { buildPageMetadata } from "@/lib/seo";
import { getAllTripsFromStore } from "@/lib/trips-store.server";
import {
  getListingPathWithFilter,
  parseListingPeriodFilter,
} from "@/lib/trip-listing-url";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { filter: filterParam } = await searchParams;
  const filter = parseListingPeriodFilter(filterParam);

  if (filter === "all") {
    return pageMetadata(locale, "umrahList");
  }

  const tSeo = await getTranslations({ locale, namespace: "seo" });
  const tUmrah = await getTranslations({ locale, namespace: "umrah" });
  const filterLabel = tUmrah(PERIOD_FILTER_LABEL_KEYS[filter]);

  return buildPageMetadata({
    locale,
    path: getListingPathWithFilter(filter),
    title: `${tSeo("umrahListTitle")} — ${filterLabel}`,
    description: tSeo("umrahListFilterDescription", { filter: filterLabel }),
  });
}

export default async function UmrahListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [initialTrips, initialHotels] = await Promise.all([
    getAllTripsFromStore(),
    getAllHotelsFromStore(),
  ]);
  return (
    <div className="min-w-0 max-w-full overflow-x-clip">
      <UmrahListingHero />
      <UmrahListingInclusions />
      <UmrahListingClient initialTrips={initialTrips} initialHotels={initialHotels} />
      <MobarakTrustBar variant="listing" />
    </div>
  );
}
