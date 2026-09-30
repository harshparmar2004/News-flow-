"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import { AdUnit } from "./AdUnit";

interface TrendingSidebarProps {
  trendingArticles: Array<{
    id: string;
    slug: string;
    title: string;
    reading_time_minutes: number;
    category: {
      name: string;
      slug: string;
    };
  }>;
}

export function TrendingSidebar({ trendingArticles }: TrendingSidebarProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Subscribed! You will receive our morning tech brief.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <aside className="space-y-8">
      {/* 1. Trending Articles Module */}
      <div className="rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] p-6 shadow-xs">
        <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-[#EBE8DF] dark:border-[#33322E]">
          <TrendingUp className="w-4 h-4 text-[#C96442]" />
          <h3 className="font-serif text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
            Trending Intelligence
          </h3>
        </div>

        <div className="space-y-5">
          {trendingArticles.map((art, idx) => (
            <div key={art.id} className="group flex items-start space-x-3.5">
              <span className="font-mono text-lg font-bold text-[#C96442]/50 group-hover:text-[#C96442] transition-colors pt-0.5">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="space-y-1">
                <Link
                  href={`/category/${art.category.slug}`}
                  className="text-[10px] font-mono uppercase tracking-wider text-[#8E8B82] dark:text-[#A8A59D] hover:text-[#C96442]"
                >
                  {art.category.name}
                </Link>
                <h4 className="font-serif text-sm font-semibold leading-snug text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] transition-colors line-clamp-2">
                  <Link href={`/article/${art.slug}`}>{art.title}</Link>
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Newsletter Signup Block ("The Daily Signal") */}
      <div className="rounded-2xl border border-[#E8E2D5] dark:border-[#383630] bg-[#FAF7F0] dark:bg-[#20201D] p-6 shadow-xs">
        <div className="flex items-center space-x-2 text-[#C96442] mb-2">
          <Mail className="w-4 h-4" />
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
            The Daily Signal
          </span>
        </div>
        <h4 className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
          Curated Signal, Zero Fluff
        </h4>
        <p className="text-xs text-[#686660] dark:text-[#A8A59D] mt-2 mb-4 leading-relaxed">
          The top 3 AI and computing developments synthesized directly from our 50+ source agent pipeline. Delivered daily at 6:00 AM UTC.
        </p>

        {status === "success" ? (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#2A2925] text-xs text-[#1F1E1D] dark:text-[#F5F2EB] placeholder-[#8E8B82] focus:outline-none focus:border-[#C96442]"
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-2.5 px-4 rounded-xl bg-[#C96442] hover:bg-[#B35334] text-white text-xs font-medium transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Join 14,000+ Engineers"}
            </button>
            {status === "error" && (
              <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">
                {message}
              </p>
            )}
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-[#E8E2D5] dark:border-[#33322E] flex items-center text-[10px] text-[#8E8B82] dark:text-[#686660]">
          <Sparkles className="w-3 h-3 mr-1 text-[#C96442]" />
          <span>No spam, 1-click unsubscribe at any time.</span>
        </div>
      </div>

      {/* 3. Reserved Sidebar IAB Ad Slot (300x250) */}
      <AdUnit slot="sidebar" />
    </aside>
  );
}