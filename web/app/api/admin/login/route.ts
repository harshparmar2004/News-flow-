import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminPassword, createAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { password, username = "admin" } = await req.json();

    if (!password) {
      return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 });
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ success: false, error: "Invalid admin password" }, { status: 401 });
    }

    const token = await createAdminToken(username);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      success: true,
      message: "Admin authentication successful",
    });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}