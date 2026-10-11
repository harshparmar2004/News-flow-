import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { detectAiBot } from '@/lib/botDetection';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const bot = detectAiBot(userAgent);

    // Track crawler hit directly
    if (bot) {
      prisma.aiCrawlerHit
        .create({
          data: {
            bot_name: bot.botName,
            ai_lab: bot.aiLab,
            agent_type: bot.agentType,
            user_agent: userAgent,
            path: '/api/v1/ai-feed',
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

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);
    const categorySlug = searchParams.get('category');

    const where: any = { status: 'published' };
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { published_at: 'desc' },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        body: true,
        cover_image_url: true,
        author: true,
        rank_score: true,
        reading_time_minutes: true,
        source_url: true,
        published_at: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const items = articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      url: `${baseUrl}/article/${a.slug}`,
      category: a.category?.name || 'General Tech',
      category_slug: a.category?.slug || 'tech',
      published_at: a.published_at.toISOString(),
      summary: a.summary,
      markdown_content: a.body,
      signal_score: a.rank_score,
      reading_time_minutes: a.reading_time_minutes,
      author: a.author,
      source_citation: a.source_url,
      cover_image: a.cover_image_url,
    }));

    return NextResponse.json(
      {
        feed_name: 'NewsFlow AI High-Signal Intelligence Feed',
        version: '1.0.0',
        generated_at: new Date().toISOString(),
        total_items: items.length,
        crawler_detected: bot ? bot.botName : false,
        documentation: `${baseUrl}/llms.txt`,
        items,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=120, s-maxage=120',
          'X-AI-Engine': 'NewsFlow-Agentic',
        },
      }
    );
  } catch (error: any) {
    console.error('Error generating AI feed:', error);
    return NextResponse.json({ error: error?.message || 'Internal error' }, { status: 500 });
  }
}
