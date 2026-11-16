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
  try {
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
  } catch (err) {
    console.error("Metadata error:", err);
    return { title: "Tech News | NewsFlow" };
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "ai-robotics") {
    redirect("/category/ai");
  }

  try {
    const [category, categories, totalArticles] = await Promise.all([
      prisma.category.findUnique({
        where: { slug },
        include: {
          articles: {
            where: { status: "published" },
            orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
            take: 60,
            select: {
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
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
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
  } catch (error: any) {
    console.error("Error loading category page:", error);
    
    // Check if it's a quota or connection error
    const isQuotaError = error?.message?.includes("quota") || error?.message?.includes("exceeded");

    return (
      <div className="w-full flex min-h-screen bg-[#FAF7F0] dark:bg-[#121211] items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-[#1C1B19] rounded-xl p-8 border border-[#EBE8DF] dark:border-[#2E2D29] text-center shadow-lg">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold">
            !
          </div>
          <h1 className="text-xl font-serif font-bold text-[#1F1E1D] dark:text-[#F5F2EB] mb-2">
            {isQuotaError ? "Database Capacity Reached" : "Category Feed Temporarily Unavailable"}
          </h1>
          <p className="text-xs text-[#8E8B82] dark:text-[#A8A59D] mb-6 leading-relaxed">
            {isQuotaError
              ? "The cloud database quota has been reached. Please check the Neon database console to resume normal service."
              : "We are currently experiencing a brief connection delay. Please refresh in a few moments."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#C96442] text-white hover:bg-[#b05333] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}