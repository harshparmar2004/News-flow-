import React from "react";

interface JsonLdProps {
  article: {
    title: string;
    summary: string;
    cover_image_url?: string | null;
    published_at: Date | string;
    updated_at: Date | string;
    author: string;
    slug: string;
  };
  siteUrl: string;
}

export function JsonLd({ article, siteUrl }: JsonLdProps) {
  const articleUrl = `${siteUrl}/article/${article.slug}`;
  const publishDate =
    typeof article.published_at === "string"
      ? article.published_at
      : article.published_at.toISOString();
  const updateDate =
    typeof article.updated_at === "string"
      ? article.updated_at
      : article.updated_at.toISOString();

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: article.cover_image_url ? [article.cover_image_url] : [],
    datePublished: publishDate,
    dateModified: updateDate,
    author: {
      "@type": "Organization",
      name: article.author || "NewsFlow AI",
      url: `${siteUrl}/about`,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "NewsFlow",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}