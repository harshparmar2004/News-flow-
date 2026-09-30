import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface HeroArticleProps {
  article: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    cover_image_url?: string | null;
    published_at: Date;
    reading_time_minutes: number;
    author: string;
    category: {
      name: string;
      slug: string;
    };
    rank_score?: number;
  };
}

export function HeroArticle({ article }: HeroArticleProps) {
  return (
    <article className="group relative rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] p-6 md:p-8 transition-all hover:border-[#C96442]/40 hover:shadow-lg hover:shadow-amber-950/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Metadata, Title, Summary, CTA */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link
                href={`/category/${article.category.slug}`}
                className="font-medium px-3 py-1 rounded-full bg-[#FAF7F0] dark:bg-[#2A2925] border border-[#EBE8DF] dark:border-[#3A3832] text-[#C96442] hover:bg-[#C96442]/10 transition-colors"
              >
                {article.category.name}
              </Link>

              {article.rank_score && article.rank_score >= 90 && (
                <span className="flex items-center text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Top Signal
                </span>
              )}

              <span className="text-[#8E8B82] dark:text-[#A8A59D] flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {article.reading_time_minutes} min read
              </span>

              <span className="text-[#8E8B82] dark:text-[#A8A59D]">
                • {formatTimeAgo(article.published_at)}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] transition-colors">
              <Link href={`/article/${article.slug}`}>
                {article.title}
              </Link>
            </h1>

            {/* Analytical Summary */}
            <p className="text-base sm:text-lg text-[#686660] dark:text-[#A8A59D] leading-relaxed line-clamp-3">
              {article.summary}
            </p>
          </div>

          {/* Byline & CTA */}
          <div className="pt-4 border-t border-[#EBE8DF]/80 dark:border-[#33322E]/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#C96442]/10 text-[#C96442] flex items-center justify-center font-mono text-xs font-bold border border-[#C96442]/20">
                AI
              </div>
              <span className="text-xs font-medium text-[#686660] dark:text-[#A8A59D]">
                {article.author}
              </span>
            </div>

            <Link
              href={`/article/${article.slug}`}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#C96442] hover:bg-[#B35334] text-white text-xs font-medium transition-colors shadow-xs"
            >
              <span>Read Full Analysis</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Cover Photo */}
        <div className="lg:col-span-5 relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden bg-[#FAF7F0] dark:bg-[#2A2925] border border-[#EBE8DF] dark:border-[#33322E]">
          {article.cover_image_url ? (
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-mono text-[#8E8B82]">
              NewsFlow Visual Engine
            </div>
          )}
        </div>
      </div>
    </article>
  );
}