import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  formatArticleDate,
  formatTimeAgo,
  renderMarkdown,
  safeJsonParse,
  SeoMeta,
} from "@/lib/utils";
import { SocialShareBar } from "@/components/SocialShareBar";
import { JsonLd } from "@/components/JsonLd";
import { ArticleCard } from "@/components/ArticleCard";
import { Clock, ExternalLink, ShieldCheck, ChevronRight, ArrowLeft } from "lucide-react";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article) {
    return { title: "Article Not Found | NewsFlow" };
  }

  const seo: SeoMeta = safeJsonParse(article.seo_meta, {});
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const title = seo.title || `${article.title} | NewsFlow`;
  const description = seo.description || article.summary;
  const ogImage = seo.og_image || article.cover_image_url || `${siteUrl}/og-default.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.published_at.toISOString(),
      authors: [article.author],
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!article || article.status !== "published") {
    notFound();
  }

  // Increment view count asynchronously in background
  prisma.article
    .update({
      where: { id: article.id },
      data: { views_count: { increment: 1 } },
    })
    .catch(() => {});

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const currentUrl = `${siteUrl}/article/${article.slug}`;
  const tags: string[] = safeJsonParse(article.tags, []);

  // Complete end-to-end markdown rendered cleanly without ad interruption
  const bodyHtml = renderMarkdown(article.body);

  // Fetch 3 related articles from same category
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      id: { not: article.id },
      status: "published",
    },
    take: 3,
    orderBy: { published_at: "desc" },
    include: { category: true },
  });

  return (
    <>
      <JsonLd article={article} siteUrl={siteUrl} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <article className="space-y-8">
          {/* Breadcrumb Navigation & Return to Feed */}
          <nav className="flex items-center justify-between text-xs text-[#8E8B82] dark:text-[#A8A59D] pb-4 border-b border-[#EBE8DF] dark:border-[#33322E]">
            <div className="flex items-center space-x-2">
              <Link href="/" className="hover:text-[#C96442] transition-colors flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-[#B0ACA2]" />
              <Link
                href={`/category/${article.category.slug}`}
                className="hover:text-[#C96442] transition-colors font-medium"
              >
                {article.category.name}
              </Link>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono">
              <Clock className="w-3.5 h-3.5 text-[#C96442]" />
              <span>{article.reading_time_minutes} min read</span>
            </div>
          </nav>

          {/* Article Header */}
          <header className="space-y-5">
            <div className="flex items-center space-x-3 text-xs">
              <Link
                href={`/category/${article.category.slug}`}
                className="font-medium px-3.5 py-1 rounded-full bg-[#FAF7F0] dark:bg-[#2A2925] border border-[#EBE8DF] dark:border-[#3A3832] text-[#C96442]"
              >
                {article.category.name}
              </Link>
              <span className="text-[#8E8B82] dark:text-[#A8A59D]">
                {formatArticleDate(article.published_at)} ({formatTimeAgo(article.published_at)})
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.18] text-[#1F1E1D] dark:text-[#F5F2EB]">
              {article.title}
            </h1>

            {article.summary && (
              <p className="text-lg md:text-xl text-[#686660] dark:text-[#A8A59D] leading-relaxed font-normal border-l-2 border-[#C96442] pl-4 italic">
                {article.summary}
              </p>
            )}

            {/* Byline & Sharing Toolbar */}
            <div className="pt-4 border-t border-[#EBE8DF] dark:border-[#33322E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#C96442]/10 text-[#C96442] flex items-center justify-center font-mono text-sm font-bold border border-[#C96442]/20">
                  AI
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">
                      {article.author}
                    </span>
                    <span title="Autonomous Synthesis Verified">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C96442]" />
                    </span>
                  </div>
                  <div className="text-xs text-[#8E8B82] dark:text-[#A8A59D]">
                    NewsFlow Autonomous Newsroom Pipeline
                  </div>
                </div>
              </div>

              <SocialShareBar title={article.title} url={currentUrl} />
            </div>
          </header>

          {/* Featured Cover Image */}
          {article.cover_image_url && (
            <figure className="relative w-full aspect-16/9 rounded-3xl overflow-hidden bg-[#FAF7F0] dark:bg-[#22221F] border border-[#EBE8DF] dark:border-[#33322E] shadow-sm">
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <figcaption className="absolute bottom-2 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                NewsFlow Editorial Imagery
              </figcaption>
            </figure>
          )}

          {/* Clean End-to-End AI Article Body */}
          <div
            className="prose-claude max-w-none text-base sm:text-lg leading-relaxed text-[#2D2B28] dark:text-[#E2DFD8] pt-2"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {/* Source Attribution Box */}
          {article.source_url && (
            <div className="p-4 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#20201D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-[#686660] dark:text-[#A8A59D]">
                Originally synthesized and fact-checked from primary reporting source.
              </span>
              <a
                href={article.source_url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center text-[#C96442] font-medium hover:underline shrink-0"
              >
                <span>View Primary Source Report</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          )}

          {/* Article Tags */}
          {tags.length > 0 && (
            <div className="pt-6 border-t border-[#EBE8DF] dark:border-[#33322E] flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#8E8B82] mr-1">Tags:</span>
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#FAF7F0] dark:bg-[#22221F] border border-[#EBE8DF] dark:border-[#33322E] text-[#686660] dark:text-[#A8A59D]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Social Share */}
          <div className="py-4 border-t border-b border-[#EBE8DF] dark:border-[#33322E] flex items-center justify-between">
            <span className="text-sm font-serif font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              Share this story
            </span>
            <SocialShareBar title={article.title} url={currentUrl} />
          </div>
        </article>

        {/* Related Articles Section (Clean 3 in a row) */}
        {relatedArticles.length > 0 && (
          <section className="pt-12 space-y-6">
            <div className="flex items-baseline justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
              <h3 className="font-serif text-2xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                More in {article.category.name}
              </h3>
              <Link
                href={`/category/${article.category.slug}`}
                className="text-xs font-medium text-[#C96442] hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}