import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain") || "global";

    // Fetch active ads for the requested domain AND the global fallback
    const ads = await prisma.domainAd.findMany({
      where: {
        domain: { in: [domain, "global"] },
        is_active: true,
      },
    });

    // Resolve top slot (domain-specific preferred over global)
    const topDomain = ads.find((a) => a.domain === domain && a.slot === "top_300x250");
    const topGlobal = ads.find((a) => a.domain === "global" && a.slot === "top_300x250");
    const topAd = topDomain || topGlobal || null;

    // Resolve bottom slot (domain-specific preferred over global)
    const bottomDomain = ads.find((a) => a.domain === domain && a.slot === "bottom_300x600");
    const bottomGlobal = ads.find((a) => a.domain === "global" && a.slot === "bottom_300x600");
    const bottomAd = bottomDomain || bottomGlobal || null;

    // Increment impressions in background for active served ads
    const idsToIncrement: string[] = [];
    if (topAd) idsToIncrement.push(topAd.id);
    if (bottomAd && bottomAd.id !== topAd?.id) idsToIncrement.push(bottomAd.id);

    if (idsToIncrement.length > 0) {
      prisma.domainAd
        .updateMany({
          where: { id: { in: idsToIncrement } },
          data: { impressions: { increment: 1 } },
        })
        .catch(() => {});
    }

    return NextResponse.json({
      domain,
      top_300x250: topAd,
      bottom_300x600: bottomAd,
    });
  } catch (error) {
    console.error("Error serving domain ads:", error);
    return NextResponse.json({ top_300x250: null, bottom_300x600: null }, { status: 500 });
  }
}
