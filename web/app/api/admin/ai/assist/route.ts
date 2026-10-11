import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

// Attempt to read keys from local .env or sibling pipeline .env
function getApiKey(): { gemini?: string; groq?: string } {
  let gemini = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  let groq = process.env.GROQ_API_KEY;

  if (!gemini || !groq) {
    try {
      const pipelineEnvPath = path.resolve(process.cwd(), "../news-auto-pipeline/.env");
      if (fs.existsSync(pipelineEnvPath)) {
        const content = fs.readFileSync(pipelineEnvPath, "utf-8");
        content.split("\n").forEach((line) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("GOOGLE_API_KEY=")) {
            gemini = gemini || trimmed.replace("GOOGLE_API_KEY=", "").replace(/['"]/g, "").trim();
          }
          if (trimmed.startsWith("GROQ_API_KEY=")) {
            groq = groq || trimmed.replace("GROQ_API_KEY=", "").replace(/['"]/g, "").trim();
          }
        });
      }
    } catch {}
  }

  return { gemini, groq };
}

function generateHeuristicSuggestions(prompt: string, mode: string, category?: string): string[] {
  const clean = prompt.replace(/[^\w\s-]/g, "").trim() || "Artificial Intelligence Breakthrough";
  const cat = category || "Tech & Innovation";

  if (mode === "headline") {
    return [
      `Behind the Breakthrough: How ${clean} Is Reshaping ${cat}`,
      `Exclusive: Inside the Rapid Acceleration of ${clean}`,
      `The Paradigm Shift: Why ${clean} Matters for the Next Decade of Computing`,
      `${clean}: Key Implications for Enterprise Systems and DeepTech`,
      `Critical Milestone: What Engineers and Researchers Need to Know About ${clean}`,
    ];
  }

  if (mode === "hook") {
    return [
      `A pivotal advance in ${cat.toLowerCase()}: ${clean.toLowerCase()} signals a decisive leap toward autonomous, resilient architectures that rethink foundation limits.`,
      `In a defining development for the sector, recent findings around ${clean.toLowerCase()} highlight unexpected compounding efficiencies across production infrastructure.`,
      `Researchers and industry practitioners are taking note as ${clean.toLowerCase()} crosses key operational benchmarks, altering roadmap projections for 2026 and beyond.`,
      `Beyond the marketing noise, the structural breakthrough behind ${clean.toLowerCase()} demonstrates verifiable gains in throughput, safety, and systemic coherence.`,
      `As compute demands escalate, new architectural paradigms around ${clean.toLowerCase()} offer a high-signal roadmap for sustainable technical scaling.`,
    ];
  }

  if (mode === "tags") {
    const words = clean.split(/\s+/).filter((w) => w.length > 3);
    const set = new Set([
      cat.replace(/\s+/g, ""),
      "DeepTech",
      "FrontierTech",
      "Automation",
      ...words.slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
    ]);
    return Array.from(set).slice(0, 5);
  }

  // SEO Description
  return [
    `Complete analysis of ${clean} in ${cat}. Discover architecture benchmarks, engineering trade-offs, and strategic market implications from NewsFlow.`,
    `High-signal report on ${clean}. Explore why foundation models, enterprise infrastructure, and researchers are pivoting toward this new paradigm.`,
    `Technical breakdown: How ${clean} is transforming ${cat.toLowerCase()} with measured impact scores and deep architectural insights.`,
  ];
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
    const { prompt = "", mode = "headline", category = "Artificial Intelligence" } = body;

    const { gemini, groq } = getApiKey();

    // 1. Try Groq if available
    if (groq && groq.startsWith("gsk_")) {
      try {
        const sysPrompt =
          mode === "headline"
            ? "You are an elite technology executive news editor at Bloomberg / The Information. Return exactly 5 punchy, high-signal, non-clickbait, authoritative headlines for this topic. Separate each headline with a newline. No numbering, no markdown bullets."
            : mode === "hook"
            ? "You are a tech journalist. Return 4 concise, high-impact 1-line executive summaries (hooks) for this story. Separate each with a newline. No numbering."
            : mode === "tags"
            ? "Return 6 single-word relevant technical tags for this article, comma-separated."
            : "Return 3 concise SEO meta descriptions under 155 characters each, separated by a newline.";

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groq}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: sysPrompt },
              { role: "user", content: `Topic: ${prompt}\nCategory: ${category}` },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || "";
          if (mode === "tags") {
            const tags = content
              .split(",")
              .map((t: string) => t.trim().replace(/^#/, ""))
              .filter(Boolean);
            if (tags.length > 0) return NextResponse.json({ success: true, suggestions: tags, source: "groq" });
          } else {
            const lines = content
              .split("\n")
              .map((l: string) => l.replace(/^[\d\-*.•\s]+/, "").trim())
              .filter((l: string) => l.length > 10);
            if (lines.length > 0) return NextResponse.json({ success: true, suggestions: lines, source: "groq" });
          }
        }
      } catch (err) {
        console.warn("Groq copilot call fallback:", err);
      }
    }

    // 2. Try Gemini if available
    if (gemini) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${gemini}`;
        const instruction =
          mode === "headline"
            ? "Provide 5 authoritative, high-signal, non-spam tech news headlines for this story. Return one per line, no bullets."
            : "Provide 4 concise 1-2 sentence executive hooks for this story. Return one per line, no bullets.";

        const gRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${instruction}\nTopic: ${prompt}\nDesk: ${category}` }] }],
          }),
        });

        if (gRes.ok) {
          const gData = await gRes.json();
          const text = gData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const lines = text
            .split("\n")
            .map((l: string) => l.replace(/^[\d\-*.•\s]+/, "").trim())
            .filter((l: string) => l.length > 10);
          if (lines.length > 0) return NextResponse.json({ success: true, suggestions: lines, source: "gemini" });
        }
      } catch (err) {
        console.warn("Gemini copilot call fallback:", err);
      }
    }

    // 3. Fallback to calibrated journalistic suggestions
    const suggestions = generateHeuristicSuggestions(prompt, mode, category);
    return NextResponse.json({ success: true, suggestions, source: "editorial_heuristic" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate assist suggestions" }, { status: 500 });
  }
}
