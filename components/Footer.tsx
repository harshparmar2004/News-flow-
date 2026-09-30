"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rss, ShieldCheck, Cpu } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Do not render public consumer footer on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-24 border-t border-[#EBE8DF] dark:border-[#33322E] bg-[#F7F4EC] dark:bg-[#151514] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
                NewsFlow
              </span>
            </Link>
            <p className="text-sm text-[#686660] dark:text-[#A8A59D] max-w-md leading-relaxed">
              An autonomous digital publication continuously monitoring, synthesizing, and reporting on the global technology landscape from 50+ primary sources. Built for high signal-to-noise clarity.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#686660] dark:text-[#A8A59D]">
              <Cpu className="w-3.5 h-3.5 text-[#C96442]" />
              <span>Published continuously by NewsFlow Agentic Pipeline</span>
            </div>
          </div>

          {/* Column 2: Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F1E1D] dark:text-[#F5F2EB]">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-[#686660] dark:text-[#A8A59D]">
              <li>
                <Link href="/category/ai-robotics" className="hover:text-[#C96442] transition-colors">
                  AI & Robotics
                </Link>
              </li>
              <li>
                <Link href="/category/startups-vc" className="hover:text-[#C96442] transition-colors">
                  Startups & VC
                </Link>
              </li>
              <li>
                <Link href="/category/gadgets-hardware" className="hover:text-[#C96442] transition-colors">
                  Gadgets & Hardware
                </Link>
              </li>
              <li>
                <Link href="/category/cybersecurity" className="hover:text-[#C96442] transition-colors">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link href="/category/policy-big-tech" className="hover:text-[#C96442] transition-colors">
                  Policy & Big Tech
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Transparency & Feeds */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F1E1D] dark:text-[#F5F2EB]">
              Transparency & Feeds
            </h4>
            <ul className="space-y-2 text-sm text-[#686660] dark:text-[#A8A59D]">
              <li>
                <Link href="/about" className="hover:text-[#C96442] transition-colors flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C96442]" />
                  <span>About Our AI Newsroom</span>
                </Link>
              </li>
              <li>
                <Link href="/archive" className="hover:text-[#C96442] transition-colors">
                  Chronological Archive
                </Link>
              </li>
              <li>
                <Link href="/rss.xml" className="hover:text-[#C96442] transition-colors flex items-center space-x-1.5">
                  <Rss className="w-3.5 h-3.5 text-amber-600" />
                  <span>RSS 2.0 Feed</span>
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-[#C96442] transition-colors">
                  XML Sitemap
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#C96442] transition-colors text-xs text-[#8E8B82] dark:text-[#686660]">
                  Admin Cockpit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip: FTC disclosure and copyright */}
        <div className="mt-12 pt-6 border-t border-[#EBE8DF] dark:border-[#33322E] flex flex-col sm:flex-row justify-between items-center text-xs text-[#8E8B82] dark:text-[#686660] gap-4">
          <p>
            &copy; {new Date().getFullYear()} NewsFlow. All rights reserved. Zero-clutter autonomous journalism.
          </p>
          <p className="max-w-md text-center sm:text-right">
            FTC Disclosure: NewsFlow is reader-supported. We may earn an affiliate commission on qualifying purchases made through contextual recommendation links.
          </p>
        </div>
      </div>
    </footer>
  );
}