"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Eye, 
  Clock, 
  Search, 
  ChevronDown
} from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { useAdPreferences } from "./AdPreferencesContext";

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover_image_url?: string | null;
  published_at: Date | string;
  created_at?: Date | string;
  rank_score?: number;
  views_count?: number;
  reading_time_minutes: number;
  category: {
    name: string;
    slug: string;
  };
}

interface TodaysFeedClientProps {
  articles: ArticleItem[];
  totalPublishedCount?: number;
}

export function TodaysFeedClient({ articles, totalPublishedCount }: TodaysFeedClientProps) {
  const { isAdFree } = useAdPreferences();
  const [selectedBeat, setSelectedBeat] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<"latest" | "top" | "most_read">("latest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleLimit, setVisibleLimit] = useState<number>(24);

  // 1. Calculate beat categories with counts
  const beatCategories = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const a of articles) {
      const slug = a.category?.slug;
      const name = a.category?.name;
      if (slug && name) {
        if (!map.has(slug)) {
          map.set(slug, { slug, name, count: 0 });
        }
        map.get(slug)!.count++;
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [articles]);

  // 2. Filter by beat & search query
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      if (selectedBeat !== "all" && a.category?.slug !== selectedBeat) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesSummary = (a.summary || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary) return false;
      }
      return true;
    });
  }, [articles, selectedBeat, searchQuery]);

  // 3. Sort according to activeFilter
  const sortedArticles = useMemo(() => {
    const list = [...filteredArticles];

    if (activeFilter === "latest") {
      return list.sort((a, b) => {
        const timeA = new Date(a.published_at).getTime();
        const timeB = new Date(b.published_at).getTime();
        if (timeB !== timeA) return timeB - timeA;
        const createdA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const createdB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return createdB - createdA;
      });
    }

    if (activeFilter === "top") {
      return list.sort((a, b) => {
        const scoreA = a.rank_score ?? 75;
        const scoreB = b.rank_score ?? 75;
        if (scoreB !== scoreA) return scoreB - scoreA;
        const timeA = new Date(a.published_at).getTime();
        const timeB = new Date(b.published_at).getTime();
        return timeB - timeA;
      });
    }

    if (activeFilter === "most_read") {
      return list.sort((a, b) => {
        const viewsA = a.views_count ?? 0;
        const viewsB = b.views_count ?? 0;
        if (viewsB !== viewsA) return viewsB - viewsA;
        const scoreA = a.rank_score ?? 75;
        const scoreB = b.rank_score ?? 75;
        if (scoreB !== scoreA) return scoreB - scoreA;
        const timeA = new Date(a.published_at).getTime();
        const timeB = new Date(b.published_at).getTime();
        return timeB - timeA;
      });
    }

    return list;
  }, [filteredArticles, activeFilter]);

  const displayedArticles = sortedArticles.slice(0, visibleLimit);
  const hasMore = visibleLimit < sortedArticles.length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#8E8B82] dark:text-[#A8A59D]">
        <Link href="/" className="hover:text-[#C96442] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-[#A8A59D]" />
        <span className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">
          Today&apos;s News Wire
        </span>
      </nav>

      {/* Hero Live Wire Editorial Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-[#FAF7F0] via-white to-[#F5EFE6] dark:from-[#1D1C1A] dark:via-[#181715] dark:to-[#22201D] border border-[#E6DFD3] dark:border-[#2F2D29] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6DFD3] dark:border-[#2B2926]">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Today&apos;s Live News Wire
            </h1>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold shrink-0">
              {articles.length} Stories Today
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-[#8E8B82] dark:text-[#A8A59D]">
            <Clock className="w-3.5 h-3.5 text-[#C96442]" />
            <span>24-Hour Rolling Edition &bull; Continuous 24/7 Updates</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#686660] dark:text-[#A8A59D] max-w-3xl leading-relaxed">
          Every breakthrough, research announcement, VC deal, and market shift scraped, ranked, and published by our autonomous AI agents today. Older articles remain archived inside their respective topic desks.
        </p>

        {/* Beat Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setSelectedBeat("all");
              setVisibleLimit(24);
            }}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer active:scale-95 ${
              selectedBeat === "all"
                ? "bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] shadow-xs"
                : "bg-white dark:bg-[#201F1D] text-[#686660] dark:text-[#A8A59D] hover:bg-white dark:hover:bg-[#2E2C29] border border-[#E6DFD3] dark:border-[#383530]"
            }`}
          >
            <span>All Today</span>
            <span className="ml-1 text-[10px] opacity-75 font-semibold">({articles.length})</span>
          </button>

          {beatCategories.map((cat) => {
            const isSelected = selectedBeat === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  setSelectedBeat(cat.slug);
                  setVisibleLimit(24);
                }}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer active:scale-95 ${
                  isSelected
                    ? "bg-[#C96442] text-white shadow-xs"
                    : "bg-white dark:bg-[#201F1D] text-[#686660] dark:text-[#A8A59D] hover:bg-white dark:hover:bg-[#2E2C29] border border-[#E6DFD3] dark:border-[#383530]"
                }`}
              >
                <span>{cat.name}</span>
                <span className="ml-1 text-[10px] opacity-75 font-semibold">({cat.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Bar: Search Input & Sort Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-[#FAF7F0] dark:bg-[#1D1C1A] border border-[#E6DFD3] dark:border-[#2F2D29]">
        {/* Search within Today's News */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleLimit(24);
            }}
            placeholder="Search today's headlines & summaries..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#252422] border border-[#E6DFD3] dark:border-[#383530] text-[#1F1E1D] dark:text-[#F5F2EB] placeholder-[#8E8B82] focus:outline-hidden focus:border-[#C96442]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[#8E8B82] hidden md:inline-block mr-1">Sort:</span>
          <button
            type="button"
            onClick={() => setActiveFilter("latest")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === "latest"
                ? "bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D]"
                : "bg-white dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D] border border-[#E6DFD3] dark:border-[#383530]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Latest</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("top")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === "top"
                ? "bg-[#C96442] text-white"
                : "bg-white dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D] border border-[#E6DFD3] dark:border-[#383530]"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Top Rated</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("most_read")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === "most_read"
                ? "bg-amber-600 text-white"
                : "bg-white dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D] border border-[#E6DFD3] dark:border-[#383530]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Most Read</span>
          </button>
        </div>
      </div>

      {/* Grid of All Today's Stories */}
      {displayedArticles.length > 0 ? (
        <div
          className={`grid gap-4 sm:gap-6 w-full ${
            isAdFree
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {displayedArticles.map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article as any}
              priority={idx < 6}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-[#1C1B19] rounded-2xl border border-[#E6DFD3] dark:border-[#2F2D29] space-y-3">
          <p className="text-base text-[#1F1E1D] dark:text-[#F5F2EB] font-serif font-bold">
            No stories match your filter
          </p>
          <p className="text-xs text-[#8E8B82] font-mono">
            Try switching beats or clearing your search query.
          </p>
          <button
            onClick={() => {
              setSelectedBeat("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 text-xs font-mono rounded-xl bg-[#C96442] text-white hover:bg-[#b05335] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination & Load Controls */}
      {hasMore && (
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono border-t border-[#E6DFD3] dark:border-[#2F2D29]">
          <span className="text-[#8E8B82]">
            Showing {displayedArticles.length} of {sortedArticles.length} stories published today
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setVisibleLimit((prev) => prev + 24)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-medium bg-white dark:bg-[#252422] hover:bg-[#FAF7F0] dark:hover:bg-[#2E2C29] text-[#1F1E1D] dark:text-[#F5F2EB] border border-[#E6DFD3] dark:border-[#383530] shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Load More Stories (+24)</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#C96442]" />
            </button>

            <button
              type="button"
              onClick={() => setVisibleLimit(sortedArticles.length)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-medium bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] shadow-xs transition-all cursor-pointer"
            >
              Show All ({sortedArticles.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
