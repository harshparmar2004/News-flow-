import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Automated bot, crawler, and headless browser regex patterns
const BOT_PATTERNS = [
  /bot\b/i,
  /crawler/i,
  /spider/i,
  /slurp/i,
  /headless/i,
  /lighthouse/i,
  /python-requests/i,
  /aiohttp/i,
  /curl/i,
  /wget/i,
  /postman/i,
  /node-fetch/i,
  /axios/i,
  /urllib/i,
  /scrapy/i,
];

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || "";

    // 1. Filter out automated scrapers, build bots, and headless scripts
    if (BOT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
      return NextResponse.json({ skipped: true, reason: "bot_ignored" }, { status: 200 });
    }

    const body = await req.json().catch(() => ({}));
    const articleId = body.articleId;

    if (!articleId || typeof articleId !== "string") {
      return NextResponse.json({ error: "Missing or invalid articleId" }, { status: 400 });
    }

    // 2. Increment genuine reader view
    await prisma.article.update({
      where: { id: articleId },
      data: { views_count: { increment: 1 } },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("View increment error:", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
