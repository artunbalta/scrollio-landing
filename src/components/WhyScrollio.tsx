"use client";

import { motion } from "framer-motion";

const EASE_SPRING = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_SPRING, delay: i * 0.14 },
  }),
};

/* ── Block 1: Adaptive by design — animated tag cloud ── */
const adaptiveTags = [
  { label: "Psychology", x: "8%", y: "15%", color: "#a855f7", size: "text-[10px]", delay: 0 },
  { label: "AI", x: "55%", y: "8%", color: "#06b6d4", size: "text-[11px]", delay: 0.3 },
  { label: "Finance", x: "72%", y: "52%", color: "#10b981", size: "text-[10px]", delay: 0.6 },
  { label: "History", x: "25%", y: "62%", color: "#f59e0b", size: "text-[10px]", delay: 0.9 },
  { label: "Science", x: "40%", y: "35%", color: "#3b82f6", size: "text-[13px]", delay: 0.15 },
  { label: "Design", x: "10%", y: "72%", color: "#ec4899", size: "text-[9px]", delay: 0.75 },
  { label: "Space", x: "68%", y: "22%", color: "#6366f1", size: "text-[9px]", delay: 1.1 },
  { label: "Health", x: "48%", y: "72%", color: "#22c55e", size: "text-[10px]", delay: 0.45 },
];

function AdaptiveVisual() {
  return (
    <div className="relative w-full h-full min-h-[140px]">
      {adaptiveTags.map((t) => (
        <motion.span
          key={t.label}
          className={`absolute font-semibold px-2.5 py-1 rounded-full select-none ${t.size}`}
          style={{
            left: t.x, top: t.y,
            background: `${t.color}18`,
            color: t.color,
            border: `1px solid ${t.color}30`,
          }}
          animate={{
            y: [0, -6, 0],
            opacity: [0.55, 1, 0.55],
          }}
          transition={{
            duration: 3.2 + Math.random() * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: t.delay,
          }}
        >
          {t.label}
        </motion.span>
      ))}
      <motion.div
        className="absolute bottom-3 right-3 text-[9px] font-bold px-2.5 py-1 rounded-full"
        style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.25)" }}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        ✦ adapting to you
      </motion.div>
    </div>
  );
}

/* ── Block 2: Short attention, not shallow ── */
function StackedCardsVisual() {
  const cards = [
    { title: "Why sleep is your superpower", tag: "Neuroscience", progress: 88 },
    { title: "The 80/20 rule in practice", tag: "Productivity", progress: 62 },
    { title: "How black holes bend time", tag: "Physics", progress: 40 },
  ];
  return (
    <div className="relative flex flex-col gap-2 w-full">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          className="rounded-xl px-3 py-2.5 flex flex-col gap-1.5"
          style={{
            background: "rgba(249,115,22,0.07)",
            border: "1px solid rgba(249,115,22,0.13)",
          }}
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 + 0.2, duration: 0.45 }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-medium leading-tight text-white/80">{c.title}</p>
            <span
              className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
              style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}
            >
              {c.tag}
            </span>
          </div>
          <div className="h-1 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#f97316,#fbbf24)" }}
              initial={{ width: 0 }}
              whileInView={{ width: `${c.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.15 + 0.5 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Block 3: Knowledge compounds ── */
function CompoundsVisual() {
  const nodes = [
    { day: "Day 1", topic: "First swipe", active: true },
    { day: "Day 3", topic: "+5 concepts", active: true },
    { day: "Week 1", topic: "Pattern forms", active: true },
    { day: "Month 1", topic: "Deep path", active: true },
    { day: "Month 3", topic: "Expertise", active: false },
  ];
  return (
    <div className="relative flex items-center gap-0 w-full overflow-hidden py-2">
      {nodes.map((n, i) => (
        <div key={n.day} className="flex items-center flex-1 min-w-0">
          <div className="flex flex-col items-center gap-1.5 min-w-0">
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 relative"
              style={{
                background: n.active ? "linear-gradient(135deg,#f97316,#a855f7)" : "rgba(255,255,255,0.06)",
                border: n.active ? "none" : "1px solid rgba(255,255,255,0.12)",
                color: "white",
              }}
              animate={n.active ? { boxShadow: ["0 0 0px #f97316", "0 0 12px #f97316", "0 0 0px #f97316"] } : {}}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
            >
              {n.active ? "✓" : ""}
            </motion.div>
            <p className="text-[8px] text-white/35 text-center leading-tight whitespace-nowrap">{n.day}</p>
            <p className="text-[8px] text-white/55 text-center leading-tight whitespace-nowrap hidden sm:block">{n.topic}</p>
          </div>
          {i < nodes.length - 1 && (
            <div className="flex-1 h-px mx-1 shrink" style={{ background: "linear-gradient(90deg,rgba(249,115,22,0.5),rgba(168,85,247,0.5))" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function WhyScrollio() {
  return (
    <section className="relative py-24 px-4 overflow-hidden" style={{ background: "#FFEED4" }}>
      {/* Subtle mesh texture */}
      <div className="pointer-events-none absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(rgba(249,115,22,0.15) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[0.22em] mb-4 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(249,115,22,0.12)", color: "#f97316", border: "1px solid rgba(249,115,22,0.25)" }}
          >
            Why Scrollio
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900">
            Built for the way<br />
            <span style={{ background: "linear-gradient(135deg, #f97316, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              you already think.
            </span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Block 1 — 2/3 wide (spans 2 cols) */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:col-span-2 rounded-2xl p-6 flex flex-col gap-4 min-h-[260px] group"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(99,102,241,0.06) 100%)",
              border: "1px solid rgba(168,85,247,0.18)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 0 0 rgba(168,85,247,0)",
              transition: "box-shadow 0.25s ease, transform 0.25s ease",
            }}
            whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
          >
            <div>
              <span
                className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}
              >
                Adaptive by design
              </span>
              <h3 className="mt-3 text-lg font-bold text-gray-900 leading-snug">
                Your feed is never the same feed twice.
              </h3>
              <p className="mt-1.5 text-sm text-gray-600 leading-relaxed max-w-sm">
                Scrollio maps your interests in real time. Each session shapes the next — quietly, without you having to configure a thing.
              </p>
            </div>
            <div className="flex-1 relative">
              <AdaptiveVisual />
            </div>
          </motion.div>

          {/* Block 2 — 1/3 wide */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6 flex flex-col gap-4 min-h-[260px]"
            style={{
              background: "linear-gradient(160deg, rgba(249,115,22,0.09) 0%, rgba(251,191,36,0.06) 100%)",
              border: "1px solid rgba(249,115,22,0.18)",
              backdropFilter: "blur(20px)",
            }}
            whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
          >
            <div>
              <span
                className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: "rgba(249,115,22,0.12)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}
              >
                Micro-learning
              </span>
              <h3 className="mt-3 text-base font-bold text-gray-900 leading-snug">
                Short attention.<br />Not shallow learning.
              </h3>
              <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                Each card is one minute. By the tenth card, you've built a mental model.
              </p>
            </div>
            <div className="flex-1 flex items-end">
              <StackedCardsVisual />
            </div>
          </motion.div>

          {/* Block 3 — full width */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:col-span-3 rounded-2xl p-6 flex flex-col gap-5"
            style={{
              background: "linear-gradient(135deg, #1a0a2e 0%, #0f1a2e 100%)",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
            whileHover={{ scale: 1.008, transition: { duration: 0.2 } }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(6,182,212,0.12)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}
                >
                  Compounding knowledge
                </span>
                <h3 className="mt-3 text-lg font-bold text-white leading-snug">
                  Knowledge compounds over time.
                </h3>
                <p className="mt-1.5 text-sm text-white/50 leading-relaxed max-w-md">
                  What you learn in session one becomes the foundation for session ten. Scrollio builds a continuous learning path — invisible, powerful.
                </p>
              </div>
              <div
                className="shrink-0 text-right text-4xl font-black opacity-10 hidden sm:block"
                style={{ color: "#06b6d4", fontVariantNumeric: "tabular-nums" }}
              >
                ∞
              </div>
            </div>
            <div className="mt-2">
              <CompoundsVisual />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
