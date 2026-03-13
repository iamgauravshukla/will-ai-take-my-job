# Setup Guide

## 1) Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas (or local MongoDB)
- Gemini API key
- OpenAI API key (optional fallback but recommended)

## 2) Install dependencies

```bash
npm install
```

## 3) Configure environment

Create `.env.local` in project root:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4) Seed baseline jobs

```bash
npm run seed:jobs
```

This seeds the original baseline job set for quick local testing.

## 5) Generate programmatic SEO jobs (100+)

```bash
npm run generate:seo
```

What this does:
- Generates SEO-rich role content using Gemini.
- Upserts jobs into MongoDB with metadata and content sections.
- Marks generated records with `seoOptimized: true`.

## 6) Run locally

```bash
npm run dev
```

Open http://localhost:3000.

## 7) Production validation

```bash
npm run build
npm run start
```

## 8) Troubleshooting

### Build fails on environment variables
- Ensure `.env.local` exists at root.
- Verify `MONGODB_URI` and `GEMINI_API_KEY` are present.

### SEO generation partially fails
- API quota/rate limits can cause partial output.
- Re-run `npm run generate:seo`; upsert avoids duplicates.

### Analyze endpoint blocked by rate limit
- Current API limit is 3 analyze requests per IP per hour.
- For development, adjust values in `src/backend/middleware/rateLimit.ts`.

## 9) Security defaults now enabled

- Rate limiting on analyze endpoint
- Input sanitization utilities
- CSP + security headers middleware
- CORS headers
- In-memory cache for job list endpoint

For distributed production, move rate-limit/cache to Redis.
