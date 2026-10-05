"""
Web Image Scraper Engine for NewsFlow Pipeline.
Extracts authentic lead editorial images from websites and RSS feeds using:
1. OpenGraph (og:image)
2. Twitter Cards (twitter:image)
3. Schema.org JSON-LD
4. RSS Media Enclosures & Media Content
5. DOM Lead Images
Includes downloading, caching, and validation.
"""

import os
import re
import json
import logging
import urllib.parse
from typing import Optional, Any
import requests
from bs4 import BeautifulSoup
from PIL import Image

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCRAPED_IMAGES_DIR = os.path.join(PROJECT_ROOT, "images", "scraped")
os.makedirs(SCRAPED_IMAGES_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

# Substrings that indicate non-editorial/tracking images
IGNORED_PATTERNS = [
    '1x1', 'pixel', 'spacer', 'favicon', 'avatar', 'logo', 'badge', 'emoji',
    'ad-', 'advertisement', 'tracking', 'stat.gif', 'beacon', 'icon', 'spinner',
    'loader', 'placeholder', 'button', 'banner_ad'
]


def is_valid_image_url(url: str) -> bool:
    """Validate that URL is http/https and does not match tracking/pixel patterns."""
    if not url or not isinstance(url, str):
        return False
    u = url.strip().lower()
    if not (u.startswith('http://') or u.startswith('https://')):
        return False
    if any(p in u for p in IGNORED_PATTERNS):
        return False
    return True


def extract_image_from_html(html: str, base_url: str) -> Optional[str]:
    """
    Extracts the primary lead/featured image URL from HTML content.
    Prioritizes OpenGraph, Twitter Cards, JSON-LD, then DOM article image.
    """
    if not html:
        return None

    try:
        soup = BeautifulSoup(html, 'html.parser')

        # 1. OpenGraph og:image
        og_img = soup.find('meta', property='og:image') or soup.find('meta', attrs={'name': 'og:image'})
        if og_img and og_img.get('content'):
            candidate = urllib.parse.urljoin(base_url, og_img['content'].strip())
            if is_valid_image_url(candidate):
                return candidate

        # 2. Twitter Card twitter:image
        tw_img = soup.find('meta', attrs={'name': 'twitter:image'}) or soup.find('meta', attrs={'name': 'twitter:image:src'})
        if tw_img and tw_img.get('content'):
            candidate = urllib.parse.urljoin(base_url, tw_img['content'].strip())
            if is_valid_image_url(candidate):
                return candidate

        # 3. Schema.org JSON-LD NewsArticle / Article
        for script in soup.find_all('script', type='application/ld+json'):
            if not script.string:
                continue
            try:
                data = json.loads(script.string)
                # Handle @graph array or direct dict
                items = data.get('@graph', [data]) if isinstance(data, dict) else (data if isinstance(data, list) else [])
                for item in items:
                    if isinstance(item, dict):
                        img_field = item.get('image') or item.get('thumbnailUrl')
                        if isinstance(img_field, str) and is_valid_image_url(img_field):
                            return urllib.parse.urljoin(base_url, img_field.strip())
                        elif isinstance(img_field, dict) and img_field.get('url'):
                            candidate = urllib.parse.urljoin(base_url, img_field['url'].strip())
                            if is_valid_image_url(candidate):
                                return candidate
                        elif isinstance(img_field, list) and len(img_field) > 0:
                            first = img_field[0]
                            first_url = first if isinstance(first, str) else (first.get('url') if isinstance(first, dict) else None)
                            if first_url and is_valid_image_url(first_url):
                                return urllib.parse.urljoin(base_url, first_url.strip())
            except Exception:
                continue

        # 4. Standard <link rel="image_src">
        link_img = soup.find('link', rel='image_src')
        if link_img and link_img.get('href'):
            candidate = urllib.parse.urljoin(base_url, link_img['href'].strip())
            if is_valid_image_url(candidate):
                return candidate

        # 5. DOM Lead Image inside <article> or <main>
        container = soup.find('article') or soup.find('main') or soup.find(class_=re.compile(r'post|article|content|entry', re.I))
        if container:
            for img in container.find_all('img'):
                src = img.get('src') or img.get('data-src') or img.get('data-original')
                if src:
                    candidate = urllib.parse.urljoin(base_url, src.strip())
                    if is_valid_image_url(candidate):
                        # Filter out images explicitly with tiny dimensions
                        w = img.get('width')
                        h = img.get('height')
                        try:
                            if w and int(w) < 100: continue
                            if h and int(h) < 100: continue
                        except (ValueError, TypeError):
                            pass
                        return candidate

    except Exception as e:
        logger.warning(f"Error extracting image from HTML for {base_url}: {e}")

    return None


def extract_image_from_feed_entry(entry: Any, base_url: Optional[str] = None) -> Optional[str]:
    """
    Extracts lead image from RSS/Atom entry dictionary (feedparser).
    """
    if not entry:
        return None

    # 1. media:content
    media_content = entry.get('media_content')
    if media_content and isinstance(media_content, list):
        for m in media_content:
            url = m.get('url')
            if url and is_valid_image_url(url):
                medium = m.get('medium')
                typ = m.get('type', '')
                if not medium or medium == 'image' or 'image' in typ:
                    return urllib.parse.urljoin(base_url or '', url)

    # 2. enclosures
    enclosures = entry.get('enclosures')
    if enclosures and isinstance(enclosures, list):
        for enc in enclosures:
            href = enc.get('href') or enc.get('url')
            typ = enc.get('type', '')
            if href and ('image' in typ or any(href.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp'])):
                if is_valid_image_url(href):
                    return urllib.parse.urljoin(base_url or '', href)

    # 3. media_thumbnail
    media_thumb = entry.get('media_thumbnail')
    if media_thumb and isinstance(media_thumb, list):
        for th in media_thumb:
            url = th.get('url')
            if url and is_valid_image_url(url):
                return urllib.parse.urljoin(base_url or '', url)

    # 4. Parse inline <img> in summary or content
    content_html = ""
    if hasattr(entry, 'content') and entry.content:
        content_html = entry.content[0].get('value', '')
    elif entry.get('summary'):
        content_html = entry.get('summary')
    elif entry.get('description'):
        content_html = entry.get('description')

    if content_html and '<img' in content_html:
        extracted = extract_image_from_html(content_html, base_url or entry.get('link', ''))
        if extracted:
            return extracted

    return None


def download_and_cache_image(image_url: str, article_id: Any) -> Optional[str]:
    """
    Downloads an image from URL and caches it in images/scraped/{article_id}.{ext}.
    Validates file integrity using PIL.
    Returns the absolute path to the local cached file, or None if failed.
    """
    if not image_url or not is_valid_image_url(image_url):
        return None

    try:
        resp = requests.get(image_url, headers=HEADERS, timeout=8, stream=True)
        if resp.status_code != 200:
            logger.debug(f"Failed to download image {image_url}: HTTP {resp.status_code}")
            return None

        # Check content type
        content_type = resp.headers.get('Content-Type', '').lower()
        ext = '.jpg'
        if 'png' in content_type:
            ext = '.png'
        elif 'webp' in content_type:
            ext = '.webp'
        elif 'gif' in content_type:
            ext = '.gif'
        else:
            # Infer from URL
            path = urllib.parse.urlparse(image_url).path
            for candidate_ext in ['.png', '.webp', '.jpeg', '.jpg']:
                if path.lower().endswith(candidate_ext):
                    ext = candidate_ext
                    break

        filename = f"{article_id}{ext}"
        target_path = os.path.join(SCRAPED_IMAGES_DIR, filename)

        # Write chunks
        content_length = 0
        with open(target_path, 'wb') as f:
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    content_length += len(chunk)

        # Reject tiny files (< 1.5 KB)
        if content_length < 1500:
            logger.debug(f"Downloaded image too small ({content_length} bytes), removing.")
            if os.path.exists(target_path):
                os.remove(target_path)
            return None

        # Validate with PIL
        try:
            with Image.open(target_path) as img:
                w, h = img.size
                if w < 80 or h < 80:
                    logger.debug(f"Image dimensions too small ({w}x{h}), discarding.")
                    if os.path.exists(target_path):
                        os.remove(target_path)
                    return None
        except Exception as e:
            logger.debug(f"Corrupt image file downloaded from {image_url}: {e}")
            if os.path.exists(target_path):
                os.remove(target_path)
            return None

        logger.info(f"Successfully scraped & cached image for #{article_id}: {target_path} ({content_length} bytes)")
        return target_path

    except Exception as e:
        logger.warning(f"Error downloading scraped image from {image_url}: {e}")
        return None


def backfill_scraped_images(limit: int = 50) -> int:
    """
    Backfills missing scraped images for existing articles in the database.
    Checks article URL, extracts og:image/twitter:image, downloads, and caches locally.
    """
    from src.db.models import Article, get_session
    import trafilatura

    updated_count = 0
    with get_session() as session:
        # Find articles without scraped_image_path
        candidates = session.query(Article).filter(
            (Article.scraped_image_path == None) | (Article.scraped_image_path == '')
        ).order_by(Article.id.desc()).limit(limit).all()

        logger.info(f"Checking {len(candidates)} articles for image backfill...")

        for art in candidates:
            img_url = art.scraped_image_url

            # If no image URL recorded, fetch from article URL
            if not img_url and art.url:
                try:
                    html = trafilatura.fetch_url(art.url)
                    if not html:
                        resp = requests.get(art.url, headers=HEADERS, timeout=8)
                        if resp.status_code == 200:
                            html = resp.text
                    if html:
                        img_url = extract_image_from_html(html, art.url)
                        if img_url:
                            art.scraped_image_url = img_url
                except Exception as ex:
                    logger.debug(f"Could not fetch HTML for backfill #{art.id}: {ex}")

            # Download and cache
            if img_url:
                local_path = download_and_cache_image(img_url, art.id)
                if local_path:
                    art.scraped_image_path = local_path
                    updated_count += 1

        session.commit()

    logger.info(f"Backfilled images for {updated_count} articles.")
    return updated_count

