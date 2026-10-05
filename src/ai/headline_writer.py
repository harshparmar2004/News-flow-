"""
Editorial Desk Headline Writer.

Workflow:
  * Article body  = RAW extracted web text from the scraper (kept verbatim, editable by the editor).
  * AI LLM writes ONLY: headline, 1-2 sentence summary (dek), 3 key points, hashtags.

Uses whichever LLM key is configured (Groq -> OpenAI -> Anthropic -> Gemini),
with a deterministic offline fallback so the desk always works.
"""

import os
import re
import json
import logging
from datetime import datetime
from typing import Optional, Dict, Any

import requests

from src.db.models import Article, get_session

logger = logging.getLogger(__name__)


def _valid(key: str) -> bool:
    return bool(key) and not key.startswith("your_")


def call_llm_json(prompt: str, timeout: int = 25) -> Optional[Dict[str, Any]]:
    """Calls the first configured LLM provider and returns parsed JSON (or None)."""
    provider = os.getenv("LLM_PROVIDER", "").lower()
    groq_key = os.getenv("GROQ_API_KEY", "")
    openai_key = os.getenv("OPENAI_API_KEY", "")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")
    google_key = os.getenv("GOOGLE_API_KEY", "")

    order = ["groq", "openai", "anthropic", "google"]
    if provider in order:
        order.remove(provider)
        order.insert(0, provider)

    for p in order:
        try:
            if p == "groq" and _valid(groq_key):
                r = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
                    json={"model": "llama-3.3-70b-versatile",
                          "messages": [{"role": "user", "content": prompt}],
                          "response_format": {"type": "json_object"}},
                    timeout=timeout,
                )
                if r.status_code == 200:
                    return json.loads(r.json()["choices"][0]["message"]["content"])
            elif p == "openai" and _valid(openai_key):
                r = requests.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"},
                    json={"model": "gpt-4o-mini",
                          "messages": [{"role": "user", "content": prompt}],
                          "response_format": {"type": "json_object"}},
                    timeout=timeout,
                )
                if r.status_code == 200:
                    return json.loads(r.json()["choices"][0]["message"]["content"])
            elif p == "anthropic" and _valid(anthropic_key):
                r = requests.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={"x-api-key": anthropic_key, "anthropic-version": "2023-06-01",
                             "content-type": "application/json"},
                    json={"model": "claude-3-5-sonnet-20241022", "max_tokens": 800,
                          "messages": [{"role": "user", "content": prompt + "\nRespond with valid JSON only."}]},
                    timeout=timeout,
                )
                if r.status_code == 200:
                    text = r.json()["content"][0]["text"]
                    m = re.search(r"\{.*\}", text, re.S)
                    return json.loads(m.group(0) if m else text)
            elif p == "google" and _valid(google_key):
                from google import genai
                from google.genai import types
                client = genai.Client(api_key=google_key)
                resp = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config=types.GenerateContentConfig(response_mime_type="application/json"),
                )
                return json.loads(resp.text)
        except Exception as e:
            logger.warning(f"LLM provider '{p}' failed: {e}")
    return None


def _sentences(text: str):
    text = re.sub(r"\s+", " ", text or "").strip()
    parts = re.split(r"(?<=[.!?])\s+", text)
    return [s.strip() for s in parts if len(s.strip()) > 25]


def _fallback(article: Article, niche: str) -> Dict[str, Any]:
    sents = _sentences(article.body)
    title = (article.title or "").strip()
    summary = " ".join(sents[:2]) if sents else f"{title} — reported by {article.source}."
    points = sents[2:5] if len(sents) > 4 else sents[:3]
    tag = "".join(ch for ch in niche.split(",")[0] if ch.isalnum()) or "Tech"
    return {
        "headline": title,
        "summary": summary[:400],
        "key_points": points or [f"Original reporting by {article.source}."],
        "hashtags": [f"#{tag}", "#TechNews", "#AI", f"#{(article.source or 'News').replace(' ', '')}"],
        "_engine": "offline-fallback",
    }


def write_headline(article_id: int, persist: bool = True) -> Optional[Dict[str, Any]]:
    """Generates AI headline/summary/key points for an article. Body is never rewritten."""
    niche = os.getenv("NICHE_FOCUS", "Technology, AI & Innovation")
    try:
        from src.ai.ranker import get_ranking_rules
        niche = get_ranking_rules().get("target_niche", niche) or niche
    except Exception:
        pass

    with get_session() as session:
        a = session.query(Article).filter(Article.id == article_id).first()
        if not a:
            return None

        style = os.getenv("HEADLINE_STYLE", "Clear, specific, curiosity-driven, no clickbait, max 14 words")
        prompt = (
            f"You are the headline editor for a '{niche}' news page.\n"
            f"Original title: {a.title}\nSource: {a.source}\n"
            f"Raw article text (do NOT rewrite it):\n{(a.body or '')[:4000]}\n\n"
            f"Write ONLY the packaging for this article. Headline style: {style}.\n"
            "Return strict JSON with keys:\n"
            "- 'headline': string\n"
            "- 'summary': 1-2 sentence dek, factual, under 45 words\n"
            "- 'key_points': array of exactly 3 short factual bullets taken from the text\n"
            "- 'hashtags': array of 4-6 hashtags\n"
        )
        data = call_llm_json(prompt) or {}
        if not data.get("headline"):
            data = _fallback(a, niche)
        else:
            data["_engine"] = "llm"

        kp = data.get("key_points") or []
        if isinstance(kp, str):
            kp = [x.strip("•-* ").strip() for x in kp.splitlines() if x.strip()]
        tags = data.get("hashtags") or []
        if isinstance(tags, str):
            tags = tags.split()

        if persist:
            a.ai_headline = str(data.get("headline", a.title)).strip()[:300]
            a.ai_summary = str(data.get("summary", "")).strip()
            a.ai_key_points = "\n".join(str(x).strip() for x in kp[:5])
            a.ai_hashtags = " ".join(str(t).strip() for t in tags[:8])
            if not a.final_body:
                a.final_body = a.body
            if a.status == "scraped":
                a.status = "ready"
            session.commit()

        return {
            "headline": data.get("headline"),
            "summary": data.get("summary"),
            "key_points": kp,
            "hashtags": tags,
            "engine": data.get("_engine"),
        }


def compose_post(a: Article) -> str:
    """Builds the final post text: AI headline + AI summary + key points + RAW body + source."""
    headline = a.ai_headline or a.title
    body = a.final_body or a.body or ""
    parts = [headline, ""]
    if a.ai_summary:
        parts += [a.ai_summary, ""]
    if a.ai_key_points:
        parts += ["Key points:"] + [f"• {p}" for p in a.ai_key_points.splitlines() if p.strip()] + [""]
    parts += [body.strip(), "", f"Source: {a.source} — {a.url}"]
    if a.ai_hashtags:
        parts += ["", a.ai_hashtags]
    return "\n".join(parts)
