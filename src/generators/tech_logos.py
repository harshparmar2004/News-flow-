"""
Tech Logos & Brand Assets Engine for NewsFlow Notes & Carousel Generator.
Provides official high-resolution vector/PNG logos for technologies.
"""

import os
import re
import logging
import urllib.request
from typing import Optional, Dict

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LOGOS_DIR = os.path.join(PROJECT_ROOT, "assets", "logos")
os.makedirs(LOGOS_DIR, exist_ok=True)

# Remote SVG sources (Devicon & SimpleIcons CDNs)
REMOTE_LOGOS: Dict[str, str] = {
    "python": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "docker": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    "kubernetes": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    "react": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "nodejs": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "git": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    "postgresql": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    "mongodb": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    "linux": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    "aws": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    "fastapi": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    "javascript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    "typescript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    "chatgpt": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg",
    "openai": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg",
    "dsa": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    "sql": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    "redis": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    "graphql": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    "java": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    "go": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    "rust": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
    "cplusplus": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
}

# Aliases mapping
TECH_ALIASES: Dict[str, str] = {
    "py": "python",
    "python3": "python",
    "oops": "python",
    "oop": "python",
    "k8s": "kubernetes",
    "k8": "kubernetes",
    "container": "docker",
    "containers": "docker",
    "gpt": "chatgpt",
    "gpt4": "chatgpt",
    "llm": "chatgpt",
    "ai": "chatgpt",
    "reactjs": "react",
    "mern": "react",
    "node": "nodejs",
    "express": "nodejs",
    "github": "git",
    "postgres": "postgresql",
    "mysql": "sql",
    "database": "sql",
    "amazon": "aws",
    "amazonwebservices": "aws",
    "bash": "linux",
    "shell": "linux",
    "ubuntu": "linux",
    "js": "javascript",
    "ts": "typescript",
    "cpp": "cplusplus",
    "algo": "dsa",
    "algorithm": "dsa",
    "algorithms": "dsa",
    "datastructure": "dsa",
    "data structures": "dsa",
    "golang": "go"
}

TECH_COLORS: Dict[str, Dict[str, str]] = {
    "python": {"primary": "#1f4b82", "accent": "#b91c1c", "highlight": "#d97706", "badge": "#2563eb"},
    "docker": {"primary": "#0369a1", "accent": "#0284c7", "highlight": "#0891b2", "badge": "#0284c7"},
    "kubernetes": {"primary": "#1d4ed8", "accent": "#2563eb", "highlight": "#3b82f6", "badge": "#2563eb"},
    "chatgpt": {"primary": "#047857", "accent": "#059669", "highlight": "#10b981", "badge": "#059669"},
    "react": {"primary": "#0369a1", "accent": "#0891b2", "highlight": "#0284c7", "badge": "#0ea5e9"},
    "nodejs": {"primary": "#15803d", "accent": "#16a34a", "highlight": "#22c55e", "badge": "#16a34a"},
    "git": {"primary": "#c2410c", "accent": "#ea580c", "highlight": "#f97316", "badge": "#ea580c"},
    "postgresql": {"primary": "#1e3a8a", "accent": "#2563eb", "highlight": "#0284c7", "badge": "#2563eb"},
    "sql": {"primary": "#1e3a8a", "accent": "#0369a1", "highlight": "#d97706", "badge": "#0284c7"},
    "dsa": {"primary": "#6d28d9", "accent": "#7c3aed", "highlight": "#b91c1c", "badge": "#7c3aed"},
    "aws": {"primary": "#c2410c", "accent": "#ea580c", "highlight": "#d97706", "badge": "#ea580c"},
    "linux": {"primary": "#18181b", "accent": "#b91c1c", "highlight": "#d97706", "badge": "#e11d48"},
    "default": {"primary": "#1e3a8a", "accent": "#b91c1c", "highlight": "#0284c7", "badge": "#2563eb"}
}


def normalize_tech_name(topic: str) -> str:
    """Extract and normalize the core technology from a topic string."""
    clean = topic.lower().strip()
    words = re.findall(r'[a-z0-9#+]+', clean)
    
    # Direct match on single words
    for word in words:
        if word in TECH_ALIASES:
            return TECH_ALIASES[word]
        if word in REMOTE_LOGOS:
            return word
            
    # Substring match
    for key, target in TECH_ALIASES.items():
        if key in clean:
            return target
            
    for key in REMOTE_LOGOS.keys():
        if key in clean:
            return key
            
    return "python"  # Default fallback


def get_tech_colors(tech_key: str) -> Dict[str, str]:
    """Return styling color palette for a technology."""
    return TECH_COLORS.get(tech_key, TECH_COLORS["default"])


def get_tech_logo_path(topic: str) -> str:
    """
    Returns the absolute path to a high-resolution PNG logo for the given tech topic.
    Downloads and caches from CDN if not already local, or renders fallback.
    """
    tech = normalize_tech_name(topic)
    local_path = os.path.join(LOGOS_DIR, f"{tech}.png")
    
    if os.path.exists(local_path) and os.path.getsize(local_path) > 100:
        return local_path
        
    # Attempt download and rasterization
    if tech in REMOTE_LOGOS:
        url = REMOTE_LOGOS[tech]
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                svg_data = resp.read()
                
            import pymupdf
            doc = pymupdf.open(stream=svg_data, filetype="svg")
            # Scale up to ~500x500
            zoom = 4.0 if doc[0].rect.width < 100 else 1.5
            mat = pymupdf.Matrix(zoom, zoom)
            pix = doc[0].get_pixmap(matrix=mat)
            pix.save(local_path)
            logger.info(f"Downloaded and cached logo for {tech} ({pix.width}x{pix.height})")
            return local_path
        except Exception as e:
            logger.warning(f"Could not download SVG logo for {tech}: {e}. Creating fallback.")

    # Create high-quality fallback badge using PIL
    try:
        from PIL import Image, ImageDraw, ImageFont
        img = Image.new("RGBA", (400, 400), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        colors = get_tech_colors(tech)
        # Draw rounded rect
        draw.rounded_rectangle([20, 20, 380, 380], radius=40, fill=colors["primary"], outline="#ffffff", width=8)
        
        # Draw tech letter / symbol
        symbol = tech[:3].upper() if len(tech) >= 3 else tech.upper()
        draw.text((200, 200), symbol, fill="#ffffff", anchor="mm", font_size=110)
        
        img.save(local_path, "PNG")
        return local_path
    except Exception as e:
        logger.error(f"Fallback logo generation failed: {e}")
        return local_path
