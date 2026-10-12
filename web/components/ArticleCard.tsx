"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formatTimeAgo, getOptimizedImageUrl, getSourceBrand } from "@/lib/utils";
import { getThematicCoverImage } from "@/lib/imagePool";

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    cover_image_url?: string | null;
    source_url?: string | null;
    published_at: Date | string;
    reading_time_minutes: number;
    author?: string | null;
    category: {
      name: string;
      slug: string;
    };
  };
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const fallbackUrl = getThematicCoverImage(article.category?.slug || "tech", article.title);
  const rawCover = article.cover_image_url && article.cover_image_url.startsWith("http")
    ? article.cover_image_url
    : fallbackUrl;
  const initialImg = getOptimizedImageUrl(rawCover, 650);
  const sourceBrand = getSourceBrand(article.source_url, article.author);

  const [imgSrc, setImgSrc] = useState<string>(initialImg);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Sync image source if article changes
  useEffect(() => {
    const nextRaw = article.cover_image_url && article.cover_image_url.startsWith("http")
      ? article.cover_image_url
      : fallbackUrl;
    setImgSrc(getOptimizedImageUrl(nextRaw, 650));
  }, [article.cover_image_url, article.title, article.category?.slug, fallbackUrl]);

  // Handle cached or preloaded images immediately
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [imgSrc]);

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-[#EBE8DF] dark:border-[#2A2925] bg-white dark:bg-[#1C1B19] overflow-hidden transition-all duration-300 hover:border-[#C96442]/60 hover:shadow-lg hover:shadow-[#C96442]/5 hover:-translate-y-0.5 active:scale-[0.985] active:translate-y-0 active:border-[#C96442]/40 transform-gpu">
      {/* Cover Image Thumbnail */}
      <Link
        href={`/article/${article.slug}`}
        prefetch={true}
        className="block relative w-full aspect-16/9 sm:aspect-16/10 max-h-56 sm:max-h-72 overflow-hidden bg-[#FAF7F0] dark:bg-[#252422]"
      >
        {/* Subtle Skeleton Shimmer while loading */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-200/40 via-neutral-100/60 to-neutral-200/40 dark:from-neutral-800/40 dark:via-neutral-700/60 dark:to-neutral-800/40 animate-pulse pointer-events-none" />
        )}
        <img
          ref={(node) => {
            imgRef.current = node;
            if (node?.complete && node?.naturalWidth > 0 && !isLoaded) {
              setIsLoaded(true);
            }
          }}
          src={imgSrc}
          alt={article.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-out group-hover:scale-103 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-102"
          }`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            const fb = getOptimizedImageUrl(fallbackUrl, 650);
            if (imgSrc !== fb) {
              setImgSrc(fb);
            }
          }}
        />
      </Link>

      {/* Card Content Body */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-2">
          {/* Category, Read Time & Source Brand Pill */}
          <div className="flex items-center justify-between text-xs gap-2">
            <div className="flex items-center space-x-1.5 text-[#C96442] truncate min-w-0">
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

            {/* Source Brand Badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-tight bg-[#FAF7F0] dark:bg-[#252422] border border-[#EBE8DF] dark:border-[#33322E] text-[#1F1E1D] dark:text-[#E2DFD8] shrink-0">
              {sourceBrand}
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block shrink-0" />
            <span className="truncate">{sourceBrand}</span>
          </span>
          <span className="shrink-0 font-mono text-[11px]">{formatTimeAgo(article.published_at)}</span>
        </div>
      </div>
    </article>
  );
}