"""
Re-categorization Migration Script for NewsFlow Articles in Neon PostgreSQL.
Re-evaluates every published article using the enhanced domain triage rules
and updates `categoryId` so articles appear under their true domain desks.

Usage:
  python recategorize_articles.py --dry-run
  python recategorize_articles.py --execute
"""

import sys
import os
import argparse
from typing import Dict, Any
from sqlalchemy import create_engine, text

# Add news-auto-pipeline directory to sys.path
pipeline_dir = r"C:\Users\harsh parmar\Desktop\news-auto-pipeline"
if pipeline_dir not in sys.path:
    sys.path.insert(0, pipeline_dir)

from src.ai.jev_triage import classify_domain_scored

NEON_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_Ue6LxCyW1GVu@ep-cool-art-b3k783d3-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
)

def main():
    parser = argparse.ArgumentParser(description="Re-categorize articles in Neon PostgreSQL")
    parser.add_argument("--execute", action="store_true", help="Apply updates to database (defaults to dry-run)")
    parser.add_argument("--limit", type=int, default=None, help="Optional limit for testing")
    args = parser.parse_args()

    is_dry_run = not args.execute
    mode_str = "DRY RUN (No changes saved)" if is_dry_run else "EXECUTE MODE (Writing to database)"
    print(f"==================================================")
    print(f" NewsFlow Domain Desk Re-categorization Tool")
    print(f" Mode: {mode_str}")
    print(f"==================================================\n")

    engine = create_engine(NEON_URL)

    with engine.connect() as conn:
        # 1. Fetch categories
        cat_rows = conn.execute(text('SELECT id, name, slug FROM "Category"')).fetchall()
        slug_to_id: Dict[str, str] = {}
        id_to_name: Dict[str, str] = {}
        id_to_slug: Dict[str, str] = {}
        for r in cat_rows:
            cid, name, slug = r[0], r[1], r[2]
            slug_to_id[slug] = cid
            id_to_name[cid] = name
            id_to_slug[cid] = slug

        print(f"Loaded {len(slug_to_id)} categories:")
        for slug, cid in slug_to_id.items():
            print(f"  [{slug}] {id_to_name[cid]} -> ID: {cid}")
        print()

        # 2. Category distribution before
        before_counts = conn.execute(text(
            'SELECT c.slug, c.name, count(a.id) FROM "Category" c '
            'LEFT JOIN "Article" a ON a."categoryId" = c.id AND a.status = \'published\' '
            'GROUP BY c.slug, c.name ORDER BY count(a.id) DESC'
        )).fetchall()
        print("--- Category Distribution BEFORE ---")
        for r in before_counts:
            print(f"  {r[1]} ({r[0]}): {r[2]} articles")
        print()

        # 3. Query all published articles
        query = 'SELECT id, title, summary, body, "categoryId" FROM "Article" WHERE status = \'published\''
        if args.limit:
            query += f" LIMIT {args.limit}"
        articles = conn.execute(text(query)).fetchall()
        print(f"Inspecting {len(articles)} published articles...\n")

        updates = []
        moves = {}

        for a in articles:
            aid, title, summary, body, cur_cat_id = a[0], a[1] or "", a[2] or "", a[3] or "", a[4]
            cur_slug = id_to_slug.get(cur_cat_id, "unknown")

            # Run content triage with current category as prior
            target_slug = classify_domain_scored(
                title=title,
                summary=summary,
                body_sample=body[:800],
                source_category=cur_slug
            )

            target_cat_id = slug_to_id.get(target_slug)
            if not target_cat_id:
                target_cat_id = slug_to_id.get("tech")
                target_slug = "tech"

            if target_cat_id != cur_cat_id:
                from_name = id_to_name.get(cur_cat_id, cur_slug)
                to_name = id_to_name.get(target_cat_id, target_slug)
                move_key = f"{from_name} -> {to_name}"
                moves[move_key] = moves.get(move_key, 0) + 1
                updates.append({
                    "id": aid,
                    "title": title[:70],
                    "cur_slug": cur_slug,
                    "target_slug": target_slug,
                    "target_cat_id": target_cat_id
                })

        print(f"Found {len(updates)} articles needing re-categorization!\n")

        print("--- Transfer Breakdown ---")
        for move_key, count in sorted(moves.items(), key=lambda x: -x[1]):
            print(f"  {move_key}: {count} articles")
        print()

        print("--- Sample Transfers (First 20) ---")
        for u in updates[:20]:
            print(f"  [{u['cur_slug']} -> {u['target_slug']}] {u['title']}")
        print()

        # 4. If execute mode, commit updates
        if not is_dry_run and updates:
            print(f"Applying {len(updates)} category updates to Neon PostgreSQL...")
            with engine.begin() as trans_conn:
                for u in updates:
                    trans_conn.execute(
                        text('UPDATE "Article" SET "categoryId" = :cid, updated_at = NOW() WHERE id = :id'),
                        {"cid": u["target_cat_id"], "id": u["id"]}
                    )
            print("Successfully updated all articles in database!\n")

            # Category distribution after
            with engine.connect() as verify_conn:
                after_counts = verify_conn.execute(text(
                    'SELECT c.slug, c.name, count(a.id) FROM "Category" c '
                    'LEFT JOIN "Article" a ON a."categoryId" = c.id AND a.status = \'published\' '
                    'GROUP BY c.slug, c.name ORDER BY count(a.id) DESC'
                )).fetchall()
                print("--- Category Distribution AFTER ---")
                for r in after_counts:
                    print(f"  {r[1]} ({r[0]}): {r[2]} articles")
        else:
            if is_dry_run:
                print("DRY RUN COMPLETE. Re-run with `--execute` to apply changes.")

if __name__ == "__main__":
    main()
