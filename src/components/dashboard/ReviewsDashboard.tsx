"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  NormalizedHostawayResponse,
  NormalizedHostawayReview,
} from "@/lib/hostaway/types";
import { useApprovedReviews } from "@/hooks/useApprovedReviews";
import { format } from "date-fns";

type ReviewsDashboardProps = {
  data: NormalizedHostawayResponse;
};

type SortKey = "newest" | "oldest" | "ratingDesc" | "ratingAsc";

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Rating (high to low)", value: "ratingDesc" },
  { label: "Rating (low to high)", value: "ratingAsc" },
];

const MIN_RATING_OPTIONS = [0, 3, 3.5, 4, 4.5];

const ratingColorClass = (rating: number | null) => {
  if (rating == null) return "text-neutral-500 bg-neutral-100";
  if (rating >= 4.5) return "text-emerald-700 bg-emerald-50";
  if (rating >= 4) return "text-green-700 bg-green-50";
  if (rating >= 3.5) return "text-amber-700 bg-amber-50";
  return "text-rose-700 bg-rose-50";
};

const getTrendLabel = (last: number | null, previous: number | null) => {
  if (last == null && previous == null) return { label: "No recent data", tone: "muted" as const };
  if (last != null && previous == null)
    return { label: `Last 30 days ${last.toFixed(1)}`, tone: "positive" as const };
  if (last == null && previous != null)
    return { label: `Was ${previous.toFixed(1)} (no new reviews)`, tone: "muted" as const };

  const delta = (last ?? 0) - (previous ?? 0);
  if (delta > 0.1) return { label: `Up ${delta.toFixed(1)} pts`, tone: "positive" as const };
  if (delta < -0.1) return { label: `Down ${Math.abs(delta).toFixed(1)} pts`, tone: "negative" as const };
  return { label: "Stable vs last month", tone: "muted" as const };
};

const formatDate = (iso: string) => {
  try {
    return format(new Date(iso), "d MMM yyyy");
  } catch {
    return iso;
  }
};

const ReviewRow = ({
  review,
  isApproved,
  onToggle,
  isSelected,
  onSelect,
}: {
  review: NormalizedHostawayReview;
  isApproved: boolean;
  isSelected: boolean;
  onToggle: (id: number) => void;
  onSelect: (review: NormalizedHostawayReview) => void;
}) => (
  <div
    className={`rounded-xl border transition hover:border-emerald-400 hover:shadow-sm cursor-pointer ${
      isSelected ? "border-emerald-500 shadow-md" : "border-slate-200"
    }`}
    onClick={() => onSelect(review)}
  >
    <div className="p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{formatDate(review.submittedAt)}</span>
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-slate-400">
              {review.channel}
            </span>
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-slate-400">
              {review.type === "guestToHost" ? "Guest → Host" : "Host → Guest"}
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{review.listingName}</h3>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ratingColorClass(review.rating5)}`}>
              {review.rating5 ? `${review.rating5.toFixed(1)} / 5` : "—"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggle(review.id);
          }}
          className={`inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium transition ${
            isApproved
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
              : "border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
          }`}
        >
          {isApproved ? "Approved for Website" : "Approve for Website"}
        </button>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{review.publicComment}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>Guest: {review.guestName}</span>
        <span>Submitted: {formatDate(review.submittedAt)}</span>
        <span>Status: {review.status}</span>
      </div>
    </div>
  </div>
);

const ListingSelector = ({
  data,
  selectedListingId,
  onSelect,
}: {
  data: NormalizedHostawayResponse;
  selectedListingId: number | "all";
  onSelect: (listingId: number | "all") => void;
}) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <button
      type="button"
      onClick={() => onSelect("all")}
      className={`rounded-2xl border p-5 text-left transition ${
        selectedListingId === "all"
          ? "border-emerald-500 bg-emerald-50/40 text-emerald-700 shadow-sm"
          : "border-slate-200 bg-white hover:border-emerald-400 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Portfolio</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {data.totals.totalReviews} reviews
          </p>
        </div>
        <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-700">
          Avg {data.totals.averageRating5?.toFixed(1) ?? "—"}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Published share: {(data.totals.publishedShare * 100).toFixed(0)}%
      </p>
    </button>
    {data.listings.map((listing) => {
      const trend = getTrendLabel(listing.ratingTrend.last30Days, listing.ratingTrend.previous30Days);
      return (
        <button
          key={listing.listingId}
          type="button"
          onClick={() => onSelect(listing.listingId)}
          className={`rounded-2xl border p-5 text-left transition ${
            selectedListingId === listing.listingId
              ? "border-emerald-500 bg-emerald-50/40 text-emerald-700 shadow-sm"
              : "border-slate-200 bg-white hover:border-emerald-400 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{listing.listingName}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {listing.averageRating5?.toFixed(1) ?? "—"} / 5
              </p>
            </div>
            <div className="rounded-full bg-slate-900/5 px-3 py-1 text-sm text-slate-600">
              {listing.totalReviews} reviews
            </div>
          </div>
          <p
            className={`mt-3 text-xs ${
              trend.tone === "positive"
                ? "text-emerald-600"
                : trend.tone === "negative"
                ? "text-rose-600"
                : "text-slate-500"
            }`}
          >
            {trend.label}
          </p>
        </button>
      );
    })}
  </div>
);

const FiltersPanel = ({
  data,
  selectedChannels,
  setSelectedChannels,
  selectedStatuses,
  setSelectedStatuses,
  selectedTypes,
  setSelectedTypes,
  minRating,
  setMinRating,
  searchTerm,
  setSearchTerm,
  showApprovedOnly,
  setShowApprovedOnly,
}: {
  data: NormalizedHostawayResponse;
  selectedChannels: Set<string>;
  setSelectedChannels: (channels: Set<string>) => void;
  selectedStatuses: Set<string>;
  setSelectedStatuses: (statuses: Set<string>) => void;
  selectedTypes: Set<string>;
  setSelectedTypes: (types: Set<string>) => void;
  minRating: number;
  setMinRating: (value: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showApprovedOnly: boolean;
  setShowApprovedOnly: (value: boolean) => void;
}) => {
  const toggleSetValue = (set: Set<string>, value: string) => {
    const next = new Set(set);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    return next;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:max-w-xs">
          <label className="text-sm font-medium text-slate-600">Search</label>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search guest, comment, listing..."
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Channels</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.filters.channels.map((channel) => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => setSelectedChannels(toggleSetValue(selectedChannels, channel))}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    selectedChannels.has(channel)
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                      : "border-slate-200 text-slate-500 hover:border-emerald-300"
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Statuses</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.filters.statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatuses(toggleSetValue(selectedStatuses, status))}
                  className={`rounded-full border px-3 py-1 text-xs capitalize ${
                    selectedStatuses.has(status)
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                      : "border-slate-200 text-slate-500 hover:border-emerald-300"
                  }`}
                >
                  {status.replace(/([A-Z])/g, " $1").trim()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Types</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.filters.types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedTypes(toggleSetValue(selectedTypes, type))}
                  className={`rounded-full border px-3 py-1 text-xs capitalize ${
                    selectedTypes.has(type)
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                      : "border-slate-200 text-slate-500 hover:border-emerald-300"
                  }`}
                >
                  {type === "guestToHost" ? "Guest → Host" : "Host → Guest"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Minimum rating
          </label>
          <div className="mt-2 flex gap-2">
            {MIN_RATING_OPTIONS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMinRating(value)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  minRating === value
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                    : "border-slate-200 text-slate-500 hover:border-emerald-300"
                }`}
              >
                {value === 0 ? "Any" : `${value.toFixed(1)}+`}
              </button>
            ))}
          </div>
        </div>

        <label className="inline-flex select-none items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={showApprovedOnly}
            onChange={(event) => setShowApprovedOnly(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Show approved only
        </label>
      </div>
    </div>
  );
};

const ReviewDetailsPanel = ({
  review,
  isApproved,
  onToggle,
}: {
  review: NormalizedHostawayReview | null;
  isApproved: boolean;
  onToggle: (id: number) => void;
}) => {
  if (!review) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Select a review to see category scores and manager actions.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {review.channel} • {formatDate(review.submittedAt)}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">{review.listingName}</h3>
          <p className="mt-1 text-sm text-slate-500">Guest: {review.guestName}</p>
        </div>
        <div className="text-right">
          <p className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${ratingColorClass(review.rating5)}`}>
            {review.rating5 ? `${review.rating5.toFixed(1)} / 5` : "Not rated"}
          </p>
          <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
            Status: {review.status}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-700">{review.publicComment}</p>

      {review.categories.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Category scores</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {review.categories.map((category) => (
              <div
                key={category.category}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <span className="capitalize text-slate-600">
                  {category.category.replace(/_/g, " ")}
                </span>
                <span className="font-medium text-slate-900">
                  {category.rating10} / 10
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {review.managerResponse && (
        <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Manager response
          </p>
          <p className="mt-2 leading-relaxed">{review.managerResponse}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => onToggle(review.id)}
        className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
          isApproved
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
        }`}
      >
        {isApproved ? "Approved for Website" : "Approve this review"}
      </button>

      <Link
        href={`/properties/${review.listingId}`}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600"
      >
        View on property page →
      </Link>
    </div>
  );
};

const SummaryBar = ({ data }: { data: NormalizedHostawayResponse }) => (
  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Portfolio rating</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">
        {data.totals.averageRating5 ? `${data.totals.averageRating5.toFixed(1)} / 5` : "—"}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Across {data.listings.length} active listings and {data.totals.totalReviews} total reviews.
      </p>
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Published reviews</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">
        {(data.totals.publishedShare * 100).toFixed(0)}%
      </p>
      <p className="mt-2 text-sm text-slate-500">Reviews live on OTAs and Flex Living website.</p>
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Top feedback themes</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {data.listings
          .flatMap((listing) => listing.categoryAverages)
          .sort((a, b) => (b.rating10 ?? 0) - (a.rating10 ?? 0))
          .slice(0, 3)
          .map((category) => (
            <span
              key={category.category}
              className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium capitalize text-slate-600"
            >
              {category.category.replace(/_/g, " ")}
            </span>
          ))}
      </div>
    </div>
  </div>
);

export const ReviewsDashboard = ({ data }: ReviewsDashboardProps) => {
  const [selectedListingId, setSelectedListingId] = useState<number | "all">("all");
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const { approvedIds, isApproved, toggle } = useApprovedReviews();

  const filteredReviews = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return data.reviews.filter((review) => {
      if (selectedListingId !== "all" && review.listingId !== selectedListingId) return false;
      if (selectedChannels.size > 0 && !selectedChannels.has(review.channel)) return false;
      if (selectedStatuses.size > 0 && !selectedStatuses.has(review.status)) return false;
      if (selectedTypes.size > 0 && !selectedTypes.has(review.type)) return false;
      if (minRating > 0 && (review.rating5 ?? 0) < minRating) return false;
      if (showApprovedOnly && !approvedIds.includes(review.id)) return false;
      if (!query) return true;

      return (
        review.listingName.toLowerCase().includes(query) ||
        review.guestName.toLowerCase().includes(query) ||
        (review.publicComment ?? "").toLowerCase().includes(query)
      );
    });
  }, [
    data.reviews,
    selectedListingId,
    selectedChannels,
    selectedStatuses,
    selectedTypes,
    minRating,
    searchTerm,
    showApprovedOnly,
    approvedIds,
  ]);

  const sortedReviews = useMemo(() => {
    const reviews = [...filteredReviews];
    const compareRating = (a: NormalizedHostawayReview, b: NormalizedHostawayReview) =>
      (a.rating5 ?? -1) - (b.rating5 ?? -1);

    switch (sortKey) {
      case "oldest":
        return reviews.sort(
          (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
        );
      case "ratingDesc":
        return reviews.sort((a, b) => compareRating(b, a));
      case "ratingAsc":
        return reviews.sort((a, b) => compareRating(a, b));
      case "newest":
      default:
        return reviews.sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
        );
    }
  }, [filteredReviews, sortKey]);

  const selectedReview = sortedReviews.find((review) => review.id === selectedReviewId) ?? null;

  return (
    <div className="space-y-6">
      <SummaryBar data={data} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Listings</h2>
        </div>
        <ListingSelector
          data={data}
          selectedListingId={selectedListingId}
          onSelect={(id) => {
            setSelectedListingId(id);
            setSelectedReviewId(null);
          }}
        />
      </div>

      <FiltersPanel
        data={data}
        selectedChannels={selectedChannels}
        setSelectedChannels={setSelectedChannels}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        minRating={minRating}
        setMinRating={setMinRating}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showApprovedOnly={showApprovedOnly}
        setShowApprovedOnly={setShowApprovedOnly}
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {sortedReviews.length} of {data.reviews.length} reviews
            </p>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {sortedReviews.map((review) => (
              <ReviewRow
                key={review.id}
                review={review}
                isApproved={isApproved(review.id)}
                onToggle={toggle}
                isSelected={selectedReviewId === review.id}
                onSelect={(next) => setSelectedReviewId(next.id)}
              />
            ))}
            {sortedReviews.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                No reviews match the current filters.
              </div>
            )}
          </div>
        </div>
        <ReviewDetailsPanel
          review={selectedReview}
          isApproved={selectedReview ? isApproved(selectedReview.id) : false}
          onToggle={toggle}
        />
      </div>
    </div>
  );
};

