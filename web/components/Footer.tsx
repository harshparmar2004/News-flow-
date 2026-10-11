"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Rss, 
  ShieldCheck, 
  Cpu, 
  ArrowUp, 
  Check, 
  Send, 
  Sparkles, 
  Database, 
  Radio, 
  ExternalLink 
} from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Hide footer only on internal admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-[#EBE8DF] dark:border-[#282724] bg-[#F7F4EC] dark:bg-[#141413] text-[#1F1E1D] dark:text-[#F5F2EB] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 lg:pb-14">
        
        {/* Top Banner: Brand Masthead & Morning Synthesis Subscription Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#EBE8DF] dark:border-[#262522]">
          
          {/* Brand & Editorial Mission Statement */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-[#C96442]" />
              <Link href="/" className="inline-block">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
                  NewsFlow
                </span>
              </Link>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#C96442]/10 text-[#C96442] border border-[#C96442]/20 font-medium">
                Autonomous Wire
              </span>
            </div>

            <p className="text-sm text-[#686660] dark:text-[#A8A59D] max-w-xl leading-relaxed">
              An autonomous digital newsroom continuously monitoring, synthesizing, and reporting on breakthrough advancements across artificial intelligence, foundation models, spatial robotics, silicon, and cybersecurity from 50+ primary sources. Engineered for zero-clutter clarity.
            </p>

            {/* Live Telemetry / Database Pulse */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#8E8B82] dark:text-[#78756E] font-mono">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white dark:bg-[#1E1D1B] border border-[#EBE8DF] dark:border-[#282724]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C96442] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C96442]"></span>
                </span>
                <span className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">24/7 Agent Desk Live</span>
              </div>
              <span>•</span>
              <span>656+ Indexed Dispatches</span>
              <span>•</span>
              <span>Neon PostgreSQL</span>
              <span>•</span>
              <span>Edge CDN</span>
            </div>
          </div>

          {/* Morning Synthesis Newsletter Digest Form */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1C1B19] rounded-2xl p-6 border border-[#EBE8DF] dark:border-[#2A2925] shadow-xs flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C96442]" />
                <h4 className="text-sm font-semibold font-serif text-[#1F1E1D] dark:text-[#F5F2EB]">
                  The Morning Synthesis
                </h4>
              </div>
              <p className="text-xs text-[#686660] dark:text-[#A8A59D] leading-relaxed">
                Curated executive briefings on key tech shifts delivered to your inbox every morning at 06:00 UTC. Zero sponsored PR fluff.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="mt-4">
              {subscribed ? (
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 py-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Subscribed! Your first synthesis dispatch will arrive tomorrow.</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-[#FAF7F0] dark:bg-[#141413] border border-[#EBE8DF] dark:border-[#2C2A26] text-[#1F1E1D] dark:text-[#F5F2EB] placeholder-[#8E8B82] focus:outline-hidden focus:border-[#C96442] focus:ring-1 focus:ring-[#C96442]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#C96442] hover:bg-[#b85535] text-white text-xs font-medium font-mono shrink-0 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#EBE8DF] dark:border-[#262522]">
          
          {/* Column 1: News Desks */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#686660]">
              News Desks
            </h4>
            <ul className="space-y-2 text-xs text-[#686660] dark:text-[#A8A59D]">
              <li>
                <Link href="/category/ai" className="hover:text-[#C96442] transition-colors">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link href="/category/robotics" className="hover:text-[#C96442] transition-colors">
                  Robotics & Automation
                </Link>
              </li>
              <li>
                <Link href="/category/startups-vc" className="hover:text-[#C96442] transition-colors">
                  Startups & Venture Capital
                </Link>
              </li>
              <li>
                <Link href="/category/gadgets-hardware" className="hover:text-[#C96442] transition-colors">
                  Gadgets & Hardware
                </Link>
              </li>
              <li>
                <Link href="/category/cybersecurity" className="hover:text-[#C96442] transition-colors">
                  Cybersecurity & Defense
                </Link>
              </li>
              <li>
                <Link href="/category/tech" className="hover:text-[#C96442] transition-colors">
                  Tech & Frontier Innovation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Editorial & Newsroom */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#686660]">
              Editorial Desk
            </h4>
            <ul className="space-y-2 text-xs text-[#686660] dark:text-[#A8A59D]">
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C96442]" />
                  <span>About Our AI Newsroom</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors">
                  Editorial Verification Pipeline
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors">
                  Source Whitelist & Attribution
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors">
                  Ethics & Disclosures
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors">
                  Pitch & Tip Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Discovery & Feeds */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#686660]">
              Feeds & Archival
            </h4>
            <ul className="space-y-2 text-xs text-[#686660] dark:text-[#A8A59D]">
              <li>
                <Link href="/archive" className="hover:text-[#C96442] transition-colors">
                  Chronological Archive
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[#C96442] transition-colors">
                  Full-Text Search Catalog
                </Link>
              </li>
              <li>
                <Link href="/rss.xml" className="hover:text-[#C96442] transition-colors flex items-center space-x-1.5">
                  <Rss className="w-3.5 h-3.5 text-amber-600" />
                  <span>RSS 2.0 Feed</span>
                </Link>
              </li>
              <li>
                <Link href="/atom.xml" className="hover:text-[#C96442] transition-colors">
                  Atom Syndicate Feed
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-[#C96442] transition-colors">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Standards */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#686660]">
              Governance & Admin
            </h4>
            <ul className="space-y-2 text-xs text-[#686660] dark:text-[#A8A59D]">
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors">
                  FTC Reader Disclosures
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#C96442] transition-colors flex items-center space-x-1.5 text-[#8E8B82] dark:text-[#686660]">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Admin Cockpit</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Copyright, FTC Disclosure & Scroll-to-Top */}
        <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8E8B82] dark:text-[#686660]">
          <div className="space-y-1 text-center md:text-left">
            <p>
              &copy; {new Date().getFullYear()} NewsFlow Media Inc. All rights reserved. Zero-clutter autonomous journalism.
            </p>
            <p className="text-[11px] max-w-2xl text-[#8E8B82] dark:text-[#686660]">
              FTC Disclosure: NewsFlow is reader-supported. We may earn an affiliate commission on qualifying purchases made through contextual recommendation links.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1E1D1B] border border-[#EBE8DF] dark:border-[#282724] text-[#1F1E1D] dark:text-[#F5F2EB] hover:text-[#C96442] hover:border-[#C96442]/40 transition-colors text-xs font-mono cursor-pointer shrink-0 shadow-2xs"
            title="Scroll back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}