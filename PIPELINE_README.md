# NewsFlow 24/7 Autonomous Runner

Runs the complete news pipeline continuously — scraping, AI rewriting, ranking, image generation,
and publishing to the NewsFlow Web site — every hour around the clock.

## Usage

```bash
# Default: run every 60 minutes
python run_247_pipeline.py

# Custom interval (e.g. every 30 minutes)
PIPELINE_CYCLE_SECONDS=1800 python run_247_pipeline.py

# Custom article count per cycle (default: 10)
MAX_ARTICLES_PER_CYCLE=15 python run_247_pipeline.py
```

Stop cleanly with `Ctrl+C` or `SIGTERM`.

## What Happens Each Cycle

1. **Scrape** — ScrapeGraphAI fetches 50-60 configured sources
2. **Deduplicate** — existing articles are filtered out
3. **Rewrite** — Gemini 2.5 rewrites scraped content into editorial articles
4. **Image Gen** — Nano Banana generates cover images
5. **App 2 Sync** — articles synced to the internal dashboard
6. **NewsFlow Web** — top N articles POSTed to `http://localhost:3000/api/articles`

## Required: NewsFlow Web Server

Make sure the web server is running before starting the pipeline:

```bash
# In the newsflow-web directory:
npm run start    # production (after npm run build)
# OR
npm run dev      # development mode
```

## Environment Variables

Add these to your `.env` file:

```env
NEWSFLOW_WEB_URL="http://localhost:3000"
NEWSFLOW_WEB_API_KEY="nf_live_sec_9942a8b7e1034f68a"
PIPELINE_CYCLE_SECONDS="3600"
MAX_ARTICLES_PER_CYCLE="10"
```

## Logs

- Console: real-time with emoji status indicators
- File: `logs/pipeline_247.log` (rotates daily, 14-day retention)

## Publish Single Article Manually

```bash
# Publish a specific article by pipeline DB id:
python -m src.publishers.web_publisher --id 42

# Publish all unposted ready articles:
python -m src.publishers.web_publisher --all

# Send a test article:
python -m src.publishers.web_publisher --test
```
