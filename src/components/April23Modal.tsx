"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const STORAGE_KEY = "apr23_seen";

export default function April23Modal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const canSubmit = name.trim().length > 0 && !submitting;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await supabase
        .from("april23_visitors")
        .insert({ name: name.trim() });
    } catch (err) {
      console.error("[April23Modal] supabase insert failed", err);
    } finally {
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      window.location.assign(`${window.location.origin}/23nisan`);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="april23-title"
      style={{ fontFamily: "inherit" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, rgba(239,68,68,0.35), transparent 60%), radial-gradient(circle at 80% 90%, rgba(249,115,22,0.35), transparent 60%), rgba(10,10,30,0.55)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Floating confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="absolute block rounded-full"
            style={{
              top: c.top,
              left: c.left,
              width: c.size,
              height: c.size,
              background: c.color,
              opacity: 0.85,
              animation: `apr23-float ${c.dur}s ease-in-out ${c.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-xl rounded-[2rem] p-8 md:p-10 text-center"
        style={{
          background:
            "linear-gradient(160deg, #ffffff 0%, #fff7ed 45%, #fee2e2 100%)",
          boxShadow:
            "0 30px 80px -20px rgba(220,38,38,0.35), 0 0 0 1px rgba(255,255,255,0.6) inset, 0 60px 120px -40px rgba(0,0,0,0.25)",
          border: "2px solid rgba(255,255,255,0.9)",
        }}
      >
        {/* Ribbon */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] text-white"
            style={{
              background: "linear-gradient(135deg, #dc2626, #f97316)",
              boxShadow: "0 6px 20px rgba(220,38,38,0.35)",
            }}
          >
            23 Nisan Özel
          </span>
        </div>

        {/* Title */}
        <h2
          id="april23-title"
          className="text-2xl md:text-[34px] font-extrabold leading-tight mb-2"
          style={{
            background:
              "linear-gradient(135deg, #dc2626 0%, #ef4444 40%, #f97316 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          23 Nisan Ulusal Egemenlik
          <br />
          ve Çocuk Bayramı Kutlu Olsun!
        </h2>

        <p className="text-sm md:text-base mt-3 mb-6" style={{ color: "#7c2d12" }}>
          Bugün dünyanın her yerindeki çocuklara armağan edilen bu özel güne,
          sizi de aramızda görmekten mutluluk duyarız.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-left">
            <label
              htmlFor="apr23-name"
              className="block text-sm font-semibold mb-2"
              style={{ color: "#7c2d12" }}
            >
              Sevgili Trader, lütfen isminizi giriniz
            </label>
            <input
              id="apr23-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınız"
              autoComplete="off"
              className="w-full rounded-2xl px-4 py-3 text-base font-medium outline-none transition-all"
              style={{
                background: "#ffffff",
                border: "2px solid #fca5a5",
                color: "#1a1a1a",
                boxShadow: "0 4px 12px rgba(220,38,38,0.12)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#f97316";
                e.currentTarget.style.boxShadow =
                  "0 0 0 4px rgba(249,115,22,0.18)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#fca5a5";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(220,38,38,0.12)";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="relative w-full rounded-full py-4 text-base md:text-lg font-extrabold text-white transition-all active:scale-[0.98]"
            style={{
              background: canSubmit
                ? "linear-gradient(135deg, #dc2626 0%, #f97316 100%)"
                : "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)",
              boxShadow: canSubmit
                ? "0 12px 30px rgba(220,38,38,0.4)"
                : "0 4px 10px rgba(0,0,0,0.08)",
              cursor: canSubmit ? "pointer" : "not-allowed",
              opacity: canSubmit ? 1 : 0.7,
              transform: "translateZ(0)",
            }}
          >
            {submitting ? "Yönlendiriliyorsunuz..." : "23 Nisana Özel Web Sitemizi Keşfet →"}
          </button>

          <p className="text-[11px] mt-1" style={{ color: "#9a3412" }}>
            Butona bastığınızda 23 Nisan özel sayfasına yönlendirileceksiniz.
          </p>
        </form>
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes apr23-float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(6px); }
        }
      `}</style>
    </div>
  );
}

const CONFETTI = [
  { top: "8%",  left: "6%",  size: 10, color: "#ef4444", dur: 5.5, delay: 0 },
  { top: "16%", left: "88%", size: 14, color: "#f97316", dur: 6.2, delay: 0.4 },
  { top: "28%", left: "12%", size: 8,  color: "#facc15", dur: 5.0, delay: 0.8 },
  { top: "72%", left: "9%",  size: 12, color: "#dc2626", dur: 6.8, delay: 0.2 },
  { top: "82%", left: "84%", size: 10, color: "#fb923c", dur: 5.7, delay: 1.0 },
  { top: "60%", left: "92%", size: 8,  color: "#f87171", dur: 6.1, delay: 0.6 },
  { top: "48%", left: "4%",  size: 12, color: "#fde68a", dur: 5.3, delay: 1.2 },
  { top: "34%", left: "94%", size: 9,  color: "#fcd34d", dur: 6.4, delay: 0.9 },
];

