import { promises as fs } from "fs";
import path from "path";
import { buildDefaultHajjContent } from "@/data/hajj-content-defaults";
import { mergePreRegContent } from "@/data/hajj-pre-reg-content";
import { withCampaignYear } from "@/data/hajj/locales/shared";
import type { HajjPageContent } from "@/data/hajj-content-defaults";
import type { HajjCampaign, HajjCampaignsFile } from "@/data/hajj-campaign-types";
import { normalizeHajjSeoContent, type HajjSeoContentLegacy } from "@/data/hajj-seo-blocks";
import type { Locale } from "@/data/mock";

const DATA_DIR = path.join(process.cwd(), "data");
const CAMPAIGNS_FILE = path.join(DATA_DIR, "hajj-campaigns.json");
const LEGACY_CONTENT_FILE = path.join(DATA_DIR, "hajj-content.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function nowIso() {
  return new Date().toISOString();
}

function defaultCampaign(slug: string, year: number, partial?: Partial<HajjCampaign>): HajjCampaign {
  const timestamp = nowIso();
  return {
    slug,
    year,
    label: `Hajj ${year}`,
    status: "active",
    isDefault: slug === "hajj-2027",
    preRegEnabled: true,
    settings: { googleReviewsEnabled: true },
    locales: {},
    createdAt: timestamp,
    updatedAt: timestamp,
    ...partial,
  };
}

async function migrateLegacyContent(): Promise<HajjCampaignsFile | null> {
  try {
    const raw = await fs.readFile(LEGACY_CONTENT_FILE, "utf-8");
    const legacy = JSON.parse(raw) as { version?: number; locales?: Partial<Record<Locale, HajjPageContent>> };
    if (!legacy.locales) return null;
    const timestamp = nowIso();
    return {
      version: 2,
      campaigns: [
        {
          slug: "hajj-2027",
          year: 2027,
          label: "Hajj 2027",
          status: "active",
          isDefault: true,
          preRegEnabled: true,
          settings: { googleReviewsEnabled: true },
          locales: legacy.locales,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
    };
  } catch {
    return null;
  }
}

async function readCampaignsFile(): Promise<HajjCampaignsFile> {
  try {
    const raw = await fs.readFile(CAMPAIGNS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as HajjCampaignsFile;
    if (!Array.isArray(parsed.campaigns)) throw new Error("invalid campaigns file");
    return parsed;
  } catch {
    const migrated = await migrateLegacyContent();
    if (migrated) {
      await writeCampaignsFile(migrated);
      return migrated;
    }
    const initial: HajjCampaignsFile = {
      version: 2,
      campaigns: [defaultCampaign("hajj-2027", 2027)],
    };
    await writeCampaignsFile(initial);
    return initial;
  }
}

async function writeCampaignsFile(file: HajjCampaignsFile) {
  await ensureDataDir();
  await fs.writeFile(CAMPAIGNS_FILE, `${JSON.stringify(file, null, 2)}\n`, "utf-8");
}

function mergeStepsById<T extends { id: string }>(defaults: T[], patch?: T[]): T[] {
  if (!patch?.length) return defaults;
  const patchById = new Map(patch.map((step) => [step.id, step]));
  const merged = defaults.map((step) => ({ ...step, ...patchById.get(step.id) }));
  const defaultIds = new Set(defaults.map((s) => s.id));
  const extras = patch.filter((step) => !defaultIds.has(step.id));
  return [...merged, ...extras];
}

function useStoredArray<T>(stored: T[] | undefined, defaults: T[]): T[] {
  return stored?.length ? stored : defaults;
}

export function mergeHajjContent(defaults: HajjPageContent, patch: Partial<HajjPageContent>): HajjPageContent {
  return {
    hero: {
      ...defaults.hero,
      ...patch.hero,
      benefits: useStoredArray(patch.hero?.benefits, defaults.hero.benefits),
    },
    status: { ...defaults.status, ...patch.status },
    why: {
      ...defaults.why,
      ...patch.why,
      cards: useStoredArray(patch.why?.cards, defaults.why.cards),
    },
    process: {
      ...defaults.process,
      ...patch.process,
      steps: patch.process?.steps?.length
        ? patch.process.steps
        : mergeStepsById(defaults.process.steps, patch.process?.steps),
    },
    journey: {
      ...defaults.journey,
      ...patch.journey,
      steps: patch.journey?.steps?.length
        ? patch.journey.steps
        : mergeStepsById(defaults.journey.steps, patch.journey?.steps),
    },
    seo: normalizeHajjSeoContent(patch.seo as HajjSeoContentLegacy | undefined, defaults.seo),
    experience: {
      ...defaults.experience,
      ...patch.experience,
      slides: useStoredArray(patch.experience?.slides, defaults.experience.slides),
    },
    finalCta: {
      ...defaults.finalCta,
      ...patch.finalCta,
      features: useStoredArray(patch.finalCta?.features, defaults.finalCta.features),
    },
    faqs: useStoredArray(patch.faqs, defaults.faqs),
    preReg: mergePreRegContent(defaults.preReg, patch.preReg),
  };
}

export async function listHajjCampaigns(): Promise<HajjCampaign[]> {
  const file = await readCampaignsFile();
  return file.campaigns;
}

export async function listHajjCampaignSlugs(): Promise<string[]> {
  const campaigns = await listHajjCampaigns();
  return campaigns.map((c) => c.slug);
}

export async function getHajjCampaign(slug: string): Promise<HajjCampaign | undefined> {
  const file = await readCampaignsFile();
  return file.campaigns.find((c) => c.slug === slug);
}

export async function getDefaultHajjCampaign(): Promise<HajjCampaign> {
  const file = await readCampaignsFile();
  return (
    file.campaigns.find((c) => c.isDefault && c.status !== "archived") ??
    file.campaigns.find((c) => c.status === "active") ??
    file.campaigns[0]!
  );
}

function campaignYear(campaign: HajjCampaign | undefined, slug: string): number {
  if (campaign?.year) return campaign.year;
  const match = slug.match(/(\d{4})/);
  return match ? Number(match[1]) : 2027;
}

export async function getHajjContent(campaignSlug: string, locale: string): Promise<HajjPageContent> {
  const campaign = await getHajjCampaign(campaignSlug);
  const localeKey = locale as Locale;
  const year = campaignYear(campaign, campaignSlug);
  const defaults = buildDefaultHajjContent(localeKey, year);
  if (!campaign) return defaults;
  const stored = campaign.locales[localeKey];
  if (!stored) return defaults;
  return mergeHajjContent(defaults, stored);
}

export async function saveHajjContent(
  campaignSlug: string,
  locale: Locale,
  content: HajjPageContent,
): Promise<HajjPageContent> {
  const file = await readCampaignsFile();
  const index = file.campaigns.findIndex((c) => c.slug === campaignSlug);
  if (index < 0) throw new Error("campaign_not_found");

  const campaign = file.campaigns[index]!;
  const year = campaignYear(campaign, campaignSlug);
  const defaults = buildDefaultHajjContent(locale, year);
  const merged = mergeHajjContent(defaults, content);
  campaign.locales[locale] = merged;
  campaign.updatedAt = nowIso();
  file.campaigns[index] = campaign;
  await writeCampaignsFile(file);
  return merged;
}

export async function saveHajjCampaignMeta(
  slug: string,
  patch: Partial<Pick<HajjCampaign, "label" | "status" | "isDefault" | "preRegEnabled" | "settings">>,
): Promise<HajjCampaign> {
  const file = await readCampaignsFile();
  const index = file.campaigns.findIndex((c) => c.slug === slug);
  if (index < 0) throw new Error("campaign_not_found");

  const campaign = { ...file.campaigns[index]!, ...patch, updatedAt: nowIso() };

  if (patch.isDefault) {
    file.campaigns = file.campaigns.map((c) => ({
      ...c,
      isDefault: c.slug === slug,
    }));
    file.campaigns[index] = campaign;
  } else {
    file.campaigns[index] = campaign;
  }

  await writeCampaignsFile(file);
  return campaign;
}

export async function createHajjCampaign(input: {
  year: number;
  cloneFromSlug?: string;
}): Promise<HajjCampaign> {
  const file = await readCampaignsFile();
  const slug = `hajj-${input.year}`;
  if (file.campaigns.some((c) => c.slug === slug)) {
    throw new Error("campaign_exists");
  }

  let locales: Partial<Record<Locale, HajjPageContent>> = {};
  if (input.cloneFromSlug) {
    const source = file.campaigns.find((c) => c.slug === input.cloneFromSlug);
    if (source) {
      locales = structuredClone(source.locales);
      if (source.year !== input.year) {
        locales = Object.fromEntries(
          Object.entries(locales).map(([localeKey, localeContent]) => [
            localeKey,
            localeContent ? withCampaignYear(localeContent, input.year, source.year) : localeContent,
          ]),
        ) as Partial<Record<Locale, HajjPageContent>>;
      }
    }
  }

  const campaign = defaultCampaign(slug, input.year, {
    label: `Hajj ${input.year}`,
    status: "draft",
    isDefault: false,
    locales,
  });

  file.campaigns.push(campaign);
  await writeCampaignsFile(file);
  return campaign;
}
