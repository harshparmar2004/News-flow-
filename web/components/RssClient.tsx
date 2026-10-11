"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Rss, Copy, ExternalLink, ChevronRight, Check, ArrowRight, Radio } from "lucide-react";
import { formatArticleDate } from "@/lib/utils";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";

interface RssArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover_image_url?: string | null;
  published_at: string;
  reading_time_minutes: number;
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
}

interface RssClientProps {
  articles: RssArticle[];
  categories: Category[];
  totalArticles: number;
  initialSiteUrl: string;
}

export function RssClient({ articles, categories, totalArticles, initialSiteUrl }: RssClientProps) {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [resolvedOrigin, setResolvedOrigin] = useState(initialSiteUrl);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setResolvedOrigin(window.location.origin);
    }
  }, []);

  const handleCopy = async (path: string) => {
    const fullUrl = `${resolvedOrigin}${path}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full flex min-h-screen bg-[#FAF7F0] dark:bg-[#121211]">
      {/* 1. Left Sidebar: Sticky alongside feed on Desktop */}
      <div className="hidden lg:block shrink-0">
        <LeftSidebar
          categories={categories}
          totalArticles={totalArticles}
        />
      </div>

      {/* 2. Middle Main Content: Natural document flow */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-12 space-y-6">
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

        {/* Compact, Organized Executive Header */}
        <header className="rounded-2xl border border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1C1B19] p-4 sm:p-5 space-y-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] dark:bg-[#252422] border border-[#EBE8DF] dark:border-[#2E2C28] flex items-center justify-center text-[#C96442] shadow-2xs shrink-0">
                <Rss className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2.5">
                  <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
                    RSS 2.0 Syndication Feed
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="text-xs text-[#8E8B82] dark:text-[#78756E] font-mono mt-0.5 truncate">
                  Machine-readable syndicate broadcast with XML media enclosures
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#FAF7F0] dark:bg-[#252422] text-[#8E8B82] border border-[#EBE8DF] dark:border-[#2C2A26]">
                Valid RSS 2.0 Spec
              </span>
            </div>
          </div>

          {/* Reader Compatibility Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#EBE8DF]/60 dark:border-[#282724] text-[11px] font-mono text-[#8E8B82]">
            <span className="text-[#686660] dark:text-[#78756E]">Instant sync:</span>
            {["Feedly", "NetNewsWire", "Reeder", "Inoreader", "Slack / Discord", "Zapier"].map((reader) => (
              <span
                key={reader}
                className="px-2 py-0.5 rounded-md bg-[#FAF7F0] dark:bg-[#201F1D] border border-[#EBE8DF] dark:border-[#2A2925] text-[#686660] dark:text-[#A8A59D]"
              >
                {reader}
              </span>
            ))}
          </div>
        </header>

        {/* Minimalist, Structured Endpoints Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Canonical Feed */}
          <div className="rounded-2xl border border-[#EBE8DF] dark:border-[#2A2925] bg-white dark:bg-[#1C1B19] p-4 sm:p-5 space-y-3.5 shadow-xs hover:border-[#C96442]/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#C96442]" />
                <h3 className="font-serif text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                  Canonical RSS Feed
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                Primary Route
              </span>
            </div>

            <p className="text-xs text-[#686660] dark:text-[#A8A59D] leading-relaxed">
              Standard XML feed with story summaries, author metadata, and category taxonomies.
            </p>

            {/* URL Display with One-Click Actions */}
            <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-[#FAF7F0] dark:bg-[#141413] border border-[#EBE8DF] dark:border-[#2A2925]">
              <span className="font-mono text-xs text-[#C96442] truncate select-all px-1">
                {resolvedOrigin}/rss.xml
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy("/rss.xml")}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    copiedPath === "/rss.xml"
                      ? "bg-emerald-500 text-white"
                      : "bg-white dark:bg-[#201F1D] border border-[#EBE8DF] dark:border-[#2E2C28] text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] hover:text-[#C96442]"
                  }`}
                  title="Copy full RSS feed URL"
                >
                  {copiedPath === "/rss.xml" ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href="/rss.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded-lg bg-white dark:bg-[#201F1D] border border-[#EBE8DF] dark:border-[#2E2C28] text-[#8E8B82] hover:text-[#C96442] hover:border-[#C96442] transition-colors"
                  title="Open raw XML feed in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Alternate Route */}
          <div className="rounded-2xl border border-[#EBE8DF] dark:border-[#2A2925] bg-white dark:bg-[#1C1B19] p-4 sm:p-5 space-y-3.5 shadow-xs hover:border-[#C96442]/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#8E8B82]" />
                <h3 className="font-serif text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                  Alternate Feed Route
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F0] dark:bg-[#252422] text-[#8E8B82] border border-[#EBE8DF] dark:border-[#2C2A26]">
                Enclosures
              </span>
            </div>

            <p className="text-xs text-[#686660] dark:text-[#A8A59D] leading-relaxed">
              Alternate XML routing with media attachments compatible with legacy feed readers.
            </p>

            {/* URL Display with One-Click Actions */}
            <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-[#FAF7F0] dark:bg-[#141413] border border-[#EBE8DF] dark:border-[#2A2925]">
              <span className="font-mono text-xs text-[#C96442] truncate select-all px-1">
                {resolvedOrigin}/feed.xml
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy("/feed.xml")}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    copiedPath === "/feed.xml"
                      ? "bg-emerald-500 text-white"
                      : "bg-white dark:bg-[#201F1D] border border-[#EBE8DF] dark:border-[#2E2C28] text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] hover:text-[#C96442]"
                  }`}
                  title="Copy alternate feed URL"
                >
                  {copiedPath === "/feed.xml" ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded-lg bg-white dark:bg-[#201F1D] border border-[#EBE8DF] dark:border-[#2E2C28] text-[#8E8B82] hover:text-[#C96442] hover:border-[#C96442] transition-colors"
                  title="Open alternate XML feed in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522] w-full pt-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#C96442]" />
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Recent Feed Broadcasts
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8E8B82] dark:text-[#78756E]">
            Auto-refreshes every 60s • {articles.length} dispatches
          </span>
        </div>

        {/* Minimalist, Clean Broadcast Stream */}
        <div className="space-y-3">
          {articles.map((art) => (
            <article
              key={art.id}
              className="group rounded-2xl border border-[#EBE8DF] dark:border-[#2A2925] bg-white dark:bg-[#1C1B19] p-4 sm:p-4.5 hover:border-[#C96442]/60 hover:shadow-md hover:shadow-black/5 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Left Content & Meta */}
              <div className="flex items-start sm:items-center space-x-3.5 min-w-0 flex-1">
                {/* Compact Thumbnail */}
                <Link
                  href={`/article/${art.slug}`}
                  className="w-20 sm:w-24 aspect-16/10 rounded-lg overflow-hidden shrink-0 bg-[#FAF7F0] dark:bg-[#252422] relative block"
                >
                  {art.cover_image_url ? (
                    <img
                      src={art.cover_image_url}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#8E8B82] bg-linear-to-br from-[#242320] to-[#171615]">
                      XML
                    </div>
                  )}
                </Link>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <Link
                      href={`/category/${art.category.slug}`}
                      className="font-mono font-medium text-[#C96442] hover:underline px-2 py-0.5 rounded-md bg-[#C96442]/10 text-[11px]"
                    >
                      {art.category.name}
                    </Link>
                    <span className="text-[#8E8B82] dark:text-[#686660]">•</span>
                    <span className="text-[11px] font-mono text-[#8E8B82] dark:text-[#A8A59D]">
                      {formatArticleDate(art.published_at)}
                    </span>
                    <span className="text-[#8E8B82] dark:text-[#686660]">•</span>
                    <span className="text-[11px] font-mono text-[#8E8B82]">
                      {art.reading_time_minutes}m
                    </span>
                  </div>

                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] transition-colors line-clamp-1">
                    <Link href={`/article/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-[#686660] dark:text-[#A8A59D] line-clamp-1">
                    {art.summary}
                  </p>
                </div>
              </div>

              {/* Right Action */}
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <span className="text-[10px] font-mono text-[#8E8B82] hidden md:inline-block px-2 py-0.5 rounded-md bg-[#FAF7F0] dark:bg-[#201F1D] border border-[#EBE8DF] dark:border-[#282724]">
                  item #{art.id.slice(0, 6)}
                </span>
                <Link
                  href={`/article/${art.slug}`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F0] dark:bg-[#22211E] border border-[#EBE8DF] dark:border-[#2C2A26] text-xs font-mono font-medium text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] hover:text-[#C96442] transition-colors"
                >
                  <span>Read story</span>
                  <ArrowRight className="w-3 h-3 text-[#C96442]" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* 3. Right Sidebar: Future Ad Slots (Fixed) */}
      <div className="hidden xl:block shrink-0">
        <RightAdsSidebar />
      </div>
    </div>
  );
}
