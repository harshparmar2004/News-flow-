import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatArticleDate } from "@/lib/utils";
import { Clock, ChevronLeft, ChevronRight, Archive as ArchiveIcon } from "lucide-react";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";

export const metadata: Metadata = {
  title: "Chronological Archive",
  description: "Browse the complete historical archive of technology intelligence published by NewsFlow.",
};

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ArchivePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 12;
  const skip = (currentPage - 1) * pageSize;

  const [articles, totalCount, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: "published" },
      orderBy: { published_at: "desc" },
      skip,
      take: pageSize,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    }),
    prisma.article.count({ where: { status: "published" } }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { status: "published" } } },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="w-full flex h-[calc(100vh-4rem)] overflow-hidden bg-[#FAF7F0] dark:bg-[#121211]">
      {/* 1. Left Sidebar: Fixed & Non-Scrollable */}
      <div className="hidden lg:block shrink-0">
        <LeftSidebar
          categories={categories}
          totalArticles={totalCount}
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
          <span>Explore</span>
          <ChevronRight className="w-3 h-3 text-[#A8A59D]" />
          <span className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">
            Timeline Archive
          </span>
        </nav>
      {/* Header */}
      <header className="p-8 sm:p-10 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-2 shadow-xs">
        <div className="flex items-center space-x-2 text-[#C96442]">
          <ArchiveIcon className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">
            Chronological Archive
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
          Publication Index
        </h1>
        <p className="text-sm text-[#686660] dark:text-[#A8A59D]">
          {totalCount} total articles cataloged across all categories.
        </p>
      </header>

      {/* Articles Feed */}
      <div className="divide-y divide-[#EBE8DF] dark:divide-[#33322E]">
        {articles.map((art) => (
          <article key={art.id} className="py-6 group">
            <div className="flex items-center space-x-3 text-xs text-[#8E8B82] dark:text-[#A8A59D] mb-1.5 font-mono">
              <span>{formatArticleDate(art.published_at)}</span>
              <span>•</span>
              <Link
                href={`/category/${art.category.slug}`}
                className="text-[#C96442] hover:underline"
              >
                {art.category.name}
              </Link>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {art.reading_time_minutes}m
              </span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] transition-colors leading-snug">
              <Link href={`/article/${art.slug}`}>{art.title}</Link>
            </h2>

            <p className="text-sm text-[#686660] dark:text-[#A8A59D] mt-2 line-clamp-2 leading-relaxed">
              {art.summary}
            </p>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-6 border-t border-[#EBE8DF] dark:border-[#33322E] flex items-center justify-between">
          <div>
            {currentPage > 1 ? (
              <Link
                href={`/archive?page=${currentPage - 1}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] text-xs font-medium text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </Link>
            ) : (
              <span className="opacity-0">Prev</span>
            )}
          </div>

          <span className="text-xs font-mono text-[#8E8B82]">
            Page {currentPage} of {totalPages}
          </span>

          <div>
            {currentPage < totalPages && (
              <Link
                href={`/archive?page=${currentPage + 1}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] text-xs font-medium text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] transition-colors"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
      </main>

      {/* 3. Right Sidebar */}
      <div className="hidden 2xl:block shrink-0">
        <RightAdsSidebar />
      </div>
    </div>
  );
}