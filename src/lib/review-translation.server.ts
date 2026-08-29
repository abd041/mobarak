import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import {
  PLACEHOLDER_LOCALIZATIONS,
  PLACEHOLDER_REVIEW_SEEDS,
} from "@/data/google-review-placeholders";
import {
  normalizeReviewLocale,
  REVIEW_LOCALE_TO_GOOGLE,
  type ReviewLocale,
} from "@/lib/review-locales";

export type StoredGoogleReview = {
  id: string;
  name: string;
  rating: number;
  avatar?: string;
  originalText: string;
  originalDateRelative: string;
  sourceLocale?: ReviewLocale;
};

export type LocalizedGoogleReview = {
  id: string;
  name: string;
  rating: number;
  dateRelative: string;
  text: string;
  originalText: string;
  avatar?: string;
  translated: boolean;
};

const CACHE_FILE = path.join(process.cwd(), "data", "review-translation-cache.json");

type TranslationCacheFile = {
  version: 1;
  entries: Record<string, string>;
};

let memoryCache: TranslationCacheFile | null = null;

function cacheKey(text: string, locale: ReviewLocale): string {
  const hash = createHash("sha256").update(text).digest("hex").slice(0, 24);
  return `${locale}:${hash}`;
}

async function readCache(): Promise<TranslationCacheFile> {
  if (memoryCache) return memoryCache;
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw) as TranslationCacheFile;
    memoryCache =
      parsed.version === 1 && parsed.entries ? parsed : { version: 1, entries: {} };
  } catch {
    memoryCache = { version: 1, entries: {} };
  }
  return memoryCache;
}

async function writeCacheEntry(key: string, value: string) {
  const cache = await readCache();
  cache.entries[key] = value;
  await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
}

async function translateWithGoogle(
  text: string,
  targetLocale: ReviewLocale,
  sourceLocale?: ReviewLocale,
): Promise<string | null> {
  const apiKey =
    process.env.GOOGLE_TRANSLATE_API_KEY ?? process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL("https://translation.googleapis.com/language/translate/v2");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("q", text);
    url.searchParams.set("target", REVIEW_LOCALE_TO_GOOGLE[targetLocale]);
    url.searchParams.set("format", "text");
    if (sourceLocale) {
      url.searchParams.set("source", REVIEW_LOCALE_TO_GOOGLE[sourceLocale]);
    }

    const res = await fetch(url, { method: "POST", next: { revalidate: 86400 } });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      data?: { translations?: Array<{ translatedText?: string }> };
    };
    const translated = json.data?.translations?.[0]?.translatedText?.trim();
    return translated || null;
  } catch {
    return null;
  }
}

async function resolveLocalizedCopy(
  review: StoredGoogleReview,
  locale: ReviewLocale,
): Promise<{ text: string; dateRelative: string; translated: boolean }> {
  const placeholder = PLACEHOLDER_LOCALIZATIONS[review.id]?.[locale];
  if (placeholder) {
    const translated = locale !== review.sourceLocale;
    return {
      text: placeholder.text,
      dateRelative: placeholder.dateRelative,
      translated,
    };
  }

  if (locale === review.sourceLocale) {
    return {
      text: review.originalText,
      dateRelative: review.originalDateRelative,
      translated: false,
    };
  }

  const textKey = cacheKey(review.originalText, locale);
  const dateKey = cacheKey(review.originalDateRelative, locale);
  const cache = await readCache();

  let text = cache.entries[textKey];
  if (!text) {
    text =
      (await translateWithGoogle(
        review.originalText,
        locale,
        review.sourceLocale,
      )) ?? review.originalText;
    if (text !== review.originalText) {
      await writeCacheEntry(textKey, text);
    }
  }

  let dateRelative = cache.entries[dateKey];
  if (!dateRelative) {
    dateRelative =
      (await translateWithGoogle(
        review.originalDateRelative,
        locale,
        review.sourceLocale,
      )) ?? review.originalDateRelative;
    if (dateRelative !== review.originalDateRelative) {
      await writeCacheEntry(dateKey, dateRelative);
    }
  }

  const translated =
    text !== review.originalText || dateRelative !== review.originalDateRelative;

  return { text, dateRelative, translated };
}

export async function localizeGoogleReviews(
  reviews: StoredGoogleReview[],
  localeInput: string,
): Promise<LocalizedGoogleReview[]> {
  const locale = normalizeReviewLocale(localeInput);

  return Promise.all(
    reviews.map(async (review) => {
      const localized = await resolveLocalizedCopy(review, locale);
      return {
        id: review.id,
        name: review.name,
        rating: review.rating,
        avatar: review.avatar,
        originalText: review.originalText,
        text: localized.text,
        dateRelative: localized.dateRelative,
        translated: localized.translated,
      };
    }),
  );
}

export function placeholderStoredReviews(): StoredGoogleReview[] {
  return PLACEHOLDER_REVIEW_SEEDS.map((seed) => ({
    id: seed.id,
    name: seed.name,
    rating: seed.rating,
    avatar: seed.avatar,
    originalText: seed.originalText,
    originalDateRelative: seed.originalDateRelative,
    sourceLocale: seed.sourceLocale,
  }));
}
