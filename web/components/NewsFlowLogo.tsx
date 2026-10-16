"use client";

import React from "react";

interface NewsFlowLogoProps {
  size?: number;
  className?: string;
  showPulse?: boolean;
}

export function NewsFlowLogo({
  size = 32,
  className = "",
  showPulse = false,
}: NewsFlowLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-[24%] overflow-hidden shadow-xs transition-transform duration-200 group-hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 512 512"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="nfUiBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E45B2B" />
            <stop offset="42%" stopColor="#C96442" />
            <stop offset="100%" stopColor="#9C3412" />
          </linearGradient>

          <linearGradient id="nfUiBevelRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.36" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
          </linearGradient>

          <linearGradient id="nfUiLeftPillar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F5EFE6" />
          </linearGradient>

          <linearGradient id="nfUiRightPillar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FAF5EE" />
          </linearGradient>

          <linearGradient id="nfUiDiagonalFold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FDFBF7" />
            <stop offset="75%" stopColor="#F4EFE6" />
            <stop offset="100%" stopColor="#E2D4BF" />
          </linearGradient>

          <linearGradient id="nfUiCreaseGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9660" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9C3412" stopOpacity="0" />
          </linearGradient>

          <filter id="nfUiFoldShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-5" dy="7" stdDeviation="9" floodColor="#4F1706" floodOpacity="0.48" />
          </filter>
        </defs>

        {/* Terracotta Squircle Outer Badge */}
        <rect x="24" y="24" width="464" height="464" rx="124" fill="url(#nfUiBgGrad)" />
        <rect x="25" y="25" width="462" height="462" rx="123" fill="none" stroke="url(#nfUiBevelRim)" strokeWidth="3" />

        {/* Origami Ribbon N */}
        <g id="origami-n">
          <rect x="312" y="112" width="80" height="288" rx="16" fill="url(#nfUiRightPillar)" />
          <rect x="120" y="112" width="80" height="288" rx="16" fill="url(#nfUiLeftPillar)" />
          <path d="M120 112 L200 112 L392 400 L312 400 Z" fill="url(#nfUiCreaseGlow)" />
          <path d="M120 112 L200 112 L392 400 L312 400 Z" fill="url(#nfUiDiagonalFold)" filter="url(#nfUiFoldShadow)" />
          <polygon points="120,112 200,112 160,166 120,112" fill="#FFFFFF" opacity="0.6" />
          <polygon points="312,400 392,400 352,346 312,400" fill="#69240E" opacity="0.4" />
        </g>
      </svg>

      {/* Subtle pulse ring for live wire feel if enabled */}
      {showPulse && (
        <span
          className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75 pointer-events-none"
          style={{ width: Math.max(4, size * 0.18), height: Math.max(4, size * 0.18) }}
        />
      )}
    </div>
  );
}
