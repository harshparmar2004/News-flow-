import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  const authHeader = req.headers.get("x-api-key");
  const isValidApiKey = authHeader && authHeader === process.env.NEWSFLOW_API_KEY;

  if (!session && !isValidApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, ids, category_id } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No article IDs provided" }, { status: 400 });
    }

    let resultCount = 0;

    switch (action) {
      case "publish": {
        const update = await prisma.article.updateMany({
          where: { id: { in: ids } },
          data: { status: "published", published_at: new Date() },
        });
        resultCount = update.count;
        try {
          revalidatePath("/", "layout");
        } catch {}
        break;
      }
      case "draft": {
        const update = await prisma.article.updateMany({
          where: { id: { in: ids } },
          data: { status: "draft" },
        });
        resultCount = update.count;
        break;
      }
      case "archive": {
        const update = await prisma.article.updateMany({
          where: { id: { in: ids } },
          data: { status: "archived" },
        });
        resultCount = update.count;
        break;
      }
      case "category": {
        if (!category_id) {
          return NextResponse.json({ error: "Category ID is required for reassignment" }, { status: 400 });
        }
        const update = await prisma.article.updateMany({
          where: { id: { in: ids } },
          data: { categoryId: category_id },
        });
        resultCount = update.count;
        break;
      }
      case "delete": {
        const del = await prisma.article.deleteMany({
          where: { id: { in: ids } },
        });
        resultCount = del.count;
        break;
      }
      default:
        return NextResponse.json({ error: `Unknown bulk action: ${action}` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully executed ${action} on ${resultCount} articles.`,
      count: resultCount,
      action,
    });
  } catch (error: any) {
    console.error("Bulk articles operation failed:", error);
    return NextResponse.json({ error: error.message || "Failed to process bulk operation" }, { status: 500 });
  }
}
