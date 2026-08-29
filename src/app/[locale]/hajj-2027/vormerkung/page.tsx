import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HajjPreRegForm } from "@/components/hajj/HajjPreRegForm";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "hajjPreReg");
}

export default async function HajjPreRegPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HajjPreRegForm />;
}
