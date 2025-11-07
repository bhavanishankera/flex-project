"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useApprovedReviews } from "@/hooks/useApprovedReviews";
import {
  ListingSummary,
  NormalizedHostawayReview,
} from "@/lib/hostaway/types";

type PropertyDetailPageProps = {
  listing: ListingSummary;
  reviews: NormalizedHostawayReview[];
  allListings: ListingSummary[];
};

const formatDate = (value: string | null) => {
  if (!value) return "—";
  try {
    return format(new Date(value), "d MMM yyyy");
  } catch {
    return value;
  }
};

const ReviewCard = ({ review }: { review: NormalizedHostawayReview }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {formatDate(review.submittedAt)} • {review.channel}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">{review.guestName}</h3>
      </div>
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
        {review.rating5 ? `${review.rating5.toFixed(1)} / 5` : "Host feedback"}
      </span>
    </div>
    <p className="mt-4 text-sm leading-relaxed text-slate-700">{review.publicComment}</p>
  </article>
);

export const PropertyDetailPage = ({ listing, reviews, allListings }: PropertyDetailPageProps) => {
  const { approvedSet } = useApprovedReviews();

  const approvedReviews = reviews.filter(
    (review) => review.status === "published" && approvedSet.has(review.id),
  );

  return (
    <div className="space-y-12">
      <header className="rounded-[40px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 p-10 text-white shadow-2xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">
              Flex Living London
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {listing.listingName}
            </h1>
            <p className="mt-4 text-lg text-emerald-100">
              Contemporary serviced apartment curated for extended stays. Located minutes from local
              dining, transit links, and neighborhood highlights.
            </p>
          </div>
          <div className="flex gap-5 rounded-3xl bg-white/10 px-6 py-5 backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Guest rating</p>
              <p className="mt-2 text-4xl font-semibold">{listing.averageRating5?.toFixed(1) ?? "—"}</p>
              <p className="text-xs text-emerald-100">Out of 5</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Reviews</p>
              <p className="mt-2 text-4xl font-semibold">{listing.publishedReviews}</p>
              <p className="text-xs text-emerald-100">Published across channels</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Property highlights</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Two-minute walk to nearest Underground station</li>
            <li>• Fully-equipped kitchen and premium bedding</li>
            <li>• Weekly housekeeping and 24/7 guest support</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Guest loved</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {listing.categoryAverages.slice(0, 3).map((category) => (
              <li key={category.category} className="flex items-center justify-between capitalize">
                <span>{category.category.replace(/_/g, " ")}</span>
                <span className="font-semibold text-slate-900">{category.rating10.toFixed(1)}/10</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Stay with Flex</h2>
          <p className="mt-4 text-sm text-slate-600">
            Book direct with Flex Living to access long-stay discounts, flexible payment terms, and the
            support of our dedicated guest services team.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Check availability →
          </Link>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Guest testimonials</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              What our guests are saying
            </h2>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {approvedReviews.length > 0 ? (
            approvedReviews.map((review) => <ReviewCard key={review.id} review={review} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
              No reviews have been approved for website display yet. Visit the manager dashboard to
              curate standout guest feedback.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Explore more Flex Living stays
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {allListings
            .filter((item) => item.listingId !== listing.listingId)
            .slice(0, 3)
            .map((item) => (
              <Link
                key={item.listingId}
                href={`/properties/${item.listingId}`}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-white hover:shadow-lg"
              >
                <p className="text-xs uppercase tracking-wide text-slate-400">Flex Living</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-emerald-600">
                  {item.listingName}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Rating {item.averageRating5?.toFixed(1) ?? "—"} • {item.totalReviews} reviews
                </p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

