import time
import logging
import datetime
from typing import List, Dict, Any
from urllib.parse import urlparse

import feedparser
from robotexclusionrulesparser import RobotExclusionRulesParser
import trafilatura
from newspaper import Article as NewspaperArticle

logger = logging.getLogger(__name__)

rerp = RobotExclusionRulesParser()

def is_allowed(url: str, user_agent: str = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)') -> bool:
    """
    Check if scraping the URL is allowed by the site's robots.txt.
    """
    try:
        parsed_url = urlparse(url)
        robots_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"
        rerp.fetch(robots_url)
        allowed = rerp.is_allowed(user_agent, url)
        return True if allowed is None else allowed
    except Exception as e:
        logger.warning(f"Failed to check robots.txt for {url}: {e}")
        return True


def is_scrambled_or_paywalled(text: str) -> bool:
    """Detect if scraped text contains client-side paywall ciphers or obfuscated gibberish."""
    if not text:
        return False
    import re
    # Explicit known cipher signatures
    if re.search(r'\b(?:jjxhkt|ekcbkte|jcojgtbv|fqwmbbuemooku|fmzyptoz|gwqwydcl|uzckrtsgqqtr|znddhrt|djbksuneb|pmdoveevd|amzlzvfer)\b', text, re.I):
        return True
    # Frequency check: high ratio of vowel-deficient non-English words
    words = re.findall(r'\b[a-zA-Z]{5,}\b', text[:1500])
    if len(words) >= 15:
        vowel_poor = sum(1 for w in words if sum(1 for c in w.lower() if c in 'aeiou') <= 1)
        if vowel_poor / len(words) > 0.40:
            return True
    return False


def scrape_feed(source: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Scrape an RSS/Atom feed based on the provided source configuration.
    """
    name = source.get('name', 'Unknown')
    feed_url = source.get('feed_url')
    max_articles = source.get('max_articles', 10)
    delay_seconds = source.get('delay_seconds', 2)
    category = source.get('category')
    subreddit = source.get('subreddit')

    if not feed_url:
        logger.error(f"No feed_url provided for source {name}")
        return []

    logger.info(f"Parsing feed for {name} from {feed_url}")
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        }
        feed = feedparser.parse(feed_url, request_headers=headers)
    except Exception as e:
        logger.error(f"Failed to parse feed {feed_url}: {e}")
        return []

    articles = []
    
    entries = feed.entries[:max_articles]
    
    # Fast pre-flight check: query existing hashes in 1 single batch query (0.001s)
    from src.scraper.dedupe import filter_unscraped_urls, compute_url_hash
    candidate_links = [e.get('link') for e in entries if e.get('link')]
    existing_hashes = filter_unscraped_urls(candidate_links)

    for entry in entries:
        try:
            url = entry.get('link')
            title = entry.get('title')
            
            if not url or not title:
                logger.warning(f"Missing url or title for entry in {name} feed, skipping.")
                continue

            # Skip immediately if already scraped — saves network download and delay
            url_h = compute_url_hash(url)
            if url_h in existing_hashes:
                logger.debug(f"Pre-flight skip (already stored): {url}")
                continue

            # Parse published date
            published_at = datetime.datetime.utcnow()
            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                published_at = datetime.datetime(*entry.published_parsed[:6])

            logger.info(f"Fetching article content for: {url}")
            body = None
            author = None
            
            # Fetch with trafilatura
            downloaded = trafilatura.fetch_url(url)
            if downloaded:
                extracted = trafilatura.extract(downloaded, output_format="json")
                if extracted:
                    import json
                    try:
                        ext_dict = json.loads(extracted)
                        body = ext_dict.get('text')
                        author = ext_dict.get('author')
                    except Exception:
                        body = trafilatura.extract(downloaded)

            # Fallback to newspaper3k
            if not body or not body.strip():
                logger.debug(f"Trafilatura failed or empty for {url}, falling back to newspaper3k.")
                try:
                    np_article = NewspaperArticle(url)
                    if downloaded:
                        np_article.set_html(downloaded)
                        np_article.parse()
                    else:
                        np_article.download()
                        np_article.parse()
                    body = np_article.text
                    if not author and np_article.authors:
                        author = ", ".join(np_article.authors)
                except Exception as npe:
                    logger.debug(f"Newspaper3k fallback failed for {url}: {npe}")

            # Check if extracted body was obfuscated by client-side paywall ciphers (e.g. Sifted/Caesar cipher)
            if body and is_scrambled_or_paywalled(body):
                logger.warning(f"Paywall/cipher gibberish detected in body for {url}! Discarding and using clean RSS summary.")
                body = None

            # Fallback to RSS entry content / summary if body is empty or scrambled
            if not body or not body.strip():
                if hasattr(entry, 'content') and entry.content:
                    body = entry.content[0].get('value', '')
                elif entry.get('summary'):
                    body = entry.get('summary')
                elif entry.get('description'):
                    body = entry.get('description')
                
                # Strip HTML tags if fallback text used
                if body:
                    from bs4 import BeautifulSoup
                    body = BeautifulSoup(body, 'html.parser').get_text()

            # Double-check fallback body against paywall ciphers
            if body and is_scrambled_or_paywalled(body):
                logger.warning(f"Fallback text also contained cipher gibberish for {url}, skipping.")
                continue

            if not body or not body.strip():
                logger.warning(f"Could not extract body text for {url}, skipping.")
                continue

            # Extract authentic lead image from RSS entry, HTML, or newspaper3k
            scraped_img_url = None
            try:
                from src.scraper.image_scraper import extract_image_from_feed_entry, extract_image_from_html
                scraped_img_url = extract_image_from_feed_entry(entry, url)
                if not scraped_img_url and downloaded:
                    scraped_img_url = extract_image_from_html(downloaded, url)
                if not scraped_img_url and 'np_article' in locals() and hasattr(np_article, 'top_image') and np_article.top_image:
                    scraped_img_url = np_article.top_image
            except Exception as img_err:
                logger.debug(f"Image extraction error for {url}: {img_err}")

            # Normalize and structure body with clean paragraph breaks & clean encoding
            try:
                from src.publishers.web_publisher import format_article_body_for_web
                body = format_article_body_for_web(body.strip(), title)
            except Exception:
                body = body.strip()

            articles.append({
                'title': title,
                'url': url,
                'body': body,
                'author': author,
                'published_at': published_at,
                'source': name,
                'category': category,
                'subreddit': subreddit,
                'scraped_image_url': scraped_img_url
            })

        except Exception as e:
            logger.error(f"Error scraping entry from {name}: {e}", exc_info=True)
            continue
        finally:
            if delay_seconds and delay_seconds > 0:
                time.sleep(min(delay_seconds, 0.4))

    return articles
