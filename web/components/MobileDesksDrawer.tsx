"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  X, 
  Cpu, 
  Bot, 
  Sparkles, 
  TrendingUp, 
  Smartphone, 
  ShieldAlert, 
  Scale, 
  Radio, 
  Search, 
  Clock, 
  Rss, 
  Info,
  ChevronRight
} from "lucide-react";
import { useAdPreferences } from "./AdPreferencesContext";

interface MobileDesksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DESKS = [
  { name: "Artificial Intelligence", slug: "ai", icon: Cpu, href: "/category/ai" },
  { name: "Robotics", slug: "robotics", icon: Bot, href: "/category/robotics" },
  { name: "Tech & Innovation", slug: "tech", icon: Sparkles, href: "/category/tech" },
  { name: "Startups & VC", slug: "startups-vc", icon: TrendingUp, href: "/category/startups-vc" },
  { name: "Gadgets & Hardware", slug: "gadgets-hardware", icon: Smartphone, href: "/category/gadgets-hardware" },
  { name: "Cybersecurity", slug: "cybersecurity", icon: ShieldAlert, href: "/category/cybersecurity" },
  { name: "Policy & Big Tech", slug: "policy-big-tech", icon: Scale, href: "/category/policy-big-tech" },
];

export function MobileDesksDrawer({ isOpen, onClose }: MobileDesksDrawerProps) {
  const pathname = usePathname();
  const { isAdFree, toggleAdFree } = useAdPreferences();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="News Desks & Quick Navigation"
        className="relative z-10 w-full max-h-[85vh] bg-[#FBF9F5] dark:bg-[#181816] rounded-t-3xl border-t border-[#EBE8DF] dark:border-[#2C2A26] shadow-2xl overflow-y-auto pb-safe flex flex-col animate-in slide-in-from-bottom duration-300"
      >
        {/* Drawer Handle */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-[#D6D2C4] dark:bg-[#383631]" />
        </div>

        {/* Drawer Header */}
        <div className="px-5 py-3 border-b border-[#EBE8DF]/70 dark:border-[#282724] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C96442]" />
            <span className="font-serif text-lg font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
              News Desks & Navigation
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close desks drawer"
            className="p-1.5 rounded-full text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB] hover:bg-[#EBE8DF]/60 dark:hover:bg-[#252422] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          {/* Ad-Free Focus Mode Toggle Card */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#201F1D] border border-[#EBE8DF] dark:border-[#2C2A26] shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${isAdFree ? "bg-[#C96442]" : "bg-emerald-500"}`} />
                <span className="text-xs font-semibold text-[#1F1E1D] dark:text-[#F5F2EB]">
                  Ad-Free Reading Focus
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#8E8B82] dark:text-[#A8A59D]">
                {isAdFree ? "Expanded 3-story focus view active" : "Standard layout (monetized ads)"}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isAdFree}
              onClick={toggleAdFree}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                isAdFree ? "bg-[#C96442]" : "bg-[#D6D2C4] dark:bg-[#383631]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  isAdFree ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Desks Section */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#686660] px-1">
              Active Desks
            </h3>

            {/* Today's Live Wire */}
            <Link
              href="/today"
              onClick={onClose}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                pathname === "/today"
                  ? "bg-[#FBEBE8] dark:bg-[#2C1F1B] text-[#C96442] font-semibold"
                  : "bg-white dark:bg-[#201F1D] text-[#1F1E1D] dark:text-[#F5F2EB] border border-[#EBE8DF]/60 dark:border-[#2A2925]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Today&apos;s Live Wire</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8E8B82]" />
            </Link>

            {/* All Intelligence */}
            <Link
              href="/"
              onClick={onClose}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                pathname === "/"
                  ? "bg-[#EBE8DF] dark:bg-[#2A2925] text-[#C96442] font-semibold"
                  : "bg-white dark:bg-[#201F1D] text-[#1F1E1D] dark:text-[#F5F2EB] border border-[#EBE8DF]/60 dark:border-[#2A2925]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-4 h-4 text-[#C96442]" />
                <span>All Intelligence</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8E8B82]" />
            </Link>

            {/* 7 Dedicated Desks */}
            {DESKS.map((desk) => {
              const Icon = desk.icon;
              const isActive = pathname === desk.href || pathname?.startsWith(`/category/${desk.slug}`);

              return (
                <Link
                  key={desk.slug}
                  href={desk.href}
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#EBE8DF] dark:bg-[#2A2925] text-[#C96442] font-semibold"
                      : "bg-white dark:bg-[#201F1D] text-[#1F1E1D] dark:text-[#F5F2EB] border border-[#EBE8DF]/60 dark:border-[#2A2925]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-[#C96442]" />
                    <span>{desk.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E8B82]" />
                </Link>
              );
            })}
          </div>

          {/* Explore Utilities */}
          <div className="space-y-2 pt-2 border-t border-[#EBE8DF] dark:border-[#282724]">
            <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#8E8B82] dark:text-[#686660] px-1">
              Explore & Archive
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/search"
                onClick={onClose}
                className="flex items-center space-x-2 p-3 rounded-xl bg-white dark:bg-[#201F1D] border border-[#EBE8DF]/60 dark:border-[#2A2925] text-xs font-medium text-[#1F1E1D] dark:text-[#F5F2EB]"
              >
                <Search className="w-3.5 h-3.5 text-[#C96442]" />
                <span>Search</span>
              </Link>
              <Link
                href="/archive"
                onClick={onClose}
                className="flex items-center space-x-2 p-3 rounded-xl bg-white dark:bg-[#201F1D] border border-[#EBE8DF]/60 dark:border-[#2A2925] text-xs font-medium text-[#1F1E1D] dark:text-[#F5F2EB]"
              >
                <Clock className="w-3.5 h-3.5 text-[#C96442]" />
                <span>Archive</span>
              </Link>
              <Link
                href="/rss"
                onClick={onClose}
                className="flex items-center space-x-2 p-3 rounded-xl bg-white dark:bg-[#201F1D] border border-[#EBE8DF]/60 dark:border-[#2A2925] text-xs font-medium text-[#1F1E1D] dark:text-[#F5F2EB]"
              >
                <Rss className="w-3.5 h-3.5 text-[#C96442]" />
                <span>RSS Feeds</span>
              </Link>
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center space-x-2 p-3 rounded-xl bg-white dark:bg-[#201F1D] border border-[#EBE8DF]/60 dark:border-[#2A2925] text-xs font-medium text-[#1F1E1D] dark:text-[#F5F2EB]"
              >
                <Info className="w-3.5 h-3.5 text-[#C96442]" />
                <span>About Desk</span>
              </Link>
            </div>
          </div>

          {/* Live Agent Badge */}
          <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#1E1D1B] border border-[#EBE8DF] dark:border-[#282724] flex items-center space-x-2.5 text-xs text-[#8E8B82]">
            <Radio className="w-3.5 h-3.5 text-[#C96442] animate-pulse shrink-0" />
            <span>Autonomous Agent Desk active 24/7 • 50+ Global Feeds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
