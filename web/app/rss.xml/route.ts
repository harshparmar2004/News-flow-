import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const articles = await prisma.article.findMany({
    where: { status: "published" },
    orderBy: { published_at: "desc" },
    take: 50,
    include: { category: true },
  });

  const rssItems = articles
    .map((art) => {
      const artUrl = `${siteUrl}/article/${art.slug}`;
      const pubDate = new Date(art.published_at).toUTCString();
      const imageEnclosure = art.cover_image_url
        ? `<enclosure url="${art.cover_image_url}" type="image/jpeg" />`
        : "";

      return `
    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>${artUrl}</link>
      <guid isPermaLink="true">${artUrl}</guid>
      <description><![CDATA[${art.summary}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${art.category.name}]]></category>
      <author><![CDATA[${art.author || "NewsFlow AI"}]]></author>
      ${imageEnclosure}
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NewsFlow — Autonomous Tech Journalism</title>
    <link>${siteUrl}</link>
    <description>24/7 autonomous intelligence covering frontier AI, computing architectures, and software engineering.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=1800, stale-while-revalidate",
    },
  });
}