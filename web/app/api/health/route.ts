import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articleCount = await prisma.article.count();
    const categoryCount = await prisma.category.count();
    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "NewsFlow Web",
        version: "1.0.0",
        database: "connected",
        stats: { articles: articleCount, categories: categoryCount },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        service: "NewsFlow Web",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
