"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

/* ─────────────────────────────────────────
   Pupil – bare dot that tracks the mouse
───────────────────────────────────────── */
interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

function Pupil({
  size = 12,
  maxDistance = 5,
  pupilColor = "#2D2D2D",
  forceLookX,
  forceLookY,
}: PupilProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const pos = () => {
    if (!ref.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const { x, y } = pos();

  return (
    <div
      ref={ref}
      className="rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: pupilColor,
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
}

/* ─────────────────────────────────────────
   EyeBall – white eye that tracks mouse
───────────────────────────────────────── */
interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

function EyeBall({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "#2D2D2D",
  isBlinking = false,
  forceLookX,
  forceLookY,
}: EyeBallProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const pos = () => {
    if (!ref.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const { x, y } = pos();

  return (
    <div
      ref={ref}
      className="rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: isBlinking ? 2 : size,
        backgroundColor: eyeColor,
        overflow: "hidden",
        transition: "height 0.15s ease",
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: pupilSize,
            height: pupilSize,
            backgroundColor: pupilColor,
            transform: `translate(${x}px, ${y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Animated Characters Scene
───────────────────────────────────────── */
function CharactersScene({ tokenVisible }: { tokenVisible: boolean }) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [purpleBlinking, setPurpleBlinking] = useState(false);
  const [blackBlinking, setBlackBlinking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* Random blinking for purple */
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setPurpleBlinking(true);
        setTimeout(() => {
          setPurpleBlinking(false);
          schedule();
        }, 150);
      }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  /* Random blinking for black */
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setBlackBlinking(true);
        setTimeout(() => {
          setBlackBlinking(false);
          schedule();
        }, 150);
      }, Math.random() * 4000 + 3500);
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  const calcBody = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 3;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    };
  };

  const purple = calcBody(purpleRef);
  const black = calcBody(blackRef);
  const yellow = calcBody(yellowRef);
  const orange = calcBody(orangeRef);

  /* When token is visible, characters look away (down-left) */
  const awayX = -5;
  const awayY = 5;

  return (
    <div
      className="relative w-full"
      style={{ height: 320, userSelect: "none" }}
    >
      {/* Purple – tall rectangle, back layer */}
      <div
        ref={purpleRef}
        className="absolute bottom-0"
        style={{
          left: "13%",
          width: 155,
          height: 290,
          backgroundColor: "#6C3FF5",
          borderRadius: "12px 12px 0 0",
          zIndex: 1,
          transform: `skewX(${purple.bodySkew}deg)`,
          transformOrigin: "bottom center",
          transition: "transform 0.15s ease-out",
        }}
      >
        <div
          className="absolute flex gap-7"
          style={{
            left: 38 + purple.faceX,
            top: 36 + purple.faceY,
            transition: "left 0.1s ease-out, top 0.1s ease-out",
          }}
        >
          <EyeBall
            size={20}
            pupilSize={8}
            maxDistance={6}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={purpleBlinking}
            forceLookX={tokenVisible ? awayX : undefined}
            forceLookY={tokenVisible ? awayY : undefined}
          />
          <EyeBall
            size={20}
            pupilSize={8}
            maxDistance={6}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={purpleBlinking}
            forceLookX={tokenVisible ? awayX : undefined}
            forceLookY={tokenVisible ? awayY : undefined}
          />
        </div>
      </div>

      {/* Black – tall rectangle, middle */}
      <div
        ref={blackRef}
        className="absolute bottom-0"
        style={{
          left: "39%",
          width: 115,
          height: 230,
          backgroundColor: "#2D2D2D",
          borderRadius: "8px 8px 0 0",
          zIndex: 2,
          transform: `skewX(${black.bodySkew}deg)`,
          transformOrigin: "bottom center",
          transition: "transform 0.15s ease-out",
        }}
      >
        <div
          className="absolute flex gap-6"
          style={{
            left: 22 + black.faceX,
            top: 26 + black.faceY,
            transition: "left 0.1s ease-out, top 0.1s ease-out",
          }}
        >
          <EyeBall
            size={18}
            pupilSize={7}
            maxDistance={5}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={blackBlinking}
            forceLookX={tokenVisible ? awayX : undefined}
            forceLookY={tokenVisible ? awayY : undefined}
          />
          <EyeBall
            size={18}
            pupilSize={7}
            maxDistance={5}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={blackBlinking}
            forceLookX={tokenVisible ? awayX : undefined}
            forceLookY={tokenVisible ? awayY : undefined}
          />
        </div>
      </div>

      {/* Orange – semi-circle, front left */}
      <div
        ref={orangeRef}
        className="absolute bottom-0"
        style={{
          left: "-2%",
          width: 240,
          height: 165,
          backgroundColor: "#FF9B6B",
          borderRadius: "120px 120px 0 0",
          zIndex: 3,
          transform: `skewX(${orange.bodySkew}deg)`,
          transformOrigin: "bottom center",
          transition: "transform 0.15s ease-out",
        }}
      >
        <div
          className="absolute flex gap-8"
          style={{
            left: 82 + orange.faceX,
            top: 84 + orange.faceY,
            transition: "left 0.1s ease-out, top 0.1s ease-out",
          }}
        >
          <Pupil
            size={14}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={tokenVisible ? awayX : undefined}
            forceLookY={tokenVisible ? awayY : undefined}
          />
          <Pupil
            size={14}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={tokenVisible ? awayX : undefined}
            forceLookY={tokenVisible ? awayY : undefined}
          />
        </div>
      </div>

      {/* Yellow – rounded rectangle, front right */}
      <div
        ref={yellowRef}
        className="absolute bottom-0"
        style={{
          left: "57%",
          width: 145,
          height: 255,
          backgroundColor: "#E8D754",
          borderRadius: "72px 72px 0 0",
          zIndex: 4,
          transform: `skewX(${yellow.bodySkew}deg)`,
          transformOrigin: "bottom center",
          transition: "transform 0.15s ease-out",
        }}
      >
        <div
          className="absolute flex gap-6"
          style={{
            left: 46 + yellow.faceX,
            top: 38 + yellow.faceY,
            transition: "left 0.1s ease-out, top 0.1s ease-out",
          }}
        >
          <Pupil
            size={14}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={tokenVisible ? awayX : undefined}
            forceLookY={tokenVisible ? awayY : undefined}
          />
          <Pupil
            size={14}
            maxDistance={5}
            pupilColor="#2D2D2D"
            forceLookX={tokenVisible ? awayX : undefined}
            forceLookY={tokenVisible ? awayY : undefined}
          />
        </div>
        {/* Mouth line */}
        <div
          className="absolute rounded-full"
          style={{
            width: 46,
            height: 3,
            backgroundColor: "#2D2D2D",
            left: 36 + yellow.faceX,
            top: 96 + yellow.faceY,
            transition: "left 0.1s ease-out, top 0.1s ease-out",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Section
───────────────────────────────────────── */
interface FormData {
  name: string;
  email: string;
  role: string;
  message: string;
}

const DISCOUNT_TOKEN = "SCROLLIO20-EARLY";

export default function WaitlistSection({ noFrame }: { noFrame?: boolean } = {}) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from("waitlist")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            message: formData.message,
          },
        ]);

      if (supabaseError) {
        console.error("Supabase error:", supabaseError.message, "| code:", supabaseError.code, "| details:", supabaseError.details, "| hint:", supabaseError.hint);
        throw new Error(supabaseError.message);
      }

      try {
        await fetch("/api/send-welcome-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toEmail: formData.email,
            name: formData.name,
            role: formData.role,
          }),
        });
      } catch (emailErr) {
        console.error("Welcome email sending failed:", emailErr);
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", role: "", message: "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Error submitting form:", message);
      setError(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-24 px-6 relative">
      {!noFrame && (
        <div
          className="absolute inset-0 rounded-[3rem] mx-4 lg:mx-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(168, 85, 247, 0.05))",
          }}
        />
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-lg font-medium mb-4" style={{ color: "var(--accent)" }}>
            Ready to Transform?
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: "var(--foreground)" }}
          >
            Start Your <span className="script-gradient">Scrollio</span> Journey
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--foreground-muted)" }}>
            Be among the first to experience the future of learning with
            Scrollio&apos;s AI-powered platform. Join our waitlist for early access.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div
          className={`grid lg:grid-cols-2 gap-0 rounded-[1.5rem] overflow-hidden ${noFrame ? "" : "shadow-xl"}`}
          style={noFrame ? undefined : { border: "1px solid var(--card-border)" }}
        >

          {/* ── LEFT: Characters panel ── */}
          <div
            className="relative flex flex-col justify-between p-10 min-h-[580px]"
            style={{
              background: "linear-gradient(145deg, #f97316ee, #a855f7cc)",
            }}
          >
            {/* Top label */}
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-2">
                Early Access
              </p>
              <h3 className="text-white text-2xl font-bold leading-snug">
                Join the waitlist &amp;<br />get exclusive perks
              </h3>

              {/* Benefits list */}
              <ul className="mt-6 space-y-3">
                {[
                  "Priority access before public launch",
                  "Shape the product with direct feedback",
                  "Exclusive early-user perks & discounts",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/90">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Characters sitting at the bottom */}
            <div className="flex items-end justify-center pt-8">
              <CharactersScene tokenVisible={showToken} />
            </div>

            {/* Subtle decorative circles */}
            <div className="absolute top-6 right-6 w-32 h-32 rounded-full opacity-10" style={{ background: "white" }} />
            <div className="absolute bottom-24 right-4 w-16 h-16 rounded-full opacity-10" style={{ background: "white" }} />
          </div>

          {/* ── RIGHT: Form + token ── */}
          <div className="flex flex-col justify-between p-10" style={{ background: noFrame ? "transparent" : "var(--card-bg)" }}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                >
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                  Thank you!
                </h3>
                <p style={{ color: "var(--foreground-muted)" }}>
                  We&apos;ve added you to the waitlist. We&apos;ll be in touch soon with updates.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
                      Join the Waitlist
                    </h3>
                    <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                      Fill in your details and we&apos;ll be in touch.
                    </p>
                  </div>

                  {error && (
                    <div
                      className="p-4 rounded-lg text-sm"
                      style={{
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        color: "#ef4444",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        Name <span style={{ color: "var(--accent)" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="input-field"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        Email <span style={{ color: "var(--accent)" }}>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      I am a... <span style={{ color: "var(--accent)" }}>*</span>
                    </label>
                    <select
                      id="role"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="input-field cursor-pointer"
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="learner">Learner (Teen / Adult)</option>
                      <option value="parent">Parent</option>
                      <option value="school">School / Educator</option>
                      <option value="partner">Potential Partner</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      Message{" "}
                      <span style={{ color: "var(--foreground-muted)" }}>(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what interests you about Scrollio..."
                      className="input-field resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Get Started"}
                  </button>

                  <p className="text-xs text-center" style={{ color: "var(--foreground-muted)" }}>
                    By signing up, you agree to receive updates about Scrollio.
                    No spam, unsubscribe anytime.
                  </p>
                </form>

                {/* ── Discount token ── */}
                <div
                  className="mt-6 rounded-2xl p-5"
                  style={{
                    background: "linear-gradient(135deg, rgba(249,115,22,0.06), rgba(168,85,247,0.06))",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                      }}
                    >
                      20%
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        Your Early-Access Discount
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                        20% off all premium features — yours to keep
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-3"
                    style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                  >
                    <span
                      className="flex-1 font-mono text-sm tracking-widest transition-all duration-300"
                      style={{
                        color: showToken ? "var(--accent)" : "var(--foreground-muted)",
                        filter: showToken ? "none" : "blur(6px)",
                        userSelect: showToken ? "all" : "none",
                      }}
                    >
                      {DISCOUNT_TOKEN}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowToken((v) => !v)}
                      aria-label={showToken ? "Hide token" : "Reveal token"}
                      className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs mt-2 text-center" style={{ color: "var(--foreground-muted)" }}>
                    {showToken
                      ? "Psst… they can see it now 👀"
                      : "Toggle to reveal your personal discount code"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
