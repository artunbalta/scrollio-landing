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
      {/* Subtle static background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(234, 88, 12, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(234, 88, 12, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        
        {/* Static gradient blobs for ambient lighting */}
        <div
          className="absolute"
          style={{
            top: "10%",
            left: "15%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(234, 88, 12, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "20%",
            right: "20%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(249, 115, 22, 0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "50%",
            right: "10%",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(234, 88, 12, 0.05) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* Mouse-following gradient blob */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(
            circle 400px at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(234, 88, 12, 0.25) 0%,
            rgba(249, 115, 22, 0.15) 40%,
            rgba(234, 88, 12, 0.08) 70%,
            transparent 100%
          )`,
          transition: "background 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </>
  );
}

