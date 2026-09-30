"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, Layers, ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";

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
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
            Search Archive
          </span>
        </nav>
      {/* Search Bar Header */}
      <div className="p-8 sm:p-10 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-6 shadow-xs">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
            Intelligence Search
          </h1>
          <p className="text-xs text-[#686660] dark:text-[#A8A59D] mt-1 font-mono">
            Full-text search across titles, summaries, tags, and category archives
          </p>
        </div>

        {/* Input Field */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, e.g. Claude, reasoning, OpenSSL, M5..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-base text-[#1F1E1D] dark:text-[#F5F2EB] placeholder-[#8E8B82] focus:outline-none focus:border-[#C96442]"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#8E8B82] hover:text-[#1F1E1D]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
              selectedCategory === "all"
                ? "bg-[#C96442] border-[#C96442] text-white"
                : "border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]"
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                selectedCategory === c.slug
                  ? "bg-[#C96442] border-[#C96442] text-white"
                  : "border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 text-xs text-[#8E8B82] font-mono">
        <span>
          Found {filteredArticles.length}{" "}
          {filteredArticles.length === 1 ? "article" : "articles"}
          {query && ` for "${query}"`}
        </span>
      </div>

      {/* Results Grid (3 in a row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
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
        <div className="text-center py-20 p-8 rounded-3xl border border-dashed border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-2">
          <p className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
            No matching intelligence found
          </p>
          <p className="text-xs text-[#8E8B82] max-w-sm mx-auto">
            Try adjusting your search terms or selecting &quot;All Categories&quot; to broaden results.
          </p>
        </div>
      )}
      </main>

      {/* 3. Right Sidebar */}
      <div className="hidden 2xl:block shrink-0">
        <RightAdsSidebar />
      </div>
    </div>
  );
}