"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Check } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Hide footer on internal admin routes
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
    <footer className="w-full border-t border-[#EBE8DF] dark:border-[#242320] bg-[#FAF7F0] dark:bg-[#121211] text-[#1F1E1D] dark:text-[#F5F2EB] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-24 lg:pb-10">
        
        {/* Top Strip: Brand & Minimal Newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#EBE8DF] dark:border-[#20201D]">
          
          {/* Brand & 1-line Mission */}
          <div className="space-y-1 max-w-lg">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-[#C96442]" />
              <Link href="/" className="inline-block">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
                  NewsFlow
                </span>
              </Link>
              <span className="text-[10px] font-mono text-[#8E8B82] dark:text-[#78756E] border-l border-[#EBE8DF] dark:border-[#262522] pl-2.5">
                Autonomous Technology Journalism
              </span>
            </div>
            <p className="text-xs text-[#686660] dark:text-[#8E8B82] leading-relaxed">
              Synthesizing breakthrough advancements across AI, robotics, and computing from 50+ sources 24/7.
            </p>
          </div>

          {/* Minimal Inline Subscription */}
          <div className="w-full lg:w-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs font-mono text-[#8E8B82] dark:text-[#78756E] shrink-0 sm:mr-1">
                Morning Synthesis:
              </span>
              {subscribed ? (
                <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 py-1">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Subscribed</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    className="w-48 sm:w-56 px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-[#1A1917] border border-[#EBE8DF] dark:border-[#262522] text-[#1F1E1D] dark:text-[#F5F2EB] placeholder-[#8E8B82] focus:outline-hidden focus:border-[#C96442]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-[#C96442] hover:bg-[#b85535] text-white text-xs font-medium font-mono shrink-0 transition-colors cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* 4-Column Directory Grid (Clean, unboxed, minimal typography) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-7 border-b border-[#EBE8DF] dark:border-[#20201D]">
          
          {/* Column 1: News Desks */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#78756E]">
              Desks
            </h4>
            <ul className="space-y-1.5 text-xs text-[#686660] dark:text-[#A8A59D]">
              <li>
                <Link href="/category/ai" className="hover:text-[#C96442] transition-colors">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link href="/category/robotics" className="hover:text-[#C96442] transition-colors">
                  Robotics
                </Link>
              </li>
              <li>
                <Link href="/category/startups-vc" className="hover:text-[#C96442] transition-colors">
                  Startups & VC
                </Link>
              </li>
              <li>
                <Link href="/category/gadgets-hardware" className="hover:text-[#C96442] transition-colors">
                  Hardware
                </Link>
              </li>
              <li>
                <Link href="/category/cybersecurity" className="hover:text-[#C96442] transition-colors">
                  Cybersecurity
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Editorial */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#78756E]">
              Newsroom
            </h4>
            <ul className="space-y-1.5 text-xs text-[#686660] dark:text-[#A8A59D]">
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors">
                  About the AI Desk
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors">
                  Pipeline Architecture
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors">
                  Editorial Charter
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors">
                  Source Whitelist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Feeds & Discovery */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#78756E]">
              Intelligence
            </h4>
            <ul className="space-y-1.5 text-xs text-[#686660] dark:text-[#A8A59D]">
              <li>
                <Link href="/archive" className="hover:text-[#C96442] transition-colors">
                  Timeline Archive
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[#C96442] transition-colors">
                  Search Catalog
                </Link>
              </li>
              <li>
                <Link href="/rss.xml" className="hover:text-[#C96442] transition-colors">
                  RSS 2.0 Feed
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-[#C96442] transition-colors">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#78756E]">
              Governance
            </h4>
            <ul className="space-y-1.5 text-xs text-[#686660] dark:text-[#A8A59D]">
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
                  FTC Disclosures
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#C96442] transition-colors text-[11px] text-[#8E8B82]">
                  Admin Cockpit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8E8B82] dark:text-[#686660]">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} NewsFlow.</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>24/7 Autonomous Wire</span>
            </span>
            <span>•</span>
            <span>Reader-supported</span>
          </div>

          <button
            onClick={scrollToTop}
            className="hover:text-[#C96442] transition-colors inline-flex items-center space-x-1 cursor-pointer font-mono"
            title="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

      </div>
    </footer>
  );
}