import { defineRouting } from "next-intl/routing";

export const locales = ["de", "ar", "bs", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "de",
  localePrefix: "always",
});

export function isRtl(locale: string): boolean {
  return locale === "ar";
}
