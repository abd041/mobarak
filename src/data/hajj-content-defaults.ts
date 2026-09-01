import type { Locale } from "@/data/mock";
import type { HajjPreRegContent } from "@/data/hajj-pre-reg-content";
import { buildDefaultHajjContent as buildLocaleHajjContent } from "@/data/hajj/locales";
import type { HajjSeoContent } from "@/data/hajj-seo-blocks";

export type { HajjSeoBlock, HajjSeoBlockType, HajjSeoContent } from "@/data/hajj-seo-blocks";

export type HajjWhyIcon =
  | "experience"
  | "support"
  | "religious"
  | "group"
  | "onsite"
  | "languages";

export type HajjWhyCard = {
  id: string;
  icon: HajjWhyIcon;
  title: string;
  body: string;
};

export type HajjProcessStep = {
  id: string;
  num: string;
  title: string;
  short: string;
  full: string;
};

export type HajjJourneyStep = {
  id: string;
  num: string;
  title: string;
  short: string;
  full: string;
  imageSrc: string;
  modalTitle?: string;
  dayLabel?: string;
  checks?: string[];
  highlight?: boolean;
  modalNote?: string;
};

export type HajjFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type HajjExperienceSlide = {
  id: string;
  label: string;
  imageSrc: string;
};

export type { HajjPassportTypeOption } from "@/data/hajj-passport-types";
export type { HajjPreRegContent } from "@/data/hajj-pre-reg-content";

export type HajjPageContentCore = {
  hero: {
    label: string;
    title: string;
    titleLine2: string;
    body: string;
    imageSrc: string;
    benefits: string[];
    cta: string;
    ctaFree: string;
    ctaNoPay: string;
  };
  status: {
    title: string;
    body: string;
    cta: string;
    note: string;
  };
  why: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: HajjWhyCard[];
  };
  process: {
    title: string;
    steps: HajjProcessStep[];
  };
  journey: {
    eyebrow: string;
    title: string;
    logisticsNote?: string;
    steps: HajjJourneyStep[];
  };
  seo: HajjSeoContent;
  experience: {
    stat: string;
    heading: string;
    body: string;
    /** Optional section headline above the 30+ block */
    title?: string;
    slides: HajjExperienceSlide[];
  };
  finalCta: {
    title: string;
    body: string;
    imageSrc: string;
    features: string[];
    cta: string;
    ctaFree: string;
  };
  faqs: HajjFaqItem[];
};

export type HajjPageContent = HajjPageContentCore & {
  preReg: HajjPreRegContent;
};

export function buildDefaultHajjContent(locale: Locale = "de", year?: number): HajjPageContent {
  return buildLocaleHajjContent(locale, year);
}
