"""
NewsFlow 24/7 Autonomous Runner
--------------------------------
Continuously scrapes the internet, rewrites stories with Gemini AI, ranks them,
generates editorial images, and publishes the top 10 stories directly to
NewsFlow Web — 24 hours a day, 7 days a week.

STAGES per cycle (handled inside run_pipeline()):
  1. Scrape 50-60 sources via ScrapeGraphAI
  2. Deduplicate & clean
  3. Gemini 2.5 AI rewrite + SEO optimisation
  4. Nano Banana image generation
  5. Sync to App 2 (internal dashboard)
  6. Publish top stories to NewsFlow Web site (web_publisher.py)

Usage:
  python run_247_pipeline.py                   # default 60-minute cycle
  PIPELINE_CYCLE_SECONDS=1800 python run_247_pipeline.py  # 30-minute cycle
"""

import os
import sys
import time
import logging
import signal
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path

# ---------------------------------------------------------------------------
# Project root → sys.path
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).parent
sys.path.insert(0, str(PROJECT_ROOT))

LOGS_DIR = PROJECT_ROOT / "logs"
LOGS_DIR.mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# Logging: console + daily rotating log file
# ---------------------------------------------------------------------------
LOG_FORMAT = "%(asctime)s | 24/7 | %(levelname)-8s | %(message)s"
DATE_FMT   = "%Y-%m-%d %H:%M:%S"

console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(logging.Formatter(LOG_FORMAT, DATE_FMT))

file_handler = TimedRotatingFileHandler(
    LOGS_DIR / "pipeline_247.log",
    when="midnight",
    backupCount=14,
    encoding="utf-8",
)
file_handler.setFormatter(logging.Formatter(LOG_FORMAT, DATE_FMT))

logging.basicConfig(level=logging.INFO, handlers=[console_handler, file_handler])
logger = logging.getLogger("NewsFlow247")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
CYCLE_INTERVAL_SECONDS = int(os.getenv("PIPELINE_CYCLE_SECONDS", "3600"))  # default 1 h
MAX_ARTICLES_PER_CYCLE = int(os.getenv("MAX_ARTICLES_PER_CYCLE", "10"))
WEB_URL = os.getenv("NEWSFLOW_WEB_URL", "http://localhost:3000")

_shutdown_requested = False


def _handle_sigterm(signum, frame):
    """Graceful shutdown on SIGTERM (Docker / systemd stop)."""
    global _shutdown_requested
    logger.info("⚡ SIGTERM received — will stop after current cycle finishes.")
    _shutdown_requested = True


signal.signal(signal.SIGTERM, _handle_sigterm)


# ---------------------------------------------------------------------------
# Health-check ping (optional: hits /api/health if it exists)
# ---------------------------------------------------------------------------
def ping_web_health() -> bool:
    try:
        import requests
        r = requests.get(f"{WEB_URL}/api/health", timeout=8)
        return r.status_code == 200
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Single pipeline cycle
# ---------------------------------------------------------------------------
def execute_cycle(cycle_number: int) -> None:
    """Runs one complete scrape → rank → rewrite → image → publish cycle."""
    logger.info("=" * 65)
    logger.info(f"  🚀  CYCLE #{cycle_number} STARTING — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 65)
    cycle_start = time.time()

    try:
        from src.orchestrator import run_pipeline
        # run_pipeline already calls publish_all_ready() in Stage 5.
        # No need to call it again here.
        run_pipeline(max_articles=MAX_ARTICLES_PER_CYCLE)

        elapsed = round(time.time() - cycle_start, 1)
        logger.info(f"  ✅  CYCLE #{cycle_number} COMPLETE in {elapsed}s")
    except KeyboardInterrupt:
        raise
    except Exception as exc:
        elapsed = round(time.time() - cycle_start, 1)
        logger.exception(f"  ❌  CYCLE #{cycle_number} FAILED after {elapsed}s: {exc}")


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------
def main() -> None:
    logger.info("=" * 65)
    logger.info("   NEWSFLOW 24/7 AUTONOMOUS NEWS DESK — ONLINE")
    logger.info(f"   Cycle Interval : {CYCLE_INTERVAL_SECONDS}s  ({CYCLE_INTERVAL_SECONDS // 60} min)")
    logger.info(f"   Max Articles   : {MAX_ARTICLES_PER_CYCLE} per cycle")
    logger.info(f"   NewsFlow Web   : {WEB_URL}")
    logger.info(f"   Log directory  : {LOGS_DIR}")
    logger.info("=" * 65)

    # Optional: confirm the web server is reachable before starting
    if ping_web_health():
        logger.info("🟢 NewsFlow Web is reachable and healthy.")
    else:
        logger.warning(
            "🟡 Could not reach NewsFlow Web health endpoint — "
            "make sure 'npm run start' is running. Continuing anyway."
        )

    cycle = 0

    while not _shutdown_requested:
        cycle += 1
        execute_cycle(cycle)

        if _shutdown_requested:
            break

        next_run_ts = datetime.fromtimestamp(time.time() + CYCLE_INTERVAL_SECONDS)
        logger.info(
            f"  ⏳  Sleeping {CYCLE_INTERVAL_SECONDS // 60}m — "
            f"next cycle at {next_run_ts.strftime('%H:%M:%S')} …"
        )

        # Interruptible sleep: checks every 5 s so Ctrl+C is always responsive
        sleep_remaining = CYCLE_INTERVAL_SECONDS
        while sleep_remaining > 0 and not _shutdown_requested:
            chunk = min(5, sleep_remaining)
            time.sleep(chunk)
            sleep_remaining -= chunk

    logger.info("🛑 NewsFlow 24/7 Runner stopped cleanly.")


# ---------------------------------------------------------------------------
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("🛑 Stopped by Ctrl+C. Goodbye.")
        sys.exit(0)