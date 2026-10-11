import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatArticleDate, formatTimeAgo } from "@/lib/utils";
import { Clock, ChevronLeft, ChevronRight, Archive as ArchiveIcon, RotateCcw, ArrowRight } from "lucide-react";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";
import { EditorialColophon } from "@/components/EditorialColophon";

export const metadata: Metadata = {
  title: "Chronological Archive | NewsFlow",
  description: "Browse the complete historical archive of technology intelligence published by NewsFlow.",
};

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function ArchivePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const categorySlug = params.category && params.category !== "all" ? params.category : undefined;
  const pageSize = 12;
  const skip = (currentPage - 1) * pageSize;

  const whereClause: { status: string; category?: { slug: string } } = { status: "published" };
  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  const [articles, totalCount, categories, allArticlesCount] = await Promise.all([
    prisma.article.findMany({
      where: whereClause,
      orderBy: { published_at: "desc" },
      skip,
      take: pageSize,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    }),
    prisma.article.count({ where: whereClause }),
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

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="w-full flex min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] lg:overflow-hidden bg-[#FAF7F0] dark:bg-[#121211]">
      {/* 1. Left Sidebar: Fixed & Non-Scrollable on Desktop */}
      <div className="hidden lg:block shrink-0">
        <LeftSidebar
          categories={categories}
          totalArticles={allArticlesCount}
        />
      </div>

      {/* 2. Middle Main Content: Natural scroll on mobile, scrollable pane on desktop */}
      <main className="flex-1 min-w-0 lg:h-full lg:overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6 space-y-6">
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

        {/* Compact, Organized Executive Header */}
        <header className="rounded-2xl border border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1C1B19] p-4 sm:p-5 space-y-4 shadow-xs">
          {/* Top Row: Icon, Title & Reset Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] dark:bg-[#252422] border border-[#EBE8DF] dark:border-[#2E2C28] flex items-center justify-center text-[#C96442] shadow-2xs shrink-0">
                <ArchiveIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2.5">
                  <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
                    Publication Index
                  </h1>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F0] dark:bg-[#252422] text-[#8E8B82] border border-[#EBE8DF] dark:border-[#2E2C28]">
                    {totalCount} cataloged
                  </span>
                </div>
                <p className="text-xs text-[#8E8B82] dark:text-[#78756E] font-mono mt-0.5 truncate">
                  Chronological technology intelligence ledger across all editorial desks
                </p>
              </div>
            </div>

            {categorySlug && (
              <Link
                href="/archive"
                className="self-start sm:self-center inline-flex items-center space-x-1.5 text-xs font-mono text-[#C96442] hover:text-[#b85535] px-2.5 py-1 rounded-lg bg-[#C96442]/5 hover:bg-[#C96442]/10 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset filter</span>
              </Link>
            )}
          </div>

          {/* Category Filter Chips Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 pb-0.5">
            <Link
              href="/archive"
              className={`text-xs px-3 py-1 rounded-lg font-medium shrink-0 transition-all ${
                !categorySlug
                  ? "bg-[#C96442] text-white shadow-2xs font-semibold"
                  : "border border-[#EBE8DF] dark:border-[#2A2925] bg-[#FAF7F0] dark:bg-[#201F1D] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]/60 hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
              }`}
            >
              All Desks
              <span className="text-[10px] opacity-75 font-mono ml-1.5">({allArticlesCount})</span>
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/archive?category=${c.slug}`}
                className={`text-xs px-3 py-1 rounded-lg font-medium shrink-0 transition-all ${
                  categorySlug === c.slug
                    ? "bg-[#C96442] text-white shadow-2xs font-semibold"
                    : "border border-[#EBE8DF] dark:border-[#2A2925] bg-[#FAF7F0] dark:bg-[#201F1D] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]/60 hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
                }`}
              >
                {c.name}
                {c._count?.articles !== undefined && (
                  <span className="text-[10px] opacity-75 font-mono ml-1.5">
                    ({c._count.articles})
                  </span>
                )}
              </Link>
            ))}
          </div>
        </header>

        {/* Section Divider Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522] w-full">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#C96442]" />
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Timeline Ledger
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8E8B82] dark:text-[#78756E]">
            Showing {totalCount > 0 ? skip + 1 : 0}–{Math.min(skip + pageSize, totalCount)} of {totalCount} entries
          </span>
        </div>

        {/* Structured Timeline Article Cards */}
        <div className="space-y-3.5">
          {articles.map((art) => (
            <article
              key={art.id}
              className="group rounded-2xl border border-[#EBE8DF] dark:border-[#2A2925] bg-white dark:bg-[#1C1B19] p-4 sm:p-5 hover:border-[#C96442]/60 hover:shadow-md hover:shadow-black/5 transition-all duration-200 flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
            >
              {/* Thumbnail Image */}
              <Link
                href={`/article/${art.slug}`}
                className="w-full sm:w-44 md:w-48 aspect-16/10 rounded-xl overflow-hidden shrink-0 bg-[#FAF7F0] dark:bg-[#252422] relative block"
              >
                {art.cover_image_url ? (
                  <img
                    src={art.cover_image_url}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#8E8B82] bg-linear-to-br from-[#242320] to-[#171615]">
                    NewsFlow AI
                  </div>
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/75 text-white backdrop-blur-xs">
                  {formatArticleDate(art.published_at)}
                </span>
              </Link>

              {/* Content Body */}
              <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2.5 w-full">
                <div className="space-y-1.5">
                  {/* Meta Row: Category + Read Time + Time Ago */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Link
                      href={`/category/${art.category.slug}`}
                      className="font-mono font-medium text-[#C96442] hover:underline px-2 py-0.5 rounded-md bg-[#C96442]/10 text-[11px]"
                    >
                      {art.category.name}
                    </Link>
                    <span className="text-[#8E8B82] dark:text-[#686660]">•</span>
                    <span className="flex items-center text-[11px] font-mono text-[#8E8B82] dark:text-[#A8A59D]">
                      <Clock className="w-3 h-3 mr-1" />
                      {art.reading_time_minutes}m read
                    </span>
                    <span className="text-[#8E8B82] dark:text-[#686660]">•</span>
                    <span className="text-[11px] font-mono text-[#8E8B82] dark:text-[#A8A59D]">
                      {formatTimeAgo(art.published_at)}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-serif text-base sm:text-lg font-bold leading-snug text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] transition-colors line-clamp-2">
                    <Link href={`/article/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#686660] dark:text-[#A8A59D] line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                {/* Action Row */}
                <div className="pt-2 border-t border-[#EBE8DF]/60 dark:border-[#282724] flex items-center justify-between text-[11px] font-mono text-[#8E8B82]">
                  <span>NewsFlow Intelligence</span>
                  <Link
                    href={`/article/${art.slug}`}
                    className="text-[#C96442] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 font-medium"
                  >
                    <span>Read story</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1C1B19] space-y-2">
            <p className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              No articles found in this period
            </p>
            <p className="text-xs text-[#8E8B82] max-w-sm mx-auto">
              Try resetting the category filter or check back as autonomous pipeline runs stream new dispatches.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pt-6 border-t border-[#EBE8DF] dark:border-[#282724] flex items-center justify-between">
            <div>
              {currentPage > 1 ? (
                <Link
                  href={`/archive?page=${currentPage - 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1C1B19] text-xs font-medium text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Page</span>
                </Link>
              ) : (
                <span className="opacity-0">Prev</span>
              )}
            </div>

            <span className="text-xs font-mono text-[#8E8B82] dark:text-[#A8A59D]">
              Page {currentPage} of {totalPages}
            </span>

            <div>
              {currentPage < totalPages && (
                <Link
                  href={`/archive?page=${currentPage + 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1C1B19] text-xs font-medium text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] transition-colors"
                >
                  <span>Next Page</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* In-feed colophon footer */}
        <EditorialColophon />
      </main>

      {/* 3. Right Sidebar: Future Ad Slots (Fixed) */}
      <div className="hidden xl:block shrink-0">
        <RightAdsSidebar />
      </div>
    </div>
  );
}