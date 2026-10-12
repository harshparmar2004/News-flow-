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
  const trimmed = base.slice(0, 70).replace(/-+$/, "");
  return trimmed || `article-${Date.now()}`;
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

/**
 * Optimizes image URLs from various CDNs to ensure fast, responsive thumbnail delivery.
 * Automatically downscales oversized desktop/print images (e.g. 1920px FutureCDN)
 * to lightweight ~30-60KB responsive thumbnails.
 */
export function getOptimizedImageUrl(url?: string | null, width = 640): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed.startsWith("http")) return trimmed;

  // 1. FutureCDN (TechRadar, Tom's Hardware, PC Gamer, etc.)
  // Converts heavy desktop images (e.g. -1920-80.jpg) down to fast 650px web thumbnails
  if (trimmed.includes("cdn.mos.cms.futurecdn.net")) {
    return trimmed.replace(/-\d+-\d+(\.[a-zA-Z0-9]+)(\?.*)?$/, `-${width}-80$1$2`);
  }

  // 2. Unsplash: optimize width parameter and format
  if (trimmed.includes("images.unsplash.com")) {
    if (trimmed.includes("w=")) {
      return trimmed.replace(/w=\d+/, `w=${width}`);
    }
    const sep = trimmed.includes("?") ? "&" : "?";
    return `${trimmed}${sep}w=${width}&auto=format&fit=crop&q=80`;
  }

  return trimmed;
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

/**
 * Resolves authentic publisher brand name from source URL or author field.
 * Maps 50+ major technology sources to human-readable publication brand names.
 */
export function getSourceBrand(sourceUrl?: string | null, author?: string | null): string {
  if (author && author !== "NewsFlow AI" && !author.includes("Research")) {
    return author;
  }
  if (!sourceUrl || typeof sourceUrl !== "string") {
    return "NewsFlow Wire";
  }

  try {
    const host = new URL(sourceUrl).hostname.toLowerCase().replace(/^www\./, "");
    if (host.includes("theverge")) return "The Verge";
    if (host.includes("techcrunch")) return "TechCrunch";
    if (host.includes("arstechnica")) return "Ars Technica";
    if (host.includes("wired")) return "Wired";
    if (host.includes("techradar")) return "TechRadar";
    if (host.includes("engadget")) return "Engadget";
    if (host.includes("tomshardware")) return "Tom's Hardware";
    if (host.includes("technologyreview")) return "MIT Tech Review";
    if (host.includes("reuters")) return "Reuters";
    if (host.includes("bloomberg")) return "Bloomberg";
    if (host.includes("bbc")) return "BBC News";
    if (host.includes("theguardian")) return "The Guardian";
    if (host.includes("zdnet")) return "ZDNet";
    if (host.includes("venturebeat")) return "VentureBeat";
    if (host.includes("cnbc")) return "CNBC";
    if (host.includes("9to5google")) return "9to5Google";
    if (host.includes("9to5mac")) return "9to5Mac";
    if (host.includes("androidcentral")) return "Android Central";
    if (host.includes("macrumors")) return "MacRumors";
    if (host.includes("xda-developers")) return "XDA Developers";
    if (host.includes("pcgamer")) return "PC Gamer";
    if (host.includes("digitaltrends")) return "Digital Trends";
    if (host.includes("therobotreport")) return "The Robot Report";
    if (host.includes("spectrum.ieee")) return "IEEE Spectrum";
    if (host.includes("robohub")) return "Robohub";
    if (host.includes("dronedj")) return "DroneDJ";
    if (host.includes("dronelife")) return "DroneLife";
    if (host.includes("openai")) return "OpenAI";
    if (host.includes("anthropic")) return "Anthropic";
    if (host.includes("nvidia")) return "NVIDIA";
    if (host.includes("huggingface")) return "Hugging Face";
    if (host.includes("deepmind")) return "Google DeepMind";
    if (host.includes("microsoft")) return "Microsoft AI";
    if (host.includes("mistral")) return "Mistral AI";
    if (host.includes("meta")) return "Meta AI";
    if (host.includes("marktechpost")) return "MarkTechPost";
    if (host.includes("unite.ai")) return "Unite.AI";
    if (host.includes("towardsai")) return "Towards AI";
    if (host.includes("bair.berkeley")) return "BAIR";
    if (host.includes("jack-clark")) return "Import AI";
    if (host.includes("siliconangle")) return "SiliconANGLE";
    if (host.includes("sifted")) return "Sifted";
    if (host.includes("strictlyvc")) return "StrictlyVC";
    if (host.includes("crunchbase")) return "Crunchbase";
    if (host.includes("pitchbook")) return "PitchBook";
    if (host.includes("alleywatch")) return "AlleyWatch";
    if (host.includes("ycombinator")) return "Y Combinator";
    if (host.includes("thehackernews")) return "The Hacker News";
    if (host.includes("bleepingcomputer")) return "BleepingComputer";
    if (host.includes("krebsonsecurity")) return "Krebs on Security";
    if (host.includes("darkreading")) return "Dark Reading";
    if (host.includes("securityweek")) return "SecurityWeek";
    if (host.includes("cybersecuritydive")) return "Cybersecurity Dive";
    if (host.includes("schneier")) return "Schneier on Security";
    if (host.includes("helpnetsecurity")) return "Help Net Security";
    if (host.includes("theregister")) return "The Register";
    if (host.includes("cisa.gov")) return "CISA";

    const parts = host.split(".");
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return "NewsFlow Wire";
  }
}