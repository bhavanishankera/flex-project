# Flex Living Reviews Dashboard

## 1. Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router, server components) with TypeScript.
- **UI**: Tailwind CSS with a bespoke design system tailored to Flex Living’s aesthetic.
- **Data Layer**:
  - `/api/reviews/hostaway` API route that normalizes Hostaway reviews into a consistent, frontend-friendly shape.
  - Mock Hostaway dataset used when the sandbox API is empty or unavailable; the API gracefully falls back to mock data unless `mock=false`.
- **State Management**: Client-side React state/hooks. Review approval state persists in `localStorage` so dashboard actions also reflect on the property detail page.
- **Utilities**: `date-fns` for time formatting and trend windows, small hashing helper for stable listing IDs when missing.

### Data Flow
1. Server components call `loadHostawayReviews`, which tries the live Hostaway API and falls back to the mock dataset.
2. Reviews are normalized (rating scale, categories, sentiment flags) and aggregated per listing (averages, channel mix, trend windows).
3. The Manager Dashboard consumes this enriched shape for analytics + filtering.
4. The Property Detail page filters only approved + published reviews for website display.

## 2. Key Design & Logic Decisions

- **Normalization**: Ratings are converted to both 10-point and 5-point scales. Submission dates are ISO-normalized, and consistent channel/type/status enums are enforced.
- **Aggregations**: For each listing we compute totals, average scores, 30-day trend deltas, channel composition, and category averages. This enables targeted UI without extra client logic.
- **Fallback Strategy**: The API route first attempts Hostaway with provided credentials; if the sandbox returns zero reviews (expected) or an error, it automatically falls back to the mock dataset. Setting `mock=false` forces live-only mode.
- **Approval Workflow**: Simple `Approve for Website` toggle writes to `localStorage`, simulating a lightweight CMS. Property pages read the same storage, so approved quotes appear instantly.
- **UX Notes**:
  - Responsive grid layout with modern cards and pill filters.
  - Detail panel shows category breakdowns, manager responses, and deep links to the property page.
  - Property page mirrors Flex Living’s brand voice (hero banner, highlights, CTA) with curated testimonial section.

## 3. Hostaway API & Mock Behavior

- **Endpoint**: `GET /api/reviews/hostaway?limit=50&mock=true|false`
  - `mock=true` forces mock data (default when credentials are missing).
  - `limit` trims the payload for quicker demos.
- **Environment Variables**:
  - `HOSTAWAY_API_KEY`
  - `HOSTAWAY_ACCOUNT_ID`
  - `HOSTAWAY_BASE_URL` (optional, defaults to `https://api.hostaway.com/v1`)
  - `NEXT_PUBLIC_HOSTAWAY_USE_MOCK` (set to `"false"` to prefer live data in server components)
- **Live Sandbox**: Hostaway currently returns no sandbox reviews, so the mock mirrors realistic guest feedback across four London properties. The normalized response includes:
  - `reviews`: array of enriched reviews
  - `listings`: per-property roll-ups
  - `filters`: channels, statuses, types, categories
  - `totals`: overall counts, ratings, published share

## 4. Google Reviews Findings

- **Feasibility**: The Google Places API (Place Details method) exposes up to five recent Google reviews per place. Access requires billing-enabled Google Cloud project and the Places API. Reviews must be displayed in a Google-compliant UI with attribution and cannot be stored or modified beyond short caching.
- **Limitations**:
  - Only public Places (no internal property IDs) and only English review text is guaranteed.
  - Quotas and pricing apply; each Place Details request counts against daily usage.
  - Terms forbid mixing Google review content with non-Google reviews without clear differentiation, and storing reviews beyond the permitted caching window.
- **Recommendation**: If Flex Living wants Google reviews on property pages, integrate client-side (or via server proxy) with Places API, clearly label the source, and respect caching limits. Because the product already focuses on Hostaway-first data, a future enhancement could add a “Google” channel in the normalization step once compliance pieces are in place.

## 5. Local Development & Running

1. Create `.env.local` with the settings below (or rely on mock fallback):

   ```
   HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
   HOSTAWAY_ACCOUNT_ID=61148
   HOSTAWAY_BASE_URL=https://api.hostaway.com/v1
   NEXT_PUBLIC_HOSTAWAY_USE_MOCK=true
   ```
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Visit:
   - `http://localhost:3000` → Manager dashboard
   - `http://localhost:3000/properties/5501` (or any listing ID from the dataset) → Property detail with approved reviews

## 6. Next Steps & Enhancements

- Persist approvals in a backend store or Supabase so multiple managers stay in sync.
- Add charts (e.g., mini sparklines of rating over time, category heatmaps).
- Introduce sentiment analysis tagging and alerting for low scores.
- Integrate a Google Places fetcher once compliance criteria (attribution, caching rules) are signed off.

