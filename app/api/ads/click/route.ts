import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json().catch(() => ({}));
    if (!id) {
      return NextResponse.json({ error: "Ad ID is required" }, { status: 400 });
    }

    await prisma.domainAd.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to record click" }, { status: 500 });
  }
}
