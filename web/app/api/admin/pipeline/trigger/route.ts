import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

// Persistent state tracker file in newsflow-web directory
const STATUS_FILE = path.resolve(process.cwd(), "pipeline_status.json");

interface PipelineStatusData {
  status: "idle" | "running";
  last_run: string | null;
  last_message: string;
  duration_seconds?: number;
}

function getStoredStatus(): PipelineStatusData {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      return JSON.parse(fs.readFileSync(STATUS_FILE, "utf-8"));
    }
  } catch {}
  return {
    status: "idle",
    last_run: null,
    last_message: "Pipeline ready for on-demand trigger",
  };
}

function saveStatus(data: PipelineStatusData) {
  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

export async function GET(req: NextRequest) {
  const session = await verifyAdminSession();
  const authHeader = req.headers.get("x-api-key");
  const isValidApiKey = authHeader && authHeader === process.env.NEWSFLOW_API_KEY;

  if (!session && !isValidApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const current = getStoredStatus();
  return NextResponse.json({ success: true, ...current });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  const authHeader = req.headers.get("x-api-key");
  const isValidApiKey = authHeader && authHeader === process.env.NEWSFLOW_API_KEY;

  if (!session && !isValidApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const current = getStoredStatus();
  if (current.status === "running") {
    return NextResponse.json(
      { success: false, error: "A pipeline cycle is already executing." },
      { status: 409 }
    );
  }

  // Resolve news-auto-pipeline directory
  const pipelineDir = path.resolve(process.cwd(), "../news-auto-pipeline");
  const runPyPath = path.join(pipelineDir, "run.py");

  if (!fs.existsSync(runPyPath)) {
    return NextResponse.json(
      { error: `Pipeline script not found at ${runPyPath}` },
      { status: 404 }
    );
  }

  const startedAt = new Date().toISOString();
  saveStatus({
    status: "running",
    last_run: startedAt,
    last_message: "Autonomous ingestion cycle executing...",
  });

  // Spawn python run.py (all sources) asynchronously, logging to news-auto-pipeline/logs/admin_trigger.log
  try {
    const pythonExe = process.platform === "win32" ? "python" : "python3";
    const logDir = path.join(pipelineDir, "logs");
    fs.mkdirSync(logDir, { recursive: true });
    const logFd = fs.openSync(path.join(logDir, "admin_trigger.log"), "a");
    fs.writeSync(logFd, `\n===== Run started ${startedAt} (via NewsFlow Admin) =====\n`);

    const args = ["run.py"];
    if (process.env.NEWSFLOW_RUN_MAX_ARTICLES) {
      args.push("--max-articles", process.env.NEWSFLOW_RUN_MAX_ARTICLES);
    }
    const child = spawn(pythonExe, args, {
      cwd: pipelineDir,
      detached: true,
      stdio: ["ignore", logFd, logFd],
    });

    child.unref();

    // Monitor completion asynchronously in background
    const startTime = Date.now();
    child.on("exit", (code) => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      saveStatus({
        status: "idle",
        last_run: new Date().toISOString(),
        last_message:
          code === 0
            ? `Pipeline completed successfully (${elapsed}s elapsed)`
            : `Pipeline exited with code ${code} (${elapsed}s elapsed)`,
        duration_seconds: elapsed,
      });
    });

    return NextResponse.json({
      success: true,
      message: "Pipeline ingest cycle triggered successfully.",
      status: "running",
      started_at: startedAt,
    });
  } catch (err: any) {
    saveStatus({
      status: "idle",
      last_run: startedAt,
      last_message: `Failed to spawn pipeline: ${err.message}`,
    });
    return NextResponse.json(
      { error: `Failed to spawn pipeline: ${err.message}` },
      { status: 500 }
    );
  }
}
