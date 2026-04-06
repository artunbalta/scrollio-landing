"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface LeverSwitchProps {
  /** false = Core (left), true = Kids (right) */
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function LeverSwitch({ checked, onChange, className }: LeverSwitchProps) {
  const id = useId();

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      {/* Core label */}
      <span
        className="text-sm font-bold uppercase tracking-widest transition-all duration-300"
        style={{
          color: !checked ? "var(--accent-secondary)" : "var(--foreground-muted)",
          opacity: !checked ? 1 : 0.45,
        }}
      >
        Core
      </span>

      {/* Lever */}
      <div className="toggle-container">
        <input
          id={id}
          type="checkbox"
          className="toggle-input"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={checked ? "Switch to Scrollio Core" : "Switch to Scrollio Kids"}
        />
        <div className="toggle-handle-wrapper">
          <div className="toggle-handle">
            <div className="toggle-handle-knob" />
            <div className="toggle-handle-bar-wrapper">
              <div className="toggle-handle-bar" />
              <div className="toggle-handle-bar" />
            </div>
          </div>
        </div>
        <div className="toggle-base">
          <div className="toggle-base-inside" />
        </div>
      </div>

      {/* Kids label */}
      <span
        className="text-sm font-bold uppercase tracking-widest transition-all duration-300"
        style={{
          color: checked ? "var(--accent)" : "var(--foreground-muted)",
          opacity: checked ? 1 : 0.45,
        }}
      >
        Kids
      </span>
    </div>
  );
}
