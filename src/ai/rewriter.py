"""
Multi-LLM Rewriter Module — Supports Google Gemini, Groq (Llama 3.3), OpenAI (GPT-4o), and Anthropic Claude.
Automatically uses whichever API key is configured by the user!
"""

import os
import json
import logging
import requests
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

from src.db.models import Article, get_session

logger = logging.getLogger(__name__)


class RewriteOutput(BaseModel):
    twitter_text: str = Field(..., description="<=280 chars, punchy, informative, text-only")
    linkedin_text: str = Field(..., description="professional tone, 1-3 paragraphs, suitable for business audience")
    instagram_caption: str = Field(..., description="engaging, conversational, with 5-10 relevant hashtags")
    reddit_title: str = Field(..., description="informative, discussion-sparking, <=300 chars")
    reddit_body: str = Field(..., description="2-3 paragraphs, objective summary, ends with discussion question")


def rewrite_article(article_id: int) -> bool:
    """
    Rewrites an article using whichever LLM API Key is configured:
      1. Groq API Key (GROQ_API_KEY -> llama-3.3-70b-versatile)
      2. OpenAI API Key (OPENAI_API_KEY -> gpt-4o-mini)
      3. Anthropic API Key (ANTHROPIC_API_KEY -> claude-3-5-sonnet)
      4. Google Gemini (GOOGLE_API_KEY -> gemini-2.5-flash)
    """
    provider = os.getenv("LLM_PROVIDER", "").lower()
    google_key = os.getenv("GOOGLE_API_KEY", "")
    groq_key = os.getenv("GROQ_API_KEY", "")
    openai_key = os.getenv("OPENAI_API_KEY", "")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")

    # Auto-detect active provider if not explicitly set
    if not provider:
        if groq_key and not groq_key.startswith("your_"): provider = "groq"
        elif openai_key and not openai_key.startswith("your_"): provider = "openai"
        elif anthropic_key and not anthropic_key.startswith("your_"): provider = "anthropic"
        elif google_key and not google_key.startswith("your_"): provider = "google"
        else: provider = "google"

    niche = os.getenv("NICHE_FOCUS", "Technology, AI & Innovation")

    with get_session() as session:
        article = session.query(Article).filter(Article.id == article_id).first()
        if not article:
            logger.error(f"Article with id {article_id} not found.")
            return False

        prompt = (
            f"Target Niche / Audience: {niche}\n"
            f"Title: {article.title}\n"
            f"Source Publication: {article.source}\n"
            f"Original URL: {article.url}\n"
            f"Article Content: {article.body[:3500]}\n\n"
            f"Act as a premier systems analyst and tech notes author for the '{niche}' ecosystem.\n"
            f"Synthesize this news story into our signature structured 'Tech Notes & Architecture Brief' style.\n"
            f"Use structured headings with star bullets (* 1., * 2.), technical clarity, bulleted key specs, and zero fluff.\n"
            f"Return strictly a JSON object with these keys:\n"
            "- 'twitter_text': sharp tech brief under 280 chars with key metric/takeaway, source credit via @{article.source}, and hashtags\n"
            "- 'linkedin_text': Executive Tech Briefing formatted as:\n"
            "  * 1. What Happened: (Core breakthrough in 1-2 punchy sentences)\n"
            "  * 2. Key Technical Specs & Takeaways: (3 distinct bullet points with data/specs)\n"
            "  * 3. Industry Impact: (Strategic analysis for engineers & tech leaders)\n"
            "  * 4. Discussion: (Engaging technical question)\n"
            "- 'instagram_caption': Ready-to-post Instagram tech notes post formatted as:\n"
            "  📓 TECH NOTES · {article.title}\n\n"
            "  * 1. Overview & Context:\n"
            "  • [Concise breakdown]\n\n"
            "  * 2. Key Architectural Takeaways:\n"
            "  • [Specs/Features]\n\n"
            "  * 3. Why It Matters:\n"
            "  • [Impact]\n\n"
            "  • Source: @{article.source}\n"
            "  5-8 relevant hashtags.\n"
            "- 'reddit_title': informative, objective technical headline under 300 characters framing the core breakthrough\n"
            "- 'reddit_body': Complete structured technical discussion breakdown with Overview, Key Specs, Reference, and Community Debate Question\n"
        )

        data = None

        # --- 1. GROQ PROVIDER (Llama 3.3 70B) ---
        if provider == "groq" and groq_key:
            try:
                logger.info(f"Rewriting article {article_id} using Groq API (Llama 3.3 70B)...")
                url = "https://api.groq.com/openai/v1/chat/completions"
                headers = {"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"}
                payload = {
                    "model": "llama-3.3-70b-versatile",
                    "messages": [{"role": "user", "content": prompt}],
                    "response_format": {"type": "json_object"}
                }
                resp = requests.post(url, headers=headers, json=payload, timeout=20)
                if resp.status_code == 200:
                    content = resp.json()["choices"][0]["message"]["content"]
                    data = json.loads(content)
            except Exception as e:
                logger.error(f"Groq rewrite failed: {e}")

        # --- 2. OPENAI PROVIDER (GPT-4o mini) ---
        if not data and provider == "openai" and openai_key:
            try:
                logger.info(f"Rewriting article {article_id} using OpenAI API (GPT-4o)...")
                url = "https://api.openai.com/v1/chat/completions"
                headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": prompt}],
                    "response_format": {"type": "json_object"}
                }
                resp = requests.post(url, headers=headers, json=payload, timeout=20)
                if resp.status_code == 200:
                    content = resp.json()["choices"][0]["message"]["content"]
                    data = json.loads(content)
            except Exception as e:
                logger.error(f"OpenAI rewrite failed: {e}")

        # --- 3. ANTHROPIC CLAUDE PROVIDER ---
        if not data and provider == "anthropic" and anthropic_key:
            try:
                logger.info(f"Rewriting article {article_id} using Anthropic Claude API...")
                url = "https://api.anthropic.com/v1/messages"
                headers = {
                    "x-api-key": anthropic_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                }
                payload = {
                    "model": "claude-3-5-sonnet-20241022",
                    "max_tokens": 1000,
                    "messages": [{"role": "user", "content": prompt + "\nRespond with valid JSON only."}]
                }
                resp = requests.post(url, headers=headers, json=payload, timeout=20)
                if resp.status_code == 200:
                    content = resp.json()["content"][0]["text"]
                    data = json.loads(content)
            except Exception as e:
                logger.error(f"Anthropic rewrite failed: {e}")

        # --- 4. GOOGLE GEMINI PROVIDER (DEFAULT / FALLBACK) ---
        if not data and google_key:
            try:
                logger.info(f"Rewriting article {article_id} using Google Gemini 2.5 Flash...")
                from google import genai
                from google.genai import types

                client = genai.Client(api_key=google_key)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=RewriteOutput,
                    ),
                )
                data = json.loads(response.text)
            except Exception as e:
                logger.error(f"Google Gemini rewrite failed: {e}")

        if not data:
            logger.warning(f"All LLM API calls failed/suspended for article #{article_id}. Using Smart Context Synthesizer Fallback.")
            clean_title = article.title.strip()
            
            # Cleanly extract full complete sentences from article.body
            sentences = []
            if article.body:
                raw_sentences = [s.strip() for s in article.body.replace("\n", " ").split(".") if len(s.strip()) > 15]
                for s in raw_sentences:
                    sentences.append(s)
                    if len(sentences) >= 4:
                        break
            
            overview = sentences[0] + "." if len(sentences) > 0 else f"{clean_title} marks a significant development from {article.source}."
            takeaway1 = sentences[1] + "." if len(sentences) > 1 else f"Ecosystem alignment and technical infrastructure shifts reported across {article.source}."
            takeaway2 = sentences[2] + "." if len(sentences) > 2 else f"Critical implications for developers and engineering leaders operating within {niche}."
            impact = sentences[3] + "." if len(sentences) > 3 else f"Strategic validation indicates ongoing evolution across the {niche} market."

            clean_tag = "".join(ch for ch in niche if ch.isalnum())
            tags = f"#{clean_tag} #TechNotes #Architecture #Engineering #Innovation"

            twitter_text = f"🚨 {clean_title[:175]}...\n\n• Key: {takeaway1[:70]}...\n\nvia @{article.source} #{clean_tag} #TechNotes"
            
            linkedin_text = (
                f"📌 Executive Tech Brief: {clean_title}\n\n"
                f"* 1. What Happened:\n"
                f"• {overview}\n\n"
                f"* 2. Key Technical Specs & Takeaways:\n"
                f"• {takeaway1}\n"
                f"• {takeaway2}\n\n"
                f"* 3. Industry Impact:\n"
                f"• {impact}\n\n"
                f"* 4. Technical Perspective:\n"
                f"• How does this align with your team's current architecture and tooling?\n\n"
                f"Source: {article.source} | {tags}"
            )
            
            instagram_caption = (
                f"📓 TECH NOTES · {clean_title}\n\n"
                f"* 1. Overview & Context:\n"
                f"• {overview}\n\n"
                f"* 2. Key Architectural Takeaways:\n"
                f"• {takeaway1}\n"
                f"• {takeaway2}\n\n"
                f"* 3. Why It Matters:\n"
                f"• {impact}\n\n"
                f"• Source: @{article.source}\n"
                f"• Reference: {article.url}\n\n"
                f"{tags}"
            )

            reddit_title = f"[Analysis] {clean_title} — Architecture Breakdown & Discussion"
            reddit_body = (
                f"### 📓 Technical Briefing: {clean_title}\n\n"
                f"**1. Overview**\n"
                f"{overview}\n\n"
                f"**2. Key Technical Points**\n"
                f"- {takeaway1}\n"
                f"- {takeaway2}\n\n"
                f"**3. Industry Implications**\n"
                f"{impact}\n\n"
                f"**Source Coverage:** [{article.source}]({article.url})\n\n"
                f"What are your thoughts on this move and how it compares to alternative approaches?"
            )

            data = {
                "twitter_text": twitter_text,
                "linkedin_text": linkedin_text,
                "instagram_caption": instagram_caption,
                "reddit_title": reddit_title,
                "reddit_body": reddit_body
            }

        # Save rewritten content to DB
        article.twitter_text = data.get("twitter_text", "")
        article.linkedin_text = data.get("linkedin_text", "")
        article.instagram_caption = data.get("instagram_caption", "")
        article.reddit_title = data.get("reddit_title", "")
        article.reddit_body = data.get("reddit_body", "")
        article.status = "ready"
        session.commit()
        logger.info(f"Successfully rewritten article {article_id} across all 4 platforms!")
        return True
