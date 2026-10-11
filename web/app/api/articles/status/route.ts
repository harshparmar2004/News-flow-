import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiKey, verifyAdminSession } from "@/lib/auth";

/**
 * GET /api/articles/status?slugs=a,b,c
 * Returns the current Admin status (draft / published / scheduled) for the given slugs.
 * Used by the Research Agent dashboard to mirror what you approve in NewsFlow Admin.
 */
export async function GET(req: NextRequest) {
  const okKey = await verifyApiKey(req);
  const okAdmin = await verifyAdminSession();
  if (!okKey && !okAdmin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const slugs = (new URL(req.url).searchParams.get("slugs") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 500);

  if (slugs.length === 0) {
    return NextResponse.json({ success: true, items: [] });
  }

  const rows = await prisma.article.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true, status: true, published_at: true, is_featured: true },
  });

  return NextResponse.json({
    success: true,
    items: rows,
    missing: slugs.filter((s) => !rows.some((r) => r.slug === s)),
  });
}
