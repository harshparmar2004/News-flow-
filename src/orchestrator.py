"""
Orchestrator — Main pipeline coordinator with user abort support.

Runs the full news automation pipeline in sequence:
  1. Scrape articles from all configured sources
  2. Deduplicate and store in SQLite
  3. Rewrite with LLM AI (Groq/OpenAI/Claude/Gemini)
  4. Generate thumbnail images with Nano Banana / PIL
  5. Publish to Reddit, Twitter, Instagram & LinkedIn APIs
"""

import os
import sys
import time
import logging
from typing import Any
from datetime import datetime

import yaml

from src.db.models import Article, get_session, init_db
from src.scraper.feed_scraper import scrape_feed
from src.scraper.html_scraper import scrape_html
from src.scraper.ai_scraper import scrape_with_ai
from src.scraper.dedupe import dedupe_and_store
from src.ai.rewriter import rewrite_article
from src.ai.image_gen import generate_image
from src.publishers.reddit_publisher import publish_all_to_reddit
from src.publishers.twitter_publisher import publish_all_to_twitter
from src.publishers.instagram_publisher import queue_all_for_instagram
from src.publishers.linkedin_publisher import queue_all_for_linkedin

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(PROJECT_ROOT, "config", "sources.yaml")

_ABORT_REQUESTED = False


def request_abort():
    """Signals all active pipeline loops to stop immediately to save API credits."""
    global _ABORT_REQUESTED
    _ABORT_REQUESTED = True
    logger.warning("🛑 Pipeline abort requested by user! Halting pipeline execution...")


def is_abort_requested() -> bool:
    global _ABORT_REQUESTED
    return _ABORT_REQUESTED


def load_sources() -> list[dict[str, Any]]:
    """Load source configuration from YAML file."""
    if not os.path.exists(CONFIG_PATH):
        logger.error(f"Config file not found: {CONFIG_PATH}")
        sys.exit(1)

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    sources = config.get("sources", [])
    logger.info(f"Loaded {len(sources)} sources from config")
    return sources


def stage_scrape(sources: list[dict], max_articles: int | None = None) -> int:
    """Stage 1: Scrape articles sequentially across 100% of configured sources (from source #1 to #N)."""
    logger.info("=" * 60)
    logger.info(f"STAGE 1: SCRAPING ARTICLES ACROSS ALL {len(sources)} SOURCES (100% TRAVERSAL)")
    logger.info("=" * 60)

    total_new = 0
    total_scraped = 0

    for idx, source in enumerate(sources, 1):
        if is_abort_requested():
            logger.warning(f"Stage 1 aborted by user at source {idx}/{len(sources)}.")
            break

        name = source.get("name", "Unknown")
        tier = source.get("tier", 1)

        source_config = dict(source)
        if max_articles is not None:
            source_config["max_articles"] = min(source.get("max_articles", 5), max_articles)

        logger.info(f"[{idx}/{len(sources)}] Checking source: {name} (Tier {tier})...")

        try:
            if tier == 1:
                articles = scrape_feed(source_config)
            elif tier == 2:
                articles = scrape_with_ai(source_config)
            else:
                articles = scrape_html(source_config)

            total_scraped += len(articles)
            if articles:
                new_count = dedupe_and_store(articles)
                total_new += new_count
                logger.info(f" ✓ [{idx}/{len(sources)}] {name}: {len(articles)} scraped, {new_count} new stored")
            else:
                logger.info(f" ⚠️ [{idx}/{len(sources)}] {name}: 0 articles extracted")

        except Exception as e:
            logger.error(f" ❌ [{idx}/{len(sources)}] Error scraping {name}: {e}")

    logger.info(f"Stage 1 complete: Processed {len(sources)} sources | {total_scraped} total items scraped | {total_new} new stored")
    return total_new


def stage_rank(max_articles: int | None = None) -> int:
    """Stage 2: AI Agent News Ranking & Scoring (1-100)."""
    logger.info("=" * 60)
    logger.info("STAGE 2: AI AGENT NEWS RANKING & FILTERING (1-100)")
    logger.info("=" * 60)

    from src.ai.ranker import rank_article

    with get_session() as session:
        articles = session.query(Article).all()
        article_ids = [a.id for a in articles]

    if max_articles is not None:
        article_ids = article_ids[:max_articles]

    logger.info(f"Ranking {len(article_ids)} articles using AI Ranking Prompt...")
    ranked_count = 0

    for aid in article_ids:
        if is_abort_requested():
            logger.warning("Stage 2 AI Ranking aborted by user.")
            break

        try:
            if rank_article(aid):
                ranked_count += 1
        except Exception as e:
            logger.error(f"Failed to rank article #{aid}: {e}")

    logger.info(f"Stage 2 complete: {ranked_count}/{len(article_ids)} articles ranked with scores 1-100")
    return ranked_count


def stage_rewrite(top_n: int | None = 10) -> int:
    """Stage 3: AI Refines & Rewrites strictly the Top 10 Ranked Stories for Studio."""
    limit_val = top_n if (top_n is not None and top_n > 0) else 10
    logger.info("=" * 60)
    logger.info(f"STAGE 3: AI REFINING TOP {limit_val} RANKED STORIES FOR NANO BANANA STUDIO")
    logger.info("=" * 60)

    with get_session() as session:
        articles = session.query(Article).order_by(Article.rank_score.desc()).limit(limit_val).all()
        article_ids = [a.id for a in articles]

    logger.info(f"Found {len(article_ids)} Top Ranked articles for AI refinement & contextualization")
    rewritten_count = 0

    for aid in article_ids:
        if is_abort_requested():
            logger.warning("Stage 3 AI Rewrite aborted by user.")
            break

        try:
            if rewrite_article(aid):
                rewritten_count += 1
                logger.info(f" ✓ Refined Top story #{aid}")
        except Exception as e:
            logger.error(f"Failed to rewrite article #{aid}: {e}")

    logger.info(f"Stage 3 complete: {rewritten_count}/{len(article_ids)} Top stories refined")
    return rewritten_count


def stage_image_gen(top_n: int | None = 10) -> int:
    """Stage 4: Generate Nano Banana 4-slide catalog decks strictly for the Top 10 Refined Stories."""
    limit_val = top_n if (top_n is not None and top_n > 0) else 10
    logger.info("=" * 60)
    logger.info(f"STAGE 4: NANO BANANA STUDIO IMAGE & 4-SLIDE DECK GENERATION (TOP {limit_val})")
    logger.info("=" * 60)

    with get_session() as session:
        articles = session.query(Article).order_by(Article.rank_score.desc()).limit(limit_val).all()
        article_ids = [a.id for a in articles]

    logger.info(f"Found {len(article_ids)} Top stories needing Nano Banana visual slide decks")
    image_count = 0

    for aid in article_ids:
        if is_abort_requested():
            logger.warning("Stage 4 Image Gen aborted by user.")
            break

        try:
            if generate_image(aid):
                image_count += 1
                logger.info(f" ✓ Generated Nano Banana 4-slide deck for Top story #{aid}")
        except Exception as e:
            logger.error(f"Failed image gen for article #{aid}: {e}")

    logger.info(f"Stage 4 complete: {image_count}/{len(article_ids)} Nano Banana decks generated")
    return image_count


def stage_sync_to_app2() -> dict[str, int]:
    """Stage 4: App 2 (Omni-Channel AI Agent) Integration Gateway REST Transfer."""
    logger.info("=" * 60)
    logger.info("STAGE 4: OMNI-CHANNEL AI AGENT (APP 2) REST TRANSFER GATEWAY")
    logger.info("=" * 60)

    if is_abort_requested():
        logger.warning("Stage 4 App 2 Transfer aborted by user.")
        return {"synced_to_app2": 0}

    from src.dispatch.service import load_config, dispatch_single_article
    cfg = load_config()
    is_active = cfg.get("is_active", True)
    rate_mode = cfg.get("rate_limit", {}).get("mode", "batch_10_2hr")

    synced_count = 0
    with get_session() as session:
        # Fetch articles that have been rewritten & have Nano Banana images built
        ready_articles = session.query(Article).filter(
            Article.status.in_(["ready", "scraped"]),
            Article.image_path.isnot(None)
        ).order_by(Article.rank_score.desc(), Article.id.desc()).all()

        for a in ready_articles:
            a.status = "ready"
        session.commit()

        if not is_active:
            logger.info("ℹ️ Outbound API Dispatch is currently PAUSED in configuration. Articles marked ready in queue.")
            return {"synced_to_app2": 0}

        # Determine how many articles to dispatch based on rate limit mode
        if rate_mode == "instant":
            to_dispatch = ready_articles
            logger.info(f"⚡ Instant Dispatch Mode: Transmitting all {len(to_dispatch)} ready stories to connected App 2...")
        elif rate_mode in ("batch_10_2hr", "batch_10_1hr"):
            to_dispatch = ready_articles[:10]
            logger.info(f"📦 Batch Mode ({rate_mode}): Transmitting batch of {len(to_dispatch)} top stories to connected App 2...")
        elif rate_mode == "1_per_hour":
            to_dispatch = ready_articles[:1]
            logger.info(f"⏱️ 1-per-hour Mode: Transmitting single top story #{to_dispatch[0].id if to_dispatch else 'None'} to connected App 2...")
        else:
            to_dispatch = ready_articles[:10]

        target_url = cfg.get("target_url", "http://localhost:5000/api/inbound/news")
        for a in to_dispatch:
            if is_abort_requested():
                break
            res = dispatch_single_article(a.id)
            if res.get("success"):
                synced_count += 1
                logger.info(f" ✓ [App 2 Outbound API] Story #{a.id} ('{a.title[:35]}...') + 4 slides dispatched to {target_url} (HTTP {res.get('status_code')})")
            else:
                logger.warning(f" ⚠️ [App 2 Outbound API] Story #{a.id} dispatch warning: {res.get('error')}")

    logger.info(f"Stage 4 complete: {synced_count} refined articles + Nano Banana image decks transferred to App 2 REST Gateway!")
    return {"synced_to_app2": synced_count}


def run_pipeline(max_articles: int | None = None):
    """Runs full automation pipeline (Scrape ➔ AI Rank/Refine ➔ Nano Banana Studio ➔ App 2 REST Gateway)."""
    global _ABORT_REQUESTED
    _ABORT_REQUESTED = False  # Reset flag at start
    start_time = time.time()

    logger.info("==========================================================")
    logger.info("  NEWSFLOW RESEARCH & IMAGE ENGINE — Starting Pipeline Run ")
    logger.info("==========================================================")

    init_db()
    sources = load_sources()

    new_articles = stage_scrape(sources, max_articles)
    ranked_count = stage_rank(max_articles)
    top_limit = max_articles if max_articles is not None else 10
    rewritten = stage_rewrite(top_limit)
    images = stage_image_gen(top_limit)
    sync_results = stage_sync_to_app2()

    elapsed = time.time() - start_time
    synced_count = sync_results.get("synced_to_app2", 0)
    status_label = "stopped_by_user" if is_abort_requested() else "completed"

    try:
        from src.db.models import PipelineRun
        with get_session() as session:
            pr = PipelineRun(
                started_at=datetime.utcfromtimestamp(start_time),
                completed_at=datetime.utcnow(),
                status=status_label,
                articles_scraped=new_articles,
                articles_rewritten=rewritten,
                images_generated=images,
                published_count=synced_count,
                duration_seconds=round(elapsed, 2)
            )
            session.add(pr)
            session.commit()
    except Exception as ex:
        logger.warning(f"Failed to record PipelineRun history: {ex}")

    logger.info("+----------------------------------------------------------+")
    logger.info(f"|   PIPELINE RUN {status_label.upper():<36}|")
    logger.info("+----------------------------------------------------------+")
    logger.info(f"|  New articles scraped:    {new_articles:<30}|")
    logger.info(f"|  Articles ranked/refined: {rewritten:<30}|")
    logger.info(f"|  Nano Banana images gen:  {images:<30}|")
    logger.info(f"|  Ready for App 2 Transfer:{synced_count:<30}|")
    logger.info(f"|  Total execution time:    {elapsed:.1f}s{' ' * (29 - len(f'{elapsed:.1f}s'))}|")
    logger.info("+----------------------------------------------------------+")
