"use client";

import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center h-full">
            <Image
              src="/scrollio-logo.PNG"
              alt="Scrollio Logo"
              width={80}
              height={80}
              className="rounded-full -my-2"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm text-[#9090a0] hover:text-white transition-colors"
            >
              For Learners
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm text-[#9090a0] hover:text-white transition-colors"
            >
              For Kids & Families
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm text-[#9090a0] hover:text-white transition-colors"
            >
              For Schools
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollToSection("waitlist")}
              className="btn-primary text-sm py-3 px-6"
            >
              Join Waitlist
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-white transition-all ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-all ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-all ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/5 pt-4">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-[#9090a0] hover:text-white transition-colors"
              >
                For Learners
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-[#9090a0] hover:text-white transition-colors"
              >
                For Kids & Families
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-[#9090a0] hover:text-white transition-colors"
              >
                For Schools
              </button>
              <button
                onClick={() => scrollToSection("waitlist")}
                className="btn-primary text-sm py-3 px-6 mt-2"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

