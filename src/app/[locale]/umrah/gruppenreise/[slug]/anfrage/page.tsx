import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { InquiryForm } from "@/components/umrah/InquiryForm";
import { TripFlowProvider } from "@/components/umrah/TripFlowProvider";
import { getHotel } from "@/data/mock";
import { getHotelByIdFromStore } from "@/lib/hotels-store.server";
import { pageMetadata } from "@/lib/page-metadata";
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
  return pageMetadata(locale, "inquiry", {
    path: `/umrah/gruppenreise/${slug}/anfrage`,
  });
}

export default async function InquiryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const trip = await getTripBySlugFromStore(slug);
  if (!trip) notFound();

  return (
    <TripFlowProvider trip={trip}>
      <InquiryForm
        trip={trip}
        medina={(await getHotelByIdFromStore(trip.medinaHotelId)) ?? getHotel(trip.medinaHotelId)}
        makkah={(await getHotelByIdFromStore(trip.makkahHotelId)) ?? getHotel(trip.makkahHotelId)}
      />
    </TripFlowProvider>
  );
}
