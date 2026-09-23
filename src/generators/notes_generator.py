"""
Notebook Notes & Instagram Carousel Generator.
Generates multi-page vector PDFs and 1080x1350 PNG carousel slides
matching the handwritten spiral-notebook aesthetic of Notes_260918_142423 2.pdf.
"""

import os
import re
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
import pymupdf

from src.generators.tech_logos import get_tech_logo_path, get_tech_colors, normalize_tech_name

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FONTS_DIR = os.path.join(PROJECT_ROOT, "fonts")
DATA_DIR = os.path.join(PROJECT_ROOT, "data", "notes")
IMAGES_DIR = os.path.join(PROJECT_ROOT, "images", "notes")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)

# Register Google Kalam Fonts
try:
    pdfmetrics.registerFont(TTFont("Kalam-Bold", os.path.join(FONTS_DIR, "Kalam-Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Kalam-Regular", os.path.join(FONTS_DIR, "Kalam-Regular.ttf")))
except Exception as e:
    logger.warning(f"Could not register Kalam fonts: {e}. Fallbacks will be used.")

# Dimensions for Instagram 4:5 Portrait Carousel (540 x 675 pt)
# Rasterized at 2.0x zoom = 1080 x 1350 px
PAGE_WIDTH = 540
PAGE_HEIGHT = 675


class NotebookNotesGenerator:
    """
    Renders tech notes in handwritten spiral-notebook format for any tech topic.
    Outputs:
      1. Compiled PDF document
      2. 1080x1350 PNG slides for Instagram Carousels
    """

    def __init__(self, brand_handle: str = "by @PyCode.Hubb"):
        self.brand_handle = brand_handle

    def _draw_spiral_binding(self, c: canvas.Canvas):
        """Draw realistic spiral wire notebook spine on the left."""
        c.saveState()
        # 1. Dark spine strip
        c.setFillColor(colors.HexColor("#21252d"))
        c.rect(0, 0, 44, PAGE_HEIGHT, fill=1, stroke=0)
        
        # Inner shadow border
        c.setFillColor(colors.HexColor("#16181e"))
        c.rect(42, 0, 2, PAGE_HEIGHT, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#2e3440"))
        c.rect(0, 0, 4, PAGE_HEIGHT, fill=1, stroke=0)

        # 2. Punched holes and dual wire loops
        hole_x = 23
        hole_radius = 4.2
        y_start = 645
        y_step = 28.5

        y = y_start
        while y > 20:
            # Hole with 3D depth
            c.setFillColor(colors.HexColor("#0d0e12"))
            c.setStrokeColor(colors.HexColor("#3b4252"))
            c.setLineWidth(0.6)
            c.circle(hole_x, y, hole_radius, fill=1, stroke=1)

            # Dual metallic wire loops
            for offset in [-2.6, 2.6]:
                wy = y + offset
                # Shadow
                c.setStrokeColor(colors.HexColor("#101216"))
                c.setLineWidth(2.2)
                c.line(8, wy - 0.8, 38, wy - 0.8)

                # Metallic wire body
                c.setStrokeColor(colors.HexColor("#94a3b8"))
                c.setLineWidth(2.0)
                c.line(8, wy, 38, wy)

                # Specular highlight on wire top
                c.setStrokeColor(colors.HexColor("#ffffff"))
                c.setLineWidth(0.7)
                c.line(10, wy + 0.6, 36, wy + 0.6)

            y -= y_step
        c.restoreState()

    def _draw_paper_background(self, c: canvas.Canvas):
        """Draw warm paper texture with margin lines and ruling lines."""
        c.saveState()
        # Paper tone
        c.setFillColor(colors.HexColor("#fdfcfa"))
        c.rect(44, 0, PAGE_WIDTH - 44, PAGE_HEIGHT, fill=1, stroke=0)

        # Left red margin line
        margin_x = 58
        c.setStrokeColor(colors.HexColor("#f87171"))
        c.setLineWidth(0.9)
        c.line(margin_x, 0, margin_x, PAGE_HEIGHT)

        # Second faint margin line
        c.setStrokeColor(colors.HexColor("#fca5a5"))
        c.setLineWidth(0.4)
        c.line(margin_x + 3, 0, margin_x + 3, PAGE_HEIGHT)

        # Light blue ruling lines
        c.setStrokeColor(colors.HexColor("#e0eaf6"))
        c.setLineWidth(0.45)
        ruling_y = 635
        line_spacing = 22
        while ruling_y > 35:
            c.line(margin_x + 6, ruling_y, PAGE_WIDTH - 15, ruling_y)
            ruling_y -= line_spacing
        c.restoreState()

    def _draw_header(self, c: canvas.Canvas, title: str, subtitle: str, badge_tag: str, topic: str):
        """Draw top banner with badge sticker, tech logo, title, and double marker lines."""
        tech_key = normalize_tech_name(topic)
        scheme = get_tech_colors(tech_key)
        logo_path = get_tech_logo_path(topic)

        # 1. Top-Right Corner Sticker Tag
        c.saveState()
        badge_w, badge_h = 125, 30
        badge_x, badge_y = PAGE_WIDTH - badge_w - 18, 626
        c.setFillColor(colors.HexColor("#eff6ff"))
        c.setStrokeColor(colors.HexColor(scheme.get("badge", "#2563eb")))
        c.setLineWidth(1.6)
        c.roundRect(badge_x, badge_y, badge_w, badge_h, 7, fill=1, stroke=1)

        c.setFont("Kalam-Bold", 13)
        c.setFillColor(colors.HexColor(scheme.get("badge", "#2563eb")))
        c.drawCentredString(badge_x + badge_w / 2, badge_y + 8, badge_tag)
        c.restoreState()

        # 2. Tech Logo
        logo_x = 68
        logo_y = 618
        if logo_path and os.path.exists(logo_path):
            try:
                c.drawImage(logo_path, logo_x, logo_y, width=42, height=42, mask="auto")
            except Exception as e:
                logger.warning(f"Failed to draw logo: {e}")

        # 3. Main Title & Subtitle
        c.saveState()
        max_title_w = badge_x - logo_x - 52
        c.setFont("Kalam-Bold", 16)
        c.setFillColor(colors.HexColor(scheme.get("primary", "#1e3a8a")))
        
        # Truncate or fit title
        t_display = title.upper()
        if len(t_display) > 28:
            t_display = t_display[:28] + "..."
        c.drawString(logo_x + 50, 638, t_display)

        c.setFont("Kalam-Bold", 13.5)
        c.setFillColor(colors.HexColor(scheme.get("accent", "#dc2626")))
        sub_display = subtitle if subtitle else f"{topic} Mastery Guide"
        c.drawString(logo_x + 50, 620, sub_display)

        # Double underline beneath header
        c.setStrokeColor(colors.HexColor(scheme.get("badge", "#3b82f6")))
        c.setLineWidth(1.4)
        c.line(68, 608, PAGE_WIDTH - 18, 608)
        c.setStrokeColor(colors.HexColor(scheme.get("accent", "#ef4444")))
        c.setLineWidth(0.8)
        c.line(68, 604, PAGE_WIDTH - 18, 604)
        c.restoreState()

    def _draw_footer(self, c: canvas.Canvas, page_num: int, total_pages: int, topic: str):
        """Draw bottom signature, series title, and slide number."""
        c.saveState()
        # Separator line
        c.setStrokeColor(colors.HexColor("#cbd5e1"))
        c.setLineWidth(0.8)
        c.line(68, 44, PAGE_WIDTH - 25, 44)

        # Left series title
        c.setFont("Kalam-Bold", 12.0)
        c.setFillColor(colors.HexColor("#1e3a8a"))
        left_text = f"NewsFlow · {topic}" if len(topic) <= 16 else f"NewsFlow · {topic[:14]}..."
        c.drawString(70, 26, left_text)

        # Right watermark and page number
        c.setFont("Kalam-Bold", 12.5)
        c.setFillColor(colors.HexColor("#dc2626"))
        page_str = f"Slide {page_num:02d} / {total_pages:02d}"
        c.drawRightString(PAGE_WIDTH - 25, 26, f"{self.brand_handle}  |  {page_str}")
        c.restoreState()

    def _render_section(self, c: canvas.Canvas, sec: Dict[str, Any], curr_y: float, tech_key: str) -> float:
        """Render individual content section block and return updated Y position."""
        sec_type = sec.get("type", "bullets")
        scheme = get_tech_colors(tech_key)

        if sec_type == "heading":
            c.saveState()
            c.setFont("Kalam-Bold", 15)
            c.setFillColor(colors.HexColor(sec.get("color", scheme.get("accent", "#dc2626"))))
            text = sec.get("text", "")
            c.drawString(70, curr_y, text)

            # Red handwritten underline
            text_w = min(len(text) * 8.5, 340)
            c.setStrokeColor(colors.HexColor(scheme.get("accent", "#dc2626")))
            c.setLineWidth(1.1)
            c.line(70, curr_y - 4, 70 + text_w, curr_y - 4)
            c.restoreState()
            return curr_y - 24

        elif sec_type == "bullets":
            items = sec.get("items", [])
            for item in items:
                c.saveState()
                c.setFont("Kalam-Regular", 12.0)
                c.setFillColor(colors.HexColor("#1e293b"))
                
                # Check for highlighted keyword prefix
                if ":" in item and not item.startswith("http"):
                    prefix, rest = item.split(":", 1)
                    c.setFont("Kalam-Bold", 12.0)
                    c.setFillColor(colors.HexColor(scheme.get("primary", "#1d4ed8")))
                    c.drawString(72, curr_y, f"• {prefix}:")
                    
                    pw = c.stringWidth(f"• {prefix}:", "Kalam-Bold", 12.0)
                    c.setFont("Kalam-Regular", 12.0)
                    c.setFillColor(colors.HexColor("#1e293b"))
                    
                    rest = rest.strip()
                    # Wrap if too long
                    if len(rest) > 54:
                        # Find space near index 50
                        split_idx = rest.rfind(" ", 0, 54)
                        if split_idx == -1: split_idx = 50
                        c.drawString(76 + pw, curr_y, rest[:split_idx])
                        curr_y -= 18
                        c.drawString(88, curr_y, rest[split_idx:].strip())
                    else:
                        c.drawString(76 + pw, curr_y, rest)
                else:
                    item_str = item.strip()
                    if len(item_str) > 65:
                        split_idx = item_str.rfind(" ", 0, 65)
                        if split_idx == -1: split_idx = 60
                        c.drawString(72, curr_y, f"• {item_str[:split_idx]}")
                        curr_y -= 18
                        c.drawString(88, curr_y, item_str[split_idx:].strip())
                    else:
                        c.drawString(72, curr_y, f"• {item_str}")
                    
                c.restoreState()
                curr_y -= 21
            return curr_y - 4

        elif sec_type == "card_grid":
            # 2x2 or 4 cards grid
            cards = sec.get("cards", [])
            box_h = 88
            box_y = curr_y - box_h
            box_x, box_w = 70, PAGE_WIDTH - 70 - 22

            c.saveState()
            c.setFillColor(colors.HexColor("#f8fafc"))
            c.setStrokeColor(colors.HexColor(scheme.get("badge", "#2563eb")))
            c.setLineWidth(1.2)
            c.roundRect(box_x, box_y, box_w, box_h, 8, fill=1, stroke=1)

            # Title
            if sec.get("title"):
                c.setFont("Kalam-Bold", 13.0)
                c.setFillColor(colors.HexColor(scheme.get("primary", "#1d4ed8")))
                c.drawString(box_x + 12, box_y + box_h - 18, sec.get("title"))

            # Render 4 items
            col_w = (box_w - 24) / 2
            for i, card in enumerate(cards[:4]):
                col = i % 2
                row = i // 2
                cx = box_x + 14 + col * col_w
                cy = box_y + box_h - 40 - (row * 24)

                c.setFont("Kalam-Bold", 11.5)
                c.setFillColor(colors.HexColor(scheme.get("accent", "#b91c1c")))
                t = card.get("title", "")
                c.drawString(cx, cy, t)

                c.setFont("Kalam-Regular", 10.5)
                c.setFillColor(colors.HexColor("#475569"))
                d = card.get("desc", "")
                tw = c.stringWidth(t, "Kalam-Bold", 11.5)
                c.drawString(cx + tw + 6, cy, f"- {d[:32]}")

            c.restoreState()
            return box_y - 14

        elif sec_type == "code_box":
            lines = sec.get("code", [])
            box_h = max(70, min(145, 34 + len(lines) * 14))
            box_y = curr_y - box_h
            box_x, box_w = 70, PAGE_WIDTH - 70 - 22

            c.saveState()
            c.setFillColor(colors.HexColor("#f0fdf4"))
            c.setStrokeColor(colors.HexColor("#16a34a"))
            c.setLineWidth(1.2)
            c.roundRect(box_x, box_y, box_w, box_h, 8, fill=1, stroke=1)

            # Title
            title = sec.get("title", "* Syntax & Example:")
            c.setFont("Kalam-Bold", 12.0)
            c.setFillColor(colors.HexColor("#15803d"))
            c.drawString(box_x + 12, box_y + box_h - 18, title)

            # Code lines
            c.setFont("Courier-Bold", 9.5)
            for idx, line in enumerate(lines):
                ly = box_y + box_h - 34 - (idx * 13.5)
                if ly < box_y + 8:
                    break
                if line.strip().startswith("#") or line.strip().startswith("//"):
                    c.setFillColor(colors.HexColor("#64748b"))
                elif any(line.strip().startswith(kw) for kw in ["class ", "def ", "docker ", "kubectl ", "import ", "const ", "let "]):
                    c.setFillColor(colors.HexColor("#dc2626"))
                else:
                    c.setFillColor(colors.HexColor("#0f172a"))
                c.drawString(box_x + 14, ly, line[:56])

            c.restoreState()
            return box_y - 14

        elif sec_type == "diagram":
            # Architecture flowchart diagram
            box_h = 100
            box_y = curr_y - box_h
            
            c.saveState()
            left_t = sec.get("left_title", "CLASS (Blueprint)")
            right_t1 = sec.get("right_title1", "OBJECT 1 (Instance)")
            right_t2 = sec.get("right_title2", "OBJECT 2 (Instance)")
            left_lines = sec.get("left_lines", ["• Attributes & State", "• Methods & Logic", "• Template in RAM"])
            arrow_lbl = sec.get("arrow_label", "Creates")

            # Left Blueprint Box
            lx, ly, lw, lh = 72, box_y + 6, 160, 88
            c.setFillColor(colors.HexColor("#eff6ff"))
            c.setStrokeColor(colors.HexColor("#3b82f6"))
            c.roundRect(lx, ly, lw, lh, 6, fill=1, stroke=1)

            c.setFont("Kalam-Bold", 12.5)
            c.setFillColor(colors.HexColor("#1e40af"))
            c.drawCentredString(lx + lw/2, ly + lh - 17, left_t)
            c.setStrokeColor(colors.HexColor("#93c5fd"))
            c.line(lx + 8, ly + lh - 22, lx + lw - 8, ly + lh - 22)

            c.setFont("Kalam-Regular", 10.5)
            c.setFillColor(colors.HexColor("#1e293b"))
            for i, ll in enumerate(left_lines[:3]):
                c.drawString(lx + 8, ly + lh - 38 - (i * 17), ll[:24])

            # Connecting Arrow
            arrow_y = ly + lh / 2
            c.setStrokeColor(colors.HexColor("#ef4444"))
            c.setLineWidth(1.8)
            c.line(242, arrow_y, 308, arrow_y)
            c.line(300, arrow_y + 5, 308, arrow_y)
            c.line(300, arrow_y - 5, 308, arrow_y)

            c.setFont("Kalam-Bold", 10.5)
            c.setFillColor(colors.HexColor("#dc2626"))
            c.drawCentredString(275, arrow_y + 6, arrow_lbl)

            # Right Instances
            rx, rw = 318, 195
            ry1 = box_y + 52
            rh1 = 42
            c.setFillColor(colors.HexColor("#fef2f2"))
            c.setStrokeColor(colors.HexColor("#ef4444"))
            c.roundRect(rx, ry1, rw, rh1, 6, fill=1, stroke=1)
            c.setFont("Kalam-Bold", 11.0)
            c.setFillColor(colors.HexColor("#991b1b"))
            c.drawString(rx + 8, ry1 + rh1 - 15, right_t1)
            c.setFont("Kalam-Regular", 9.5)
            c.setFillColor(colors.HexColor("#475569"))
            c.drawString(rx + 8, ry1 + 8, sec.get("right_desc1", "• Separate memory address"))

            ry2 = box_y + 4
            c.setFillColor(colors.HexColor("#fef2f2"))
            c.setStrokeColor(colors.HexColor("#ef4444"))
            c.roundRect(rx, ry2, rw, rh1, 6, fill=1, stroke=1)
            c.setFont("Kalam-Bold", 11.0)
            c.setFillColor(colors.HexColor("#991b1b"))
            c.drawString(rx + 8, ry2 + rh1 - 15, right_t2)
            c.setFont("Kalam-Regular", 9.5)
            c.drawString(rx + 8, ry2 + 8, sec.get("right_desc2", "• Unique attributes & state"))

            c.restoreState()
            return box_y - 14

        elif sec_type == "table":
            headers = sec.get("headers", ["Concept", "Purpose", "Syntax"])
            rows = sec.get("rows", [])
            row_h = 20
            table_h = 24 + len(rows) * row_h
            table_y = curr_y - table_h
            tx, tw = 70, PAGE_WIDTH - 70 - 22

            c.saveState()
            # Background
            c.setFillColor(colors.HexColor("#ffffff"))
            c.setStrokeColor(colors.HexColor(scheme.get("badge", "#3b82f6")))
            c.setLineWidth(1.2)
            c.roundRect(tx, table_y, tw, table_h, 6, fill=1, stroke=1)

            # Header row
            c.setFillColor(colors.HexColor("#eff6ff"))
            c.rect(tx, table_y + table_h - 22, tw, 22, fill=1, stroke=0)
            c.setStrokeColor(colors.HexColor(scheme.get("badge", "#3b82f6")))
            c.line(tx, table_y + table_h - 22, tx + tw, table_y + table_h - 22)

            col_w1, col_w2, col_w3 = 110, 190, tw - 300
            c.setFont("Kalam-Bold", 11.5)
            c.setFillColor(colors.HexColor(scheme.get("primary", "#1d4ed8")))
            c.drawString(tx + 8, table_y + table_h - 16, headers[0])
            c.drawString(tx + col_w1 + 8, table_y + table_h - 16, headers[1])
            c.drawString(tx + col_w1 + col_w2 + 8, table_y + table_h - 16, headers[2])

            # Data rows
            for idx, r in enumerate(rows):
                ry = table_y + table_h - 22 - ((idx + 1) * row_h)
                c.setStrokeColor(colors.HexColor("#e2e8f0"))
                c.line(tx, ry, tx + tw, ry)

                c.setFont("Kalam-Bold", 10.5)
                c.setFillColor(colors.HexColor(scheme.get("accent", "#b91c1c")))
                c.drawString(tx + 8, ry + 5, r[0][:18])

                c.setFont("Kalam-Regular", 10.0)
                c.setFillColor(colors.HexColor("#1e293b"))
                c.drawString(tx + col_w1 + 8, ry + 5, r[1][:30])

                c.setFont("Courier-Bold", 9.0)
                c.setFillColor(colors.HexColor("#0f172a"))
                c.drawString(tx + col_w1 + col_w2 + 8, ry + 5, r[2][:20])

            c.restoreState()
            return table_y - 14

        return curr_y - 20

    def generate_document(self, topic: str, title: str, badge_tag: str, pages_data: List[Dict[str, Any]], brand_handle: Optional[str] = None) -> Dict[str, Any]:
        """
        Generates full multi-page PDF and individual 1080x1350 PNG slides.
        Returns dict with filepaths, slide URLs, and metadata.
        """
        if brand_handle:
            self.brand_handle = brand_handle

        slug = re.sub(r'[^a-zA-Z0-9_-]', '_', topic.lower()).strip('_')
        doc_dir = os.path.join(DATA_DIR, slug)
        slides_dir = os.path.join(IMAGES_DIR, slug)
        os.makedirs(doc_dir, exist_ok=True)
        os.makedirs(slides_dir, exist_ok=True)

        pdf_path = os.path.join(doc_dir, f"{slug}_notes.pdf")
        tech_key = normalize_tech_name(topic)
        total_pages = len(pages_data)

        # 1. Build PDF Document with ReportLab
        c = canvas.Canvas(pdf_path, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))

        for page_idx, page in enumerate(pages_data):
            page_num = page_idx + 1
            # Paper & Spiral spine
            self._draw_paper_background(c)
            self._draw_spiral_binding(c)

            # Header
            p_title = page.get("title", title)
            p_subtitle = page.get("subtitle", f"Part - {page_num}")
            p_badge = page.get("badge", badge_tag)
            self._draw_header(c, p_title, p_subtitle, p_badge, topic)

            # Footer
            self._draw_footer(c, page_num, total_pages, topic)

            # Content Sections
            curr_y = 578
            sections = page.get("sections", [])
            for sec in sections:
                if curr_y < 80:
                    break
                curr_y = self._render_section(c, sec, curr_y, tech_key)

            c.showPage()

        c.save()
        logger.info(f"Generated PDF at {pdf_path}")

        # 2. Rasterize each page to 1080x1350 PNG carousel slides with PyMuPDF
        doc = pymupdf.open(pdf_path)
        slide_paths = []
        slide_urls = []

        for idx, page in enumerate(doc):
            slide_file = f"slide_{idx+1:02d}.png"
            out_png = os.path.join(slides_dir, slide_file)
            # 2.0 zoom factor transforms 540x675 pt -> exact 1080x1350 px
            mat = pymupdf.Matrix(2.0, 2.0)
            pix = page.get_pixmap(matrix=mat)
            pix.save(out_png)
            slide_paths.append(out_png)
            slide_urls.append(f"/images/notes/{slug}/{slide_file}")

        meta = {
            "topic": topic,
            "title": title,
            "badge_tag": badge_tag,
            "slug": slug,
            "page_count": total_pages,
            "brand_handle": self.brand_handle,
            "pdf_path": pdf_path,
            "pdf_url": f"/api/notes/{slug}/pdf",
            "slide_paths": slide_paths,
            "slide_urls": slide_urls,
            "created_at": datetime.utcnow().isoformat() + "Z"
        }

        with open(os.path.join(doc_dir, "meta.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2)

        return meta
