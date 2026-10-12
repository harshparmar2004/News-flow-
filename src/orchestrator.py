"""
Orchestrator — Main pipeline coordinator with user abort support.

Runs the full news automation pipeline in sequence:
  1. Scrape articles from all configured sources
  2. Deduplicate and store in SQLite
  3. Rewrite with LLM AI into structured Tech Notes
  4. Verify & sync authentic editorial photos scraped from source websites
  5. Publish to Connected Apps & Social Gateways
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
from src.scraper.image_scraper import scrape_and_cache_article_image
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


_LAST_RUN_SOURCES = []


def get_last_run_sources() -> list[dict[str, Any]]:
    """Returns sequential per-source metrics from the most recent scraping run."""
    global _LAST_RUN_SOURCES
    if _LAST_RUN_SOURCES:
        return _LAST_RUN_SOURCES

    sources = load_sources()
    result = []
    try:
        with get_session() as session:
            from sqlalchemy import func
            counts = dict(session.query(Article.source, func.count(Article.id)).group_by(Article.source).all())
    except Exception:
        counts = {}

    for idx, s in enumerate(sources, 1):
        name = s.get("name", "Unknown")
        result.append({
            "order": idx,
            "name": name,
            "tier": s.get("tier", 1),
            "url": s.get("url"),
            "category": s.get("category", "tech"),
            "scraped": 0,
            "new": 0,
            "total_in_db": counts.get(name, 0),
            "status": "ready",
            "error": None
        })
    return result


def stage_scrape(sources: list[dict], max_articles: int | None = None) -> int:
    """Stage 1: Scrape articles concurrently across 100% of configured sources using multi-worker thread pool."""
    global _LAST_RUN_SOURCES
    _LAST_RUN_SOURCES = []

    max_workers = int(os.getenv("PIPELINE_MAX_WORKERS", "8"))
    logger.info("=" * 60)
    logger.info(f"STAGE 1: SCRAPING ARTICLES ACROSS ALL {len(sources)} SOURCES ({max_workers} CONCURRENT WORKERS)")
    logger.info("=" * 60)

    from concurrent.futures import ThreadPoolExecutor, as_completed
    import threading

    lock = threading.Lock()
    source_results = {}
    total_new = 0
    total_scraped = 0

    def _scrape_worker(item):
        idx, source = item
        if is_abort_requested():
            return idx, source, [], 0, "aborted", None

        name = source.get("name", "Unknown")
        tier = source.get("tier", 1)
        source_config = dict(source)
        if max_articles is not None:
            source_config["max_articles"] = min(source.get("max_articles", 5), max_articles)

        try:
            if tier == 1:
                articles = scrape_feed(source_config)
            elif tier == 2:
                articles = scrape_with_ai(source_config)
            else:
                articles = scrape_html(source_config)

            new_count = 0
            if articles:
                with lock:
                    new_count = dedupe_and_store(articles)
                logger.info(f" ✓ [{idx}/{len(sources)}] {name}: {len(articles)} scraped, {new_count} new stored")
            else:
                logger.info(f" ⚠️ [{idx}/{len(sources)}] {name}: 0 articles extracted")

            status = "ok" if articles else "empty"
            return idx, source, articles, new_count, status, None

        except Exception as e:
            logger.error(f" ❌ [{idx}/{len(sources)}] Error scraping {name}: {e}")
            return idx, source, [], 0, "error", str(e)

    tasks = [(idx, source) for idx, source in enumerate(sources, 1)]
    effective_workers = min(max_workers, len(tasks)) if tasks else 1

    with ThreadPoolExecutor(max_workers=effective_workers) as executor:
        futures = {executor.submit(_scrape_worker, item): item for item in tasks}
        for future in as_completed(futures):
            try:
                idx, source, articles, new_count, status, err = future.result()
                source_results[idx] = {
                    "order": idx,
                    "name": source.get("name", "Unknown"),
                    "tier": source.get("tier", 1),
                    "url": source.get("url"),
                    "category": source.get("category", "tech"),
                    "scraped": len(articles),
                    "new": new_count,
                    "status": status,
                    "error": err,
                    "timestamp": datetime.utcnow().isoformat() + "Z"
                }
                total_scraped += len(articles)
                total_new += new_count
            except Exception as fut_err:
                logger.error(f"Worker exception: {fut_err}")

    # Preserve sequential order in _LAST_RUN_SOURCES for clean dashboard display
    for idx in sorted(source_results.keys()):
        _LAST_RUN_SOURCES.append(source_results[idx])

    logger.info(f"Stage 1 complete: Processed {len(sources)} sources in parallel | {total_scraped} total items scraped | {total_new} new stored")
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
    """Stage 3: AI Refines & Rewrites strictly the Top 10 Ranked Stories into Structured Tech Notes."""
    limit_val = top_n if (top_n is not None and top_n > 0) else 10
    logger.info("=" * 60)
    logger.info(f"STAGE 3: AI REFINING TOP {limit_val} STORIES INTO STRUCTURED TECH NOTES")
    logger.info("=" * 60)

    with get_session() as session:
        articles = session.query(Article).order_by(Article.rank_score.desc()).limit(limit_val).all()
        article_ids = [a.id for a in articles]

    logger.info(f"Found {len(article_ids)} Top Ranked articles for Tech Notes synthesis")
    rewritten_count = 0

    for aid in article_ids:
        if is_abort_requested():
            logger.warning("Stage 3 AI Rewrite aborted by user.")
            break

        try:
            if rewrite_article(aid):
                rewritten_count += 1
                logger.info(f" ✓ Refined Top story #{aid} into Tech Notes")
        except Exception as e:
            logger.error(f"Failed to rewrite article #{aid}: {e}")

    logger.info(f"Stage 3 complete: {rewritten_count}/{len(article_ids)} Top stories refined into Tech Notes")
    return rewritten_count


def stage_sync_scraped_images(limit: int | None = None) -> int:
    """Stage 2: Fetch authentic editorial photos concurrently for articles missing one."""
    logger.info("=" * 60)
    logger.info("STAGE 2: AUTHENTIC EDITORIAL PHOTOS (CONCURRENT SYNC)")
    logger.info("=" * 60)

    with get_session() as session:
        q = session.query(Article).filter(
            (Article.scraped_image_path == None) | (Article.scraped_image_path == "")  # noqa: E711
        ).order_by(Article.scraped_at.desc())
        if limit:
            q = q.limit(limit)
        article_ids = [a.id for a in q.all()]

    if not article_ids:
        logger.info("All articles already have editorial photos verified.")
        return 0

    logger.info(f"Fetching authentic photos for {len(article_ids)} articles concurrently...")
    
    from concurrent.futures import ThreadPoolExecutor, as_completed
    verified_count = 0
    img_workers = min(6, len(article_ids))

    def _sync_single_photo(aid):
        if is_abort_requested():
            return aid, False
        try:
            cached_path = scrape_and_cache_article_image(aid)
            if cached_path and os.path.exists(cached_path):
                with get_session() as sess:
                    art = sess.query(Article).filter(Article.id == aid).first()
                    if art:
                        if not art.image_path:
                            art.image_path = cached_path
                        sess.commit()
                logger.info(f" ✓ Photo saved for story #{aid}")
                return aid, True
            else:
                return aid, False
        except Exception as e:
            logger.error(f"Photo sync failed for article #{aid}: {e}")
            return aid, False

    with ThreadPoolExecutor(max_workers=img_workers) as executor:
        futures = [executor.submit(_sync_single_photo, aid) for aid in article_ids]
        for f in as_completed(futures):
            _, success = f.result()
            if success:
                verified_count += 1

    logger.info(f"Stage 2 complete: {verified_count}/{len(article_ids)} photos saved concurrently")
    return verified_count


def run_pipeline(max_articles: int | None = None):
    """Runs full automation pipeline (Scrape ➔ Authentic Photo Sync ➔ Publish ALL to NewsFlow Web line-by-line)."""
    global _ABORT_REQUESTED
    _ABORT_REQUESTED = False  # Reset flag at start
    start_time = time.time()

    logger.info("==========================================================")
    logger.info("  RESEARCH AGENT — Sequential Scrape → Photos → NewsFlow Web")
    logger.info("  Sources: TechCrunch → The Verge → Ars Technica → Wired")
    logger.info("  → BBC → Reuters → HN → MIT → Guardian → Engadget →")
    logger.info("  ZDNet → VentureBeat → CNBC → TechRadar → 9to5G → Bloomberg")
    logger.info("==========================================================")

    init_db()
    sources = load_sources()

    # Stage 1: Scrape all sources
    new_articles = stage_scrape(sources, max_articles)

    # Stage 2: Authentic photos for articles missing one (prioritizing new items)
    photo_limit = max_articles or max(12, (new_articles or 0) * 2)
    images = stage_sync_scraped_images(limit=photo_limit)

    # Stage 3: Publish ALL scraped articles line-by-line to NewsFlow Web (no ranking gate)
    web_published_count = 0
    auto_pub = os.getenv("AUTO_PUBLISH_TO_WEB", "true").strip().lower() in ("1", "true", "yes", "on")
    default_web_status = os.getenv("DEFAULT_WEB_STATUS", "published").strip() or "published"

    if auto_pub:
        try:
            from src.publishers.web_publisher import publish_all_scraped
            # Publish all freshly scraped unposted articles from this run (default up to 50 or unconstrained)
            pub_limit = int(os.getenv("MAX_PUBLISH_PER_RUN", "50"))
            pub_results = publish_all_scraped(limit=pub_limit, skip_posted=True, status=default_web_status)
            web_published_count = pub_results.get("published", 0)
            logger.info(f"🌐 [NewsFlow Web] Uploaded {web_published_count} articles to NewsFlow Admin (status={default_web_status})!")
        except Exception as web_ex:
            logger.warning(f"⚠️ [NewsFlow Web] Publishing warning: {web_ex}")

        # Mirror Admin status (draft/published) back into the dashboard
        try:
            from src.publishers.web_publisher import sync_web_status
            st = sync_web_status()
            logger.info(f"🔄 [NewsFlow Web] Status sync: {st['updated']} updated, {st['checked']} checked"
                        + (f" (error: {st['error']})" if st.get("error") else ""))
        except Exception as sync_ex:
            logger.warning(f"⚠️ Status sync warning: {sync_ex}")
    else:
        logger.info("ℹ️ [NewsFlow Web] Auto-publishing to web is disabled in settings. Skipping stage 3.")

    elapsed = time.time() - start_time
    synced_count = web_published_count
    status_label = "stopped_by_user" if is_abort_requested() else "completed"

    try:
        from src.db.models import PipelineRun
        with get_session() as session:
            pr = PipelineRun(
                started_at=datetime.utcfromtimestamp(start_time),
                completed_at=datetime.utcnow(),
                status=status_label,
                articles_scraped=new_articles,
                articles_rewritten=web_published_count,
                images_generated=images,
                published_count=synced_count,
                duration_seconds=round(elapsed, 2)
            )
            session.add(pr)
            session.commit()
    except Exception as ex:
        logger.warning(f"Failed to record PipelineRun history: {ex}")

    # Dispatch Executive Run Digest to Telegram Bot Cockpit
    try:
        from src.notifications.telegram_bot import send_pipeline_digest
        run_stats = {
            "status": status_label,
            "articles_scraped": new_articles,
            "images_generated": images,
            "published_count": web_published_count,
            "duration_seconds": round(elapsed, 2)
        }
        send_pipeline_digest(run_stats)
    except Exception as tg_ex:
        logger.warning(f"Failed to dispatch Telegram run digest: {tg_ex}")

    logger.info("+----------------------------------------------------------+")
    logger.info(f"|   PIPELINE RUN {status_label.upper():<36}|")
    logger.info("+----------------------------------------------------------+")
    logger.info(f"|  New articles scraped:    {new_articles:<30}|")
    logger.info(f"|  Authentic photos synced: {images:<30}|")
    logger.info(f"|  🌐 NewsFlow Web uploaded:{web_published_count:<30}|")
    logger.info(f"|  Total execution time:    {elapsed:.1f}s{' ' * (29 - len(f'{elapsed:.1f}s'))}|")
    logger.info("+----------------------------------------------------------+")


