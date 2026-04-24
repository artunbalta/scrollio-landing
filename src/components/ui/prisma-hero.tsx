"use client";

import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { ModelConfig } from "../ModelViewer";
import KidsModeDemo from "../KidsModeDemo";
import { getModelUrl } from "../../lib/utils";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({
  text,
  className = "",
  showAsterisk = false,
  style,
}: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({
  segments,
  className = "",
  style,
}: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- Hero ---------------- */
const navItems = [
  { label: "Kids", href: "/#kids", target: "kids" as const },
  { label: "Core", href: "/#core", target: "core" as const },
  { label: "How it Works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "Waitlist", href: "/waitlist" },
];
const HERO_VIDEO_VERSION = "2026-04-24-1";
const ModelViewer = dynamic(() => import("../ModelViewer"), { ssr: false });
const CORE_MODELS: ModelConfig[] = [
  { url: getModelUrl("scrolliocore1.glb"), position: [-1.5, -0.05, 0], scale: 1.64, floatSpeed: 0.7, floatAmplitude: 0.06 },
  { url: getModelUrl("scrolliocore2.glb"), position: [1.5, -0.05, 0], scale: 1.64, floatSpeed: 1.0, floatAmplitude: 0.07 },
];

const SCROLLIO_CREAM = "#E1E0CC";

export const PrismaHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const vapiRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const [isVapiCallActive, setIsVapiCallActive] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Add a dwell window on frame 2 so fast scroll cannot skip it visually.
  const rawStripY = useTransform(
    scrollYProgress,
    [0, 0.42, 0.58, 1],
    [0, -100, -100, -200],
  );
  const smoothProgress = useSpring(rawStripY, {
    stiffness: 26,
    damping: 11,
    mass: 1.45,
    restDelta: 0.002,
  });
  const stripY = useTransform(smoothProgress, (v) => `${v}vh`);

  const chromeOpacityRaw = useTransform(scrollYProgress, [0.12, 0.44], [1, 0]);
  const chromeOpacity = useSpring(chromeOpacityRaw, {
    stiffness: 38,
    damping: 22,
    mass: 0.65,
  });

  const scrollToSecondFrame = useCallback(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const sectionTop = window.scrollY + sec.getBoundingClientRect().top;
    const scrollSpan = Math.max(0, sec.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: sectionTop + scrollSpan * 0.5,
      behavior: "smooth",
    });
  }, []);

  const scrollToFrame = useCallback((target: "kids" | "core") => {
    const sec = sectionRef.current;
    if (!sec) return;
    const sectionTop = window.scrollY + sec.getBoundingClientRect().top;
    const scrollSpan = Math.max(0, sec.offsetHeight - window.innerHeight);
    const ratio = target === "kids" ? 0.5 : 1;
    window.scrollTo({
      top: sectionTop + scrollSpan * ratio,
      behavior: "smooth",
    });
  }, []);

  const copySpring = { stiffness: 38, damping: 22, mass: 0.65, restDelta: 0.002 };

  const startVapiCall = useCallback(async (assistant: "steve" | "albert") => {
    try {
      const res = await fetch("/api/vapi/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistant }),
      });
      const data = await res.json();
      if (!res.ok || !data?.token || !data?.assistantId) throw new Error(data?.error || "Token error");
      const Vapi = (await import("@vapi-ai/web")).default;
      const vapi = new Vapi(data.token);
      vapiRef.current = vapi;
      vapi.on("error", (e: unknown) => console.error("[Vapi error]", e));
      vapi.on("call-start", () => setIsVapiCallActive(true));
      vapi.on("call-end", () => {
        setIsVapiCallActive(false);
        vapiRef.current = null;
      });
      await vapi.start(data.assistantId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
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

  const frame2CopyOpacityRaw = useTransform(
    scrollYProgress,
    [0.24, 0.36, 0.56, 0.68],
    [0, 1, 1, 0],
  );
  const frame2CopyOpacity = useSpring(frame2CopyOpacityRaw, copySpring);

  const frame3CopyOpacityRaw = useTransform(
    scrollYProgress,
    [0.56, 0.7, 0.98, 1],
    [0, 1, 1, 1],
  );
  const frame3CopyOpacity = useSpring(frame3CopyOpacityRaw, copySpring);

  return (
    <section ref={sectionRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          style={{ y: stripY }}
          className="absolute inset-x-0 top-0 flex h-[300vh] w-full flex-col will-change-transform"
          aria-hidden
        >
          {[1, 2, 3].map((n, i) => (
            <div key={n} className="relative h-screen w-full flex-none overflow-hidden">
              <div
                className={`absolute inset-x-0 ${
                  n === 1
                    ? "top-0 bottom-0"
                    : n === 2
                      ? "top-0 bottom-0 md:-top-[6vh]"
                      : "top-0 bottom-0"
                }`}
              >
                {n === 1 ? (
                  <>
                    <video
                      src={`/animation/landingvideo1.mp4?v=${HERO_VIDEO_VERSION}`}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="hidden h-full w-full object-cover object-top md:block"
                    />
                    <Image
                      src="/animation/1.png"
                      alt=""
                      fill
                      priority
                      className="object-cover object-top md:hidden"
                      sizes="100vw"
                      unoptimized
                    />
                  </>
                ) : (
                  <Image
                    src={`/animation/${n}.png`}
                    alt=""
                    fill
                    priority={i === 0}
                    loading={i === 0 ? undefined : "eager"}
                    className={`object-cover ${
                      n === 2 ? "object-top md:object-bottom" : n === 3 ? "object-top" : "object-bottom"
                    }`}
                    sizes="100vw"
                    unoptimized
                  />
                )}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          style={{ opacity: frame2CopyOpacity }}
          className="absolute inset-0 z-[22] flex items-start px-4 pt-24 sm:px-6 md:pt-28"
        >
          <div className="mx-auto flex w-full max-w-6xl items-start justify-center gap-6 lg:gap-8">
            <div className="pointer-events-none w-full max-w-xl font-sans font-normal [text-shadow:0_2px_28px_rgba(0,0,0,0.75)]">
              <p
                className="m-0 text-2xl font-medium tracking-tight md:text-4xl"
                style={{ color: SCROLLIO_CREAM }}
              >
                Scrollio Kids
              </p>
              <div className="mt-5 space-y-2 text-left text-sm font-normal leading-snug text-white/90 md:text-base">
                <p className="m-0">Drawing is the first interface.</p>
                <p className="m-0">We keep the play obvious on purpose.</p>
                <p className="m-0">Kids stay in charge of what the screen does next.</p>
                <p className="m-0">Parents see progress without stealing the fun.</p>
                <p className="m-0">Tiny wins stack into real confidence.</p>
              </div>
              <div className="pointer-events-auto mt-10 w-full max-w-[33.6rem] space-y-4">
                <div className="overflow-hidden rounded-2xl border border-white/25 bg-black/25 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                  <div className="aspect-video w-full">
                    <iframe
                      className="h-full w-full"
                      src="https://www.youtube.com/embed/1GbCXX2pOMU?autoplay=1&mute=1&playsinline=1&rel=0"
                      title="Scrollio Kids demo video"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-auto hidden w-[min(42vw,30rem)] lg:block">
              <KidsModeDemo embedded noInternalScroll className="h-[min(82dvh,50rem)]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: frame3CopyOpacity }}
          className="pointer-events-none absolute inset-0 z-[22] flex items-start px-4 pt-24 sm:px-6 md:pt-28"
          aria-hidden
        >
          <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-8">
            <div className="pointer-events-auto hidden w-[min(38vw,34rem)] lg:flex lg:flex-col lg:items-center">
              <div className="h-[42vh] min-h-[300px] w-full">
                <ModelViewer models={CORE_MODELS} cameraPosition={[0, 0.25, 4.2]} fov={52} />
              </div>
              <div className="mt-4 flex min-h-10 items-center justify-center">
                {isVapiCallActive ? (
                  <button
                    type="button"
                    onClick={stopVapiCall}
                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)", boxShadow: "0 4px 14px rgba(220,38,38,0.4)" }}
                    aria-label="End call"
                  >
                    End call
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-[11.25rem]">
                    <button
                      type="button"
                      onClick={() => startVapiCall("steve")}
                      className="rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 14px rgba(168,85,247,0.4)" }}
                      aria-label="Ask to Steve"
                    >
                      Ask to Steve
                    </button>
                    <button
                      type="button"
                      onClick={() => startVapiCall("albert")}
                      className="rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 14px rgba(168,85,247,0.4)" }}
                      aria-label="Ask to Albert"
                    >
                      Ask to Albert
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full max-w-xl text-right font-sans font-normal [text-shadow:0_2px_28px_rgba(0,0,0,0.75)]">
            <p
              className="m-0 text-2xl font-medium tracking-tight md:text-4xl"
              style={{ color: SCROLLIO_CREAM }}
            >
              Scrollio Core
            </p>
            <div className="mt-5 space-y-2 text-right text-sm font-normal leading-snug text-white/90 md:text-base">
              <p className="m-0">The feed already owns your attention.</p>
              <p className="m-0">We borrow that rhythm for learning on purpose.</p>
              <p className="m-0">One short clip can land harder than a long lecture.</p>
              <p className="m-0">Guilt is not part of the interface here.</p>
              <p className="m-0">Curiosity is the only habit we try to make loud.</p>
            </div>
            <div className="pointer-events-auto mt-10 ml-auto w-full max-w-[33.6rem] overflow-hidden rounded-2xl border border-white/25 bg-black/25 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/AA7aC2O5qkY?autoplay=1&mute=1&playsinline=1&rel=0"
                  title="Scrollio Core demo video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: chromeOpacity }}
          className="pointer-events-none absolute left-1/2 top-14 z-30 flex w-[min(96vw,36rem)] -translate-x-1/2 flex-col items-center gap-4 md:left-auto md:translate-x-0 md:right-14 md:top-20 lg:right-20 lg:top-24"
        >
          <motion.div
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[min(96vw,29.25rem)] max-w-full shrink-0 overflow-hidden aspect-[340/110.1]"
          >
            <Image
              src="/landinglogo.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 92vw, 720px"
              priority
              unoptimized
            />
          </motion.div>
          <motion.h1
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="m-0 w-full text-center text-[1.3rem] font-bold leading-snug tracking-tight whitespace-nowrap sm:text-[1.463rem] md:text-[1.625rem] lg:text-[1.95rem]"
          >
            <span style={{ color: SCROLLIO_CREAM }}>Turn Scrolling Into </span>
            <span className="script-gradient inline text-[1.3rem] sm:text-[1.463rem] md:text-[1.625rem] lg:text-[1.95rem]">
              Learning
            </span>
          </motion.h1>
        </motion.div>

        {/* Navbar (centered) */}
        <a
          href="/23nisan"
          className="absolute left-3 top-3 z-[26] inline-flex items-center rounded-full border border-red-200/70 bg-gradient-to-r from-red-600 via-red-500 to-rose-500 px-3 py-1.5 text-[10px] font-semibold text-white shadow-[0_8px_20px_rgba(220,38,38,0.45)] transition duration-200 hover:scale-105 hover:from-red-500 hover:to-rose-400 active:scale-95 animate-[pulse_2.2s_ease-in-out_infinite] sm:left-4 sm:top-4 sm:text-xs"
        >
          23 Nisan Ozel Siteye Gitmek Icin Tikla
        </a>

        <nav className="absolute left-1/2 top-0 z-[25] -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-b-2xl border border-white/40 bg-gradient-to-b from-orange-100/45 via-amber-50/35 to-orange-200/40 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.06)] ring-1 ring-white/20 sm:gap-6 md:gap-12 md:rounded-b-3xl md:px-8 lg:gap-14">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.target) {
                    e.preventDefault();
                    scrollToFrame(item.target);
                  }
                }}
                className="text-[10px] text-stone-800/90 transition-colors hover:text-stone-950 sm:text-xs md:text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <motion.div
          style={{ opacity: chromeOpacity }}
          className="pointer-events-none absolute bottom-24 left-4 z-30 flex max-w-lg flex-col items-start gap-5 sm:left-6 md:bottom-28 md:left-8 md:max-w-xl md:gap-6"
        >
          <motion.p
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="m-0 text-left text-xs sm:text-sm md:text-base"
            style={{ lineHeight: 1.35, color: "rgba(225, 224, 204, 0.9)" }}
          >
            Scrollio is an AI-powered learning playground that turns everyday
            scrolling into meaningful education — from TikTok-style knowledge
            feeds to magical experiences where children&apos;s drawings become
            living mentors.
          </motion.p>
          <motion.button
            type="button"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto group inline-flex cursor-pointer items-center gap-2 rounded-full border-0 py-1 pl-5 pr-1 text-left text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
            style={{ backgroundColor: SCROLLIO_CREAM }}
            onClick={scrollToSecondFrame}
            aria-label="Scroll to next frame — Start your trial"
          >
            Start your trial
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
              <ArrowRight className="h-4 w-4" style={{ color: SCROLLIO_CREAM }} />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PrismaHero;
