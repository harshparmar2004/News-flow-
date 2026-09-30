import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

function maskApiKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return "••••••••";
  return key.substring(0, 4) + "••••••••" + key.substring(key.length - 4);
}

function updateEnvFile(filePath: string, keyName: string, value: string) {
  try {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf-8");
    const regex = new RegExp(`^${keyName}=.*$`, "m");
    if (regex.test(content)) {
      content = content.replace(regex, `${keyName}="${value}"`);
    } else {
      content += `\n${keyName}="${value}"\n`;
    }
    fs.writeFileSync(filePath, content, "utf-8");
  } catch (err) {
    console.error(`Failed to update env file at ${filePath}:`, err);
  }
}

export async function GET(req: NextRequest) {
  const session = await verifyAdminSession();
  const authHeader = req.headers.get("x-api-key");
  const isValidApiKey = authHeader && authHeader === process.env.NEWSFLOW_API_KEY;

  if (!session && !isValidApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [keySetting, enabledSetting, minImpactSetting, autoFeatureSetting] = await Promise.all([
      prisma.systemSetting.findUnique({ where: { key: "TYPESAFE_JEV_API_KEY" } }),
      prisma.systemSetting.findUnique({ where: { key: "JEV_ENABLED" } }),
      prisma.systemSetting.findUnique({ where: { key: "JEV_MIN_IMPACT_SCORE" } }),
      prisma.systemSetting.findUnique({ where: { key: "JEV_AUTO_FEATURE_SCORE" } }),
    ]);

    const rawKey = keySetting?.value || process.env.TYPESAFE_API_KEY || "";
    const enabled = enabledSetting ? enabledSetting.value === "true" : Boolean(rawKey);
    const minImpactScore = minImpactSetting ? parseFloat(minImpactSetting.value) : 7.0;
    const autoFeatureScore = autoFeatureSetting ? parseFloat(autoFeatureSetting.value) : 8.5;

    return NextResponse.json({
      has_key: Boolean(rawKey),
      masked_key: maskApiKey(rawKey),
      enabled,
      min_impact_score: minImpactScore,
      auto_feature_score: autoFeatureScore,
    });
  } catch (error) {
    console.error("Error reading Jev settings:", error);
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
    const { apiKey, enabled, min_impact_score, auto_feature_score } = body;

    const updates: Promise<any>[] = [];

    let activeKey = apiKey;

    if (apiKey !== undefined && apiKey !== null && apiKey.trim() !== "") {
      const cleanKey = apiKey.trim();
      activeKey = cleanKey;
      updates.push(
        prisma.systemSetting.upsert({
          where: { key: "TYPESAFE_JEV_API_KEY" },
          update: { value: cleanKey },
          create: { key: "TYPESAFE_JEV_API_KEY", value: cleanKey },
        })
      );

      // Keep process.env updated in current runtime
      process.env.TYPESAFE_API_KEY = cleanKey;

      // Sync to newsflow-web/.env
      const webEnvPath = path.resolve(process.cwd(), ".env");
      updateEnvFile(webEnvPath, "TYPESAFE_API_KEY", cleanKey);

      // Sync to news-auto-pipeline/.env
      const pipelineEnvPath = path.resolve(process.cwd(), "../news-auto-pipeline/.env");
      updateEnvFile(pipelineEnvPath, "TYPESAFE_API_KEY", cleanKey);
    }

    if (enabled !== undefined) {
      updates.push(
        prisma.systemSetting.upsert({
          where: { key: "JEV_ENABLED" },
          update: { value: String(enabled) },
          create: { key: "JEV_ENABLED", value: String(enabled) },
        })
      );
    }

    if (min_impact_score !== undefined) {
      updates.push(
        prisma.systemSetting.upsert({
          where: { key: "JEV_MIN_IMPACT_SCORE" },
          update: { value: String(min_impact_score) },
          create: { key: "JEV_MIN_IMPACT_SCORE", value: String(min_impact_score) },
        })
      );
    }

    if (auto_feature_score !== undefined) {
      updates.push(
        prisma.systemSetting.upsert({
          where: { key: "JEV_AUTO_FEATURE_SCORE" },
          update: { value: String(auto_feature_score) },
          create: { key: "JEV_AUTO_FEATURE_SCORE", value: String(auto_feature_score) },
        })
      );
    }

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: "TypeSafe Jev API configuration successfully saved and activated.",
      masked_key: activeKey ? maskApiKey(activeKey) : undefined,
    });
  } catch (error) {
    console.error("Error saving Jev settings:", error);
    return NextResponse.json({ error: "Failed to save Jev settings" }, { status: 500 });
  }
}
