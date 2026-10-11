"""
NewsFlow Telegram Bot and Remote Control Daemon
Provides:
1. Executive digest notifications after pipeline runs
2. Remote control over Telegram (/run, /status, /latest, /sync, /stop, /ping)
3. Interactive inline buttons
"""

import os
import sys
import time
import logging
import threading
import requests
from typing import Optional, Dict, Any, List
from datetime import datetime

logger = logging.getLogger("TelegramBot")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

_daemon_thread: Optional[threading.Thread] = None
_daemon_running = False
_last_update_id = 0

def get_bot_token() -> str:
    return os.getenv("TELEGRAM_BOT_TOKEN", "").strip()

def get_chat_id() -> str:
    return os.getenv("TELEGRAM_CHAT_ID", "").strip()

def is_remote_control_enabled() -> bool:
    val = os.getenv("TELEGRAM_REMOTE_CONTROL", "true").strip().lower()
    return val in ("1", "true", "yes", "on")

def is_notifications_enabled() -> bool:
    val = os.getenv("TELEGRAM_NOTIFY_COMPLETION", "true").strip().lower()
    return val in ("1", "true", "yes", "on")

def get_web_url() -> str:
    return os.getenv("NEWSFLOW_WEB_URL", "http://localhost:3000").rstrip("/")

def is_valid_button_url(url: str) -> bool:
    """Telegram inline keyboard strictly rejects localhost/127.0.0.1 URLs with HTTP 400."""
    if not url:
        return False
    u = url.lower().strip()
    if "localhost" in u or "127.0.0.1" in u or "0.0.0.0" in u:
        return False
    return u.startswith("https://") or u.startswith("http://")

def send_message(text: str, parse_mode: str = "HTML", reply_markup: Optional[Dict[str, Any]] = None, chat_id: Optional[str] = None) -> bool:
    token = get_bot_token()
    target_chat = chat_id or get_chat_id()
    if not token or not target_chat:
        logger.warning("Telegram send_message skipped: token or chat_id missing")
        return False
    
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    if len(text) > 4000:
        text = text[:3990] + "...\n<i>[truncated]</i>"

    payload = {
        "chat_id": target_chat,
        "text": text,
        "parse_mode": parse_mode,
        "disable_web_page_preview": False
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup

    try:
        r = requests.post(url, json=payload, timeout=12)
        if r.status_code == 200:
            return True
        logger.warning(f"Telegram sendMessage HTTP {r.status_code}: {r.text[:200]}")
        return False
    except Exception as e:
        logger.error(f"Telegram sendMessage error: {e}")
        return False

def send_photo(photo_path_or_url: str, caption: str = "", parse_mode: str = "HTML", chat_id: Optional[str] = None) -> bool:
    token = get_bot_token()
    target_chat = chat_id or get_chat_id()
    if not token or not target_chat:
        return False

    url = f"https://api.telegram.org/bot{token}/sendPhoto"
    try:
        if os.path.exists(photo_path_or_url):
            with open(photo_path_or_url, "rb") as f:
                files = {"photo": f}
                data = {"chat_id": target_chat, "caption": caption[:1024], "parse_mode": parse_mode}
                r = requests.post(url, data=data, files=files, timeout=20)
                return r.status_code == 200
        else:
            payload = {"chat_id": target_chat, "photo": photo_path_or_url, "caption": caption[:1024], "parse_mode": parse_mode}
            r = requests.post(url, json=payload, timeout=20)
            return r.status_code == 200
    except Exception as e:
        logger.error(f"Telegram sendPhoto error: {e}")
        return False

def answer_callback(callback_query_id: str, text: Optional[str] = None):
    token = get_bot_token()
    if not token or not callback_query_id:
        return
    try:
        payload = {"callback_query_id": callback_query_id}
        if text:
            payload["text"] = text
        requests.post(f"https://api.telegram.org/bot{token}/answerCallbackQuery", json=payload, timeout=8)
    except Exception as e:
        logger.warning(f"answerCallbackQuery error: {e}")

def send_pipeline_digest(stats: Dict[str, Any]) -> bool:
    """Sends an executive pipeline run digest with stats, top stories, and action buttons."""
    if not is_notifications_enabled():
        logger.info("Telegram completion notifications disabled in settings.")
        return False

    token = get_bot_token()
    chat_id = get_chat_id()
    if not token or not chat_id:
        return False

    status = stats.get("status", "completed")
    status_emoji = "✅" if status == "completed" else "🛑"
    scraped = stats.get("articles_scraped", 0)
    photos = stats.get("images_generated", 0)
    uploaded = stats.get("published_count", 0)
    duration = stats.get("duration_seconds", 0.0)
    web_url = get_web_url()

    top_items = []
    try:
        from src.db.models import Article, get_session
        with get_session() as sess:
            arts = sess.query(Article).order_by(Article.scraped_at.desc()).limit(3).all()
            for a in arts:
                top_items.append({
                    "title": a.title,
                    "category": a.category or "Tech & Innovation",
                    "slug": a.web_slug,
                    "url": f"{web_url}/article/{a.web_slug}" if a.web_slug else a.url
                })
    except Exception as ex:
        logger.warning(f"Could not fetch top articles for digest: {ex}")

    lines = [
        f"{status_emoji} <b>NewsFlow Intelligence Pipeline Digest</b>",
        f"<i>Run Status: {status.upper()} in {duration:.1f}s</i>",
        "",
        f"📥 <b>Articles Scraped:</b> {scraped}",
        f"📸 <b>Authentic Photos Synced:</b> {photos}",
        f"🌐 <b>Published to Web:</b> {uploaded} stories (Live on Homepage)",
        ""
    ]

    if top_items:
        lines.append("🔥 <b>Top Stories Ingested:</b>")
        for idx, item in enumerate(top_items, 1):
            clean_title = (item["title"] or "Untitled").replace("<", "&lt;").replace(">", "&gt;")
            item_url = item["url"]
            cat = item["category"]
            lines.append(f'{idx}. <a href="{item_url}">{clean_title}</a> [<code>{cat}</code>]')
        lines.append("")

    lines.append(f"🌐 <b>Website:</b> <code>{web_url}</code>")

    msg = "\n".join(lines)
    
    keyboard = []
    if is_valid_button_url(web_url):
        keyboard.append([
            {"text": "🌐 Open Website", "url": web_url},
            {"text": "⚙️ Admin Desk", "url": f"{web_url}/admin"}
        ])

    keyboard.append([
        {"text": "▶️ Run Pipeline Now", "callback_data": "cmd_run"},
        {"text": "📊 System Status", "callback_data": "cmd_status"}
    ])
    keyboard.append([
        {"text": "🔥 Latest News", "callback_data": "cmd_latest"}
    ])

    reply_markup = {"inline_keyboard": keyboard}
    return send_message(msg, reply_markup=reply_markup)

def handle_telegram_command(command: str, args: List[str], from_user: Dict[str, Any], chat_id: str) -> None:
    web_url = get_web_url()
    cmd = command.lower().strip()

    if cmd in ("/start", "/help"):
        user_name = from_user.get("first_name", "User")
        
        ap_badge = "⚪ 24/7 Autopilot: OFF"
        try:
            from src.scheduler.autopilot_manager import get_autopilot_status
            ap_st = get_autopilot_status()
            if ap_st.get("is_active"):
                ap_badge = f"🟢 24/7 Autopilot: ON (Cycle #{ap_st['cycle_count']})"
        except Exception:
            pass

        text = (
            f"🚀 <b>Welcome {user_name} to NewsFlow Remote Cockpit!</b>\n\n"
            "You can monitor and trigger your autonomous news intelligence pipeline directly from Telegram.\n\n"
            f"<b>Current Engine Mode:</b> <code>{ap_badge}</code>\n\n"
            "<b>Available Commands:</b>\n"
            "🔄 <code>/autopilot</code> — Start 24/7 autonomous loop (scrapes & publishes every 1h)\n"
            "🛑 <code>/autopilot stop</code> — Halt 24/7 auto-pilot immediately\n"
            "▶️ <code>/run</code> — Run a single research cycle on-demand\n"
            "📊 <code>/status</code> — Current pipeline health, active stage, and DB counts\n"
            "🤖 <code>/crawlers</code> — Live AI crawler telemetry (OpenAI, Claude, Perplexity)\n"
            "🔥 <code>/latest</code> — Show latest 5 articles published with links\n"
            "🔄 <code>/sync</code> — Mirror status back from NewsFlow Admin\n"
            "🛑 <code>/stop</code> — Halt active pipeline run immediately\n"
            "🏓 <code>/ping</code> — Test bot responsiveness and daemon health\n\n"
            f"• <b>Web Destination:</b> <code>{web_url}</code>\n"
            "<i>Or tap the buttons below:</i>"
        )
        
        is_ap_active = False
        try:
            from src.scheduler.autopilot_manager import get_autopilot_status
            is_ap_active = get_autopilot_status().get("is_active", False)
        except Exception:
            pass

        ap_btn = (
            {"text": "🛑 Stop Autopilot", "callback_data": "cmd_autopilot_stop"}
            if is_ap_active
            else {"text": "🔄 Start 24/7 Autopilot (1h)", "callback_data": "cmd_autopilot_start_60"}
        )

        keyboard = [
            [
                ap_btn,
                {"text": "📊 Live Status", "callback_data": "cmd_status"}
            ],
            [
                {"text": "🤖 AI Crawlers", "callback_data": "cmd_crawlers"},
                {"text": "🔥 Latest News", "callback_data": "cmd_latest"}
            ]
        ]
        if is_valid_button_url(web_url):
            keyboard[1].append({"text": "🌐 Open Web", "url": web_url})

        reply_markup = {"inline_keyboard": keyboard}
        send_message(text, reply_markup=reply_markup, chat_id=chat_id)

    elif cmd in ("/autopilot", "/loop"):
        from src.scheduler.autopilot_manager import start_autopilot, stop_autopilot, get_autopilot_status
        subcmd = args[0].lower() if args else ""

        if subcmd == "stop":
            stop_autopilot(chat_id=chat_id)
            return

        elif subcmd in ("start", "on", "run") or (subcmd.isdigit() or (len(subcmd) > 1 and subcmd[:-1].isdigit())):
            interval = 60
            for a in args:
                if a.isdigit():
                    interval = int(a)
                    break
                elif a.endswith("m") and a[:-1].isdigit():
                    interval = int(a[:-1])
                    break
                elif a.endswith("h") and a[:-1].isdigit():
                    interval = int(a[:-1]) * 60
                    break
            start_autopilot(interval_minutes=interval, immediate_first_run=True, chat_id=chat_id)
            return

        # Status & Quick Controls
        status = get_autopilot_status()
        is_act = status["is_active"]
        interval = status["interval_minutes"]
        cycles = status["cycle_count"]
        status_badge = "🟢 ACTIVE (24/7 Loop Running)" if is_act else "⚪ STOPPED (Idle / On-Demand)"

        next_str = "None"
        if status.get("seconds_until_next_run") is not None:
            secs = status["seconds_until_next_run"]
            mins = secs // 60
            rem_secs = secs % 60
            next_str = f"in {mins}m {rem_secs}s"

        msg = (
            f"🔄 <b>NewsFlow 24/7 Autopilot Control</b>\n\n"
            f"• <b>Status:</b> {status_badge}\n"
            f"• <b>Interval:</b> Every {interval} minutes ({interval // 60} hour(s))\n"
            f"• <b>Completed Cycles:</b> {cycles}\n"
            f"• <b>Next Scheduled Run:</b> <code>{next_str}</code>\n"
            f"• <b>Current Operation:</b> {status['current_status']}\n\n"
            "<i>Once started, the agent scrapes all 16 sources and publishes to NewsFlow Web non-stop.</i>"
        )

        if is_act:
            keyboard = [
                [
                    {"text": "🛑 Stop Autopilot", "callback_data": "cmd_autopilot_stop"},
                    {"text": "📊 Live Status", "callback_data": "cmd_status"}
                ]
            ]
        else:
            keyboard = [
                [
                    {"text": "🔄 Start Every 1 Hour", "callback_data": "cmd_autopilot_start_60"},
                    {"text": "⚡ Start Every 30 Mins", "callback_data": "cmd_autopilot_start_30"}
                ],
                [
                    {"text": "▶️ Run Single Cycle Once", "callback_data": "cmd_run"}
                ]
            ]

        send_message(msg, reply_markup={"inline_keyboard": keyboard}, chat_id=chat_id)

    elif cmd in ("/run", "/start_pipeline"):
        if not is_remote_control_enabled():
            send_message("⚠️ Remote pipeline execution is currently disabled in Settings.", chat_id=chat_id)
            return
        from src.api.routes import _pipeline_state, _run_pipeline_background
        if _pipeline_state.get("is_running"):
            stage = _pipeline_state.get("current_stage", "In Progress")
            send_message(f"⏳ <b>Pipeline is already running!</b>\nCurrent stage: <code>{stage}</code>", chat_id=chat_id)
            return

        t = threading.Thread(target=_run_pipeline_background, kwargs={"max_articles": None}, daemon=True)
        t.start()
        send_message(
            "🚀 <b>Pipeline Started!</b>\n\n"
            "Research Agent is scraping 16 sources sequentially, caching authentic photos, and uploading stories to NewsFlow Web live.\n\n"
            "<i>I will send you an executive digest when complete.</i>",
            chat_id=chat_id
        )

    elif cmd in ("/stop", "/abort"):
        from src.orchestrator import request_abort
        request_abort()
        try:
            from src.scheduler.autopilot_manager import stop_autopilot
            stop_autopilot(chat_id=chat_id)
        except Exception:
            pass
        send_message("🛑 <b>Abort requested!</b> The pipeline will halt at the current source step.", chat_id=chat_id)

    elif cmd == "/status":
        from src.api.routes import _pipeline_state
        from src.db.models import Article, PipelineRun, get_session
        is_running = _pipeline_state.get("is_running", False)
        stage = _pipeline_state.get("current_stage") or "Idle"
        state_str = "🟢 RUNNING" if is_running else "⚪ IDLE"

        ap_desc = "⚪ OFF (Manual)"
        try:
            from src.scheduler.autopilot_manager import get_autopilot_status
            ap = get_autopilot_status()
            if ap["is_active"]:
                next_rem = ""
                if ap.get("seconds_until_next_run"):
                    m = ap["seconds_until_next_run"] // 60
                    next_rem = f", next in {m}m"
                ap_desc = f"🟢 ON (every {ap['interval_minutes']}m, cycle #{ap['cycle_count']}{next_rem})"
        except Exception:
            pass

        with get_session() as sess:
            from sqlalchemy import func
            total_articles = sess.query(func.count(Article.id)).scalar() or 0
            web_posted = sess.query(func.count(Article.id)).filter(Article.web_posted == True).scalar() or 0
            last_run = sess.query(PipelineRun).order_by(PipelineRun.id.desc()).first()

        last_info = "Never"
        if last_run and last_run.completed_at:
            last_info = f"{last_run.completed_at.strftime('%Y-%m-%d %H:%M')} UTC ({last_run.duration_seconds}s)"

        msg = (
            f"📊 <b>NewsFlow Pipeline Status</b>\n\n"
            f"• <b>Engine State:</b> {state_str}\n"
            f"• <b>24/7 Autopilot:</b> {ap_desc}\n"
            f"• <b>Current Stage:</b> <code>{stage}</code>\n"
            f"• <b>Total Articles in DB:</b> {total_articles}\n"
            f"• <b>Web Published:</b> {web_posted}\n"
            f"• <b>Last Run:</b> {last_info}\n\n"
            f"• <b>Web Endpoint:</b> <code>{web_url}</code>"
        )
        send_message(msg, chat_id=chat_id)

    elif cmd in ("/crawlers", "/bots", "/crawling"):
        try:
            r = requests.get(f"{web_url}/api/admin/crawlers", timeout=8)
            if r.status_code == 200:
                data = r.json()
                summary = data.get("summary", {})
                labs = data.get("labs", [])
                top_paths = data.get("topPaths", [])

                total = summary.get("totalHits", 0)
                h24 = summary.get("hits24h", 0)
                unique_labs = summary.get("uniqueLabs", 0)
                unique_bots = summary.get("uniqueBots", 0)

                lab_lines = []
                for l in labs[:4]:
                    lab_name = l.get("lab", "Unknown")
                    cnt = l.get("count", 0)
                    pct = round((cnt / total * 100)) if total > 0 else 0
                    lab_lines.append(f"  • <b>{lab_name}:</b> {cnt} ({pct}%)")

                top_p = top_paths[0]["path"] if top_paths else "/llms.txt"
                top_c = top_paths[0]["count"] if top_paths else 0

                msg = (
                    "🤖 <b>AI Crawler & LLM Agent Telemetry</b>\n\n"
                    f"• <b>Total AI Hits:</b> {total} (<code>+{h24} in 24h</code>)\n"
                    f"• <b>AI Labs Active:</b> {unique_labs} ecosystem(s)\n"
                    f"• <b>Unique Bot Models:</b> {unique_bots}\n\n"
                    "🏢 <b>Lab Distribution:</b>\n"
                    + ("\n".join(lab_lines) if lab_lines else "  <i>No lab telemetry yet</i>")
                    + f"\n\n🔥 <b>Most Ingested:</b> <code>{top_p}</code> ({top_c} scrapes)\n"
                    f"📡 <b>LLM Index:</b> <code>{web_url}/llms.txt</code>"
                )
            else:
                msg = f"⚠️ Could not reach crawler API (HTTP {r.status_code}). Ensure NewsFlow Web is running."
        except Exception as ex:
            msg = f"⚠️ Crawler telemetry error: {ex}"

        reply_markup = {
            "inline_keyboard": [
                [
                    {"text": "🔄 Refresh Telemetry", "callback_data": "cmd_crawlers"},
                    {"text": "📊 Live Status", "callback_data": "cmd_status"}
                ]
            ]
        }
        send_message(msg, reply_markup=reply_markup, chat_id=chat_id)

    elif cmd == "/latest":
        from src.db.models import Article, get_session
        items = []
        with get_session() as sess:
            arts = sess.query(Article).order_by(Article.scraped_at.desc()).limit(5).all()
            for a in arts:
                items.append({
                    "title": a.title or "Untitled",
                    "cat": a.category or "Tech & Innovation",
                    "slug": a.web_slug,
                    "url": f"{web_url}/article/{a.web_slug}" if a.web_slug else a.url,
                    "source": a.source or "Feed"
                })

        if not items:
            send_message("📭 No articles found in database yet. Run <code>/run</code> to start scraping!", chat_id=chat_id)
            return

        lines = ["🔥 <b>Latest 5 Stories Published:</b>\n"]
        for i, item in enumerate(items, 1):
            ctitle = item["title"].replace("<", "&lt;").replace(">", "&gt;")
            lines.append(f'{i}. <a href="{item["url"]}">{ctitle}</a>')
            lines.append(f'   📂 <i>{item["cat"]}</i> | 🏷 {item["source"]}')
        
        reply_markup = None
        if is_valid_button_url(web_url):
            reply_markup = {
                "inline_keyboard": [
                    [{"text": "🌐 Browse All on Website", "url": web_url}]
                ]
            }
        send_message("\n".join(lines), reply_markup=reply_markup, chat_id=chat_id)

    elif cmd == "/sync":
        try:
            from src.publishers.web_publisher import sync_web_status
            res = sync_web_status()
            send_message(
                f"🔄 <b>Admin Status Sync Complete!</b>\n\n"
                f"• Checked: {res.get('checked', 0)}\n"
                f"• Updated: {res.get('updated', 0)}\n"
                + (f"• Error: <code>{res.get('error')}</code>" if res.get("error") else "• Status: Healthy & Synced"),
                chat_id=chat_id
            )
        except Exception as ex:
            send_message(f"⚠️ Sync error: {ex}", chat_id=chat_id)

    elif cmd == "/ping":
        send_message("🏓 <b>Pong!</b> NewsFlow Pipeline & Telegram Daemon are healthy, connected, and ready.", chat_id=chat_id)

    else:
        send_message(f"❓ Unknown command: <code>{command}</code>. Use <code>/help</code> to see available commands.", chat_id=chat_id)

def poll_telegram_loop():
    """Long-polling daemon listening for Telegram commands and button taps."""
    global _daemon_running, _last_update_id
    logger.info("Telegram Bot polling loop starting...")
    
    while _daemon_running:
        token = get_bot_token()
        authorized_chat = get_chat_id()
        if not token:
            time.sleep(5)
            continue

        bot_id = token.split(":")[0] if ":" in token else ""

        try:
            url = f"https://api.telegram.org/bot{token}/getUpdates"
            params = {"timeout": 20, "offset": _last_update_id + 1}
            resp = requests.get(url, params=params, timeout=30)
            if resp.status_code != 200:
                time.sleep(5)
                continue

            data = resp.json()
            if not data.get("ok"):
                time.sleep(5)
                continue

            for update in data.get("result", []):
                _last_update_id = max(_last_update_id, update["update_id"])

                # Handle callback queries (inline button clicks)
                if "callback_query" in update:
                    cq = update["callback_query"]
                    cq_id = cq.get("id")
                    cq_data = cq.get("data", "")
                    sender_id = str(cq.get("from", {}).get("id", ""))
                    chat_id = str(cq.get("message", {}).get("chat", {}).get("id", ""))

                    # Auto-bind or verify
                    if not authorized_chat or authorized_chat == bot_id:
                        authorized_chat = sender_id
                        logger.info(f"Auto-binding Telegram to chat ID {authorized_chat}")

                    if authorized_chat and authorized_chat != sender_id and authorized_chat != chat_id:
                        answer_callback(cq_id, "⛔ Unauthorized user.")
                        continue

                    answer_callback(cq_id, "Processing...")
                    if cq_data == "cmd_run":
                        handle_telegram_command("/run", [], cq.get("from", {}), chat_id or authorized_chat)
                    elif cq_data == "cmd_status":
                        handle_telegram_command("/status", [], cq.get("from", {}), chat_id or authorized_chat)
                    elif cq_data == "cmd_latest":
                        handle_telegram_command("/latest", [], cq.get("from", {}), chat_id or authorized_chat)
                    elif cq_data == "cmd_crawlers":
                        handle_telegram_command("/crawlers", [], cq.get("from", {}), chat_id or authorized_chat)
                    elif cq_data.startswith("cmd_autopilot_start"):
                        mins = 60
                        if "_30" in cq_data: mins = 30
                        elif "_120" in cq_data: mins = 120
                        from src.scheduler.autopilot_manager import start_autopilot
                        start_autopilot(interval_minutes=mins, immediate_first_run=True, chat_id=chat_id or authorized_chat)
                    elif cq_data == "cmd_autopilot_stop":
                        from src.scheduler.autopilot_manager import stop_autopilot
                        stop_autopilot(chat_id=chat_id or authorized_chat)
                    elif cq_data == "cmd_autopilot_status":
                        handle_telegram_command("/autopilot", ["status"], cq.get("from", {}), chat_id or authorized_chat)
                    continue

                # Handle standard messages
                if "message" in update:
                    msg = update["message"]
                    sender_id = str(msg.get("from", {}).get("id", ""))
                    chat_id = str(msg.get("chat", {}).get("id", ""))
                    text = msg.get("text", "").strip()

                    # Auto-bind if user copied bot ID
                    if not authorized_chat or authorized_chat == bot_id:
                        authorized_chat = sender_id
                        logger.info(f"Auto-binding Telegram to chat ID {authorized_chat}")

                    if authorized_chat and authorized_chat != sender_id and authorized_chat != chat_id:
                        logger.warning(f"Unauthorized Telegram message from {sender_id} (authorized: {authorized_chat})")
                        continue

                    if text.startswith("/"):
                        parts = text.split()
                        cmd = parts[0].split("@")[0]
                        args = parts[1:]
                        handle_telegram_command(cmd, args, msg.get("from", {}), chat_id)

        except requests.exceptions.RequestException:
            time.sleep(3)
        except Exception as ex:
            logger.error(f"Error in Telegram polling loop: {ex}")
            time.sleep(3)

def start_polling():
    global _daemon_thread, _daemon_running
    if _daemon_running and _daemon_thread and _daemon_thread.is_alive():
        return
    _daemon_running = True
    _daemon_thread = threading.Thread(target=poll_telegram_loop, daemon=True, name="TelegramBotDaemon")
    _daemon_thread.start()
    logger.info("Started Telegram Bot Polling Daemon thread.")

def stop_polling():
    global _daemon_running
    _daemon_running = False
    logger.info("Stopped Telegram Bot Polling Daemon.")

def get_bot_status() -> Dict[str, Any]:
    token = get_bot_token()
    chat_id = get_chat_id()
    if not token:
        return {"configured": False, "valid": False, "is_polling": _daemon_running, "bot_user": None, "chat_id": chat_id}

    try:
        r = requests.get(f"https://api.telegram.org/bot{token}/getMe", timeout=5)
        if r.status_code == 200 and r.json().get("ok"):
            bot_info = r.json().get("result", {})
            return {
                "configured": True,
                "valid": True,
                "is_polling": _daemon_running,
                "bot_user": bot_info.get("username"),
                "bot_first_name": bot_info.get("first_name"),
                "chat_id": chat_id
            }
        return {"configured": True, "valid": False, "is_polling": _daemon_running, "error": f"HTTP {r.status_code}", "chat_id": chat_id}
    except Exception as e:
        return {"configured": True, "valid": False, "is_polling": _daemon_running, "error": str(e), "chat_id": chat_id}
