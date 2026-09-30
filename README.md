# NewsFlow Web 🗞️

**Autonomous AI-powered tech news website** — the public destination for the NewsFlow agentic pipeline.

Scrapes 50-60 sources → Gemini 2.5 rewrites → publishes 24/7 to this Next.js site.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, ISR, TypeScript) |
| Styling | Tailwind CSS v4 |
| Database | Prisma 6 + SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (httpOnly cookie) |
| Fonts | Geist Sans + Newsreader (serif headlines) |

## Design System

- **Background** — Warm linen `#FBF9F5`
- **Text** — Dark charcoal `#181816`
- **Accent** — Terracotta `#C96442`
- **Vibe** — Claude-style minimalism, generous whitespace

---

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env   # then fill in your values

# Push database schema & seed
npx prisma db push
npx prisma db seed

# Development server
npm run dev            # http://localhost:3000

# Production
npm run build && npm run start
```

## Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
NEWSFLOW_API_KEY="nf_live_sec_..."       # Agent ingestion key
ADMIN_PASSWORD="your_admin_password"
ADMIN_JWT_SECRET="your_jwt_secret"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero + recent feed + trending sidebar |
| `/article/[slug]` | Full article with ads, affiliates, social share |
| `/category/[slug]` | Category hub |
| `/search` | Instant client-side search |
| `/archive` | Paginated chronological archive |
| `/about` | AI transparency manifest |
| `/admin` | JWT-protected editorial cockpit |
| `/rss.xml` | RSS 2.0 feed |
| `/sitemap.xml` | Dynamic XML sitemap |
| `/api/health` | System health check (used by pipeline) |

## API Routes

```
POST /api/articles         Publish article (x-api-key required)
GET  /api/articles         List articles (with pagination + filters)
PUT  /api/articles/:id     Update article
DELETE /api/articles/:id   Archive/delete article
GET  /api/health           Health check (returns DB stats)
POST /api/newsletter       Subscribe email
POST /api/admin/login      Get JWT session cookie
POST /api/admin/logout     Clear session
```

### Publishing an Article

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "x-api-key: nf_live_sec_9942a8b7e1034f68a" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Your Article Title",
    "summary": "Brief summary...",
    "body": "## Markdown body...",
    "category": "AI & Robotics",
    "cover_image_url": "https://...",
    "source_url": "https://original-source.com",
    "rank_score": 95,
    "is_featured": true,
    "tags": ["AI", "LLMs"]
  }'
```

---

## 24/7 Autonomous Pipeline

The Python pipeline at `../news-auto-pipeline/` publishes to this site automatically.

```bash
# In the news-auto-pipeline directory:
python run_247_pipeline.py

# Configure cycle interval (default: 1 hour):
PIPELINE_CYCLE_SECONDS=1800 python run_247_pipeline.py
```

Pipeline logs are written to `news-auto-pipeline/logs/pipeline_247.log` (14-day rotation).

---

## Admin Panel

Visit `http://localhost:3000/admin` — login with your `ADMIN_PASSWORD`.

Features:
- **Articles Vault** — view, edit, delete all articles
- **Manual Dispatch** — paste raw JSON payload and publish immediately  
- **API & Keys** — view the active API key and site URL

---

## Deployment (Production)

1. Provision a PostgreSQL database
2. Set `DATABASE_URL` to your Postgres connection string
3. Run `npx prisma migrate deploy`
4. Deploy to Vercel / Railway / VPS
5. Update `NEXT_PUBLIC_SITE_URL` and `NEWSFLOW_WEB_URL` (in the pipeline `.env`)

> **ISR**: Homepage and search pages revalidate every 60 seconds automatically.
> Article pages and category pages revalidate on each new publish via `revalidatePath()`.
