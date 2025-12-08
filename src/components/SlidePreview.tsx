"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import TryMeModal from "./TryMeModal";
import TeacherModal from "./TeacherModal";

export default function SlidePreview() {
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTryMeOpen, setIsTryMeOpen] = useState(false);
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);
  const startXRef = useRef(0);
  const panelWidth = 320;
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      setIsLocalhost(isLocal);
    }
  }, []);

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX - dragX;
  }, [dragX]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    
    const newX = clientX - startXRef.current;
    const clampedX = Math.max(0, Math.min(panelWidth, newX));
    setDragX(clampedX);
  }, [isDragging, panelWidth]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (dragX > panelWidth * 0.4) {
      setDragX(panelWidth);
    } else {
      setDragX(0);
    }
  }, [isDragging, dragX, panelWidth]);

  useEffect(() => {
    if (!isLocalhost || !isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const handleMouseUp = () => handleDragEnd();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isLocalhost, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (!isLocalhost || !isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) handleDragMove(e.touches[0].clientX);
    };
    const handleTouchEnd = () => handleDragEnd();

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, isLocalhost, handleDragMove, handleDragEnd]);

  if (!isLocalhost) return null;

  const isDark = theme === "dark";
  const progress = dragX / panelWidth;

  return (
    <>
      {/* Drag zone on the left edge */}
      {dragX < panelWidth * 0.5 && (
        <div
          className="fixed left-0 top-0 h-full w-6 z-50 cursor-e-resize"
          onMouseDown={(e) => {
            e.preventDefault();
            handleDragStart(e.clientX);
          }}
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              e.preventDefault();
              handleDragStart(e.touches[0].clientX);
            }
          }}
          style={{ 
            background: dragX === 0 ? 'linear-gradient(to right, rgba(249, 115, 22, 0.15), transparent)' : 'transparent',
          }}
        />
      )}

      {/* Overlay */}
      {dragX > 0 && (
        <div
          className="fixed inset-0 z-40 transition-opacity"
          style={{ 
            backgroundColor: `rgba(0, 0, 0, ${progress * 0.3})`,
            pointerEvents: isDragging ? 'none' : 'auto'
          }}
          onClick={() => !isDragging && setDragX(0)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed left-0 top-0 h-full z-50 ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
        style={{
          width: panelWidth,
          transform: `translateX(${dragX - panelWidth}px)`,
          pointerEvents: dragX > 50 ? 'auto' : 'none',
        }}
      >
        <div
          className="relative w-full h-full shadow-2xl overflow-hidden"
          style={{
            backgroundColor: "#000000",
          }}
        >

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
            <p
              className="text-sm font-light mb-2"
              style={{ color: "#94a3b8" }}
            >
              You found the secret page
            </p>
            <h2
              className="text-xl font-medium mb-10"
              style={{ color: "#ffffff" }}
            >
              Now you can enjoy Scrollio
            </h2>
            
            {/* Try Children Mode Button */}
            <button
              className="w-full max-w-[200px] px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105 mb-4"
              style={{
                background: "linear-gradient(135deg, #f97316, #a855f7)",
                color: "#ffffff",
                boxShadow: "0 4px 20px rgba(249, 115, 22, 0.3)",
              }}
              onClick={() => setIsTryMeOpen(true)}
            >
              Try Kids Mode
            </button>

            {/* Try Teachers Mode Button */}
            <button
              className="w-full max-w-[200px] px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #10b981, #14b8a6)",
                color: "#ffffff",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
              }}
              onClick={() => setIsTeacherOpen(true)}
            >
              Try Teacher Mode
            </button>
          </div>

          {/* Drag handle - invisible but functional */}
          <div 
            className="absolute right-0 top-0 h-full w-4 cursor-ew-resize"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDragStart(e.clientX);
            }}
            onTouchStart={(e) => {
              if (e.touches.length === 1) {
                e.preventDefault();
                e.stopPropagation();
                handleDragStart(e.touches[0].clientX);
              }
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <TryMeModal isOpen={isTryMeOpen} onClose={() => setIsTryMeOpen(false)} />
      <TeacherModal isOpen={isTeacherOpen} onClose={() => setIsTeacherOpen(false)} />
    </>
  );
}
