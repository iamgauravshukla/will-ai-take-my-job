# Project Guide

## Product

AI job automation risk analyzer with:
- Job-level risk pages (SEO)
- Resume parsing (PDF/DOCX/text)
- LLM-based personalized risk analysis
- Shareable result pages

## Tech Stack

- Next.js App Router + TypeScript
- MongoDB + Mongoose
- Tailwind CSS
- Gemini + OpenAI fallback orchestration

## High-level Architecture

### Frontend routes
- `/` landing page
- `/analyze` analysis flow UI
- `/jobs` jobs index
- `/jobs/[slug]` SEO job details
- `/results/[token]` shareable analysis report

### API routes
- `POST /api/analyze`
- `GET /api/jobs`
- `GET /api/jobs/[slug]`
- `GET /api/sectors`
- `POST /api/newsletter`
- `GET /api/results/[token]`

### Backend services
- `src/backend/services/resumeParser.ts` for PDF/DOCX/text extraction
- `src/backend/services/aiOrchestrator.ts` for provider routing and JSON normalization
- `src/backend/services/riskEngine.ts` rules fallback

### Middleware/utilities
- `src/backend/middleware/rateLimit.ts` analyze endpoint rate limiting
- `src/backend/middleware/cache.ts` in-memory TTL cache for jobs listing
- `src/backend/utils/sanitize.ts` input sanitization/validation
- `middleware.ts` CSP/CORS/security headers

## Data Model Snapshot

### Job
- Core role metadata and risk score
- SEO content fields
- Task/skill sections

### Report
- Stores compact `analysisJson`
- Provider/model metadata (`llmProvider`, `llmModel`)
- Share token for public result URL

### Subscriber
- Newsletter profile and source tracking

## Programmatic SEO Pipeline

Primary script: `src/scripts/generate-100-jobs.mjs`

Flow:
1. Loads 100+ predefined role definitions.
2. Calls Gemini to generate structured SEO content.
3. Computes risk level bucket from risk score.
4. Upserts records into MongoDB by slug.

Operational notes:
- Upsert behavior makes reruns safe.
- Handle API quota by rerunning until all records are generated.

## Production Hardening (current)

- Request rate limiting on analyze API
- CORS and CSP headers via middleware
- Input sanitization helpers in API routes
- In-memory caching for low-churn endpoints

## Recommended Next Hardening Steps

1. Replace memory cache and limiter with Redis-backed store.
2. Add request logging and audit tracing.
3. Add API auth for admin/management endpoints.
4. Add Sentry or equivalent runtime error tracking.
5. Add WAF rules and bot mitigation in front of app.

## Runbook

- Install: `npm install`
- Seed baseline: `npm run seed:jobs`
- Generate SEO set: `npm run generate:seo`
- Dev: `npm run dev`
- Production build: `npm run build`
