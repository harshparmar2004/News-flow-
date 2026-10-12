# 📰 NewsFlow — Autonomous AI News Pipeline & Agent Cockpit

[![Python Version](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-blue?style=for-the-badge&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Groq 120B](https://img.shields.io/badge/Groq-120B_GPT--OSS-F05032?style=for-the-badge&logo=groq)](https://groq.com)
[![Gemini 2.5](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![TypeSafe JEV](https://img.shields.io/badge/TypeSafe_JEV-System_1-6366F1?style=for-the-badge)](https://typesafe.ai)
[![Telegram Bot](https://img.shields.io/badge/Telegram_Bot-@Newsflow__ai__agent__bot-26A5E4?style=for-the-badge&logo=telegram)](https://t.me/Newsflow_ai_agent_bot)
[![PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech)

**NewsFlow Autonomous Pipeline** is an end-to-end autonomous intelligence engine that scrapes, triages, synthesizes, and publishes technology journalism 24/7. It aggregates breaking news from **50+ global frontier sources**, validates content using **TypeSafe JEV System 1**, rewrites stories with **Groq 120B** and **Gemini 2.5**, and publishes seamlessly to the live Next.js web application, social networks, and a remote Telegram agent.

🌐 **Live Newsroom**: [news-flow-one.vercel.app](https://news-flow-one.vercel.app)  
🖥️ **Local Control Cockpit**: `http://localhost:8000` (FastAPI Dashboard)  
🤖 **Telegram Agent Bot**: `@Newsflow_ai_agent_bot`

---

## 🏛️ Autonomous Pipeline Architecture

```mermaid
flowchart TD
    subgraph Ingestion [1. Multi-Beat Ingestion]
        S1[50+ Global RSS Feeds] --> SC[Feed & HTML Scraper]
        S2[Trafilatura & Newspaper4k] --> SC
        SC --> DEDUP{SHA-256 Deduplication}
        DEDUP -->|Already Seen| SKIP[Discard]
        DEDUP -->|New Story| SHIELD[Anti-Paywall & Cipher Shield]
    end

    subgraph Intelligence [2. AI Synthesis & Triage]
        SHIELD --> LLM[Groq 120B / Gemini 2.5 Rewriter]
        LLM --> JEV{TypeSafe JEV System 1}
        JEV -->|Fails Criteria| LOG[Reject & Log]
        JEV -->|Passes Criteria| READY[Verified Markdown Article]
    end

    subgraph Distribution [3. Multi-Destination Dispatch]
        READY --> WEB[Next.js Production API /api/articles]
        READY --> NEON[(Neon Serverless PostgreSQL)]
        READY --> TG[Telegram Bot @Newsflow_ai_agent_bot]
        READY --> REDDIT[Reddit Subreddit Communities]
        READY --> TWITTER[Twitter / X Threads]
        READY --> QUEUE[Instagram & LinkedIn Image Queues]
    end
```

---

## ✨ Key Features & Capabilities

### 1. 📡 50+ Global Frontier Sources Across 7 Beats
Aggregates continuous dispatches across 7 specialized industry news desks:
* **Artificial Intelligence**: OpenAI, DeepMind, Anthropic, Hugging Face, MIT Tech Review AI.
* **Robotics & Automation**: IEEE Spectrum, The Robot Report, Boston Dynamics dispatches.
* **Startups & Venture Capital**: TechCrunch, Silicon Canals, Sifted EU, Y Combinator News.
* **Gadgets & Hardware**: The Verge, Ars Technica, 9to5Mac, AnandTech, Tom's Hardware.
* **Cybersecurity**: Dark Reading, Bleeping Computer, Krebs on Security, The Hacker News.
* **Policy & Big Tech**: Reuters Tech, Politico Tech, Platformer.
* **General Tech & Innovation**: Wired, Engadget, VentureBeat.

### 2. 🛡️ Anti-Paywall & Cipher Detection Shield
* **Heuristic Obfuscation Detection**: Automatically identifies client-side paywall ROT/cipher scrambled text injected by subscription outlets.
* **Automatic Fallback**: Safely discards scrambled DOM bodies and falls back to clean, high-signal RSS summary dispatches, preventing corrupt text from ever reaching readers.

### 3. 🧠 Multi-LLM Journalistic Synthesis
* **Groq 120B (`openai/gpt-oss-120b`)**: Sub-second, high-throughput journalistic restructuring with structured markdown headings, executive takeaways, and industry quotes.
* **Llama 3.3 70B Versatile**: Automatic failover model ensuring 100% uptime even during upstream provider rate limits.
* **Google Gemini 2.5 Flash**: Multi-platform social copy generation and thematic cover prompt synthesis.

### 4. 🔬 TypeSafe JEV System 1 AI Triage
* Integrated with TypeSafe's System 1 API (`https://api.typesafe.ai/v1/systemone` using model `jev-latest`).
* Automatically evaluates incoming stories against strict editorial quality criteria:
  * Verifiable factual grounding & original source attribution.
  * Absence of clickbait, promotional spam, or promotional press releases.
  * Structural integrity and clean English grammar.

### 5. 💻 Local FastAPI Dashboard (`dashboard.py`)
* High-performance, dark-mode glassmorphic control center running locally at **`http://localhost:8000`**.
* **Live Telemetry**: Real-time counters for processed stories, pending queues, and active scrapers.
* **Source Health Monitor**: Visual status indicators for all 50+ configured RSS and HTML endpoints.
* **Interactive Triggers**: 1-click buttons to run pipeline cycles, clear caches, or inspect article queues.
* **Terminal Streamer**: Live WebSocket log streaming directly inside the browser.

### 6. 📱 Interactive Telegram AI Agent Bot (`@Newsflow_ai_agent_bot`)
* Dedicated remote command center for mobile administrators.
* Supported commands:
  * `/start` — Agent greeting & cockpit status summary.
  * `/status` — Live count of articles scraped, published, and pending.
  * `/health` — Diagnostics check for database, APIs, and model endpoints.
  * `/scrape` — Triggers an immediate crawler run.
  * `/post` — Broadcasts latest breaking story summary.

---

## 🚀 Setup & Launch Guide

### 1. Prerequisites
* Python 3.10, 3.11, or 3.12
* Git
* Free API keys for Google Gemini, Groq, and TypeSafe

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/harshparmar2004/News-flow-.git
cd News-flow-

# Create and activate Python virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt
playwright install chromium
```

### 3. Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux
```

Configure your `.env` parameters:

```env
# ==========================================
# 1. CORE AI SYNTHESIS ENGINES
# ==========================================
GOOGLE_API_KEY="AIzaSy..."                        # Google AI Studio
GROQ_API_KEY="gsk_..."                           # Groq Cloud API Key
TYPESAFE_API_KEY="apikey_21037fca013..."         # TypeSafe JEV System 1 Key

# ==========================================
# 2. DESTINATION WEB APPLICATION
# ==========================================
NEWSFLOW_WEB_URL="https://news-flow-one.vercel.app"  # Or http://localhost:3000
NEWSFLOW_API_KEY="nf_live_sec_..."                   # Matches Web .env

# ==========================================
# 3. DATABASE (POSTGRESQL & SQLITE)
# ==========================================
DATABASE_URL="postgresql://user:pass@ep-sample.neon.tech/neondb?sslmode=require"

# ==========================================
# 4. TELEGRAM BOT AGENT (OPTIONAL)
# ==========================================
TELEGRAM_BOT_TOKEN="8083818988:AAFx..."          # From @BotFather
TELEGRAM_CHAT_ID="your_telegram_chat_id"

# ==========================================
# 5. SOCIAL MEDIA INTEGRATIONS (OPTIONAL)
# ==========================================
REDDIT_CLIENT_ID=""
REDDIT_CLIENT_SECRET=""
REDDIT_USERNAME=""
REDDIT_PASSWORD=""
REDDIT_SUBREDDIT="technews"

TWITTER_API_KEY=""
TWITTER_API_SECRET=""
TWITTER_ACCESS_TOKEN=""
TWITTER_ACCESS_SECRET=""
```

---

## 🏃 Running the Pipeline

### Mode A: Launch the Web Dashboard (Recommended)
```bash
python dashboard.py
```
Open **`http://localhost:8000`** in your browser to inspect live stats, monitor crawler health, and manage queues.

### Mode B: Run Continuous 24/7 Autonomous Daemon
```bash
python run_247_pipeline.py
```
Runs continuously in the background, executing scheduled cycles with automatic backoff, rate limiting, and log rotation (`logs/pipeline_247.log`).

### Mode C: Launch Telegram Agent Bot
```bash
python telegram_bot.py
```
Starts polling for commands from `@Newsflow_ai_agent_bot`.

### Mode D: Single CLI Run (For Testing)
```bash
# Full test cycle across all feeds
python run.py

# Quick cycle limited to 5 articles
python run.py --max-articles 5
```

---

## 📂 Directory Structure

```
news-auto-pipeline/
├── dashboard.py                  # FastAPI Dashboard web server
├── run_247_pipeline.py           # 24/7 continuous autonomous runner
├── telegram_bot.py               # Interactive Telegram Bot agent
├── run.py                        # CLI manual execution entry point
├── config/
│   └── sources.yaml              # 50+ news sources and beat configurations
├── dashboard/                    # Glassmorphism dark-mode SPA frontend
│   ├── index.html                # Dashboard shell
│   ├── css/styles.css            # Custom CSS styles
│   └── js/                       # Modular dashboard scripts
├── src/
│   ├── scraper/
│   │   ├── feed_scraper.py       # RSS parser + anti-paywall cipher detector
│   │   ├── html_scraper.py       # Full-body article extractor
│   │   └── dedupe.py             # SHA-256 URL hashing & SQLite tracking
│   ├── ai/
│   │   ├── rewriter.py           # Groq 120B / Gemini 2.5 synthesis engine
│   │   ├── jev_triage.py         # TypeSafe JEV System 1 triage validator
│   │   └── image_gen.py          # Multimodal thumbnail prompt generator
│   ├── publishers/
│   │   ├── web_publisher.py      # Next.js REST API publisher (/api/articles)
│   │   ├── reddit_publisher.py   # Reddit PRAW publisher
│   │   ├── twitter_publisher.py  # Tweepy Twitter/X publisher
│   │   └── queue_publisher.py    # Local queue generator for Instagram/LinkedIn
│   └── orchestrator.py           # Master pipeline coordinator
├── logs/                         # Rolling operational debug logs
├── requirements.txt              # Python dependencies
└── .env.example                  # Environment configuration template
```

---

## 💰 Operational Cost Analysis

| Component | Provider | Tier / Strategy | Monthly Cost |
|---|---|---|---|
| **Web Ingestion & Feeds** | RSS / Open Feeds | Direct HTTP scraping | **$0.00** |
| **Journalistic Rewriting** | Groq (`gpt-oss-120b`) | Free Developer Tier | **$0.00** |
| **Multimodal Synthesis** | Google AI Studio | Gemini 2.5 Free Tier | **$0.00** |
| **AI Quality Triage** | TypeSafe JEV System 1 | Free Developer Plan | **$0.00** |
| **Frontend Hosting** | Vercel Edge Network | Hobby Tier | **$0.00** |
| **Database** | Neon Serverless Postgres | Free Tier (0.5 GB) | **$0.00** |
| **Remote Agent Bot** | Telegram Bot API | Free | **$0.00** |
| **Total Cost** | — | — | **$0.00 / month** |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
