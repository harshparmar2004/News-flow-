import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: "published" },
      select: { slug: true, updated_at: true },
    }),
    prisma.category.findMany({
      select: { slug: true },
    }),
  ]);

  const articleEntries: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${siteUrl}/article/${art.slug}`,
    lastModified: art.updated_at,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  return [...staticEntries, ...categoryEntries, ...articleEntries];
}