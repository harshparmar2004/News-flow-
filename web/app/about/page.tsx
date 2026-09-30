import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Cpu, Database, Eye, Terminal, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Our Autonomous AI Newsroom & Editorial Charter",
  description:
    "Transparency manifest: How the NewsFlow agentic pipeline monitors 50+ global technology sources, synthesizes intelligence via Gemini 2.5, and maintains human editorial integrity.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <header className="space-y-4 text-center sm:text-left pb-8 border-b border-[#EBE8DF] dark:border-[#33322E]">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C96442]/10 text-[#C96442] border border-[#C96442]/20 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Editorial Transparency Manifest</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
          The Autonomous News Desk
        </h1>
        <p className="text-base sm:text-xl text-[#686660] dark:text-[#A8A59D] max-w-2xl leading-relaxed">
          NewsFlow is a next-generation technology publication authored, fact-checked, and operated continuously by an autonomous agentic pipeline.
        </p>
      </header>

      {/* Core Mission */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
          Why NewsFlow Exists
        </h2>
        <p className="text-base text-[#686660] dark:text-[#A8A59D] leading-relaxed">
          The technology landscape produces thousands of disparate press releases, pre-print arXiv papers, regulatory filings, and code commits every 24 hours. Human editorial desks naturally introduce cognitive latency, algorithmic bias, or superficial clickbait incentives.
        </p>
        <p className="text-base text-[#686660] dark:text-[#A8A59D] leading-relaxed">
          NewsFlow was architected to solve the modern developer&apos;s signal-to-noise crisis: delivering dense, beautifully typeset, objective technology synthesis within minutes of primary event verification.
        </p>
      </section>

      {/* 4-Pillar Pipeline Architecture */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
          The 4-Pillar Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-3">
            <div className="flex items-center space-x-2 text-[#C96442]">
              <Database className="w-4 h-4" />
              <h3 className="font-serif text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                1. Continuous Ingestion
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#686660] dark:text-[#A8A59D] leading-relaxed">
              Scrapes 50+ tier-1 technology publications, research portals, and developer hubs using resilient RSS readers and ScrapeGraphAI with strict robots.txt compliance.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-3">
            <div className="flex items-center space-x-2 text-[#C96442]">
              <Cpu className="w-4 h-4" />
              <h3 className="font-serif text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                2. Gemini 2.5 Synthesis
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#686660] dark:text-[#A8A59D] leading-relaxed">
              Rather than generic summarization, our custom reasoning prompt evaluates architectural trade-offs, deduplicates overlapping stories, and crafts multi-paragraph analytical reports.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-3">
            <div className="flex items-center space-x-2 text-[#C96442]">
              <Eye className="w-4 h-4" />
              <h3 className="font-serif text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                3. Art Direction & Visuals
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#686660] dark:text-[#A8A59D] leading-relaxed">
              Generates context-aware cover imagery using Nano Banana and editorial photography, avoiding generic stock graphics in favor of clean conceptual designs.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#EBE8DF] dark:border-[#33322E] bg-white dark:bg-[#22221F] space-y-3">
            <div className="flex items-center space-x-2 text-[#C96442]">
              <Terminal className="w-4 h-4" />
              <h3 className="font-serif text-base font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
                4. Human Override Cockpit
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#686660] dark:text-[#A8A59D] leading-relaxed">
              Human editors oversee the live publication queue via a dedicated admin portal, with 1-click controls to redact, edit, feature, or archive any automated story.
            </p>
          </div>
        </div>
      </section>

      {/* Sourcing & Ethics */}
      <section className="p-8 rounded-3xl border border-[#E8E2D5] dark:border-[#383630] bg-[#FAF7F0] dark:bg-[#20201D] space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
          Ethics, Attribution & Corrections Policy
        </h2>
        <ul className="space-y-3 text-sm text-[#686660] dark:text-[#A8A59D]">
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#C96442] shrink-0 mt-0.5" />
            <span>
              <strong>Primary Attribution:</strong> Every synthesized report includes an explicit link to the original reporting source or research paper.
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#C96442] shrink-0 mt-0.5" />
            <span>
              <strong>No Verbatim Copying:</strong> The pipeline creates synthesized technical analysis, avoiding wholesale excerpting or intellectual property infringement.
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#C96442] shrink-0 mt-0.5" />
            <span>
              <strong>Rapid Correction Protocol:</strong> If an error is detected in an AI-generated piece, our editorial team immediately redacts or issues corrections via the Admin Cockpit.
            </span>
          </li>
        </ul>
      </section>

      {/* Contact / Inquiries */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-[#1F1E1D] dark:text-[#F5F2EB]">
          Corrections & Technical Inquiries
        </h2>
        <p className="text-sm text-[#686660] dark:text-[#A8A59D]">
          Have a correction, feedback on an article, or want to syndicate our RSS feed? Reach our engineering team at <code className="text-[#C96442]">editor@newsflow.ai</code>.
        </p>
      </section>
    </div>
  );
}