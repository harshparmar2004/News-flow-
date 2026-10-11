"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Cpu, 
  Bot, 
  TrendingUp, 
  Smartphone, 
  ShieldAlert, 
  Scale, 
  Layers 
} from "lucide-react";

interface CategoryPill {
  name: string;
  shortName?: string;
  href: string;
  slug: string;
  icon: any;
}

const CATEGORY_PILLS: CategoryPill[] = [
  { name: "All Intelligence", shortName: "All", href: "/", slug: "", icon: Sparkles },
  { name: "AI", href: "/category/ai", slug: "ai", icon: Cpu },
  { name: "Robotics", href: "/category/robotics", slug: "robotics", icon: Bot },
  { name: "Startups & VC", shortName: "Startups", href: "/category/startups-vc", slug: "startups-vc", icon: TrendingUp },
  { name: "Gadgets", href: "/category/gadgets-hardware", slug: "gadgets-hardware", icon: Smartphone },
  { name: "Cybersecurity", shortName: "Cyber", href: "/category/cybersecurity", slug: "cybersecurity", icon: ShieldAlert },
  { name: "Policy", href: "/category/policy-big-tech", slug: "policy-big-tech", icon: Scale },
  { name: "Tech & Innovation", shortName: "Tech", href: "/category/tech", slug: "tech", icon: Layers },
];

export function MobileCategoryBar() {
  const pathname = usePathname();

  // Hide on admin routes, article reading pages, and non-reader views
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/article/")) {
    return null;
  }

  return (
    <nav 
      aria-label="Mobile Category Navigation"
      className="sticky top-14 sm:top-16 z-30 lg:hidden w-full bg-[#FBF9F5]/95 dark:bg-[#181816]/95 backdrop-blur-md border-b border-[#EBE8DF] dark:border-[#282724] transition-colors duration-200"
    >
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-3.5 py-2.5">
        {CATEGORY_PILLS.map((pill) => {
          const isActive =
            pill.slug === ""
              ? pathname === "/"
              : pathname === pill.href || pathname?.startsWith(`/category/${pill.slug}`);

          const Icon = pill.icon;

          return (
            <Link
              key={pill.href}
              href={pill.href}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                isActive
                  ? "bg-[#C96442] text-white shadow-xs font-semibold"
                  : "bg-white dark:bg-[#201F1D] text-[#686660] dark:text-[#A8A59D] border border-[#EBE8DF] dark:border-[#2C2A26] hover:border-[#C96442]/60 hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#C96442]"}`} />
              <span className="whitespace-nowrap">{pill.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
