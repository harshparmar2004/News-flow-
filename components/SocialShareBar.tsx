"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface SocialShareBarProps {
  title: string;
  url: string;
}

export function SocialShareBar({ title, url }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const redditUrl = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex items-center space-x-2 py-2">
      <span className="text-xs font-mono uppercase tracking-wider text-[#8E8B82] dark:text-[#686660] mr-1.5 flex items-center">
        <Share2 className="w-3.5 h-3.5 mr-1 text-[#C96442]" />
        Share
      </span>

      {/* X / Twitter */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="p-2 rounded-full border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] text-[#686660] dark:text-[#A8A59D] hover:text-[#C96442] hover:border-[#C96442] transition-colors"
        title="Share on X"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="p-2 rounded-full border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] text-[#686660] dark:text-[#A8A59D] hover:text-[#C96442] hover:border-[#C96442] transition-colors"
        title="Share on LinkedIn"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0-.01-3.18 1.59 1.59 0 0 0 .01 3.18M5.07 18.5h2.78v-8.37H5.07v8.37z" />
        </svg>
      </a>

      {/* Reddit */}
      <a
        href={redditUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Reddit"
        className="p-2 rounded-full border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] text-[#686660] dark:text-[#A8A59D] hover:text-[#C96442] hover:border-[#C96442] transition-colors"
        title="Share on Reddit"
      >
        <span className="text-[11px] font-bold font-mono px-0.5">r/</span>
      </a>

      {/* Copy link */}
      <button
        onClick={copyToClipboard}
        aria-label="Copy article link"
        className="p-2 rounded-full border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] text-[#686660] dark:text-[#A8A59D] hover:text-[#C96442] hover:border-[#C96442] transition-colors"
        title="Copy Link"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}