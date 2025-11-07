import { HostawayMockClient } from "./mockClient";
import {
  NormalizedHostawayResponse,
  NormalizedHostawayReview,
  RawHostawayReview,
} from "./types";
import { normalizeHostawayReview } from "./normalize";
import { buildAggregations } from "./aggregations";

type FetchSource = "api" | "mock";

const HOSTAWAY_BASE_URL = process.env.HOSTAWAY_BASE_URL ?? "https://api.hostaway.com/v1";

type HostawayApiReviewResponse = {
  status: string;
  result: RawHostawayReview[];
};

const fetchFromApi = async (
  accountId: number,
  apiKey: string,
  limit?: number,
): Promise<{ source: FetchSource; reviews: RawHostawayReview[]; accountId: number }> => {
  const url = new URL(`${HOSTAWAY_BASE_URL}/reviews`);
  url.searchParams.set("accountId", accountId.toString());
  url.searchParams.set("orderBy", "submittedAt");
  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Hostaway API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as HostawayApiReviewResponse;
  return {
    source: "api",
    reviews: data.result ?? [],
    accountId,
  };
};

const fetchFromMock = async (
  accountId: number,
  apiKey: string,
  limit?: number,
): Promise<{ source: FetchSource; reviews: RawHostawayReview[]; accountId: number }> => {
  const client = new HostawayMockClient(apiKey, accountId);
  const reviews = await client.fetchReviews({ limit });
  return {
    source: "mock",
    reviews,
    accountId,
  };
};

export type LoadHostawayReviewsOptions = {
  limit?: number;
  useMock?: boolean;
  apiKey?: string;
  accountId?: number;
};

export const loadHostawayReviews = async (
  options: LoadHostawayReviewsOptions = {},
): Promise<NormalizedHostawayResponse> => {
  const { limit, useMock, apiKey: apiKeyOverride, accountId: accountIdOverride } = options;

  const envApiKey = process.env.HOSTAWAY_API_KEY;
  const envAccountId = process.env.HOSTAWAY_ACCOUNT_ID;

  let apiKey = apiKeyOverride ?? envApiKey;
  let accountId: number | null = accountIdOverride ?? (envAccountId ? Number(envAccountId) : null);
  let shouldUseMock = useMock ?? false;

  if ((apiKey == null || accountId == null || Number.isNaN(accountId)) && useMock !== false) {
    apiKey = apiKey ?? "mock-hostaway-api-key";
    accountId = accountId ?? 0;
    shouldUseMock = true;
  }

  if (apiKey == null) {
    throw new Error("Hostaway API key is not configured. Set HOSTAWAY_API_KEY in your environment.");
  }

  if (accountId == null || Number.isNaN(accountId)) {
    throw new Error("Hostaway account ID is invalid. Set HOSTAWAY_ACCOUNT_ID to a numeric value.");
  }

  let reviews: RawHostawayReview[] = [];
  let source: FetchSource = "api";

  if (!shouldUseMock) {
    try {
      const apiResult = await fetchFromApi(accountId, apiKey, limit);
      reviews = apiResult.reviews;
      source = apiResult.source;
      if (reviews.length === 0 && useMock !== false) {
        const mockResult = await fetchFromMock(accountId, apiKey, limit);
        reviews = mockResult.reviews;
        source = mockResult.source;
      }
    } catch (error) {
      console.warn(
        "[hostaway] Falling back to mock reviews because API request failed:",
        error instanceof Error ? error.message : error,
      );
      const mockResult = await fetchFromMock(accountId, apiKey, limit);
      reviews = mockResult.reviews;
      source = mockResult.source;
    }
  } else {
    const mockResult = await fetchFromMock(accountId, apiKey, limit);
    reviews = mockResult.reviews;
    source = mockResult.source;
  }

  const normalizedReviews: NormalizedHostawayReview[] = reviews.map(normalizeHostawayReview);
  const listings = buildAggregations(normalizedReviews);

  const categories = new Set<string>();
  const channels = new Set<string>();
  const statuses = new Set<"published" | "pending" | "draft">();
  const types = new Set<"guestToHost" | "hostToGuest">();

  normalizedReviews.forEach((review) => {
    review.categories.forEach((category) => categories.add(category.category));
    if (review.channel) channels.add(review.channel);
    statuses.add(review.status);
    types.add(review.type);
  });

  const ratingValues = normalizedReviews
    .filter((review) => review.rating5 !== null)
    .map((review) => review.rating5 as number);

  return {
    accountId,
    source,
    generatedAt: new Date().toISOString(),
    listings,
    reviews: normalizedReviews,
    filters: {
      channels: Array.from(channels).sort(),
      categories: Array.from(categories).sort(),
      statuses: Array.from(statuses),
      types: Array.from(types),
    },
    totals: {
      totalReviews: normalizedReviews.length,
      averageRating5: ratingValues.length
        ? Math.round((ratingValues.reduce((acc, rating) => acc + rating, 0) / ratingValues.length) * 10) /
          10
        : null,
      publishedShare:
        normalizedReviews.length === 0
          ? 0
          : Math.round(
              (normalizedReviews.filter((review) => review.status === "published").length /
                normalizedReviews.length) *
                100,
            ) / 100,
    },
  };
};

