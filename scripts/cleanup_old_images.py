import os
import time
from datetime import datetime

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGE_DIRS = [
    os.path.join(PROJECT_ROOT, "images", "scraped"),
    os.path.normpath(os.path.join(PROJECT_ROOT, "..", "newsflow-web", "public", "images", "scraped")),
]

RETENTION_DAYS = 7

def cleanup_images(retention_days: int = RETENTION_DAYS):
    cutoff_time = time.time() - (retention_days * 86400)
    total_freed_bytes = 0
    total_deleted_files = 0

    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting image cleanup (older than {retention_days} days)...")

    for img_dir in IMAGE_DIRS:
        if not os.path.exists(img_dir):
            continue

        print(f"Scanning directory: {img_dir}")
        for fname in os.listdir(img_dir):
            if fname.startswith("."):
                continue  # preserve .gitkeep

            fpath = os.path.join(img_dir, fname)
            if not os.path.isfile(fpath):
                continue

            try:
                mtime = os.path.getmtime(fpath)
                if mtime < cutoff_time:
                    fsize = os.path.getsize(fpath)
                    os.remove(fpath)
                    total_freed_bytes += fsize
                    total_deleted_files += 1
            except Exception as e:
                print(f"  Error deleting {fname}: {e}")

    mb_freed = round(total_freed_bytes / (1024 * 1024), 2)
    print(f"Cleanup finished: Deleted {total_deleted_files} files, freed {mb_freed} MB of storage.")

if __name__ == "__main__":
    cleanup_images()
