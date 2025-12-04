"use client";

import { useEffect, useState } from "react";

export default function GradientBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Main gradient blob following mouse */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(
            circle 800px at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(234, 88, 12, 0.25) 0%,
            rgba(249, 115, 22, 0.15) 40%,
            rgba(234, 88, 12, 0.08) 70%,
            transparent 100%
          )`,
          transition: "background 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      
      {/* Secondary subtle blob for depth */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(
            circle 600px at ${100 - mousePosition.x}% ${100 - mousePosition.y}%,
            rgba(249, 115, 22, 0.15) 0%,
            rgba(234, 88, 12, 0.08) 50%,
            transparent 100%
          )`,
          transition: "background 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </>
  );
}

