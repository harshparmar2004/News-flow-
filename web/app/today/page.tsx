import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";
import { TodaysFeedClient } from "@/components/TodaysFeedClient";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://news-flow-one.vercel.app";

  return {
    title: "Today's News Wire — 24-Hour Live Tech Breakthroughs & AI News | NewsFlow",
    description: "Every tech breakthrough, AI research release, startup funding deal, and gadget launch published today. Updated continuously 24/7.",
    alternates: {
      canonical: `${siteUrl}/today`,
    },
    openGraph: {
      title: "Today's News Wire | NewsFlow",
      description: "Continuous 24/7 live tech coverage published today.",
      url: `${siteUrl}/today`,
    },
  };
}

export default async function TodaysNewsPage() {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [totalArticles, categories, todaysArticles] = await Promise.all([
    prisma.article.count({
      where: { status: "published" },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { status: "published" } } },
        },
      },
      orderBy: [{ display_order: "asc" }, { name: "asc" }],
    }),
    prisma.article.findMany({
      where: {
        status: "published",
        published_at: { gte: twentyFourHoursAgo },
      },
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    }),
  ]);

  return (
    <div className="w-full flex min-h-screen bg-[#FAF7F0] dark:bg-[#121211]">
      {/* 1. Left Sidebar: Sticky alongside feed on Desktop */}
      <div className="hidden lg:block shrink-0">
        <LeftSidebar
          categories={categories}
          activeSlug="today"
          totalArticles={totalArticles}
          todaysCount={todaysArticles.length}
        />
      </div>

      {/* 2. Middle Main Content: Natural document flow */}
      <main className="flex-1 min-w-0 px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-6 pb-24 lg:pb-12">
        <TodaysFeedClient
          articles={todaysArticles}
          totalPublishedCount={totalArticles}
        />
      </main>

      {/* 3. Right Sidebar: Future Ad Slots (Desktop only) */}
      <div className="hidden xl:block shrink-0">
        <RightAdsSidebar />
      </div>
    </div>
  );
}
