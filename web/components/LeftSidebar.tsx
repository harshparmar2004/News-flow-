"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rss, Search, Clock, Radio } from "lucide-react";
import { NewsFlowLogo } from "./NewsFlowLogo";
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
  todaysCount?: number;
}

export function LeftSidebar({ categories, activeSlug, totalArticles, todaysCount }: LeftSidebarProps) {
  const pathname = usePathname();
  const { isAdFree, toggleAdFree } = useAdPreferences();

  return (
    <aside className="w-64 shrink-0 sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] border-r border-[#EBE8DF] dark:border-[#282724] bg-[#FBF9F5] dark:bg-[#141413] p-4 sm:p-5 flex flex-col justify-between overflow-y-auto select-none">
      {/* Top Navigation Block */}
      <div className="space-y-5">
        {/* Brand / Title Indicator */}
        <Link href="/" className="flex items-center space-x-2.5 pt-0.5 pb-1 group">
          <NewsFlowLogo size={24} />
          <span className="font-serif text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] dark:group-hover:text-[#C96442] transition-colors">
            NewsFlow
          </span>
        </Link>

        {/* Section: NEWS DESKS */}
        <div className="space-y-1">
          <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#686660] px-2 mb-1.5">
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

          {/* Today's News Direct Link */}
          <Link
            href="/today"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
              pathname === "/today" || activeSlug === "today"
                ? "bg-[#FBEBE8] dark:bg-[#2C1F1B] text-[#C96442] font-semibold shadow-xs"
                : "text-[#686660] dark:text-[#A8A59D] hover:bg-[#FAF7F0] dark:hover:bg-[#20201D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <span className="group-hover:text-rose-500 transition-colors">Today&apos;s News</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
              {todaysCount && todaysCount > 0 ? (
                <>
                  <span className="font-bold">{todaysCount}</span>
                  <span>Live</span>
                </>
              ) : (
                <span>Live</span>
              )}
            </span>
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
        <div className="space-y-1 pt-2 border-t border-[#EBE8DF]/60 dark:border-[#282724]">
          <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#686660] px-2 mb-1.5">
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

      {/* Bottom Controls: Compact Ad-Free Toggle & Live Telemetry */}
      <div className="pt-3 border-t border-[#EBE8DF]/60 dark:border-[#282724] space-y-2.5 pb-2">
        {/* Ad-Free Focus Mode Sliding Switch */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#1E1D1B] border border-[#EBE8DF] dark:border-[#2A2925] shadow-xs transition-all hover:border-[#C96442]/40">
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
              title={isAdFree ? "Ad-Free Mode is ON. Click to turn OFF." : "Ad-Free Mode is OFF. Click to hide ads."}
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

        {/* Live Agent Desk Status Strip */}
        <div className="flex items-center justify-between px-2 text-xs font-mono text-[#8E8B82] dark:text-[#A8A59D]">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C96442] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C96442]"></span>
            </span>
            <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">Agent desk live</span>
          </div>
          <span className="text-[11px] text-[#8E8B82] dark:text-[#78756E]">24/7 Wire</span>
        </div>
      </div>
    </aside>
  );
}