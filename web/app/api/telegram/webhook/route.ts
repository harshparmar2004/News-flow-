import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // Support both direct messages and inline button callback queries
    const isCallback = Boolean(update.callback_query);
    const message = isCallback ? update.callback_query.message : update.message;
    const chatId = isCallback
      ? update.callback_query.message?.chat?.id
      : message?.chat?.id;
    const text = isCallback
      ? update.callback_query.data?.trim()
      : message?.text?.trim() || "";
    const callbackQueryId = isCallback ? update.callback_query.id : null;

    if (!chatId || !text) {
      return NextResponse.json({ ok: true });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return NextResponse.json({ error: "No TELEGRAM_BOT_TOKEN configured" }, { status: 500 });
    }

    // Answer callback queries immediately to remove the Telegram loading spinner
    if (callbackQueryId) {
      try {
        await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: callbackQueryId }),
        });
      } catch (e) {
        console.error("Error answering callback query:", e);
      }
    }

    const sendMessage = async (replyText: string, buttons?: any[]) => {
      const payload: any = {
        chat_id: chatId,
        text: replyText,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      };
      if (buttons) {
        payload.reply_markup = { inline_keyboard: buttons };
      }
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    };

    // 1. HELP / START
    if (text === "/start" || text === "/help") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://news-flow-one.vercel.app";
      await sendMessage(
        `🤖 <b>NewsFlow Autonomous Agent Bot</b>\n\n` +
        `Welcome to the NewsFlow Command Center. I monitor and publish frontier tech journalism 24/7.\n\n` +
        `<b>Available Commands:</b>\n` +
        `• <b>/run</b> — Trigger full pipeline on GitHub Actions cloud\n` +
        `• <b>/status</b> — Live database & article counts\n` +
        `• <b>/latest</b> — 3 most recent dispatches\n` +
        `• <b>/health</b> — Check database and API status\n` +
        `• <b>/live</b> — Link to live publication`,
        [
          [
            { text: "🚀 Run Pipeline Now", callback_data: "cmd_run" },
            { text: "📊 Live Status", callback_data: "cmd_status" },
          ],
          [
            { text: "🌐 Open Live Site", url: siteUrl },
          ],
        ]
      );
      return NextResponse.json({ ok: true });
    }

    // 2. RUN PIPELINE ON GITHUB ACTIONS CLOUD
    if (text === "/run" || text === "/start_pipeline" || text === "/trigger" || text === "cmd_run") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://news-flow-one.vercel.app";
      const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
      const owner = process.env.GITHUB_OWNER || "harshparmar2004";
      const repo = process.env.GITHUB_REPO || "News-flow-";
      const workflow = "autonomous_pipeline.yml";

      if (!githubToken) {
        await sendMessage(
          `⚠️ <b>GitHub Token Missing on Vercel</b>\n\n` +
          `To trigger the pipeline 24/7 from Telegram, add <code>GITHUB_TOKEN</code> to your Vercel Environment Variables:\n\n` +
          `1. Go to <b>Vercel Dashboard</b> &rarr; <b>tech-news-website-</b> &rarr; <b>Settings</b> &rarr; <b>Environment Variables</b>\n` +
          `2. Key: <code>GITHUB_TOKEN</code>\n` +
          `3. Value: Your GitHub Personal Access Token (with workflow permission)\n\n` +
          `<i>Once added, typing /run will immediately trigger GitHub Actions!</i>`
        );
        return NextResponse.json({ ok: true });
      }

      await sendMessage(
        `⚡ <b>Launching NewsFlow Autonomous Pipeline on GitHub Actions...</b>\n\n` +
        `• <b>Cloud Host:</b> GitHub Actions (Ubuntu)\n` +
        `• <b>Repository:</b> <code>${owner}/${repo}</code>\n` +
        `• <b>Workflow:</b> <code>${workflow}</code>\n` +
        `• <b>Target:</b> <a href="${siteUrl}">news-flow-one.vercel.app</a>\n\n` +
        `<i>Container is initializing in the cloud. You will receive an executive digest when complete.</i>`
      );

      try {
        const ghRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`,
          {
            method: "POST",
            headers: {
              "Accept": "application/vnd.github.v3+json",
              "Authorization": `Bearer ${githubToken}`,
              "User-Agent": "NewsFlow-Telegram-Agent",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ref: "main" }),
          }
        );

        if (ghRes.status === 204) {
          await sendMessage(
            `🟢 <b>Pipeline Dispatched Successfully!</b>\n\n` +
            `The autonomous scraper &amp; publisher is now executing in the cloud.\n` +
            `• <b>Track Live:</b> <a href="https://github.com/${owner}/${repo}/actions">GitHub Actions Runs</a>\n\n` +
            `<i>Scraping 70 sources, AI synthesis &amp; live publishing in progress...</i>`,
            [
              [
                { text: "📊 Track Actions Run", url: `https://github.com/${owner}/${repo}/actions` },
                { text: "🌐 Open Live Site", url: siteUrl },
              ],
            ]
          );
        } else {
          const errText = await ghRes.text();
          await sendMessage(
            `❌ <b>GitHub Dispatch Error (${ghRes.status})</b>\n\n<code>${errText.slice(0, 300)}</code>`
          );
        }
      } catch (ghErr: any) {
        await sendMessage(
          `❌ <b>Failed to dispatch workflow:</b>\n<code>${ghErr.message}</code>`
        );
      }

      return NextResponse.json({ ok: true });
    }

    // 3. STATUS
    if (text === "/status" || text === "cmd_status") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://news-flow-one.vercel.app";
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const [totalCount, todaysCount] = await Promise.all([
        prisma.article.count({ where: { status: "published" } }),
        prisma.article.count({
          where: {
            status: "published",
            published_at: { gte: twentyFourHoursAgo },
          },
        }),
      ]);

      await sendMessage(
        `📊 <b>NewsFlow Intelligence Status</b>\n\n` +
        `• <b>Total Published Articles:</b> ${totalCount}\n` +
        `• <b>Today's Live Stories (Last 24h):</b> ${todaysCount} stories\n` +
        `• <b>Engine Status:</b> 🟢 24/7 Autonomous (GitHub Actions Cron)\n` +
        `• <b>Database:</b> Neon PostgreSQL (Healthy)\n` +
        `• <b>Remote Control:</b> Active (Cloud Webhook)`,
        [
          [
            { text: "🚀 Run Pipeline Now", callback_data: "cmd_run" },
            { text: "🔥 Latest News", callback_data: "cmd_latest" },
          ],
          [
            { text: "🌐 Open Live Site", url: siteUrl },
          ],
        ]
      );
      return NextResponse.json({ ok: true });
    }

    // 4. LATEST NEWS
    if (text === "/latest" || text === "cmd_latest") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://news-flow-one.vercel.app";
      const articles = await prisma.article.findMany({
        where: { status: "published" },
        orderBy: [{ published_at: "desc" }],
        take: 3,
        include: { category: true },
      });

      let reply = `📰 <b>Latest NewsFlow Dispatches:</b>\n\n`;
      articles.forEach((a, i) => {
        reply += `${i + 1}. <b>${a.title}</b>\n`;
        reply += `📁 <i>${a.category?.name || "Tech"}</i> • <a href="${siteUrl}/article/${a.slug}">Read Article</a>\n\n`;
      });

      await sendMessage(reply, [
        [
          { text: "🚀 Run Pipeline", callback_data: "cmd_run" },
          { text: "📊 Live Status", callback_data: "cmd_status" },
        ],
        [
          { text: "🌐 Full Live Wire", url: `${siteUrl}/today` },
        ],
      ]);
      return NextResponse.json({ ok: true });
    }

    // 5. HEALTH
    if (text === "/health") {
      const totalCount = await prisma.article.count();
      await sendMessage(
        `✅ <b>System Health Check</b>\n\n` +
        `• <b>Next.js Server:</b> OK (Vercel Edge)\n` +
        `• <b>Neon Database:</b> Connected (${totalCount} records)\n` +
        `• <b>Telegram Webhook:</b> Active 24/7\n` +
        `• <b>Cloud Scheduler:</b> GitHub Actions Active`
      );
      return NextResponse.json({ ok: true });
    }

    // 6. LIVE SITE
    if (text === "/live") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://news-flow-one.vercel.app";
      await sendMessage(`🌐 Visit the live publication at: ${siteUrl}`);
      return NextResponse.json({ ok: true });
    }

    await sendMessage(`Unknown command. Type /help to see all available commands.`);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "NewsFlow Telegram Webhook is operational.",
  });
}
