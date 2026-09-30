import React from "react";
import { ExternalLink, Tag } from "lucide-react";
import { AffiliateLink } from "@/lib/utils";

interface AffiliateBlockProps {
  links: AffiliateLink[];
  title?: string;
}

export function AffiliateBlock({
  links,
  title = "Curated Hardware & Reading",
}: AffiliateBlockProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="my-10 p-6 rounded-2xl border border-[#E8E2D5] dark:border-[#383630] bg-[#FAF7F0] dark:bg-[#20201D] transition-colors shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#E8E2D5] dark:border-[#33322E] gap-2">
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-[#C96442]" />
          <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
            {title}
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#8E8B82] dark:text-[#A8A59D] tracking-wide">
          Sponsored Recommendations
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="group flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-[#262622] border border-[#EBE8DF] dark:border-[#33322E] hover:border-[#C96442]/60 dark:hover:border-[#C96442]/60 hover:shadow-sm transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                {item.badge ? (
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#C96442]/10 text-[#C96442] border border-[#C96442]/20">
                    {item.badge}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[#8E8B82] dark:text-[#A8A59D]">
                    Recommendation
                  </span>
                )}
                {item.price && (
                  <span className="text-xs font-semibold text-[#C96442]">
                    {item.price}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] transition-colors">
                {item.label}
              </h4>
              {item.description && (
                <p className="text-xs text-[#686660] dark:text-[#A8A59D] mt-1.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            <div className="mt-3 pt-2 flex items-center justify-end text-xs font-medium text-[#C96442] group-hover:translate-x-0.5 transition-transform">
              <span>View Product</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </div>
          </a>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-[#8E8B82] dark:text-[#686660] italic">
        * FTC Disclosure: When you purchase products through these links, NewsFlow may earn a small affiliate commission at no extra cost to you.
      </p>
    </div>
  );
}