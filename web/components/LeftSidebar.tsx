"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rss, Search, Clock, Radio } from "lucide-react";
import { useAdPreferences } from "./AdPreferencesContext";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
}

interface LeftSidebarProps {
  categories: CategoryWithCount[];
  activeSlug?: string;
  totalArticles?: number;
}

export function LeftSidebar({ categories, activeSlug, totalArticles }: LeftSidebarProps) {
  const pathname = usePathname();
  const { isAdFree, toggleAdFree } = useAdPreferences();

  return (
    <aside className="w-64 shrink-0 h-[calc(100vh-4rem)] border-r border-[#EBE8DF] dark:border-[#282724] bg-[#FBF9F5] dark:bg-[#141413] p-5 flex flex-col justify-between overflow-y-auto no-scrollbar select-none">
      {/* Top Navigation Block */}
      <div className="space-y-6">
        {/* Brand / Title Indicator */}
        <div className="flex items-center space-x-2 pt-1 pb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C96442]" />
          <span className="font-serif text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
            NewsFlow
          </span>
        </div>

        {/* Section: NEWS DESKS */}
        <div className="space-y-1.5">
          <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#686660] px-2 mb-2">
            News Desks
          </h3>

          {/* All Intelligence */}
          <Link
            href="/"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              pathname === "/" && !activeSlug
                ? "bg-[#EBE8DF] dark:bg-[#2A2925] text-[#C96442] font-semibold shadow-xs"
                : "text-[#686660] dark:text-[#A8A59D] hover:bg-[#FAF7F0] dark:hover:bg-[#20201D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <span>All intelligence</span>
            {totalArticles !== undefined && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E4E0D5] dark:bg-[#20201D] text-[#8E8B82] dark:text-[#78756E]">
                {totalArticles}
              </span>
            )}
          </Link>

          {/* Category List */}
          {categories.map((cat) => {
            const isActive = activeSlug === cat.slug || pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#EBE8DF] dark:bg-[#2A2925] text-[#C96442] font-semibold shadow-xs"
                    : "text-[#686660] dark:text-[#A8A59D] hover:bg-[#FAF7F0] dark:hover:bg-[#20201D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {cat._count?.articles !== undefined && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E4E0D5] dark:bg-[#20201D] text-[#8E8B82] dark:text-[#78756E]">
                    {cat._count.articles}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Section: EXPLORE */}
        <div className="space-y-1.5 pt-2 border-t border-[#EBE8DF]/60 dark:border-[#282724]">
          <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#686660] px-2 mb-2">
            Explore
          </h3>
          <Link
            href="/search"
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              pathname === "/search"
                ? "bg-[#EBE8DF] dark:bg-[#2A2925] text-[#C96442] font-semibold shadow-xs"
                : "text-[#686660] dark:text-[#A8A59D] hover:bg-[#FAF7F0] dark:hover:bg-[#20201D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <span>Search archive</span>
          </Link>
          <Link
            href="/archive"
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              pathname === "/archive"
                ? "bg-[#EBE8DF] dark:bg-[#2A2925] text-[#C96442] font-semibold shadow-xs"
                : "text-[#686660] dark:text-[#A8A59D] hover:bg-[#FAF7F0] dark:hover:bg-[#20201D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <span>Timeline archive</span>
          </Link>
        </div>
      </div>

      {/* Bottom Controls: Ad-Free Sliding Button & Live Agent Desk */}
      <div className="pt-4 border-t border-[#EBE8DF]/60 dark:border-[#282724] space-y-3">
        {/* Ad-Free Focus Mode Sliding Switch */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1D1B] border border-[#EBE8DF] dark:border-[#2A2925] shadow-xs transition-all hover:border-[#C96442]/40">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${isAdFree ? "bg-[#C96442]" : "bg-emerald-500"}`} />
                <span className="text-xs font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] truncate">
                  Ad-Free Reading
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#8E8B82] dark:text-[#A8A59D] truncate">
                {isAdFree ? "3-story focus view" : "Standard view (ads)"}
              </p>
            </div>

            {/* Sliding Switch Button */}
            <button
              type="button"
              role="switch"
              aria-checked={isAdFree}
              onClick={toggleAdFree}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isAdFree ? "bg-[#C96442]" : "bg-[#D6D2C4] dark:bg-[#383631]"
              }`}
              title={isAdFree ? "Ad-Free Mode is ON (showing 3 stories across screen). Click to turn OFF." : "Ad-Free Mode is OFF. Click to hide ads and show 3 stories."}
            >
              <span className="sr-only">Toggle Ad-Free Focus Mode</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAdFree ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Live Agent Desk Card */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1D1B] border border-[#EBE8DF] dark:border-[#2A2925] space-y-1.5 shadow-xs">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C96442] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C96442]"></span>
            </span>
            <span className="text-xs font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">
              Agent desk live
            </span>
          </div>
          <p className="text-[11px] text-[#8E8B82] dark:text-[#A8A59D] leading-relaxed">
            Top stories from 50+ sources, updated around the clock.
          </p>
        </div>
      </div>
    </aside>
  );
}