import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  if (!segments || segments.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Sanitize path segments to prevent directory traversal
  const safeSegments = segments.map((s) => path.basename(s));
  const relativePath = path.join(...safeSegments);

  // 1. Check in newsflow-web/public/images/
  const publicPath = path.join(process.cwd(), "public", "images", relativePath);

  // 2. Fallback: Check in news-auto-pipeline/images/
  const pipelinePath = path.join(
    process.cwd(),
    "..",
    "news-auto-pipeline",
    "images",
    relativePath
  );

  let targetFile: string | null = null;
  if (fs.existsSync(publicPath)) {
    targetFile = publicPath;
  } else if (fs.existsSync(pipelinePath)) {
    targetFile = pipelinePath;
  }

  if (!targetFile) {
    return new NextResponse("Image Not Found", { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(targetFile);
    const ext = path.extname(targetFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    return new NextResponse("Error reading image", { status: 500 });
  }
}
