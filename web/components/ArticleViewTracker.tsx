"use client";

import { useEffect } from "react";

interface ArticleViewTrackerProps {
  articleId: string;
}

/**
 * Genuine Reader View Tracker
 * - Fires exclusively in real client browsers.
 * - Deduplicates page reloads / refreshes within the same tab session.
 * - Ignores headless crawlers (navigator.webdriver).
 * - Next.js builds and server workers never trigger this.
 */
export function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  useEffect(() => {
    // 1. Guard against server execution and automated testing tools
    if (typeof window === "undefined" || navigator.webdriver) return;

    // 2. Prevent counting rapid reloads in the same session
    const sessionKey = `nf_view_${articleId}`;
    if (sessionStorage.getItem(sessionKey)) return;

    try {
      sessionStorage.setItem(sessionKey, "1");
    } catch {
      // Safe fallback if private mode restricts sessionStorage
    }

    // 3. Dispatch genuine reader view beacon
    const payload = JSON.stringify({ articleId });
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/articles/view", blob);
    } else {
      fetch("/api/articles/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [articleId]);

  return null;
}
