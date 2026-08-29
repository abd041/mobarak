import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { OfferClient } from "@/components/umrah/OfferClient";
import { TripFlowProvider } from "@/components/umrah/TripFlowProvider";
import { TripDetailChildPrices } from "@/components/umrah/detail/TripDetailChildPrices";
import { TripDetailFaq } from "@/components/umrah/detail/TripDetailFaq";
import { TripDetailGallery } from "@/components/umrah/detail/TripDetailGallery";
import { TripDetailSectionNav } from "@/components/umrah/detail/TripDetailSectionNav";
import { TripDetailServiceDetails } from "@/components/umrah/detail/TripDetailServiceDetails";
import { TripPageShell } from "@/components/umrah/detail/TripPageShell";
import {
  TripDetailBookingCta,
  TripDetailHotels,
  TripDetailItinerary,
  TripDetailMetaBar,
  TripDetailServiceBlocks,
} from "@/components/umrah/detail/TripDetailSections";
import { TripDetailFlights } from "@/components/umrah/detail/TripDetailFlights";
import { TripOfferHero } from "@/components/umrah/detail/TripOfferHero";
import { getHotel } from "@/data/mock";
import { getHotelByIdFromStore } from "@/lib/hotels-store.server";
import { buildPageMetadata, isTripSeoIndexable } from "@/lib/seo";
import { getAllTripsFromStore, getTripBySlugFromStore } from "@/lib/trips-store.server";

export async function generateStaticParams() {
  const allTrips = await getAllTripsFromStore();
  return allTrips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const trip = await getTripBySlugFromStore(slug);
  if (!trip) return {};

  const t = await getTranslations({ locale, namespace: "seo" });
  const path = `/umrah/gruppenreise/${trip.slug}`;
  const ogImage = trip.images[0]?.src ?? "/brand/hero-bg.png";

  return buildPageMetadata({
    locale,
    path,
    title: t("tripTitle", { date: trip.dateLabel }),
    description: t("tripDescription", {
      date: trip.dateLabel,
      nights: trip.nights,
    }),
    ogImage,
    indexable: isTripSeoIndexable(trip),
  });
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const trip = await getTripBySlugFromStore(slug);
  if (!trip) notFound();

  const t = await getTranslations("umrah");
  const tCommon = await getTranslations("common");
  const medina = (await getHotelByIdFromStore(trip.medinaHotelId)) ?? getHotel(trip.medinaHotelId);
  const makkah = (await getHotelByIdFromStore(trip.makkahHotelId)) ?? getHotel(trip.makkahHotelId);

  return (
    <TripPageShell>
      <TripFlowProvider trip={trip}>
        <OfferClient trip={trip} medina={medina} makkah={makkah}>
        <TripOfferHero trip={trip} />
        <TripDetailSectionNav />

        <Container className="space-y-0">
          <TripDetailHotels
            trip={trip}
            medina={medina}
            makkah={makkah}
            locale={locale}
            t={t}
            tCommon={tCommon}
          />
          <TripDetailMetaBar trip={trip} t={t} tCommon={tCommon} />
          <div className="hidden lg:block">
            <TripDetailGallery images={trip.images} />
          </div>
          <TripDetailFlights trip={trip} />
          <TripDetailServiceBlocks trip={trip} />
          <div className="hidden lg:block">
            <TripDetailServiceDetails trip={trip} t={t} />
            <TripDetailChildPrices trip={trip} />
          </div>
          <TripDetailItinerary trip={trip} t={t} />
          <div className="hidden lg:block">
            <TripDetailFaq trip={trip} />
          </div>
          <TripDetailBookingCta trip={trip} />
        </Container>
        </OfferClient>
      </TripFlowProvider>
    </TripPageShell>
  );
}
