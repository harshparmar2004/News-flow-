import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";
import { CategoryFeedClient } from "@/components/CategoryFeedClient";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "ai-robotics") {
    return { title: "Artificial Intelligence Intelligence | NewsFlow" };
  }
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

  if (slug === "ai-robotics") {
    redirect("/category/ai");
  }

  const [category, categories, totalArticles] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: {
        articles: {
          where: { status: "published" },
          orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
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
      orderBy: [{ display_order: "asc" }, { name: "asc" }],
    }),
    prisma.article.count({ where: { status: "published" } }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="w-full flex min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] lg:overflow-hidden bg-[#FAF7F0] dark:bg-[#121211]">
      {/* 1. Left Sidebar: Fixed & Non-Scrollable on Desktop */}
      <div className="hidden lg:block shrink-0">
        <LeftSidebar
          categories={categories}
          activeSlug={category.slug}
          totalArticles={totalArticles}
        />
      </div>

      {/* 2. Middle Main Content: Natural scroll on mobile, scrollable pane on desktop */}
      <main className="flex-1 min-w-0 lg:h-full lg:overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6">
        <CategoryFeedClient category={category} />
      </main>

      {/* 3. Right Sidebar: Future Ad Slots (Desktop only) */}
      <div className="hidden xl:block shrink-0">
        <RightAdsSidebar domain={category.slug} />
      </div>
    </div>
  );
}