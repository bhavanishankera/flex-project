# Deployment Guide

## Vercel Deployment

This project is ready to deploy on Vercel. Follow these steps:

### 1. Environment Variables

Configure the following environment variables in your Vercel project settings:

```
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_BASE_URL=https://api.hostaway.com/v1
NEXT_PUBLIC_HOSTAWAY_USE_MOCK=true
```

**Important Notes:**
- The Hostaway sandbox API returns no reviews, so the app automatically falls back to mock data
- Set `NEXT_PUBLIC_HOSTAWAY_USE_MOCK=false` if you want to force API-only mode (will show empty if API has no data)
- All environment variables are **optional** - the app will use mock data by default if credentials are missing

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `bhavanishankera/flex-project`
4. Add the environment variables listed above
5. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

When prompted, add the environment variables.

### 3. Verify Deployment

After deployment, test these endpoints:

- **Manager Dashboard**: `https://your-app.vercel.app/`
- **API Endpoint**: `https://your-app.vercel.app/api/reviews/hostaway`
- **Property Page**: `https://your-app.vercel.app/properties/5501`

### 4. Testing the API Route

The assessment requires testing `GET /api/reviews/hostaway`. Test it with:

```bash
curl https://your-app.vercel.app/api/reviews/hostaway?limit=10
```

Expected response structure:
```json
{
  "accountId": 61148,
  "source": "mock",
  "generatedAt": "2025-11-07T...",
  "listings": [...],
  "reviews": [...],
  "filters": {
    "channels": ["Airbnb", "Booking.com"],
    "categories": ["cleanliness", "communication", ...],
    "statuses": ["published", "pending"],
    "types": ["guestToHost", "hostToGuest"]
  },
  "totals": {
    "totalReviews": 50,
    "averageRating5": 4.7,
    "publishedShare": 0.96
  }
}
```

## Local Development

1. Clone the repository
2. Copy `env.example` to `.env.local` (optional - mock data works without it)
3. Run `npm install`
4. Run `npm run dev`
5. Visit `http://localhost:3000`

## Build Verification

Before deploying, verify the build succeeds:

```bash
npm run build
npm run start
```

## No Environment Variables Needed

The app is designed to work **out of the box** without any configuration:
- Mock data is automatically used when credentials are missing
- All features work in mock mode
- Perfect for demo/assessment purposes

Only configure environment variables if you want to test against the live Hostaway API (which currently returns no sandbox reviews).

