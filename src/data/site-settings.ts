import { BRAND_LOGO } from "@/lib/brand";

export type SocialLinks = {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
};

export type FooterLink = {
  id: string;
  label: string;
  href: string;
  visible: boolean;
};

export type SiteSettings = {
  logoSrc: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  social: SocialLinks;
  services: FooterLink[];
  importantLinks: FooterLink[];
};

export const PRIVACY_LINK_ID = "privacy";

/** Privacy policy URL from admin “Wichtige Links” (Datenschutz), with fallback. */
export function resolvePrivacyPolicyHref(settings: SiteSettings): string {
  return (
    settings.importantLinks.find((l) => l.id === PRIVACY_LINK_ID)?.href ?? "/datenschutz"
  );
}

/** Defaults — override in Admin → Einstellungen (saved to localStorage for demo CMS). */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoSrc: BRAND_LOGO.src,
  tagline:
    "Seit über 30 Jahren vertrauensvoller Partner für deine spirituelle Reise. Mit Herz, Erfahrung & Kompetenz an deiner Seite.",
  phone: "+43 669 123 45 67",
  email: "info@mobarak.at",
  address: "Oberlaaerstraße 24, 1100 Wien, Österreich",
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
  },
  services: [
    {
      id: "umrah-group",
      label: "Umrah Gruppenreise",
      href: "/umrah-gruppenreisen",
      visible: true,
    },
    {
      id: "individual-umrah",
      label: "Individuelle Umrah Reise",
      href: "/individuelle-umrah",
      visible: true,
    },
    {
      id: "hajj-2027",
      label: "Hajj 2027",
      href: "/hajj-2027",
      visible: true,
    },
    {
      id: "visa",
      label: "Visum Service",
      href: "/visum-service",
      visible: true,
    },
  ],
  importantLinks: [
    { id: "about", label: "Über uns", href: "/ueber-uns", visible: true },
    {
      id: "terms",
      label: "Reisebedingungen",
      href: "/reisebedingungen",
      visible: true,
    },
    { id: "privacy", label: "Datenschutz", href: "/datenschutz", visible: true },
    { id: "agb", label: "AGB", href: "/agb", visible: true },
    { id: "imprint", label: "Impressum", href: "/impressum", visible: true },
    { id: "contact", label: "Kontakt", href: "/kontakt", visible: true },
  ],
};
