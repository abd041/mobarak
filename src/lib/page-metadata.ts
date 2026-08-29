import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";

type SeoKey =
  | "home"
  | "umrahList"
  | "individual"
  | "hajj"
  | "hajjPreReg"
  | "visa"
  | "about"
  | "contact"
  | "terms"
  | "privacy"
  | "agb"
  | "imprint"
  | "inquiry";

const KEY_MAP: Record<SeoKey, { title: string; description: string; path: string; indexable?: boolean }> = {
  home: { title: "homeTitle", description: "homeDescription", path: "/" },
  umrahList: {
    title: "umrahListTitle",
    description: "umrahListDescription",
    path: "/umrah-gruppenreisen",
  },
  individual: {
    title: "individualTitle",
    description: "individualDescription",
    path: "/individuelle-umrah",
  },
  hajj: { title: "hajjTitle", description: "hajjDescription", path: "/hajj-2027" },
  hajjPreReg: {
    title: "hajjPreRegTitle",
    description: "hajjPreRegDescription",
    path: "/hajj-2027/vormerkung",
    indexable: false,
  },
  visa: { title: "visaTitle", description: "visaDescription", path: "/visum-service" },
  about: { title: "aboutTitle", description: "aboutDescription", path: "/ueber-uns" },
  contact: { title: "contactTitle", description: "contactDescription", path: "/kontakt" },
  terms: { title: "termsTitle", description: "termsDescription", path: "/reisebedingungen" },
  privacy: { title: "privacyTitle", description: "privacyDescription", path: "/datenschutz" },
  agb: { title: "agbTitle", description: "agbDescription", path: "/agb" },
  imprint: { title: "imprintTitle", description: "imprintDescription", path: "/impressum" },
  inquiry: {
    title: "inquiryTitle",
    description: "inquiryDescription",
    path: "/umrah/gruppenreise",
    indexable: false,
  },
};

export async function pageMetadata(
  locale: string,
  key: SeoKey,
  overrides?: { path?: string; ogImage?: string },
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });
  const cfg = KEY_MAP[key];
  return buildPageMetadata({
    locale,
    path: overrides?.path ?? cfg.path,
    title: t(cfg.title),
    description: t(cfg.description),
    ogImage: overrides?.ogImage,
    indexable: cfg.indexable !== false,
  });
}
