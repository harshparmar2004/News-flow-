"use client";

import React, { useMemo, useState, useEffect } from "react";
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
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

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

  // 4. Restore user's expansion state and active beat from session storage
  useEffect(() => {
    setIsHydrated(true);
    try {
      const savedExpanded = sessionStorage.getItem("todays_news_expanded");
      const savedBeat = sessionStorage.getItem("todays_news_beat");

      if (savedBeat && beatCategories.some((c) => c.slug === savedBeat)) {
        setSelectedBeat(savedBeat);
      }

      if (savedExpanded === "true") {
        setIsExpanded(true);
      }
    } catch (e) {}
  }, [beatCategories]);

  // 5. Restore scroll position / center on last clicked article upon returning from article view
  useEffect(() => {
    if (!isHydrated) return;

    try {
      const lastSlug = sessionStorage.getItem("todays_news_last_clicked_slug");
      const savedScroll = sessionStorage.getItem("todays_news_scroll");

      if (lastSlug || savedScroll) {
        const timer = setTimeout(() => {
          if (lastSlug) {
            const el = document.getElementById(`article-card-${lastSlug}`);
            if (el) {
              el.scrollIntoView({ behavior: "instant", block: "center" });
              sessionStorage.removeItem("todays_news_last_clicked_slug");
              sessionStorage.removeItem("todays_news_scroll");
              return;
            }
          }
          if (savedScroll) {
            const y = parseInt(savedScroll, 10);
            if (!isNaN(y) && y > 0) {
              window.scrollTo({ top: y, behavior: "instant" });
              sessionStorage.removeItem("todays_news_scroll");
            }
          }
        }, 120);

        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, [isHydrated, isExpanded, filteredArticles.length]);

  const handleSelectBeat = (slug: string) => {
    setSelectedBeat(slug);
    try {
      sessionStorage.setItem("todays_news_beat", slug);
    } catch (e) {}
  };

  const handleExpand = () => {
    setIsExpanded(true);
    try {
      sessionStorage.setItem("todays_news_expanded", "true");
    } catch (e) {}
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    try {
      sessionStorage.setItem("todays_news_expanded", "false");
      sessionStorage.removeItem("todays_news_last_clicked_slug");
      sessionStorage.removeItem("todays_news_scroll");
    } catch (e) {}
    document.getElementById("todays-news")?.scrollIntoView({ behavior: "smooth" });
  };

  if (sortedArticles.length === 0) return null;

  // Initial visible items (6 when ad-free = 2 rows of 3; 4 when ads on = 2 rows of 2)
  const initialCount = isAdFree ? 6 : 4;
  const hasMore = filteredArticles.length > initialCount;
  const displayedArticles = isExpanded ? filteredArticles : filteredArticles.slice(0, initialCount);

  return (
    <section
      id="todays-news"
      className="relative rounded-2xl sm:rounded-3xl p-0 sm:p-6 bg-transparent sm:bg-gradient-to-br sm:from-[#FAF7F0] sm:via-white sm:to-[#F5EFE6] sm:dark:from-[#1D1C1A] sm:dark:via-[#181715] sm:dark:to-[#22201D] border-0 sm:border border-[#E6DFD3] dark:border-[#2F2D29] sm:shadow-xs space-y-3 sm:space-y-5 scroll-mt-20"
    >
      {/* Header Bar - Crisp single row on mobile and desktop */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#E6DFD3] dark:border-[#2B2926]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
          <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
            Today&apos;s News
          </h2>
          <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold shrink-0">
            {sortedArticles.length} Live
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs font-mono text-[#8E8B82] dark:text-[#8E8B82] shrink-0">
          <Clock className="w-3.5 h-3.5 text-[#C96442]" />
          <span>Last 24h</span>
        </div>
      </div>

      {/* Beat Filter Navigation Bar (shows all beats present in today's stories) */}
      {beatCategories.length > 1 && (
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => handleSelectBeat("all")}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-medium transition-all shrink-0 cursor-pointer active:scale-95 ${
              selectedBeat === "all"
                ? "bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] shadow-xs"
                : "bg-white dark:bg-[#201F1D] text-[#686660] dark:text-[#A8A59D] hover:bg-white dark:hover:bg-[#2E2C29] border border-[#E6DFD3] dark:border-[#383530]"
            }`}
          >
            <span>All Today</span>
            <span className="ml-1 text-[10px] opacity-75 font-semibold">({sortedArticles.length})</span>
          </button>

          {beatCategories.map((cat) => {
            const isSelected = selectedBeat === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleSelectBeat(cat.slug)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-medium transition-all shrink-0 cursor-pointer active:scale-95 ${
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
          <span className="text-[#8E8B82] dark:text-[#8E8B82] text-center sm:text-left">
            {isExpanded
              ? `Showing all ${filteredArticles.length} stories published today`
              : `Showing ${displayedArticles.length} of ${filteredArticles.length} stories published today`}
          </span>

          {!isExpanded ? (
            <button
              type="button"
              onClick={handleExpand}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-medium bg-white dark:bg-[#252422] hover:bg-[#FAF7F0] dark:hover:bg-[#2E2C29] text-[#1F1E1D] dark:text-[#F5F2EB] border border-[#E6DFD3] dark:border-[#383530] shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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
              onClick={handleCollapse}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB] bg-white/50 dark:bg-[#252422]/50 hover:bg-white dark:hover:bg-[#2E2C29] border border-[#E6DFD3] dark:border-[#383530] transition-colors cursor-pointer"
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
