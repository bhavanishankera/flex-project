import { loadHostawayReviews } from "@/lib/hostaway";
import { ReviewsDashboard } from "@/components/dashboard/ReviewsDashboard";

const shouldUseMock = process.env.NEXT_PUBLIC_HOSTAWAY_USE_MOCK !== "false";

export default async function Home() {
  const data = await loadHostawayReviews({ useMock: shouldUseMock });

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 pb-16 pt-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">
          Flex Living
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Reviews Intelligence Dashboard
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Monitor guest sentiment across OTA channels, surface actionable insights, and curate which
          stories power the Flex Living website. Use filters to slice performance by property, review
          status, or theme, then approve reviews for public display in one click.
        </p>
        {data.source === "mock" && (
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-700">
            Using mock Hostaway data – configure HOSTAWAY_API_KEY to connect to the live sandbox.
          </p>
        )}
      </header>

      <ReviewsDashboard data={data} />
    </main>
  );
}
