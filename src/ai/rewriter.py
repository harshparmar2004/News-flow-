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
            f"Article Content: {article.body}\n\n"
            f"Act as a premier AI technology journalist and analyst for the '{niche}' ecosystem.\n"
            f"Synthesize our own original, highly insightful editorial context based on this scraped report from {article.source}.\n"
            f"Reference the scraped source ({article.source}) clearly and professionally. Ensure all sentences are grammatically complete and end with proper punctuation.\n"
            f"Return strictly a JSON object with these keys:\n"
            "- 'twitter_text': sharp, high-impact tweet under 280 characters with hashtags and credit to the source\n"
            "- 'linkedin_text': strategic 2-paragraph analysis exploring market disruption, key takeaways, and a call for professional commentary\n"
            "- 'instagram_caption': compelling 2-paragraph summary with key takeaways and 5-8 relevant hashtags\n"
            "- 'reddit_title': informative, objective headline under 300 characters framing the core breakthrough\n"
            "- 'reddit_body': 2 comprehensive paragraphs providing context, analysis of industry impact, source reference, and an engaging discussion question for the community\n"
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
                    if len(" ".join(sentences)) >= 250:
                        break
            
            if sentences:
                extracted_context = ". ".join(sentences) + "."
            else:
                extracted_context = f"Leading industry coverage from {article.source} highlights key strategic shifts surrounding '{clean_title}', signaling notable ecosystem disruption."

            tags = f"#{niche.replace(' ', '').replace(',', '').replace('&', '')} #TechNews #Innovation #AI"

            data = {
                "twitter_text": f"🚨 {clean_title[:180]}... via @{article.source}\n\n{tags[:40]}",
                "linkedin_text": f"📌 Strategic Analysis: {clean_title}\n\n{extracted_context}\n\nThis development from {article.source} marks a notable milestone for {niche}. What is your perspective on this direction?\n\n{tags}",
                "instagram_caption": f"✨ In-Depth: {clean_title}\n\n{extracted_context}\n\nOriginally reported by {article.source}. Drop your thoughts below! 👇\n\n{tags} #NewsFlow",
                "reddit_title": f"{clean_title} — Analysis & Discussion",
                "reddit_body": f"{extracted_context}\n\nWhat are your thoughts on this move and its broader impact on the ecosystem?\n\nReference: {article.source} ({article.url})"
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
