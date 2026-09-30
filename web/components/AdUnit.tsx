import React from "react";

interface AdUnitProps {
  slot: "in-content" | "sidebar" | "footer" | "leaderboard";
  className?: string;
}

export function AdUnit({ slot, className = "" }: AdUnitProps) {
  let sizeLabel = "300x250 / 728x90";
  let minHeight = "min-h-[250px]";
  let maxWidth = "max-w-[728px]";

  if (slot === "sidebar") {
    sizeLabel = "300x250 Medium Rectangle";
    minHeight = "min-h-[250px]";
    maxWidth = "max-w-[300px]";
  } else if (slot === "footer" || slot === "leaderboard") {
    sizeLabel = "728x90 Leaderboard (320x100 Mobile)";
    minHeight = "min-h-[90px]";
    maxWidth = "max-w-[728px]";
  } else if (slot === "in-content") {
    sizeLabel = "In-Article Responsive (300x250 / 728x90)";
    minHeight = "min-h-[250px]";
    maxWidth = "max-w-[728px]";
  }

  return (
    <div
      className={`my-8 mx-auto w-full ${maxWidth} flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-[#EBE8DF] dark:border-[#33322E] bg-[#F7F4EC]/60 dark:bg-[#1C1C19]/60 transition-colors ${className}`}
      data-ad-slot={slot}
    >
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E8B82] dark:text-[#686660]">
          Advertisement
        </span>
        <span className="text-[10px] font-mono text-[#A8A59D] dark:text-[#52504A]">
          {sizeLabel}
        </span>
      </div>

      {/* Target Container for Google AdSense / Ezoic / Carbon scripts */}
      <div
        className={`w-full ${minHeight} flex flex-col items-center justify-center rounded-lg bg-[#FFFFFF]/70 dark:bg-[#22221F]/70 border border-[#EBE8DF]/70 dark:border-[#33322E]/70 text-center p-4`}
      >
        <p className="text-xs font-mono text-[#8E8B82] dark:text-[#686660]">
          Reserved IAB Unit Zone
        </p>
        <p className="text-[11px] text-[#A8A59D] dark:text-[#52504A] mt-1 max-w-xs">
          Drop in network ad tags (AdSense / Ezoic / Carbon) here with zero layout shift
        </p>
      </div>
    </div>
  );
}