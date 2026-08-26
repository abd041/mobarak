import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { InquiryForm } from "@/components/umrah/InquiryForm";
import { getHotel, getTrip, trips } from "@/data/mock";

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export default async function InquiryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const trip = getTrip(slug);
  if (!trip) notFound();

  return (
    <InquiryForm
      trip={trip}
      medina={getHotel(trip.medinaHotelId)}
      makkah={getHotel(trip.makkahHotelId)}
    />
  );
}
