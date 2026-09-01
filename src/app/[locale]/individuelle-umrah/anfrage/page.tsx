import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { IndividualUmrahFinalPageContent } from "@/components/individual-umrah/IndividualUmrahFinalPageContent";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "individual");
}

export default async function IndividualUmrahFinalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <IndividualUmrahFinalPageContent />;
}
