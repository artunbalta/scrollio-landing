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
  { label: "Artificial Intelligence", color: "#06b6d4" },
  { label: "Health", color: "#22c55e" },
  { label: "Space", color: "#6366f1" },
  { label: "Crypto", color: "#f97316" },
  { label: "Biology", color: "#84cc16" },
  { label: "Neuroscience", color: "#e879f9" },
  { label: "Climate", color: "#34d399" },
  { label: "Politics", color: "#f87171" },
];

const TOPIC_TAGS_2 = [
  { label: "Art", color: "#f43f5e" },
  { label: "Music", color: "#a78bfa" },
  { label: "Quantum Physics", color: "#38bdf8" },
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

const EASE_SPRING = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_SPRING, delay: i * 0.12 },
  }),
};

/* ── Step 1: Stacked mini content cards ── */
function FeedMockup() {
  const cards = [
    { tag: "AI", title: "How neural networks mimic the brain", color: "#06b6d4" },
    { tag: "Psychology", title: "Why your memory is a reconstruction", color: "#a855f7" },
    { tag: "Finance", title: "The compounding effect: why it's magic", color: "#10b981" },
  ];
  return (
    <div className="relative w-full flex flex-col gap-2 px-2">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          className="rounded-xl border px-3 py-2.5 flex items-start gap-2.5"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.1)",
            animationDelay: `${i * 0.4}s`,
          }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        >
          <span
            className="mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
            style={{ background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}30` }}
          >
            {c.tag}
          </span>
          <p className="text-[11px] leading-tight text-white/70">{c.title}</p>
        </motion.div>
      ))}
      {/* AI suggestion ghost */}
      <div
        className="rounded-xl border px-3 py-2.5 flex items-center gap-2 mt-0.5"
        style={{ background: "rgba(249,115,22,0.06)", borderColor: "rgba(249,115,22,0.15)", borderStyle: "dashed" }}
      >
        <span className="text-[9px] text-orange-400/60">✦ Next for you</span>
        <div className="h-1.5 flex-1 rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#f97316,#a855f7)" }}
            animate={{ width: ["15%", "65%", "15%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: AI nodes ── */
function AINodeGraph() {
  const nodes = [
    { x: "12%", y: "38%", color: "#06b6d4", size: 10, delay: 0 },
    { x: "50%", y: "20%", color: "#a855f7", size: 14, delay: 0.4 },
    { x: "82%", y: "42%", color: "#f97316", size: 10, delay: 0.8 },
    { x: "30%", y: "68%", color: "#10b981", size: 8, delay: 1.1 },
    { x: "68%", y: "72%", color: "#f59e0b", size: 8, delay: 1.5 },
  ];
  const edges = [
    { x1: "12%", y1: "38%", x2: "50%", y2: "20%" },
    { x1: "50%", y1: "20%", x2: "82%", y2: "42%" },
    { x1: "50%", y1: "20%", x2: "30%", y2: "68%" },
    { x1: "82%", y1: "42%", x2: "68%", y2: "72%" },
    { x1: "30%", y1: "68%", x2: "68%", y2: "72%" },
  ];
  return (
    <div className="relative w-full h-28">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="rgba(168,85,247,0.22)"
            strokeWidth="0.8"
            strokeDasharray="2 1"
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: n.x, top: n.y,
            width: n.size, height: n.size,
            background: n.color,
            transform: "translate(-50%,-50%)",
            boxShadow: `0 0 ${n.size * 2}px ${n.color}60`,
          }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: n.delay }}
        />
      ))}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-semibold"
        style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}
      >
        curiosity graph
      </div>
    </div>
  );
}

/* ── Step 3: Knowledge path ── */
function KnowledgePath() {
  const milestones = [
    { label: "Day 1", topic: "AI basics", done: true },
    { label: "Day 4", topic: "Neural nets", done: true },
    { label: "Day 9", topic: "LLMs", done: true },
    { label: "Day 18", topic: "Future", done: false },
  ];
  return (
    <div className="relative w-full px-2 flex flex-col gap-2">
      {milestones.map((m, i) => (
        <motion.div
          key={m.label}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.18, duration: 0.45 }}
        >
          <div
            className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold"
            style={{
              background: m.done ? "linear-gradient(135deg,#f97316,#a855f7)" : "rgba(255,255,255,0.08)",
              border: m.done ? "none" : "1px solid rgba(255,255,255,0.15)",
              color: "white",
            }}
          >
            {m.done ? "✓" : ""}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-white/40">{m.label}</span>
              <span className="text-[10px] text-white/70 font-medium truncate">{m.topic}</span>
            </div>
            <div className="mt-1 h-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              {m.done && (
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#f97316,#a855f7)" }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.18 + 0.3 }}
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
    label: "Scroll naturally",
    headline: "Your curiosity is the curriculum.",
    body: "Open the feed, swipe up. Every card is a lesson — built for one minute, designed to stick.",
    visual: <FeedMockup />,
    accent: "#f97316",
  },
  {
    num: "02",
    label: "AI reads the signal",
    headline: "Every swipe is a data point.",
    body: "Scrollio maps your curiosity in real time and reshapes what comes next — silently, seamlessly.",
    visual: <AINodeGraph />,
    accent: "#a855f7",
  },
  {
    num: "03",
    label: "Knowledge compounds",
    headline: "What you learn today shapes tomorrow.",
    body: "Topics connect across sessions. Your feed evolves. You don't just learn — you grow.",
    visual: <KnowledgePath />,
    accent: "#06b6d4",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-24 px-4" style={{ background: "linear-gradient(170deg, #09090f 0%, #0f0b1a 55%, #0a1218 100%)" }}>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse at center, #a855f7 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse at center, #f97316 0%, transparent 70%)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[0.22em] mb-4 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(249,115,22,0.12)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Scrolling was never<br />
            <span style={{ background: "linear-gradient(135deg, #f97316, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              the problem.
            </span>
          </h2>
          <p className="mt-4 text-base text-white/40 max-w-md mx-auto leading-relaxed">
            The problem was what you scrolled through.<br />Scrollio fixes that.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="relative grid md:grid-cols-3 gap-5">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[3.5rem] left-[calc(1/6*100%)] right-[calc(1/6*100%)] h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.3) 20%, rgba(249,115,22,0.3) 80%, transparent)" }} />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative rounded-2xl p-5 flex flex-col gap-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(16px)",
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              {/* Step number + label */}
              <div className="flex items-center gap-2.5">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: `${step.accent}18`, color: step.accent, border: `1px solid ${step.accent}30` }}
                >
                  {step.num}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: step.accent }}>
                  {step.label}
                </span>
              </div>

              {/* Animated visual */}
              <div className="rounded-xl overflow-hidden py-3 px-1 min-h-[120px] flex items-center"
                style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {step.visual}
              </div>

              {/* Text */}
              <div>
                <p className="text-sm font-semibold text-white leading-snug mb-1">{step.headline}</p>
                <p className="text-xs text-white/45 leading-relaxed">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Topic tag streams */}
        <motion.div
          className="mt-14 space-y-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <p className="text-center text-[10px] text-white/25 uppercase tracking-widest mb-5">
            Explore every domain
          </p>
          <TopicCloud tags={TOPIC_TAGS} speed={55} />
          <TopicCloud tags={TOPIC_TAGS_2} speed={45} reverse />
        </motion.div>
      </div>
    </section>
  );
}
