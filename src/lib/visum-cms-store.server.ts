import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_VISUM_CMS, type VisumCmsConfig } from "@/data/visum-cms";
import { mergeVisumCmsConfig } from "@/lib/visum-cms-merge";

const DATA_DIR = path.join(process.cwd(), "data");
const OVERRIDE_FILE = path.join(DATA_DIR, "visum-cms.override.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readOverrideFile(): Promise<Partial<VisumCmsConfig> | null> {
  try {
    const raw = await fs.readFile(OVERRIDE_FILE, "utf-8");
    return JSON.parse(raw) as Partial<VisumCmsConfig>;
  } catch {
    return null;
  }
}

/** Merged Visum CMS for SSR (meta + SEO section). Defaults if no override file. */
export async function getVisumCmsServer(): Promise<VisumCmsConfig> {
  const override = await readOverrideFile();
  if (!override) return DEFAULT_VISUM_CMS;
  return mergeVisumCmsConfig(override);
}

export async function saveVisumCmsServer(config: VisumCmsConfig): Promise<VisumCmsConfig> {
  const merged = mergeVisumCmsConfig(config);
  await ensureDataDir();
  await fs.writeFile(OVERRIDE_FILE, `${JSON.stringify(merged, null, 2)}\n`, "utf-8");
  return merged;
}

export async function resetVisumCmsServer(): Promise<VisumCmsConfig> {
  try {
    await fs.unlink(OVERRIDE_FILE);
  } catch {
    // ignore missing file
  }
  return DEFAULT_VISUM_CMS;
}
