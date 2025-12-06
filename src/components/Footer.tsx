"use client";

import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="py-12 px-6" style={{ backgroundColor: 'var(--background-secondary)', borderTop: '1px solid var(--card-border)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Left - Logo & Copyright */}
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="Scrollio Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Scrollio</span>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>© {currentYear} All rights reserved.</p>
            </div>
          </div>

          {/* Center - Links */}
          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={() => scrollToSection("features")}
              className="text-sm transition-colors"
              style={{ color: 'var(--foreground-muted)' }}
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection("faq")}
              className="text-sm transition-colors"
              style={{ color: 'var(--foreground-muted)' }}
            >
              FAQ
            </button>
            <button 
              onClick={() => scrollToSection("waitlist")}
              className="text-sm transition-colors"
              style={{ color: 'var(--foreground-muted)' }}
            >
              Waitlist
            </button>
          </div>

          {/* Right - Tagline */}
          <p className="text-sm text-center md:text-right" style={{ color: 'var(--foreground-muted)' }}>
            Learning that feels like play.
          </p>
        </div>
      </div>
    </footer>
  );
}
