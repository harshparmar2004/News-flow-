"""
NewsFlow Web Publisher
Publishes AI-rewritten articles from the NewsFlow Python pipeline directly to the NewsFlow Web site via its REST API.
"""

import os
import sys
import json
import logging
import requests
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


def send_article_to_web(payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Directly dispatch an article payload to the NewsFlow Web REST API.
    """
    endpoint = f"{WEB_URL}/api/articles"
    headers = {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
        "User-Agent": "NewsFlow-Pipeline/2.0",
    }

    try:
        response = requests.post(endpoint, json=payload, headers=headers, timeout=15)
        if response.status_code in (200, 201):
            data = response.json()
            logger.info(f"Published to NewsFlow Web: {data.get('article', {}).get('url')}")
            return data
        else:
            logger.error(f"Failed publishing to Web ({response.status_code}): {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Connection error to NewsFlow Web ({endpoint}): {e}")
        return None


def publish_to_web(article_id: int) -> bool:
    """
    Fetch an article by ID from the pipeline DB and publish it to NewsFlow Web.
    """
    with get_session() as session:
        article = session.query(Article).filter(Article.id == article_id).first()
        if not article:
            logger.warning(f"Article {article_id} not found in pipeline DB.")
            return False

        summary = article.twitter_text or article.linkedin_text or article.reddit_title or article.title
        if len(summary) > 280:
            summary = summary[:277] + "..."

        body_content = article.reddit_body or article.body
        if not body_content or len(body_content.strip()) < 50:
            body_content = article.body

        cat_name = article.category or "AI & Robotics"
        if article.rank_reason and "Domain [" in article.rank_reason:
            import re
            m = re.search(r"Domain \[([a-z\-]+)\]", article.rank_reason)
            if m:
                DOMAIN_MAP = {
                    "ai-robotics": "AI & Robotics",
                    "startups-vc": "Startups & VC",
                    "gadgets-hardware": "Gadgets & Hardware",
                    "cybersecurity": "Cybersecurity",
                    "policy-big-tech": "Policy & Big Tech",
                    "tech": "Tech & Innovation"
                }
                cat_name = DOMAIN_MAP.get(m.group(1), cat_name)
        elif "ai" in cat_name.lower():
            cat_name = "AI & Robotics"
        elif "startup" in cat_name.lower():
            cat_name = "Startups & VC"
        elif "hardware" in cat_name.lower() or "gadget" in cat_name.lower():
            cat_name = "Gadgets & Hardware"
        elif "sec" in cat_name.lower() or "cyber" in cat_name.lower():
            cat_name = "Cybersecurity"
        elif "policy" in cat_name.lower() or "gov" in cat_name.lower():
            cat_name = "Policy & Big Tech"
        else:
            cat_name = "Tech & Innovation"

        CATEGORY_IMAGES = {
            "AI & Robotics": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
            "Startups & VC": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80",
            "Gadgets & Hardware": "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1600&q=80",
            "Cybersecurity": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
            "Policy & Big Tech": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
            "Tech & Innovation": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
        }

        cover_img = CATEGORY_IMAGES.get(cat_name, CATEGORY_IMAGES["AI & Robotics"])
        if article.image_path and os.path.exists(article.image_path):
            cover_img = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80"

        payload = {
            "title": article.title,
            "summary": summary,
            "body": body_content,
            "category": cat_name,
            "rank_score": article.rank_score or 80,
            "source_url": article.url,
            "author": "NewsFlow AI",
            "status": "published",
            "is_featured": (article.rank_score or 0) >= 90,
            "cover_image_url": cover_img,
        }

        res = send_article_to_web(payload)
        if res and res.get("success"):
            article.web_posted = True
            session.commit()
            return True
        return False


def publish_all_ready(limit: int = 10) -> int:
    """
    Publishes up to `limit` unposted articles in 'ready' or 'scraped' status to NewsFlow Web.
    """
    count = 0
    with get_session() as session:
        articles = (
            session.query(Article)
            .filter(Article.status.in_(["ready", "scraped"]), Article.web_posted == False)
            .order_by(Article.rank_score.desc())
            .limit(limit)
            .all()
        )
        for art in articles:
            logger.info(f"Dispatching story #{art.id} (Score: {art.rank_score}) '{art.title[:35]}...' to NewsFlow Web...")
            if publish_to_web(art.id):
                count += 1
    return count


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Publish NewsFlow articles to NewsFlow Web")
    parser.add_argument("--id", type=int, help="Publish single article ID")
    parser.add_argument("--all", action="store_true", help="Publish top ready articles")
    parser.add_argument("--test", action="store_true", help="Publish a simulated test article")
    args = parser.parse_args()

    if args.test:
        test_payload = {
            "title": "Autonomous Agent Swarms Achieve Near-Zero Error Rate in Production Microservices",
            "summary": "Benchmarking autonomous multi-agent consensus protocols against human site-reliability engineering incident response times.",
            "body": "## The SRE Paradigm Transition\n\nProduction reliability engineering has crossed an inflection point. In testing across 12 distributed Kubernetes clusters, cooperative agent swarms identified and rolled back cascading network failures in an average of 4.2 seconds compared to 14 minutes for human on-call teams.\n\n### Key Architectural Findings\n\n1. **Parallel Consensus Audits:** Microservice state is evaluated by 3 independent critic models.\n2. **Automated Rollback Safeguards:** Canary stages are isolated before traffic degradation hits 0.1% of end users.\n\n> The bottleneck is no longer debugging speed; it is trusting autonomous systems with administrative root capability.\n\n### The Future of Infrastructure\n\nAs foundational models incorporate formal verification tools directly into their deduction loops, autonomous operations desks will become standard enterprise architecture by late 2027.",
            "category": "AI & Robotics",
            "cover_image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
            "source_url": "https://news.ycombinator.com",
            "rank_score": 97,
            "is_featured": True,
            "tags": ["Autonomous Agents", "SRE", "DevOps", "Infrastructure"],
            "affiliate_links": [
                {
                    "label": "Designing Data-Intensive Applications (Martin Kleppmann)",
                    "url": "https://amazon.com/dp/1449373321?tag=newsflow-20",
                    "price": "$42.50",
                    "badge": "Recommended Reading",
                    "description": "The indispensable reference for distributed systems architects."
                }
            ],
            "seo_meta": {
                "title": "Autonomous Agent Swarms in Production SRE | NewsFlow",
                "description": "How autonomous AI agents are replacing traditional on-call incident response."
            }
        }
        res = send_article_to_web(test_payload)
        print("Test publish result:", res)
    elif args.id:
        success = publish_to_web(args.id)
        print(f"Article {args.id} publish success: {success}")
    elif args.all:
        total = publish_all_ready()
        print(f"Published {total} articles to NewsFlow Web.")
    else:
        parser.print_help()