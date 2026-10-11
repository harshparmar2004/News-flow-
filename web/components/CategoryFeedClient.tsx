"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Flame, Eye, Clock } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryDeskBanner } from "@/components/CategoryDeskBanner";
import { useAdPreferences } from "./AdPreferencesContext";

interface ArticleItem {
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

interface CategoryFeedClientProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    articles: ArticleItem[];
  };
}

export function CategoryFeedClient({ category }: CategoryFeedClientProps) {
  const { isAdFree } = useAdPreferences();
  const [activeFilter, setActiveFilter] = useState<"latest" | "top" | "most_read">("latest");

  // Dynamically sort articles based on selected tab: Latest, Top today, Most read
  const sortedArticles = useMemo(() => {
    const list = [...category.articles];

    if (activeFilter === "latest") {
      // 1. LATEST: Strictly newest published at the top, then newest created.
      // Guarantees newly published news from AI agent is on top of all stories!
      return list.sort((a, b) => {
        const timeA = new Date(a.published_at).getTime();
        const timeB = new Date(b.published_at).getTime();
        if (timeB !== timeA) return timeB - timeA;
        const createdA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const createdB = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (createdB !== createdA) return createdB - createdA;
        return (b.id || "").localeCompare(a.id || "");
      });
    }

    if (activeFilter === "top") {
      // 2. TOP TODAY: High-impact stories published today/within 48h ranked by rank_score,
      // falling back to highest rank score across the category
      const now = Date.now();
      const fortyEightHoursAgo = now - 48 * 60 * 60 * 1000;

      return list.sort((a, b) => {
        const timeA = new Date(a.published_at).getTime();
        const timeB = new Date(b.published_at).getTime();
        const aIsRecent = timeA >= fortyEightHoursAgo;
        const bIsRecent = timeB >= fortyEightHoursAgo;

        if (aIsRecent && !bIsRecent) return -1;
        if (!aIsRecent && bIsRecent) return 1;

        // Compare rank_score first (highest impact score on top)
        const scoreA = a.rank_score ?? 75;
        const scoreB = b.rank_score ?? 75;
        if (scoreB !== scoreA) return scoreB - scoreA;

        // Secondary sort: newest publication time
        return timeB - timeA;
      });
    }

    if (activeFilter === "most_read") {
      // 3. MOST READ: Sorted by total views_count, with rank_score & time as secondary tiebreakers
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
  }, [category.articles, activeFilter]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#8E8B82] dark:text-[#A8A59D]">
        <Link href="/" className="hover:text-[#C96442] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-[#A8A59D]" />
        <span>Categories</span>
        <ChevronRight className="w-3 h-3 text-[#A8A59D]" />
        <span className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">
          {category.name}
        </span>
      </nav>

      {/* Enhanced Category Desk Banner with interactive Latest / Top today / Most read controls */}
      <CategoryDeskBanner
        title={category.name}
        description={category.description}
        slug={category.slug}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Sub-bar indicator showing active view filter metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522] w-full text-xs font-mono gap-1 sm:gap-0">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#C96442] shrink-0" />
          <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">
            {activeFilter === "latest" && "Latest Dispatches"}
            {activeFilter === "top" && "Top Stories Today"}
            {activeFilter === "most_read" && "Most Read Stories"}
          </span>
        </div>
        <span className="text-[#8E8B82] dark:text-[#78756E] text-[11px] sm:text-xs">
          {activeFilter === "latest" && `Newest on top • ${sortedArticles.length} stories`}
          {activeFilter === "top" && `Ranked by editorial impact • ${sortedArticles.length} stories`}
          {activeFilter === "most_read" && `Ranked by reader views • ${sortedArticles.length} stories`}
        </span>
      </div>

      {/* Dynamic Articles Grid: 3 columns when ads off, 2 columns next to ads when ads on */}
      <div className="space-y-6 pt-1">
        <div
          className={`grid gap-4 sm:gap-6 transition-all duration-200 w-full ${
            isAdFree
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {sortedArticles.map((article) => (
            <ArticleCard key={article.id} article={article as any} />
          ))}
        </div>

        {sortedArticles.length === 0 && (
          <div className="text-center py-20 p-8 rounded-3xl border border-dashed border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1A1917] max-w-[840px]">
            <p className="text-sm font-mono text-[#8E8B82]">
              No published stories in this desk yet. The autonomous pipeline will dispatch updates soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
