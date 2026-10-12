"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function ArticleBackButton() {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <a
      href="/"
      onClick={handleBack}
      className="hover:text-[#C96442] transition-colors flex items-center gap-1 font-medium shrink-0 cursor-pointer"
      title="Back to previous feed"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      <span>Back</span>
    </a>
  );
}
