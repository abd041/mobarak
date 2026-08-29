import { googleStats } from "@/data/mock";
import {
  localizeGoogleReviews,
  placeholderStoredReviews,
  type LocalizedGoogleReview,
  type StoredGoogleReview,
} from "@/lib/review-translation.server";

export type GoogleReview = LocalizedGoogleReview;

export type GoogleReviewStats = {
  rating: number;
  count: number;
};

export type GoogleReviewsData = {
  stats: GoogleReviewStats;
  reviews: GoogleReview[];
  mapsUrl: string;
};

const CACHE_MS = 60 * 60 * 1000;
const DEFAULT_MAPS_URL = "https://www.google.com/maps";
const MAX_REVIEWS = 5;

type GooglePlaceReview = {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
  time?: number;
};

type GooglePlaceDetails = {
  rating?: number;
  user_ratings_total?: number;
  url?: string;
  reviews?: GooglePlaceReview[];
};

type BaseReviewsCache = {
  reviews: StoredGoogleReview[];
  stats: GoogleReviewStats;
  mapsUrl: string;
  at: number;
};

let baseCache: BaseReviewsCache | null = null;

function mapApiReviews(reviews: GooglePlaceReview[]): StoredGoogleReview[] {
  return reviews
    .filter((review) => review.text?.trim())
    .slice(0, MAX_REVIEWS)
    .map((review, index) => ({
      id: `google-${review.time ?? index}-${index}`,
      name: review.author_name ?? "Google-Nutzer",
      rating: review.rating ?? 5,
      originalDateRelative: review.relative_time_description ?? "",
      originalText: review.text!.trim(),
      avatar: review.profile_photo_url,
    }));
}

async function fetchBaseReviews(): Promise<Omit<BaseReviewsCache, "at">> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return {
      stats: { rating: googleStats.rating, count: googleStats.count },
      reviews: placeholderStoredReviews(),
      mapsUrl: DEFAULT_MAPS_URL,
    };
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "rating,user_ratings_total,url,reviews");
    url.searchParams.set("reviews_sort", "newest");
    url.searchParams.set("key", apiKey);

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Places API failed");

    const json = (await res.json()) as { result?: GooglePlaceDetails };
    const result = json.result;
    const count = result?.user_ratings_total;

    if (typeof count !== "number") throw new Error("Missing review count");

    const apiReviews = result?.reviews?.length ? mapApiReviews(result.reviews) : [];

    return {
      stats: {
        rating: result?.rating ?? googleStats.rating,
        count,
      },
      reviews: apiReviews.length > 0 ? apiReviews : placeholderStoredReviews(),
      mapsUrl: result?.url ?? DEFAULT_MAPS_URL,
    };
  } catch {
    return {
      stats: { rating: googleStats.rating, count: googleStats.count },
      reviews: placeholderStoredReviews(),
      mapsUrl: DEFAULT_MAPS_URL,
    };
  }
}

async function getBaseReviews(): Promise<Omit<BaseReviewsCache, "at">> {
  if (baseCache && Date.now() - baseCache.at < CACHE_MS) {
    return {
      reviews: baseCache.reviews,
      stats: baseCache.stats,
      mapsUrl: baseCache.mapsUrl,
    };
  }

  const data = await fetchBaseReviews();
  baseCache = { ...data, at: Date.now() };
  return data;
}

/** Live Google Places data localized for the active site language. */
export async function getGoogleReviewsData(locale: string): Promise<GoogleReviewsData> {
  const base = await getBaseReviews();
  const reviews = await localizeGoogleReviews(base.reviews, locale);

  return {
    stats: base.stats,
    reviews,
    mapsUrl: base.mapsUrl,
  };
}

/** @deprecated Use getGoogleReviewsData(locale) */
export async function getGoogleReviewStats(): Promise<GoogleReviewStats> {
  const data = await getGoogleReviewsData("de");
  return data.stats;
}
