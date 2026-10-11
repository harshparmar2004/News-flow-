import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const now = new Date();
    const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const past7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalHits, hits24h, hits7d, labBreakdown, botBreakdown, recentHitsRaw] = await Promise.all([
      prisma.aiCrawlerHit.count(),
      prisma.aiCrawlerHit.count({ where: { created_at: { gte: past24h } } }),
      prisma.aiCrawlerHit.count({ where: { created_at: { gte: past7d } } }),
      prisma.aiCrawlerHit.groupBy({
        by: ['ai_lab'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      prisma.aiCrawlerHit.groupBy({
        by: ['bot_name'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      prisma.aiCrawlerHit.findMany({
        take: 50,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    // Fetch referenced articles to enrich recent hits and top articles
    const articleIds = Array.from(
      new Set(recentHitsRaw.map((h) => h.article_id).filter((id): id is string => Boolean(id)))
    );

    const articles = await prisma.article.findMany({
      where: { id: { in: articleIds } },
      select: {
        id: true,
        title: true,
        slug: true,
        category: { select: { name: true } },
      },
    });

    const articleMap = new Map(articles.map((a) => [a.id, a]));

    const recentHits = recentHitsRaw.map((hit) => {
      const art = hit.article_id ? articleMap.get(hit.article_id) : null;
      return {
        ...hit,
        article_title: art ? art.title : null,
        article_slug: art ? art.slug : null,
        category_name: art?.category ? art.category.name : null,
      };
    });

    // Top crawled paths
    const topPathsRaw = await prisma.aiCrawlerHit.groupBy({
      by: ['path'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 8,
    });

    return NextResponse.json({
      summary: {
        totalHits,
        hits24h,
        hits7d,
        uniqueBots: botBreakdown.length,
        uniqueLabs: labBreakdown.length,
      },
      labs: labBreakdown.map((l) => ({ lab: l.ai_lab, count: l._count.id })),
      bots: botBreakdown.map((b) => ({ bot: b.bot_name, count: b._count.id })),
      topPaths: topPathsRaw.map((p) => ({ path: p.path, count: p._count.id })),
      recentHits,
    });
  } catch (error: any) {
    console.error('Error fetching crawler telemetry:', error);
    return NextResponse.json({ error: error?.message || 'Internal error' }, { status: 500 });
  }
}

// POST endpoint for simulating AI Crawler traffic (for testing and verification)
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const botChoice = body.bot || 'random';

    const BOT_PRESETS = [
      {
        bot_name: 'GPTBot',
        ai_lab: 'OpenAI',
        agent_type: 'LLM Training Crawler',
        user_agent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)',
      },
      {
        bot_name: 'ClaudeBot',
        ai_lab: 'Anthropic',
        agent_type: 'Claude Training Crawler',
        user_agent: 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
      },
      {
        bot_name: 'PerplexityBot',
        ai_lab: 'Perplexity',
        agent_type: 'Real-Time Search Agent',
        user_agent: 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
      },
      {
        bot_name: 'Google-Extended',
        ai_lab: 'Google',
        agent_type: 'Gemini / Vertex AI Crawler',
        user_agent: 'Mozilla/5.0 (compatible; Google-Extended)',
      },
      {
        bot_name: 'Meta-ExternalAgent',
        ai_lab: 'Meta',
        agent_type: 'Llama AI Crawler',
        user_agent: 'Mozilla/5.0 (compatible; Meta-ExternalAgent/1.1; +https://developers.facebook.com/docs/sharing/webmasters/crawler)',
      },
      {
        bot_name: 'Bytespider',
        ai_lab: 'ByteDance',
        agent_type: 'Doubao / TikTok AI Crawler',
        user_agent: 'Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider)',
      },
    ];

    let selectedPreset = BOT_PRESETS[0];
    if (botChoice === 'random') {
      selectedPreset = BOT_PRESETS[Math.floor(Math.random() * BOT_PRESETS.length)];
    } else {
      const found = BOT_PRESETS.find((p) => p.bot_name.toLowerCase().includes(botChoice.toLowerCase()));
      if (found) selectedPreset = found;
    }

    // Pick a random published article or /llms.txt
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      take: 20,
      select: { id: true, slug: true, title: true },
    });

    let targetPath = '/llms.txt';
    let targetArticleId: string | null = null;

    if (articles.length > 0 && Math.random() > 0.25) {
      const randomArticle = articles[Math.floor(Math.random() * articles.length)];
      targetPath = `/article/${randomArticle.slug}`;
      targetArticleId = randomArticle.id;
    } else if (Math.random() > 0.5) {
      targetPath = '/api/v1/ai-feed';
    }

    const randomIps = [
      '20.171.206.124', // Microsoft/OpenAI Azure
      '54.210.12.98',   // AWS (Anthropic)
      '35.247.78.112',  // GCP
      '157.240.241.35', // Meta
      '198.51.100.42',
    ];
    const ip = randomIps[Math.floor(Math.random() * randomIps.length)];

    const hit = await prisma.aiCrawlerHit.create({
      data: {
        bot_name: selectedPreset.bot_name,
        ai_lab: selectedPreset.ai_lab,
        agent_type: selectedPreset.agent_type,
        user_agent: selectedPreset.user_agent,
        path: targetPath,
        article_id: targetArticleId,
        ip_address: ip,
        method: 'GET',
        status_code: 200,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Simulated visit by ${selectedPreset.bot_name} (${selectedPreset.ai_lab}) on ${targetPath}`,
      hit,
    });
  } catch (error: any) {
    console.error('Error simulating crawler hit:', error);
    return NextResponse.json({ error: error?.message || 'Simulation failed' }, { status: 500 });
  }
}
