"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { ModelConfig } from "./ModelViewer";
import { getModelUrl } from "@/lib/modelUrl";
import WaitlistSection from "./WaitlistSection";
import FAQ from "./FAQ";
import FeatureGrid from "./FeatureGrid";
import KidsModeDemo from "./KidsModeDemo";
import BackgroundOrbs from "./BackgroundOrbs";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

const ROTATING_WORDS = ["Learning", "Growth", "Discovery", "Adventure"];

/* ─────────────────────────────────────────────────────────────
   Model configs
   Positions ±0.75 are always within view even at split=50%
   because R3F adjusts horizontal FOV by the canvas aspect ratio.
───────────────────────────────────────────────────────────────*/
const CORE_MODELS: ModelConfig[] = [
  { url: getModelUrl("/models/scrolliocore1.glb"), position: [-0.75, -0.05, 0], scale: 0.82, floatSpeed: 0.7, floatAmplitude: 0.06 },
  { url: getModelUrl("/models/scrolliocore2.glb"), position: [0.75, -0.05, 0], scale: 0.82, floatSpeed: 1.0, floatAmplitude: 0.07 },
];
const KIDS_MODELS: ModelConfig[] = [
  { url: getModelUrl("/models/scrolliokids1.glb"), position: [-0.75, -0.05, 0], scale: 0.82, floatSpeed: 1.1, floatAmplitude: 0.08 },
  { url: getModelUrl("/models/scrolliokids2.glb"), position: [0.75, -0.05, 0], scale: 0.82, floatSpeed: 0.85, floatAmplitude: 0.06 },
];

/* ─── Glassmorphism pill ─── */
function GlassPill({ children, color = "rgba(255,255,255,0.06)", border = "rgba(255,255,255,0.12)" }: { children: React.ReactNode; color?: string; border?: string }) {
  return (
    <div style={{ background: color, border: `1px solid ${border}`, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 999, padding: "6px 18px", display: "inline-block" }}>
      {children}
    </div>
  );
}

export default function SplitScreen() {
  const [split, setSplit] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [expanded, setExpanded] = useState<"core" | "kids" | null>(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [rotatingWordIndex, setRotatingWordIndex] = useState(0);
  const [wordAnimating, setWordAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const vapiRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const [isVapiCallActive, setIsVapiCallActive] = useState(false);

  const startVapiCall = useCallback(async (assistant: "steve" | "albert") => {
    try {
      const res = await fetch("/api/vapi/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistant }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to get token");
      const { token, assistantId } = data;
      const Vapi = (await import("@vapi-ai/web")).default;
      const vapi = new Vapi(token);
      vapiRef.current = vapi;
      vapi.on("error", (e: unknown) => console.error("[Vapi error]", e));
      vapi.on("call-start", () => setIsVapiCallActive(true));
      vapi.on("call-end", () => {
        setIsVapiCallActive(false);
        vapiRef.current = null;
      });
      await vapi.start(assistantId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("[Vapi]", msg);
      alert(`Vapi bağlantı hatası: ${msg}`);
    }
  }, []);

  const stopVapiCall = useCallback(async () => {
    if (vapiRef.current) {
      await vapiRef.current.stop();
      setIsVapiCallActive(false);
      vapiRef.current = null;
    }
  }, []);

  /* ── Rotating headline (same as main Hero) ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setWordAnimating(true);
      setTimeout(() => {
        setRotatingWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setWordAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ── Navbar blur on scroll ── */
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Drag divider ── */
  const onDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    setIsDragging(true);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setSplit(Math.max(10, Math.min(90, pct)));
  }, []);

  const onUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    setSplit((prev) => {
      if (prev > 68) { setExpanded("core"); return 90; }
      if (prev < 32) { setExpanded("kids"); return 10; }
      setExpanded(null); return 50;
    });
  }, []);

  const expandCore = () => { setSplit(90); setExpanded("core"); };
  const expandKids = () => { setSplit(10); setExpanded("kids"); };
  const reset       = () => { setSplit(50); setExpanded(null); };

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") reset(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const ease = isDragging ? "none" : "all 0.55s cubic-bezier(0.4,0,0.2,1)";

  /* Light pastel hero — pill/button styles for light bg */
  const coreCard  = { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)" };
  const kidsCard  = { bg: "rgba(249,115,22,0.08)",  border: "rgba(249,115,22,0.2)"  };

  return (
    <div className="min-h-screen relative bg-dots" style={{ fontFamily: "inherit", background: "var(--background)" }}>
      <BackgroundOrbs />

      {/* ══════════════ FIXED NAVBAR (same as main) ══════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: navScrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: navScrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: navScrolled ? "blur(16px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a href="/" className="flex items-center no-underline">
          <Image src="/icon.png" alt="Scrollio" width={36} height={36} className="rounded-full" />
        </a>
        <a
          href="#waitlist"
          className="no-underline px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))", boxShadow: "0 4px 20px var(--accent-glow)" }}
        >
          Get Early Access
        </a>
      </nav>

      {/* ══════════════ HERO: SPLIT SCREEN ══════════════ */}
      {/*
        KEY FIX: Each panel fills its own container with `inset: 0`
        (not 100vw). This means the 3D canvas always shows its full
        scene within whatever width the panel has, so BOTH characters
        are always visible on each side.
      */}
      <div
        ref={containerRef}
        className="relative w-screen h-screen overflow-hidden"
        style={{ cursor: isDragging ? "col-resize" : "auto" }}
      >
        {/* Hero: transparent — root background (same as whole page) shows through */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />

        {/* ── Core (left): one ModelViewer always mounted; when expanded, empty emulator on the right ── */}
        <div
          className="absolute top-0 left-0 bottom-0 overflow-hidden z-[1]"
          style={{ width: `${split}%`, transition: ease }}
        >
          <div className="absolute inset-0 flex" style={{ background: "transparent" }}>
            {/* Characters column: full width when collapsed, ~68% when expanded — same ModelViewer instance so animation never restarts */}
            <div
              className="relative flex-shrink-0 transition-[width] duration-300 ease-out"
              style={{ width: expanded === "core" ? "64%" : "100%" }}
            >
              <div className="absolute inset-0">
                <ModelViewer models={CORE_MODELS} cameraPosition={[0, 0.25, 4.2]} fov={52} />
              </div>
              {expanded === "core" && (
                <div className="absolute top-6 left-0 right-0 text-center pointer-events-none z-10 px-4">
                  <span className="text-sm font-bold uppercase tracking-[0.2em] block" style={{ color: "var(--foreground)", textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}>Scrollio Core</span>
                  <p className="text-xs mt-2 max-w-sm mx-auto leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                    AI-curated and mentor reinforced short videos: Science, tech, psychology, creativity and more. Taught by history&apos;s greatest minds reborn as your personal mentors.
                  </p>
                </div>
              )}
              {expanded === "core" && (
                <div className="absolute bottom-32 left-0 right-0 z-10 pointer-events-auto flex flex-col items-center gap-3">
                  {isVapiCallActive ? (
                    <button
                      type="button"
                      onClick={stopVapiCall}
                      className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                      style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)", boxShadow: "0 4px 14px rgba(220,38,38,0.4)" }}
                      aria-label="End call"
                    >
                      End call
                    </button>
                  ) : (
                    <div className="relative w-full h-10">
                      <button
                        type="button"
                        onClick={() => startVapiCall("steve")}
                        className="absolute bottom-0 left-[33%] -translate-x-1/2 px-4 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 14px rgba(168,85,247,0.4)" }}
                        aria-label="Ask to Steve"
                      >
                        Ask to Steve
                      </button>
                      <button
                        type="button"
                        onClick={() => startVapiCall("albert")}
                        className="absolute bottom-0 left-[67%] -translate-x-1/2 px-4 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 14px rgba(168,85,247,0.4)" }}
                        aria-label="Ask to Albert"
                      >
                        Ask to Albert
                      </button>
                    </div>
                  )}
                </div>
              )}
              {expanded !== "core" && (
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-16 pointer-events-none">
                  <GlassPill color={coreCard.bg} border={coreCard.border}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent-secondary)" }}>scrollio core</span>
                  </GlassPill>
                  <p className="text-xs max-w-[190px] text-center mt-2 mb-5" style={{ color: "var(--foreground-muted)" }}>
                    Learn from the greatest minds in history
                  </p>
                  <button
                    onClick={expandCore}
                    className="pointer-events-auto px-6 py-2.5 rounded-full text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 16px rgba(168,85,247,0.35)" }}
                  >
                    Explore Core →
                  </button>
                </div>
              )}
            </div>
            {/* iPhone emulator frame: only when expanded; smaller, no dividing line; screen empty for now */}
            {expanded === "core" && (
              <div className="w-[36%] relative flex-shrink-0 overflow-hidden flex flex-col min-w-0 items-center justify-center pl-1 pr-3 py-4" style={{ background: "transparent" }}>
                <div className="relative w-full flex-1 min-h-0 flex items-center justify-center min-w-0">
                  {/* Phone: real proportions (9:19.5), capped so it’s not too tall */}
                  <div
                    className="relative rounded-[2.5rem] bg-[#1c1c1e] shadow-2xl flex flex-col overflow-hidden"
                    style={{
                      width: "min(220px, calc(76vh * 9 / 19.5))",
                      aspectRatio: "9/19.5",
                      maxHeight: "76vh",
                      boxShadow: "0 20px 40px -12px rgba(0,0,0,0.28), 0 0 0 2px rgba(0,0,0,0.06)",
                    }}
                  >
                    {/* Dynamic Island */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 w-[90px] h-[26px] rounded-full bg-black" />
                    {/* Screen area — emulator screenshot */}
                    <div className="flex-1 mt-7 mx-1.5 mb-8 rounded-[1.5rem] bg-[#f2f2f7] min-h-0 overflow-hidden flex items-center justify-center">
                      <Image
                        src="/publice-emulator.jpg"
                        alt="Core emulator"
                        width={400}
                        height={800}
                        className="w-full h-full object-contain object-top"
                        unoptimized
                      />
                    </div>
                    {/* Home indicator */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-black/40" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Kids (right): one ModelViewer always mounted so animation continues; when expanded, smaller demo frame on the right ── */}
        <div
          className="absolute top-0 right-0 bottom-0 overflow-hidden z-[1]"
          style={{ width: `${100 - split}%`, transition: ease }}
        >
          <div className="absolute inset-0 flex" style={{ background: "transparent" }}>
            {/* Monsters column: full width when collapsed, ~62% when expanded — same ModelViewer instance so animation never restarts */}
            <div
              className="relative flex-shrink-0 transition-[width] duration-300 ease-out"
              style={{ width: expanded === "kids" ? "62%" : "100%" }}
            >
              <div className="absolute inset-0">
                <ModelViewer models={KIDS_MODELS} cameraPosition={[0, 0.25, 4.2]} fov={52} />
              </div>
              {expanded === "kids" && (
                <div className="absolute top-6 left-0 right-0 text-center pointer-events-none z-10 px-4">
                  <span className="text-sm font-bold uppercase tracking-[0.2em] block" style={{ color: "var(--foreground)", textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}>Scrollio Kids</span>
                  <p className="text-xs mt-2 max-w-sm mx-auto leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                    Draw a character and watch it come alive as a living mentor. An AI-powered magical experience where children&apos;s imagination becomes their teacher.
                  </p>
                </div>
              )}
              {expanded !== "kids" && (
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-16 pointer-events-none">
                  <GlassPill color={kidsCard.bg} border={kidsCard.border}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>scrollio kids</span>
                  </GlassPill>
                  <p className="text-xs max-w-[190px] text-center mt-2 mb-5" style={{ color: "var(--foreground-muted)" }}>
                    Fun monsters that make learning magical
                  </p>
                  <button
                    onClick={expandKids}
                    className="pointer-events-auto px-6 py-2.5 rounded-full text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #ea580c, #f97316)", boxShadow: "0 4px 16px rgba(249,115,22,0.35)" }}
                  >
                    ← Explore Kids
                  </button>
                </div>
              )}
            </div>
            {/* Demo frame: only when expanded, ~38% so frame is smaller */}
            {expanded === "kids" && (
              <div className="w-[38%] relative flex-shrink-0 overflow-hidden flex flex-col min-w-0">
                <div className="flex-1 min-h-0 p-4">
                  <KidsModeDemo embedded className="h-full" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Centre header: rotating headline only when split; "Split view" when expanded ── */}
        <div
          className="absolute top-0 left-0 right-0 z-40 pointer-events-none flex flex-col items-center"
          style={{ paddingTop: 84 }}
        >
          {!expanded && (
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-center">
              <span style={{ color: "var(--foreground)" }}>Turn Scrolling</span>
              <br />
              <span style={{ color: "var(--foreground)" }}>Into </span>
              <span
                className={`script-gradient text-5xl md:text-6xl lg:text-7xl inline-block transition-all duration-300 ${
                  wordAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
              >
                {ROTATING_WORDS[rotatingWordIndex]}
              </span>
            </h1>
          )}
        </div>

        {/* ── Divider ── */}
        <div
          className="absolute top-0 bottom-0 z-30 flex items-center justify-center"
          style={{
            left: `${split}%`,
            transform: "translateX(-50%)",
            transition: ease,
            width: 56,
            cursor: "col-resize",
            touchAction: "none",
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {/* Line */}
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2"
            style={{ width: 2, background: "rgba(0,0,0,0.12)", boxShadow: "0 0 8px rgba(0,0,0,0.06)" }}
          />

          {/* Handle: glass pill with arrows */}
          <div
            className="relative z-10 flex items-center justify-center gap-1 rounded-full select-none"
            style={{
              width: 46,
              height: 46,
              background: "rgba(255,255,255,0.85)",
              border: "1.5px solid rgba(0,0,0,0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              transform: isDragging ? "scale(1.22)" : "scale(1)",
              transition: "transform 0.15s ease",
            }}
          >
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <path d="M5 6L1 3M5 6L1 9M5 6H13M13 6L17 3M13 6L17 9" stroke="var(--foreground-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

        </div>

        {/* ── Bottom hints: scroll + swipe (single block, no overlap) ── */}
        {!expanded && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none">
            <span className="text-[10px] tracking-widest uppercase" style={{ color: "var(--foreground-muted)" }}>Scroll to explore</span>
            <svg className="w-4 h-4 animate-bounce shrink-0" fill="none" viewBox="0 0 24 24" stroke="var(--foreground-muted)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-[10px] font-medium" style={{ color: "var(--foreground-muted)", opacity: 0.85 }}>↔ Swipe to switch</span>
          </div>
        )}
      </div>

      {/* ══════════════ SCROLLABLE CONTENT (gradient here: FAQ, waitlist, etc.) ══════════════ */}
      <div id="about" style={{ background: "transparent" }}>

        {/* ── How it works ── */}
        <section className="py-28 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: "var(--foreground)" }}>
              Learning that fits your scroll
            </h2>
            <p className="text-lg mb-16 max-w-xl mx-auto" style={{ color: "var(--foreground-muted)" }}>
              No schedules. No homework. Just open the app and start.
            </p>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                { num: "01", icon: "📱", title: "Open your feed", desc: "Just like your favourite social app — but every swipe teaches you something real." },
                { num: "02", icon: "🧠", title: "Learn by doing", desc: "AI adapts to your curiosity and pace. Pure flow, no interruptions." },
                { num: "03", icon: "✨", title: "Build knowledge", desc: "Topics connect over time. What you learn today becomes tomorrow's foundation." },
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center">
                  <span className="text-5xl mb-5">{s.icon}</span>
                  <span className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--accent)" }}>{s.num}</span>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>{s.title}</h3>
                  <p className="text-sm max-w-[220px]" style={{ color: "var(--foreground-muted)" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Benefits grid ── */}
        <section className="py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: "var(--foreground)" }}>
                Why Scrollio?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🎯", title: "Hyper-personalised", desc: "AI tailors every session to your interests, pace, and learning style." },
                { icon: "⚡", title: "Micro-learning", desc: "Short, dense bites that respect your time and maximise retention." },
                { icon: "🌍", title: "All subjects", desc: "Science, history, art, tech, philosophy — one app, infinite topics." },
                { icon: "🔒", title: "Safe for kids", desc: "Age-gated content, COPPA-compliant, no ads, no dark patterns." },
                { icon: "📶", title: "Offline ready", desc: "Download lessons, learn on the go — no Wi-Fi required." },
                { icon: "📊", title: "Progress tracking", desc: "See what you (or your child) have learned and what's next." },
              ].map((b) => (
                <div key={b.title} className="card-light rounded-2xl p-6">
                  <span className="text-3xl mb-4 block">{b.icon}</span>
                  <h4 className="font-bold mb-2" style={{ color: "var(--foreground)" }}>{b.title}</h4>
                  <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Designed for Every Learner (just above FAQ) ── */}
        <FeatureGrid />

        {/* ── FAQ ── */}
        <FAQ />

        {/* ── Waitlist (same as main page: form + animated characters + discount token) ── */}
        <WaitlistSection noFrame />

        {/* ══ FOOTER ══ */}
        <footer
          className="py-8 px-8"
          style={{ borderTop: "1px solid rgba(249,115,22,0.12)", background: "transparent" }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <Image src="/icon.png" alt="Scrollio" width={28} height={28} className="rounded-full" />
              <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>© 2026 · Turn scrolling into learning</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Contact"].map((l) => (
                <a key={l} href="#" className="text-xs no-underline transition-opacity hover:opacity-100 opacity-50" style={{ color: "var(--foreground)" }}>
                  {l}
                </a>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a href="#" className="opacity-45 hover:opacity-90 transition-opacity" style={{ color: "var(--foreground)" }} aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" className="opacity-45 hover:opacity-90 transition-opacity" style={{ color: "var(--foreground)" }} aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="#" className="opacity-45 hover:opacity-90 transition-opacity" style={{ color: "var(--foreground)" }} aria-label="X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
