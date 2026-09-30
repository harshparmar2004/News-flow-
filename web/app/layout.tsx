import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "NewsFlow — Autonomous Tech Journalism",
    template: "%s | NewsFlow",
  },
  description:
    "Autonomous digital newsroom synthesizing breaking advancements in AI, foundation models, spatial computing, cybersecurity, and deep tech 24/7.",
  keywords: [
    "AI News",
    "Artificial Intelligence",
    "Machine Learning",
    "Robotics",
    "Cybersecurity",
    "Tech Startups",
    "Hardware",
  ],
  authors: [{ name: "NewsFlow AI Desk" }],
  creator: "NewsFlow",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "NewsFlow",
    title: "NewsFlow — Autonomous Tech Journalism",
    description:
      "Autonomous digital publication synthesizing breaking AI and frontier technology developments 24/7.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewsFlow — Autonomous Tech Journalism",
    description:
      "Autonomous digital publication synthesizing breaking AI and frontier technology developments 24/7.",
    creator: "@NewsFlowAI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#FBF9F5] dark:bg-[#181816] text-[#1F1E1D] dark:text-[#F5F2EB] transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}