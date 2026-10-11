"""
NewsFlow 24/7 Autonomous Research Loop & Auto-Pilot Manager
Provides:
1. Non-stop continuous scraping & publishing loop (e.g. every 60 minutes / 1 hour)
2. Immediate execution on start
3. Responsive pause/resume/stop controls
4. Automated Telegram reporting and cycle countdown notifications
"""

import time
import logging
import threading
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

logger = logging.getLogger("AutopilotManager")

_stop_event = threading.Event()
_autopilot_thread: Optional[threading.Thread] = None

_state: Dict[str, Any] = {
    "is_active": False,
    "interval_minutes": 60,
    "cycle_count": 0,
    "started_at": None,
    "last_run": None,
    "next_run": None,
    "last_duration_seconds": None,
    "current_status": "Idle",
    "total_articles_session": 0,
}

_lock = threading.Lock()


def get_autopilot_status() -> Dict[str, Any]:
    """Returns current Auto-Pilot operational status and metrics."""
    with _lock:
        now = datetime.utcnow()
        seconds_left = None
        if _state["is_active"] and _state["next_run"]:
            delta = (_state["next_run"] - now).total_seconds()
            seconds_left = max(0, int(delta))

        return {
            "is_active": _state["is_active"],
            "interval_minutes": _state["interval_minutes"],
            "cycle_count": _state["cycle_count"],
            "started_at": _state["started_at"].isoformat() + "Z" if _state["started_at"] else None,
            "last_run": _state["last_run"].isoformat() + "Z" if _state["last_run"] else None,
            "next_run": _state["next_run"].isoformat() + "Z" if _state["next_run"] else None,
            "seconds_until_next_run": seconds_left,
            "last_duration_seconds": _state["last_duration_seconds"],
            "current_status": _state["current_status"],
            "total_articles_session": _state["total_articles_session"],
        }


def _autopilot_worker_loop():
    """Background worker executing pipeline cycles and sleeping between intervals."""
    global _state

    logger.info("24/7 Autopilot worker thread started.")

    while not _stop_event.is_set():
        with _lock:
            _state["cycle_count"] += 1
            cycle_num = _state["cycle_count"]
            _state["current_status"] = f"Running Cycle #{cycle_num}"
            _state["last_run"] = datetime.utcnow()
            _state["next_run"] = None

        logger.info(f"🔄 [24/7 Autopilot] Triggering Cycle #{cycle_num}...")
        cycle_start_time = time.time()

        # Run pipeline orchestrator (Sequential Scrape -> Authentic Photos -> Direct Web Publish)
        try:
            from src.orchestrator import run_pipeline
            run_pipeline(max_articles=None)
        except Exception as e:
            logger.error(f"❌ [24/7 Autopilot] Error during Cycle #{cycle_num}: {e}")

        duration = round(time.time() - cycle_start_time, 1)

        if _stop_event.is_set():
            logger.info("Autopilot stop event received after cycle run.")
            break

        # Compute next scheduled run
        with _lock:
            interval_mins = _state["interval_minutes"]
            interval_secs = interval_mins * 60
            next_run_dt = datetime.utcnow() + timedelta(seconds=interval_secs)
            _state["next_run"] = next_run_dt
            _state["last_duration_seconds"] = duration
            _state["current_status"] = f"Standby (Next cycle in {interval_mins}m)"

        next_time_str = next_run_dt.strftime("%H:%M UTC")
        logger.info(f"✅ [24/7 Autopilot] Cycle #{cycle_num} finished in {duration}s. Next run at {next_time_str}.")

        # Send Telegram cycle standby alert
        try:
            from src.notifications.telegram_bot import send_message
            msg = (
                f"⏱️ <b>24/7 Autopilot Standby (Next in {interval_mins}m)</b>\n\n"
                f"• <b>Cycle Completed:</b> #{cycle_num} in {duration}s\n"
                f"• <b>Next Automated Ingestion:</b> <code>{next_time_str}</code>\n"
                f"• <b>Status:</b> 🟢 Autonomous research agent active & listening"
            )
            keyboard = {
                "inline_keyboard": [
                    [
                        {"text": "📊 Live Status", "callback_data": "cmd_status"},
                        {"text": "🛑 Stop Autopilot", "callback_data": "cmd_autopilot_stop"}
                    ]
                ]
            }
            send_message(msg, reply_markup=keyboard)
        except Exception as ex:
            logger.warning(f"Could not send autopilot status to Telegram: {ex}")

        # Sleep responsive to cancellation
        sleep_elapsed = 0.0
        while sleep_elapsed < interval_secs:
            if _stop_event.is_set():
                break
            time.sleep(2.0)
            sleep_elapsed += 2.0

    with _lock:
        _state["is_active"] = False
        _state["current_status"] = "Stopped"
        _state["next_run"] = None

    logger.info("24/7 Autopilot worker thread stopped cleanly.")


def start_autopilot(interval_minutes: int = 60, immediate_first_run: bool = True, chat_id: Optional[str] = None) -> Dict[str, Any]:
    """Starts or re-configures the 24/7 autonomous loop."""
    global _autopilot_thread

    with _lock:
        if _state["is_active"]:
            _state["interval_minutes"] = max(5, int(interval_minutes))
            return {
                "success": True,
                "already_running": True,
                "message": f"Autopilot is already active! Interval set to {interval_minutes} minutes.",
                "state": get_autopilot_status(),
            }

        _stop_event.clear()
        _state["is_active"] = True
        _state["interval_minutes"] = max(5, int(interval_minutes))
        _state["started_at"] = datetime.utcnow()
        _state["current_status"] = "Initializing"

    _autopilot_thread = threading.Thread(target=_autopilot_worker_loop, daemon=True)
    _autopilot_thread.start()

    logger.info(f"🚀 24/7 Autopilot activated with {interval_minutes}m interval.")

    # Send launch alert to Telegram
    try:
        from src.notifications.telegram_bot import send_message
        interval_desc = f"{interval_minutes} minutes (1 hour)" if interval_minutes == 60 else f"{interval_minutes} minutes"
        msg = (
            "🚀 <b>24/7 Autonomous Research Loop Activated!</b>\n\n"
            f"• <b>Frequency:</b> Every {interval_desc}\n"
            "• <b>Workflow:</b> Sequential 16-source scrape ➔ Photos ➔ Live Web publish\n"
            "• <b>Cycle #1:</b> Starting immediately now...\n\n"
            "<i>I will notify you on Telegram after every cycle. You can close your laptop and the bot will continue working!</i>"
        )
        keyboard = {
            "inline_keyboard": [
                [
                    {"text": "📊 Live Status", "callback_data": "cmd_status"},
                    {"text": "🛑 Stop Autopilot", "callback_data": "cmd_autopilot_stop"}
                ]
            ]
        }
        send_message(msg, reply_markup=keyboard, chat_id=chat_id)
    except Exception as ex:
        logger.warning(f"Could not send start notification to Telegram: {ex}")

    return {
        "success": True,
        "message": f"24/7 Autopilot started successfully (every {interval_minutes}m)!",
        "state": get_autopilot_status(),
    }


def stop_autopilot(chat_id: Optional[str] = None) -> Dict[str, Any]:
    """Halts the 24/7 autonomous loop immediately."""
    with _lock:
        if not _state["is_active"]:
            return {
                "success": True,
                "already_stopped": True,
                "message": "Autopilot is not running.",
                "state": get_autopilot_status(),
            }

        _stop_event.set()
        completed_cycles = _state["cycle_count"]

    # Also request abort on current pipeline if currently running
    try:
        from src.orchestrator import request_abort
        request_abort()
    except Exception:
        pass

    logger.info("🛑 24/7 Autopilot stop requested.")

    # Send stop notification to Telegram
    try:
        from src.notifications.telegram_bot import send_message
        msg = (
            "🛑 <b>24/7 Autopilot Mode Deactivated.</b>\n\n"
            f"• <b>Completed Cycles:</b> {completed_cycles}\n"
            "• <b>Status:</b> Engine returned to manual on-demand mode.\n\n"
            "<i>You can start it again anytime with /autopilot start.</i>"
        )
        keyboard = {
            "inline_keyboard": [
                [
                    {"text": "🔄 Start Autopilot (1h)", "callback_data": "cmd_autopilot_start"},
                    {"text": "▶️ Run Single Cycle", "callback_data": "cmd_run"}
                ]
            ]
        }
        send_message(msg, reply_markup=keyboard, chat_id=chat_id)
    except Exception as ex:
        logger.warning(f"Could not send stop notification to Telegram: {ex}")

    return {
        "success": True,
        "message": f"24/7 Autopilot stopped cleanly (completed {completed_cycles} cycles).",
        "state": get_autopilot_status(),
    }
