import { prisma } from "@/lib/prisma";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";
import { HomeFeedClient } from "@/components/HomeFeedClient";

export const revalidate = 30;

const ARTICLE_FEED_SELECT = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  cover_image_url: true,
  published_at: true,
  created_at: true,
  rank_score: true,
  views_count: true,
  reading_time_minutes: true,
  category: {
    select: { name: true, slug: true },
  },
};

export default async function HomePage() {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  try {
    // 1. Fetch total count, categories, recent articles, and today's articles in parallel
    const [totalArticles, categories, recentArticles, todaysArticles] = await Promise.all([
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
        where: { status: "published" },
        orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
        take: 40,
        select: ARTICLE_FEED_SELECT,
      }),
      // Query ALL articles published or created in the last 24 hours (strictly newest published first)
      prisma.article.findMany({
        where: {
          status: "published",
          OR: [
            { published_at: { gte: twentyFourHoursAgo } },
            { created_at: { gte: twentyFourHoursAgo } },
          ],
        },
        orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
        take: 30,
        select: ARTICLE_FEED_SELECT,
      }),
    ]);

    // Ensure Today's News always has plenty of items to show (fallback to recent dispatches if fewer than 15)
    const finalTodaysArticles = todaysArticles.length >= 15 ? todaysArticles : recentArticles;

    // 4. Fetch articles for each category news desk (ordered by published_at desc, created_at desc)
    const categorySections = await Promise.all(
      categories
        .filter((cat) => (cat._count?.articles ?? 0) > 0)
        .map(async (category) => {
          const articles = await prisma.article.findMany({
            where: {
              categoryId: category.id,
              status: "published",
            },
            orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
            take: 6,
            select: ARTICLE_FEED_SELECT,
          });
          return {
            category,
            articles,
          };
        })
    );

    return (
      <div className="w-full flex min-h-screen bg-[#FAF7F0] dark:bg-[#121211]">
        {/* 1. Left Sidebar: Sticky alongside feed on Desktop */}
        <div className="hidden lg:block shrink-0">
          <LeftSidebar
            categories={categories}
            totalArticles={totalArticles}
            todaysCount={Math.max(todaysArticles.length, finalTodaysArticles.length)}
          />
        </div>

        {/* 2. Middle Main Content: Natural document flow */}
        <main className="flex-1 min-w-0 px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-6 pb-24 lg:pb-12">
          <HomeFeedClient
            todaysArticles={finalTodaysArticles}
            recentArticles={recentArticles}
            categorySections={categorySections}
          />
        </main>

        {/* 3. Right Sidebar: Future Ad Slots (Desktop only) */}
        <div className="hidden xl:block shrink-0">
          <RightAdsSidebar />
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("Error loading home page:", error);
    const isQuotaError = error?.message?.includes("quota") || error?.message?.includes("exceeded");

    return (
      <div className="w-full flex min-h-screen bg-[#FAF7F0] dark:bg-[#121211] items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-[#1C1B19] rounded-xl p-8 border border-[#EBE8DF] dark:border-[#2E2D29] text-center shadow-lg">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold">
            !
          </div>
          <h1 className="text-xl font-serif font-bold text-[#1F1E1D] dark:text-[#F5F2EB] mb-2">
            {isQuotaError ? "Database Capacity Reached" : "NewsFlow Wire Connecting..."}
          </h1>
          <p className="text-xs text-[#8E8B82] dark:text-[#A8A59D] mb-6 leading-relaxed">
            {isQuotaError
              ? "The cloud database quota has been reached on Neon. Please check the Neon database console to resume normal service."
              : "We are currently reconnecting to the news wire. Please reload the page."}
          </p>
        </div>
      </div>
    );
  }
}