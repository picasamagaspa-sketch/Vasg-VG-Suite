import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vasg-VG AI Suite",
  description: "An AI operating system for creators, viral hook generator for hooks, CaptionFlow Ai for captions, ScriptForge Ai for short-form scripts, ContentPlanner AI for 30-day plans, Thumbnail Copy AI for Titles + thumbnail text where each tool connect like an ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
