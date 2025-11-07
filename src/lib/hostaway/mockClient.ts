import { hostawayMockReviews } from "@/data/mockHostawayReviews";
import { stableHashToNumber } from "@/lib/utils/hash";
import type { RawHostawayReview } from "./types";

type FetchReviewsOptions = {
  accountId?: number;
  limit?: number;
};

export class HostawayMockClient {
  constructor(private readonly apiKey: string, private readonly accountId: number) {}

  async fetchReviews({ limit }: FetchReviewsOptions = {}): Promise<RawHostawayReview[]> {
    const reviews = hostawayMockReviews.map((review) => ({
      ...review,
      listingId: review.listingId ?? stableHashToNumber(review.listingName),
    }));

    return limit ? reviews.slice(0, limit) : reviews;
  }
}

