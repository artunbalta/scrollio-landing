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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center h-full">
              <div className="w-16 h-16 rounded-full overflow-hidden -my-2">
                <Image
                  src="/icon.png"
                  alt="Scrollio Logo"
                  width={80}
                  height={80}
                  className="rounded-full scale-[1.43] origin-center"
                  style={{ transform: 'scale(1.43)' }}
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("for-learners")}
                className="text-sm text-[#9090a0] hover:text-white transition-colors"
              >
                For Learners
              </button>
              <button
                onClick={() => scrollToSection("for-kids")}
                className="text-sm text-[#9090a0] hover:text-white transition-colors"
              >
                For Kids & Families
              </button>
              <button
                onClick={() => scrollToSection("for-schools")}
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
              className="md:hidden p-2 z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Dark overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="absolute top-16 left-0 right-0 bg-[#0a0a0f] border-b border-white/10 p-6 shadow-2xl">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("for-learners")}
                className="text-left text-lg text-white hover:text-indigo-400 transition-colors py-2"
              >
                For Learners
              </button>
              <button
                onClick={() => scrollToSection("for-kids")}
                className="text-left text-lg text-white hover:text-indigo-400 transition-colors py-2"
              >
                For Kids & Families
              </button>
              <button
                onClick={() => scrollToSection("for-schools")}
                className="text-left text-lg text-white hover:text-indigo-400 transition-colors py-2"
              >
                For Schools
              </button>
              <button
                onClick={() => scrollToSection("waitlist")}
                className="btn-primary text-base py-4 px-6 mt-4 text-center"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
