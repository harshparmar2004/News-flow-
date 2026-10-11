import slugify from "slugify";
import { format, formatDistanceToNow } from "date-fns";
import { marked } from "marked";

export interface AffiliateLink {
  label: string;
  url: string;
  price?: string;
  badge?: string;
  description?: string;
}

export interface SeoMeta {
  title?: string;
  description?: string;
  og_image?: string;
  keywords?: string[];
}

export function generateSlug(title: string): string {
  const base = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
  return base || `article-${Date.now()}`;
}

export function calculateReadingTime(text: string): number {
  if (!text) return 1;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

export function formatArticleDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatArticleContent(rawText: string, title?: string): string {
  if (!rawText) return "";

  // 1. Normalize line breaks and strip null characters
  let text = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\0/g, "");

  // 2. Sanitize and normalize corrupted Unicode / Smart Quotes
  text = text
    .replace(/[\uFFFD]/g, '"') // Unicode replacement symbol 
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'") // Single quotes
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"') // Double quotes
    .replace(/[\u2013\u2014]/g, " — ") // En/Em dashes
    .replace(/\u00A0/g, " "); // Non-breaking space

  // Clean lines
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return "";

  const titleNorm = title ? title.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const formattedParagraphs: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Strip duplicate headline if echoed at the start of the article
    const lineNorm = line.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (titleNorm && lineNorm === titleNorm && i < 3) {
      continue;
    }

    // Preserve existing markdown headers, quotes, lists, or code blocks
    if (/^(#{1,6}\s|>\s|[-*+]\s|\d+\.\s|```)/.test(line)) {
      formattedParagraphs.push(line);
      continue;
    }

    // Detect section subheadings:
    // Short line, no terminal punctuation (no period/comma/colon), capitalized, not a URL
    const isHeading =
      line.length >= 4 &&
      line.length <= 75 &&
      !/[.,;:?!]$/.test(line) &&
      !line.startsWith("http") &&
      line.split(/\s+/).length <= 9 &&
      /^[A-Z]/.test(line);

    if (isHeading) {
      formattedParagraphs.push(`### ${line}`);
    } else {
      formattedParagraphs.push(line);
    }
  }

  // Join with double newlines so marked generates separate <p> tags with editorial spacing
  return formattedParagraphs.join("\n\n");
}

export function renderMarkdown(content: string, title?: string): string {
  if (!content) return "";
  try {
    const structured = formatArticleContent(content, title);
    return marked.parse(structured, {
      async: false,
      breaks: true,
      gfm: true,
    }) as string;
  } catch {
    return content;
  }
}

export function safeJsonParse<T>(jsonStr: string | null | undefined, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return fallback;
  }
}