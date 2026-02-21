"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const LearnerCarousel3D = dynamic(() => import("./LearnerCarousel3D"), { ssr: false });

const CHARACTERS = [
  {
    audience: "For Teens & Adults",
    title: "Curiosity-Driven Discovery",
    description:
      "Scrollio Core transforms idle scrolling into meaningful micro-learning. AI curates your feed based on your interests, goals, and curiosity.",
    highlights: [
      "TikTok-style vertical feed of short lessons",
      "AI adapts to your interests and goals",
      "Science, tech, psychology, creativity & more",
      "Learn something new in every scroll",
    ],
    accentColor: "#6366f1",
    gradientFrom: "#6366f1",
    gradientTo: "#818cf8",
  },
  {
    audience: "For Schools",
    title: "AI Teacher Assistant",
    description:
      "Teachers can create unlimited video lessons using their own face. Just provide a topic — AI handles the script and delivery.",
    highlights: [
      "Record once, teach infinite topics",
      "AI lip-syncs your video to any script",
      "Create lessons in any language",
      "Perfect for flipped classroom & remote learning",
    ],
    accentColor: "#10b981",
    gradientFrom: "#10b981",
    gradientTo: "#34d399",
  },
  {
    audience: "For Kids",
    title: "Imagination Comes Alive",
    description:
      "Every child is an artist. Scrollio Kids turns their drawings into living mentors who guide them through magical stories and playful learning.",
    highlights: [
      "Draw any character and watch it come to life",
      "Interactive stories tailored to their interests",
      "Early learning through imagination and play",
      "Safe, engaging, and endlessly creative",
    ],
    accentColor: "#f97316",
    gradientFrom: "#f97316",
    gradientTo: "#fb923c",
  },
  {
    audience: "For Families",
    title: "Screen Time That Matters",
    description:
      "Finally, screen time that parents can feel good about. Structured learning, safe content, and insights into what your kids explore.",
    highlights: [
      "Parent dashboard with activity insights",
      "Age-appropriate, curated content",
      "Structured sessions, not endless scrolling",
      "Build learning habits together",
    ],
    accentColor: "#a855f7",
    gradientFrom: "#a855f7",
    gradientTo: "#c084fc",
  },
];

const ROTATION_SENSITIVITY = 0.008;

export default function FeatureGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [userRotationY, setUserRotationY] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);
  const lastClientXRef = useRef(0);

  useEffect(() => {
    setUserRotationY(0);
  }, [activeIndex]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const delta = (e.clientX - lastClientXRef.current) * ROTATION_SENSITIVITY;
      lastClientXRef.current = e.clientX;
      setUserRotationY((prev) => prev + delta);
    };
    const onUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointerleave", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerleave", onUp);
    };
  }, []);

  const go = (nextIndex: number) => {
    if (animating) return;
    setAnimating(true);
    setVisible(false);
    timerRef.current = setTimeout(() => {
      setActiveIndex(nextIndex);
      setVisible(true);
      setAnimating(false);
    }, 280);
  };

  const goNext = () => go((activeIndex + 1) % 4);
  const goPrev = () => go((activeIndex - 1 + 4) % 4);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const active = CHARACTERS[activeIndex];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
            Powerful Features
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5" style={{ color: "var(--foreground)" }}>
            Designed for{" "}
            <span className="script-gradient">Every Learner</span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
            Whether you&apos;re a curious teen, a lifelong learner, a parent seeking meaningful screen time,
            or a teacher looking for engaging tools — Scrollio adapts to you.
          </p>
        </div>

        {/* Sol: 3D carousel | Sağ: ilgili bilgi yazısı — yan yana */}
        <div className="grid md:grid-cols-[1fr,1fr] gap-8 md:gap-10 items-center">
          {/* Sol — modeller */}
          <div className="relative order-2 md:order-1" style={{ height: "420px" }}>
            <div
              className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden"
              onPointerDown={(e) => {
                if ((e.target as HTMLElement).closest("button")) return;
                isDraggingRef.current = true;
                lastClientXRef.current = e.clientX;
              }}
              style={{ touchAction: "none" }}
            >
              <LearnerCarousel3D activeIndex={activeIndex} userRotationY={userRotationY} />
            </div>

            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(0,0,0,0.08)",
                color: "var(--foreground)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(0,0,0,0.08)",
                color: "var(--foreground)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
              {CHARACTERS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to ${CHARACTERS[i].audience}`}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === activeIndex ? "24px" : "8px",
                    height: "8px",
                    background:
                      i === activeIndex
                        ? `linear-gradient(90deg, ${active.gradientFrom}, ${active.gradientTo})`
                        : "rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sağ — ilgili bilgi yazısı */}
          <div
            className="order-1 md:order-2 text-center md:text-left transition-all duration-280"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.28s ease, transform 0.28s ease",
            }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: active.accentColor }}
            >
              {active.audience}
            </p>
            <h3
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: "var(--foreground)" }}
            >
              {active.title}
            </h3>
            <p className="text-base leading-relaxed mb-5" style={{ color: "var(--foreground-muted)" }}>
              {active.description}
            </p>
            <ul className="flex flex-wrap justify-center md:justify-start gap-2">
              {active.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    border: `1px solid ${active.accentColor}30`,
                    color: "var(--foreground-muted)",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={active.accentColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
