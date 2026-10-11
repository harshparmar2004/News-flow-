"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, X, ChevronRight, RotateCcw } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";
import { useAdPreferences } from "@/components/AdPreferencesContext";

interface SearchArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover_image_url?: string | null;
  published_at: string;
  reading_time_minutes: number;
  tags?: string | null;
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

interface Props {
  initialArticles: SearchArticle[];
  categories: Category[];
  totalArticles?: number;
}

export function SearchClient({ initialArticles, categories, totalArticles }: Props) {
  const { isAdFree } = useAdPreferences();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts: '/' to focus search, 'Escape' to clear query
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuery("");
      } else if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();

    return initialArticles.filter((art) => {
      // Category filter
      if (selectedCategory !== "all" && art.category.slug !== selectedCategory) {
        return false;
      }

      // Query filter
      if (!q) return true;

      const titleMatch = art.title.toLowerCase().includes(q);
      const summaryMatch = art.summary.toLowerCase().includes(q);
      const categoryMatch = art.category.name.toLowerCase().includes(q);
      const tagsMatch = art.tags ? art.tags.toLowerCase().includes(q) : false;

      return titleMatch || summaryMatch || categoryMatch || tagsMatch;
    });
  }, [query, selectedCategory, initialArticles]);

  const hasActiveFilters = query.trim() !== "" || selectedCategory !== "all";

  const handleResetFilters = () => {
    setQuery("");
    setSelectedCategory("all");
    inputRef.current?.focus();
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
            Search Archive
          </span>
        </nav>

        {/* Compact, Organized Search Panel Header */}
        <div className="rounded-2xl border border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1C1B19] p-4 sm:p-5 space-y-4 shadow-xs">
          {/* Top Row: Title, Live Count & Reset Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] dark:bg-[#252422] border border-[#EBE8DF] dark:border-[#2E2C28] flex items-center justify-center text-[#C96442] shadow-2xs shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2.5">
                  <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
                    Intelligence Search
                  </h1>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F0] dark:bg-[#252422] text-[#8E8B82] border border-[#EBE8DF] dark:border-[#2E2C28]">
                    {filteredArticles.length} indexed
                  </span>
                </div>
                <p className="text-xs text-[#8E8B82] dark:text-[#78756E] font-mono mt-0.5 truncate">
                  Real-time full-text indexing across titles, summaries, and editorial desks
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="self-start sm:self-center inline-flex items-center space-x-1.5 text-xs font-mono text-[#C96442] hover:text-[#b85535] px-2.5 py-1 rounded-lg bg-[#C96442]/5 hover:bg-[#C96442]/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>

          {/* Sleek, Tactile Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
            <input
              ref={inputRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search keywords, topics, or models (e.g. Claude, reasoning, robotics, M5)..."
              className="w-full pl-10 pr-20 py-2.5 sm:py-3 rounded-xl border border-[#EBE8DF] dark:border-[#2E2C28] bg-[#FAF7F0] dark:bg-[#141413] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] placeholder-[#8E8B82] focus:outline-hidden focus:border-[#C96442] focus:ring-1 focus:ring-[#C96442] transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1.5">
              {query ? (
                <button
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-md text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB] hover:bg-[#EBE8DF] dark:hover:bg-[#252422] transition-colors cursor-pointer"
                  title="Clear search query (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#EBE8DF] dark:border-[#2C2A26] bg-[#EBE8DF]/40 dark:bg-[#22211E] text-[#8E8B82]">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Compact Filter Chips Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 pb-0.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`text-xs px-3 py-1 rounded-lg font-medium shrink-0 transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#C96442] text-white shadow-2xs font-semibold"
                  : "border border-[#EBE8DF] dark:border-[#2A2925] bg-[#FAF7F0] dark:bg-[#201F1D] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]/60 hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
              }`}
            >
              All Categories
              {totalArticles !== undefined && (
                <span className="text-[10px] opacity-75 font-mono ml-1.5">({totalArticles})</span>
              )}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`text-xs px-3 py-1 rounded-lg font-medium shrink-0 transition-all cursor-pointer ${
                  selectedCategory === c.slug
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
              </button>
            ))}
          </div>
        </div>

        {/* Section Bar: Dispatches Result Metadata */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522] w-full">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#C96442]" />
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Search Dispatches
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8E8B82] dark:text-[#78756E]">
            {filteredArticles.length} {filteredArticles.length === 1 ? "story" : "stories"}
            {query && ` for "${query}"`}
          </span>
        </div>

        {/* Dynamic Results Grid (3 in ad-free vs 2 in standard with ads) */}
        <div
          className={`grid gap-6 transition-all duration-200 w-full ${
            isAdFree
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {filteredArticles.map((art) => (
            <ArticleCard
              key={art.id}
              article={{
                ...art,
                published_at: new Date(art.published_at),
              }}
            />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1C1B19] space-y-2">
            <p className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              No matching intelligence found
            </p>
            <p className="text-xs text-[#8E8B82] max-w-sm mx-auto">
              Try adjusting your search terms or select &quot;All Categories&quot; to broaden results.
            </p>
          </div>
        )}
      </main>

      {/* 3. Right Sidebar: Future Ad Slots (Fixed) */}
      <div className="hidden xl:block shrink-0">
        <RightAdsSidebar />
      </div>
    </div>
  );
}