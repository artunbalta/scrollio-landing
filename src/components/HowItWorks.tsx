"use client";

import { motion } from "framer-motion";
import { TopicCloud } from "@/components/ui/logo-cloud-3";

const TOPIC_TAGS = [
  { label: "Psychology", color: "#a855f7" },
  { label: "Finance", color: "#10b981" },
  { label: "Science", color: "#3b82f6" },
  { label: "History", color: "#f59e0b" },
  { label: "Philosophy", color: "#8b5cf6" },
  { label: "Design", color: "#ec4899" },
  { label: "Artificial Intelligence", color: "#ea580c" },
  { label: "Health", color: "#22c55e" },
  { label: "Space", color: "#6366f1" },
  { label: "Crypto", color: "#f97316" },
  { label: "Biology", color: "#84cc16" },
  { label: "Neuroscience", color: "#e879f9" },
];

const TOPIC_TAGS_2 = [
  { label: "Art", color: "#f43f5e" },
  { label: "Music", color: "#a78bfa" },
  { label: "Quantum Physics", color: "#0ea5e9" },
  { label: "Economics", color: "#fb923c" },
  { label: "Literature", color: "#c084fc" },
  { label: "Sociology", color: "#4ade80" },
  { label: "Technology", color: "#60a5fa" },
  { label: "Mathematics", color: "#fbbf24" },
  { label: "Astronomy", color: "#818cf8" },
  { label: "Medicine", color: "#f472b6" },
  { label: "Ethics", color: "#a3e635" },
  { label: "Linguistics", color: "#fb7185" },
];

/* ── Step 1: Phone with scrolling video feed ── */
function VideoFeedMockup() {
  const videos = [
    { tag: "Neuroscience", title: "Why dopamine isn't about pleasure", mentor: "Dr. Sarah K.", color: "#a855f7", bg: "from-purple-900 to-indigo-900" },
    { tag: "Finance", title: "How compound interest really works", mentor: "Warren B.", color: "#10b981", bg: "from-emerald-900 to-teal-900" },
    { tag: "Physics", title: "What light actually is", mentor: "Richard F.", color: "#3b82f6", bg: "from-blue-900 to-cyan-900" },
  ];

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className="relative rounded-[1.6rem] overflow-hidden shadow-2xl"
        style={{ width: 110, height: 190, background: "#111" }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 w-12 h-3.5 rounded-full bg-black" />

        {/* Scrolling videos */}
        <motion.div
          className="absolute inset-0 flex flex-col"
          animate={{ y: [0, -190, -380, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", times: [0, 0.33, 0.66, 1] }}
        >
          {[...videos, videos[0]].map((v, i) => (
            <div
              key={i}
              className={`relative shrink-0 flex flex-col justify-end p-2.5 bg-gradient-to-b ${v.bg}`}
              style={{ width: 110, height: 190 }}
            >
              {/* Mentor avatar placeholder */}
              <div
                className="absolute top-6 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ background: `${v.color}30`, border: `1.5px solid ${v.color}60`, color: v.color }}
              >
                {v.mentor[0]}
              </div>
              {/* Info */}
              <div className="space-y-1">
                <span
                  className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                  style={{ background: `${v.color}30`, color: v.color }}
                >
                  {v.tag}
                </span>
                <p className="text-[8px] font-semibold text-white leading-tight">{v.title}</p>
                <p className="text-[7px] text-white/60">{v.mentor}</p>
              </div>
              {/* Side actions */}
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                {["♥", "💬", "↗"].map((icon, j) => (
                  <div key={j} className="text-[10px] text-white/70">{icon}</div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-white/30 z-10" />
      </div>
    </div>
  );
}

/* ── Step 2: Watch signal → AI curation ── */
function AISignalVisual() {
  const signals = [
    { label: "Watched 100%", icon: "▶", color: "#22c55e", x: "15%", y: "20%" },
    { label: "Replayed 2×", icon: "↺", color: "#f97316", x: "65%", y: "15%" },
    { label: "Shared", icon: "↗", color: "#a855f7", x: "82%", y: "55%" },
    { label: "Skipped", icon: "⏭", color: "#64748b", x: "20%", y: "70%" },
    { label: "Saved", icon: "★", color: "#f59e0b", x: "55%", y: "72%" },
  ];

  return (
    <div className="relative w-full" style={{ height: 140 }}>
      {/* Central AI brain */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-sm z-10"
        style={{ background: "linear-gradient(135deg,#f97316,#a855f7)", boxShadow: "0 0 24px rgba(249,115,22,0.4)" }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-white font-bold text-[10px]">AI</span>
      </motion.div>

      {/* Signal nodes */}
      {signals.map((s, i) => (
        <motion.div
          key={s.label}
          className="absolute"
          style={{ left: s.x, top: s.y, transform: "translate(-50%,-50%)" }}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.4 }}
        >
          <motion.div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold whitespace-nowrap"
            style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}40` }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          >
            <span>{s.icon}</span> {s.label}
          </motion.div>
        </motion.div>
      ))}

      {/* Animated connecting lines to center */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {signals.map((s, i) => (
          <motion.line
            key={i}
            x1={parseFloat(s.x)} y1={parseFloat(s.y)}
            x2={50} y2={50}
            stroke={s.color}
            strokeWidth="0.6"
            strokeOpacity={0.35}
            strokeDasharray="2 1.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Step 3: Knowledge compounds over time ── */
function KnowledgePath() {
  const days = [
    { label: "Day 1", topic: "Intro to Neuroscience", pct: 100 },
    { label: "Day 3", topic: "Memory & Learning", pct: 100 },
    { label: "Day 7", topic: "Neuroplasticity", pct: 100 },
    { label: "Day 14", topic: "Sleep & the Brain", pct: 60 },
    { label: "Day 21", topic: "Focus & Flow", pct: 0 },
  ];

  return (
    <div className="w-full flex flex-col gap-2.5">
      {days.map((d, i) => (
        <motion.div
          key={d.label}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <div
            className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold"
            style={{
              background: d.pct === 100 ? "linear-gradient(135deg,#f97316,#a855f7)" : d.pct > 0 ? "rgba(249,115,22,0.2)" : "rgba(249,115,22,0.07)",
              border: d.pct === 100 ? "none" : "1.5px solid rgba(249,115,22,0.25)",
              color: d.pct === 100 ? "white" : "#f97316",
            }}
          >
            {d.pct === 100 ? "✓" : ""}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] text-stone-400">{d.label}</span>
              <span className="text-[10px] font-semibold" style={{ color: "var(--foreground)" }}>{d.topic}</span>
            </div>
            <div className="h-1 rounded-full w-full bg-orange-100/60">
              {d.pct > 0 && (
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#f97316,#a855f7)" }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${d.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 + 0.3 }}
                />
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const STEPS = [
  {
    num: "01",
    label: "Scroll & Watch",
    headline: "Every video is a lesson.",
    body: "Swipe through short, high-density videos from the world's sharpest minds. Each one is built for one minute, designed to stick — no fluff, no filler.",
    visual: <VideoFeedMockup />,
    accent: "#f97316",
    accentBg: "rgba(249,115,22,0.07)",
    accentBorder: "rgba(249,115,22,0.18)",
  },
  {
    num: "02",
    label: "AI reads the signal",
    headline: "Your watch time shapes your feed.",
    body: "Did you replay it? Watch all the way through? Share it? Scrollio reads every signal and silently remixes your feed around what genuinely sparks your curiosity.",
    visual: <AISignalVisual />,
    accent: "#a855f7",
    accentBg: "rgba(168,85,247,0.06)",
    accentBorder: "rgba(168,85,247,0.18)",
  },
  {
    num: "03",
    label: "Knowledge compounds",
    headline: "Topics connect. Understanding deepens.",
    body: "Scrollio tracks what you've watched and builds a learning arc across sessions. Yesterday's video on memory makes today's on sleep click differently.",
    visual: <KnowledgePath />,
    accent: "#ea580c",
    accentBg: "rgba(234,88,12,0.06)",
    accentBorder: "rgba(234,88,12,0.18)",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-28 px-4 bg-transparent">
      <div className="relative z-[1] max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[0.22em] mb-4 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(249,115,22,0.12)", color: "#ea580c", border: "1px solid rgba(249,115,22,0.25)" }}
          >
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight" style={{ color: "var(--foreground)" }}>
            Scrolling was never<br />
            <span style={{ background: "linear-gradient(135deg, #f97316, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              the problem.
            </span>
          </h2>
          <p className="mt-4 text-base max-w-md mx-auto leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
            The problem was what you scrolled through.<br />Scrollio fixes that.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-6">
          <div
            className="hidden md:block absolute top-[3.25rem] left-[calc(1/6*100%)] right-[calc(1/6*100%)] h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.35) 20%, rgba(168,85,247,0.35) 80%, transparent)" }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-2xl p-6 flex flex-col gap-5"
              style={{
                background: "rgba(255,255,255,0.62)",
                border: `1px solid ${step.accentBorder}`,
                backdropFilter: "blur(12px)",
                boxShadow: "0 2px 24px rgba(249,115,22,0.06)",
              }}
              whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(249,115,22,0.12)", transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-black shrink-0"
                  style={{ background: step.accentBg, color: step.accent, border: `1.5px solid ${step.accentBorder}` }}
                >
                  {step.num}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.accent }}>
                  {step.label}
                </span>
              </div>

              <div
                className="rounded-xl overflow-hidden p-4 min-h-[148px] flex items-center"
                style={{ background: step.accentBg, border: `1px solid ${step.accentBorder}` }}
              >
                {step.visual}
              </div>

              <div>
                <p className="text-[15px] font-bold leading-snug mb-1.5" style={{ color: "var(--foreground)" }}>{step.headline}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--foreground-muted)" }}>{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Topic tag streams */}
        <motion.div
          className="mt-16 space-y-2.5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-center text-[10px] uppercase tracking-widest mb-5 font-semibold" style={{ color: "var(--foreground-muted)", opacity: 0.85 }}>
            Explore every domain
          </p>
          <TopicCloud tags={TOPIC_TAGS} speed={55} />
          <TopicCloud tags={TOPIC_TAGS_2} speed={45} reverse />
        </motion.div>
      </div>
    </section>
  );
}
