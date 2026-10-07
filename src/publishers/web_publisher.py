"""
NewsFlow Web Publisher
Publishes ALL scraped articles from the pipeline DB directly to the NewsFlow Web site
(Next.js) via its REST API — line by line, no ranking gate.

Authentic scraped lead images are copied to newsflow-web/public/images/scraped/ and served
natively by Next.js at /images/scraped/<filename>.
"""

import os
import sys
import json
import shutil
import logging
import requests
from datetime import datetime
from dotenv import load_dotenv
from typing import Optional, Dict, Any

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("NewsFlowWebPublisher")

load_dotenv()

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.db.models import Article, get_session

WEB_URL = os.getenv("NEWSFLOW_WEB_URL", "http://localhost:3000").rstrip("/")
API_KEY = os.getenv("NEWSFLOW_WEB_API_KEY", "nf_live_sec_9942a8b7e1034f68a")

NEWSFLOW_WEB_DIR = os.getenv(
    "NEWSFLOW_WEB_DIR",
    os.path.normpath(os.path.join(PROJECT_ROOT, "..", "newsflow-web"))
)
WEB_PUBLIC_SCRAPED = os.path.join(NEWSFLOW_WEB_DIR, "public", "images", "scraped")


def ensure_web_image_dir():
    os.makedirs(WEB_PUBLIC_SCRAPED, exist_ok=True)


def copy_image_to_web(article_id: int, scraped_image_path: str) -> Optional[str]:
    if not scraped_image_path or not os.path.exists(scraped_image_path):
        return None
    try:
        ensure_web_image_dir()
        filename = os.path.basename(scraped_image_path)
        dest = os.path.join(WEB_PUBLIC_SCRAPED, filename)
        if not os.path.exists(dest):
            shutil.copy2(scraped_image_path, dest)
            logger.info(f"  Copied image {filename} to newsflow-web/public/images/scraped/")
        return f"/images/scraped/{filename}"
    except Exception as e:
        logger.warning(f"  Could not copy image for article #{article_id}: {e}")
        return None


def send_article_to_web(payload: Dict[str, Any], retries: int = 3) -> Optional[Dict[str, Any]]:
    import time
    endpoint = f"{WEB_URL}/api/articles"
    headers = {"x-api-key": API_KEY, "Content-Type": "application/json", "User-Agent": "NewsFlow-Pipeline/2.0"}
    for attempt in range(1, retries + 1):
        try:
            response = requests.post(endpoint, json=payload, headers=headers, timeout=15)
            if response.status_code in (200, 201):
                data = response.json()
                logger.info(f"  Published: /article/{data.get('article', {}).get('slug', '?')}")
                return data
            if response.status_code in (400, 401, 403):
                logger.error(f"  HTTP {response.status_code} (not retrying): {response.text[:200]}")
                return None
            logger.warning(f"  HTTP {response.status_code} (attempt {attempt}/{retries}): {response.text[:120]}")
        except requests.exceptions.RequestException as e:
            logger.warning(f"  Connection error (attempt {attempt}/{retries}): {e}")
        time.sleep(2 * attempt)
    return None


def _direct_sqlite_fallback(payload: Dict[str, Any], article) -> str:
    import sqlite3, re, hashlib
    db_path = os.path.join(NEWSFLOW_WEB_DIR, "prisma", "dev.db")
    if not os.path.exists(db_path):
        return False
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cat_name = payload.get("category", "Tech & Innovation")
        cat_slug = re.sub(r"[^a-z0-9]+", "-", cat_name.lower()).strip("-")
        cur.execute("SELECT id FROM Category WHERE slug=? OR name=?", (cat_slug, cat_name))
        row = cur.fetchone()
        now_ms = int(datetime.utcnow().timestamp() * 1000)
        if row:
            cat_id = row[0]
        else:
            cat_id = "c" + hashlib.md5(cat_slug.encode()).hexdigest()[:20]
            cur.execute("INSERT OR IGNORE INTO Category (id,name,slug,description,display_order,created_at) VALUES(?,?,?,?,?,?)",
                        (cat_id, cat_name, cat_slug, f"Latest in {cat_name}", 0, now_ms))
            cur.execute("SELECT id FROM Category WHERE slug=? OR name=?", (cat_slug, cat_name))
            re_row = cur.fetchone()
            if re_row:
                cat_id = re_row[0]

        slug_base = re.sub(r"[^a-z0-9]+", "-", payload["title"].lower()).strip("-")[:80]
        slug = slug_base
        cur.execute("SELECT id FROM Article WHERE slug=?", (slug,))
        if cur.fetchone():
            slug = f"{slug_base}-{article.id}"
        art_id = "c" + hashlib.md5(f"{article.id}{slug}".encode()).hexdigest()[:20]
        body = payload.get("body", "")
        cur.execute("""INSERT OR IGNORE INTO Article
            (id,slug,title,summary,body,cover_image_url,categoryId,author,published_at,status,
             rank_score,is_featured,reading_time_minutes,source_url,created_at,updated_at,views_count)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (art_id, slug, payload["title"], payload.get("summary",""), body,
             payload.get("cover_image_url"), cat_id, payload.get("author","NewsFlow AI"),
             now_ms, payload.get("status", "draft"), payload.get("rank_score",75), 1 if payload.get("is_featured") else 0,
             max(1, len(body.split())//200), payload.get("source_url"), now_ms, now_ms, 0))
        conn.commit()
        conn.close()
        logger.info(f"  [SQLite Fallback] slug='{slug}'")
        return slug
    except Exception as e:
        logger.warning(f"  SQLite fallback error: {e}")
        return False


CATEGORY_IMAGE_POOLS = {
    "AI & Robotics": [
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1617791160505-6f008e1e263c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1516110833967-0b5788f6a9e1?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    ],
    "Startups & VC": [
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    ],
    "Gadgets & Hardware": [
        "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1600&q=80",
    ],
    "Cybersecurity": [
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80",
    ],
    "Policy & Big Tech": [
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=80",
    ],
    "Tech & Innovation": [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1600&q=80",
    ],
}

CATEGORY_FALLBACKS = {k: v[0] for k, v in CATEGORY_IMAGE_POOLS.items()}

def get_fallback_image(cat_name: str, seed: str = "") -> str:
    pool = CATEGORY_IMAGE_POOLS.get(cat_name, CATEGORY_IMAGE_POOLS["Tech & Innovation"])
    idx = abs(hash(seed or "article")) % len(pool)
    return pool[idx]

DOMAIN_MAP = {
    "ai-robotics": "AI & Robotics", "startups-vc": "Startups & VC",
    "gadgets-hardware": "Gadgets & Hardware", "cybersecurity": "Cybersecurity",
    "policy-big-tech": "Policy & Big Tech", "tech": "Tech & Innovation",
}


def _resolve_category(article) -> str:
    import re
    cat = article.category or "Tech & Innovation"
    if article.rank_reason and "Domain [" in article.rank_reason:
        m = re.search(r"Domain \[([a-z\-]+)\]", article.rank_reason)
        if m:
            cat = DOMAIN_MAP.get(m.group(1), cat)
    c = cat.lower()
    if "ai" in c or "robot" in c or "llm" in c or "agent" in c:
        return "AI & Robotics"
    if "startup" in c or "venture" in c or "vc" in c:
        return "Startups & VC"
    if "hardware" in c or "gadget" in c or "chip" in c:
        return "Gadgets & Hardware"
    if "cyber" in c or "security" in c or "hack" in c:
        return "Cybersecurity"
    if "policy" in c or "big tech" in c or "regulation" in c:
        return "Policy & Big Tech"
    return "Tech & Innovation"


def publish_to_web(article_id: int, status: str = "draft") -> Dict[str, Any]:
    with get_session() as session:
        article = session.query(Article).filter(Article.id == article_id).first()
        if not article:
            return {"success": False, "error": "Article not found"}

        if article.web_posted and getattr(article, "web_slug", None):
            return {"success": True, "slug": article.web_slug,
                    "url": f"{WEB_URL}/article/{article.web_slug}", "method": "already_published"}

        title = (getattr(article, "ai_headline", None) or article.title or "").strip()
        if not title:
            return {"success": False, "error": "No title"}

        body = (getattr(article, "final_body", None) or article.body or "").strip()
        if len(body) < 30:
            body = title

        summary = (getattr(article, "ai_summary", None) or article.twitter_text
                   or (body[:250] + "..." if len(body) > 250 else body))

        cat_name = _resolve_category(article)

        cover_img = None
        scraped_path = getattr(article, "scraped_image_path", None)
        scraped_url = getattr(article, "scraped_image_url", None)
        if scraped_path and os.path.exists(scraped_path):
            cover_img = copy_image_to_web(article_id, scraped_path)
        if not cover_img and scraped_url:
            cover_img = scraped_url
        if not cover_img:
            cover_img = get_fallback_image(cat_name, title or str(article_id))

        payload = {
            "title": title, "summary": summary, "body": body,
            "category": cat_name,
            "source_url": article.url, "author": "NewsFlow AI",
            "status": status, "is_featured": False,
            "cover_image_url": cover_img,
            "published_at": datetime.utcnow().isoformat() + "Z",
        }

        res = send_article_to_web(payload)
        slug = None
        method = "http"
        if res and res.get("article"):
            slug = res["article"].get("slug")

        if not slug:
            method = "sqlite_fallback"
            slug = _direct_sqlite_fallback(payload, article)

        if slug:
            article.web_posted = True
            article.web_slug = str(slug)
            article.web_status = (res.get("article", {}).get("status") if res else None) or status
            article.web_published_at = datetime.utcnow()
            session.commit()
            return {"success": True, "slug": slug, "url": f"{WEB_URL}/article/{slug}",
                    "method": method, "cover_image": cover_img, "status": status}
        return {"success": False, "error": "Failed via HTTP and SQLite fallback"}


def publish_all_scraped(limit: int = None, skip_posted: bool = True, status: str = "draft") -> Dict[str, Any]:
    """Publish ALL scraped articles line-by-line to NewsFlow Admin & Web."""
    results = {"published": 0, "failed": 0, "items": []}
    with get_session() as session:
        q = session.query(Article)
        if skip_posted:
            q = q.filter(Article.web_posted == False)
        q = q.order_by(Article.scraped_at.desc())
        if limit:
            q = q.limit(limit)
        article_ids = [a.id for a in q.all()]

    logger.info(f"Uploading {len(article_ids)} articles to NewsFlow Admin (status={status})...")
    for aid in article_ids:
        try:
            res = publish_to_web(aid, status=status)
            if res.get("success"):
                results["published"] += 1
                results["items"].append({"id": aid, "slug": res.get("slug"),
                                          "url": res.get("url"), "method": res.get("method"), "status": status})
                logger.info(f"  OK #{aid} -> {res.get('url')} ({status})")
            else:
                results["failed"] += 1
        except Exception as e:
            results["failed"] += 1
            logger.error(f"  ERR #{aid}: {e}")
    return results


def sync_web_status() -> Dict[str, Any]:
    """Mirror NewsFlow Admin status (draft / published / scheduled) back into the dashboard DB."""
    result = {"checked": 0, "updated": 0, "missing": 0, "error": None}
    with get_session() as session:
        rows = session.query(Article).filter(Article.web_posted == True, Article.web_slug != None).all()  # noqa: E712,E711
        by_slug = {a.web_slug: a for a in rows}
        slugs = list(by_slug.keys())
        if not slugs:
            return result
        headers = {"x-api-key": API_KEY, "User-Agent": "NewsFlow-Pipeline/2.0"}
        try:
            for i in range(0, len(slugs), 100):
                chunk = slugs[i:i + 100]
                r = requests.get(f"{WEB_URL}/api/articles/status", params={"slugs": ",".join(chunk)},
                                 headers=headers, timeout=15)
                if r.status_code != 200:
                    result["error"] = f"HTTP {r.status_code}"
                    break
                data = r.json()
                for item in data.get("items", []):
                    art = by_slug.get(item["slug"])
                    result["checked"] += 1
                    if art and art.web_status != item["status"]:
                        art.web_status = item["status"]
                        result["updated"] += 1
                result["missing"] += len(data.get("missing", []))
            session.commit()
        except requests.exceptions.RequestException as e:
            result["error"] = f"Website unreachable: {e}"
    return result


def publish_all_ready(limit: int = 10) -> int:
    """Backwards-compatible alias — now publishes all scraped without ranking gate."""
    return publish_all_scraped(limit=limit)["published"]


if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--id", type=int)
    p.add_argument("--all", action="store_true")
    p.add_argument("--limit", type=int, default=None)
    p.add_argument("--repub", action="store_true")
    args = p.parse_args()
    if args.id:
        print(json.dumps(publish_to_web(args.id), indent=2))
    elif args.all:
        r = publish_all_scraped(limit=args.limit, skip_posted=not args.repub)
        print(f"Published: {r['published']}, Failed: {r['failed']}")
    else:
        p.print_help()
