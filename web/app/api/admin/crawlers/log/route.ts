import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      bot_name,
      ai_lab,
      agent_type,
      user_agent,
      path,
      ip_address,
      method = 'GET',
      status_code = 200,
    } = data;

    if (!bot_name || !path) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Try to find article_id if path is /article/[slug]
    let article_id: string | null = null;
    const match = path.match(/^\/article\/([^/?#]+)/);
    if (match && match[1]) {
      const slug = decodeURIComponent(match[1]);
      const article = await prisma.article.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (article) {
        article_id = article.id;
      }
    }

    const hit = await prisma.aiCrawlerHit.create({
      data: {
        bot_name: String(bot_name),
        ai_lab: String(ai_lab || 'Independent'),
        agent_type: String(agent_type || 'Automated Crawler'),
        user_agent: String(user_agent || ''),
        path: String(path),
        article_id,
        ip_address: ip_address ? String(ip_address) : '127.0.0.1',
        method: String(method),
        status_code: Number(status_code) || 200,
      },
    });

    return NextResponse.json({ success: true, hitId: hit.id }, { status: 201 });
  } catch (error: any) {
    console.error('Error logging crawler hit:', error);
    return NextResponse.json({ error: error?.message || 'Internal error' }, { status: 500 });
  }
}
