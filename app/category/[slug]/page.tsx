import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";
import { CategoryDeskBanner } from "@/components/CategoryDeskBanner";
import { ChevronRight } from "lucide-react";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return { title: "Category Not Found | NewsFlow" };

  return {
    title: `${category.name} Intelligence | NewsFlow`,
    description: category.description || `Latest autonomous news and analysis in ${category.name}`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [category, categories, totalArticles] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: {
        articles: {
          where: { status: "published" },
          orderBy: { published_at: "desc" },
          include: { category: true },
        },
      },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { status: "published" } } },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.article.count({ where: { status: "published" } }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="w-full flex h-[calc(100vh-4rem)] overflow-hidden bg-[#FAF7F0] dark:bg-[#121211]">
      {/* 1. Left Sidebar: Fixed & Non-Scrollable */}
      <div className="hidden lg:block shrink-0">
        <LeftSidebar
          categories={categories}
          activeSlug={category.slug}
          totalArticles={totalArticles}
        />
      </div>

      {/* 2. Middle Main Content: Scrollable Top to Down */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-[#8E8B82] dark:text-[#A8A59D]">
          <Link href="/" className="hover:text-[#C96442] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-[#A8A59D]" />
          <span>Categories</span>
          <ChevronRight className="w-3 h-3 text-[#A8A59D]" />
          <span className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">
            {category.name}
          </span>
        </nav>

        {/* Enhanced Category Desk Banner (No 'posts count' text, sleek UI/UX) */}
        <CategoryDeskBanner
          title={category.name}
          description={category.description}
          slug={category.slug}
        />

        {/* 3-in-a-Row Articles Grid */}
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
            {category.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {category.articles.length === 0 && (
            <div className="text-center py-20 p-8 rounded-3xl border border-dashed border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1A1917]">
              <p className="text-sm font-mono text-[#8E8B82]">
                No published stories in this desk yet. The autonomous pipeline will dispatch updates soon.
              </p>
            </div>
          )}
        </div>

        {/* Subtle spacing padding at bottom of scroll */}
        <div className="h-10" />
      </main>

      {/* 3. Right Sidebar: Future Ad Slots (Fixed) */}
      <div className="hidden xl:block shrink-0">
        <RightAdsSidebar domain={category.slug} />
      </div>
    </div>
  );
}