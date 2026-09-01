import type { Locale } from "@/data/mock";
import type { HajjPageContent, HajjPageContentCore } from "@/data/hajj-content-defaults";
import { buildDefaultPreRegContent, DEFAULT_HAJJ_CAMPAIGN_YEAR } from "@/data/hajj-pre-reg-content";
import { buildDeHajjContent } from "@/data/hajj/locales/de";
import { buildEnHajjContent } from "@/data/hajj/locales/en";
import { buildArHajjContent } from "@/data/hajj/locales/ar";
import { buildTrHajjContent } from "@/data/hajj/locales/tr";
import { buildBsHajjContent } from "@/data/hajj/locales/bs";

const builders: Record<Locale, (year: number) => HajjPageContentCore> = {
  de: (year) => buildDeHajjContent(year),
  en: (year) => buildEnHajjContent(year),
  ar: (year) => buildArHajjContent(year),
  tr: (year) => buildTrHajjContent(year),
  bs: (year) => buildBsHajjContent(year),
};

export function buildDefaultHajjContent(locale: Locale = "de", year = DEFAULT_HAJJ_CAMPAIGN_YEAR): HajjPageContent {
  const build = builders[locale] ?? builders.de;
  return {
    ...build(year),
    preReg: buildDefaultPreRegContent(locale, year),
  };
}
