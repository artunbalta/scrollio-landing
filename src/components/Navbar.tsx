"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Header starts fading at 50px and fully gone by 200px
      const progress = Math.min(1, Math.max(0, (currentScrollY - 50) / 150));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Calculate transform and opacity based on scroll
  const translateY = -scrollProgress * 100; // Move up to -100%
  const opacity = 1 - scrollProgress;

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" 
        style={{ 
          backgroundColor: theme === 'dark' ? 'rgba(10, 10, 15, 0.4)' : 'rgba(250, 249, 246, 0.5)', 
          borderColor: 'var(--card-border)',
          transform: `translateY(${translateY}%)`,
          opacity: opacity,
          pointerEvents: scrollProgress > 0.9 ? 'none' : 'auto'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center gap-2 h-full">
              <Image
                src="/icon.png"
                alt="Scrollio Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Scrollio</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-sm transition-colors"
                style={{ color: 'var(--foreground-muted)' }}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("for-kids")}
                className="text-sm transition-colors"
                style={{ color: 'var(--foreground-muted)' }}
              >
                For Kids
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-sm transition-colors"
                style={{ color: 'var(--foreground-muted)' }}
              >
                FAQ
              </button>
            </div>

            {/* Right side: Theme toggle + CTA */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <svg className="w-4 h-4" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => scrollToSection("waitlist")}
                className="btn-primary text-sm py-2.5 px-5"
              >
                Get Started
              </button>
            </div>

            {/* Mobile: Theme toggle + Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <svg className="w-4 h-4" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

              {/* Menu Button */}
              <button
                className="p-2 z-50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span
                    className={`block h-0.5 transition-all duration-300 ${
                      mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                    style={{ backgroundColor: 'var(--foreground)' }}
                  />
                  <span
                    className={`block h-0.5 transition-all duration-300 ${
                      mobileMenuOpen ? "opacity-0" : ""
                    }`}
                    style={{ backgroundColor: 'var(--foreground)' }}
                  />
                  <span
                    className={`block h-0.5 transition-all duration-300 ${
                      mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                    style={{ backgroundColor: 'var(--foreground)' }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)' }}
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu panel */}
          <div 
            className="absolute top-16 left-0 right-0 p-6 shadow-lg"
            style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--card-border)' }}
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-lg py-2 transition-colors"
                style={{ color: 'var(--foreground)' }}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("for-kids")}
                className="text-left text-lg py-2 transition-colors"
                style={{ color: 'var(--foreground)' }}
              >
                For Kids
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-left text-lg py-2 transition-colors"
                style={{ color: 'var(--foreground)' }}
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("waitlist")}
                className="btn-primary text-base py-4 px-6 mt-4 text-center"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
