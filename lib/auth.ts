import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "default_newsflow_secret_key_needs_32_chars_min"
);

const API_KEY = process.env.NEWSFLOW_API_KEY || "nf_live_sec_9942a8b7e1034f68a";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin_newsflow_secret_2026";

export interface AdminSession {
  role: "admin";
  username: string;
}

/**
 * Validates agent API key from headers
 */
export async function verifyApiKey(request?: NextRequest): Promise<boolean> {
  let key: string | null = null;
  if (request) {
    key =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      null;
  } else {
    const reqHeaders = await headers();
    key =
      reqHeaders.get("x-api-key") ||
      reqHeaders.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      null;
  }

  if (!key) return false;
  return key === API_KEY;
}

/**
 * Creates an admin session JWT
 */
export async function createAdminToken(username: string = "admin"): Promise<string> {
  return await new SignJWT({ role: "admin", username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verifies admin session from cookie
 */
export async function verifyAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role === "admin") {
      return { role: "admin", username: (payload.username as string) || "admin" };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Verifies if password matches admin password
 */
export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}