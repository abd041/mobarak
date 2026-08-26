import { setRequestLocale } from "next-intl/server";
import { UmrahListingClient } from "@/components/umrah/UmrahListingClient";

export default async function UmrahListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <UmrahListingClient />;
}
