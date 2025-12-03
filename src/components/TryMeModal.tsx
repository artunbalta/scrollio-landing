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

type Step = "draw" | "generating-mentor" | "mentor-ready" | "generating-video" | "video-ready";

export default function TryMeModal({ isOpen, onClose }: TryMeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(4);
  
  // Generation states
  const [step, setStep] = useState<Step>("draw");
  const [generationStatus, setGenerationStatus] = useState("");
  const [learningPrompt, setLearningPrompt] = useState("");
  const [mentorData, setMentorData] = useState<{
    drawingDescription?: string;
    characterImageUrl?: string;
  } | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#1a1a24";
        context.fillRect(0, 0, canvas.width, canvas.height);
        setCtx(context);
      }
      // Reset states when modal opens
      setStep("draw");
      setMentorData(null);
      setVideoUrl(null);
      setError(null);
      setLearningPrompt("");
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

  // Generate Mentor (Step 1)
  const handleGenerateMentor = async () => {
    if (!canvasRef.current) return;

    setStep("generating-mentor");
    setError(null);
    setGenerationStatus("Çizim analiz ediliyor...");

    try {
      const imageBase64 = canvasRef.current.toDataURL("image/png");

      setGenerationStatus("Mentorunuz oluşturuluyor...");
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          generateVideo: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setMentorData({
        drawingDescription: data.drawingDescription,
        characterImageUrl: data.characterImageUrl,
      });
      setStep("mentor-ready");

    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setStep("draw");
    }
  };

  // Generate Video (Step 2 - Optional)
  const handleGenerateVideo = async () => {
    if (!mentorData?.characterImageUrl || !learningPrompt.trim()) return;

    setStep("generating-video");
    setError(null);
    setGenerationStatus("Eğitici video oluşturuluyor...");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterImageUrl: mentorData.characterImageUrl,
          learningPrompt,
          generateVideo: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Video generation failed");
      }

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setStep("video-ready");
      } else {
        throw new Error("Video could not be generated");
      }

    } catch (err) {
      console.error("Video generation error:", err);
      setError(err instanceof Error ? err.message : "Video oluşturulamadı");
      setStep("mentor-ready");
    }
  };

  const handleReset = () => {
    setStep("draw");
    setMentorData(null);
    setVideoUrl(null);
    setError(null);
    setLearningPrompt("");
    clearCanvas();
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
          <p className="text-sm text-[#9090a0]">
            {step === "draw" && "Mentorunu çiz!"}
            {step === "generating-mentor" && "AI sihirini yapıyor..."}
            {step === "mentor-ready" && "İşte mentorun! 🎉"}
            {step === "generating-video" && "Video oluşturuluyor..."}
            {step === "video-ready" && "Videon hazır!"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Step: Draw */}
        {step === "draw" && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">
                  ✏️ Mentorunu çiz
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
                Parmağınız veya mouse ile hayalinizdeki mentoru çizin
              </p>
            </div>

            <button
              onClick={handleGenerateMentor}
              className="w-full mt-6 py-3 px-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Mentoru Oluştur ✨
            </button>
          </>
        )}

        {/* Step: Generating Mentor */}
        {step === "generating-mentor" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-white mb-2">{generationStatus}</p>
            <p className="text-sm text-[#9090a0]">Bu işlem 20-40 saniye sürebilir...</p>
          </div>
        )}

        {/* Step: Mentor Ready - Ask for learning topic */}
        {step === "mentor-ready" && mentorData && (
          <div className="space-y-6">
            {/* Mentor Image */}
            {mentorData.characterImageUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">🎨 İşte Mentorun!</label>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                  <img 
                    src={mentorData.characterImageUrl} 
                    alt="Your mentor"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Learning Prompt Input */}
            <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <label className="text-sm font-medium text-white">
                💭 Mentorundan ne öğrenmek istersin?
              </label>
              <input
                type="text"
                value={learningPrompt}
                onChange={(e) => setLearningPrompt(e.target.value)}
                placeholder="Örn: Dinozorlar, uzay, hayvanlar..."
                className="input-field"
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleGenerateVideo}
                  disabled={!learningPrompt.trim()}
                  className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Video Oluştur 🎬
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
                >
                  Bu kadar yeterli ✓
                </button>
              </div>
            </div>

            {/* Try Again */}
            <button
              onClick={handleReset}
              className="w-full py-2 text-sm text-[#9090a0] hover:text-white transition-colors"
            >
              ← Yeniden çiz
            </button>
          </div>
        )}

        {/* Step: Generating Video */}
        {step === "generating-video" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-pink-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-white mb-2">{generationStatus}</p>
            <p className="text-sm text-[#9090a0]">Video oluşturma 2-5 dakika sürebilir...</p>
            
            {/* Show mentor image while waiting */}
            {mentorData?.characterImageUrl && (
              <div className="mt-6 rounded-xl overflow-hidden border border-white/10 max-w-[200px] mx-auto">
                <img 
                  src={mentorData.characterImageUrl} 
                  alt="Your mentor"
                  className="w-full h-auto opacity-50"
                />
              </div>
            )}
          </div>
        )}

        {/* Step: Video Ready */}
        {step === "video-ready" && (
          <div className="space-y-6">
            {/* Video Player */}
            {videoUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">🎬 Mentorunun Videosu</label>
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <video 
                    src={videoUrl} 
                    controls
                    autoPlay
                    loop
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Mentor Image (smaller) */}
            {mentorData?.characterImageUrl && (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <img 
                  src={mentorData.characterImageUrl} 
                  alt="Your mentor"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-white">Mentorun</p>
                  <p className="text-xs text-[#9090a0]">{learningPrompt} hakkında öğretiyor</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-6 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
              >
                Yeni Mentor Oluştur
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Kapat
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-[#9090a0] mt-4">
          Demo amaçlıdır • fal.ai tarafından desteklenmektedir
        </p>
      </div>
    </div>
  );
}
