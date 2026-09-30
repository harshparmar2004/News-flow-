import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await verifyAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [articles, categories, subscriberCount, settings, initialAds] = await Promise.all([
    prisma.article.findMany({
      orderBy: { published_at: "desc" },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { display_order: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.newsletterSubscriber.count({ where: { status: "active" } }),
    prisma.systemSetting.findMany(),
    prisma.domainAd.findMany({
      orderBy: [{ domain: "asc" }, { slot: "asc" }],
    }),
  ]);

  const apiKey = process.env.NEWSFLOW_API_KEY || "nf_live_sec_9942a8b7e1034f68a";

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const rawJevKey = settingsMap["TYPESAFE_JEV_API_KEY"] || process.env.TYPESAFE_API_KEY || "";

  const initialJevSettings = {
    has_key: Boolean(rawJevKey),
    masked_key: rawJevKey
      ? rawJevKey.length <= 8
        ? "••••••••"
        : rawJevKey.substring(0, 4) + "••••••••" + rawJevKey.substring(rawJevKey.length - 4)
      : "",
    enabled: settingsMap["JEV_ENABLED"] !== "false" && Boolean(rawJevKey),
    min_impact_score: settingsMap["JEV_MIN_IMPACT_SCORE"] ? parseFloat(settingsMap["JEV_MIN_IMPACT_SCORE"]) : 7.0,
    auto_feature_score: settingsMap["JEV_AUTO_FEATURE_SCORE"] ? parseFloat(settingsMap["JEV_AUTO_FEATURE_SCORE"]) : 8.5,
  };

  const serializedArticles = articles.map((a) => ({
    ...a,
    published_at: a.published_at.toISOString(),
    created_at: a.created_at.toISOString(),
    updated_at: a.updated_at.toISOString(),
  }));

  const serializedAds = initialAds.map((ad) => ({
    ...ad,
    created_at: ad.created_at.toISOString(),
    updated_at: ad.updated_at.toISOString(),
  }));

  return (
    <AdminDashboardClient
      initialArticles={serializedArticles as any}
      categories={categories}
      subscriberCount={subscriberCount}
      apiKey={apiKey}
      initialJevSettings={initialJevSettings}
      initialAds={serializedAds as any}
    />
  );
}