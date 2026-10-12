# NewsFlow Web 🗞️

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Neon Postgres](https://img.shields.io/badge/Neon-Serverless_Postgres-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Vercel Deployment](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://news-flow-one.vercel.app)

**NewsFlow Web** is a high-performance, editorial-grade autonomous tech journalism platform. Powered by Next.js 16 (App Router, Turbopack, ISR) and backed by serverless Neon PostgreSQL, it serves as the public destination for the NewsFlow continuous autonomous newsroom pipeline.

🌐 **Live Production**: [news-flow-one.vercel.app](https://news-flow-one.vercel.app)  
🤖 **Pipeline Repository**: [News-flow- / news-auto-pipeline](https://github.com/harshparmar2004/News-flow-)

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Data Sources & Ingestion
        A[50+ Global RSS Feeds & HTML Sources] --> B[NewsFlow Python Pipeline Engine]
        B -->|Groq 120B / Gemini 2.5| C[AI Synthesis & Rewriting Engine]
        C -->|TypeSafe JEV System 1| D[Quality & Hallucination Triage]
    end

    subgraph Database Layer
        D -->|REST POST /api/articles| E[Neon Serverless PostgreSQL]
        E <-->|Prisma ORM| F[Next.js 16 App Router]
    end

    subgraph Client Platform
        F --> G[Desktop Reader Experience]
        F --> H[Mobile Optimized UX]
        F --> I[Admin Cockpit /admin]
        F --> J[Public Syndication /rss.xml, /llms.txt]
    end
```

---

## ✨ Core Features & Highlights

### 1. 🔴 24-Hour Live Wire ("Today's News")
* **Continuous Real-Time Coverage**: Automatically aggregates and chronologically presents all verified news published across the globe within the past 24 hours (100+ stories daily).
* **Session Expansion Persistence**: Expanding the wire (`Show all 100+ stories`) persists across article navigation via browser `sessionStorage`. When readers open an article and hit back, they return to the fully expanded wire without needing to click the button again.
* **Precision Scroll Restoration**: Every story card features unique DOM anchoring (`#article-card-${slug}`). Returning from an article automatically scrolls the user right back to the story they just read.
* **Smart In-App Back Navigation**: Built-in `<ArticleBackButton />` component leverages native browser history with fallback routing.
* **Live Beat Filtering**: Real-time category pills (`All Today`, `AI`, `Robotics`, `Startups & VC`, `Gadgets`, `Cybersecurity`, `Policy`, `Tech`) with instant count badges.

### 2. 👁️ Distraction-Free Focus Mode (Ad-Free Reading)
* One-click client toggle (`Ad-Free` vs. `Ads On`) instantly switches layout:
  * **Standard Mode**: Editorial content alongside contextual sidebars and non-intrusive sponsor slots.
  * **Focus Mode**: Expands articles into an immersive 3-column reading canvas, muting all advertisements and sponsorship blocks.

### 3. 📱 Mobile-First Architectural Polish
* **Zero Above-the-Fold Clutter**: Eliminated redundant desktop breadcrumbs, oversized category cards, and nested card borders.
* **Unboxed Article Presentation**: Native mobile full-width card layout removing cramped "box-within-a-box" padding.
* **4-Tab Thumb Navigation**: Ultra-clean bottom navigation bar:
  1. `Feed`: Smooth scroll or return to top.
  2. `Today`: Live Wire anchor with real-time pulsing beacon (`#todays-news`).
  3. `Desks`: Slide-over category sheet with quick desk access and focus mode switch.
  4. `Search`: Instant client-side search.

### 4. 🎨 Editorial Design System
* **Aesthetic**: Inspired by Claude and Linear with generous typography and whitespace.
* **Color Palette**:
  * Light Background: Warm Linen (`#FBF9F5`)
  * Dark Background: Obsidian Charcoal (`#181816`)
  * Accent: Terracotta Clay (`#C96442`)
* **Typography**: Newsreader (editorial serif headlines) paired with Geist Sans (body) and Geist Mono (metrics & timestamps).

### 5. 🛡️ Admin Cockpit (`/admin`)
* **Security**: JWT-authenticated administrative cockpit with `httpOnly` secure session cookies.
* **Articles Vault**: Complete editorial management (search, filter by desk, view count inspection, batch deletion, status toggling).
* **TypeSafe JEV System 1 Cockpit**: Live API key management, criteria testing, and validation thresholds.
* **Live Crawler & Ingestion Monitor**: Real-time pipeline dispatch trigger and source health inspection.

### 6. 🌐 Open Syndication, SEO & LLM Discovery
* **Structured Metadata**: Automated OpenGraph cards, Twitter cards, and Schema.org `NewsArticle` JSON-LD schemas.
* **Standard Feeds**: Dynamic RSS 2.0 (`/rss.xml`) and Atom (`/feed.xml`) feeds.
* **AI & Agent Ready**: Serves machine-readable `/llms.txt` and `/api/v1/ai-feed` for autonomous agents, research bots, and semantic search.

---

## 🛠️ Tech Stack Breakdown

| Layer | Technologies |
|---|---|
| **Core Framework** | Next.js 16 (App Router, Turbopack, ISR) |
| **Runtime & Language** | Node.js 20+ / TypeScript 5.0 |
| **UI Components & Styling** | React 19, Tailwind CSS v4, Lucide React Icons |
| **Typography** | Geist Sans, Geist Mono, Newsreader Serif |
| **Database & ORM** | Neon Serverless PostgreSQL, Prisma ORM 6.x |
| **Authentication** | JWT (`jose` / `bcryptjs`) with `httpOnly` Cookies |
| **Markdown Rendering** | Custom zero-dependency sanitizer & HTML converter |
| **Deployment & Hosting** | Vercel (Edge Network + Incremental Static Regeneration) |

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18.18+ or 20+
* npm or pnpm or yarn
* PostgreSQL database (Local or [Neon](https://neon.tech))

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/harshparmar2004/tech-news-website-.git
cd tech-news-website-

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Connection (Neon PostgreSQL or Local Postgres)
DATABASE_URL="postgresql://user:password@ep-sample-pooler.region.neon.tech/neondb?sslmode=require"

# Agent Ingestion Security Key
NEWSFLOW_API_KEY="nf_live_sec_your_secret_key_here"

# Admin Authentication
ADMIN_PASSWORD="your_secure_admin_password"
ADMIN_JWT_SECRET="your_strong_jwt_signing_secret"

# Public URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# TypeSafe JEV System 1 (Optional for admin triage runner)
TYPESAFE_API_KEY="apikey_your_jev_key_here"
```

### 3. Database Setup & Seeding

```bash
# Push schema directly to the database
npx prisma db push

# (Optional) Seed initial categories and editorial desks
npx prisma db seed
```

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the reader frontend.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the Admin Cockpit.

---

## 📡 REST API Reference

All ingestion endpoints require header authentication: `x-api-key: <NEWSFLOW_API_KEY>`.

### Ingest Article
```http
POST /api/articles
Content-Type: application/json
x-api-key: nf_live_sec_...
```

**Payload:**
```json
{
  "title": "Quantum Computing Startup Achieves 100-Qubit Fault Tolerance",
  "summary": "Pioneering milestone in neutral-atom quantum architectures demonstrates error suppression.",
  "body": "## Breakthrough in Neutral-Atom Arrays\n\nResearchers have achieved...",
  "category": "AI & Robotics",
  "cover_image_url": "https://images.unsplash.com/photo-...",
  "source_url": "https://example.com/original-dispatch",
  "reading_time_minutes": 4,
  "author": "NewsFlow Autonomous Desk",
  "rank_score": 94,
  "is_featured": true,
  "published_at": "2026-10-12T10:00:00Z",
  "tags": ["Quantum", "Hardware", "Frontier Tech"]
}
```

### Additional Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/articles` | Paginated article listing with filters (`limit`, `category`, `search`) | Public |
| `GET` | `/api/articles/:id` | Single article lookup by ID or slug | Public |
| `DELETE` | `/api/articles/:id` | Archive or delete article | Admin Key |
| `GET` | `/api/health` | Comprehensive database and pipeline health probe | Public |
| `GET` | `/api/v1/ai-feed` | Clean JSON feed formatted for autonomous LLM agents | Public |
| `POST` | `/api/newsletter` | Reader email subscription dispatcher | Public |
| `POST` | `/api/admin/login` | Secure administrative authentication | Public |
| `POST` | `/api/admin/logout` | Session teardown | Public |

---

## 📂 Project Directory Structure

```
newsflow-web/
├── app/
│   ├── article/[slug]/page.tsx       # Dynamic article view with progress & share
│   ├── category/[slug]/page.tsx      # Dedicated category news desk view
│   ├── admin/                        # Administrative Cockpit (JWT Protected)
│   ├── api/                          # Public & Ingestion REST API endpoints
│   ├── search/page.tsx               # Instant search engine
│   ├── archive/page.tsx              # Paginated chronological archive
│   ├── about/page.tsx                # Autonomous AI transparency manifest
│   ├── feed.xml/route.ts             # Atom feed generator
│   ├── rss.xml/route.ts              # RSS 2.0 feed generator
│   ├── llms.txt/route.ts             # Semantic AI documentation for agents
│   ├── layout.tsx                    # Root HTML shell, fonts, providers
│   └── page.tsx                      # Homepage (Server Component with ISR)
├── components/
│   ├── TodaysNewsFeature.tsx         # 24-Hour Live Wire with session persistence
│   ├── ArticleCard.tsx               # Anchor-enabled article card with image fallback
│   ├── ArticleBackButton.tsx         # History-aware smart back button
│   ├── MobileCategoryBar.tsx         # Compact swipeable category pill bar
│   ├── MobileBottomNav.tsx           # Modern 4-tab thumb navigation
│   ├── MobileDesksDrawer.tsx         # Bottom slide sheet for news desks & utilities
│   ├── CategoryDeskBanner.tsx        # Desk header banner & segmented controls
│   ├── HomeFeedClient.tsx            # Main client feed orchestrator
│   ├── LeftSidebar.tsx               # Desktop sticky editorial navigation
│   ├── RightAdsSidebar.tsx           # Monetization sidebar & slot containers
│   ├── Navbar.tsx                    # Header bar with theme toggle & search
│   └── ThemeContext.tsx              # Light / Dark mode theme provider
├── lib/
│   ├── prisma.ts                     # Prisma Client singleton
│   ├── utils.ts                      # Image optimizer, time-ago, markdown parser
│   └── imagePool.ts                  # Curated thematic cover fallbacks
├── prisma/
│   └── schema.prisma                 # Database schema models (Article, Category, etc.)
└── package.json
```

---

## 🚢 Production Deployment

### Deploy to Vercel

1. Push your changes to GitHub:
   ```bash
   git push origin main
   ```
2. Connect your GitHub repository in the [Vercel Dashboard](https://vercel.com).
3. Add the required Environment Variables (`DATABASE_URL`, `NEWSFLOW_API_KEY`, `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`).
4. Set Build Command: `npx prisma generate && next build`.
5. Deploy! Vercel handles global Edge CDN distribution and Incremental Static Regeneration (ISR).

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
