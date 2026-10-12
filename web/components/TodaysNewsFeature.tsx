"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
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

  // Filter and sort strictly by publication time (newest published today at the top)
  const todaysArticles = useMemo(() => {
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    // Filter articles from the last 24 hours
    const recentToday = articles.filter((a) => {
      const pubTime = new Date(a.published_at).getTime();
      return pubTime >= twentyFourHoursAgo;
    });

    // If we have at least 3 articles from the last 24h, use them;
    // otherwise fallback to the most recent published articles so the section is always populated
    const pool = recentToday.length >= 3 ? recentToday : articles;

    // Strictly sort newest published first
    return [...pool].sort((a, b) => {
      const timeA = new Date(a.published_at).getTime();
      const timeB = new Date(b.published_at).getTime();
      return timeB - timeA;
    });
  }, [articles]);

  if (todaysArticles.length === 0) return null;

  // Show top 3 (when ads off) or top 2 (when ads on)
  const displayedToday = isAdFree ? todaysArticles.slice(0, 3) : todaysArticles.slice(0, 2);

  return (
    <section id="todays-news" className="relative rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-[#FAF7F0] via-white to-[#F5EFE6] dark:from-[#1D1C1A] dark:via-[#181715] dark:to-[#22201D] border border-[#E6DFD3] dark:border-[#2F2D29] shadow-xs space-y-4 sm:space-y-5 scroll-mt-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E6DFD3] dark:border-[#2B2926] gap-2">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
          <div className="flex items-center space-x-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Today&apos;s News Feature
            </h2>
            <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold">
              Live Wire
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#8E8B82] dark:text-[#8E8B82]">
          <Clock className="w-3.5 h-3.5 text-[#C96442]" />
          <span>Chronological • Updated in Real-Time</span>
        </div>
      </div>

      {/* Grid of Today's Top Stories */}
      <div
        className={`grid gap-4 sm:gap-6 transition-all duration-200 w-full ${
          isAdFree
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {displayedToday.map((article, idx) => (
          <ArticleCard
            key={article.id}
            article={article as any}
            priority={idx < 3}
          />
        ))}
      </div>
    </section>
  );
}
