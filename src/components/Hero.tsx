"use client";

import { useState } from "react";
import TryMeModal from "./TryMeModal";

export default function Hero() {
  const [isTryMeOpen, setIsTryMeOpen] = useState(false);

  const scrollToWaitlist = () => {
    const element = document.getElementById("waitlist");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 bg-glow overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-[#9090a0]">Now accepting early access signups</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Turn scrolling into{" "}
                <span className="gradient-text">learning.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[#9090a0] leading-relaxed max-w-xl">
                Scrollio is an AI-powered learning platform with two experiences: 
                <span className="text-white"> TikTok-style micro-learning</span> for teens and adults, and a 
                <span className="text-white"> magical playground</span> where kids&apos; drawings become living mentors.
              </p>
              
              <p className="text-[#9090a0] leading-relaxed">
                Whether you&apos;re a curious learner looking to grow, a parent seeking meaningful screen time, 
                or an educator wanting engaging tools — Scrollio adapts to create the perfect learning experience.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={scrollToWaitlist} className="btn-primary">
                Join the waitlist
              </button>
              <button onClick={scrollToWaitlist} className="btn-secondary">
                Learn more
              </button>
            </div>

            <p className="text-sm text-[#9090a0]">
              🎓 Early access for learners, families, and schools • No credit card required
            </p>
          </div>

          {/* Right Column - Two Product Cards */}
          <div className="relative space-y-6">
            {/* Scrollio Core Card */}
            <div className="card-glass p-6 animate-float" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Scrollio Core</h3>
                  <p className="text-xs text-[#9090a0]">For teens & adults (13+)</p>
                </div>
              </div>
              <p className="text-sm text-[#9090a0] mb-3">
                AI-curated vertical feed of short educational videos. Scroll through topics you love — science, tech, psychology, creativity, and more.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Micro-learning</span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">AI-curated</span>
                <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Personal growth</span>
              </div>
            </div>

            {/* Scrollio Kids Card */}
            <div className="card-glass p-6 animate-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Scrollio Kids</h3>
                  <p className="text-xs text-[#9090a0]">For children & families</p>
                </div>
              </div>
              <p className="text-sm text-[#9090a0] mb-3">
                Draw a character → watch it come alive → explore stories together. A living mentor born from your child&apos;s imagination.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 sm:gap-4 text-xs text-[#9090a0]">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">1</span>
                    Draw
                  </span>
                  <span className="text-white/20">→</span>
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">2</span>
                    Animate
                  </span>
                  <span className="text-white/20">→</span>
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">3</span>
                    Learn
                  </span>
                </div>
                <button 
                  onClick={() => setIsTryMeOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-medium rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
                >
                  Try Me ✨
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Try Me Modal */}
      <TryMeModal isOpen={isTryMeOpen} onClose={() => setIsTryMeOpen(false)} />
    </section>
  );
}
