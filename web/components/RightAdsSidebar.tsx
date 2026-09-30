"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface AdItem {
  id: string;
  domain: string;
  slot: string;
  ad_type: string;
  title: string | null;
  sponsor: string | null;
  image_url: string | null;
  link_url: string | null;
  html_code: string | null;
  is_active: boolean;
}

interface RightAdsSidebarProps {
  domain?: string;
}

export function RightAdsSidebar({ domain = "global" }: RightAdsSidebarProps) {
  const [topAd, setTopAd] = useState<AdItem | null>(null);
  const [bottomAd, setBottomAd] = useState<AdItem | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadAds() {
      try {
        const res = await fetch(`/api/ads?domain=${encodeURIComponent(domain)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setTopAd(data.top_300x250 || null);
            setBottomAd(data.bottom_300x600 || null);
          }
        }
      } catch (err) {
        console.error("Failed to load domain ads:", err);
      } finally {
        if (isMounted) setLoaded(true);
      }
    }
    loadAds();
    return () => {
      isMounted = false;
    };
  }, [domain]);

  const handleAdClick = (ad: AdItem) => {
    if (!ad?.id) return;
    try {
      fetch("/api/ads/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ad.id }),
      }).catch(() => {});
    } catch {}
  };

  return (
    <aside className="w-80 shrink-0 h-[calc(100vh-4rem)] border-l border-[#EBE8DF] dark:border-[#282724] bg-[#FBF9F5] dark:bg-[#141413] p-6 hidden xl:flex flex-col gap-6 overflow-y-auto no-scrollbar select-none">
      
      {/* 1. TOP SLOT (300x250 Medium Rectangle) */}
      {topAd && topAd.is_active ? (
        <div className="w-[300px] h-[250px] shrink-0 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#1C1C19] overflow-hidden flex flex-col relative group shadow-xs">
          {topAd.ad_type === "custom_html" && topAd.html_code ? (
            <div
              className="w-full h-full flex flex-col justify-center items-center overflow-hidden"
              dangerouslySetInnerHTML={{ __html: topAd.html_code }}
            />
          ) : (
            <a
              href={topAd.link_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleAdClick(topAd)}
              className="relative w-full h-full block group/ad overflow-hidden"
            >
              {topAd.image_url ? (
                <img
                  src={topAd.image_url}
                  alt={topAd.title || "Sponsored Advertisement"}
                  className="w-full h-full object-cover group-hover/ad:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#FAF7F0] to-[#EBE8DF] dark:from-[#20201D] dark:to-[#181816] p-5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C96442] font-semibold">
                      {topAd.sponsor || "Sponsored"}
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB] leading-tight">
                      {topAd.title || "Featured Sponsor"}
                    </h4>
                  </div>
                  <span className="inline-flex items-center text-xs font-medium text-[#C96442]">
                    Learn more <ExternalLink className="w-3 h-3 ml-1" />
                  </span>
                </div>
              )}

              {/* Sponsor Overlay Pill */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white/90">
                {topAd.sponsor || "Sponsored"}
              </div>

              {topAd.image_url && topAd.title && (
                <div className="absolute bottom-0 inset-x-0 p-3 bg-linear-to-t from-black/80 via-black/40 to-transparent text-white">
                  <p className="font-serif text-xs font-semibold line-clamp-1">
                    {topAd.title}
                  </p>
                </div>
              )}
            </a>
          )}
        </div>
      ) : (
        /* Clean Default Placeholder */
        <div className="w-[300px] h-[250px] shrink-0 rounded-2xl border border-dashed border-[#D6D2C4] dark:border-[#2A2925] bg-[#F2EFE9]/40 dark:bg-[#1A1917]/60 flex flex-col items-center justify-center text-xs font-mono text-[#8E8B82] dark:text-[#686660] transition-colors hover:border-[#C96442]/40">
          <span className="font-semibold">Ad slot - 300×250</span>
          <span className="text-[10px] text-[#A8A59D] dark:text-[#52504B] mt-1">
            {domain !== "global" ? `Custom ad for ${domain}` : "Reserved for monetization"}
          </span>
        </div>
      )}

      {/* 2. BOTTOM SLOT (300x600 Half Page / Skyscraper) */}
      {bottomAd && bottomAd.is_active ? (
        <div className="w-[300px] min-h-[480px] flex-1 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#1C1C19] overflow-hidden flex flex-col relative group shadow-xs">
          {bottomAd.ad_type === "custom_html" && bottomAd.html_code ? (
            <div
              className="w-full h-full flex flex-col justify-center items-center overflow-hidden p-2"
              dangerouslySetInnerHTML={{ __html: bottomAd.html_code }}
            />
          ) : (
            <a
              href={bottomAd.link_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleAdClick(bottomAd)}
              className="relative w-full h-full block group/ad overflow-hidden"
            >
              {bottomAd.image_url ? (
                <img
                  src={bottomAd.image_url}
                  alt={bottomAd.title || "Sponsored Advertisement"}
                  className="w-full h-full object-cover group-hover/ad:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#FAF7F0] to-[#EBE8DF] dark:from-[#20201D] dark:to-[#181816] p-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#C96442] font-semibold">
                      {bottomAd.sponsor || "Featured Partner"}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB] leading-snug">
                      {bottomAd.title || "High-Impact Technology Partner"}
                    </h3>
                  </div>
                  <span className="inline-flex items-center text-xs font-medium text-[#C96442]">
                    Explore partner <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              )}

              {/* Sponsor Overlay Pill */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white/90">
                {bottomAd.sponsor || "Sponsored"}
              </div>

              {bottomAd.image_url && bottomAd.title && (
                <div className="absolute bottom-0 inset-x-0 p-4 bg-linear-to-t from-black/85 via-black/50 to-transparent text-white">
                  <p className="font-serif text-sm font-semibold line-clamp-2">
                    {bottomAd.title}
                  </p>
                </div>
              )}
            </a>
          )}
        </div>
      ) : (
        /* Clean Default Placeholder */
        <div className="w-[300px] flex-1 min-h-[480px] rounded-2xl border border-dashed border-[#D6D2C4] dark:border-[#2A2925] bg-[#F2EFE9]/40 dark:bg-[#1A1917]/60 flex flex-col items-center justify-center text-xs font-mono text-[#8E8B82] dark:text-[#686660] transition-colors hover:border-[#C96442]/40">
          <span className="font-semibold">Ad slot - 300×600</span>
          <span className="text-[10px] text-[#A8A59D] dark:text-[#52504B] mt-1">
            {domain !== "global" ? `Custom ad for ${domain}` : "High-impact vertical display"}
          </span>
        </div>
      )}
    </aside>
  );
}