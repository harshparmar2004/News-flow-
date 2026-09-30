import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyApiKey, verifyAdminSession } from "@/lib/auth";
import { generateSlug, calculateReadingTime } from "@/lib/utils";

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

    // 2. Validate mandatory fields
    if (!body.title || !body.body || !body.summary) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, summary, and body are mandatory.",
        },
        { status: 400 }
      );
    }

    // 3. Resolve or Auto-create Category
    const categoryName = body.category || "AI & Robotics";
    const categorySlug = generateSlug(categoryName);

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

    // 4. Resolve slug and timestamps
    let slug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);

    // Ensure slug uniqueness
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const publishedAt = body.published_at
      ? new Date(body.published_at)
      : new Date();

    // Support scheduled status
    let status = body.status || "published";
    if (publishedAt > new Date() && status === "published") {
      status = "scheduled";
    }

    const readingTime = calculateReadingTime(body.body);

    // 5. Create Article Record
    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug,
        summary: body.summary,
        body: body.body,
        cover_image_url: body.cover_image_url || null,
        gallery_images: body.gallery_images
          ? JSON.stringify(body.gallery_images)
          : null,
        categoryId: category.id,
        tags: body.tags ? JSON.stringify(body.tags) : null,
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
      revalidatePath("/");
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