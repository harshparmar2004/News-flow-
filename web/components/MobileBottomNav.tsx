"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Newspaper, 
  LayoutGrid, 
  Search, 
  Radio
} from "lucide-react";

interface MobileBottomNavProps {
  onOpenDesks: () => void;
}

export function MobileBottomNav({ onOpenDesks }: MobileBottomNavProps) {
  const pathname = usePathname();

  // Hide on admin routes to prevent conflict with admin cockpit
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHome = pathname === "/";
  const isSearch = pathname === "/search";
  const isCategory = pathname?.startsWith("/category/");

  const handleFeedClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTodayClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById("todays-news");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBF9F5]/95 dark:bg-[#181816]/95 backdrop-blur-md border-t border-[#EBE8DF] dark:border-[#282724] pb-safe transition-colors duration-200">
      <nav aria-label="Mobile Bottom Navigation" className="flex items-center justify-around h-14 px-3">
        {/* 1. Feed / Home */}
        <Link
          href="/"
          onClick={handleFeedClick}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-all active:scale-95 ${
            isHome
              ? "text-[#C96442] font-semibold"
              : "text-[#8E8B82] dark:text-[#A8A59D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
          }`}
        >
          <Newspaper className={`w-5 h-5 mb-0.5 ${isHome ? "stroke-[2.5]" : "stroke-2"}`} />
          <span>Feed</span>
        </Link>

        {/* 2. Today's Wire (with live pulse dot) */}
        <Link
          href="/today"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-all active:scale-95 ${
            pathname === "/today"
              ? "text-[#C96442] font-semibold"
              : "text-[#8E8B82] dark:text-[#A8A59D] hover:text-[#C96442]"
          }`}
        >
          <div className="relative">
            <Radio className={`w-5 h-5 mb-0.5 ${pathname === "/today" ? "stroke-[2.5]" : "stroke-2"} text-[#C96442]`} />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
          </div>
          <span className={pathname === "/today" ? "text-[#C96442] font-semibold" : "text-[#1F1E1D] dark:text-[#F5F2EB] font-medium"}>Today</span>
        </Link>

        {/* 3. News Desks (Opens Drawer) */}
        <button
          type="button"
          onClick={onOpenDesks}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-all active:scale-95 cursor-pointer ${
            isCategory
              ? "text-[#C96442] font-semibold"
              : "text-[#8E8B82] dark:text-[#A8A59D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
          }`}
        >
          <LayoutGrid className={`w-5 h-5 mb-0.5 ${isCategory ? "stroke-[2.5]" : "stroke-2"}`} />
          <span>Desks</span>
        </button>

        {/* 4. Search */}
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-all active:scale-95 ${
            isSearch
              ? "text-[#C96442] font-semibold"
              : "text-[#8E8B82] dark:text-[#A8A59D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
          }`}
        >
          <Search className={`w-5 h-5 mb-0.5 ${isSearch ? "stroke-[2.5]" : "stroke-2"}`} />
          <span>Search</span>
        </Link>
      </nav>
    </div>
  );
}
