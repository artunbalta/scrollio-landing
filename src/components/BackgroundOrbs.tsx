"use client";

import { useTheme } from "@/context/ThemeContext";

export default function BackgroundOrbs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top-left orb */}
      <div
        className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent 70%)"
            : "radial-gradient(circle, rgba(147, 197, 253, 0.5), transparent 70%)",
        }}
      />
      
      {/* Top-right orb */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%)"
            : "radial-gradient(circle, rgba(196, 181, 253, 0.4), transparent 70%)",
        }}
      />
      
      {/* Center-right orb */}
      <div
        className="absolute top-1/3 -right-48 w-[400px] h-[400px] rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)"
            : "radial-gradient(circle, rgba(219, 234, 254, 0.5), transparent 70%)",
        }}
      />
      
      {/* Bottom-left orb */}
      <div
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(168, 85, 247, 0.2), transparent 70%)"
            : "radial-gradient(circle, rgba(196, 181, 253, 0.45), transparent 70%)",
        }}
      />
      
      {/* Bottom-right orb */}
      <div
        className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.18), transparent 70%)"
            : "radial-gradient(circle, rgba(147, 197, 253, 0.4), transparent 70%)",
        }}
      />
    </div>
  );
}

