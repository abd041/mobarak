import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.mobarak.at";

export const SITE_NAME = "Mobarak Hajj & Umrah";

/** OG locale tags */
export const OG_LOCALE: Record<Locale, string> = {
  de: "de_AT",
  en: "en_GB",
  bs: "bs_BA",
  ar: "ar_SA",
  tr: "tr_TR",
};

/** BCP 47 content-language (Arabic explicitly ar for RTL pages). */
export const CONTENT_LANGUAGE: Record<Locale, string> = {
  de: "de-AT",
  en: "en-GB",
  bs: "bs-BA",
  ar: "ar",
  tr: "tr-TR",
};

export function localizedPath(locale: string, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

export function absoluteUrl(locale: string, path = "/"): string {
  return `${SITE_URL}${localizedPath(locale, path)}`;
}

/** hreflang map for a given path across all locales + x-default */
export function languageAlternates(path = "/"): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl("de", path);
  return languages;
}

export function isTripSeoIndexable(trip: { seoIndexable?: boolean }): boolean {
  return trip.seoIndexable !== false;
}

type BuildMetaInput = {
  locale: string;
  path?: string;
  title: string;
  description: string;
  ogImage?: string;
  /** When false, page is noindex */
  indexable?: boolean;
  type?: "website" | "article";
};

export function buildPageMetadata({
  locale,
  path = "/",
  title,
  description,
  ogImage = "/brand/hero-bg.png",
  indexable = true,
  type = "website",
}: BuildMetaInput): Metadata {
  const loc = (locale as Locale) || "de";
  const url = absoluteUrl(locale, path);
  const imageUrl = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const ogLocale = OG_LOCALE[loc] ?? "de_AT";
  const alternateLocale = locales
    .filter((l) => l !== loc)
    .map((l) => OG_LOCALE[l]);

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type,
      locale: ogLocale,
      alternateLocale,
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    other: {
      "content-language": CONTENT_LANGUAGE[loc] ?? locale,
    },
  };
}
