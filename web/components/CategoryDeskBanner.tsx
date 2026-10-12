"use client";

import { useState } from "react";
import { 
  Cpu, 
  TrendingUp, 
  Smartphone, 
  ShieldAlert, 
  Scale, 
  Sparkles, 
  Layers, 
  Check,
  Bot
} from "lucide-react";
import { useAdPreferences } from "./AdPreferencesContext";

interface CategoryDeskBannerProps {
  title: string;
  description?: string | null;
  slug?: string;
  activeFilter?: "latest" | "top" | "most_read";
  onFilterChange?: (filter: "latest" | "top" | "most_read") => void;
  showFilters?: boolean;
}

const CATEGORY_ICON_MAP: Record<string, any> = {
  "ai": Cpu,
  "robotics": Bot,
  "ai-robotics": Cpu,
  "startups-vc": TrendingUp,
  "gadgets-hardware": Smartphone,
  "cybersecurity": ShieldAlert,
  "policy-big-tech": Scale,
  "tech": Sparkles,
};

export function CategoryDeskBanner({
  title,
  description,
  slug,
  activeFilter: controlledFilter,
  onFilterChange,
  showFilters = true,
}: CategoryDeskBannerProps) {
  const { isAdFree } = useAdPreferences();
  const [internalFilter, setInternalFilter] = useState<"latest" | "top" | "most_read">("latest");
  const [isFollowing, setIsFollowing] = useState(false);

  const activeFilter = controlledFilter !== undefined ? controlledFilter : internalFilter;

  const IconComponent = (slug && CATEGORY_ICON_MAP[slug]) || Layers;

  const handleFilterClick = (filter: "latest" | "top" | "most_read") => {
    setInternalFilter(filter);
    if (onFilterChange) onFilterChange(filter);
  };

  const isHomeDesk = title === "All Intelligence";

  return (
    <div className={`space-y-3 transition-all duration-200 w-full ${isHomeDesk && !showFilters ? "hidden sm:block" : ""}`}>
      {/* Editorial Banner Card */}
      <div
        className={`relative rounded-xl sm:rounded-2xl border border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1C1B19] p-3 sm:p-5 shadow-xs items-center justify-between gap-3 overflow-hidden ${
          isHomeDesk ? "hidden sm:flex" : "flex"
        }`}
      >
        {/* Left Side: Icon & Details */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg sm:rounded-xl bg-[#FAF7F0] dark:bg-[#282723] border border-[#EBE8DF] dark:border-[#383630] flex items-center justify-center text-[#C96442] shadow-2xs">
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <h1 className="font-serif text-base sm:text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB] truncate">
              {title}
            </h1>
            <p className="text-[11px] sm:text-xs text-[#686660] dark:text-[#A8A59D] line-clamp-1 leading-relaxed hidden sm:block">
              {description || "Continuous autonomous synthesis across global frontier sources."}
            </p>
          </div>
        </div>

        {/* Right Side: Follow Desk Button */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-3 sm:px-5 py-1 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all flex items-center space-x-1.5 active:scale-95 ${
              isFollowing
                ? "bg-[#C96442] text-white"
                : "border border-[#D6D2C4] dark:border-[#3E3A33] text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] hover:text-[#C96442] dark:hover:border-[#C96442] dark:hover:text-[#C96442]"
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Following</span>
              </>
            ) : (
              <span>Follow</span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs: Latest, Top today, Most read (when enabled) */}
      {showFilters && (
        <div className="inline-flex items-center p-1 rounded-xl bg-white dark:bg-[#1E1D1B] border border-[#EBE8DF] dark:border-[#2C2A26] shadow-2xs w-full sm:w-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => handleFilterClick("latest")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer text-center active:scale-95 ${
              activeFilter === "latest"
                ? "bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] shadow-xs font-semibold"
                : "text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
            title="Show latest news published first"
          >
            Latest
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick("top")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer text-center active:scale-95 ${
              activeFilter === "top"
                ? "bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] shadow-xs font-semibold"
                : "text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
            title="Show highest impact news today"
          >
            Top today
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick("most_read")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer text-center active:scale-95 ${
              activeFilter === "most_read"
                ? "bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] shadow-xs font-semibold"
                : "text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
            title="Show most read news"
          >
            Most read
          </button>
        </div>
      )}
    </div>
  );
}