"use client";

import Link from "next/link";
import { Cpu, ShieldCheck, Rss } from "lucide-react";

export function EditorialColophon() {
  return (
    <footer className="pt-10 pb-12 mt-12 border-t border-[#EBE8DF] dark:border-[#262522] text-xs text-[#8E8B82] dark:text-[#78756E] space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-sm text-[#1F1E1D] dark:text-[#F5F2EB]">
              NewsFlow
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono">
              <Cpu className="w-3 h-3 text-[#C96442]" />
              Autonomous Journalism
            </span>
          </div>
          <p className="text-[11px] text-[#686660] dark:text-[#A8A59D] max-w-md leading-relaxed">
            Synthesized continuously around the clock from 50+ tier-1 technology publications, arXiv papers, and regulatory disclosures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          <Link href="/about" className="hover:text-[#C96442] transition-colors">
            About Desk
          </Link>
          <span>•</span>
          <Link href="/archive" className="hover:text-[#C96442] transition-colors">
            Timeline Archive
          </Link>
          <span>•</span>
          <Link href="/rss.xml" className="hover:text-[#C96442] transition-colors">
            RSS 2.0
          </Link>
          <span>•</span>
          <Link href="/sitemap.xml" className="hover:text-[#C96442] transition-colors">
            Sitemap
          </Link>
          <span>•</span>
          <Link href="/admin" className="hover:text-[#C96442] transition-colors">
            Admin
          </Link>
        </div>
      </div>

      <div className="pt-3 border-t border-[#EBE8DF]/50 dark:border-[#22211E] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px]">
        <p>© {new Date().getFullYear()} NewsFlow. Built for high signal-to-noise clarity.</p>
        <p className="text-[#8E8B82] dark:text-[#686660] text-center sm:text-right">
          FTC Disclosure: Reader-supported through contextual affiliate recommendation links.
        </p>
      </div>
    </footer>
  );
}
