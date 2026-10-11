"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon,
  Database,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  FileText,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  PlusCircle,
  Star,
  LogOut,
  Code2,
  Copy,
  Check,
  Tag,
  Radio,
  Rss,
  Clock,
  ExternalLink,
  Zap,
  Sliders,
  Activity,
  Gauge,
  Play,
  KeyRound,
  ShieldAlert,
  Megaphone,
  Globe,
  Tv,
  MousePointerClick,
  ImageIcon,
  DollarSign,
  Layers,
  BarChart3,
  RefreshCw,
  Sparkle,
  Wand2,
  Search,
  CheckSquare,
  Square,
  Camera,
  Send,
  Bot,
} from "lucide-react";
import { useTheme } from "@/components/ThemeContext";
import { formatArticleDate } from "@/lib/utils";
import { AiCrawlerTrackerDesk } from "./AiCrawlerTrackerDesk";

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  status: string;
  is_featured: boolean;
  rank_score: number;
  views_count: number;
  reading_time_minutes: number;
  cover_image_url: string | null;
  published_at: string;
  source_url: string | null;
  affiliate_links: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface JevSettings {
  has_key: boolean;
  masked_key: string;
  enabled: boolean;
  min_impact_score: number;
  auto_feature_score: number;
}

export interface DomainAdItem {
  id: string;
  domain: string;
  slot: "top_300x250" | "bottom_300x600";
  ad_type: "banner" | "custom_html";
  title?: string | null;
  sponsor?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  html_code?: string | null;
  is_active: boolean;
  impressions: number;
  clicks: number;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  initialArticles: ArticleItem[];
  categories: CategoryItem[];
  subscriberCount: number;
  apiKey: string;
  initialJevSettings?: JevSettings;
  initialAds?: DomainAdItem[];
}

interface DomainAdSlotCardProps {
  domain: string;
  domainName: string;
  slot: "top_300x250" | "bottom_300x600";
  slotLabel: string;
  dimensions: string;
  aspectDesc: string;
  existingAd?: DomainAdItem;
  onSave: (
    slot: "top_300x250" | "bottom_300x600",
    data: {
      ad_type: "banner" | "custom_html";
      title: string;
      sponsor: string;
      image_url: string;
      link_url: string;
      html_code: string;
      is_active: boolean;
    }
  ) => Promise<void>;
  isSaving: boolean;
}

function DomainAdSlotCard({
  domain,
  domainName,
  slot,
  slotLabel,
  dimensions,
  aspectDesc,
  existingAd,
  onSave,
  isSaving,
}: DomainAdSlotCardProps) {
  const [adType, setAdType] = useState<"banner" | "custom_html">(existingAd?.ad_type || "banner");
  const [title, setTitle] = useState(existingAd?.title || "");
  const [sponsor, setSponsor] = useState(existingAd?.sponsor || "");
  const [imageUrl, setImageUrl] = useState(existingAd?.image_url || "");
  const [linkUrl, setLinkUrl] = useState(existingAd?.link_url || "");
  const [htmlCode, setHtmlCode] = useState(existingAd?.html_code || "");
  const [isActive, setIsActive] = useState(existingAd?.is_active ?? true);
  const [showPreview, setShowPreview] = useState(true);

  // Synchronize when existingAd or domain changes
  useEffect(() => {
    if (existingAd) {
      setAdType(existingAd.ad_type || "banner");
      setTitle(existingAd.title || "");
      setSponsor(existingAd.sponsor || "");
      setImageUrl(existingAd.image_url || "");
      setLinkUrl(existingAd.link_url || "");
      setHtmlCode(existingAd.html_code || "");
      setIsActive(existingAd.is_active);
    } else {
      setAdType("banner");
      setTitle("");
      setSponsor("");
      setImageUrl("");
      setLinkUrl("");
      setHtmlCode("");
      setIsActive(true);
    }
  }, [existingAd, domain, slot]);

  const impressions = existingAd?.impressions || 0;
  const clicks = existingAd?.clicks || 0;
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : "0.0";

  const handleApplyPreset = (type: "banner_sample" | "adsense_sample") => {
    if (type === "banner_sample") {
      setAdType("banner");
      if (slot === "top_300x250") {
        setSponsor(domain === "global" ? "Anthropic AI" : `${domainName} Partner`);
        setTitle("Accelerate LLM Inference with Claude 3.5 Sonnet");
        setImageUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80");
        setLinkUrl("https://anthropic.com");
      } else {
        setSponsor(domain === "global" ? "Vercel Enterprise" : `${domainName} Sponsor`);
        setTitle("Deploy Next-Gen Edge Applications with Ultra-Low Latency");
        setImageUrl("https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80");
        setLinkUrl("https://vercel.com");
      }
      setIsActive(true);
    } else {
      setAdType("custom_html");
      setHtmlCode(
        `<div style="width:100%;height:100%;background:#FAF7F0;border:1px dashed #C96442;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;text-align:center;font-family:sans-serif;box-sizing:border-box;">\n  <span style="font-weight:bold;color:#C96442;font-size:12px;letter-spacing:0.05em;">GOOGLE ADSENSE / EMBED</span>\n  <p style="font-size:11px;color:#686660;margin-top:6px;line-height:1.4;">Active ${dimensions} responsive ad tag serving live on ${domainName}.</p>\n</div>`
      );
      setIsActive(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(slot, {
      ad_type: adType,
      title,
      sponsor,
      image_url: imageUrl,
      link_url: linkUrl,
      html_code: htmlCode,
      is_active: isActive,
    });
  };

  return (
    <div className="admin-card p-6 sm:p-8 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EBE8DF] dark:border-[#33322E] gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#C96442]/10 text-[#C96442] border border-[#C96442]/20 font-bold">
              {dimensions}
            </span>
            <h3 className="font-serif text-xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              {slotLabel}
            </h3>
          </div>
          <p className="text-sm text-[#8E8B82] dark:text-[#A8A59D]">
            {aspectDesc} &bull; Targeted for <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">{domainName}</span>
          </p>
        </div>

        {/* Status Toggle & Metrics */}
        <div className="flex items-center gap-3">
          {existingAd && (
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#686660] dark:text-[#A8A59D]">
              <span className="px-2.5 py-1 rounded-md bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]" title="Total Impressions">
                👁️ {impressions.toLocaleString()} views
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]" title="Total Clicks">
                🖱️ {clicks.toLocaleString()} clicks
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#C96442]/10 text-[#C96442] border border-[#C96442]/20 font-bold" title="Click-Through Rate">
                📈 {ctr}% CTR
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
              isActive
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-stone-500/10 border border-stone-500/30 text-stone-500"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-stone-400"}`} />
            <span>{isActive ? "Active (Serving Live)" : "Paused"}</span>
          </button>
        </div>
      </div>

      <form id={`form-${domain}-${slot}`} onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Section (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ad Format Selector */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] font-semibold flex items-center justify-between">
              <span>Ad Format / Implementation</span>
              <div className="flex items-center gap-2 normal-case font-sans">
                <span className="text-xs text-[#8E8B82]">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset("banner_sample")}
                  className="text-xs font-medium text-[#C96442] hover:underline"
                >
                  Sample Banner
                </button>
                <span className="text-[#8E8B82]">&bull;</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset("adsense_sample")}
                  className="text-xs font-medium text-[#C96442] hover:underline"
                >
                  Sample AdSense Tag
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdType("banner")}
                className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3.5 transition-all ${
                  adType === "banner"
                    ? "border-[#C96442] bg-[#C96442]/5 text-[#1F1E1D] dark:text-[#F5F2EB] ring-1 ring-[#C96442]/30"
                    : "border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]/40"
                }`}
              >
                <ImageIcon className={`w-5 h-5 shrink-0 ${adType === "banner" ? "text-[#C96442]" : "text-[#8E8B82]"}`} />
                <div>
                  <p className="text-sm font-semibold">Image &amp; Link Banner</p>
                  <p className="text-xs text-[#8E8B82]">Custom creative with direct click attribution</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAdType("custom_html")}
                className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3.5 transition-all ${
                  adType === "custom_html"
                    ? "border-[#C96442] bg-[#C96442]/5 text-[#1F1E1D] dark:text-[#F5F2EB] ring-1 ring-[#C96442]/30"
                    : "border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]/40"
                }`}
              >
                <Code2 className={`w-5 h-5 shrink-0 ${adType === "custom_html" ? "text-[#C96442]" : "text-[#8E8B82]"}`} />
                <div>
                  <p className="text-sm font-semibold">Google AdSense / Custom HTML</p>
                  <p className="text-xs text-[#8E8B82]">Raw AdSense script tags or responsive iframe</p>
                </div>
              </button>
            </div>
          </div>

          {/* Format Specific Fields */}
          {adType === "banner" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D] mb-1.5">
                    Sponsor / Brand Label
                  </label>
                  <input
                    type="text"
                    value={sponsor}
                    onChange={(e) => setSponsor(e.target.value)}
                    placeholder="e.g. Anthropic, Google Cloud, Stripe"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D] mb-1.5">
                    Headline / Title (Overlay or Text Card)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Build Autonomous Agents Faster"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D] mb-1.5">
                    Image Creative URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... (or leave blank for editorial gradient card)"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-sm font-mono text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D] mb-1.5">
                    Target Destination URL (Outbound)
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://partner.com/?utm_source=newsflow"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-sm font-mono text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D] mb-1.5">
                Custom HTML / Google AdSense / Script Embed
              </label>
              <textarea
                rows={5}
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder={`<!-- Paste Google AdSense <ins> or iframe snippet here -->\n<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="ca-pub-..."\n     data-ad-slot="..."\n     data-ad-format="auto"></ins>`}
                className="w-full px-4 py-3 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] font-mono text-sm text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
              />
              <p className="text-xs text-[#8E8B82] mt-1.5">
                Supports Google AdSense tags, dynamic affiliate banners, or custom HTML/CSS embeds.
              </p>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#EBE8DF] dark:border-[#33322E] gap-3">
            <span className="text-xs text-[#8E8B82]">
              Updates take effect immediately on <code className="text-[#C96442] font-mono font-medium">{domain}</code> pages.
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-[#C96442] hover:bg-[#B35334] text-white text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Slot...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save {dimensions} Slot</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Preview Section (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start space-y-3">
          <div className="w-full flex items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#33322E]">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#C96442]" />
              <span>Live Reader Preview ({dimensions})</span>
            </span>
            {linkUrl && (
              <a
                href={linkUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-[#C96442] hover:underline flex items-center gap-1"
                title="Test outbound destination URL"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="w-full flex flex-col items-center justify-center p-6 rounded-2xl bg-[#FAF7F0]/60 dark:bg-[#181816]/70 border border-[#EBE8DF] dark:border-[#33322E]">
            {slot === "top_300x250" ? (
              /* Top 300x250 Preview */
              <div className="w-[300px] h-[250px] shrink-0 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#1C1C19] overflow-hidden flex flex-col relative group shadow-sm">
                {adType === "custom_html" && htmlCode ? (
                  <div
                    className="w-full h-full flex flex-col justify-center items-center overflow-hidden p-2"
                    dangerouslySetInnerHTML={{ __html: htmlCode }}
                  />
                ) : (
                  <div className="relative w-full h-full block overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title || "Advertisement Preview"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-[#FAF7F0] to-[#EBE8DF] dark:from-[#20201D] dark:to-[#181816] p-5 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#C96442] font-semibold">
                            {sponsor || "Sponsored"}
                          </span>
                          <h4 className="font-serif text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB] leading-tight">
                            {title || "Featured Sponsor Headline"}
                          </h4>
                        </div>
                        <span className="inline-flex items-center text-xs font-medium text-[#C96442]">
                          Learn more →
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white/90">
                      {sponsor || "Sponsored"}
                    </div>

                    {imageUrl && title && (
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-linear-to-t from-black/85 via-black/40 to-transparent text-white">
                        <p className="font-serif text-xs font-semibold line-clamp-1">{title}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Bottom 300x600 Preview */
              <div className="w-[300px] h-[500px] shrink-0 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#1C1C19] overflow-hidden flex flex-col relative group shadow-sm">
                {adType === "custom_html" && htmlCode ? (
                  <div
                    className="w-full h-full flex flex-col justify-center items-center overflow-hidden p-2"
                    dangerouslySetInnerHTML={{ __html: htmlCode }}
                  />
                ) : (
                  <div className="relative w-full h-full block overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title || "Advertisement Preview"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-[#FAF7F0] to-[#EBE8DF] dark:from-[#20201D] dark:to-[#181816] p-6 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-[#C96442] font-semibold">
                            {sponsor || "Featured Partner"}
                          </span>
                          <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB] leading-snug">
                            {title || "High-Impact Technology Partner"}
                          </h3>
                        </div>
                        <span className="inline-flex items-center text-xs font-medium text-[#C96442]">
                          Explore partner →
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white/90">
                      {sponsor || "Sponsored"}
                    </div>

                    {imageUrl && title && (
                      <div className="absolute bottom-0 inset-x-0 p-4 bg-linear-to-t from-black/85 via-black/50 to-transparent text-white">
                        <p className="font-serif text-sm font-semibold line-clamp-2">{title}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <span className="text-xs font-mono text-[#8E8B82] mt-3">
              Live {dimensions} reader display render
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export function AdminDashboardClient({
  initialArticles,
  categories,
  subscriberCount,
  apiKey,
  initialJevSettings,
  initialAds = [],
}: Props) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [activeTab, setActiveTab] = useState<"overview" | "articles" | "create" | "api" | "jev" | "ads" | "rss" | "crawlers">("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // RSS 2.0 Syndication State
  const [copiedRssPath, setCopiedRssPath] = useState<string | null>(null);
  const [rssOrigin, setRssOrigin] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRssOrigin(window.location.origin);
    }
  }, []);

  const handleCopyRss = async (path: string) => {
    const origin = rssOrigin || (typeof window !== "undefined" ? window.location.origin : "");
    const fullUrl = `${origin}${path}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedRssPath(path);
      setTimeout(() => setCopiedRssPath(null), 2200);
    } catch {
      // Fallback
    }
  };

  // Monetization & Domain Ads State
  const [ads, setAds] = useState<DomainAdItem[]>(initialAds);
  const [selectedAdDomain, setSelectedAdDomain] = useState<string>("global");
  const [savingSlot, setSavingSlot] = useState<string | null>(null);

  // API Ingestion Snippet & Probe State
  const [apiSnippetLang, setApiSnippetLang] = useState<"python" | "curl" | "node">("python");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [selectedEndpointProbe, setSelectedEndpointProbe] = useState<"trigger" | "articles" | "categories">("trigger");
  const [copiedCurl, setCopiedCurl] = useState(false);

  // TypeSafe Jev API State
  const [jevKeyInput, setJevKeyInput] = useState("");
  const [jevMaskedKey, setJevMaskedKey] = useState(initialJevSettings?.masked_key || "");
  const [jevHasKey, setJevHasKey] = useState(initialJevSettings?.has_key ?? false);
  const [jevEnabled, setJevEnabled] = useState(initialJevSettings?.enabled ?? false);
  const [jevMinImpact, setJevMinImpact] = useState(initialJevSettings?.min_impact_score ?? 7.0);
  const [jevAutoFeature, setJevAutoFeature] = useState(initialJevSettings?.auto_feature_score ?? 8.5);
  const [showJevKey, setShowJevKey] = useState(false);
  const [jevSaving, setJevSaving] = useState(false);
  const [jevTesting, setJevTesting] = useState(false);
  const [jevTestResult, setJevTestResult] = useState<any>(null);

  // Jev Interactive Sandbox State
  const [sandboxTitle, setSandboxTitle] = useState("OpenAI Announces GPT-5 Breakthrough with Integrated Autonomous Agency");
  const [sandboxSummary, setSandboxSummary] = useState("OpenAI unveils its next-generation architecture featuring self-correcting neural loops, sub-100ms reasoning, and direct system automation.");
  const [sandboxRunning, setSandboxRunning] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  // Pagination & Filtering State (50 stories per page)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const PAGE_SIZE = 50;

  // New Article Form State
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState(categories[0]?.name || "Artificial Intelligence");
  const [newCover, setNewCover] = useState("");
  const [newFeatured, setNewFeatured] = useState(false);

  // Bulk Actions State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Pipeline Webhook Trigger State
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineLastRun, setPipelineLastRun] = useState<string | null>(null);
  const [pipelineMessage, setPipelineMessage] = useState<string | null>(null);

  // AI Copilot Assist State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTargetField, setAiTargetField] = useState<"title" | "summary" | "tags">("title");
  const [aiTargetForm, setAiTargetForm] = useState<"create" | "edit">("create");
  const [aiSeed, setAiSeed] = useState("");
  const [aiMode, setAiMode] = useState<"headline" | "hook" | "seo" | "tags">("headline");
  const [aiCategory, setAiCategory] = useState("Artificial Intelligence");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Unsplash Image Picker State
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageTargetForm, setImageTargetForm] = useState<"create" | "edit">("create");
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageSearchLoading, setImageSearchLoading] = useState(false);
  const [imageSearchResults, setImageSearchResults] = useState<any[]>([]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  useEffect(() => {
    // Check initial pipeline status
    fetch("/api/admin/pipeline/trigger")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPipelineRunning(data.status === "running");
          setPipelineLastRun(data.last_run || null);
          setPipelineMessage(data.last_message || null);
        }
      })
      .catch(() => {});
  }, []);

  // Pipeline Trigger Handler
  const handleTriggerPipeline = async () => {
    setPipelineRunning(true);
    showToast("Launching autonomous news ingest pipeline...", "success");
    try {
      const res = await fetch("/api/admin/pipeline/trigger", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setPipelineLastRun(data.started_at);
        showToast("Pipeline cycle started! Ingesting stories in background...");
        const interval = setInterval(async () => {
          try {
            const check = await fetch("/api/admin/pipeline/trigger");
            const checkData = await check.json();
            if (checkData.success && checkData.status === "idle") {
              setPipelineRunning(false);
              setPipelineLastRun(checkData.last_run);
              setPipelineMessage(checkData.last_message);
              clearInterval(interval);
              showToast("Pipeline ingest completed! Refreshing articles...");
              router.refresh();
            }
          } catch {
            clearInterval(interval);
            setPipelineRunning(false);
          }
        }, 5000);
      } else {
        setPipelineRunning(false);
        showToast(data.error || "Failed to trigger pipeline", "error");
      }
    } catch {
      setPipelineRunning(false);
      showToast("Network error triggering pipeline", "error");
    }
  };

  // Bulk Actions Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const pageIds = displayedArticles.map((a) => a.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleBulkAction = async (
    action: "publish" | "draft" | "archive" | "category" | "delete",
    category_id?: string
  ) => {
    if (selectedIds.length === 0) return;
    if (action === "delete" && !confirm(`Permanently delete ${selectedIds.length} selected articles?`)) {
      return;
    }

    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/articles/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: selectedIds, category_id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (action === "delete") {
          setArticles((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
        } else if (action === "publish" || action === "draft" || action === "archive") {
          setArticles((prev) =>
            prev.map((a) =>
              selectedIds.includes(a.id)
                ? { ...a, status: action === "archive" ? "archived" : action }
                : a
            )
          );
        } else if (action === "category" && category_id) {
          const cat = categories.find((c) => c.id === category_id);
          if (cat) {
            setArticles((prev) =>
              prev.map((a) => (selectedIds.includes(a.id) ? { ...a, category: cat } : a))
            );
          }
        }
        showToast(`Bulk ${action} succeeded for ${data.count} stories!`);
        setSelectedIds([]);
      } else {
        showToast(data.error || "Bulk action failed", "error");
      }
    } catch {
      showToast("Network error executing bulk action", "error");
    } finally {
      setBulkLoading(false);
    }
  };

  // AI Copilot Assist Handlers
  const handleOpenAiAssist = async (
    field: "title" | "summary" | "tags",
    form: "create" | "edit",
    seedText: string,
    categoryName: string
  ) => {
    setAiTargetField(field);
    setAiTargetForm(form);
    setAiSeed(seedText || "");
    setAiCategory(categoryName || "Artificial Intelligence");
    const initialMode = field === "title" ? "headline" : field === "summary" ? "hook" : "tags";
    setAiMode(initialMode);
    setAiModalOpen(true);
    setAiSuggestions([]);

    await fetchAiAssist(seedText, initialMode, categoryName);
  };

  const fetchAiAssist = async (seed: string, mode: string, category: string) => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: seed, mode, category }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAiSuggestions(data.suggestions || []);
      } else {
        showToast(data.error || "Failed to generate suggestions", "error");
      }
    } catch {
      showToast("Error generating AI suggestions", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiSuggestion = (suggestion: string) => {
    if (aiTargetForm === "create") {
      if (aiTargetField === "title") setNewTitle(suggestion);
      else if (aiTargetField === "summary") setNewSummary(suggestion);
    } else if (aiTargetForm === "edit" && editingArticle) {
      if (aiTargetField === "title") setEditingArticle({ ...editingArticle, title: suggestion });
      else if (aiTargetField === "summary") setEditingArticle({ ...editingArticle, summary: suggestion });
    }
    setAiModalOpen(false);
    showToast(`Applied ${aiTargetField} suggestion!`);
  };

  // Unsplash Image Picker Handlers
  const handleOpenImagePicker = async (form: "create" | "edit") => {
    setImageTargetForm(form);
    setImageModalOpen(true);
    setImageSearchQuery("");
    await searchImages("");
  };

  const searchImages = async (q: string) => {
    setImageSearchLoading(true);
    try {
      const res = await fetch(`/api/admin/images/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setImageSearchResults(data.images || []);
      }
    } catch {
      showToast("Failed to fetch image gallery", "error");
    } finally {
      setImageSearchLoading(false);
    }
  };

  const handleSelectImage = (url: string) => {
    if (imageTargetForm === "create") {
      setNewCover(url);
    } else if (imageTargetForm === "edit" && editingArticle) {
      setEditingArticle({ ...editingArticle, cover_image_url: url });
    }
    setImageModalOpen(false);
    showToast("Cover image applied!");
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const toggleFeatured = async (art: ArticleItem) => {
    try {
      const nextFeatured = !art.is_featured;
      const res = await fetch(`/api/articles/${art.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: nextFeatured }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === art.id ? { ...a, is_featured: nextFeatured } : a))
        );
        showToast(`Article ${nextFeatured ? "featured" : "unfeatured"}`);
      }
    } catch {
      showToast("Failed to toggle featured status", "error");
    }
  };

  const toggleStatus = async (art: ArticleItem, newStatus: string) => {
    try {
      const res = await fetch(`/api/articles/${art.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === art.id ? { ...a, status: newStatus } : a))
        );
        showToast(`Status changed to ${newStatus}`);
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;
    try {
      const res = await fetch(`/api/articles/${id}?hard=true`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        showToast("Article deleted successfully");
      }
    } catch {
      showToast("Failed to delete article", "error");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/articles/${editingArticle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingArticle.title,
          summary: editingArticle.summary,
          body: editingArticle.body,
          cover_image_url: editingArticle.cover_image_url,
          status: editingArticle.status,
          is_featured: editingArticle.is_featured,
          rank_score: editingArticle.rank_score,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setArticles((prev) =>
          prev.map((a) => (a.id === editingArticle.id ? data.article : a))
        );
        setEditingArticle(null);
        showToast("Article updated successfully");
      } else {
        showToast("Failed to update article", "error");
      }
    } catch {
      showToast("Error updating article", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          summary: newSummary,
          body: newBody,
          category: newCategory,
          cover_image_url: newCover || null,
          is_featured: newFeatured,
          status: "published",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Article published successfully!");
        setNewTitle("");
        setNewSummary("");
        setNewBody("");
        setNewCover("");
        setNewFeatured(false);
        setActiveTab("articles");
        router.refresh();
      } else {
        showToast(data.error || "Failed to publish", "error");
      }
    } catch {
      showToast("Network error publishing article", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJevKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setJevSaving(true);
    try {
      const res = await fetch("/api/admin/jev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: jevKeyInput || undefined,
          enabled: jevEnabled,
          min_impact_score: jevMinImpact,
          auto_feature_score: jevAutoFeature,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.masked_key) {
          setJevMaskedKey(data.masked_key);
          setJevHasKey(true);
          setJevKeyInput("");
        }
        showToast("TypeSafe Jev API Key & settings saved! System 1 activated.");
        router.refresh();
      } else {
        showToast(data.error || "Failed to save Jev settings", "error");
      }
    } catch {
      showToast("Network error while saving Jev configuration", "error");
    } finally {
      setJevSaving(false);
    }
  };

  const handleTestJev = async () => {
    setJevTesting(true);
    setJevTestResult(null);
    try {
      const res = await fetch("/api/admin/jev/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: jevKeyInput || undefined,
        }),
      });
      const data = await res.json();
      setJevTestResult(data);
      if (res.ok && data.success) {
        showToast(`Jev verified! Latency: ${data.latency_ms}ms ⚡`);
      } else {
        showToast(data.error || "Jev test failed", "error");
      }
    } catch (err: any) {
      setJevTestResult({ success: false, error: err.message });
      showToast("Failed to connect to TypeSafe Jev test endpoint", "error");
    } finally {
      setJevTesting(false);
    }
  };

  const handleRunSandbox = async () => {
    if (!sandboxTitle.trim()) {
      showToast("Please provide a title for the sandbox test", "error");
      return;
    }
    setSandboxRunning(true);
    setSandboxResult(null);
    try {
      const res = await fetch("/api/admin/jev/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sandboxTitle,
          summary: sandboxSummary,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSandboxResult(data);
        showToast(`Triage evaluated in ${data.latency_ms}ms!`);
      } else {
        showToast(data.error || "Sandbox evaluation failed", "error");
      }
    } catch {
      showToast("Failed to run sandbox triage", "error");
    } finally {
      setSandboxRunning(false);
    }
  };

  const handleSaveSlot = async (
    slot: "top_300x250" | "bottom_300x600",
    adData: {
      ad_type: "banner" | "custom_html";
      title: string;
      sponsor: string;
      image_url: string;
      link_url: string;
      html_code: string;
      is_active: boolean;
    }
  ) => {
    const saveKey = `${selectedAdDomain}-${slot}`;
    setSavingSlot(saveKey);
    try {
      const res = await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: selectedAdDomain,
          slot,
          ...adData,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAds((prev) => {
          const withoutCurrent = prev.filter(
            (a) => !(a.domain === selectedAdDomain && a.slot === slot)
          );
          return [...withoutCurrent, data.ad];
        });
        showToast(
          `Ad slot (${slot === "top_300x250" ? "300×250" : "300×600"}) saved for ${selectedAdDomain}!`,
          "success"
        );
      } else {
        showToast(data.error || "Failed to save ad", "error");
      }
    } catch {
      showToast("Network error saving ad slot", "error");
    } finally {
      setSavingSlot(null);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftCount = articles.filter((a) => a.status === "draft").length;
  const totalViews = articles.reduce((acc, a) => acc + (a.views_count || 0), 0);

  // Filter and Paginate (strictly 50 per page)
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      !searchQuery ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || art.category.slug === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || art.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const displayedArticles = filteredArticles.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Category breakdown for Overview
  const categoryStats = categories.map((cat) => ({
    ...cat,
    count: articles.filter(
      (a) => a.category?.id === cat.id || a.category?.slug === cat.slug
    ).length,
  }));
  const recentArticles = articles.slice(0, 5);

  return (
    <div className="admin-dashboard-container min-h-screen flex bg-[#FAF7F0] dark:bg-[#151514] text-[#1F1E1D] dark:text-[#F5F2EB]">
      {/* Toast Notification */}
      {msg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium transition-all ${
            msg.type === "success"
              ? "bg-emerald-900 text-white border-emerald-700"
              : "bg-red-900 text-white border-red-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 lg:w-72 bg-[#F7F4EC] dark:bg-[#1A1917] border-r border-[#EBE8DF] dark:border-[#282724] flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-[#EBE8DF] dark:border-[#282724]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
                NewsFlow
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 font-semibold">
                Admin
              </span>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs font-mono text-[#8E8B82] mt-1">
            Editorial Cockpit &amp; Pipeline Hub
          </p>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {/* Overview */}
          <button
            onClick={() => {
              setActiveTab("overview");
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "overview"
                ? "bg-[#C96442] text-white font-semibold shadow-xs"
                : "text-[#55534E] dark:text-[#A8A59D] hover:bg-[#EBE8DF]/70 dark:hover:bg-[#252422] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />
              <span>Overview</span>
            </div>
          </button>

          {/* Articles Vault */}
          <button
            onClick={() => {
              setActiveTab("articles");
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "articles"
                ? "bg-[#C96442] text-white font-semibold shadow-xs"
                : "text-[#55534E] dark:text-[#A8A59D] hover:bg-[#EBE8DF]/70 dark:hover:bg-[#252422] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Database className="w-4.5 h-4.5 shrink-0" />
              <span>Articles Vault</span>
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-md ${
                activeTab === "articles"
                  ? "bg-white/20 text-white font-semibold"
                  : "bg-[#EBE8DF] dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D]"
              }`}
            >
              {articles.length}
            </span>
          </button>

          {/* Manual Dispatch */}
          <button
            onClick={() => {
              setActiveTab("create");
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "create"
                ? "bg-[#C96442] text-white font-semibold shadow-xs"
                : "text-[#55534E] dark:text-[#A8A59D] hover:bg-[#EBE8DF]/70 dark:hover:bg-[#252422] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <PlusCircle className="w-4.5 h-4.5 shrink-0" />
              <span>Manual Dispatch</span>
            </div>
          </button>

          {/* TypeSafe Jev AI */}
          <button
            onClick={() => {
              setActiveTab("jev");
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "jev"
                ? "bg-[#C96442] text-white font-semibold shadow-xs"
                : "text-[#55534E] dark:text-[#A8A59D] hover:bg-[#EBE8DF]/70 dark:hover:bg-[#252422] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Zap className="w-4.5 h-4.5 shrink-0" />
              <span>TypeSafe Jev AI</span>
            </div>
            {jevHasKey ? (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System 1 Armed" />
            ) : (
              <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md ${
                activeTab === "jev" ? "bg-white/20 text-white font-semibold" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              }`}>
                Setup
              </span>
            )}
          </button>

          {/* Monetization & Ads */}
          <button
            onClick={() => {
              setActiveTab("ads");
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "ads"
                ? "bg-[#C96442] text-white font-semibold shadow-xs"
                : "text-[#55534E] dark:text-[#A8A59D] hover:bg-[#EBE8DF]/70 dark:hover:bg-[#252422] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Megaphone className="w-4.5 h-4.5 shrink-0" />
              <span>Monetization &amp; Ads</span>
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-md ${
                activeTab === "ads"
                  ? "bg-white/20 text-white font-semibold"
                  : "bg-[#C96442]/10 text-[#C96442] border border-[#C96442]/20"
              }`}
            >
              {ads.filter((a) => a.is_active).length}
            </span>
          </button>

          {/* Pipeline Ingestion API & Keys */}
          <button
            onClick={() => {
              setActiveTab("api");
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "api"
                ? "bg-[#C96442] text-white font-semibold shadow-xs"
                : "text-[#55534E] dark:text-[#A8A59D] hover:bg-[#EBE8DF]/70 dark:hover:bg-[#252422] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <KeyRound className="w-4.5 h-4.5 shrink-0" />
              <span>Pipeline &amp; API Keys</span>
            </div>
          </button>

          {/* RSS 2.0 Syndication */}
          <button
            onClick={() => {
              setActiveTab("rss");
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "rss"
                ? "bg-[#C96442] text-white font-semibold shadow-xs"
                : "text-[#55534E] dark:text-[#A8A59D] hover:bg-[#EBE8DF]/70 dark:hover:bg-[#252422] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Rss className="w-4.5 h-4.5 shrink-0" />
              <span>RSS 2.0 Feeds</span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                activeTab === "rss"
                  ? "bg-white/20 text-white font-semibold"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              }`}
            >
              Live XML
            </span>
          </button>

          {/* AI Crawler & Bot Telemetry */}
          <button
            onClick={() => {
              setActiveTab("crawlers");
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "crawlers"
                ? "bg-[#C96442] text-white font-semibold shadow-xs"
                : "text-[#55534E] dark:text-[#A8A59D] hover:bg-[#EBE8DF]/70 dark:hover:bg-[#252422] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Bot className="w-4.5 h-4.5 shrink-0" />
              <span>AI Crawlers</span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                activeTab === "crawlers"
                  ? "bg-white/20 text-white font-semibold"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
              }`}
            >
              Telemetry
            </span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#EBE8DF] dark:border-[#282724] space-y-2">
          {/* Health & Live Site */}
          <div className="flex items-center justify-between px-1 py-1 text-xs font-mono text-[#8E8B82]">
            <a
              href="/api/health"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 hover:text-emerald-500 transition-colors font-medium"
              title="Health Status"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Health: OK</span>
            </a>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 text-[#C96442] hover:underline transition-colors font-medium"
              title="View Public Site"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="pt-2 border-t border-[#EBE8DF] dark:border-[#282724] flex items-center justify-between gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border border-[#EBE8DF] dark:border-[#282724] bg-white/70 dark:bg-[#20201D] hover:bg-white dark:hover:bg-[#252422] text-xs font-medium text-[#686660] dark:text-[#A8A59D] transition-colors shadow-2xs"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#1F1E1D]" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border border-[#EBE8DF] dark:border-[#282724] bg-white/70 dark:bg-[#20201D] text-xs font-medium text-[#686660] dark:text-[#A8A59D] hover:text-red-600 hover:border-red-300 dark:hover:border-red-900 transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#FAF7F0]/95 dark:bg-[#151514]/95 backdrop-blur-md border-b border-[#EBE8DF] dark:border-[#282724] px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl border border-[#EBE8DF] dark:border-[#282724] text-[#686660] dark:text-[#A8A59D]"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div>
                <h1 className="font-serif text-lg sm:text-xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                  {activeTab === "overview" && "Dashboard Overview"}
                  {activeTab === "articles" && "Articles Vault"}
                  {activeTab === "create" && "Manual Article Dispatch"}
                  {activeTab === "jev" && "TypeSafe Jev AI (System 1)"}
                  {activeTab === "ads" && "Monetization & Domain Ads"}
                  {activeTab === "api" && "Pipeline Ingestion & API Keys"}
                  {activeTab === "rss" && "RSS 2.0 Syndication Feeds"}
                  {activeTab === "crawlers" && "AI Crawler & Agent Telemetry"}
                </h1>
                <p className="text-[11px] font-mono text-[#8E8B82] hidden sm:block">
                  {activeTab === "overview" && "System health, real-time KPI metrics & quick editorial controls"}
                  {activeTab === "articles" && `Managing ${articles.length} news stories across all domains`}
                  {activeTab === "create" && "Draft and publish custom articles with AI and image support"}
                  {activeTab === "jev" && "Ultra-low-latency breaking news triage & evaluation engine"}
                  {activeTab === "ads" && "High-impact domain desk ad inventory and click metrics"}
                  {activeTab === "api" && "Autonomous agent ingestion tokens and integration endpoints"}
                  {activeTab === "rss" && "Machine-readable XML broadcasting, automation endpoints & aggregator compatibility"}
                  {activeTab === "crawlers" && "Real-time bot tracking, AI lab indexing shares & LLM intelligence feeds"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleTriggerPipeline}
                disabled={pipelineRunning}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors shadow-xs disabled:opacity-50"
                title="Execute immediate autonomous news ingest cycle"
              >
                <Zap className={`w-3.5 h-3.5 ${pipelineRunning ? "animate-spin text-amber-200" : ""}`} />
                <span className="hidden sm:inline">{pipelineRunning ? "Ingesting Stories..." : "⚡ Run Ingest Pipeline"}</span>
                <span className="sm:hidden">{pipelineRunning ? "Ingesting..." : "⚡ Ingest"}</span>
              </button>

              {activeTab !== "create" && (
                <button
                  onClick={() => setActiveTab("create")}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#C96442] hover:bg-[#B35334] text-white text-xs font-medium transition-colors shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Article</span>
                  <span className="sm:hidden">New</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {/* TAB 0: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Top KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="admin-card p-5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#20201D]">
                  <div className="flex items-center justify-between text-[#8E8B82]">
                    <span className="text-xs font-mono uppercase tracking-wider">Total Articles</span>
                    <Database className="w-4 h-4 text-[#C96442]" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB] mt-2">
                    {articles.length}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EBE8DF]/60 dark:border-[#33322E]/60 text-xs font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{publishedCount} published</span>
                    <span className="text-[#8E8B82]">{draftCount} drafts</span>
                  </div>
                </div>

                <div className="admin-card p-5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#20201D]">
                  <div className="flex items-center justify-between text-[#8E8B82]">
                    <span className="text-xs font-mono uppercase tracking-wider">Reader Views</span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB] mt-2">
                    {totalViews.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EBE8DF]/60 dark:border-[#33322E]/60 text-xs font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Organic Traffic</span>
                    <span className="text-[#8E8B82]">All Desks</span>
                  </div>
                </div>

                <div className="admin-card p-5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#20201D]">
                  <div className="flex items-center justify-between text-[#8E8B82]">
                    <span className="text-xs font-mono uppercase tracking-wider">Subscribers</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB] mt-2">
                    {subscriberCount}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EBE8DF]/60 dark:border-[#33322E]/60 text-xs font-mono">
                    <span className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">Daily Signal List</span>
                    <span className="text-[#8E8B82]">Active</span>
                  </div>
                </div>

                <div className="admin-card p-5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#20201D]">
                  <div className="flex items-center justify-between text-[#8E8B82]">
                    <span className="text-xs font-mono uppercase tracking-wider">Agent Status</span>
                    <Activity className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        pipelineRunning ? "bg-amber-500 animate-ping" : "bg-emerald-500 animate-pulse"
                      }`}
                    />
                    <p className={`font-serif text-xl font-bold ${pipelineRunning ? "text-amber-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {pipelineRunning ? "Ingesting Live..." : "Autonomous Ready"}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#EBE8DF]/60 dark:border-[#33322E]/60 text-xs font-mono text-[#8E8B82] truncate">
                    {pipelineRunning
                      ? "Executing cycle"
                      : pipelineLastRun
                      ? `Last: ${new Date(pipelineLastRun).toLocaleTimeString()}`
                      : "50+ sources armed"}
                  </div>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="admin-card p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#20201D] space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                  Quick Editorial Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <button
                    onClick={() => setActiveTab("create")}
                    className="group p-4 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] hover:border-[#C96442] text-left transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#C96442]/10 text-[#C96442] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <PlusCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] transition-colors">
                      Manual Dispatch
                    </h3>
                    <p className="text-xs text-[#8E8B82] mt-1">
                      Draft and publish breaking stories with AI assistance and Unsplash photos.
                    </p>
                  </button>

                  <button
                    onClick={handleTriggerPipeline}
                    disabled={pipelineRunning}
                    className="group p-4 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] hover:border-emerald-500 text-left transition-all disabled:opacity-50"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <Zap className={`w-5 h-5 ${pipelineRunning ? "animate-spin text-amber-500" : ""}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-emerald-600 transition-colors">
                      {pipelineRunning ? "Ingesting Live..." : "Run Ingest Pipeline"}
                    </h3>
                    <p className="text-xs text-[#8E8B82] mt-1">
                      Trigger an immediate autonomous sweep across 50+ technology wire sources.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("ads")}
                    className="group p-4 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] hover:border-[#C96442] text-left transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#C96442]/10 text-[#C96442] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] transition-colors">
                      Monetization &amp; Ads
                    </h3>
                    <p className="text-xs text-[#8E8B82] mt-1">
                      Manage right-sidebar banner inventory ({ads.filter((a) => a.is_active).length} active) across domains.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("jev")}
                    className="group p-4 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] hover:border-amber-500 text-left transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-amber-600 transition-colors">
                      TypeSafe Jev AI
                    </h3>
                    <p className="text-xs text-[#8E8B82] mt-1">
                      Adjust System 1 triage thresholds and test breaking headlines in real time.
                    </p>
                  </button>
                </div>
              </div>

              {/* Domain Breakdown & Recent Stories Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* Left 2 Cols: Recent Articles Dispatched */}
                <div className="admin-card lg:col-span-2 h-full flex flex-col justify-between p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#20201D] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                        Recent Stories Dispatched
                      </h3>
                      <p className="text-xs text-[#8E8B82]">
                        Latest intelligence articles synthesized by the system
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("articles")}
                      className="inline-flex items-center space-x-1 text-xs font-mono text-[#C96442] hover:underline"
                    >
                      <span>View all {articles.length}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {recentArticles.map((art) => (
                      <div
                        key={art.id}
                        className="p-3.5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0]/60 dark:bg-[#181816]/60 flex items-center justify-between gap-3 hover:border-[#C96442] transition-colors"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#EBE8DF] dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D]">
                              {art.category?.name || "Tech"}
                            </span>
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                                art.status === "published"
                                   ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              }`}
                            >
                              {art.status}
                            </span>
                            <span className="text-[11px] font-mono text-[#8E8B82]">
                              {formatArticleDate(art.published_at)}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-serif font-bold text-[#1F1E1D] dark:text-[#F5F2EB] truncate">
                            {art.title}
                          </h4>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="text-xs font-mono text-[#8E8B82] hidden sm:inline">
                            {art.views_count} views
                          </span>
                          <button
                            onClick={() => setEditingArticle(art)}
                            className="p-1.5 rounded-lg border border-[#EBE8DF] dark:border-[#33322E] hover:border-[#C96442] hover:text-[#C96442] text-[#686660] dark:text-[#A8A59D] transition-colors"
                            title="Edit Article"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 1 Col: Category / Domain Inventory Breakdown */}
                <div className="admin-card h-full flex flex-col justify-between p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#20201D] space-y-4">
                  <div className="pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
                    <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                      Domain Desk Volume
                    </h3>
                    <p className="text-xs text-[#8E8B82]">
                      Coverage balance across reporting verticals
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {categoryStats.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategoryFilter(cat.slug);
                          setActiveTab("articles");
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] hover:border-[#C96442] transition-colors text-left group"
                      >
                        <span className="text-xs font-medium text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] transition-colors">
                          {cat.name}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#EBE8DF] dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D]">
                          {cat.count} stories
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Monetization Status Summary Pill */}
                  <div className="mt-4 pt-4 border-t border-[#EBE8DF] dark:border-[#33322E] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#8E8B82] uppercase text-[10px]">Active Ad Slots</span>
                      <span className="font-mono font-bold text-emerald-600">{ads.filter((a) => a.is_active).length} Running</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#8E8B82] uppercase text-[10px]">Total Delivered Impressions</span>
                      <span className="font-mono font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                        {ads.reduce((sum, a) => sum + (a.impressions || 0), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ARTICLES VAULT */}
      {activeTab === "articles" && (
        <div className="space-y-4">
          {/* Admin Usable Tool: Instant Filter & Search Bar */}
          <div className="admin-card p-4 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#20201D] flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search headlines or slugs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-3 pr-8 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-xs text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs font-mono text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden"
              >
                <option value="all">All Domains ({articles.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs font-mono text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="archived">Archived</option>
              </select>

              {(searchQuery || categoryFilter !== "all" || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                    setCurrentPage(1);
                  }}
                  className="text-xs font-mono text-[#C96442] hover:underline px-2 py-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Floating / Sticky Bulk Action Bar */}
          {selectedIds.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#1F1E1D] dark:bg-[#FAF7F0] text-white dark:text-[#1F1E1D] flex flex-wrap items-center justify-between gap-3 shadow-lg border border-[#33322E] dark:border-[#EBE8DF] animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 dark:bg-black/10 text-white dark:text-[#1F1E1D]">
                  {selectedIds.length} stories selected
                </span>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-white/70 dark:text-black/70 hover:underline"
                >
                  Clear Selection
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                <button
                  onClick={() => handleBulkAction("publish")}
                  disabled={bulkLoading}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Publish All</span>
                </button>

                <button
                  onClick={() => handleBulkAction("draft")}
                  disabled={bulkLoading}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Move to Draft</span>
                </button>

                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkAction("category", e.target.value);
                      e.target.value = "";
                    }
                  }}
                  disabled={bulkLoading}
                  defaultValue=""
                  className="px-3 py-1.5 rounded-xl bg-white/15 dark:bg-black/10 text-white dark:text-black border border-white/20 dark:border-black/20 text-xs focus:outline-hidden"
                >
                  <option value="" disabled className="text-black">
                    Assign Category...
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="text-black">
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleBulkAction("delete")}
                  disabled={bulkLoading}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected</span>
                </button>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="admin-card rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#20201D] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F0] dark:bg-[#1A1917] border-b border-[#EBE8DF] dark:border-[#33322E] text-[#8E8B82] font-mono uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          displayedArticles.length > 0 &&
                          displayedArticles.every((a) => selectedIds.includes(a.id))
                        }
                        onChange={handleToggleSelectAll}
                        className="rounded border-[#D6D2C4] accent-[#C96442] cursor-pointer"
                        title="Select / Deselect all on this page"
                      />
                    </th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4">Headline / Slug</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Published</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE8DF] dark:divide-[#33322E]">
                  {displayedArticles.map((art) => (
                    <tr
                      key={art.id}
                      className={`transition-colors ${
                        selectedIds.includes(art.id)
                          ? "bg-[#C96442]/5 dark:bg-[#C96442]/10"
                          : "hover:bg-[#FAF7F0]/60 dark:hover:bg-[#2A2925]/60"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(art.id)}
                          onChange={() => handleToggleSelect(art.id)}
                          className="rounded border-[#D6D2C4] accent-[#C96442] cursor-pointer"
                        />
                      </td>

                      {/* Featured Star */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleFeatured(art)}
                          className={`p-1 rounded-md transition-colors ${
                            art.is_featured
                              ? "text-amber-500 hover:text-amber-600"
                              : "text-[#8E8B82] hover:text-amber-500"
                          }`}
                          title="Toggle Featured"
                        >
                          <Star
                            className="w-4 h-4"
                            fill={art.is_featured ? "currentColor" : "none"}
                          />
                        </button>
                      </td>

                      {/* Headline */}
                      <td className="py-3 px-4 max-w-xs sm:max-w-sm">
                        <div className="font-serif font-bold text-sm text-[#1F1E1D] dark:text-[#F5F2EB] line-clamp-1">
                          <a
                            href={`/article/${art.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#C96442] transition-colors inline-flex items-center gap-1"
                          >
                            <span>{art.title}</span>
                            <ExternalLink className="w-3 h-3 text-[#8E8B82] shrink-0" />
                          </a>
                        </div>
                        <span className="font-mono text-[10px] text-[#8E8B82] line-clamp-1">
                          /{art.slug}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF7F0] dark:bg-[#2A2925] border border-[#EBE8DF] dark:border-[#3A3832] text-[#C96442] font-mono text-[10px]">
                          {art.category.name}
                        </span>
                      </td>

                      {/* Rank */}
                      <td className="py-3 px-4 font-mono font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">
                        {art.rank_score}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <select
                          value={art.status}
                          onChange={(e) => toggleStatus(art, e.target.value)}
                          className={`text-[11px] font-mono px-2 py-1 rounded-lg border focus:outline-hidden ${
                            art.status === "published"
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                              : art.status === "draft"
                              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                              : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700"
                          }`}
                        >
                          <option value="published">published</option>
                          <option value="draft">draft</option>
                          <option value="archived">archived</option>
                        </select>
                      </td>

                      {/* Views */}
                      <td className="py-3 px-4 font-mono text-[#686660] dark:text-[#A8A59D]">
                        {art.views_count}
                      </td>

                      {/* Published Date */}
                      <td className="py-3 px-4 text-[#8E8B82] font-mono text-[11px]">
                        {formatArticleDate(art.published_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingArticle(art)}
                          className="p-1.5 rounded-md hover:bg-[#EBE8DF] dark:hover:bg-[#33322E] text-[#686660] dark:text-[#A8A59D] hover:text-[#C96442] dark:hover:text-[#C96442] transition-colors"
                          title="Edit Article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-[#8E8B82] hover:text-red-600 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {displayedArticles.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-xs font-mono text-[#8E8B82]">
                        No matching articles found. Try adjusting your search query or domain filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Bar (Strictly 50 Stories Per Page) */}
            <div className="p-4 bg-[#FAF7F0] dark:bg-[#1A1917] border-t border-[#EBE8DF] dark:border-[#33322E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="font-mono text-[#8E8B82] dark:text-[#A8A59D]">
                Showing <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">{filteredArticles.length === 0 ? 0 : startIndex + 1}</span> to{" "}
                <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">{Math.min(startIndex + PAGE_SIZE, filteredArticles.length)}</span> of{" "}
                <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">{filteredArticles.length}</span> news stories (50 per page)
              </div>

              <div className="flex items-center space-x-1.5 font-mono">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#252422] text-[#1F1E1D] dark:text-[#F5F2EB] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#C96442] transition-colors"
                >
                  « Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      currentPage === pageNum
                        ? "bg-[#C96442] text-white shadow-xs"
                        : "border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#252422] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1.5 rounded-lg border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#252422] text-[#1F1E1D] dark:text-[#F5F2EB] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#C96442] transition-colors"
                >
                  Next »
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL ARTICLE DISPATCH */}
      {activeTab === "create" && (
        <div className="w-full">
          <form onSubmit={handleCreateArticle} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Writing Canvas (8 cols) */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="admin-card h-full flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#EBE8DF] dark:border-[#33322E]">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C96442]" />
                    <h2 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                      Editorial Article Canvas
                    </h2>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-mono text-[#8E8B82]">
                    <span>{newBody ? newBody.trim().split(/\s+/).filter(Boolean).length : 0} words</span>
                    <span>&bull;</span>
                    <span>~{Math.max(1, Math.ceil((newBody ? newBody.trim().split(/\s+/).filter(Boolean).length : 0) / 200))} min read</span>
                  </div>
                </div>

                <div className="space-y-5 flex-1 flex flex-col">
                  {/* Headline */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D]">
                        Headline *
                      </label>
                      <button
                        type="button"
                        onClick={() => handleOpenAiAssist("title", "create", newTitle, newCategory)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#C96442] hover:underline cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>✨ AI Headline Copilot</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. DeepSeek-V3 Open Model Weights Cause Shockwaves Across Industry..."
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-base sm:text-lg font-serif font-bold text-[#1F1E1D] dark:text-[#F5F2EB] placeholder:font-sans placeholder:font-normal placeholder:text-sm placeholder:text-[#8E8B82] focus:outline-none focus:border-[#C96442] shadow-2xs"
                    />
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D]">
                        Executive 1-Line Summary *
                      </label>
                      <button
                        type="button"
                        onClick={() => handleOpenAiAssist("summary", "create", newSummary || newTitle, newCategory)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#C96442] hover:underline cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>✨ AI Hook Assist</span>
                      </button>
                    </div>
                    <textarea
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                      placeholder="High-signal concise analytical overview that captures reader attention immediately..."
                      rows={2}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] leading-relaxed focus:outline-none focus:border-[#C96442]"
                    />
                  </div>

                  {/* Markdown Body */}
                  <div className="flex-1 flex flex-col min-h-[260px]">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D]">
                        Article Body (Markdown Supported) *
                      </label>
                      <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[#8E8B82]">
                        <span className="px-1.5 py-0.5 rounded bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]">## Heading</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]">**bold**</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]">&gt; quote</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]">```code```</span>
                      </div>
                    </div>
                    <textarea
                      value={newBody}
                      onChange={(e) => setNewBody(e.target.value)}
                      placeholder="## Section 1: The Core Breakthrough&#10;&#10;In-depth technical analysis and context here...&#10;&#10;## Market Implications&#10;&#10;Strategic impact on founders, builders and enterprise..."
                      rows={10}
                      required
                      className="w-full flex-1 min-h-[220px] p-4 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] font-mono leading-relaxed focus:outline-none focus:border-[#C96442]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Publishing & Metadata Sidebar (4 cols) */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="admin-card h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-6">
                <div className="space-y-6">
                  {/* 1. Header & Live Dispatch Action */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4 text-[#C96442]" />
                        <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                          Publishing Desk
                        </h3>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                        Ready to Dispatch
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-xl bg-[#C96442] hover:bg-[#B35334] text-white text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? "Publishing Story..." : "Publish Article Immediately"}</span>
                    </button>

                    <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] cursor-pointer hover:border-[#C96442]/40 transition-colors">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={newFeatured}
                        onChange={(e) => setNewFeatured(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded text-[#C96442] accent-[#C96442]"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] block">
                          Pin as Featured Story
                        </span>
                        <span className="text-[11px] text-[#8E8B82] block leading-tight">
                          Display prominently in homepage hero spotlight
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* 2. Editorial Domain Desk */}
                  <div className="pt-4 border-t border-[#EBE8DF] dark:border-[#33322E] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D]">
                        Editorial Domain Desk
                      </label>
                      <Tag className="w-3.5 h-3.5 text-[#C96442]" />
                    </div>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-sm font-medium text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-none focus:border-[#C96442]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Cover Media */}
                  <div className="pt-4 border-t border-[#EBE8DF] dark:border-[#33322E] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D]">
                        Cover Media
                      </label>
                      <button
                        type="button"
                        onClick={() => handleOpenImagePicker("create")}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#C96442] hover:underline cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>🔍 Browse Photos</span>
                      </button>
                    </div>

                    <input
                      type="url"
                      value={newCover}
                      onChange={(e) => setNewCover(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-sm font-mono text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-none focus:border-[#C96442]"
                    />

                    {/* Live Thumbnail Box */}
                    {newCover ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] shadow-2xs">
                        <img
                          src={newCover}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white">
                          Live Cover Preview
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video rounded-xl border border-dashed border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0]/50 dark:bg-[#181816]/50 flex flex-col items-center justify-center p-4 text-center">
                        <Camera className="w-6 h-6 text-[#8E8B82] mb-1.5" />
                        <span className="text-xs text-[#8E8B82]">No cover image set</span>
                        <span className="text-[10px] text-[#8E8B82]/80 mt-0.5">Click &apos;Browse Photos&apos; or paste URL</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Pre-Flight Publication Checklist */}
                <div className="pt-4 border-t border-[#EBE8DF] dark:border-[#33322E] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D]">
                      Pre-Flight Editorial Health
                    </span>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {[
                        newTitle.trim().length >= 10,
                        newSummary.trim().length >= 15,
                        (newBody ? newBody.trim().split(/\s+/).filter(Boolean).length : 0) >= 30,
                        Boolean(newCover),
                      ].filter(Boolean).length} / 4 Checks
                    </span>
                  </div>

                  <div className="space-y-2 p-3.5 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[#686660] dark:text-[#A8A59D]">Headline Signal</span>
                      {newTitle.trim().length >= 10 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                          <Check className="w-3.5 h-3.5" /> High Signal
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">Drafting headline</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#686660] dark:text-[#A8A59D]">Executive Hook</span>
                      {newSummary.trim().length >= 15 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Hook Formed
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">Summary needed</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#686660] dark:text-[#A8A59D]">Body Depth</span>
                      {(newBody ? newBody.trim().split(/\s+/).filter(Boolean).length : 0) >= 30 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                          <Check className="w-3.5 h-3.5" /> {newBody.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          {newBody ? newBody.trim().split(/\s+/).filter(Boolean).length : 0} words (draft)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#686660] dark:text-[#A8A59D]">Cover Visual</span>
                      {newCover ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Creative Attached
                        </span>
                      ) : (
                        <span className="text-[#8E8B82]">Optional editorial</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: PIPELINE INGESTION API & KEYS */}
      {activeTab === "api" && (
        <div className="w-full space-y-8">
          {/* 1. TOP FULL-WIDTH HERO CARD: Key & Ingest Controls */}
          <div className="admin-card p-6 sm:p-8 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Side: Agent Ingestion Key (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#C96442]/10 border border-[#C96442]/20 flex items-center justify-center text-[#C96442]">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                          NewsFlow Agent Ingestion Key
                        </h3>
                        <p className="text-xs text-[#8E8B82]">
                          Bearer authentication token for autonomous background crawlers
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={copyApiKey}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs font-mono font-medium text-[#C96442] hover:border-[#C96442]/50 transition-colors cursor-pointer"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? "Copied Key" : "Copy Token"}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] font-mono text-sm text-[#1F1E1D] dark:text-[#F5F2EB] select-all break-all shadow-2xs">
                    {apiKey}
                  </div>
                </div>

                <p className="text-xs text-[#686660] dark:text-[#A8A59D] leading-relaxed">
                  Pass this secret token in the <code className="text-[#C96442] font-semibold">x-api-key</code> HTTP header or as Bearer token when dispatching stories from autonomous Python crawlers.
                </p>
              </div>

              {/* Right Side: Immediate Pipeline Controller (5 cols) */}
              <div className="lg:col-span-5 h-full flex flex-col justify-between p-5 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#33322E]">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D]">
                      Ingest Cycle Controller
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${pipelineRunning ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`} />
                      <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {pipelineRunning ? "Ingesting..." : "Armed & Ready"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#8E8B82] leading-relaxed">
                    Trigger an immediate autonomous ingestion pass across active RSS feeds and HackerNews APIs.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerPipeline}
                  disabled={pipelineRunning}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Zap className={`w-4 h-4 ${pipelineRunning ? "animate-spin text-amber-200" : ""}`} />
                  <span>{pipelineRunning ? "Ingestion in Progress..." : "Run Ingestion Cycle Immediately ⚡"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. MIDDLE FULL-WIDTH CARD: API Protocol & Endpoints */}
          <div className="admin-card w-full p-6 sm:p-8 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#EBE8DF] dark:border-[#33322E] gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C96442]/10 border border-[#C96442]/20 flex items-center justify-center text-[#C96442]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    API Protocol &amp; Endpoints
                  </h3>
                  <p className="text-xs text-[#8E8B82] mt-0.5">
                    Production HTTP REST specifications for crawler ingestion, autonomous triggers, and domain taxonomies
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("http://localhost:3000");
                    showToast("Base URL copied to clipboard!");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F0] dark:bg-[#181816] text-[#686660] dark:text-[#A8A59D] border border-[#EBE8DF] dark:border-[#33322E] text-xs font-mono hover:border-[#C96442]/40 transition-colors cursor-pointer"
                  title="Click to copy base URL"
                >
                  <span className="text-[#8E8B82]">Base:</span>
                  <code className="text-[#C96442] font-semibold">http://localhost:3000</code>
                  <Copy className="w-3 h-3 text-[#8E8B82]" />
                </button>
                <span className="text-xs font-mono px-2.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                  REST JSON
                </span>
              </div>
            </div>

            {/* Endpoints Directory Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D] px-1">
                <span>API Route Directory</span>
                <span>Select to inspect in terminal probe</span>
              </div>

              <div className="rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0]/40 dark:bg-[#181816]/40 divide-y divide-[#EBE8DF] dark:divide-[#33322E] overflow-hidden">
                {/* Endpoint Row 1: /api/articles */}
                <div
                  onClick={() => setSelectedEndpointProbe("articles")}
                  className={`p-4 sm:p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all cursor-pointer ${
                    selectedEndpointProbe === "articles"
                      ? "bg-[#C96442]/5 dark:bg-[#C96442]/10 ring-1 ring-inset ring-[#C96442]/40"
                      : "hover:bg-[#FAF7F0] dark:hover:bg-[#181816]"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <span className="px-2.5 py-1 rounded-lg bg-[#C96442] text-white font-mono font-bold text-xs shrink-0 shadow-2xs">
                      POST
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                          /api/articles
                        </code>
                        <span className="text-[11px] font-sans font-medium text-[#8E8B82] hidden sm:inline">
                          &bull; Dispatch &amp; Ingest Story
                        </span>
                      </div>
                      <p className="text-xs text-[#686660] dark:text-[#A8A59D] leading-relaxed">
                        Ingests a structured breaking story into the SQLite vault with rank scoring and tag indexing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#FAF7F0] dark:bg-[#20201D] text-[#8E8B82] border border-[#EBE8DF] dark:border-[#33322E] hidden lg:inline">
                      Body: JSON
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-xs font-mono font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Protected</span>
                    </span>
                    <span className={`text-xs font-mono font-medium ${selectedEndpointProbe === "articles" ? "text-[#C96442]" : "text-[#8E8B82]"}`}>
                      {selectedEndpointProbe === "articles" ? "● Active Probe" : "Inspect →"}
                    </span>
                  </div>
                </div>

                {/* Endpoint Row 2: /api/pipeline/trigger */}
                <div
                  onClick={() => setSelectedEndpointProbe("trigger")}
                  className={`p-4 sm:p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all cursor-pointer ${
                    selectedEndpointProbe === "trigger"
                      ? "bg-[#C96442]/5 dark:bg-[#C96442]/10 ring-1 ring-inset ring-[#C96442]/40"
                      : "hover:bg-[#FAF7F0] dark:hover:bg-[#181816]"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <span className="px-2.5 py-1 rounded-lg bg-[#C96442] text-white font-mono font-bold text-xs shrink-0 shadow-2xs">
                      POST
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                          /api/pipeline/trigger
                        </code>
                        <span className="text-[11px] font-sans font-medium text-[#8E8B82] hidden sm:inline">
                          &bull; Autonomous Crawler Cycle
                        </span>
                      </div>
                      <p className="text-xs text-[#686660] dark:text-[#A8A59D] leading-relaxed">
                        Webhook trigger launching an immediate parallel sweep across RSS wires, HackerNews, and arXiv.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#FAF7F0] dark:bg-[#20201D] text-[#8E8B82] border border-[#EBE8DF] dark:border-[#33322E] hidden lg:inline">
                      Webhook Token
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-xs font-mono font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Protected</span>
                    </span>
                    <span className={`text-xs font-mono font-medium ${selectedEndpointProbe === "trigger" ? "text-[#C96442]" : "text-[#8E8B82]"}`}>
                      {selectedEndpointProbe === "trigger" ? "● Active Probe" : "Inspect →"}
                    </span>
                  </div>
                </div>

                {/* Endpoint Row 3: /api/categories */}
                <div
                  onClick={() => setSelectedEndpointProbe("categories")}
                  className={`p-4 sm:p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all cursor-pointer ${
                    selectedEndpointProbe === "categories"
                      ? "bg-[#C96442]/5 dark:bg-[#C96442]/10 ring-1 ring-inset ring-[#C96442]/40"
                      : "hover:bg-[#FAF7F0] dark:hover:bg-[#181816]"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <span className="px-2.5 py-1 rounded-lg bg-stone-600 text-white font-mono font-bold text-xs shrink-0 shadow-2xs">
                      GET
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                          /api/categories
                        </code>
                        <span className="text-[11px] font-sans font-medium text-[#8E8B82] hidden sm:inline">
                          &bull; Domain Desks Taxonomy
                        </span>
                      </div>
                      <p className="text-xs text-[#686660] dark:text-[#A8A59D] leading-relaxed">
                        Fetches active editorial domain verticals (AI &amp; Robotics, Cloud, Crypto, Security, DeepTech, Science).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#FAF7F0] dark:bg-[#20201D] text-[#8E8B82] border border-[#EBE8DF] dark:border-[#33322E] hidden lg:inline">
                      Read Only
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-500/10 text-stone-600 dark:text-stone-400 border border-stone-500/20 text-xs font-mono font-semibold">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Public</span>
                    </span>
                    <span className={`text-xs font-mono font-medium ${selectedEndpointProbe === "categories" ? "text-[#C96442]" : "text-[#8E8B82]"}`}>
                      {selectedEndpointProbe === "categories" ? "● Active Probe" : "Inspect →"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Terminal Probe & Header Console */}
            <div className="pt-2 space-y-3">
              <div className="p-5 rounded-2xl bg-[#141412] border border-[#2E2D29] space-y-4 shadow-inner text-[#F5F2EB]">
                {/* Console Top Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#2E2D29] gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
                      <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
                      <span className="w-3 h-3 rounded-full bg-[#10B981]/80" />
                    </div>
                    <span className="text-xs font-mono text-[#8E8B82] font-semibold">
                      Terminal Ingestion Probe — {selectedEndpointProbe === "trigger" ? "POST /api/pipeline/trigger" : selectedEndpointProbe === "articles" ? "POST /api/articles" : "GET /api/categories"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Endpoint Selector Tabs */}
                    <div className="flex items-center p-0.5 rounded-lg bg-[#20201D] border border-[#33322E] text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setSelectedEndpointProbe("trigger")}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          selectedEndpointProbe === "trigger"
                            ? "bg-[#C96442] text-white font-semibold"
                            : "text-[#8E8B82] hover:text-[#F5F2EB]"
                        }`}
                      >
                        trigger
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedEndpointProbe("articles")}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          selectedEndpointProbe === "articles"
                            ? "bg-[#C96442] text-white font-semibold"
                            : "text-[#8E8B82] hover:text-[#F5F2EB]"
                        }`}
                      >
                        articles
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedEndpointProbe("categories")}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          selectedEndpointProbe === "categories"
                            ? "bg-[#C96442] text-white font-semibold"
                            : "text-[#8E8B82] hover:text-[#F5F2EB]"
                        }`}
                      >
                        categories
                      </button>
                    </div>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const cmd = selectedEndpointProbe === "trigger"
                          ? `curl -X POST http://localhost:3000/api/pipeline/trigger \\\n  -H "x-api-key: ${apiKey}"`
                          : selectedEndpointProbe === "articles"
                          ? `curl -X POST http://localhost:3000/api/articles \\\n  -H "x-api-key: ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "title": "Quantum Supremacy Milestone",\n    "summary": "Coherence threshold achieved",\n    "category": "AI & Robotics"\n  }'`
                          : `curl -X GET http://localhost:3000/api/categories`;
                        navigator.clipboard.writeText(cmd);
                        setCopiedCurl(true);
                        setTimeout(() => setCopiedCurl(false), 2000);
                        showToast("cURL probe copied to clipboard!");
                      }}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors cursor-pointer"
                    >
                      {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCurl ? "Copied" : "Copy cURL"}</span>
                    </button>
                  </div>
                </div>

                {/* Terminal Code Display */}
                <pre className="text-xs font-mono overflow-x-auto leading-relaxed text-[#F5F2EB] select-all">
                  {selectedEndpointProbe === "trigger" && (
`curl -X POST http://localhost:3000/api/pipeline/trigger \\
  -H "x-api-key: ${apiKey}"`
                  )}
                  {selectedEndpointProbe === "articles" && (
`curl -X POST http://localhost:3000/api/articles \\
  -H "x-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Quantum Supremacy Milestone Reached",
    "summary": "Breakthrough in topological error correction enables sustained coherence.",
    "category": "AI & Robotics"
  }'`
                  )}
                  {selectedEndpointProbe === "categories" && (
`curl -X GET http://localhost:3000/api/categories`
                  )}
                </pre>

                {/* Console Specification Footer */}
                <div className="pt-3 border-t border-[#2E2D29] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#8E8B82]">
                  <div className="flex items-center gap-3">
                    <span>Auth: <code className="text-[#C96442]">x-api-key</code> or <code className="text-[#C96442]">Bearer &lt;token&gt;</code></span>
                    <span>&bull;</span>
                    <span>Content-Type: <code className="text-emerald-400">application/json</code></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400">200 OK</span>
                    <span>&bull;</span>
                    <span className="text-amber-400">401 Unauthorized</span>
                    <span>&bull;</span>
                    <span className="text-red-400">400 Bad Schema</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. BOTTOM FULL-WIDTH CARD: Client Integration SDK Studio */}
          <div className="admin-card w-full p-6 sm:p-8 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-6">
            {/* Header & Language Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EBE8DF] dark:border-[#33322E] gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#C96442]/10 border border-[#C96442]/20 flex items-center justify-center text-[#C96442]">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    Client Integration SDK
                  </h3>
                  <p className="text-xs text-[#8E8B82]">
                    Production dispatch code for autonomous agents, background crawlers, and scrapers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Language Switcher Tabs */}
                <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]">
                  <button
                    type="button"
                    onClick={() => setApiSnippetLang("python")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      apiSnippetLang === "python"
                        ? "bg-[#C96442] text-white shadow-2xs"
                        : "text-[#686660] dark:text-[#A8A59D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
                    }`}
                  >
                    Python (requests)
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiSnippetLang("curl")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      apiSnippetLang === "curl"
                        ? "bg-[#C96442] text-white shadow-2xs"
                        : "text-[#686660] dark:text-[#A8A59D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
                    }`}
                  >
                    cURL (Bash)
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiSnippetLang("node")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      apiSnippetLang === "node"
                        ? "bg-[#C96442] text-white shadow-2xs"
                        : "text-[#686660] dark:text-[#A8A59D] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
                    }`}
                  >
                    Node.js (TypeScript)
                  </button>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => {
                    const snippet = apiSnippetLang === "python"
                      ? `import requests\n\nurl = "http://localhost:3000/api/articles"\nheaders = {\n    "x-api-key": "${apiKey}",\n    "Content-Type": "application/json"\n}\npayload = {\n    "title": "Quantum Supremacy Milestone Reached",\n    "summary": "Breakthrough in topological error correction enables sustained coherence.",\n    "body": "## The Coherence Threshold\\n\\nResearchers have crossed the fault-tolerant threshold...",\n    "category": "AI & Robotics",\n    "cover_image_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",\n    "source_url": "https://nature.com/articles/quantum-supremacy-milestone",\n    "rank_score": 94,\n    "tags": ["Quantum", "Hardware", "DeepTech"],\n    "status": "published"\n}\n\nresponse = requests.post(url, json=payload, headers=headers)\nprint("Ingestion Status:", response.status_code)\nprint("Response JSON:", response.json())`
                      : apiSnippetLang === "curl"
                      ? `curl -X POST http://localhost:3000/api/articles \\\n  -H "x-api-key: ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "title": "Quantum Supremacy Milestone Reached",\n    "summary": "Breakthrough in topological error correction enables sustained coherence.",\n    "body": "## The Coherence Threshold\\n\\nResearchers have crossed the fault-tolerant threshold...",\n    "category": "AI & Robotics",\n    "cover_image_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",\n    "source_url": "https://nature.com/articles/quantum-supremacy-milestone",\n    "rank_score": 94,\n    "tags": ["Quantum", "Hardware", "DeepTech"],\n    "status": "published"\n  }'`
                      : `const response = await fetch("http://localhost:3000/api/articles", {\n  method: "POST",\n  headers: {\n    "x-api-key": "${apiKey}",\n    "Content-Type": "application/json",\n  },\n  body: JSON.stringify({\n    title: "Quantum Supremacy Milestone Reached",\n    summary: "Breakthrough in topological error correction enables sustained coherence.",\n    body: "## The Coherence Threshold\\n\\nResearchers have crossed the fault-tolerant threshold...",\n    category: "AI & Robotics",\n    cover_image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",\n    source_url: "https://nature.com/articles/quantum-supremacy-milestone",\n    rank_score": 94,\n    tags: ["Quantum", "Hardware", "DeepTech"],\n    status: "published",\n  }),\n});\nconst data = await response.json();\nconsole.log("Ingestion Response:", data);`;
                    navigator.clipboard.writeText(snippet);
                    setCopiedSnippet(true);
                    setTimeout(() => setCopiedSnippet(false), 2000);
                    showToast("SDK snippet copied to clipboard!");
                  }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-xs font-mono font-medium text-[#C96442] hover:border-[#C96442]/50 transition-colors cursor-pointer shrink-0"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? "Copied Snippet" : "Copy Code"}</span>
                </button>
              </div>
            </div>

            {/* Code Studio Box */}
            <div className="relative">
              <pre className="p-5 rounded-2xl bg-[#181816] text-[#F5F2EB] text-xs font-mono overflow-x-auto leading-relaxed border border-[#33322E] shadow-inner">
                {apiSnippetLang === "python" && (
`import requests

url = "http://localhost:3000/api/articles"
headers = {
    "x-api-key": "${apiKey}",
    "Content-Type": "application/json"
}
payload = {
    "title": "Quantum Supremacy Milestone Reached",
    "summary": "Breakthrough in topological error correction enables sustained coherence.",
    "body": "## The Coherence Threshold\\n\\nResearchers have crossed the fault-tolerant threshold...",
    "category": "AI & Robotics",
    "cover_image_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    "source_url": "https://nature.com/articles/quantum-supremacy-milestone",
    "rank_score": 94,
    "tags": ["Quantum", "Hardware", "DeepTech"],
    "status": "published"
}

response = requests.post(url, json=payload, headers=headers)
print("Ingestion Status:", response.status_code)
print("Response JSON:", response.json())`
                )}
                {apiSnippetLang === "curl" && (
`curl -X POST http://localhost:3000/api/articles \\
  -H "x-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Quantum Supremacy Milestone Reached",
    "summary": "Breakthrough in topological error correction enables sustained coherence.",
    "body": "## The Coherence Threshold\\n\\nResearchers have crossed the fault-tolerant threshold...",
    "category": "AI & Robotics",
    "cover_image_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    "source_url": "https://nature.com/articles/quantum-supremacy-milestone",
    "rank_score": 94,
    "tags": ["Quantum", "Hardware", "DeepTech"],
    "status": "published"
  }'`
                )}
                {apiSnippetLang === "node" && (
`// Node.js (v18+) or TypeScript Ingestion Client
const response = await fetch("http://localhost:3000/api/articles", {
  method: "POST",
  headers: {
    "x-api-key": "${apiKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Quantum Supremacy Milestone Reached",
    summary: "Breakthrough in topological error correction enables sustained coherence.",
    body: "## The Coherence Threshold\\n\\nResearchers have crossed the fault-tolerant threshold...",
    category: "AI & Robotics",
    cover_image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    source_url: "https://nature.com/articles/quantum-supremacy-milestone",
    rank_score": 94,
    tags: ["Quantum", "Hardware", "DeepTech"],
    status: "published",
  }),
});

const data = await response.json();
console.log("Ingestion Response:", data);`
                )}
              </pre>
            </div>

            {/* Studio Footer Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EBE8DF]/60 dark:border-[#33322E]/60 text-xs font-mono text-[#8E8B82]">
              <div className="flex items-center gap-4">
                <span>Runtime: <span className="text-[#1F1E1D] dark:text-[#F5F2EB]">Python 3.10+ &bull; Node 18+ &bull; cURL</span></span>
                <span>&bull;</span>
                <span>Format: <span className="text-emerald-600 font-semibold">application/json</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Auto-deduplicated via unique <code className="text-[#C96442]">source_url</code></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TYPESAFE JEV AI (SYSTEM 1 DECISION ENGINE) */}
      {activeTab === "jev" && (
        <div className="w-full space-y-8">
          {/* Header Banner & Status */}
          <div className="admin-card p-6 sm:p-7 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#C96442]/10 border border-[#C96442]/20 flex items-center justify-center text-[#C96442]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    TypeSafe Jev AI — System 1 Decision Engine
                  </h2>
                </div>
                <p className="text-sm text-[#686660] dark:text-[#A8A59D] leading-relaxed max-w-4xl">
                  Sub-150ms parallel evaluation for incoming raw news. Evaluates breakthrough significance, 
                  automatically maps to our 6 domains, scores journalistic impact, and filters promotional noise before generative synthesis.
                </p>
              </div>

              <div className="shrink-0">
                {jevHasKey ? (
                  <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>System 1 Active &amp; Armed</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-mono font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Setup Required</span>
                  </div>
                )}
              </div>
            </div>

            {jevHasKey && (
              <div className="pt-3 border-t border-[#EBE8DF] dark:border-[#33322E] flex flex-wrap items-center gap-5 text-xs font-mono text-[#686660] dark:text-[#A8A59D]">
                <div>
                  <span className="text-[#8E8B82]">Active Key:</span>{" "}
                  <code className="px-2 py-1 rounded-md bg-[#FAF7F0] dark:bg-[#181816] text-[#1F1E1D] dark:text-[#F5F2EB] border border-[#EBE8DF] dark:border-[#33322E]">
                    {jevMaskedKey || "Configured"}
                  </code>
                </div>
                <div>
                  <span className="text-[#8E8B82]">Min Threshold:</span>{" "}
                  <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">{jevMinImpact}/10</span>
                </div>
                <div>
                  <span className="text-[#8E8B82]">Auto-Featured:</span>{" "}
                  <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">≥ {jevAutoFeature}/10</span>
                </div>
                <div>
                  <span className="text-[#8E8B82]">Synced:</span>{" "}
                  <span className="text-emerald-600 font-semibold">Web &amp; 24/7 Pipeline</span>
                </div>
              </div>
            )}
          </div>

          {/* 2-Column Grid: Settings & Playground */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Column 1: Configuration Form Card */}
            <div className="flex flex-col space-y-6">
              <div className="admin-card flex-1 flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
                  <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    API Key &amp; Triage Settings
                  </h3>
                  <a
                    href="https://console.typesafe.ai"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-[#C96442] hover:underline flex items-center gap-1"
                  >
                    <span>console.typesafe.ai</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <form onSubmit={handleSaveJevKey} className="space-y-5">
                  {/* API Key Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase font-semibold text-[#686660] dark:text-[#A8A59D] tracking-wider">
                        TypeSafe Jev API Key
                      </label>
                      {jevHasKey && (
                        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ Current Key Saved
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showJevKey ? "text" : "password"}
                        value={jevKeyInput}
                        onChange={(e) => setJevKeyInput(e.target.value)}
                        placeholder={jevMaskedKey || "Enter your TypeSafe API key (e.g. ts_live_...)"}
                        className="w-full pl-4 pr-20 py-3 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] font-mono text-sm text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowJevKey(!showJevKey)}
                        className="absolute right-3 top-3 text-xs text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB] font-medium"
                      >
                        {showJevKey ? "Hide" : "Show"}
                      </button>
                    </div>
                    <p className="text-xs text-[#8E8B82] leading-relaxed">
                      Saving writes securely to SQLite <code className="text-[#C96442] font-semibold">SystemSetting</code> and synchronizes across Web and 24/7 background ingest routines.
                    </p>
                  </div>

                  {/* Thresholds Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono uppercase font-semibold text-[#686660] dark:text-[#A8A59D]">
                          Min Impact
                        </label>
                        <span className="font-mono text-sm font-bold text-[#C96442]">
                          {jevMinImpact} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5.0"
                        max="9.0"
                        step="0.5"
                        value={jevMinImpact}
                        onChange={(e) => setJevMinImpact(parseFloat(e.target.value))}
                        className="w-full accent-[#C96442] cursor-pointer"
                      />
                      <p className="text-[11px] text-[#8E8B82] leading-tight">
                        Stories scored below this are discarded before expensive LLM synthesis.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono uppercase font-semibold text-[#686660] dark:text-[#A8A59D]">
                          Auto-Feature
                        </label>
                        <span className="font-mono text-sm font-bold text-[#C96442]">
                          ≥ {jevAutoFeature} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="7.5"
                        max="9.5"
                        step="0.5"
                        value={jevAutoFeature}
                        onChange={(e) => setJevAutoFeature(parseFloat(e.target.value))}
                        className="w-full accent-[#C96442] cursor-pointer"
                      />
                      <p className="text-[11px] text-[#8E8B82] leading-tight">
                        High-impact breaking news automatically pins as Featured Story in homepage spotlight.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={jevSaving}
                      className="px-5 py-3 rounded-xl bg-[#C96442] hover:bg-[#b05334] text-white text-sm font-medium transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{jevSaving ? "Saving..." : "Save Settings"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestJev}
                      disabled={jevTesting || (!jevKeyInput && !jevHasKey)}
                      className="px-5 py-3 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#252422] text-[#1F1E1D] dark:text-[#F5F2EB] text-sm font-medium hover:border-[#C96442] hover:text-[#C96442] transition-colors flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
                    >
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <span>{jevTesting ? "Testing Latency..." : "Test Connection &amp; Latency ⚡"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Test Result Diagnostic Card */}
              {jevTestResult && (
                <div
                  className={`p-6 rounded-3xl border transition-all ${
                    jevTestResult.success
                      ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20"
                      : "border-red-500/30 bg-red-500/5 dark:bg-red-950/20"
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-inherit">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          jevTestResult.success ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1F1E1D] dark:text-[#F5F2EB]">
                        {jevTestResult.success ? "TypeSafe Jev Engine: Operational" : "Connection Diagnostic Failed"}
                      </h4>
                    </div>
                    {jevTestResult.latency_ms && (
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-white dark:bg-[#20201D] border border-inherit text-[#C96442]">
                        ⚡ {jevTestResult.latency_ms} ms Latency
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-3 text-sm">
                    <p className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">
                      {jevTestResult.message || jevTestResult.error}
                    </p>

                    {jevTestResult.decision && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        <div className="p-3 rounded-xl bg-white dark:bg-[#20201D] border border-inherit">
                          <span className="text-[10px] font-mono text-[#8E8B82] uppercase block">Domain</span>
                          <p className="font-mono font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] text-sm mt-0.5">
                            {jevTestResult.decision.domain}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-[#20201D] border border-inherit">
                          <span className="text-[10px] font-mono text-[#8E8B82] uppercase block">Impact Score</span>
                          <p className="font-mono font-semibold text-[#C96442] text-sm mt-0.5">
                            {jevTestResult.decision.impact_score} / 10
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-[#20201D] border border-inherit">
                          <span className="text-[10px] font-mono text-[#8E8B82] uppercase block">Signal</span>
                          <p className="font-mono font-semibold text-emerald-600 text-sm mt-0.5">
                            {jevTestResult.decision.is_signal ? "High Signal" : "Low Signal"}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-[#20201D] border border-inherit">
                          <span className="text-[10px] font-mono text-[#8E8B82] uppercase block">Confidence</span>
                          <p className="font-mono font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] text-sm mt-0.5">
                            {Math.round((jevTestResult.decision.confidence || 0.95) * 100)}%
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Interactive Sandbox Playground Card */}
            <div className="flex flex-col">
              <div className="admin-card h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    Interactive Jev Triage Sandbox
                  </h3>
                  <p className="text-xs text-[#8E8B82] mt-0.5">
                    Paste any breaking news headline and summary to test instant System 1 evaluation.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-[#C96442] px-2.5 py-1 rounded-full bg-[#C96442]/10 border border-[#C96442]/20">
                  ~100ms Decision
                </span>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D]">
                  Quick Test Presets
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSandboxTitle("DeepSeek-V3 Open Weights Shock Enterprise AI Markets");
                      setSandboxSummary("DeepSeek has released 671B open parameter mixture-of-experts model matching closed frontier reasoning at fraction of training cost.");
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-xs font-mono text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442] hover:text-[#C96442] transition-colors"
                  >
                    🤖 DeepSeek-V3
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSandboxTitle("Revolutionary Web3 Memecoin DAO Launches Staking Pool");
                      setSandboxSummary("Brand new dog token promises 10,000% APY and revolutionary decentralized liquidity farming on Solana.");
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-xs font-mono text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442] hover:text-[#C96442] transition-colors"
                  >
                    🪙 Crypto PR Noise
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSandboxTitle("Physicists Cross Fault-Tolerant Quantum Coherence Threshold");
                      setSandboxSummary("Topological surface code suppresses physical qubit errors across 100 logical cycles for the first time.");
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-xs font-mono text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442] hover:text-[#C96442] transition-colors"
                  >
                    ⚛️ Quantum Chip
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D] mb-1.5">
                    Test Headline
                  </label>
                  <input
                    type="text"
                    value={sandboxTitle}
                    onChange={(e) => setSandboxTitle(e.target.value)}
                    placeholder="Enter test breaking news headline..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-[#686660] dark:text-[#A8A59D] mb-1.5">
                    Test Excerpt / Summary
                  </label>
                  <textarea
                    rows={3}
                    value={sandboxSummary}
                    onChange={(e) => setSandboxSummary(e.target.value)}
                    placeholder="Enter short article summary or lead paragraph..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleRunSandbox}
                    disabled={sandboxRunning || !sandboxTitle.trim()}
                    className="w-full py-3 rounded-xl bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] text-sm font-medium hover:bg-[#C96442] dark:hover:bg-[#C96442] dark:hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-xs"
                  >
                    <Play className="w-4 h-4" />
                    <span>{sandboxRunning ? "Evaluating in ~100ms..." : "Run Instant Jev Decision"}</span>
                  </button>
                </div>

                {sandboxResult && (
                  <div className="mt-4 p-5 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-sm">
                        <Check className="w-4 h-4" /> Verdict: {sandboxResult.triage.recommendation}
                      </span>
                      <span className="text-[#C96442] font-bold text-sm">
                        ⚡ {sandboxResult.latency_ms} ms
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white dark:bg-[#20201D] border border-[#EBE8DF] dark:border-[#33322E]">
                        <span className="text-[10px] text-[#8E8B82] block">Domain</span>
                        <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] text-sm block mt-0.5">
                          {sandboxResult.triage.domain}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#20201D] border border-[#EBE8DF] dark:border-[#33322E]">
                        <span className="text-[10px] text-[#8E8B82] block">Impact</span>
                        <span className="font-semibold text-[#C96442] text-sm block mt-0.5">
                          {sandboxResult.triage.impact_score} / 10
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#20201D] border border-[#EBE8DF] dark:border-[#33322E]">
                        <span className="text-[10px] text-[#8E8B82] block">Rank Score</span>
                        <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] text-sm block mt-0.5">
                          {sandboxResult.triage.rank_score} / 100
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#20201D] border border-[#EBE8DF] dark:border-[#33322E]">
                        <span className="text-[10px] font-mono text-[#8E8B82] block">Confidence</span>
                        <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB] text-sm block mt-0.5">
                          {Math.round((sandboxResult.triage.confidence || 0.95) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* TAB 5: MONETIZATION & DOMAIN ADS */}
      {activeTab === "ads" && (
        <div className="w-full space-y-5">
          {/* Header Banner & Executive Performance Metrics (Compact & Short) */}
          {(() => {
            const totalActiveAds = ads.filter((a) => a.is_active).length;
            const totalImpressions = ads.reduce((sum, a) => sum + (a.impressions || 0), 0);
            const totalClicks = ads.reduce((sum, a) => sum + (a.clicks || 0), 0);
            const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

            return (
              <div className="admin-card p-4 sm:p-5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-3.5">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  {/* Left: Concise Title, Badges & Subtitle */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="w-6 h-6 rounded-lg bg-[#C96442]/10 border border-[#C96442]/20 flex items-center justify-center text-[#C96442] shrink-0">
                        <Megaphone className="w-3.5 h-3.5" />
                      </div>
                      <h2 className="font-serif text-base sm:text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                        Right-Sidebar Monetization &amp; Domain Ad Inventory
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                      </span>
                    </div>
                    <p className="text-xs text-[#686660] dark:text-[#A8A59D] max-w-2xl leading-relaxed">
                      Custom 300×250 &amp; 300×600 ad inventory across 7 editorial desks with automatic Global fallback. Supports direct image banners &amp; script tags.
                    </p>
                  </div>

                  {/* Right: 4 Compact Revenue Metric Pills in a single crisp row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
                    {/* 1. Active Ads */}
                    <div className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] flex items-center gap-2.5 min-w-[110px]">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Layers className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#8E8B82] block leading-none font-semibold">Active</span>
                        <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                          {totalActiveAds} / 7
                        </span>
                      </div>
                    </div>

                    {/* 2. Delivered Views */}
                    <div className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] flex items-center gap-2.5 min-w-[110px]">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Eye className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#8E8B82] block leading-none font-semibold">Views</span>
                        <span className="font-mono text-xs sm:text-sm font-bold text-[#1F1E1D] dark:text-[#F5F2EB] block mt-0.5">
                          {totalImpressions.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* 3. Clicks */}
                    <div className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] flex items-center gap-2.5 min-w-[110px]">
                      <div className="w-6 h-6 rounded-lg bg-[#C96442]/10 text-[#C96442] flex items-center justify-center shrink-0">
                        <MousePointerClick className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#8E8B82] block leading-none font-semibold">Clicks</span>
                        <span className="font-mono text-xs sm:text-sm font-bold text-[#C96442] block mt-0.5">
                          {totalClicks.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* 4. CTR */}
                    <div className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] flex items-center gap-2.5 min-w-[110px]">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#8E8B82] block leading-none font-semibold">Avg CTR</span>
                        <span className="font-mono text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                          {avgCtr}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle 1-line Footer rule */}
                <div className="pt-2.5 border-t border-[#EBE8DF] dark:border-[#33322E] flex items-center justify-between text-[11px] text-[#8E8B82] font-mono">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#C96442] shrink-0" />
                    <span>Desks without custom ads inherit Global fallback.</span>
                  </span>
                  <span className="hidden md:flex items-center gap-1 text-[#686660] dark:text-[#A8A59D]">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span>Script Tags (AdSense) &amp; Direct Banner Images</span>
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Domain Desk Selector Grid */}
          <div className="admin-card p-4 sm:p-5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C96442]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] font-bold">
                  Select Editorial Desk / Domain
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-[#8E8B82]">
                  {categories.length + 1} Channels
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#8E8B82]">Active Target:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-[#C96442]/10 border border-[#C96442]/20 text-[#C96442] font-bold">
                  {selectedAdDomain === "global"
                    ? "Global (Default Fallback)"
                    : categories.find((c) => c.slug === selectedAdDomain)?.name || selectedAdDomain}
                </span>
              </div>
            </div>

            {/* Structured 7-Column Executive Desk Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {/* 1. Global Desk Card */}
              {(() => {
                const globalActiveCount = ads.filter((a) => a.domain === "global" && a.is_active).length;
                const isSelected = selectedAdDomain === "global";
                return (
                  <button
                    type="button"
                    onClick={() => setSelectedAdDomain("global")}
                    className={`p-2.5 sm:p-3 rounded-xl text-left transition-all flex flex-col justify-between gap-2 cursor-pointer border ${
                      isSelected
                        ? "bg-[#C96442] border-[#C96442] text-white shadow-md ring-2 ring-[#C96442] ring-offset-2 ring-offset-white dark:ring-offset-[#181816]"
                        : "border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] hover:bg-white dark:hover:bg-[#20201D] hover:border-[#C96442]/40 text-[#1F1E1D] dark:text-[#F5F2EB]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-lg">🌐</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-semibold ${
                          isSelected
                            ? "bg-white text-[#C96442]"
                            : globalActiveCount > 0
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-stone-500/10 text-stone-500 border border-stone-500/20"
                        }`}
                      >
                        {globalActiveCount > 0 ? `${globalActiveCount} Active` : "Inactive"}
                      </span>
                    </div>

                    <div>
                      <span className={`text-xs font-bold block truncate ${isSelected ? "text-white" : "text-[#1F1E1D] dark:text-[#F5F2EB]"}`}>
                        Global Base
                      </span>
                      <span className={`text-[10px] font-mono block mt-0.5 truncate ${isSelected ? "text-white/80" : "text-[#8E8B82]"}`}>
                        Default Fallback
                      </span>
                    </div>
                  </button>
                );
              })()}

              {/* 2-7. Category Desk Cards */}
              {categories.map((c) => {
                const s = c.slug.toLowerCase();
                let emoji = "📰";
                if (s.includes("ai") || s.includes("robot")) emoji = "🤖";
                else if (s.includes("startup") || s.includes("vc") || s.includes("venture")) emoji = "🚀";
                else if (s.includes("gadget") || s.includes("hardware") || s.includes("device")) emoji = "📱";
                else if (s.includes("cyber") || s.includes("security")) emoji = "🛡️";
                else if (s.includes("policy") || s.includes("gov") || s.includes("law")) emoji = "🏛️";
                else if (s.includes("tech") || s.includes("innovat")) emoji = "💻";

                const domainActiveCount = ads.filter((a) => a.domain === c.slug && a.is_active).length;
                const isSelected = selectedAdDomain === c.slug;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedAdDomain(c.slug)}
                    className={`p-2.5 sm:p-3 rounded-xl text-left transition-all flex flex-col justify-between gap-2 cursor-pointer border ${
                      isSelected
                        ? "bg-[#C96442] border-[#C96442] text-white shadow-md ring-2 ring-[#C96442] ring-offset-2 ring-offset-white dark:ring-offset-[#181816]"
                        : "border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] hover:bg-white dark:hover:bg-[#20201D] hover:border-[#C96442]/40 text-[#1F1E1D] dark:text-[#F5F2EB]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-lg">{emoji}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-semibold ${
                          isSelected
                            ? "bg-white text-[#C96442]"
                            : domainActiveCount > 0
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-[#EBE8DF]/50 dark:bg-[#33322E]/50 text-[#8E8B82]"
                        }`}
                      >
                        {domainActiveCount > 0 ? `${domainActiveCount} Active` : "Fallback"}
                      </span>
                    </div>

                    <div>
                      <span className={`text-xs font-bold block truncate ${isSelected ? "text-white" : "text-[#1F1E1D] dark:text-[#F5F2EB]"}`}>
                        {c.name}
                      </span>
                      <span className={`text-[10px] font-mono block mt-0.5 truncate ${isSelected ? "text-white/80" : "text-[#8E8B82]"}`}>
                        /{c.slug}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots Configuration for Selected Domain: 2-Column Side-by-Side Grid */}
          {(() => {
            const currentDomainName =
              selectedAdDomain === "global"
                ? "Global / Default"
                : categories.find((c) => c.slug === selectedAdDomain)?.name || selectedAdDomain;

            const topAd = ads.find(
              (a) => a.domain === selectedAdDomain && a.slot === "top_300x250"
            );
            const bottomAd = ads.find(
              (a) => a.domain === selectedAdDomain && a.slot === "bottom_300x600"
            );

            return (
              <div className="space-y-8">
                {/* 1. TOP SLOT (300x250) */}
                <DomainAdSlotCard
                  domain={selectedAdDomain}
                  domainName={currentDomainName}
                  slot="top_300x250"
                  slotLabel="Top Display Ad Slot (Medium Rectangle)"
                  dimensions="300 × 250"
                  aspectDesc="Primary above-the-fold right sidebar unit"
                  existingAd={topAd}
                  onSave={handleSaveSlot}
                  isSaving={savingSlot === `${selectedAdDomain}-top_300x250`}
                />

                {/* 2. BOTTOM SLOT (300x600) */}
                <DomainAdSlotCard
                  domain={selectedAdDomain}
                  domainName={currentDomainName}
                  slot="bottom_300x600"
                  slotLabel="Bottom Display Ad Slot (Half Page / Skyscraper)"
                  dimensions="300 × 600"
                  aspectDesc="High-impact persistent vertical display unit"
                  existingAd={bottomAd}
                  onSave={handleSaveSlot}
                  isSaving={savingSlot === `${selectedAdDomain}-bottom_300x600`}
                />
              </div>
            );
          })()}
        </div>
      )}

      {/* RSS 2.0 SYNDICATION TAB */}
      {activeTab === "rss" && (
        <div className="w-full space-y-8">
          {/* Top Hero Banner */}
          <div className="admin-card p-6 sm:p-8 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EBE8DF] dark:border-[#33322E]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C96442]/10 border border-[#C96442]/20 flex items-center justify-center text-[#C96442] shadow-xs shrink-0">
                  <Rss className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
                      RSS 2.0 Syndication Feeds
                    </h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Stream
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8B82] font-mono mt-1">
                    Machine-readable XML syndicated broadcast with media enclosures &amp; edge caching
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/rss.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-xs font-mono font-medium text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] hover:text-[#C96442] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Live XML</span>
                </a>
              </div>
            </div>

            {/* Quick Metrics KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8B82] block">
                  Feed Status
                </span>
                <div className="flex items-center space-x-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    HTTP 200 OK
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8B82] block">
                  Syndicated Stories
                </span>
                <span className="font-mono text-sm font-bold text-[#1F1E1D] dark:text-[#F5F2EB] mt-1 block">
                  {articles.filter((a) => a.status === "published").length} Published
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8B82] block">
                  Edge Revalidation
                </span>
                <span className="font-mono text-sm font-bold text-[#C96442] mt-1 block">
                  60s ISR Cache
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E8B82] block">
                  Specification
                </span>
                <span className="font-mono text-sm font-bold text-[#1F1E1D] dark:text-[#F5F2EB] mt-1 block">
                  RSS 2.0 (RFC 822)
                </span>
              </div>
            </div>
          </div>

          {/* Endpoints Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Canonical RSS Feed */}
            <div className="admin-card p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C96442]" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    Canonical RSS Feed
                  </h3>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                  Primary Route
                </span>
              </div>

              <p className="text-xs text-[#686660] dark:text-[#A8A59D] leading-relaxed">
                Primary syndication route delivering standardized XML items with full article titles, summaries, reading times, category taxonomies, and high-res cover imagery enclosures.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-[#8E8B82]">
                  Endpoint URL
                </label>
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]">
                  <span className="font-mono text-xs text-[#C96442] truncate select-all px-1">
                    {rssOrigin || "http://localhost:3000"}/rss.xml
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyRss("/rss.xml")}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                        copiedRssPath === "/rss.xml"
                          ? "bg-emerald-500 text-white"
                          : "bg-white dark:bg-[#22221F] border border-[#EBE8DF] dark:border-[#33322E] text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] hover:text-[#C96442]"
                      }`}
                      title="Copy full canonical RSS feed URL"
                    >
                      {copiedRssPath === "/rss.xml" ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <a
                      href="/rss.xml"
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white dark:bg-[#22221F] border border-[#EBE8DF] dark:border-[#33322E] text-[#8E8B82] hover:text-[#C96442] hover:border-[#C96442] transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EBE8DF]/60 dark:border-[#2E2C28] flex items-center justify-between text-[11px] font-mono text-[#8E8B82]">
                <span>Content-Type: application/rss+xml</span>
                <span>Encoding: UTF-8</span>
              </div>
            </div>

            {/* Card 2: Alternate Syndicate Route */}
            <div className="admin-card p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8E8B82]" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    Alternate Syndicate Route
                  </h3>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF7F0] dark:bg-[#252422] text-[#8E8B82] border border-[#EBE8DF] dark:border-[#33322E] font-medium">
                  Enclosure Alias
                </span>
              </div>

              <p className="text-xs text-[#686660] dark:text-[#A8A59D] leading-relaxed">
                Legacy-compatible syndicate route designed for integration with automated workflows (Zapier, Make, n8n), Slack channels, Discord bots, and classic desktop readers.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-[#8E8B82]">
                  Endpoint URL
                </label>
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]">
                  <span className="font-mono text-xs text-[#C96442] truncate select-all px-1">
                    {rssOrigin || "http://localhost:3000"}/feed.xml
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyRss("/feed.xml")}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                        copiedRssPath === "/feed.xml"
                          ? "bg-emerald-500 text-white"
                          : "bg-white dark:bg-[#22221F] border border-[#EBE8DF] dark:border-[#33322E] text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] hover:text-[#C96442]"
                      }`}
                      title="Copy alternate feed URL"
                    >
                      {copiedRssPath === "/feed.xml" ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <a
                      href="/feed.xml"
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white dark:bg-[#22221F] border border-[#EBE8DF] dark:border-[#33322E] text-[#8E8B82] hover:text-[#C96442] hover:border-[#C96442] transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EBE8DF]/60 dark:border-[#2E2C28] flex items-center justify-between text-[11px] font-mono text-[#8E8B82]">
                <span>Format: RSS 2.0 Enclosures</span>
                <span>No Auth Required</span>
              </div>
            </div>
          </div>

          {/* Reader Compatibility & Integration Protocols */}
          <div className="admin-card p-6 sm:p-7 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                  Reader &amp; Syndication Compatibility
                </h3>
                <p className="text-xs text-[#8E8B82] font-mono mt-0.5">
                  Verified integration across modern RSS readers and automation webhook subscribers
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 self-start sm:self-auto">
                100% W3C Valid
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: "Feedly", status: "Verified", desc: "Instant Cloud Sync" },
                { name: "NetNewsWire", status: "Verified", desc: "macOS / iOS native" },
                { name: "Reeder 5", status: "Verified", desc: "Native enclosures" },
                { name: "Inoreader", status: "Verified", desc: "Auto-discovery" },
                { name: "Slack / Discord", status: "Verified", desc: "Webhook RSS bot" },
                { name: "Zapier / Make", status: "Verified", desc: "Trigger automation" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="p-3 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] space-y-1 text-center"
                >
                  <span className="font-semibold text-xs text-[#1F1E1D] dark:text-[#F5F2EB] block truncate">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block">
                    {item.status}
                  </span>
                  <span className="text-[9px] font-mono text-[#8E8B82] block truncate">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Syndicated Broadcast Dispatches Monitor */}
          <div className="admin-card p-6 sm:p-7 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C96442]" />
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    Active Feed Dispatches
                  </h3>
                  <p className="text-xs text-[#8E8B82] font-mono mt-0.5">
                    Real-time inspection of stories currently syndicated in XML payload
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#8E8B82] bg-[#FAF7F0] dark:bg-[#181816] px-3 py-1 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] self-start sm:self-auto">
                Showing {articles.filter((a) => a.status === "published").slice(0, 10).length} of {articles.filter((a) => a.status === "published").length} items
              </span>
            </div>

            <div className="space-y-3">
              {articles
                .filter((art) => art.status === "published")
                .slice(0, 10)
                .map((art) => (
                  <div
                    key={art.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F0]/60 dark:bg-[#181816]/70 border border-[#EBE8DF] dark:border-[#33322E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C96442]/50 transition-colors"
                  >
                    <div className="flex items-start sm:items-center space-x-3.5 min-w-0 flex-1">
                      {art.cover_image_url ? (
                        <img
                          src={art.cover_image_url}
                          alt={art.title}
                          className="w-16 h-12 rounded-xl object-cover shrink-0 border border-[#EBE8DF] dark:border-[#33322E]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-xl bg-[#EBE8DF] dark:bg-[#252422] flex items-center justify-center font-mono text-[10px] text-[#8E8B82] shrink-0 border border-[#EBE8DF] dark:border-[#33322E]">
                          XML
                        </div>
                      )}

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#C96442]/10 text-[#C96442]">
                            {art.category?.name || "General"}
                          </span>
                          <span className="text-[11px] font-mono text-[#8E8B82]">
                            {formatArticleDate(art.published_at)}
                          </span>
                          <span className="text-[11px] font-mono text-[#8E8B82]">
                            • {art.reading_time_minutes}m read
                          </span>
                        </div>
                        <h4 className="font-serif text-sm font-bold text-[#1F1E1D] dark:text-[#F5F2EB] truncate">
                          {art.title}
                        </h4>
                        <p className="text-xs text-[#686660] dark:text-[#A8A59D] truncate">
                          {art.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <span className="text-[10px] font-mono text-[#8E8B82] px-2 py-1 rounded-md bg-white dark:bg-[#22221F] border border-[#EBE8DF] dark:border-[#33322E]">
                        guid #{art.id.slice(0, 6)}
                      </span>
                      <a
                        href={`/article/${art.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#22221F] border border-[#EBE8DF] dark:border-[#33322E] text-xs font-mono font-medium text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] hover:text-[#C96442] transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3 text-[#C96442]" />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* AI CRAWLERS & BOT TELEMETRY DESK */}
      {activeTab === "crawlers" && (
        <AiCrawlerTrackerDesk />
      )}
        </main>
      </div>

      {/* EDIT ARTICLE MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
              <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                Edit Article Override
              </h3>
              <button
                onClick={() => setEditingArticle(null)}
                className="p-1 rounded-lg text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D]">
                    Title
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenAiAssist("title", "edit", editingArticle.title, editingArticle.category?.name || "AI & Robotics")
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#C96442] hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>✨ AI Assist</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB]"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D]">
                    Summary
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenAiAssist("summary", "edit", editingArticle.summary || editingArticle.title, editingArticle.category?.name || "AI & Robotics")
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#C96442] hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>✨ AI Assist</span>
                  </button>
                </div>
                <textarea
                  value={editingArticle.summary}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, summary: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB]"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D]">
                    Cover Image URL
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenImagePicker("edit")}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#C96442] hover:underline"
                  >
                    <Camera className="w-3 h-3" />
                    <span>🔍 Browse Photos</span>
                  </button>
                </div>
                <input
                  type="url"
                  value={editingArticle.cover_image_url || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, cover_image_url: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D] mb-1">
                  Body (Markdown)
                </label>
                <textarea
                  value={editingArticle.body}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, body: e.target.value })
                  }
                  rows={8}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm font-mono text-[#1F1E1D] dark:text-[#F5F2EB]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D] mb-1">
                    Rank Score (1-100)
                  </label>
                  <input
                    type="number"
                    value={editingArticle.rank_score}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        rank_score: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D] mb-1">
                    Status
                  </label>
                  <select
                    value={editingArticle.status}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, status: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB]"
                  >
                    <option value="published">published</option>
                    <option value="draft">draft</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#EBE8DF] dark:border-[#33322E]">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] text-xs text-[#686660] dark:text-[#A8A59D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#C96442] hover:bg-[#B35334] text-white text-xs font-medium transition-colors"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI COPILOT ASSIST MODAL */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#C96442]/10 border border-[#C96442]/20 flex items-center justify-center text-[#C96442]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    AI Editorial Copilot
                  </h3>
                  <span className="text-[10px] font-mono text-[#8E8B82]">
                    High-Signal Editorial Generator &bull; {aiCategory}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="p-1 rounded-lg text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
              >
                ✕
              </button>
            </div>

            {/* Mode Selector */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "headline", label: "🎯 Viral Headlines", field: "title" },
                { id: "hook", label: "⚡ Executive Hooks", field: "summary" },
                { id: "tags", label: "🏷️ Technical Tags", field: "tags" },
                { id: "seo", label: "🔍 SEO Meta Descriptions", field: "summary" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setAiMode(m.id as any);
                    setAiTargetField(m.field as any);
                    fetchAiAssist(aiSeed, m.id, aiCategory);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
                    aiMode === m.id
                      ? "bg-[#C96442] text-white shadow-xs"
                      : "bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]/40"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Seed Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D]">
                Topic Seed / Headline Prompt
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiSeed}
                  onChange={(e) => setAiSeed(e.target.value)}
                  placeholder="e.g. OpenAI GPT-5 reasoning model benchmarks..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                />
                <button
                  type="button"
                  onClick={() => fetchAiAssist(aiSeed, aiMode, aiCategory)}
                  disabled={aiLoading}
                  className="px-4 py-2 rounded-xl bg-[#C96442] text-white text-xs font-medium hover:bg-[#B35334] transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${aiLoading ? "animate-spin" : ""}`} />
                  <span>{aiLoading ? "Generating..." : "Generate"}</span>
                </button>
              </div>
            </div>

            {/* Suggestions List */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-mono uppercase text-[#8E8B82] block">
                {aiLoading ? "Consulting AI Intelligence..." : `Calibrated Suggestions (${aiSuggestions.length})`}
              </span>

              {aiLoading ? (
                <div className="p-8 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#C96442]" />
                  <p className="text-xs font-mono text-[#8E8B82]">Synthesizing high-impact editorial angles...</p>
                </div>
              ) : aiSuggestions.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {aiSuggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0]/60 dark:bg-[#181816]/70 flex items-center justify-between gap-3 group hover:border-[#C96442]/60 transition-colors"
                    >
                      <span className="text-xs text-[#1F1E1D] dark:text-[#F5F2EB] leading-relaxed flex-1">
                        {sug}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleApplyAiSuggestion(sug)}
                        className="px-3 py-1.5 rounded-xl bg-[#C96442] text-white text-[11px] font-medium opacity-90 group-hover:opacity-100 hover:bg-[#B35334] transition-all shrink-0"
                      >
                        Apply →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs font-mono text-[#8E8B82]">
                  Enter a seed phrase and click Generate.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* UNSPLASH IMAGE PICKER MODAL */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#C96442]/10 border border-[#C96442]/20 flex items-center justify-center text-[#C96442]">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    High-Resolution Editorial Imagery
                  </h3>
                  <span className="text-[10px] font-mono text-[#8E8B82]">
                    Unsplash Curated Tech Collection &bull; 1-Click Cover Photo
                  </span>
                </div>
              </div>
              <button
                onClick={() => setImageModalOpen(false)}
                className="p-1 rounded-lg text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
              >
                ✕
              </button>
            </div>

            {/* Search Input & Quick Category Pills */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={imageSearchQuery}
                  onChange={(e) => {
                    setImageSearchQuery(e.target.value);
                    searchImages(e.target.value);
                  }}
                  placeholder="Search keywords (e.g. ai, robotics, cybersecurity, chips, cloud, quantum)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                />
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#8E8B82]" />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {["all", "ai", "robotics", "chips", "cybersecurity", "cloud", "startups", "quantum"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      const q = cat === "all" ? "" : cat;
                      setImageSearchQuery(q);
                      searchImages(q);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-colors ${
                      (cat === "all" && !imageSearchQuery) || imageSearchQuery.toLowerCase() === cat
                        ? "bg-[#C96442] text-white"
                        : "bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Grid */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#8E8B82] block">
                {imageSearchLoading ? "Loading Gallery..." : `Available Photos (${imageSearchResults.length})`}
              </span>

              {imageSearchLoading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#C96442]" />
                  <p className="text-xs font-mono text-[#8E8B82] mt-2">Fetching imagery...</p>
                </div>
              ) : imageSearchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-96 overflow-y-auto pr-1">
                  {imageSearchResults.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => handleSelectImage(img.url)}
                      className="group relative rounded-2xl overflow-hidden border border-[#EBE8DF] dark:border-[#33322E] bg-stone-100 dark:bg-stone-800 aspect-16/10 cursor-pointer shadow-xs hover:border-[#C96442] transition-all"
                    >
                      <img
                        src={img.thumb || img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
                        <p className="text-xs font-semibold line-clamp-1">{img.title}</p>
                        <span className="text-[10px] text-white/80 font-mono">By {img.author}</span>
                        <span className="mt-1 inline-block text-[10px] font-mono text-[#C96442] bg-white px-2 py-0.5 rounded-md font-bold self-start">
                          Use This Image ✓
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs font-mono text-[#8E8B82]">
                  No images found for &quot;{imageSearchQuery}&quot;. Try another search term.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}