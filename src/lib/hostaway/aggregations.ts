import { parseISO, subDays } from "date-fns";
import {
  ListingSummary,
  NormalizedHostawayReview,
  ListingCategoryAverage,
  ListingChannelBreakdown,
  ListingReviewTypeBreakdown,
  ListingStatusBreakdown,
} from "./types";

const average = (values: number[]): number | null => {
  if (!values.length) return null;
  const sum = values.reduce((acc, value) => acc + value, 0);
  return Math.round((sum / values.length) * 10) / 10;
};

const computeCategoryAverages = (reviews: NormalizedHostawayReview[]): ListingCategoryAverage[] => {
  const categoryMap = new Map<
    string,
    {
      total10: number;
      count10: number;
      total5: number;
      count5: number;
    }
  >();

  reviews.forEach((review) => {
    review.categories.forEach((category) => {
      if (!categoryMap.has(category.category)) {
        categoryMap.set(category.category, { total10: 0, count10: 0, total5: 0, count5: 0 });
      }

      const entry = categoryMap.get(category.category)!;
      if (category.rating10 !== null) {
        entry.total10 += category.rating10;
        entry.count10 += 1;
      }
      if (category.rating5 !== null) {
        entry.total5 += category.rating5;
        entry.count5 += 1;
      }
    });
  });

  return Array.from(categoryMap.entries()).map(([category, { total10, count10, total5, count5 }]) => ({
    category,
    rating10: count10 ? Math.round((total10 / count10) * 10) / 10 : 0,
    rating5: count5 ? Math.round((total5 / count5) * 10) / 10 : 0,
  }));
};

const computeChannelBreakdown = (reviews: NormalizedHostawayReview[]): ListingChannelBreakdown[] => {
  const channelMap = new Map<string, NormalizedHostawayReview[]>();
  reviews.forEach((review) => {
    const channel = review.channel || "Unknown";
    channelMap.set(channel, [...(channelMap.get(channel) ?? []), review]);
  });

  return Array.from(channelMap.entries()).map(([channel, channelReviews]) => ({
    channel,
    count: channelReviews.length,
    averageRating5: average(channelReviews.flatMap((r) => (r.rating5 == null ? [] : [r.rating5]))),
  }));
};

const computeTypeBreakdown = (reviews: NormalizedHostawayReview[]): ListingReviewTypeBreakdown[] => {
  const typeMap = new Map<"guestToHost" | "hostToGuest", number>([
    ["guestToHost", 0],
    ["hostToGuest", 0],
  ]);

  reviews.forEach((review) => {
    typeMap.set(review.type, (typeMap.get(review.type) ?? 0) + 1);
  });

  return Array.from(typeMap.entries()).map(([type, count]) => ({
    type,
    count,
  }));
};

const computeStatusBreakdown = (reviews: NormalizedHostawayReview[]): ListingStatusBreakdown[] => {
  const statusMap = new Map<"published" | "pending" | "draft", number>([
    ["published", 0],
    ["pending", 0],
    ["draft", 0],
  ]);

  reviews.forEach((review) => {
    statusMap.set(review.status, (statusMap.get(review.status) ?? 0) + 1);
  });

  return Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
  }));
};

const computeRatingTrend = (reviews: NormalizedHostawayReview[]) => {
  const today = new Date();
  const last30Days = subDays(today, 30);
  const previous30Days = subDays(today, 60);

  const ratings = reviews
    .filter((review) => review.rating5 !== null)
    .map((review) => ({
      rating: review.rating5!,
      date: parseISO(review.submittedAt),
    }));

  const last30 = ratings.filter((entry) => entry.date >= last30Days);
  const previous30 = ratings.filter(
    (entry) => entry.date >= previous30Days && entry.date < last30Days,
  );

  return {
    last30Days: average(last30.map((entry) => entry.rating)),
    previous30Days: average(previous30.map((entry) => entry.rating)),
  };
};

export const buildListingSummary = (
  listingId: number,
  listingName: string,
  reviews: NormalizedHostawayReview[],
): ListingSummary => {
  const publishedReviews = reviews.filter((review) => review.status === "published");

  const ratings5 = reviews.flatMap((review) => (review.rating5 == null ? [] : [review.rating5]));
  const ratings10 = reviews.flatMap((review) => (review.rating10 == null ? [] : [review.rating10]));

  const sortedByDate = [...reviews].sort(
    (a, b) => parseISO(b.submittedAt).getTime() - parseISO(a.submittedAt).getTime(),
  );

  return {
    listingId,
    listingName,
    totalReviews: reviews.length,
    publishedReviews: publishedReviews.length,
    averageRating5: average(ratings5),
    averageRating10: average(ratings10),
    ratingTrend: computeRatingTrend(reviews),
    categoryAverages: computeCategoryAverages(reviews),
    channelBreakdown: computeChannelBreakdown(reviews),
    typeBreakdown: computeTypeBreakdown(reviews),
    statusBreakdown: computeStatusBreakdown(reviews),
    latestReviewDate: sortedByDate[0]?.submittedDate ?? null,
    earliestReviewDate: sortedByDate.at(-1)?.submittedDate ?? null,
  };
};

export const buildAggregations = (reviews: NormalizedHostawayReview[]) => {
  const listingMap = new Map<number, NormalizedHostawayReview[]>();

  reviews.forEach((review) => {
    listingMap.set(review.listingId, [...(listingMap.get(review.listingId) ?? []), review]);
  });

  return Array.from(listingMap.entries()).map(([listingId, listingReviews]) =>
    buildListingSummary(listingId, listingReviews[0]?.listingName ?? `Listing ${listingId}`, listingReviews),
  );
};

