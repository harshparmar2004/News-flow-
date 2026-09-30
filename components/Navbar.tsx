"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Radio, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  Activity, 
  KeyRound,
  LogOut
} from "lucide-react";
import { useTheme } from "./ThemeContext";

const PUBLIC_NAV_LINKS = [
  { name: "AI & Robotics", href: "/category/ai-robotics" },
  { name: "Startups & VC", href: "/category/startups-vc" },
  { name: "Gadgets", href: "/category/gadgets-hardware" },
  { name: "Cybersecurity", href: "/category/cybersecurity" },
  { name: "Policy", href: "/category/policy-big-tech" },
  { name: "Tech & Innovation", href: "/category/tech" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FBF9F5]/90 dark:bg-[#181816]/90 border-b border-[#EBE8DF] dark:border-[#282724] transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Context Badge */}
          <div className="flex items-center space-x-3">
            <Link href={isAdminRoute ? "/admin" : "/"} className="flex items-baseline space-x-2 group">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB] group-hover:text-[#C96442] dark:group-hover:text-[#C96442] transition-colors">
                NewsFlow
              </span>
              
              {isAdminRoute ? (
                <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Admin Cockpit
                </span>
              ) : (
                <span className="hidden sm:inline-block text-[11px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#C96442]/10 text-[#C96442] border border-[#C96442]/20">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C96442] animate-pulse mr-1" />
                  Live Agent
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Center Navigation */}
          {isAdminRoute ? (
            /* ADMIN-SPECIFIC WORKSPACE TOOLS (NO reader category links that take admin away) */
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 text-xs font-mono font-medium text-[#686660] dark:text-[#A8A59D]">
              <span className="px-3 py-1.5 rounded-xl bg-[#EBE8DF]/50 dark:bg-[#252422] text-[#1F1E1D] dark:text-[#F5F2EB] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#C96442]" />
                Articles Vault
              </span>

              <a
                href="/api/health"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl hover:bg-[#FAF7F0] dark:hover:bg-[#20201D] hover:text-[#C96442] transition-colors flex items-center gap-1.5"
                title="Open live health status"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>Health: OK</span>
              </a>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] hover:border-[#C96442] hover:text-[#C96442] transition-all flex items-center gap-1.5 text-[#1F1E1D] dark:text-[#F5F2EB]"
                title="View public reader website in a new tab"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-3 h-3 text-[#8E8B82]" />
              </a>
            </nav>
          ) : (
            /* PUBLIC READER CATEGORY NAVIGATION */
            <nav className="hidden md:flex items-center space-x-6 text-[14px] font-medium text-[#686660] dark:text-[#A8A59D]">
              {PUBLIC_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB] hover:text-[#C96442] dark:hover:text-[#C96442] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Action Utilities (Search, Theme, Admin Logout / About) */}
          <div className="flex items-center space-x-3">
            {!isAdminRoute && (
              <Link
                href="/search"
                aria-label="Search articles"
                className="p-2 rounded-full text-[#686660] dark:text-[#A8A59D] hover:bg-[#EBE8DF]/50 dark:hover:bg-[#2A2925] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB] transition-colors"
              >
                <Search className="w-4 h-4" />
              </Link>
            )}

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-[#686660] dark:text-[#A8A59D] hover:bg-[#EBE8DF]/50 dark:hover:bg-[#2A2925] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB] transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAdminRoute && !isLoginPage ? (
              <button
                onClick={handleAdminLogout}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-950/60 bg-red-50/50 dark:bg-red-950/20 text-xs font-mono font-medium text-red-700 dark:text-red-400 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : !isAdminRoute ? (
              <Link
                href="/about"
                className="hidden sm:inline-flex text-xs font-medium px-3 py-1.5 rounded-full border border-[#EBE8DF] dark:border-[#33322E] text-[#686660] dark:text-[#A8A59D] hover:border-[#C96442] hover:text-[#C96442] transition-colors"
              >
                About
              </Link>
            ) : null}

            {/* Mobile Menu Button */}
            {!isAdminRoute && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#686660] dark:text-[#A8A59D] hover:bg-[#EBE8DF]/50 dark:hover:bg-[#2A2925]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer for Public Site */}
        {mobileMenuOpen && !isAdminRoute && (
          <div className="md:hidden py-4 border-t border-[#EBE8DF] dark:border-[#33322E] space-y-2">
            <div className="flex items-center px-3 py-1 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#C96442]">
                <Radio className="inline-block w-3 h-3 mr-1 animate-pulse" />
                Autonomous News Desk (24/7)
              </span>
            </div>
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#1F1E1D] dark:text-[#F5F2EB] hover:bg-[#EBE8DF]/50 dark:hover:bg-[#2A2925]"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#EBE8DF] dark:border-[#33322E] flex justify-between px-3">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#686660] dark:text-[#A8A59D]"
              >
                About
              </Link>
              <Link
                href="/archive"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#686660] dark:text-[#A8A59D]"
              >
                Archive
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}