import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await verifyAdminSession();
  const authHeader = req.headers.get("x-api-key");
  const isValidApiKey = authHeader && authHeader === process.env.NEWSFLOW_API_KEY;

  if (!session && !isValidApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const ads = await prisma.domainAd.findMany({
      orderBy: [{ domain: "asc" }, { slot: "asc" }],
    });

    return NextResponse.json({ success: true, ads });
  } catch (error) {
    console.error("Error fetching domain ads:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  const authHeader = req.headers.get("x-api-key");
  const isValidApiKey = authHeader && authHeader === process.env.NEWSFLOW_API_KEY;

  if (!session && !isValidApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      domain,
      slot,
      ad_type = "banner",
      title,
      sponsor,
      image_url,
      link_url,
      html_code,
      is_active = true,
    } = body;

    if (!domain || !slot) {
      return NextResponse.json(
        { error: "Domain and slot ('top_300x250' or 'bottom_300x600') are required." },
        { status: 400 }
      );
    }

    const savedAd = await prisma.domainAd.upsert({
      where: {
        domain_slot: {
          domain,
          slot,
        },
      },
      update: {
        ad_type,
        title: title || null,
        sponsor: sponsor || null,
        image_url: image_url || null,
        link_url: link_url || null,
        html_code: html_code || null,
        is_active: Boolean(is_active),
      },
      create: {
        domain,
        slot,
        ad_type,
        title: title || null,
        sponsor: sponsor || null,
        image_url: image_url || null,
        link_url: link_url || null,
        html_code: html_code || null,
        is_active: Boolean(is_active),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Ad for domain '${domain}' (${slot}) saved successfully.`,
      ad: savedAd,
    });
  } catch (error) {
    console.error("Error saving domain ad:", error);
    return NextResponse.json({ error: "Failed to save ad configuration" }, { status: 500 });
  }
}
