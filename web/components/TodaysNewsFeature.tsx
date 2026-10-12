"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { useAdPreferences } from "./AdPreferencesContext";

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover_image_url?: string | null;
  source_url?: string | null;
  published_at: Date | string;
  created_at?: Date | string;
  reading_time_minutes: number;
  author?: string | null;
  category: {
    name: string;
    slug: string;
  };
}

interface TodaysNewsFeatureProps {
  articles: ArticleItem[];
}

export function TodaysNewsFeature({ articles }: TodaysNewsFeatureProps) {
  const { isAdFree } = useAdPreferences();
  const [selectedBeat, setSelectedBeat] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // 1. Strictly sort articles newest published first
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const timeA = new Date(a.published_at).getTime();
      const timeB = new Date(b.published_at).getTime();
      if (timeB !== timeA) return timeB - timeA;
      const createdA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const createdB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return createdB - createdA;
    });
  }, [articles]);

  // 2. Compute category counts from today's pool
  const beatCategories = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const a of sortedArticles) {
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
  }, [sortedArticles]);

  // 3. Filter by selected beat
  const filteredArticles = useMemo(() => {
    if (selectedBeat === "all") return sortedArticles;
    return sortedArticles.filter((a) => a.category?.slug === selectedBeat);
  }, [sortedArticles, selectedBeat]);

  if (sortedArticles.length === 0) return null;

  // 4. Initial visible items (6 when ad-free = 2 rows of 3; 4 when ads on = 2 rows of 2)
  const initialCount = isAdFree ? 6 : 4;
  const hasMore = filteredArticles.length > initialCount;
  const displayedArticles = isExpanded ? filteredArticles : filteredArticles.slice(0, initialCount);

  return (
    <section
      id="todays-news"
      className="relative rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-[#FAF7F0] via-white to-[#F5EFE6] dark:from-[#1D1C1A] dark:via-[#181715] dark:to-[#22201D] border border-[#E6DFD3] dark:border-[#2F2D29] shadow-xs space-y-4 sm:space-y-5 scroll-mt-20"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E6DFD3] dark:border-[#2B2926] gap-2.5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
          <div className="flex items-center space-x-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Today&apos;s News Feature
            </h2>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>Live Wire</span>
            <span>•</span>
            <span className="font-bold">{sortedArticles.length} Stories Today</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#8E8B82] dark:text-[#8E8B82]">
          <Clock className="w-3.5 h-3.5 text-[#C96442]" />
          <span>Last 24 Hours • Chronological</span>
        </div>
      </div>

      {/* Beat Filter Navigation Bar (shows all beats present in today's stories) */}
      {beatCategories.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setSelectedBeat("all");
            }}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              selectedBeat === "all"
                ? "bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] shadow-xs"
                : "bg-white/80 dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D] hover:bg-white dark:hover:bg-[#2E2C29] border border-[#E6DFD3] dark:border-[#383530]"
            }`}
          >
            <span>All Today</span>
            <span className="ml-1.5 text-[10px] opacity-75 font-semibold">({sortedArticles.length})</span>
          </button>

          {beatCategories.map((cat) => {
            const isSelected = selectedBeat === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  setSelectedBeat(cat.slug);
                }}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#C96442] text-white shadow-xs"
                    : "bg-white/80 dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D] hover:bg-white dark:hover:bg-[#2E2C29] border border-[#E6DFD3] dark:border-[#383530]"
                }`}
              >
                <span>{cat.name}</span>
                <span className="ml-1.5 text-[10px] opacity-75 font-semibold">({cat.count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Grid of Today's Stories */}
      <div
        className={`grid gap-4 sm:gap-6 transition-all duration-200 w-full ${
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

      {/* Expand / Show All Controls */}
      {hasMore && (
        <div className="pt-2 border-t border-[#E6DFD3]/70 dark:border-[#2B2926] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <span className="text-[#8E8B82] dark:text-[#8E8B82]">
            {isExpanded
              ? `Showing all ${filteredArticles.length} stories published today`
              : `Showing ${displayedArticles.length} of ${filteredArticles.length} stories published today`}
          </span>

          {!isExpanded ? (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium bg-white dark:bg-[#252422] hover:bg-[#FAF7F0] dark:hover:bg-[#2E2C29] text-[#1F1E1D] dark:text-[#F5F2EB] border border-[#E6DFD3] dark:border-[#383530] shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>Show all {filteredArticles.length} stories from today</span>
              <span className="text-[#C96442] font-semibold">
                (+{filteredArticles.length - initialCount} more)
              </span>
              <ChevronDown className="w-4 h-4 text-[#C96442]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                document.getElementById("todays-news")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB] bg-white/50 dark:bg-[#252422]/50 hover:bg-white dark:hover:bg-[#2E2C29] border border-[#E6DFD3] dark:border-[#383530] transition-colors cursor-pointer"
            >
              <span>Show fewer stories</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
