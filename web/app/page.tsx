import { prisma } from "@/lib/prisma";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";
import { HomeFeedClient } from "@/components/HomeFeedClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  // 1. Fetch total published count
  const totalArticles = await prisma.article.count({
    where: { status: "published" },
  });

  // 2. Fetch categories with article counts
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { articles: { where: { status: "published" } } },
      },
    },
    orderBy: [{ display_order: "asc" }, { name: "asc" }],
  });

  // 3. Fetch latest published news for "All Intelligence / Recent Dispatches"
  const recentArticles = await prisma.article.findMany({
    where: { status: "published" },
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
    take: 9,
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
  });

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
    <div className="w-full flex min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] lg:overflow-hidden bg-[#FAF7F0] dark:bg-[#121211]">
      {/* 1. Left Sidebar: Fixed & Non-Scrollable on Desktop */}
      <div className="hidden lg:block shrink-0">
        <LeftSidebar
          categories={categories}
          totalArticles={totalArticles}
        />
      </div>

      {/* 2. Middle Main Content: Natural scroll on mobile, scrollable pane on desktop */}
      <main className="flex-1 min-w-0 lg:h-full lg:overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6">
        <HomeFeedClient
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