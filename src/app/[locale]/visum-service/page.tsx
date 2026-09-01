import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { VisumServicePageContent } from "@/components/visum/VisumServicePageContent";
import { pickLocalized } from "@/data/visum-cms";
import { pageMetadata } from "@/lib/page-metadata";
import { buildPageMetadata } from "@/lib/seo";
import { getVisumCmsServer } from "@/lib/visum-cms-store.server";
import {
  buildVisumWebPageJsonLd,
  JsonLdScript,
} from "@/lib/visum-seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getVisumCmsServer();
  const title = pickLocalized(cms.seo.metaTitle, locale);
  const description = pickLocalized(cms.seo.metaDescription, locale);

  if (title && description) {
    return buildPageMetadata({
      locale,
      path: "/visum-service",
      title,
      description,
    });
  }

  return pageMetadata(locale, "visa");
}

export default async function VisaServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getVisumCmsServer();
  const tSeo = await getTranslations({ locale, namespace: "seo" });
  const title =
    pickLocalized(cms.seo.metaTitle, locale) || tSeo("visaTitle");
  const description =
    pickLocalized(cms.seo.metaDescription, locale) || tSeo("visaDescription");

  const webPageLd = buildVisumWebPageJsonLd({
    locale,
    title,
    description,
  });

  return (
    <>
      <JsonLdScript data={webPageLd} />
      <VisumServicePageContent locale={locale} cms={cms} />
    </>
  );
}
