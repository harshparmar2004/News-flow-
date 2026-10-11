"""
Normalize Article Bodies Migration Script
Scans all articles in newsflow-web/prisma/dev.db and news-auto-pipeline/pipeline.db:
- Sanitizes corrupted unicode characters (such as \ufffd replacement chars and malformed quotes).
- Normalizes paragraph spacing into authentic double line breaks (\n\n) so Markdown renders clean <p> tags.
- Removes duplicate title echoes from the beginning of articles.
- Detects standalone section headers and formats as ### subheadings.
"""

import os
import sys
import sqlite3
import re

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB_DIR = os.path.normpath(os.path.join(PROJECT_ROOT, "..", "newsflow-web"))
PIPELINE_DB = os.path.join(PROJECT_ROOT, "pipeline.db")
WEB_DB = os.path.join(WEB_DIR, "prisma", "dev.db")


def format_article_body(raw_body: str, title: str = "") -> str:
    if not raw_body:
        return ""

    # 1. Normalize line endings and strip nulls
    text = raw_body.replace("\r\n", "\n").replace("\r", "\n").replace("\0", "")

    # 2. Sanitize and normalize corrupted Unicode / Smart Quotes
    text = re.sub(r"(\w)\ufffd([sStTdD]|re|ve|ll|m)\b", r"\1'\2", text)
    text = re.sub(r"\ufffd([^\ufffd\n]+)\ufffd", r'"\1"', text)
    text = text.replace("\ufffd", '"')
    text = re.sub(r"[\u2018\u2019\u201A\u201B]", "'", text)
    text = re.sub(r"[\u201C\u201D\u201E\u201F]", '"', text)
    text = re.sub(r"[\u2013\u2014]", " — ", text)
    text = text.replace("\u00a0", " ")

    lines = [l.strip() for l in text.split("\n")]
    lines = [l for l in lines if l]

    if not lines:
        return ""

    norm_title = re.sub(r"[^a-z0-9]", "", title.lower()) if title else ""
    formatted_paragraphs = []

    has_markdown_headers = any(re.match(r"^#{1,6}\s", l) for l in lines)

    for i, line in enumerate(lines):
        norm_line = re.sub(r"[^a-z0-9]", "", line.lower())
        # Deduplicate title if echoed in first few lines
        if norm_title and norm_line == norm_title and i < 3:
            continue

        # Preserve existing markdown blocks
        if re.match(r"^(#{1,6}\s|>\s|[-*+]\s|\d+\.\s|```)", line):
            formatted_paragraphs.append(line)
            continue

        # Detect standalone subheadings if not already markdown
        if not has_markdown_headers:
            if (
                4 <= len(line) <= 75
                and not line.endswith((".", ",", ";", ":", "?", "!"))
                and not line.startswith("http")
                and len(line.split()) <= 9
                and line[0].isupper()
            ):
                formatted_paragraphs.append(f"### {line}")
                continue

        formatted_paragraphs.append(line)

    return "\n\n".join(formatted_paragraphs)


def migrate_web_database():
    if not os.path.exists(WEB_DB):
        print(f"[-] Web DB not found at {WEB_DB}")
        return 0

    conn = sqlite3.connect(WEB_DB)
    c = conn.cursor()
    c.execute("SELECT id, title, body FROM Article")
    articles = c.fetchall()
    
    updated = 0
    for art_id, title, body in articles:
        if not body:
            continue
        cleaned = format_article_body(body, title or "")
        if cleaned != body:
            c.execute("UPDATE Article SET body = ? WHERE id = ?", (cleaned, art_id))
            updated += 1
            
    conn.commit()
    conn.close()
    print(f"[+] Web Database (prisma/dev.db): Checked {len(articles)} articles, normalized {updated} article bodies.")
    return updated


def migrate_pipeline_database():
    if not os.path.exists(PIPELINE_DB):
        print(f"[-] Pipeline DB not found at {PIPELINE_DB}")
        return 0

    conn = sqlite3.connect(PIPELINE_DB)
    c = conn.cursor()
    c.execute("SELECT id, title, body, final_body FROM articles")
    articles = c.fetchall()
    
    updated = 0
    for art_id, title, body, final_body in articles:
        updates = []
        params = []
        if body:
            cleaned_body = format_article_body(body, title or "")
            if cleaned_body != body:
                updates.append("body = ?")
                params.append(cleaned_body)
        if final_body:
            cleaned_final = format_article_body(final_body, title or "")
            if cleaned_final != final_body:
                updates.append("final_body = ?")
                params.append(cleaned_final)
                
        if updates:
            params.append(art_id)
            c.execute(f"UPDATE articles SET {', '.join(updates)} WHERE id = ?", params)
            updated += 1
            
    conn.commit()
    conn.close()
    print(f"[+] Pipeline Database (pipeline.db): Checked {len(articles)} articles, normalized {updated} articles.")
    return updated


if __name__ == "__main__":
    print("Starting article body normalization migration...")
    web_count = migrate_web_database()
    pipeline_count = migrate_pipeline_database()
    print(f"Migration completed successfully. Total articles enhanced: Web={web_count}, Pipeline={pipeline_count}")
