import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiKey } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getThematicCoverImage } from "@/lib/imagePool";
import { generateSlug, calculateReadingTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/research
 * Endpoint for Research AI Agent to track news across domains, extract signals, and identify research gaps.
 */
export async function GET(request: NextRequest) {
  const isAuthorized = await verifyApiKey(request);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Unauthorized. Provide valid x-api-key or Authorization Bearer header." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
  const minScore = parseInt(searchParams.get("min_score") || "0", 10);
  const mode = searchParams.get("mode") || "feed"; // "feed" | "signals"

  try {
    // 1. Resolve Category if domain parameter is provided
    let categoryId: string | undefined = undefined;
    let categoryRecord = null;

    if (domain) {
      categoryRecord = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: domain },
            { name: { equals: domain } },
          ],
        },
      });

      if (categoryRecord) {
        categoryId = categoryRecord.id;
      }
    }

    // 2. Mode: Signals & Domain Intelligence Tracking
    if (mode === "signals") {
      const allCategories = await prisma.category.findMany({
        include: {
          _count: {
            select: { articles: { where: { status: "published" } } },
          },
        },
      });

      // Aggregate top tags and recent high-score signals
      const topArticles = await prisma.article.findMany({
        where: {
          status: "published",
          categoryId: categoryId,
          rank_score: { gte: 85 },
        },
        orderBy: [{ rank_score: "desc" }, { published_at: "desc" }],
        take: 30,
        select: {
          id: true,
          title: true,
          slug: true,
          rank_score: true,
          tags: true,
          category: { select: { name: true, slug: true } },
          published_at: true,
        },
      });

      // Frequency map of keywords/tags
      const tagFrequency: Record<string, number> = {};
      topArticles.forEach((art) => {
        try {
          if (art.tags) {
            const parsed = JSON.parse(art.tags);
            if (Array.isArray(parsed)) {
              parsed.forEach((t) => {
                tagFrequency[t] = (tagFrequency[t] || 0) + 1;
              });
            }
          }
        } catch {}
      });

      const sortedTrendingTags = Object.entries(tagFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([tag, count]) => ({ tag, count }));

      const domainDistribution = allCategories.map((c) => ({
        domain: c.name,
        slug: c.slug,
        tracked_stories: c._count.articles,
      }));

      return NextResponse.json({
        success: true,
        type: "research_signals",
        timestamp: new Date().toISOString(),
        domain_filter: domain || "all_domains",
        stats: {
          total_categories_tracked: allCategories.length,
          top_scoring_stories_evaluated: topArticles.length,
        },
        domain_distribution: domainDistribution,
        trending_research_topics: sortedTrendingTags,
        high_priority_candidate_stories: topArticles.slice(0, 10),
      });
    }

    // 3. Mode: Feed (Tracked News Items for Research Agent)
    const whereClause: any = {
      status: "published",
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (minScore > 0) {
      whereClause.rank_score = { gte: minScore };
    }

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where: whereClause,
        orderBy: [{ published_at: "desc" }, { rank_score: "desc" }],
        take: limit,
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.article.count({ where: whereClause }),
    ]);

    const formattedStories = articles.map((art) => ({
      id: art.id,
      title: art.title,
      slug: art.slug,
      url: `/article/${art.slug}`,
      domain: art.category.name,
      domain_slug: art.category.slug,
      summary: art.summary,
      rank_score: art.rank_score,
      reading_time: art.reading_time_minutes,
      source_url: art.source_url,
      tags: art.tags ? JSON.parse(art.tags) : [],
      published_at: art.published_at.toISOString(),
      views: art.views_count,
    }));

    return NextResponse.json({
      success: true,
      type: "domain_news_tracker",
      timestamp: new Date().toISOString(),
      domain: domain || "all_domains",
      pagination: {
        total_tracked: totalCount,
        returned: formattedStories.length,
        limit,
      },
      stories: formattedStories,
    });
  } catch (error) {
    console.error("[Research API GET Error]:", error);
    return NextResponse.json(
      { error: "Internal server error while retrieving research data." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/research
 * Allows the Research AI Agent to post deep-dive analyses, update story ranks, or publish new domain reports.
 */
export async function POST(request: NextRequest) {
  const isAuthorized = await verifyApiKey(request);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Unauthorized. Provide valid x-api-key or Authorization Bearer header." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const action = body.action || "publish_report";

    // Action 1: Adjust Article Rank Score or Research Notes
    if (action === "update_rank") {
      const { article_id, slug, new_rank_score, research_notes } = body;

      const article = await prisma.article.findFirst({
        where: {
          OR: [{ id: article_id }, { slug: slug }],
        },
      });

      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }

      const updated = await prisma.article.update({
        where: { id: article.id },
        data: {
          rank_score: typeof new_rank_score === "number" ? new_rank_score : article.rank_score,
          is_featured: new_rank_score >= 95,
        },
      });

      return NextResponse.json({
        success: true,
        action: "update_rank",
        article: {
          id: updated.id,
          title: updated.title,
          rank_score: updated.rank_score,
        },
      });
    }

    // Action 2: Publish a Full Research Report / Synthesized Deep Dive
    const title = (body.title || body.headline || body.name || "").trim();
    const content = (body.content || body.body || body.article || body.text || "").trim();
    const summary = (
      body.summary ||
      body.description ||
      body.excerpt ||
      body.lead ||
      (content.length > 250 ? content.slice(0, 250) + "..." : content)
    ).trim();

    if (!title || !content) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: 'title' (or 'headline') and 'content' (or 'body') are required.",
        },
        { status: 400 }
      );
    }

    const rawDomain = (body.domain || body.category || body.section || body.topic || "AI").trim();
    let domainSlug = generateSlug(rawDomain);
    let domainName = rawDomain;

    if (domainSlug === "robotics" || domainSlug.includes("robot")) {
      domainSlug = "robotics";
      domainName = "Robotics";
    } else if (domainSlug === "ai" || domainSlug === "artificial-intelligence" || domainSlug === "ai-robotics") {
      domainSlug = "ai";
      domainName = "Artificial Intelligence";
    }

    // Resolve or create category
    let category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: domainSlug },
          { name: { equals: domainName } },
          { slug: domainName.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
        ],
      },
    });

    if (!category) {
      category = await prisma.category.findFirst({
        where: { slug: "ai" },
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: domainName,
            slug: domainSlug,
            description: `Intelligence and research updates on ${domainName}`,
          },
        });
      }
    }

    // Flexible cover image support
    const rawImage =
      body.cover_image_url ||
      body.image_url ||
      body.image ||
      body.lead_image_url ||
      body.cover_image ||
      body.photo ||
      body.img ||
      null;

    const finalCoverImage =
      rawImage && typeof rawImage === "string" && rawImage.trim().startsWith("http")
        ? rawImage.trim()
        : getThematicCoverImage(category.slug, title);

    const rank_score =
      typeof body.rank_score === "number" ? body.rank_score : 95;
    const is_featured =
      body.is_featured !== undefined ? Boolean(body.is_featured) : rank_score >= 90;

    let parsedTags = body.tags || [];
    if (typeof parsedTags === "string") {
      try {
        parsedTags = JSON.parse(parsedTags);
      } catch {
        parsedTags = parsedTags.split(",").map((t: string) => t.trim()).filter(Boolean);
      }
    }

    const cleanSlug = body.slug ? generateSlug(body.slug) : generateSlug(title);

    // GUARANTEED TOP PLACEMENT:
    // News articles across sections and the homepage order by published_at DESC.
    // Setting published_at to the current exact timestamp guarantees this research piece
    // is placed at the very top (first) of its section, category, and homepage feeds.
    const nowTimestamp = new Date();

    const readingTime = calculateReadingTime(content);

    const newReport = await prisma.article.upsert({
      where: { slug: cleanSlug },
      update: {
        title,
        summary,
        body: content,
        categoryId: category.id,
        tags: JSON.stringify(parsedTags),
        rank_score,
        is_featured,
        reading_time_minutes: readingTime,
        cover_image_url: finalCoverImage,
        source_url: body.source_url || body.url || "https://newsflow.ai/research",
        status: "published",
        published_at: nowTimestamp, // Updates timestamp so modified/re-researched news jumps to #1
        author: body.author || "NewsFlow Research Agent",
      },
      create: {
        title,
        slug: cleanSlug,
        summary,
        body: content,
        categoryId: category.id,
        tags: JSON.stringify(parsedTags),
        rank_score,
        is_featured,
        reading_time_minutes: readingTime,
        cover_image_url: finalCoverImage,
        source_url: body.source_url || body.url || "https://newsflow.ai/research",
        author: body.author || "NewsFlow Research Agent",
        status: "published",
        published_at: nowTimestamp,
      },
      include: {
        category: true,
      },
    });

    // Invalidate ISR cache across the whole site so the article appears on top instantly
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath(`/category/${category.slug}`);
      revalidatePath(`/article/${newReport.slug}`);
      revalidatePath("/archive");
      revalidatePath("/rss.xml");
    } catch (revalErr) {
      console.warn("[Research ISR revalidation warning]:", revalErr);
    }

    return NextResponse.json({
      success: true,
      action: "published_research_report",
      position: "top",
      article: {
        id: newReport.id,
        title: newReport.title,
        slug: newReport.slug,
        url: `/article/${newReport.slug}`,
        category: newReport.category.name,
        domain_slug: newReport.category.slug,
        cover_image_url: newReport.cover_image_url,
        published_at: newReport.published_at.toISOString(),
        rank_score: newReport.rank_score,
        is_featured: newReport.is_featured,
      },
    });
  } catch (error) {
    console.error("[Research API POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to process research agent payload." },
      { status: 500 }
    );
  }
}