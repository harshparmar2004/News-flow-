"use client";

import React, { useState, useEffect } from "react";

export function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent pointer-events-none transition-opacity duration-200 ${
        scrollProgress > 0 ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-[#C96442] transition-all duration-75 ease-out shadow-xs shadow-[#C96442]/30"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
