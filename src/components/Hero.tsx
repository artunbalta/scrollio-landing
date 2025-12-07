"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import TryMeModal from "./TryMeModal";

export default function Hero() {
  const [isTryMeOpen, setIsTryMeOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  
  const animatedWords = useMemo(
    () => ["Learning", "Discovery", "Growth", "Adventure", "Curiosity"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (wordIndex === animatedWords.length - 1) {
        setWordIndex(0);
      } else {
        setWordIndex(wordIndex + 1);
      }
    }, 2500); // 2.5 saniyede bir değişiyor
    return () => clearTimeout(timeoutId);
  }, [wordIndex, animatedWords]);

  const scrollToWaitlist = () => {
    const element = document.getElementById("waitlist");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen pt-24 pb-20 px-6 bg-dots overflow-hidden">
      {/* Floating Decorative Shapes */}
      <div 
        className="absolute top-20 left-[5%] w-48 h-64 bg-gradient-to-br from-orange-200 to-orange-100 rounded-3xl animate-float-slow"
        style={{ transform: 'rotate(-12deg)', opacity: 'var(--shape-opacity)' }}
      />
      <div 
        className="absolute top-40 right-[8%] w-40 h-56 bg-gradient-to-br from-purple-200 to-purple-100 rounded-3xl animate-float"
        style={{ transform: 'rotate(15deg)', opacity: 'var(--shape-opacity)' }}
      />
      <div 
        className="absolute bottom-32 left-[15%] w-36 h-48 bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl animate-float-reverse"
        style={{ transform: 'rotate(8deg)', opacity: 'calc(var(--shape-opacity) * 0.75)' }}
      />
      <div 
        className="absolute bottom-20 right-[12%] w-44 h-60 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl animate-float-slow"
        style={{ transform: 'rotate(-8deg)', opacity: 'calc(var(--shape-opacity) * 0.85)' }}
      />
      <div 
        className="absolute top-1/2 left-[2%] w-32 h-44 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl animate-float"
        style={{ transform: 'rotate(20deg)', opacity: 'calc(var(--shape-opacity) * 0.6)' }}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto relative z-10 text-center pt-16" style={{ overflow: 'visible' }}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm mb-8" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Now accepting early access signups</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6" style={{ lineHeight: '1.2', overflow: 'visible' }}>
          <span style={{ color: 'var(--foreground)' }}>Turn Scrolling</span>
          <br />
          <span style={{ color: 'var(--foreground)' }}>Into </span>
          <span className="relative inline-block overflow-hidden" style={{ height: '1.2em', width: 'clamp(250px, 40vw, 500px)', verticalAlign: 'top' }}>
            {animatedWords.map((word, index) => (
              <motion.span
                key={index}
                className="absolute left-0 top-0 gradient-text text-5xl md:text-6xl lg:text-7xl font-bold whitespace-nowrap"
                initial={{ opacity: 0, y: "-100%" }}
                transition={{ type: "spring", stiffness: 50, damping: 12 }}
                animate={
                  wordIndex === index
                    ? {
                        y: 0,
                        opacity: 1,
                      }
                    : {
                        y: wordIndex > index ? "-150%" : "150%",
                        opacity: 0,
                      }
                }
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--foreground-muted)' }}>
          AI-powered education made simple. From TikTok-style micro-learning 
          to magical experiences where drawings become living mentors.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button 
            onClick={scrollToWaitlist} 
            className="btn-primary text-base py-4 px-8 font-script text-xl"
          >
            Get Started
          </button>
          <button 
            onClick={() => setIsTryMeOpen(true)}
            className="btn-secondary text-base py-4 px-8 flex items-center justify-center gap-2"
          >
            Try Demo
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Scrollio Core Card */}
          <div className="card-light p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Scrollio Core</h3>
                <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>For teens & adults</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
              AI-curated vertical feed of short educational videos. Science, tech, psychology, creativity and more.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">Micro-learning</span>
              <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">AI-curated</span>
            </div>
          </div>

          {/* Scrollio Kids Card */}
          <div className="card-light p-6 text-left" style={{ borderColor: 'rgba(249, 115, 22, 0.2)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Scrollio Kids</h3>
                <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>For children & families</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
              Draw a character, watch it come alive, learn together. A living mentor from imagination.
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--foreground-muted)' }}>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-medium">1</span>
                Draw
              </span>
              <span style={{ color: 'var(--card-border)' }}>→</span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-medium">2</span>
                Animate
              </span>
              <span style={{ color: 'var(--card-border)' }}>→</span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-medium">3</span>
                Learn
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Try Me Modal */}
      <TryMeModal isOpen={isTryMeOpen} onClose={() => setIsTryMeOpen(false)} />
    </section>
  );
}
