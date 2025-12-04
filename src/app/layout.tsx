import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import GradientBackground from "@/components/GradientBackground";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scrollio – Turn Scrolling Into Learning",
  description: "Scrollio is an AI-powered learning platform that transforms everyday scrolling into meaningful education. From TikTok-style knowledge feeds to magical experiences where your child's drawings become living mentors.",
  keywords: ["education", "kids learning", "AI education", "edtech", "family learning", "school technology", "interactive learning"],
  openGraph: {
    title: "Scrollio – Turn Scrolling Into Learning",
    description: "An AI-powered playground that creates living stories from children's drawings.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${sora.variable} font-sans antialiased bg-[#0a0a0f] text-[#f0f0f5]`}>
        <GradientBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
