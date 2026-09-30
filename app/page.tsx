import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";
import { CategoryDeskBanner } from "@/components/CategoryDeskBanner";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

export const revalidate = 60; // Incremental Static Regeneration

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
    orderBy: { name: "asc" },
  });

  // 3. Fetch top recent articles (6 or 9 items = multiples of 3 for clean rows)
  const recentArticles = await prisma.article.findMany({
    where: { status: "published" },
    orderBy: { published_at: "desc" },
    take: 6,
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
  });

  // 4. Fetch 3 articles for each category news desk
  const categorySections = await Promise.all(
    categories
      .filter((cat) => (cat._count?.articles ?? 0) > 0)
      .map(async (category) => {
        const articles = await prisma.article.findMany({
          where: {
            categoryId: category.id,
            status: "published",
          },
          orderBy: { published_at: "desc" },
          take: 3, // Exactly 3 in one row
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
    <div className="w-full flex h-[calc(100vh-4rem)] overflow-hidden bg-[#FAF7F0] dark:bg-[#121211]">
      {/* 1. Left Sidebar: Fixed & Non-Scrollable */}
      <div className="hidden lg:block shrink-0">
        <LeftSidebar
          categories={categories}
          totalArticles={totalArticles}
        />
      </div>

      {/* 2. Middle Main Content: Scrollable Top to Down */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto px-5 sm:px-8 py-6 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#8E8B82] dark:text-[#A8A59D]">
          <Link href="/" className="hover:text-[#C96442] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-[#A8A59D]" />
          <span className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">
            Recent Intelligence
          </span>
        </nav>

        {/* Enhanced Desk Header Banner */}
        <CategoryDeskBanner
          title="All Intelligence"
          description="Autonomous AI-synthesized news desk aggregating breakthrough stories from 50+ global sources 24/7."
          slug="tech"
        />

        {/* Section: Recent Intelligence (Exactly 3 News in One Row) */}
        <section className="space-y-4 pt-2">
          <div className="flex items-baseline justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522]">
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Recent Dispatches
            </h2>
            <span className="text-xs font-mono text-[#8E8B82] dark:text-[#78756E]">
              {recentArticles.length} latest stories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {recentArticles.length === 0 && (
            <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1A1917]">
              <p className="text-sm font-mono text-[#8E8B82]">
                No stories indexed yet. Pipeline cycles will stream articles automatically.
              </p>
            </div>
          )}
        </section>

        {/* Dedicated News Type Sections (Each with exactly 3 News in One Row) */}
        <div className="space-y-10 pt-4">
          {categorySections.map(({ category, articles }) => {
            if (articles.length === 0) return null;
            return (
              <section key={category.id} className="space-y-4">
                <div className="flex items-baseline justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#C96442]" />
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
                      {category.name}
                    </h3>
                  </div>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-xs font-medium text-[#C96442] hover:underline flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer padding for scroll */}
        <div className="h-10" />
      </main>

      {/* 3. Right Sidebar: Future Ad Slots (Fixed) */}
      <div className="hidden xl:block shrink-0">
        <RightAdsSidebar />
      </div>
    </div>
  );
}