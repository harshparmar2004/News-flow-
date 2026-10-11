import hashlib
import logging
from typing import List, Dict, Any

from src.db.models import Article, get_session

logger = logging.getLogger(__name__)

def compute_url_hash(url: str) -> str:
    """
    Compute a SHA-256 hash for a given URL.
    """
    return hashlib.sha256(url.encode('utf-8')).hexdigest()

def is_url_already_scraped(url: str) -> bool:
    """Fast pre-flight check: returns True if URL or its hash already exists in DB."""
    if not url:
        return True
    url_hash = compute_url_hash(url)
    with get_session() as session:
        return session.query(Article.id).filter_by(url_hash=url_hash).first() is not None

def filter_unscraped_urls(urls: List[str]) -> set:
    """
    Fast pre-flight batch check: returns a set of url_hashes that already exist in DB.
    Takes ~0.001s for 20 URLs and avoids redundant downloads.
    """
    if not urls:
        return set()
    hashes = [compute_url_hash(u) for u in urls if u]
    if not hashes:
        return set()
    with get_session() as session:
        existing = session.query(Article.url_hash).filter(Article.url_hash.in_(hashes)).all()
        return {r[0] for r in existing}

def dedupe_and_store(articles: List[Dict[str, Any]]) -> int:
    """
    Deduplicate scraped articles based on URL hash and insert new ones into the database.
    """
    new_articles_count = 0
    session = get_session()
    
    try:
        for article_data in articles:
            url = article_data.get('url')
            if not url:
                continue
                
            url_hash = compute_url_hash(url)
            
            scraped_img_url = article_data.get('scraped_image_url')

            # Check if article exists
            existing = session.query(Article).filter_by(url_hash=url_hash).first()
            if existing:
                # If existing article lacks scraped image but new data has it, backfill
                if not existing.scraped_image_url and scraped_img_url:
                    existing.scraped_image_url = scraped_img_url
                    try:
                        from src.scraper.image_scraper import download_and_cache_image
                        local_path = download_and_cache_image(scraped_img_url, existing.id)
                        if local_path:
                            existing.scraped_image_path = local_path
                    except Exception:
                        pass
                logger.debug(f"Article already exists: {url}")
                continue
                
            # Create new Article
            new_article = Article(
                url_hash=url_hash,
                url=url,
                title=article_data.get('title'),
                body=article_data.get('body'),
                author=article_data.get('author'),
                published_at=article_data.get('published_at'),
                source=article_data.get('source'),
                category=article_data.get('category'),
                subreddit=article_data.get('subreddit'),
                scraped_image_url=scraped_img_url,
                status='scraped'
            )
            
            session.add(new_article)
            session.flush()  # Populate new_article.id

            # Download and cache authentic website image immediately
            if scraped_img_url:
                try:
                    from src.scraper.image_scraper import download_and_cache_image
                    local_path = download_and_cache_image(scraped_img_url, new_article.id)
                    if local_path:
                        new_article.scraped_image_path = local_path
                except Exception as down_err:
                    logger.debug(f"Failed to cache scraped image for #{new_article.id}: {down_err}")

            new_articles_count += 1
            
        session.commit()
        logger.info(f"Inserted {new_articles_count} new articles into the database.")
    except Exception as e:
        session.rollback()
        logger.error(f"Error during dedupe_and_store: {e}", exc_info=True)
    finally:
        session.close()
        
    return new_articles_count
