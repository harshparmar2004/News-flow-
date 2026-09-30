import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiKey } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
    const {
      title,
      summary,
      content,
      domain = "AI & Robotics",
      tags = [],
      rank_score = 90,
      source_url,
      cover_image_url,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: 'title' and 'content' are required." },
        { status: 400 }
      );
    }

    // Resolve or find domain
    let category = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: domain } },
          { slug: domain.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
        ],
      },
    });

    if (!category) {
      category = await prisma.category.findFirst({
        where: { slug: "ai-robotics" },
      });
    }

    const cleanSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newReport = await prisma.article.upsert({
      where: { slug: cleanSlug },
      update: {
        title,
        summary: summary || title,
        body: content,
        categoryId: category!.id,
        tags: JSON.stringify(tags),
        rank_score,
        is_featured: rank_score >= 95,
        cover_image_url:
          cover_image_url ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
        source_url: source_url || "https://newsflow.ai/research",
        status: "published",
      },
      create: {
        title,
        slug: cleanSlug,
        summary: summary || title,
        body: content,
        categoryId: category!.id,
        tags: JSON.stringify(tags),
        rank_score,
        is_featured: rank_score >= 95,
        reading_time_minutes: Math.max(2, Math.ceil(content.split(/\s+/).length / 200)),
        cover_image_url:
          cover_image_url ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
        source_url: source_url || "https://newsflow.ai/research",
        author: "NewsFlow Research Agent",
        status: "published",
      },
    });

    // Invalidate ISR cache so the research report appears instantly
    revalidatePath("/");
    revalidatePath(`/category/${category!.slug}`);
    revalidatePath(`/article/${newReport.slug}`);

    return NextResponse.json({
      success: true,
      action: "published_research_report",
      article: {
        id: newReport.id,
        title: newReport.title,
        slug: newReport.slug,
        url: `/article/${newReport.slug}`,
        domain: category!.name,
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