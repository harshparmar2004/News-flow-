"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryDeskBanner } from "@/components/CategoryDeskBanner";
import { TodaysNewsFeature } from "@/components/TodaysNewsFeature";
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
  rank_score?: number;
  views_count?: number;
  reading_time_minutes: number;
  author?: string | null;
  category: {
    name: string;
    slug: string;
  };
}

interface CategorySection {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  articles: ArticleItem[];
}

interface HomeFeedClientProps {
  todaysArticles?: ArticleItem[];
  recentArticles: ArticleItem[];
  categorySections: CategorySection[];
}

/**
 * Universal news sort engine for Latest, Top today, and Most read
 */
function sortArticlesList(list: ArticleItem[], filter: "latest" | "top" | "most_read"): ArticleItem[] {
  const items = [...list];

  if (filter === "latest") {
    // 1. LATEST: Strictly newest published at the top, then newest created
    return items.sort((a, b) => {
      const timeA = new Date(a.published_at).getTime();
      const timeB = new Date(b.published_at).getTime();
      if (timeB !== timeA) return timeB - timeA;
      const createdA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const createdB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (createdB !== createdA) return createdB - createdA;
      return (b.id || "").localeCompare(a.id || "");
    });
  }

  if (filter === "top") {
    // 2. TOP TODAY: High-impact stories published today/within 48h ranked by rank_score,
    // falling back to highest rank score across the desk
    const now = Date.now();
    const fortyEightHoursAgo = now - 48 * 60 * 60 * 1000;

    return items.sort((a, b) => {
      const timeA = new Date(a.published_at).getTime();
      const timeB = new Date(b.published_at).getTime();
      const aIsRecent = timeA >= fortyEightHoursAgo;
      const bIsRecent = timeB >= fortyEightHoursAgo;

      if (aIsRecent && !bIsRecent) return -1;
      if (!aIsRecent && bIsRecent) return 1;

      const scoreA = a.rank_score ?? 75;
      const scoreB = b.rank_score ?? 75;
      if (scoreB !== scoreA) return scoreB - scoreA;

      return timeB - timeA;
    });
  }

  if (filter === "most_read") {
    // 3. MOST READ: Sorted by total reader views (views_count)
    return items.sort((a, b) => {
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

  return items;
}

export function HomeFeedClient({ todaysArticles, recentArticles, categorySections }: HomeFeedClientProps) {
  const { isAdFree } = useAdPreferences();
  const [activeFilter, setActiveFilter] = useState<"latest" | "top" | "most_read">("latest");

  // Dynamically sort Recent Dispatches
  const sortedRecent = useMemo(() => {
    return sortArticlesList(recentArticles, activeFilter);
  }, [recentArticles, activeFilter]);

  // In Ad-Free mode (ads off), display 3 news slide boxes per row (6 recent = 2 rows of 3)
  // When ads are on, display 2 news boxes per row alongside the right ads sidebar
  const displayedRecent = isAdFree ? sortedRecent.slice(0, 6) : sortedRecent.slice(0, 4);

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Breadcrumb (Desktop only) */}
      <nav className="hidden sm:flex items-center space-x-2 text-xs text-[#8E8B82] dark:text-[#A8A59D]">
        <Link href="/" className="hover:text-[#C96442] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-[#A8A59D]" />
        <span className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">
          Recent Intelligence
        </span>
      </nav>

      {/* Enhanced Desk Header Banner (Desktop editorial card) */}
      <CategoryDeskBanner
        title="All Intelligence"
        description="Autonomous AI-synthesized news desk aggregating breakthrough stories from 50+ global sources 24/7."
        slug="tech"
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        showFilters={false}
      />

      {/* Dedicated Today's News Feature spotlight */}
      <TodaysNewsFeature articles={(todaysArticles && todaysArticles.length > 0 ? todaysArticles : recentArticles) as any} />

      {/* Section: Recent Intelligence */}
      <section className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
        {/* Section Bar - Clean, properly sized, spans width */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522] w-full text-xs font-mono gap-2 sm:gap-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#C96442] shrink-0" />
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Recent Dispatches
            </h2>
          </div>

          {/* Segmented Filter Control: Latest | Top today | Most read */}
          <div className="inline-flex items-center p-0.5 sm:p-1 rounded-xl bg-white dark:bg-[#1E1D1B] border border-[#EBE8DF] dark:border-[#2C2A26] shadow-2xs self-start sm:self-auto text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveFilter("latest")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                activeFilter === "latest"
                  ? "bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] shadow-xs font-semibold"
                  : "text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
              }`}
            >
              Latest
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("top")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                activeFilter === "top"
                  ? "bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] shadow-xs font-semibold"
                  : "text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
              }`}
            >
              Top today
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("most_read")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                activeFilter === "most_read"
                  ? "bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] shadow-xs font-semibold"
                  : "text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
              }`}
            >
              Most read
            </button>
          </div>
        </div>

        {/* Dynamic Grid: 3 news slide boxes when ads off; 2 news boxes next to ads when ads on */}
        <div
          className={`grid gap-4 sm:gap-6 transition-all duration-200 w-full ${
            isAdFree
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {displayedRecent.map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article as any}
              priority={idx < 6}
            />
          ))}
        </div>

        {recentArticles.length === 0 && (
          <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1A1917] w-full">
            <p className="text-sm font-mono text-[#8E8B82]">
              No stories indexed yet. Pipeline cycles will stream articles automatically.
            </p>
          </div>
        )}
      </section>

      {/* Dedicated News Type Sections (AI, Robotics, Startups & VC, etc.) */}
      <div className="space-y-8 sm:space-y-9 pt-2">
        {categorySections.map(({ category, articles }) => {
          if (articles.length === 0) return null;

          // Dynamically sort each category desk by the active filter tab
          const sortedCategoryArticles = sortArticlesList(articles, activeFilter);

          // When Ad-Free is enabled (ads off), show 3 news slide boxes across screen; else show 2 next to ads
          const displayedCategoryArticles = isAdFree
            ? sortedCategoryArticles.slice(0, 3)
            : sortedCategoryArticles.slice(0, 2);

          return (
            <section key={category.id} className="space-y-4">
              {/* Section Bar - Clean, properly proportioned */}
              <div className="flex items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522] w-full">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#C96442] shrink-0" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
                    {category.name}
                  </h3>
                </div>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-xs font-mono font-medium text-[#C96442] hover:underline flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C96442]/5 hover:bg-[#C96442]/10 transition-colors"
                >
                  <span>View desk</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Dynamic Grid: 3 news slide boxes when ads off; 2 news boxes next to ads when ads on */}
              <div
                className={`grid gap-4 sm:gap-6 transition-all duration-200 w-full ${
                  isAdFree
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {displayedCategoryArticles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
