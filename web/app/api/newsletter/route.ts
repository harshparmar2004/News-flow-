import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    await prisma.newsletterSubscriber.upsert({
      where: { email: cleanEmail },
      update: { status: "active" },
      create: { email: cleanEmail, status: "active" },
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully to The Daily Signal!",
    });
  } catch (error: any) {
    console.error("POST /api/newsletter error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process subscription" },
      { status: 500 }
    );
  }
}