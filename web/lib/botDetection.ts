export interface BotInfo {
  botName: string;
  aiLab: string;
  agentType: string;
  badgeColor: string; // Hex color code
  badgeBg: string;    // Tailwind background class
  badgeText: string;  // Tailwind text class
}

interface BotPattern {
  regex: RegExp;
  info: BotInfo;
}

const AI_BOT_PATTERNS: BotPattern[] = [
  // OpenAI
  {
    regex: /GPTBot/i,
    info: {
      botName: 'GPTBot',
      aiLab: 'OpenAI',
      agentType: 'LLM Training Crawler',
      badgeColor: '#10A37F',
      badgeBg: 'bg-emerald-950/40 border-emerald-500/30',
      badgeText: 'text-emerald-400',
    },
  },
  {
    regex: /ChatGPT-User/i,
    info: {
      botName: 'ChatGPT-User',
      aiLab: 'OpenAI',
      agentType: 'Real-Time Search Agent',
      badgeColor: '#10A37F',
      badgeBg: 'bg-emerald-950/40 border-emerald-500/30',
      badgeText: 'text-emerald-400',
    },
  },
  {
    regex: /OAI-SearchBot/i,
    info: {
      botName: 'OAI-SearchBot',
      aiLab: 'OpenAI',
      agentType: 'SearchGPT Crawler',
      badgeColor: '#10A37F',
      badgeBg: 'bg-emerald-950/40 border-emerald-500/30',
      badgeText: 'text-emerald-400',
    },
  },

  // Anthropic
  {
    regex: /ClaudeBot/i,
    info: {
      botName: 'ClaudeBot',
      aiLab: 'Anthropic',
      agentType: 'Claude Training Crawler',
      badgeColor: '#D97706',
      badgeBg: 'bg-amber-950/40 border-amber-500/30',
      badgeText: 'text-amber-400',
    },
  },
  {
    regex: /Claude-Web/i,
    info: {
      botName: 'Claude-Web',
      aiLab: 'Anthropic',
      agentType: 'Claude Live Web Agent',
      badgeColor: '#D97706',
      badgeBg: 'bg-amber-950/40 border-amber-500/30',
      badgeText: 'text-amber-400',
    },
  },
  {
    regex: /anthropic-ai/i,
    info: {
      botName: 'Anthropic-AI',
      aiLab: 'Anthropic',
      agentType: 'Anthropic Research Agent',
      badgeColor: '#D97706',
      badgeBg: 'bg-amber-950/40 border-amber-500/30',
      badgeText: 'text-amber-400',
    },
  },

  // Perplexity
  {
    regex: /PerplexityBot/i,
    info: {
      botName: 'PerplexityBot',
      aiLab: 'Perplexity',
      agentType: 'Real-Time Search Agent',
      badgeColor: '#06B6D4',
      badgeBg: 'bg-cyan-950/40 border-cyan-500/30',
      badgeText: 'text-cyan-400',
    },
  },

  // Google
  {
    regex: /Google-Extended/i,
    info: {
      botName: 'Google-Extended',
      aiLab: 'Google',
      agentType: 'Gemini / Vertex AI Crawler',
      badgeColor: '#3B82F6',
      badgeBg: 'bg-blue-950/40 border-blue-500/30',
      badgeText: 'text-blue-400',
    },
  },
  {
    regex: /GoogleOther/i,
    info: {
      botName: 'GoogleOther',
      aiLab: 'Google',
      agentType: 'Google AI R&D Agent',
      badgeColor: '#3B82F6',
      badgeBg: 'bg-blue-950/40 border-blue-500/30',
      badgeText: 'text-blue-400',
    },
  },

  // Meta
  {
    regex: /Meta-ExternalAgent/i,
    info: {
      botName: 'Meta-ExternalAgent',
      aiLab: 'Meta',
      agentType: 'Llama AI Crawler',
      badgeColor: '#6366F1',
      badgeBg: 'bg-indigo-950/40 border-indigo-500/30',
      badgeText: 'text-indigo-400',
    },
  },
  {
    regex: /FacebookBot/i,
    info: {
      botName: 'FacebookBot',
      aiLab: 'Meta',
      agentType: 'Meta AI Indexer',
      badgeColor: '#6366F1',
      badgeBg: 'bg-indigo-950/40 border-indigo-500/30',
      badgeText: 'text-indigo-400',
    },
  },

  // ByteDance
  {
    regex: /Bytespider/i,
    info: {
      botName: 'Bytespider',
      aiLab: 'ByteDance',
      agentType: 'Doubao / TikTok AI Crawler',
      badgeColor: '#EC4899',
      badgeBg: 'bg-pink-950/40 border-pink-500/30',
      badgeText: 'text-pink-400',
    },
  },

  // Apple
  {
    regex: /Applebot-Extended/i,
    info: {
      botName: 'Applebot-Extended',
      aiLab: 'Apple',
      agentType: 'Apple Intelligence Crawler',
      badgeColor: '#94A3B8',
      badgeBg: 'bg-slate-800/40 border-slate-500/30',
      badgeText: 'text-slate-300',
    },
  },
  {
    regex: /Applebot/i,
    info: {
      botName: 'Applebot',
      aiLab: 'Apple',
      agentType: 'Siri & Apple Intelligence',
      badgeColor: '#94A3B8',
      badgeBg: 'bg-slate-800/40 border-slate-500/30',
      badgeText: 'text-slate-300',
    },
  },

  // DeepSeek
  {
    regex: /DeepSeek(?:Bot|Crawler)?/i,
    info: {
      botName: 'DeepSeekBot',
      aiLab: 'DeepSeek',
      agentType: 'DeepSeek LLM Crawler',
      badgeColor: '#8B5CF6',
      badgeBg: 'bg-purple-950/40 border-purple-500/30',
      badgeText: 'text-purple-400',
    },
  },

  // Cohere & Mistral
  {
    regex: /cohere-ai/i,
    info: {
      botName: 'Cohere-AI',
      aiLab: 'Cohere',
      agentType: 'Enterprise LLM Crawler',
      badgeColor: '#F59E0B',
      badgeBg: 'bg-amber-950/40 border-amber-500/30',
      badgeText: 'text-amber-400',
    },
  },
  {
    regex: /Mistral(?:AI)?/i,
    info: {
      botName: 'MistralAI',
      aiLab: 'Mistral AI',
      agentType: 'Le Chat / Mistral Crawler',
      badgeColor: '#FB923C',
      badgeBg: 'bg-orange-950/40 border-orange-500/30',
      badgeText: 'text-orange-400',
    },
  },

  // AI Dataset Archives & Scraping Systems
  {
    regex: /CCBot/i,
    info: {
      botName: 'CCBot',
      aiLab: 'Common Crawl',
      agentType: 'Global AI Training Archive',
      badgeColor: '#14B8A6',
      badgeBg: 'bg-teal-950/40 border-teal-500/30',
      badgeText: 'text-teal-400',
    },
  },
  {
    regex: /Diffbot/i,
    info: {
      botName: 'Diffbot',
      aiLab: 'Diffbot',
      agentType: 'AI Knowledge Graph Builder',
      badgeColor: '#0EA5E9',
      badgeBg: 'bg-sky-950/40 border-sky-500/30',
      badgeText: 'text-sky-400',
    },
  },

  // Programmatic Scraping Agents
  {
    regex: /python-requests/i,
    info: {
      botName: 'Python Requests',
      aiLab: 'Autonomous Agent',
      agentType: 'Programmatic HTTP Scraper',
      badgeColor: '#EAB308',
      badgeBg: 'bg-yellow-950/40 border-yellow-500/30',
      badgeText: 'text-yellow-400',
    },
  },
  {
    regex: /aiohttp/i,
    info: {
      botName: 'aiohttp Scraper',
      aiLab: 'Autonomous Agent',
      agentType: 'Async Python Scraper',
      badgeColor: '#EAB308',
      badgeBg: 'bg-yellow-950/40 border-yellow-500/30',
      badgeText: 'text-yellow-400',
    },
  },
  {
    regex: /Scrapy/i,
    info: {
      botName: 'Scrapy Spider',
      aiLab: 'Autonomous Agent',
      agentType: 'Distributed Crawler Framework',
      badgeColor: '#F97316',
      badgeBg: 'bg-orange-950/40 border-orange-500/30',
      badgeText: 'text-orange-400',
    },
  },
  {
    regex: /curl/i,
    info: {
      botName: 'cURL Agent',
      aiLab: 'Autonomous Agent',
      agentType: 'CLI Terminal Requester',
      badgeColor: '#64748B',
      badgeBg: 'bg-slate-800/40 border-slate-500/30',
      badgeText: 'text-slate-300',
    },
  },
];

/**
 * Detects if a given User-Agent string belongs to an AI crawler or automated scraping agent.
 * Returns structured metadata or null if regular human browser.
 */
export function detectAiBot(userAgent: string | null | undefined): BotInfo | null {
  if (!userAgent || typeof userAgent !== 'string') return null;

  for (const item of AI_BOT_PATTERNS) {
    if (item.regex.test(userAgent)) {
      return item.info;
    }
  }

  return null;
}
