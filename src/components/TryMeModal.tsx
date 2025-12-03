"use client";

import { useRef, useState, useEffect } from "react";

interface TryMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  { name: "Beyaz", value: "#ffffff" },
  { name: "Kırmızı", value: "#ef4444" },
  { name: "Turuncu", value: "#f97316" },
  { name: "Sarı", value: "#eab308" },
  { name: "Yeşil", value: "#22c55e" },
  { name: "Mavi", value: "#3b82f6" },
  { name: "Mor", value: "#a855f7" },
  { name: "Pembe", value: "#ec4899" },
];

export default function TryMeModal({ isOpen, onClose }: TryMeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(4);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#1a1a24";
        context.fillRect(0, 0, canvas.width, canvas.height);
        setCtx(context);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, [ctx, currentColor, brushSize]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!ctx) return;
    setIsDrawing(false);
    ctx.closePath();
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = "#1a1a24";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9090a0] hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold gradient-text mb-2">Scrollio Kids Demo</h2>
          <p className="text-sm text-[#9090a0]">Çocuğunuzun hayal gücünü keşfedin</p>
        </div>

        {/* Canvas Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white">
              ✏️ Mentorunu oluştur
            </label>
            <button
              onClick={clearCanvas}
              className="text-xs text-[#9090a0] hover:text-white transition-colors px-2 py-1 rounded border border-white/10 hover:border-white/20"
            >
              Temizle
            </button>
          </div>
          
          {/* Color Picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#9090a0]">Renk:</span>
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setCurrentColor(color.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  currentColor === color.value 
                    ? "border-white scale-110" 
                    : "border-transparent hover:border-white/50"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#9090a0]">Kalınlık:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-xs text-white w-6">{brushSize}</span>
          </div>
          
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full rounded-xl border border-white/10 cursor-crosshair touch-none bg-[#1a1a24]"
            style={{ aspectRatio: "4/3" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          
          <p className="text-xs text-[#9090a0] text-center">
            Parmağınız veya mouse ile çizin
          </p>
        </div>

        {/* Prompt Section */}
        <div className="mt-6 space-y-3">
          <label className="text-sm font-medium text-white">
            💭 Ne öğrenmek istiyorsun?
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Örn: Dinozorlar hakkında bilgi öğrenmek istiyorum..."
            className="input-field"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={() => {
            console.log("Canvas data:", canvasRef.current?.toDataURL());
            console.log("Prompt:", prompt);
            // TODO: fal.ai integration will be added here
          }}
          className="w-full mt-6 py-3 px-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Mentoru Canlandır ✨
        </button>

        <p className="text-xs text-center text-[#9090a0] mt-4">
          Demo amaçlıdır • Yakında tam sürüm
        </p>
      </div>
    </div>
  );
}
