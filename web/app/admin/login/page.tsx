"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-3xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] shadow-lg shadow-amber-950/5 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#C96442]/10 text-[#C96442] flex items-center justify-center border border-[#C96442]/20">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
            NewsFlow Admin Cockpit
          </h1>
          <p className="text-xs text-[#686660] dark:text-[#A8A59D]">
            Human editorial override & autonomous pipeline controls
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#686660] dark:text-[#A8A59D] mb-1.5">
              Admin Master Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password..."
              className="w-full px-4 py-3 rounded-xl border border-[#EBE8DF] dark:border-[#33322E] bg-[#FAF7F0] dark:bg-[#1C1C19] text-sm text-[#1F1E1D] dark:text-[#F5F2EB] placeholder-[#8E8B82] focus:outline-none focus:border-[#C96442]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#C96442] hover:bg-[#B35334] text-white text-sm font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Unlock Cockpit"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#EBE8DF] dark:border-[#33322E] text-center text-[11px] text-[#8E8B82]">
          Password configured via <code className="font-mono text-[#C96442]">ADMIN_PASSWORD</code> env variable.
        </div>
      </div>
    </div>
  );
}