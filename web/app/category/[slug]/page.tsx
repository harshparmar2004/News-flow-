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
  const category = await prisma.category.findUnique({
    where: { slug: slug === "ai-robotics" ? "ai" : slug },
  });

  if (!category) return { title: "Category Not Found | NewsFlow" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://news-flow-one.vercel.app";
  const catName = category.name.includes("News") ? category.name : `${category.name} News`;

  return {
    title: `${catName} — Latest Breakthroughs & Live Updates | NewsFlow`,
    description: category.description || `Breaking ${catName.toLowerCase()}, frontier innovation, research shifts, and deep tech developments updated live 24/7 on NewsFlow.`,
    alternates: {
      canonical: `${siteUrl}/category/${category.slug}`,
    },
    openGraph: {
      title: `${catName} | NewsFlow`,
      description: category.description || `Live 24/7 breaking updates on ${category.name}.`,
      url: `${siteUrl}/category/${category.slug}`,
    },
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
    <div className="w-full flex min-h-screen bg-[#FAF7F0] dark:bg-[#121211]">
      {/* 1. Left Sidebar: Sticky alongside feed on Desktop */}
      <div className="hidden lg:block shrink-0">
        <LeftSidebar
          categories={categories}
          activeSlug={category.slug}
          totalArticles={totalArticles}
        />
      </div>

      {/* 2. Middle Main Content: Natural document flow */}
      <main className="flex-1 min-w-0 px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-6 pb-24 lg:pb-12">
        <CategoryFeedClient category={category} />
      </main>

      {/* 3. Right Sidebar: Future Ad Slots (Desktop only) */}
      <div className="hidden xl:block shrink-0">
        <RightAdsSidebar domain={category.slug} />
      </div>
    </div>
  );
}