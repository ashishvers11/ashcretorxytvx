import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASH Creator Studio — AI YouTube Platform",
  description: "AI-powered YouTube creator growth platform for automated research, scriptwriting, video scene direction, SEO and thumbnails.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-950 text-slate-100 antialiased selection:bg-brand-500/20 selection:text-brand-300">
        {children}
      </body>
    </html>
  );
}
