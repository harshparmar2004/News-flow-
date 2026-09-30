import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Intelligence",
  description: "Search all published technology articles, analysis, and breaking stories on NewsFlow.",
};

export const revalidate = 60;

export default async function SearchPage() {
  const [articles, categories, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where: { status: "published" },
      orderBy: { published_at: "desc" },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { status: "published" } } },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.article.count({ where: { status: "published" } }),
  ]);

  const serializedArticles = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    cover_image_url: a.cover_image_url,
    published_at: a.published_at.toISOString(),
    reading_time_minutes: a.reading_time_minutes,
    tags: a.tags,
    category: a.category,
  }));

  return (
    <SearchClient
      initialArticles={serializedArticles}
      categories={categories}
      totalArticles={totalArticles}
    />
  );
}