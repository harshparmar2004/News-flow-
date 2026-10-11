"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Activity,
  Zap,
  Globe,
  ExternalLink,
  RefreshCw,
  Cpu,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Sparkles,
  Terminal,
  CheckCircle,
  FileCode,
  Sliders,
  ChevronDown,
  Info,
} from "lucide-react";

interface CrawlerSummary {
  totalHits: number;
  hits24h: number;
  hits7d: number;
  uniqueBots: number;
  uniqueLabs: number;
}

interface LabItem {
  lab: string;
  count: number;
}

interface BotItem {
  bot: string;
  count: number;
}

interface TopPathItem {
  path: string;
  count: number;
}

interface HitItem {
  id: string;
  bot_name: string;
  ai_lab: string;
  agent_type: string;
  user_agent: string;
  path: string;
  article_id: string | null;
  article_title: string | null;
  article_slug: string | null;
  category_name: string | null;
  ip_address: string | null;
  method: string;
  status_code: number;
  created_at: string;
}

const LAB_THEMES: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  OpenAI: {
    bg: "bg-emerald-500/10 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    bar: "bg-emerald-500",
  },
  Anthropic: {
    bg: "bg-amber-500/10 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    bar: "bg-amber-500",
  },
  Perplexity: {
    bg: "bg-cyan-500/10 dark:bg-cyan-950/40",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500/30",
    bar: "bg-cyan-500",
  },
  Google: {
    bg: "bg-blue-500/10 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    bar: "bg-blue-500",
  },
  Meta: {
    bg: "bg-indigo-500/10 dark:bg-indigo-950/40",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/30",
    bar: "bg-indigo-500",
  },
  ByteDance: {
    bg: "bg-pink-500/10 dark:bg-pink-950/40",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-500/30",
    bar: "bg-pink-500",
  },
  Apple: {
    bg: "bg-slate-500/10 dark:bg-slate-800/40",
    text: "text-slate-600 dark:text-slate-300",
    border: "border-slate-500/30",
    bar: "bg-slate-400",
  },
  DeepSeek: {
    bg: "bg-purple-500/10 dark:bg-purple-950/40",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    bar: "bg-purple-500",
  },
};

export function AiCrawlerTrackerDesk() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<CrawlerSummary>({
    totalHits: 0,
    hits24h: 0,
    hits7d: 0,
    uniqueBots: 0,
    uniqueLabs: 0,
  });
  const [labs, setLabs] = useState<LabItem[]>([]);
  const [bots, setBots] = useState<BotItem[]>([]);
  const [topPaths, setTopPaths] = useState<TopPathItem[]>([]);
  const [recentHits, setRecentHits] = useState<HitItem[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [simulateMsg, setSimulateMsg] = useState<string | null>(null);
  const [selectedSimBot, setSelectedSimBot] = useState("GPTBot");
  const [filterQuery, setFilterQuery] = useState("");
  const [expandedUserAgent, setExpandedUserAgent] = useState<string | null>(null);

  const fetchTelemetry = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/crawlers");
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary || {});
        setLabs(data.labs || []);
        setBots(data.bots || []);
        setTopPaths(data.topPaths || []);
        setRecentHits(data.recentHits || []);
      }
    } catch (err) {
      console.error("Failed to load crawler telemetry:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async () => {
    setSimulating(true);
    setSimulateMsg(null);
    try {
      const res = await fetch("/api/admin/crawlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bot: selectedSimBot }),
      });
      const data = await res.json();
      if (data.success) {
        setSimulateMsg(data.message);
        await fetchTelemetry();
        setTimeout(() => setSimulateMsg(null), 5000);
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setSimulating(false);
    }
  };

  const getLabTheme = (lab: string) => {
    return (
      LAB_THEMES[lab] || {
        bg: "bg-stone-500/10 dark:bg-stone-800/40",
        text: "text-stone-600 dark:text-stone-300",
        border: "border-stone-500/30",
        bar: "bg-stone-500",
      }
    );
  };

  const filteredHits = recentHits.filter((h) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      h.bot_name.toLowerCase().includes(q) ||
      h.ai_lab.toLowerCase().includes(q) ||
      h.path.toLowerCase().includes(q) ||
      (h.article_title && h.article_title.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Simulation Feedback Alert */}
      {simulateMsg && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 transition-all">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-sm font-medium">{simulateMsg}</span>
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
            Live Ping Captured
          </span>
        </div>
      )}

      {/* Header Banner & Live Testing Actions */}
      <div className="admin-card p-6 sm:p-8 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Bot className="w-3.5 h-3.5 mr-1.5" />
                Autonomous LLM Crawler Telemetry
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                Active Tracker Listening
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              AI Agent &amp; LLM Crawler Tracker
            </h2>
            <p className="text-sm text-[#686660] dark:text-[#A8A59D] leading-relaxed">
              Real-time fingerprinting of OpenAI (GPTBot), Anthropic (ClaudeBot), Perplexity, Google, Meta, and autonomous agents scraping tech intelligence from your website.
            </p>
          </div>

          {/* Quick Simulation / Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-[#FAF7F0] dark:bg-[#181816] rounded-xl border border-[#EBE8DF] dark:border-[#33322E] p-1">
              <select
                value={selectedSimBot}
                onChange={(e) => setSelectedSimBot(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#1F1E1D] dark:text-[#F5F2EB] px-2.5 py-1.5 rounded-lg focus:outline-hidden"
              >
                <option value="GPTBot">OpenAI (GPTBot)</option>
                <option value="ClaudeBot">Anthropic (ClaudeBot)</option>
                <option value="PerplexityBot">Perplexity (PerplexityBot)</option>
                <option value="Google-Extended">Google (Google-Extended)</option>
                <option value="Meta-ExternalAgent">Meta (Meta-ExternalAgent)</option>
                <option value="Bytespider">ByteDance (Bytespider)</option>
                <option value="random">🎲 Random AI Agent</option>
              </select>
              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#C96442] text-white hover:bg-[#b05334] transition-colors disabled:opacity-50 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{simulating ? "Simulating..." : "Simulate Hit"}</span>
              </button>
            </div>

            <button
              onClick={() => fetchTelemetry(true)}
              disabled={refreshing}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#252422] text-[#1F1E1D] dark:text-[#F5F2EB] hover:bg-[#FAF7F0] dark:hover:bg-[#2C2B28] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#C96442]" : ""}`} />
              <span>Refresh</span>
            </button>

            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-medium rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-colors"
            >
              <span>/llms.txt</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="/api/v1/ai-feed"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-medium rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            >
              <span>AI JSON Feed</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 High-Impact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Crawler Hits */}
        <div className="admin-card p-6 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8B82] dark:text-[#A8A59D] uppercase tracking-wider">
              Total AI Hits (All-Time)
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-serif font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              {loading ? "..." : summary.totalHits.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              +{summary.hits24h} in 24h
            </span>
          </div>
          <div className="mt-2 text-xs text-[#8E8B82] dark:text-[#A8A59D]">
            Accumulated indexing queries &amp; scrapes
          </div>
        </div>

        {/* 24-Hour Velocity */}
        <div className="admin-card p-6 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8B82] dark:text-[#A8A59D] uppercase tracking-wider">
              24h Crawl Volume
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-serif font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              {loading ? "..." : summary.hits24h.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-[#8E8B82]">
              {summary.hits7d} past 7d
            </span>
          </div>
          <div className="mt-2 text-xs text-[#8E8B82] dark:text-[#A8A59D]">
            Active LLM indexing velocity
          </div>
        </div>

        {/* Unique AI Labs */}
        <div className="admin-card p-6 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8B82] dark:text-[#A8A59D] uppercase tracking-wider">
              AI Labs Detected
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-serif font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              {loading ? "..." : summary.uniqueLabs}
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {summary.uniqueBots} bot agents
            </span>
          </div>
          <div className="mt-2 text-xs text-[#8E8B82] dark:text-[#A8A59D]">
            OpenAI, Anthropic, Google, Perplexity
          </div>
        </div>

        {/* AI Readiness Endpoints */}
        <div className="admin-card p-6 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8B82] dark:text-[#A8A59D] uppercase tracking-wider">
              AI Feed Architecture
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
              100% LLM Ready
            </span>
          </div>
          <div className="mt-2 text-xs text-[#8E8B82] dark:text-[#A8A59D]">
            /llms.txt &bull; /api/v1/ai-feed &bull; Zero Delay
          </div>
        </div>
      </div>

      {/* AI Labs Distribution & Top Scraped Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lab Breakdown Chart Card */}
        <div className="lg:col-span-1 admin-card p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                AI Lab Share
              </h3>
              <p className="text-xs text-[#8E8B82] dark:text-[#A8A59D]">
                Crawling volume by AI ecosystem
              </p>
            </div>
            <span className="text-xs font-mono text-[#8E8B82]">{labs.length} labs</span>
          </div>

          {labs.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8E8B82]">
              No crawler hits recorded yet. Click &quot;Simulate Hit&quot; above to test!
            </div>
          ) : (
            <div className="space-y-3.5 pt-1">
              {labs.map((item) => {
                const total = summary.totalHits || 1;
                const pct = Math.round((item.count / total) * 100);
                const theme = getLabTheme(item.lab);
                return (
                  <div key={item.lab} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">
                        {item.lab}
                      </span>
                      <span className="font-mono text-[#8E8B82] dark:text-[#A8A59D]">
                        {item.count} hits ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF7F0] dark:bg-[#181816] overflow-hidden border border-[#EBE8DF]/50 dark:border-[#33322E]/50">
                      <div
                        className={`h-full rounded-full ${theme.bar} transition-all duration-500`}
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bot Agent Breakdown Badges */}
          <div className="pt-3 border-t border-[#EBE8DF] dark:border-[#33322E]">
            <span className="text-[11px] font-mono text-[#8E8B82] block mb-2">Detected Agents:</span>
            <div className="flex flex-wrap gap-1.5">
              {bots.map((b) => (
                <span
                  key={b.bot}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-[#686660] dark:text-[#A8A59D]"
                >
                  {b.bot}: <span className="font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">{b.count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Scraped Stories & Feeds */}
        <div className="lg:col-span-2 admin-card p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                Most Indexed Resources &amp; Articles
              </h3>
              <p className="text-xs text-[#8E8B82] dark:text-[#A8A59D]">
                Paths and stories most frequently ingested by LLMs
              </p>
            </div>
            <span className="text-xs font-mono text-[#8E8B82]">Top {topPaths.length} endpoints</span>
          </div>

          {topPaths.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8E8B82]">
              No path indexing data yet.
            </div>
          ) : (
            <div className="divide-y divide-[#EBE8DF] dark:divide-[#33322E]">
              {topPaths.map((p, idx) => (
                <div
                  key={p.path}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-[#FAF7F0]/50 dark:hover:bg-[#252422]/50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="font-mono text-xs font-bold w-5 text-[#8E8B82]">
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <span className="font-mono text-xs text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">
                        {p.path}
                      </span>
                      {p.path === "/llms.txt" && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-mono">
                          LLMs Index
                        </span>
                      )}
                      {p.path === "/api/v1/ai-feed" && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono">
                          JSON API
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      {p.count} crawls
                    </span>
                    <a
                      href={p.path}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
                      title="Open Resource"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live AI Crawler Telemetry Stream */}
      <div className="admin-card rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] overflow-hidden">
        {/* Table Header & Search Filter */}
        <div className="p-6 border-b border-[#EBE8DF] dark:border-[#33322E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                Live AI Crawler Telemetry Stream
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {recentHits.length} events
              </span>
            </div>
            <p className="text-xs text-[#8E8B82] dark:text-[#A8A59D]">
              Real-time audit log of every AI bot request, model classification &amp; accessed story
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
              <input
                type="text"
                placeholder="Filter by bot, lab or path..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden w-60"
              />
            </div>
          </div>
        </div>

        {/* Live Stream Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F0] dark:bg-[#181816] text-[#8E8B82] dark:text-[#A8A59D] uppercase tracking-wider font-mono text-[11px] border-b border-[#EBE8DF] dark:border-[#33322E]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">AI Model &amp; Lab</th>
                <th className="py-3 px-4">Agent Classification</th>
                <th className="py-3 px-4">Target Resource / Story</th>
                <th className="py-3 px-4">Client IP</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE8DF] dark:divide-[#33322E]">
              {filteredHits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8E8B82]">
                    No matching crawler events found. Use &quot;Simulate Hit&quot; to test!
                  </td>
                </tr>
              ) : (
                filteredHits.map((hit) => {
                  const theme = getLabTheme(hit.ai_lab);
                  const isExpanded = expandedUserAgent === hit.id;
                  const date = new Date(hit.created_at);
                  const timeFormatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}`;

                  return (
                    <React.Fragment key={hit.id}>
                      <tr className="hover:bg-[#FAF7F0]/60 dark:hover:bg-[#252422]/60 transition-colors">
                        {/* Timestamp */}
                        <td className="py-3 px-4 font-mono text-[#8E8B82] whitespace-nowrap">
                          {timeFormatted}
                        </td>

                        {/* Bot Name & Lab Badge */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${theme.bg} ${theme.text} ${theme.border}`}
                            >
                              {hit.bot_name}
                            </span>
                            <span className="text-[11px] text-[#8E8B82] font-medium">
                              ({hit.ai_lab})
                            </span>
                          </div>
                        </td>

                        {/* Agent Classification */}
                        <td className="py-3 px-4 text-[#686660] dark:text-[#A8A59D] font-medium">
                          {hit.agent_type}
                        </td>

                        {/* Path / Story */}
                        <td className="py-3 px-4 max-w-md">
                          <div className="truncate">
                            {hit.article_title ? (
                              <a
                                href={hit.path}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-[#1F1E1D] dark:text-[#F5F2EB] hover:text-[#C96442] dark:hover:text-[#C96442] transition-colors"
                              >
                                {hit.article_title}
                              </a>
                            ) : (
                              <span className="font-mono text-purple-600 dark:text-purple-400">
                                {hit.path}
                              </span>
                            )}
                            {hit.category_name && (
                              <span className="ml-2 text-[10px] text-[#8E8B82] bg-[#FAF7F0] dark:bg-[#181816] px-1.5 py-0.2 rounded border border-[#EBE8DF] dark:border-[#33322E]">
                                {hit.category_name}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Client IP & Toggle for User-Agent */}
                        <td className="py-3 px-4 font-mono text-[#8E8B82] whitespace-nowrap">
                          <button
                            onClick={() =>
                              setExpandedUserAgent(isExpanded ? null : hit.id)
                            }
                            className="hover:text-[#C96442] transition-colors inline-flex items-center space-x-1"
                            title="Click to view raw User-Agent"
                          >
                            <span>{hit.ip_address || "127.0.0.1"}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        </td>

                        {/* Status Code */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {hit.status_code} OK
                          </span>
                        </td>
                      </tr>

                      {/* Expandable User-Agent Detail Row */}
                      {isExpanded && (
                        <tr className="bg-[#FAF7F0]/80 dark:bg-[#181816]/80 text-[11px] font-mono text-[#686660] dark:text-[#A8A59D]">
                          <td colSpan={6} className="py-2 px-6 border-b border-[#EBE8DF] dark:border-[#33322E]">
                            <div className="flex items-start space-x-2">
                              <span className="text-[#C96442] font-bold">User-Agent:</span>
                              <span className="break-all select-all">{hit.user_agent}</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
