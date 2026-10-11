import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyApiKey, verifyAdminSession } from "@/lib/auth";
import { calculateReadingTime } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/articles/[id]
 * Update an existing article
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const isApiKeyValid = await verifyApiKey(req);
    const adminSession = await verifyAdminSession();

    if (!isApiKeyValid && !adminSession) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (body.title) updateData.title = body.title;
    if (body.summary) updateData.summary = body.summary;
    if (body.body) {
      updateData.body = body.body;
      updateData.reading_time_minutes = calculateReadingTime(body.body);
    }
    if (body.cover_image_url !== undefined) updateData.cover_image_url = body.cover_image_url;
    if (body.status) {
      updateData.status = body.status;
      // When publishing an article or moving from draft to published, refresh published_at
      // so it is immediately promoted to the top of its section
      if (body.status === "published" && (!existing.published_at || existing.status !== "published" || body.publish_now)) {
        updateData.published_at = new Date();
      }
    }
    if (body.is_featured !== undefined) updateData.is_featured = Boolean(body.is_featured);
    if (body.rank_score !== undefined) updateData.rank_score = Number(body.rank_score);
    if (body.source_url !== undefined) updateData.source_url = body.source_url;
    if (body.tags) updateData.tags = JSON.stringify(body.tags);
    if (body.affiliate_links) updateData.affiliate_links = JSON.stringify(body.affiliate_links);
    if (body.seo_meta) updateData.seo_meta = JSON.stringify(body.seo_meta);

    const updated = await prisma.article.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    // Revalidate caches
    try {
      revalidatePath("/", "layout");
      revalidatePath(`/article/${updated.slug}`);
      revalidatePath(`/category/${updated.category.slug}`);
      revalidatePath("/archive");
      revalidatePath("/rss.xml");
      revalidatePath("/sitemap.xml");
    } catch (e) {
      console.warn("ISR revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      article: updated,
    });
  } catch (error: any) {
    console.error("PUT /api/articles/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update article" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/articles/[id]
 * Remove or archive an article
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const isApiKeyValid = await verifyApiKey(req);
    const adminSession = await verifyAdminSession();

    if (!isApiKeyValid && !adminSession) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const hardDelete = searchParams.get("hard") === "true";

    const article = await prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!article) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    if (hardDelete) {
      await prisma.article.delete({ where: { id } });
    } else {
      await prisma.article.update({
        where: { id },
        data: { status: "archived" },
      });
    }

    try {
      revalidatePath("/");
      revalidatePath(`/article/${article.slug}`);
      revalidatePath(`/category/${article.category.slug}`);
      revalidatePath("/archive");
    } catch {}

    return NextResponse.json({
      success: true,
      message: hardDelete ? "Article permanently deleted" : "Article archived successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/articles/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete article" },
      { status: 500 }
    );
  }
}