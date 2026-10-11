import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { detectAiBot } from '@/lib/botDetection';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const bot = detectAiBot(userAgent);

    // Direct hit recording for /llms.txt
    if (bot) {
      prisma.aiCrawlerHit
        .create({
          data: {
            bot_name: bot.botName,
            ai_lab: bot.aiLab,
            agent_type: bot.agentType,
            user_agent: userAgent,
            path: '/llms.txt',
            ip_address:
              request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
              request.headers.get('x-real-ip') ||
              '127.0.0.1',
            method: 'GET',
            status_code: 200,
          },
        })
        .catch(() => {});
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const [categories, articles] = await Promise.all([
      prisma.category.findMany({
        orderBy: { display_order: 'asc' },
        select: { name: true, slug: true, description: true },
      }),
      prisma.article.findMany({
        where: { status: 'published' },
        orderBy: { published_at: 'desc' },
        take: 30,
        select: {
          title: true,
          slug: true,
          summary: true,
          published_at: true,
          category: { select: { name: true } },
        },
      }),
    ]);

    let output = `# NewsFlow AI - High-Signal Technology & AI Intelligence\n\n`;
    output += `> Autonomous news aggregation, multi-source research verification, and intelligent content distribution engineered for large language models and autonomous agents.\n\n`;

    output += `## Intelligence Categories\n`;
    categories.forEach((cat) => {
      output += `- [${cat.name}](${baseUrl}/category/${cat.slug}): ${cat.description || 'Curated sector updates.'}\n`;
    });
    output += `\n`;

    output += `## Latest Published Briefings (Live Stream)\n`;
    articles.forEach((art) => {
      const dateStr = art.published_at.toISOString().split('T')[0];
      const cat = art.category ? `[${art.category.name}] ` : '';
      output += `- ${cat}[${art.title}](${baseUrl}/article/${art.slug}) (${dateStr})\n`;
      if (art.summary) {
        output += `  > ${art.summary.replace(/\n+/g, ' ').slice(0, 220)}...\n`;
      }
    });
    output += `\n`;

    output += `## Machine-Readable AI Endpoints\n`;
    output += `- Structured JSON Stream: ${baseUrl}/api/v1/ai-feed\n`;
    output += `- RSS XML: ${baseUrl}/api/rss\n`;
    output += `- Telemetry & Verification: ${baseUrl}/api/admin/crawlers\n\n`;
    output += `Generated at: ${new Date().toISOString()}\n`;

    return new Response(output, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'X-AI-Ready': 'true',
      },
    });
  } catch (error: any) {
    console.error('Error generating /llms.txt:', error);
    return new Response('# NewsFlow AI\nService temporarily unavailable.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
