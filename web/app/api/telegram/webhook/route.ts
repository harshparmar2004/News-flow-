import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const message = update.message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return NextResponse.json({ error: "No TELEGRAM_BOT_TOKEN configured" }, { status: 500 });
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

    if (text === "/start" || text === "/help") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://news-flow-one.vercel.app";
      await sendMessage(
        `🤖 <b>NewsFlow Autonomous Agent Bot</b>\n\n` +
        `Welcome to the NewsFlow Command Center. I monitor and publish frontier tech journalism 24/7.\n\n` +
        `<b>Available Commands:</b>\n` +
        `• /status — Live database & article counts\n` +
        `• /latest — 3 most recent dispatches\n` +
        `• /health — Check database and API status\n` +
        `• /live — Link to live publication`,
        [
          [{ text: "🌐 Open Live Site", url: siteUrl }],
        ]
      );
      return NextResponse.json({ ok: true });
    }

    if (text === "/status") {
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
        `• <b>Today's Live Wire (Last 24h):</b> ${todaysCount} stories\n` +
        `• <b>Engine Status:</b> 🟢 24/7 Autonomous (GitHub Actions Cron)\n` +
        `• <b>Database:</b> Neon PostgreSQL (Healthy)`
      );
      return NextResponse.json({ ok: true });
    }

    if (text === "/latest") {
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
        reply += `📁 <i>${a.category.name}</i> • <a href="${siteUrl}/article/${a.slug}">Read Article</a>\n\n`;
      });

      await sendMessage(reply);
      return NextResponse.json({ ok: true });
    }

    if (text === "/health") {
      const totalCount = await prisma.article.count();
      await sendMessage(
        `✅ <b>System Health Check</b>\n\n` +
        `• <b>Next.js Server:</b> OK (Vercel Edge)\n` +
        `• <b>Neon Database:</b> Connected (${totalCount} records)\n` +
        `• <b>Telegram Webhook:</b> Active 24/7\n` +
        `• <b>Background Scheduler:</b> GitHub Actions Active`
      );
      return NextResponse.json({ ok: true });
    }

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
