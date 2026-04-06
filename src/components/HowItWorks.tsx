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

/* ── Step 1: Stacked mini content cards ── */
function FeedMockup() {
  const cards = [
    { tag: "AI", title: "How neural networks mimic the brain", color: "#ea580c" },
    { tag: "Psychology", title: "Why your memory is a reconstruction", color: "#a855f7" },
    { tag: "Finance", title: "The compounding effect: why it's magic", color: "#10b981" },
  ];
  return (
    <div className="w-full flex flex-col gap-2.5">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          className="rounded-xl border px-3.5 py-3 flex items-start gap-3"
          style={{ background: "rgba(249,115,22,0.05)", borderColor: "rgba(249,115,22,0.15)" }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        >
          <span
            className="mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}30` }}
          >
            {c.tag}
          </span>
          <p className="text-[12px] leading-snug text-gray-700 font-medium">{c.title}</p>
        </motion.div>
      ))}
      <div
        className="rounded-xl border px-3.5 py-2.5 flex items-center gap-2.5 mt-0.5"
        style={{ background: "rgba(249,115,22,0.04)", borderColor: "rgba(249,115,22,0.2)", borderStyle: "dashed" }}
      >
        <span className="text-[10px] text-orange-400 font-semibold">✦ Next for you</span>
        <div className="h-1.5 flex-1 rounded-full" style={{ background: "rgba(249,115,22,0.12)" }}>
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

/* ── Step 2: AI node graph ── */
function AINodeGraph() {
  const nodes = [
    { cx: 18, cy: 38, color: "#ea580c", r: 6, delay: 0 },
    { cx: 50, cy: 18, color: "#a855f7", r: 8, delay: 0.4 },
    { cx: 82, cy: 40, color: "#f97316", r: 6, delay: 0.8 },
    { cx: 32, cy: 68, color: "#10b981", r: 5, delay: 1.1 },
    { cx: 68, cy: 70, color: "#f59e0b", r: 5, delay: 1.5 },
  ];
  const edges = [
    [18, 38, 50, 18], [50, 18, 82, 40],
    [50, 18, 32, 68], [82, 40, 68, 70],
    [32, 68, 68, 70],
  ];
  return (
    <div className="relative w-full" style={{ height: 140 }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(249,115,22,0.25)" strokeWidth="0.9" strokeDasharray="2.5 1.5" />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${n.cx}%`, top: `${n.cy}%`,
            width: n.r * 2, height: n.r * 2,
            background: n.color,
            transform: "translate(-50%,-50%)",
            boxShadow: `0 0 ${n.r * 3}px ${n.color}50`,
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: n.delay }}
        />
      ))}
      <div
        className="absolute bottom-2 right-2 px-3 py-1 rounded-full text-[10px] font-semibold"
        style={{ background: "rgba(249,115,22,0.1)", color: "#ea580c", border: "1px solid rgba(249,115,22,0.2)" }}
      >
        curiosity graph
      </div>
    </div>
  );
}

/* ── Step 3: Knowledge path ── */
function KnowledgePath() {
  const milestones = [
    { label: "Day 1",   topic: "AI basics",   done: true },
    { label: "Day 4",   topic: "Neural nets",  done: true },
    { label: "Day 9",   topic: "LLMs",         done: true },
    { label: "Day 18",  topic: "Future",        done: false },
  ];
  return (
    <div className="w-full flex flex-col gap-3">
      {milestones.map((m, i) => (
        <motion.div
          key={m.label}
          className="flex items-center gap-3.5"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.4 }}
        >
          <div
            className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
            style={{
              background: m.done ? "linear-gradient(135deg,#f97316,#a855f7)" : "rgba(249,115,22,0.1)",
              border: m.done ? "none" : "1.5px solid rgba(249,115,22,0.25)",
              color: m.done ? "white" : "#f97316",
            }}
          >
            {m.done ? "✓" : ""}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] text-gray-400">{m.label}</span>
              <span className="text-[11px] text-gray-700 font-semibold">{m.topic}</span>
            </div>
            <div className="h-1 rounded-full w-full" style={{ background: "rgba(249,115,22,0.1)" }}>
              {m.done && (
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#f97316,#a855f7)" }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.15 + 0.3 }}
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
    accentBg: "rgba(249,115,22,0.07)",
    accentBorder: "rgba(249,115,22,0.18)",
  },
  {
    num: "02",
    label: "AI reads the signal",
    headline: "Every swipe is a data point.",
    body: "Scrollio maps your curiosity in real time and reshapes what comes next — silently, seamlessly.",
    visual: <AINodeGraph />,
    accent: "#a855f7",
    accentBg: "rgba(168,85,247,0.06)",
    accentBorder: "rgba(168,85,247,0.18)",
  },
  {
    num: "03",
    label: "Knowledge compounds",
    headline: "What you learn today shapes tomorrow.",
    body: "Topics connect across sessions. Your feed evolves. You don't just learn — you grow.",
    visual: <KnowledgePath />,
    accent: "#ea580c",
    accentBg: "rgba(234,88,12,0.06)",
    accentBorder: "rgba(234,88,12,0.18)",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-28 px-4" style={{ background: "#FFEED4" }}>
      {/* Very subtle dot texture for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(rgba(249,115,22,0.18) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative max-w-5xl mx-auto">
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
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Scrolling was never<br />
            <span style={{ background: "linear-gradient(135deg, #f97316, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              the problem.
            </span>
          </h2>
          <p className="mt-4 text-base text-gray-500 max-w-md mx-auto leading-relaxed">
            The problem was what you scrolled through.<br />Scrollio fixes that.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-6">
          {/* Connecting line (desktop only) */}
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
              {/* Step badge + label */}
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

              {/* Animated visual */}
              <div
                className="rounded-xl overflow-hidden p-4 min-h-[148px] flex items-center"
                style={{ background: step.accentBg, border: `1px solid ${step.accentBorder}` }}
              >
                {step.visual}
              </div>

              {/* Text */}
              <div>
                <p className="text-[15px] font-bold text-gray-900 leading-snug mb-1.5">{step.headline}</p>
                <p className="text-[13px] text-gray-500 leading-relaxed">{step.body}</p>
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
          <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mb-5 font-semibold">
            Explore every domain
          </p>
          <TopicCloud tags={TOPIC_TAGS} speed={55} />
          <TopicCloud tags={TOPIC_TAGS_2} speed={45} reverse />
        </motion.div>
      </div>
    </section>
  );
}
