import { promises as fs } from "fs";
import path from "path";
import {
  buildDefaultHajjContent,
  type HajjPageContent,
} from "@/data/hajj-content-defaults";
import { normalizeHajjSeoContent, type HajjSeoContentLegacy } from "@/data/hajj-seo-blocks";
import type { Locale } from "@/data/mock";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "hajj-content.json");

type HajjContentFile = {
  version: 1;
  locales: Partial<Record<Locale, HajjPageContent>>;
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readContentFile(): Promise<HajjContentFile> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf-8");
    const parsed = JSON.parse(raw) as HajjContentFile;
    if (!parsed.locales || typeof parsed.locales !== "object") {
      throw new Error("invalid hajj content file");
    }
    return parsed;
  } catch {
    const initial: HajjContentFile = {
      version: 1,
      locales: { de: buildDefaultHajjContent() },
    };
    await writeContentFile(initial);
    return initial;
  }
}

async function writeContentFile(file: HajjContentFile) {
  await ensureDataDir();
  await fs.writeFile(CONTENT_FILE, `${JSON.stringify(file, null, 2)}\n`, "utf-8");
}

export async function getHajjContent(locale: string): Promise<HajjPageContent> {
  const file = await readContentFile();
  const defaults = buildDefaultHajjContent();
  const stored =
    file.locales[locale as Locale] ??
    file.locales.de ??
    defaults;
  return mergeHajjContent(defaults, stored);
}

export async function saveHajjContent(
  locale: Locale,
  content: HajjPageContent,
): Promise<HajjPageContent> {
  const file = await readContentFile();
  const defaults = buildDefaultHajjContent();
  file.locales[locale] = mergeHajjContent(defaults, content);
  await writeContentFile(file);
  return file.locales[locale]!;
}

export async function getAllHajjContentLocales(): Promise<Partial<Record<Locale, HajjPageContent>>> {
  const file = await readContentFile();
  return file.locales;
}

function mergeStepsById<T extends { id: string }>(defaults: T[], patch?: T[]): T[] {
  if (!patch?.length) return defaults;
  const patchById = new Map(patch.map((step) => [step.id, step]));
  return defaults.map((step) => ({ ...step, ...patchById.get(step.id) }));
}

function mergeHajjContent(defaults: HajjPageContent, patch: Partial<HajjPageContent>): HajjPageContent {
  return {
    hero: { ...defaults.hero, ...patch.hero },
    status: { ...defaults.status, ...patch.status },
    why: {
      ...defaults.why,
      ...patch.why,
      cards: patch.why?.cards?.length ? patch.why.cards : defaults.why.cards,
    },
    process: {
      ...defaults.process,
      ...patch.process,
      steps: mergeStepsById(defaults.process.steps, patch.process?.steps),
    },
    journey: {
      ...defaults.journey,
      ...patch.journey,
      steps: mergeStepsById(defaults.journey.steps, patch.journey?.steps),
    },
    seo: normalizeHajjSeoContent(patch.seo as HajjSeoContentLegacy | undefined, defaults.seo),
    experience: {
      ...defaults.experience,
      ...patch.experience,
      slides: mergeStepsById(defaults.experience.slides, patch.experience?.slides),
    },
    finalCta: { ...defaults.finalCta, ...patch.finalCta },
    faqs: patch.faqs?.length ? patch.faqs : defaults.faqs,
  };
}
