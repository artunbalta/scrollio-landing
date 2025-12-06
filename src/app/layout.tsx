import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scrollio – Turn Scrolling Into Learning",
  description: "Scrollio is an AI-powered learning platform that transforms everyday scrolling into meaningful education. From TikTok-style knowledge feeds to magical experiences where your child's drawings become living mentors.",
  keywords: ["education", "kids learning", "AI education", "edtech", "family learning", "school technology", "interactive learning"],
  icons: {
    icon: [
      {
        url: '/icon.png',
        sizes: 'any',
      },
    ],
  },
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${sora.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
