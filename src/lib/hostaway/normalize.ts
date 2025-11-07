import { parseISO } from "date-fns";
import { stableHashToNumber } from "@/lib/utils/hash";
import {
  NormalizedHostawayReview,
  NormalizedReviewCategory,
  RawHostawayReview,
} from "./types";

const toFiveScale = (rating10: number | null | undefined): number | null => {
  if (rating10 === null || rating10 === undefined) return null;
  return Math.round((rating10 / 10) * 50) / 10;
};

const normalizeCategory = (category: RawHostawayReview["reviewCategory"][number]): NormalizedReviewCategory => {
  return {
    category: category.category,
    rating10: category.rating,
    rating5: toFiveScale(category.rating),
  };
};

export const normalizeHostawayReview = (review: RawHostawayReview): NormalizedHostawayReview => {
  const submittedDate = parseISO(review.submittedAt.replace(" ", "T"));

  const categories = review.reviewCategory.map(normalizeCategory);

  const rating10 = review.rating ?? null;
  const rating5 = toFiveScale(review.rating);

  const type = review.type === "guest-to-host" ? "guestToHost" : "hostToGuest";

  const hasPublicComment = Boolean(review.publicReview && review.publicReview.trim().length > 0);

  return {
    id: review.id,
    listingId: review.listingId ?? stableHashToNumber(review.listingName),
    listingName: review.listingName,
    guestName: review.guestName,
    type,
    status: review.status,
    submittedAt: submittedDate.toISOString(),
    submittedDate: submittedDate.toISOString().split("T")[0] ?? "",
    channel: review.channelName ?? "Unknown",
    rating5,
    rating10,
    publicComment: review.publicReview ?? null,
    privateComment: review.privateReview ?? null,
    managerResponse: review.managerResponse ?? null,
    categories,
    hasPublicComment,
    isPositive: rating5 !== null ? rating5 >= 4 : hasPublicComment,
  };
};

