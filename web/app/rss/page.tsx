import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatArticleDate } from "@/lib/utils";
import { Rss, Copy, ExternalLink, ChevronRight, Check, Radio } from "lucide-react";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";

export const metadata: Metadata = {
  title: "RSS 2.0 Syndication Feed | NewsFlow",
  description: "Subscribe to real-time machine-readable RSS 2.0 feeds generated continuously by the NewsFlow agentic pipeline.",
};

export const revalidate = 60;

export default async function RssFeedPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [articles, categories, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where: { status: "published" },
      orderBy: { published_at: "desc" },
      take: 6,
      include: {
        category: {
          select: { name: true, slug: true },
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
            RSS 2.0 Feed
          </span>
        </nav>

        {/* Header Banner */}
        <div className="p-8 sm:p-10 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 text-[#C96442]">
            <Rss className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Live Syndication Endpoints
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
            RSS 2.0 Syndication Feed
          </h1>
          <p className="text-sm text-[#686660] dark:text-[#A8A59D] max-w-2xl leading-relaxed">
            Subscribe to our real-time machine-readable feed. Every breakthrough synthesized by the NewsFlow agentic pipeline is broadcast immediately in valid RSS 2.0 XML with full enclosures.
          </p>
        </div>

        {/* Live Endpoints Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                Canonical RSS Feed
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Live XML
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] font-mono text-xs text-[#C96442] select-all break-all">
              {siteUrl}/rss.xml
            </div>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="/rss.xml"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#C96442] text-white text-xs font-medium hover:bg-[#b05334] transition-colors"
              >
                <span>Open Raw XML</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                Alternate Feed Route
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#EBE8DF] dark:bg-[#282724] text-[#8E8B82]">
                XML Enclosures
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] font-mono text-xs text-[#C96442] select-all break-all">
              {siteUrl}/feed.xml
            </div>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="/feed.xml"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] text-[#1F1E1D] dark:text-[#F5F2EB] text-xs font-medium hover:border-[#C96442] transition-colors"
              >
                <span>Open Alternate XML</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Live Feed Preview Section */}
        <section className="space-y-4 pt-4">
          <div className="flex items-baseline justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522]">
            <h2 className="font-serif text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Recent Feed Broadcasts ({articles.length})
            </h2>
            <span className="text-xs font-mono text-[#8E8B82]">
              Auto-refreshes every 60s
            </span>
          </div>

          <div className="space-y-3">
            {articles.map((art) => (
              <div
                key={art.id}
                className="p-5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-[#C96442] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-[#8E8B82]">
                    <span className="text-[#C96442] font-semibold">{art.category.name}</span>
                    <span>•</span>
                    <span>{formatArticleDate(art.published_at)}</span>
                  </div>
                  <Link
                    href={`/article/${art.slug}`}
                    className="font-serif text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB] hover:text-[#C96442] transition-colors"
                  >
                    {art.title}
                  </Link>
                  <p className="text-xs text-[#686660] dark:text-[#A8A59D] line-clamp-1">
                    {art.summary}
                  </p>
                </div>

                <Link
                  href={`/article/${art.slug}`}
                  className="shrink-0 px-3.5 py-1.5 rounded-lg border border-[#EBE8DF] dark:border-[#33322E] text-xs font-medium text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] hover:text-[#C96442] transition-colors"
                >
                  Read Story ↗
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 3. Right Sidebar */}
      <div className="hidden 2xl:block shrink-0">
        <RightAdsSidebar />
      </div>
    </div>
  );
}
