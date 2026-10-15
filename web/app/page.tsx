import { prisma } from "@/lib/prisma";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";
import { HomeFeedClient } from "@/components/HomeFeedClient";

export const revalidate = 30;

export default async function HomePage() {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

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
      take: 60,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
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
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
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
          take: 6, // Fetch up to 6 stories per desk for live Latest/Top today/Most read sorting
          include: {
            category: {
              select: { name: true, slug: true },
            },
          },
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
}