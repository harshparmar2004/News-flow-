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
  X,
  CheckCircle2
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
        const timeA = Math.max(
          new Date(a.published_at).getTime(),
          a.created_at ? new Date(a.created_at).getTime() : 0
        );
        const timeB = Math.max(
          new Date(b.published_at).getTime(),
          b.created_at ? new Date(b.created_at).getTime() : 0
        );
        if (timeB !== timeA) return timeB - timeA;
        return (b.id || "").localeCompare(a.id || "");
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

  const displayedArticles = sortedArticles;

  return (
    <div className="space-y-4 sm:space-y-5">
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

      {/* Hero Live Wire Editorial Banner (Compact & Sleek) */}
      <div className="relative rounded-xl sm:rounded-2xl p-3 sm:px-5 sm:py-3.5 bg-gradient-to-br from-[#FAF7F0] via-white to-[#F5EFE6] dark:from-[#1D1C1A] dark:via-[#181715] dark:to-[#22201D] border border-[#E6DFD3] dark:border-[#2F2D29] shadow-2xs space-y-2 sm:space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 pb-2 border-b border-[#E6DFD3] dark:border-[#2B2926]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Today&apos;s News Wire
            </h1>
            <span className="text-[11px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold shrink-0 border border-rose-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>{articles.length} Live Today</span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#8E8B82] dark:text-[#A8A59D]">
            <Clock className="w-3 h-3 text-[#C96442]" />
            <span>24h Rolling Edition &bull; Live Updates</span>
          </div>
        </div>

        <p className="text-xs text-[#686660] dark:text-[#A8A59D] max-w-3xl leading-relaxed">
          Autonomous intelligence coverage of today&apos;s breakthroughs, model releases, and market shifts.
        </p>

        {/* Beat Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setSelectedBeat("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer active:scale-95 text-[11px] ${
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
                onClick={() => setSelectedBeat(cat.slug)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer active:scale-95 text-[11px] ${
                  isSelected
                    ? "bg-[#C96442] text-white shadow-xs font-semibold"
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

      {/* Control Bar: Compact, Tactile Search Input & Sort Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-[#1A1918]/70 border border-[#E6DFD3] dark:border-[#2F2D29] shadow-2xs">
        {/* Search within Today's News */}
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search today's stories..."
            className="w-full h-9 pl-8.5 pr-8 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-white dark:bg-[#252422] border border-[#E6DFD3] dark:border-[#383530] text-[#1F1E1D] dark:text-[#F5F2EB] placeholder-[#8E8B82] focus:outline-hidden focus:border-[#C96442] focus:ring-1 focus:ring-[#C96442]/30 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB] hover:bg-[#EBE8DF]/50 dark:hover:bg-[#33312D] transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] text-[#8E8B82] hidden md:inline-block mr-1">Sort:</span>
          <button
            type="button"
            onClick={() => setActiveFilter("latest")}
            className={`h-8 px-2.5 sm:px-3 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer shrink-0 text-[11px] sm:text-xs ${
              activeFilter === "latest"
                ? "bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] shadow-2xs"
                : "bg-white dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D] border border-[#E6DFD3] dark:border-[#383530] hover:border-[#C96442]/50"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Latest</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("top")}
            className={`h-8 px-2.5 sm:px-3 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer shrink-0 text-[11px] sm:text-xs ${
              activeFilter === "top"
                ? "bg-[#C96442] text-white shadow-2xs font-semibold"
                : "bg-white dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D] border border-[#E6DFD3] dark:border-[#383530] hover:border-[#C96442]/50"
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Top Rated</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("most_read")}
            className={`h-8 px-2.5 sm:px-3 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer shrink-0 text-[11px] sm:text-xs ${
              activeFilter === "most_read"
                ? "bg-amber-600 text-white shadow-2xs font-semibold"
                : "bg-white dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D] border border-[#E6DFD3] dark:border-[#383530] hover:border-[#C96442]/50"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Most Read</span>
          </button>
        </div>
      </div>

      {/* Live Stories Status Bar (Prominent Live Counter for Mobile & Desktop) */}
      <div className="flex items-center justify-between px-1.5 py-1 text-xs font-mono text-[#8E8B82] dark:text-[#A8A59D]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
            {displayedArticles.length} Live {displayedArticles.length === 1 ? "Story" : "Stories"}
          </span>
          <span>&bull;</span>
          <span className="text-[#686660] dark:text-[#A8A59D]">Past 24 Hours</span>
        </div>
        {searchQuery ? (
          <span className="text-[11px] text-[#C96442] font-medium">
            {displayedArticles.length} matching search
          </span>
        ) : selectedBeat !== "all" ? (
          <span className="text-[11px] text-[#C96442] font-medium">
            {displayedArticles.length} in this beat
          </span>
        ) : (
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            All Live Stories
          </span>
        )}
      </div>

      {/* Grid of All Today's Stories */}
      {displayedArticles.length > 0 ? (
        <div
          className={`grid gap-3.5 sm:gap-6 w-full ${
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

      {/* End of 24-Hour Live Feed Indicator */}
      {displayedArticles.length > 0 && (
        <div className="pt-8 pb-4 border-t border-[#E6DFD3] dark:border-[#2F2D29] flex flex-col items-center text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBE8DF]/50 dark:bg-[#252422] text-xs font-mono text-[#686660] dark:text-[#A8A59D]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>You&apos;re caught up &bull; All {displayedArticles.length} live stories from the last 24h displayed</span>
          </div>
          <p className="text-[11px] font-mono text-[#8E8B82] dark:text-[#78756E]">
            Continuous autonomous journalism &bull; Updated 24/7 as news breaks
          </p>
        </div>
      )}
    </div>
  );
}
