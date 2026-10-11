"use client";

import { useState } from "react";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/utils";
import { getThematicCoverImage } from "@/lib/imagePool";

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    cover_image_url?: string | null;
    published_at: Date;
    reading_time_minutes: number;
    author?: string | null;
    category: {
      name: string;
      slug: string;
    };
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  const fallbackUrl = getThematicCoverImage(article.category?.slug || "tech", article.title);
  const initialImg = article.cover_image_url && article.cover_image_url.startsWith("http")
    ? article.cover_image_url
    : fallbackUrl;

  const [imgSrc, setImgSrc] = useState<string>(initialImg);

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-[#EBE8DF] dark:border-[#2A2925] bg-white dark:bg-[#1C1B19] overflow-hidden transition-all duration-200 hover:border-[#C96442]/60 hover:shadow-md hover:shadow-black/5 active:scale-[0.985] active:border-[#C96442]/40">
      {/* Cover Image Thumbnail */}
      <Link
        href={`/article/${article.slug}`}
        className="block relative w-full aspect-16/9 sm:aspect-16/10 max-h-56 sm:max-h-72 overflow-hidden bg-[#FAF7F0] dark:bg-[#252422]"
      >
        <img
          src={imgSrc}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            if (imgSrc !== fallbackUrl) {
              setImgSrc(fallbackUrl);
            }
          }}
        />
      </Link>

      {/* Card Content Body */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-2">
          {/* Category & Read Time */}
          <div className="flex items-center space-x-1.5 text-xs text-[#C96442]">
            <Link
              href={`/category/${article.category.slug}`}
              className="font-medium hover:underline truncate"
            >
              {article.category.name}
            </Link>
            <span className="text-[#8E8B82] dark:text-[#686660]">•</span>
            <span className="text-[#8E8B82] dark:text-[#8E8B82] text-[11px] shrink-0">
              {article.reading_time_minutes}m read
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-serif text-base sm:text-lg font-bold leading-snug text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] transition-colors line-clamp-2">
            <Link href={`/article/${article.slug}`}>
              {article.title}
            </Link>
          </h2>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-[#686660] dark:text-[#A8A59D] line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-[#EBE8DF]/70 dark:border-[#282724] flex items-center justify-between text-[11px] text-[#8E8B82] dark:text-[#78756E]">
          <span className="flex items-center space-x-1.5 font-medium truncate max-w-[65%]">
            {article.author?.includes("Research") ? (
              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#C96442]/10 text-[#C96442]">
                <span>Research Agent</span>
              </span>
            ) : (
              <span>{article.author || "NewsFlow AI"}</span>
            )}
          </span>
          <span className="shrink-0">{formatTimeAgo(article.published_at)}</span>
        </div>
      </div>
    </article>
  );
}