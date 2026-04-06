"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { ModelConfig } from "./ModelViewer";
import { getModelUrl } from "../lib/utils";
import { LeverSwitch } from "./ui/lever-switch";
import KidsModeDemo from "./KidsModeDemo";
import BackgroundOrbs from "./BackgroundOrbs";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

/** Slightly smaller characters on narrow mobile hero (vs desktop split). */
const MOBILE_MODEL_SCALE = 0.68;
const CORE_MODELS: ModelConfig[] = [
  { url: getModelUrl("scrolliocore1.glb"), position: [-0.75, -0.05, 0], scale: MOBILE_MODEL_SCALE, floatSpeed: 0.7, floatAmplitude: 0.06 },
  { url: getModelUrl("scrolliocore2.glb"), position: [0.75, -0.05, 0], scale: MOBILE_MODEL_SCALE, floatSpeed: 1.0, floatAmplitude: 0.07 },
];
const KIDS_MODELS: ModelConfig[] = [
  { url: getModelUrl("scrolliokids1.glb"), position: [-0.75, -0.05, 0], scale: MOBILE_MODEL_SCALE, floatSpeed: 1.1, floatAmplitude: 0.08 },
  { url: getModelUrl("scrolliokids2.glb"), position: [0.75, -0.05, 0], scale: MOBILE_MODEL_SCALE, floatSpeed: 0.85, floatAmplitude: 0.06 },
];

export default function MobileHero() {
  /** false = Core, true = Kids */
  const [isKids, setIsKids] = useState(false);
  const [showKidsDemo, setShowKidsDemo] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [isVapiCallActive, setIsVapiCallActive] = useState(false);
  const vapiRef = useRef<{ stop: () => Promise<void> } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setModelsReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  // When user toggles back to Core, hide the kids demo
  const handleLeverChange = (checked: boolean) => {
    setIsKids(checked);
    if (!checked) setShowKidsDemo(false);
  };

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
      alert(`Vapi error: ${msg}`);
    }
  }, []);

  const stopVapiCall = useCallback(async () => {
    if (vapiRef.current) {
      await vapiRef.current.stop();
      setIsVapiCallActive(false);
      vapiRef.current = null;
    }
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-dots"
      style={{ background: "var(--background)" }}
    >
      <BackgroundOrbs />

      {/* ── Core panel ── */}
      <div
        className="absolute inset-0 transition-opacity duration-400"
        style={{ opacity: isKids ? 0 : 1, pointerEvents: isKids ? "none" : "auto", zIndex: 1 }}
        aria-hidden={isKids}
      >
        {modelsReady && (
          <ModelViewer models={CORE_MODELS} cameraPosition={[0, 0.25, 4.55]} fov={52} />
        )}

        {/* Core overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none z-10">
          <div className="flex flex-col items-center text-center pt-24 px-6">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2 px-3 py-1 rounded-full"
              style={{ background: "rgba(168,85,247,0.1)", color: "var(--accent-secondary)", border: "1px solid rgba(168,85,247,0.2)" }}
            >
              Scrollio Core
            </span>
            <p className="text-xs max-w-[260px] leading-relaxed mt-2" style={{ color: "var(--foreground-muted)" }}>
              AI-curated and mentor reinforced short videos. Taught by history&apos;s greatest minds reborn as your personal mentors.
            </p>
          </div>

          {/* Vapi buttons */}
          <div className="mb-36 flex flex-col items-center gap-3 pointer-events-auto">
            {isVapiCallActive ? (
              <button
                type="button"
                onClick={stopVapiCall}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)", boxShadow: "0 4px 14px rgba(220,38,38,0.4)" }}
              >
                End call
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => startVapiCall("steve")}
                  className="px-4 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 14px rgba(168,85,247,0.4)" }}
                >
                  Ask Steve
                </button>
                <button
                  type="button"
                  onClick={() => startVapiCall("albert")}
                  className="px-4 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 14px rgba(168,85,247,0.4)" }}
                >
                  Ask Albert
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Kids panel ── */}
      <div
        className="absolute inset-0 transition-opacity duration-400"
        style={{ opacity: isKids ? 1 : 0, pointerEvents: isKids ? "auto" : "none", zIndex: 1 }}
        aria-hidden={!isKids}
      >
        {showKidsDemo ? (
          /* Kids drawing demo — min height so embedded flex canvas never collapses */
          <div className="absolute inset-0 z-[5] overflow-y-auto overscroll-contain pt-[4.5rem] pb-40 px-3">
            <div className="w-full max-w-lg mx-auto min-h-[400px] h-[calc(100dvh-10.5rem)] max-h-[calc(100dvh-6rem)] flex flex-col">
              <KidsModeDemo embedded className="h-full min-h-0 flex-1" />
            </div>
          </div>
        ) : (
          /* Kids 3D scene */
          <>
            {modelsReady && (
              <ModelViewer models={KIDS_MODELS} cameraPosition={[0, 0.25, 4.55]} fov={52} />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none z-10">
              <div className="flex flex-col items-center text-center pt-24 px-6">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2 px-3 py-1 rounded-full"
                  style={{ background: "rgba(249,115,22,0.1)", color: "var(--accent)", border: "1px solid rgba(249,115,22,0.2)" }}
                >
                  Scrollio Kids
                </span>
                <p className="text-xs max-w-[260px] leading-relaxed mt-2" style={{ color: "var(--foreground-muted)" }}>
                  Draw a character and watch it come alive as a living mentor. An AI-powered magical experience where children&apos;s imagination becomes their teacher.
                </p>
              </div>

              {/* Try Kids Mode button */}
              <div className="mb-36 pointer-events-auto">
                <button
                  onClick={() => setShowKidsDemo(true)}
                  className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #ea580c, #f97316)", boxShadow: "0 4px 16px rgba(249,115,22,0.35)" }}
                >
                  Try Kids Mode →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Lever — fixed at bottom center ── */}
      <div className="absolute bottom-16 left-0 right-0 z-20 flex flex-col items-center gap-3 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          <LeverSwitch
            checked={isKids}
            onChange={handleLeverChange}
            className="drop-shadow-lg"
          />
          <span
            className="text-[9px] tracking-widest uppercase"
            style={{ color: "var(--foreground-muted)", opacity: 0.7 }}
          >
            {isKids ? "Showing Scrollio Kids" : "Showing Scrollio Core"}
          </span>
        </div>
      </div>

      {/* ── Scroll to explore hint ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none">
        <span className="text-[9px] tracking-widest uppercase" style={{ color: "var(--foreground-muted)", opacity: 0.6 }}>
          Scroll to explore
        </span>
        <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="var(--foreground-muted)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

