export type RawHostawayReviewCategory = {
  category: string;
  rating: number;
};

export type RawHostawayReview = {
  id: number;
  type: "host-to-guest" | "guest-to-host";
  status: "published" | "pending" | "draft";
  rating: number | null;
  publicReview: string | null;
  privateReview?: string | null;
  reviewCategory: RawHostawayReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  listingId?: number;
  channelName?: string;
  managerResponse?: string | null;
};

export type NormalizedReviewCategory = {
  category: string;
  rating10: number;
  rating5: number | null;
};

export type NormalizedHostawayReview = {
  id: number;
  listingId: number;
  listingName: string;
  guestName: string;
  type: "guestToHost" | "hostToGuest";
  status: "published" | "pending" | "draft";
  submittedAt: string;
  submittedDate: string;
  channel: string;
  rating5: number | null;
  rating10: number | null;
  publicComment: string | null;
  privateComment: string | null;
  managerResponse: string | null;
  categories: NormalizedReviewCategory[];
  hasPublicComment: boolean;
  isPositive: boolean;
};

export type ListingCategoryAverage = {
  category: string;
  rating10: number;
  rating5: number;
};

export type ListingChannelBreakdown = {
  channel: string;
  count: number;
  averageRating5: number | null;
};

export type ListingReviewTypeBreakdown = {
  type: "guestToHost" | "hostToGuest";
  count: number;
};

export type ListingStatusBreakdown = {
  status: "published" | "pending" | "draft";
  count: number;
};

export type ListingSummary = {
  listingId: number;
  listingName: string;
  totalReviews: number;
  publishedReviews: number;
  averageRating5: number | null;
  averageRating10: number | null;
  ratingTrend: {
    last30Days: number | null;
    previous30Days: number | null;
  };
  categoryAverages: ListingCategoryAverage[];
  channelBreakdown: ListingChannelBreakdown[];
  typeBreakdown: ListingReviewTypeBreakdown[];
  statusBreakdown: ListingStatusBreakdown[];
  latestReviewDate: string | null;
  earliestReviewDate: string | null;
};

export type NormalizedHostawayResponse = {
  accountId: number | null;
  source: "api" | "mock";
  generatedAt: string;
  listings: ListingSummary[];
  reviews: NormalizedHostawayReview[];
  filters: {
    channels: string[];
    categories: string[];
    statuses: Array<"published" | "pending" | "draft">;
    types: Array<"guestToHost" | "hostToGuest">;
  };
  totals: {
    totalReviews: number;
    averageRating5: number | null;
    publishedShare: number;
  };
};

