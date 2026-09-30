"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
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
} from "lucide-react";
import { formatArticleDate } from "@/lib/utils";

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
    <div className="p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EBE8DF] dark:border-[#33322E] gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#C96442]/10 text-[#C96442] border border-[#C96442]/20 font-semibold">
              {dimensions}
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              {slotLabel}
            </h3>
          </div>
          <p className="text-xs text-[#8E8B82] dark:text-[#A8A59D]">
            {aspectDesc} &bull; Targeted for <span className="font-medium text-[#1F1E1D] dark:text-[#F5F2EB]">{domainName}</span>
          </p>
        </div>

        {/* Status Toggle & Metrics */}
        <div className="flex items-center gap-3">
          {existingAd && (
            <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px] text-[#686660] dark:text-[#A8A59D]">
              <span className="px-2 py-0.5 rounded-md bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]" title="Total Impressions">
                👁️ {impressions.toLocaleString()}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E]" title="Total Clicks">
                🖱️ {clicks.toLocaleString()}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#C96442]/10 text-[#C96442] border border-[#C96442]/20 font-semibold" title="Click-Through Rate">
                📈 {ctr}% CTR
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ad Format Selector */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] flex items-center justify-between">
            <span>Ad Format / Implementation</span>
            <div className="flex items-center gap-2 normal-case font-sans">
              <span className="text-[11px] text-[#8E8B82]">Quick Presets:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset("banner_sample")}
                className="text-[11px] text-[#C96442] hover:underline"
              >
                Sample Banner
              </button>
              <span className="text-[#8E8B82]">&bull;</span>
              <button
                type="button"
                onClick={() => handleApplyPreset("adsense_sample")}
                className="text-[11px] text-[#C96442] hover:underline"
              >
                Sample AdSense Tag
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAdType("banner")}
              className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                adType === "banner"
                  ? "border-[#C96442] bg-[#C96442]/5 text-[#1F1E1D] dark:text-[#F5F2EB]"
                  : "border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]/40"
              }`}
            >
              <ImageIcon className={`w-4 h-4 ${adType === "banner" ? "text-[#C96442]" : "text-[#8E8B82]"}`} />
              <div>
                <p className="text-xs font-semibold">Image &amp; Link Banner</p>
                <p className="text-[10px] text-[#8E8B82]">Upload or link brand creative with direct click-through</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAdType("custom_html")}
              className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                adType === "custom_html"
                  ? "border-[#C96442] bg-[#C96442]/5 text-[#1F1E1D] dark:text-[#F5F2EB]"
                  : "border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442]/40"
              }`}
            >
              <Code2 className={`w-4 h-4 ${adType === "custom_html" ? "text-[#C96442]" : "text-[#8E8B82]"}`} />
              <div>
                <p className="text-xs font-semibold">Google AdSense / Custom HTML</p>
                <p className="text-[10px] text-[#8E8B82]">Paste raw AdSense tags, affiliate scripts or iframes</p>
              </div>
            </button>
          </div>
        </div>

        {/* Format Specific Fields */}
        {adType === "banner" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] mb-1.5">
                  Sponsor / Brand Label
                </label>
                <input
                  type="text"
                  value={sponsor}
                  onChange={(e) => setSponsor(e.target.value)}
                  placeholder="e.g. Anthropic, Google Cloud, Stripe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] mb-1.5">
                  Headline / Title (Overlay or Text Card)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build Autonomous Agents Faster"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] mb-1.5">
                  Image Creative URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (or leave blank for editorial gradient card)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs font-mono text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] mb-1.5">
                  Target Destination URL (Outbound)
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://partner.com/?utm_source=newsflow"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs font-mono text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] mb-1.5">
              Custom HTML / Google AdSense / Script Embed
            </label>
            <textarea
              rows={5}
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              placeholder={`<!-- Paste Google AdSense <ins> or iframe snippet here -->\n<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="ca-pub-..."\n     data-ad-slot="..."\n     data-ad-format="auto"></ins>`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] font-mono text-xs text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
            />
            <p className="text-[11px] text-[#8E8B82] mt-1">
              Supports Google AdSense tags, dynamic affiliate banners, or custom HTML/CSS embeds.
            </p>
          </div>
        )}

        {/* Live Visual Reader Preview */}
        <div className="pt-2 border-t border-[#EBE8DF] dark:border-[#33322E]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#C96442]" />
              <span>Live Reader Preview ({dimensions})</span>
            </span>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-[#C96442] hover:underline"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>

          {showPreview && (
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#FAF7F0]/60 dark:bg-[#181816]/70 border border-[#EBE8DF] dark:border-[#33322E]">
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
                <div className="w-[300px] h-[450px] shrink-0 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#1C1C19] overflow-hidden flex flex-col relative group shadow-sm">
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
              <span className="text-[11px] font-mono text-[#8E8B82] mt-3">
                Live {dimensions} reader display render
              </span>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#EBE8DF] dark:border-[#33322E]">
          <span className="text-xs text-[#8E8B82]">
            Updates take effect immediately on <code className="text-[#C96442] font-mono">{domain}</code> pages.
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#C96442] hover:bg-[#B35334] text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Slot...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save {dimensions} Slot Configuration</span>
              </>
            )}
          </button>
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
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [activeTab, setActiveTab] = useState<"articles" | "create" | "api" | "jev" | "ads">("articles");
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Monetization & Domain Ads State
  const [ads, setAds] = useState<DomainAdItem[]>(initialAds);
  const [selectedAdDomain, setSelectedAdDomain] = useState<string>("global");
  const [savingSlot, setSavingSlot] = useState<string | null>(null);

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
  const [newCategory, setNewCategory] = useState(categories[0]?.name || "AI & Robotics");
  const [newCover, setNewCover] = useState("");
  const [newFeatured, setNewFeatured] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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

      {/* Top Cockpit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EBE8DF] dark:border-[#33322E] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#C96442]/10 text-[#C96442] border border-[#C96442]/20 font-semibold">
              Live Override Layer
            </span>
            <span className="text-xs text-[#8E8B82] dark:text-[#A8A59D]">
              NewsFlow Agent Hub
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB] mt-1">
            Editorial Cockpit
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab("create")}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#C96442] hover:bg-[#B35334] text-white text-xs font-medium transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manual Dispatch</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] text-xs text-[#686660] dark:text-[#A8A59D] hover:text-red-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F]">
          <span className="text-xs font-mono text-[#8E8B82] uppercase tracking-wider">
            Total Articles
          </span>
          <p className="font-serif text-2xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB] mt-1">
            {articles.length}
          </p>
          <span className="text-[11px] text-[#C96442] font-mono">
            {publishedCount} live / {draftCount} drafts
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F]">
          <span className="text-xs font-mono text-[#8E8B82] uppercase tracking-wider">
            Reader Views
          </span>
          <p className="font-serif text-2xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB] mt-1">
            {totalViews.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-mono">
            Organic Traffic
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F]">
          <span className="text-xs font-mono text-[#8E8B82] uppercase tracking-wider">
            Subscribers
          </span>
          <p className="font-serif text-2xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB] mt-1">
            {subscriberCount}
          </p>
          <span className="text-[11px] text-[#8E8B82] font-mono">
            Daily Signal list
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F]">
          <span className="text-xs font-mono text-[#8E8B82] uppercase tracking-wider">
            Agent Status
          </span>
          <div className="flex items-center space-x-1.5 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Autonomous
            </span>
          </div>
          <span className="text-[11px] text-[#8E8B82] font-mono">
            50+ sources armed
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#EBE8DF] dark:border-[#33322E] space-x-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab("articles")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "articles"
              ? "border-[#C96442] text-[#C96442]"
              : "border-transparent text-[#686660] dark:text-[#A8A59D] hover:text-[#1F1E1D]"
          }`}
        >
          Articles Vault ({articles.length})
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "create"
              ? "border-[#C96442] text-[#C96442]"
              : "border-transparent text-[#686660] dark:text-[#A8A59D] hover:text-[#1F1E1D]"
          }`}
        >
          Manual Article Dispatch
        </button>

        <button
          onClick={() => setActiveTab("api")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "api"
              ? "border-[#C96442] text-[#C96442]"
              : "border-transparent text-[#686660] dark:text-[#A8A59D] hover:text-[#1F1E1D]"
          }`}
        >
          Pipeline Ingestion API & Keys
        </button>

        <button
          onClick={() => setActiveTab("jev")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "jev"
              ? "border-[#C96442] text-[#C96442]"
              : "border-transparent text-[#686660] dark:text-[#A8A59D] hover:text-[#1F1E1D]"
          }`}
        >
          <Zap className="w-4 h-4 text-[#C96442]" />
          <span>TypeSafe Jev AI (System 1)</span>
          {jevHasKey ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="System 1 Armed" />
          ) : (
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Setup
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("ads")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "ads"
              ? "border-[#C96442] text-[#C96442]"
              : "border-transparent text-[#686660] dark:text-[#A8A59D] hover:text-[#1F1E1D]"
          }`}
        >
          <Megaphone className="w-4 h-4 text-[#C96442]" />
          <span>Monetization & Ads</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#C96442]/10 text-[#C96442] border border-[#C96442]/20">
            {ads.filter((a) => a.is_active).length} Active
          </span>
        </button>
      </div>

      {/* TAB 1: ARTICLES VAULT */}
      {activeTab === "articles" && (
        <div className="space-y-4">
          {/* Admin Usable Tool: Instant Filter & Search Bar */}
          <div className="p-4 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#20201D] flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
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
                  className="absolute right-2.5 top-2.5 text-xs text-[#8E8B82] hover:text-[#1F1E1D]"
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

          {/* Table Container */}
          <div className="rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#20201D] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F0] dark:bg-[#1A1917] border-b border-[#EBE8DF] dark:border-[#33322E] text-[#8E8B82] font-mono uppercase tracking-wider">
                  <tr>
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
                      className="hover:bg-[#FAF7F0]/60 dark:hover:bg-[#2A2925]/60 transition-colors"
                    >
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
                          className="p-1.5 rounded-md hover:bg-[#EBE8DF] dark:hover:bg-[#33322E] text-[#686660] hover:text-[#1F1E1D] transition-colors"
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
                      <td colSpan={8} className="py-12 text-center text-xs font-mono text-[#8E8B82]">
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
        <div className="max-w-3xl mx-auto p-8 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              Manual Article Ingestion
            </h2>
            <p className="text-xs text-[#686660] dark:text-[#A8A59D]">
              Directly author or paste a piece without going through the Python pipeline.
            </p>
          </div>

          <form onSubmit={handleCreateArticle} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] mb-1.5">
                Headline *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. DeepSeek-V3 Open Model Weights Cause Shockwaves..."
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-none focus:border-[#C96442]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] mb-1.5">
                Executive 1-Line Summary *
              </label>
              <textarea
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                placeholder="High-signal concise summary..."
                rows={2}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-none focus:border-[#C96442]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-none focus:border-[#C96442]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] mb-1.5">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={newCover}
                  onChange={(e) => setNewCover(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-none focus:border-[#C96442]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] mb-1.5">
                Article Body (Markdown Supported) *
              </label>
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="## Section Heading&#10;&#10;Full analytical breakdown here..."
                rows={10}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] font-mono focus:outline-none focus:border-[#C96442]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={newFeatured}
                onChange={(e) => setNewFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#C96442]"
              />
              <label htmlFor="isFeatured" className="text-xs text-[#1F1E1D] dark:text-[#F5F2EB]">
                Set as Featured Story on Homepage
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 rounded-xl bg-[#C96442] hover:bg-[#B35334] text-white text-xs font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Article Immediately"}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: PIPELINE INGESTION API & KEYS */}
      {activeTab === "api" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                NewsFlow Agent Ingestion Key
              </h3>
              <button
                onClick={copyApiKey}
                className="inline-flex items-center space-x-1.5 text-xs text-[#C96442] hover:underline"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? "Copied Key" : "Copy Key"}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#1C1C19] border border-[#EBE8DF] dark:border-[#33322E] font-mono text-xs text-[#1F1E1D] dark:text-[#F5F2EB] select-all">
              {apiKey}
            </div>
            <p className="text-xs text-[#686660] dark:text-[#A8A59D]">
              Pass this key in the <code className="text-[#C96442]">x-api-key</code> header or as Bearer token when dispatching from your Python pipeline.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              Python Integration Snippet
            </h3>
            <pre className="p-4 rounded-xl bg-[#1C1C19] text-[#F5F2EB] text-xs font-mono overflow-x-auto leading-relaxed">
{`import requests

url = "http://localhost:3000/api/articles"
headers = {
    "x-api-key": "${apiKey}",
    "Content-Type": "application/json"
}
payload = {
    "title": "Quantum Supremacy Milestone Reached in Fault-Tolerant Qubits",
    "summary": "Breakthrough in topological error correction enables sustained coherence.",
    "body": "## The Coherence Threshold\\n\\nResearchers have crossed...",
    "category": "AI & Robotics",
    "cover_image_url": "https://images.unsplash.com/...",
    "source_url": "https://nature.com/articles/...",
    "rank_score": 94,
    "tags": ["Quantum", "Hardware", "DeepTech"],
    "status": "published"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: TYPESAFE JEV AI (SYSTEM 1 DECISION ENGINE) */}
      {activeTab === "jev" && (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header Banner & Status */}
          <div className="p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-[#C96442]/10 border border-[#C96442]/20 flex items-center justify-center text-[#C96442]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    TypeSafe Jev AI — System 1 Decision Engine
                  </h2>
                </div>
                <p className="text-xs text-[#686660] dark:text-[#A8A59D] leading-relaxed">
                  Sub-150ms parallel evaluation for incoming raw news. Evaluates breakthrough significance, 
                  automatically maps to our 6 domains, scores journalistic impact, and filters promotional noise before generative synthesis.
                </p>
              </div>

              <div>
                {jevHasKey ? (
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>System 1 Active & Armed</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-mono font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Setup Required</span>
                  </div>
                )}
              </div>
            </div>

            {jevHasKey && (
              <div className="pt-3 border-t border-[#EBE8DF] dark:border-[#33322E] flex flex-wrap items-center gap-4 text-xs font-mono text-[#686660] dark:text-[#A8A59D]">
                <div>
                  <span className="text-[#8E8B82]">Active Key:</span>{" "}
                  <code className="px-1.5 py-0.5 rounded-md bg-[#FAF7F0] dark:bg-[#181816] text-[#1F1E1D] dark:text-[#F5F2EB]">
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
                  <span className="text-emerald-600">Web & 24/7 Pipeline</span>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Form Card */}
          <div className="p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
              <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                API Key & Triage Settings
              </h3>
              <span className="text-xs font-mono text-[#8E8B82]">console.typesafe.ai</span>
            </div>

            <form onSubmit={handleSaveJevKey} className="space-y-5">
              {/* API Key Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D] tracking-wider">
                    TypeSafe Jev API Key
                  </label>
                  {jevHasKey && (
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
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
                    className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] font-mono text-xs text-[#1F1E1D] dark:text-[#F5F2EB] focus:outline-hidden focus:border-[#C96442]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowJevKey(!showJevKey)}
                    className="absolute right-2.5 top-2.5 text-xs text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
                  >
                    {showJevKey ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-[11px] text-[#8E8B82]">
                  Saving writes securely to SQLite <code className="text-[#C96442]">SystemSetting</code> and synchronizes to both Web and 24/7 Pipeline environment files.
                </p>
              </div>

              {/* Thresholds Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D]">
                      Min Impact Threshold
                    </label>
                    <span className="font-mono text-xs font-bold text-[#C96442]">
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
                    className="w-full accent-[#C96442]"
                  />
                  <p className="text-[10px] text-[#8E8B82]">
                    Stories scored below this by Jev are discarded before expensive LLM synthesis.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D]">
                      Auto-Feature Threshold
                    </label>
                    <span className="font-mono text-xs font-bold text-[#C96442]">
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
                    className="w-full accent-[#C96442]"
                  />
                  <p className="text-[10px] text-[#8E8B82]">
                    High-impact breaking news automatically pins as Featured Story in homepage spotlight.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={jevSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#C96442] hover:bg-[#b05334] text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{jevSaving ? "Saving..." : "Save Jev API Key & Settings"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestJev}
                  disabled={jevTesting || (!jevKeyInput && !jevHasKey)}
                  className="px-4 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#252422] text-[#1F1E1D] dark:text-[#F5F2EB] text-xs font-medium hover:border-[#C96442] hover:text-[#C96442] transition-colors flex items-center gap-2 disabled:opacity-40"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{jevTesting ? "Testing Latency..." : "Test Connection & Latency ⚡"}</span>
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
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#20201D] border border-inherit text-[#C96442]">
                    ⚡ {jevTestResult.latency_ms} ms Latency
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <p className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">
                  {jevTestResult.message || jevTestResult.error}
                </p>

                {jevTestResult.decision && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#20201D] border border-inherit">
                      <span className="text-[10px] font-mono text-[#8E8B82] uppercase">Domain</span>
                      <p className="font-mono font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">
                        {jevTestResult.decision.domain}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#20201D] border border-inherit">
                      <span className="text-[10px] font-mono text-[#8E8B82] uppercase">Impact Score</span>
                      <p className="font-mono font-semibold text-[#C96442]">
                        {jevTestResult.decision.impact_score} / 10
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#20201D] border border-inherit">
                      <span className="text-[10px] font-mono text-[#8E8B82] uppercase">Signal</span>
                      <p className="font-mono font-semibold text-emerald-600">
                        {jevTestResult.decision.is_signal ? "High Signal" : "Low Signal"}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#20201D] border border-inherit">
                      <span className="text-[10px] font-mono text-[#8E8B82] uppercase">Confidence</span>
                      <p className="font-mono font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">
                        {Math.round((jevTestResult.decision.confidence || 0.95) * 100)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interactive Sandbox Playground */}
          <div className="p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8DF] dark:border-[#33322E]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                  Interactive Jev Triage Sandbox
                </h3>
                <p className="text-xs text-[#8E8B82]">
                  Paste any breaking news headline and summary to test instant System 1 evaluation.
                </p>
              </div>
              <span className="text-xs font-mono text-[#C96442]">~100ms Decision</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D] mb-1">
                  Test Headline
                </label>
                <input
                  type="text"
                  value={sandboxTitle}
                  onChange={(e) => setSandboxTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs text-[#1F1E1D] dark:text-[#F5F2EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D] mb-1">
                  Test Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  value={sandboxSummary}
                  onChange={(e) => setSandboxSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-xs text-[#1F1E1D] dark:text-[#F5F2EB]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunSandbox}
                  disabled={sandboxRunning || !sandboxTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-[#1F1E1D] dark:bg-[#F5F2EB] text-white dark:text-[#1F1E1D] text-xs font-medium hover:bg-[#C96442] dark:hover:bg-[#C96442] dark:hover:text-white transition-colors flex items-center gap-2 disabled:opacity-40"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{sandboxRunning ? "Evaluating in ~100ms..." : "Run Instant Jev Decision"}</span>
                </button>
              </div>

              {sandboxResult && (
                <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ Verdict: {sandboxResult.triage.recommendation}
                    </span>
                    <span className="text-[#C96442] font-bold">
                      ⚡ {sandboxResult.latency_ms} ms
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-white dark:bg-[#20201D] border border-[#EBE8DF] dark:border-[#33322E]">
                      <span className="text-[10px] text-[#8E8B82] block">Classified Domain</span>
                      <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">
                        {sandboxResult.triage.domain}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white dark:bg-[#20201D] border border-[#EBE8DF] dark:border-[#33322E]">
                      <span className="text-[10px] text-[#8E8B82] block">Impact Score</span>
                      <span className="font-semibold text-[#C96442]">
                        {sandboxResult.triage.impact_score} / 10
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white dark:bg-[#20201D] border border-[#EBE8DF] dark:border-[#33322E]">
                      <span className="text-[10px] text-[#8E8B82] block">Rank Score</span>
                      <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">
                        {sandboxResult.triage.rank_score} / 100
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white dark:bg-[#20201D] border border-[#EBE8DF] dark:border-[#33322E]">
                      <span className="text-[10px] text-[#8E8B82] block">Confidence</span>
                      <span className="font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">
                        {Math.round((sandboxResult.triage.confidence || 0.95) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MONETIZATION & DOMAIN ADS */}
      {activeTab === "ads" && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-[#C96442]/10 border border-[#C96442]/20 flex items-center justify-center text-[#C96442]">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    Right-Sidebar Monetization &amp; Domain Ad Inventory
                  </h2>
                </div>
                <p className="text-xs text-[#686660] dark:text-[#A8A59D] leading-relaxed">
                  Configure independent high-impact advertisements (300×250 &amp; 300×600) tailored to each editorial domain desk, or define global fallbacks.
                  Choose between high-converting image creatives with click tracking or direct Google AdSense / affiliate script tags.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="p-3 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-center min-w-20">
                  <span className="text-[10px] font-mono uppercase text-[#8E8B82] block">Active Ads</span>
                  <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {ads.filter((a) => a.is_active).length}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-center min-w-24">
                  <span className="text-[10px] font-mono uppercase text-[#8E8B82] block">Delivered Views</span>
                  <span className="font-mono text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                    {ads.reduce((sum, a) => sum + (a.impressions || 0), 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF7F0] dark:bg-[#181816] border border-[#EBE8DF] dark:border-[#33322E] text-center min-w-20">
                  <span className="text-[10px] font-mono uppercase text-[#8E8B82] block">Total Clicks</span>
                  <span className="font-mono text-base font-bold text-[#C96442]">
                    {ads.reduce((sum, a) => sum + (a.clicks || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Rules & Fallback Note */}
            <div className="pt-3 border-t border-[#EBE8DF] dark:border-[#33322E] flex flex-wrap items-center justify-between text-xs text-[#8E8B82] gap-2">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Globe className="w-3.5 h-3.5 text-[#C96442]" />
                Fallback Logic: When a domain desk has no active ad, the system seamlessly serves the Global ad.
              </span>
              <span className="font-mono text-[11px] text-[#686660] dark:text-[#A8A59D]">
                Format standard: IAB 300×250 IMU &amp; 300×600 Half Page
              </span>
            </div>
          </div>

          {/* Domain Desk Selector Pills */}
          <div className="p-6 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] font-semibold">
                Select Editorial Desk / Domain
              </span>
              <span className="text-xs font-mono text-[#8E8B82]">
                Active Desk: <code className="text-[#C96442] font-semibold">{selectedAdDomain}</code>
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {/* Global Pill */}
              {(() => {
                const globalActiveCount = ads.filter((a) => a.domain === "global" && a.is_active).length;
                const isSelected = selectedAdDomain === "global";
                return (
                  <button
                    type="button"
                    onClick={() => setSelectedAdDomain("global")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#C96442] text-white shadow-xs"
                        : "border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442]/50"
                    }`}
                  >
                    <span>🌐</span>
                    <span>Global (Default Fallback)</span>
                    {globalActiveCount > 0 && (
                      <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"}`} />
                    )}
                  </button>
                );
              })()}

              {/* Category Pills */}
              {categories.map((c) => {
                let emoji = "📰";
                if (c.slug.includes("ai")) emoji = "🤖";
                else if (c.slug.includes("startup") || c.slug.includes("vc")) emoji = "🚀";
                else if (c.slug.includes("gadget") || c.slug.includes("hardware")) emoji = "📱";
                else if (c.slug.includes("cyber") || c.slug.includes("security")) emoji = "🛡️";
                else if (c.slug.includes("policy") || c.slug.includes("tech")) emoji = "🏛️";

                const domainActiveCount = ads.filter((a) => a.domain === c.slug && a.is_active).length;
                const isSelected = selectedAdDomain === c.slug;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedAdDomain(c.slug)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#C96442] text-white shadow-xs"
                        : "border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#181816] text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442]/50"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{c.name}</span>
                    {domainActiveCount > 0 && (
                      <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots Configuration for Selected Domain */}
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
                className="p-1 rounded-lg text-[#8E8B82] hover:text-[#1F1E1D]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D] mb-1">
                  Title
                </label>
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
                <label className="block text-xs font-mono uppercase text-[#686660] dark:text-[#A8A59D] mb-1">
                  Summary
                </label>
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
    </div>
  );
}