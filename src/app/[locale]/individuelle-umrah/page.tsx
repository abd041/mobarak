import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "individual");
}

export default async function IndividualUmrahPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComingSoon />;
}
