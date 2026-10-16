import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyApiKey, verifyAdminSession } from "@/lib/auth";
import { generateSlug, calculateReadingTime, formatArticleContent } from "@/lib/utils";
import { getThematicCoverImage } from "@/lib/imagePool";

// Canonical domain taxonomy
const CANONICAL_CATEGORIES: Record<string, { name: string; slug: string }> = {
  "ai": { name: "Artificial Intelligence", slug: "ai" },
  "robotics": { name: "Robotics", slug: "robotics" },
  "ai-robotics": { name: "Artificial Intelligence", slug: "ai" },
  "startups-vc": { name: "Startups & VC", slug: "startups-vc" },
  "gadgets-hardware": { name: "Gadgets & Hardware", slug: "gadgets-hardware" },
  "cybersecurity": { name: "Cybersecurity", slug: "cybersecurity" },
  "tech": { name: "Tech & Innovation", slug: "tech" },
};

// Precise regex patterns with word boundaries to prevent substring collisions (e.g. 'mainstream' != 'ai')
const CATEGORY_PATTERNS: Array<{
  key: string;
  patterns: RegExp[];
}> = [
  {
    key: "cybersecurity",
    patterns: [
      /\b(?:ransomware|malware|phishing|breach(?:es|ed)?|zero-day|vulnerabilit(?:y|ies)|cve-\d+|cisa|ddos|spyware|trojan|infostealer|cyber(?:attack|security|crime|threat|espionage)|data leak|exploit(?:s|ed)?|botnet|dark web|backdoor|patch tuesday|bug bounty|infosec|credential stuffing|credential leak|threat actor|hacked database|hackers breach)\b/i,
      /\b(?:cyber threat|threat actor|hacked account|hacked database|hackers breach|security advisory|threat intelligence)\b/i,
      /(?<!hacker\s)\b(?:hackers?|hacked)\b(?!\snews)/i,
    ],
  },
  {
    key: "startups-vc",
    patterns: [
      /\b(?:funding|seed round|series [a-g]|venture capital|vcs?|valuation|investor|investors|pre-seed|unicorn|angel investor|y combinator|sequoia|a16z|andreessen|acqui(?:re|res|red|sition)|buyout|ipo|merger|venture-backed|bootstrapped startup|early-stage|late-stage|techstars|venture debt|growth equity|term sheet|pitch deck)\b/i,
      /\b(?:vc bashing|vc firm|seed funding|series a funding|series b funding|fundraising round|backed by investors)\b/i,
      /\b(?:raises \$|raised \$|secures \$|closes \$|valued at \$|raising \$)\b/i,
      /\b(?:raises?|raised|secures?|secured|closes?|closed)\s+(?:[\$€£]|[\d\.]+\s*(?:million|billion|mn|bn))\b/i,
    ],
  },
  {
    key: "gadgets-hardware",
    patterns: [
      /\b(?:smartphone|iphone|ipad|pixel (?:fold|\d+)|macbook|laptop|laptops|gpus?|cpus?|nvidia rtx|amd radeon|intel core|qualcomm|snapdragon|tsmc|semiconductor|semiconductors|wafer|silicon|processor|processors|foldable|tablet|smartwatch|smartwatches|galaxy watch|apple watch|headphones|earbuds|oled|monitor|playstation|nintendo|xbox|bios|motherboard|firmware|wearable|vr headset|ar glasses|apple vision|meta quest|smart glasses|kindle|handheld|geforce|radeon|core ultra|snapdragon x|m3|m4|ssd|nvme|ram|ddr\d)\b/i,
    ],
  },
  {
    key: "robotics",
    patterns: [
      /\b(?:robot|robots|robotic|robotics|roboticist|humanoid|humanoids|bipedal|quadruped|quadrupeds|boston dynamics|electric atlas|figure 02|figure ai|sanctuary ai|phoenix humanoid|unitree|optimus|tesla bot|drone|drones|dji|uav|quadcopter|actuator|actuators|hydraulic|manipulator|dexterous manipulation|autonomous vehicle|self-driving|waymo|zoox|robotaxi|embodied ai|physical intelligence|fourier intelligence|cyberdog|delivery robot|automated warehouse|exoskeleton|cobot|cobots|agv|amr)\b/i,
    ],
  },
  {
    key: "ai",
    patterns: [
      /\b(?:ai|artificial intelligence|llms?|large language model|openai|chatgpt|gpt-[345]|claude|anthropic|gemini|deepmind|autonomous agent|neural network|machine learning|deep learning|diffusion model|transformer|mistral|llama|ollama|grok|reasoning model|r1|agentic|copilot|multimodal|generative ai|devin|pixtral|synthetic data|vector db|rag|deepseek|perplexity|cohere|stability ai|runway|sora|genai|superintelligence|agi|foundation model|context window|fine-tuning|reinforcement learning|rlhf|antigravity|ai model|ai models|ai tool|ai tools|ai safety|ai startup|ai agent|ai agents|sam altman)\b/i,
    ],
  },
];

function scoreRegexMatches(patterns: RegExp[], text: string): number {
  let count = 0;
  for (const pat of patterns) {
    const matches = text.match(new RegExp(pat.source, pat.flags + "g"));
    if (matches) count += matches.length;
  }
  return count;
}

function cleanTextForTriage(text: string): string {
  return text
    .replace(/source:\s*hacker news/gi, "")
    .replace(/#\w+/g, "")
    .toLowerCase();
}

function classifyDomainWithJev(
  title: string,
  summary: string,
  bodyContent: string,
  explicitCategory?: string | null
): { name: string; slug: string } {
  let normExplicit = (explicitCategory || "").toLowerCase().trim();
  if (normExplicit === "ai-robotics") normExplicit = "ai";

  // Resolve canonical key for explicit category if passed
  let explicitSlug: string | null = null;
  if (normExplicit) {
    for (const [key, cat] of Object.entries(CANONICAL_CATEGORIES)) {
      if (
        normExplicit === key ||
        normExplicit === cat.name.toLowerCase() ||
        normExplicit === cat.slug
      ) {
        explicitSlug = key === "ai-robotics" ? "ai" : key;
        break;
      }
    }
  }

  const cleanTitle = cleanTextForTriage(title);
  const cleanSummary = cleanTextForTriage(summary || "");
  const cleanBodySample = cleanTextForTriage(bodyContent.slice(0, 800));

  let bestKey = "tech";
  let maxScore = 0;

  for (const item of CATEGORY_PATTERNS) {
    // Title matches are strongest signal (4x), summary (2x), body sample (1x)
    const tScore = scoreRegexMatches(item.patterns, cleanTitle) * 4;
    const sScore = scoreRegexMatches(item.patterns, cleanSummary) * 2;
    const bScore = scoreRegexMatches(item.patterns, cleanBodySample);
    let total = tScore + sScore + bScore;

    // Intelligent prior (+2): gives source desk an advantage on generic titles,
    // but strong domain signals (e.g. OpenAI on a hardware feed) will cleanly override it.
    if (explicitSlug && explicitSlug === item.key) {
      total += 2;
    }

    if (total > maxScore) {
      maxScore = total;
      bestKey = item.key;
    }
  }

  // If content had no strong signals and a non-tech explicit desk was provided, preserve it
  if (maxScore <= 2 && explicitSlug && explicitSlug !== "tech" && CANONICAL_CATEGORIES[explicitSlug]) {
    return CANONICAL_CATEGORIES[explicitSlug];
  }

  return CANONICAL_CATEGORIES[bestKey] || CANONICAL_CATEGORIES["tech"];
}

/**
 * GET /api/articles
 * Query published articles with pagination and filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const status = searchParams.get("status") || "published";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status !== "all") {
      where.status = status;
    }
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { published_at: "desc" },
        skip,
        take: limit,
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/articles
 * Autonomous Agent Publishing Endpoint (API Key authenticated)
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify API Key or Admin Session
    const isApiKeyValid = await verifyApiKey(req);
    const adminSession = await verifyAdminSession();

    if (!isApiKeyValid && !adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or missing API key (x-api-key header)",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    // 2. Validate mandatory fields (support aliases)
    const title = (body.title || body.headline || "").trim();
    const rawBody = (body.body || body.content || body.article || "").trim();
    const bodyContent = formatArticleContent(rawBody, title);
    const summary = (
      body.summary ||
      body.description ||
      body.excerpt ||
      (bodyContent.length > 250 ? bodyContent.slice(0, 250) + "..." : bodyContent)
    ).trim();

    if (!title || !bodyContent) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title (or headline) and body (or content) are mandatory.",
        },
        { status: 400 }
      );
    }

    // 2b. Duplicate protection: same source_url => return existing article
    if (body.source_url) {
      const duplicate = await prisma.article.findFirst({
        where: { source_url: body.source_url },
        include: { category: true },
      });
      if (duplicate) {
        return NextResponse.json(
          {
            success: true,
            duplicate: true,
            message: "Article with this source_url already exists",
            article: {
              id: duplicate.id,
              slug: duplicate.slug,
              url: `/article/${duplicate.slug}`,
              title: duplicate.title,
              status: duplicate.status,
              published_at: duplicate.published_at,
              category: duplicate.category.name,
            },
          },
          { status: 200 }
        );
      }
    }


    // 3. Resolve Category with TypeSafe JEV Domain Triage
    const targetCat = classifyDomainWithJev(
      title,
      summary,
      bodyContent,
      body.category || body.domain
    );
    const categoryName = targetCat.name;
    const categorySlug = targetCat.slug;

    let category = await prisma.category.findFirst({
      where: {
        OR: [{ slug: categorySlug }, { name: categoryName }],
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: categorySlug,
          description: `Latest articles in ${categoryName}`,
        },
      });
    }

    // Resolve cover image (accept flexible aliases or assign thematic pool image)
    const rawCover =
      body.cover_image_url ||
      body.image_url ||
      body.image ||
      body.lead_image_url ||
      body.cover_image ||
      body.photo ||
      null;

    const finalCoverImage =
      rawCover && typeof rawCover === "string" && rawCover.trim().length > 0
        ? rawCover.trim()
        : getThematicCoverImage(category.slug, title);

    // 4. Resolve slug and timestamps
    let slug = body.slug ? generateSlug(body.slug) : generateSlug(title);

    // Ensure slug uniqueness
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Ensure newly ingested news appears at the top of Today's News and the live feed:
    // Only preserve external source timestamp if it is recent (within last 3 hours);
    // otherwise default to now so newly published stories lead the homepage.
    const now = new Date();
    let publishedAt = now;
    if (body.published_at) {
      const parsed = new Date(body.published_at);
      if (!isNaN(parsed.getTime())) {
        const ageMs = now.getTime() - parsed.getTime();
        if (ageMs >= 0 && ageMs <= 3 * 60 * 60 * 1000) {
          publishedAt = parsed;
        } else {
          publishedAt = now;
        }
      }
    }

    // Never mark as scheduled due to slight clock drift; clamp to now
    let status = body.status || "published";
    if (status === "published" && publishedAt > now) {
      publishedAt = now;
    }

    const readingTime = calculateReadingTime(bodyContent);

    // 5. Create Article Record
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        summary,
        body: bodyContent,
        cover_image_url: finalCoverImage,
        gallery_images: body.gallery_images
          ? JSON.stringify(body.gallery_images)
          : null,
        categoryId: category.id,
        tags: body.tags
          ? typeof body.tags === "string"
            ? body.tags
            : JSON.stringify(body.tags)
          : null,
        author: body.author || "NewsFlow AI",
        published_at: publishedAt,
        status,
        rank_score: typeof body.rank_score === "number" ? body.rank_score : 75,
        is_featured: Boolean(body.is_featured),
        reading_time_minutes: readingTime,
        source_url: body.source_url || null,
        affiliate_links: body.affiliate_links
          ? JSON.stringify(body.affiliate_links)
          : null,
        seo_meta: body.seo_meta ? JSON.stringify(body.seo_meta) : null,
      },
      include: {
        category: true,
      },
    });

    // 6. Immediate On-Demand Cache Invalidation (ISR)
    try {
      revalidatePath("/", "layout");
      revalidatePath(`/article/${slug}`);
      revalidatePath(`/category/${category.slug}`);
      revalidatePath("/archive");
      revalidatePath("/rss.xml");
      revalidatePath("/sitemap.xml");
    } catch (revalErr) {
      console.warn("ISR revalidation warning:", revalErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Article published successfully",
        article: {
          id: article.id,
          slug: article.slug,
          url: `/article/${article.slug}`,
          title: article.title,
          status: article.status,
          published_at: article.published_at,
          category: article.category.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/articles error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to publish article" },
      { status: 500 }
    );
  }
}