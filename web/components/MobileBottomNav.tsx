"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Newspaper, 
  LayoutGrid, 
  Search, 
  Sun, 
  Moon, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import { useAdPreferences } from "./AdPreferencesContext";

interface MobileBottomNavProps {
  onOpenDesks: () => void;
}

export function MobileBottomNav({ onOpenDesks }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAdFree, toggleAdFree } = useAdPreferences();

  // Hide on admin routes to prevent conflict with admin cockpit
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHome = pathname === "/";
  const isSearch = pathname === "/search";
  const isCategory = pathname?.startsWith("/category/");

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBF9F5]/95 dark:bg-[#181816]/95 backdrop-blur-md border-t border-[#EBE8DF] dark:border-[#282724] pb-safe transition-colors duration-200">
      <nav aria-label="Mobile Bottom Navigation" className="flex items-center justify-around h-14 px-2">
        {/* 1. Feed / Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-colors active:scale-95 ${
            isHome
              ? "text-[#C96442] font-semibold"
              : "text-[#8E8B82] dark:text-[#A8A59D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
          }`}
        >
          <Newspaper className={`w-5 h-5 mb-0.5 ${isHome ? "stroke-[2.5]" : "stroke-2"}`} />
          <span>Feed</span>
        </Link>

        {/* 2. News Desks (Opens Drawer) */}
        <button
          type="button"
          onClick={onOpenDesks}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-colors active:scale-95 cursor-pointer ${
            isCategory
              ? "text-[#C96442] font-semibold"
              : "text-[#8E8B82] dark:text-[#A8A59D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
          }`}
        >
          <LayoutGrid className={`w-5 h-5 mb-0.5 ${isCategory ? "stroke-[2.5]" : "stroke-2"}`} />
          <span>Desks</span>
        </button>

        {/* 3. Search */}
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-colors active:scale-95 ${
            isSearch
              ? "text-[#C96442] font-semibold"
              : "text-[#8E8B82] dark:text-[#A8A59D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
          }`}
        >
          <Search className={`w-5 h-5 mb-0.5 ${isSearch ? "stroke-[2.5]" : "stroke-2"}`} />
          <span>Search</span>
        </Link>

        {/* 4. Focus (Ad-Free) Mode Quick Switch */}
        <button
          type="button"
          onClick={toggleAdFree}
          aria-label={isAdFree ? "Turn ads on" : "Turn ad-free reading on"}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-colors active:scale-95 cursor-pointer ${
            isAdFree
              ? "text-[#C96442] font-semibold"
              : "text-[#8E8B82] dark:text-[#A8A59D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
          }`}
        >
          <div className="relative">
            {isAdFree ? (
              <Eye className="w-5 h-5 mb-0.5 stroke-[2.5]" />
            ) : (
              <EyeOff className="w-5 h-5 mb-0.5 stroke-2 opacity-80" />
            )}
            <span
              className={`absolute -top-0.5 -right-1 w-2 h-2 rounded-full ring-2 ring-white dark:ring-[#181816] ${
                isAdFree ? "bg-[#C96442]" : "bg-emerald-500"
              }`}
            />
          </div>
          <span>{isAdFree ? "Ad-Free" : "Ads On"}</span>
        </button>

        {/* 5. Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Dark/Light Mode"
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium text-[#8E8B82] dark:text-[#A8A59D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB] transition-colors active:scale-95 cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 mb-0.5 stroke-2" />
          ) : (
            <Moon className="w-5 h-5 mb-0.5 stroke-2" />
          )}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </nav>
    </div>
  );
}
