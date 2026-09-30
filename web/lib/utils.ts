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

export function renderMarkdown(content: string): string {
  if (!content) return "";
  try {
    return marked.parse(content, { async: false }) as string;
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