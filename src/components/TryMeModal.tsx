"use client";

import { useRef, useState, useEffect } from "react";

interface TryMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  { name: "Siyah", value: "#000000" },
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
  const [currentColor, setCurrentColor] = useState("#000000");
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
  
  // Email capture
  const [email, setEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        setCtx(context);
      }
      // Reset states when modal opens
      setStep("draw");
      setMentorData(null);
      setVideoUrl(null);
      setError(null);
      setLearningPrompt("");
      setEmail("");
      setChildName("");
      setEmailSent(false);
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
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Generate Mentor (Step 1)
  const handleGenerateMentor = async () => {
    if (!canvasRef.current || !email.trim()) return;

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
          email: email.trim(),
          childName: childName.trim(),
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
      
      // Send email with the mentor image
      if (data.characterImageUrl && email.trim()) {
        setGenerationStatus("Mentorunuz email'inize gönderiliyor...");
        try {
          console.log("Sending email to:", email.trim());
          const emailResponse = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              toEmail: email.trim(),
              childName: childName.trim(),
              originalDrawing: imageBase64,
              mentorImageUrl: data.characterImageUrl,
            }),
          });
          
          const emailResult = await emailResponse.json();
          console.log("Email API response:", emailResult);
          
          if (emailResponse.ok && emailResult.success) {
            setEmailSent(true);
            console.log("Email sent successfully!");
          } else {
            console.error("Email failed:", emailResult.error);
          }
        } catch (emailErr) {
          console.error("Email sending failed:", emailErr);
        }
      }
      
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
    setEmail("");
    setChildName("");
    setEmailSent(false);
    clearCanvas();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold gradient-text mb-2">Scrollio Kids Demo</h2>
          <p className="text-sm text-gray-500">
            {step === "draw" && "Mentorunu çiz!"}
            {step === "generating-mentor" && "AI sihirini yapıyor..."}
            {step === "mentor-ready" && "İşte mentorun! 🎉"}
            {step === "generating-video" && "Video oluşturuluyor..."}
            {step === "video-ready" && "Videon hazır!"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Step: Draw */}
        {step === "draw" && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">
                  ✏️ Mentorunu çiz
                </label>
                <button
                  onClick={clearCanvas}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded border border-gray-200 hover:border-gray-300"
                >
                  Temizle
                </button>
              </div>
              
              {/* Color Picker */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">Renk:</span>
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setCurrentColor(color.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      currentColor === color.value 
                        ? "border-gray-800 scale-110 ring-2 ring-orange-500" 
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              {/* Brush Size */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">Kalınlık:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-xs text-gray-700 w-6">{brushSize}</span>
              </div>
              
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full rounded-xl border border-gray-200 cursor-crosshair touch-none bg-white shadow-inner"
                style={{ aspectRatio: "4/3" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              
              <p className="text-xs text-gray-500 text-center">
                Parmağınız veya mouse ile hayalinizdeki mentoru çizin
              </p>
            </div>

            {/* Email Capture */}
            <div className="space-y-3 mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
              <p className="text-sm text-gray-900 font-medium">
                📧 Mentorunuzu email olarak göndereceğiz!
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Çocuğunuzun adı (opsiyonel)"
                  className="input-field"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz *"
                  className="input-field"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                * Oluşturulan mentoru email adresinize göndereceğiz
              </p>
            </div>

            <button
              onClick={handleGenerateMentor}
              disabled={!email.trim()}
              className="w-full mt-4 py-3 px-6 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Mentoru Oluştur ✨
            </button>
          </>
        )}

        {/* Step: Generating Mentor */}
        {step === "generating-mentor" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-orange-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">{generationStatus}</p>
            <p className="text-sm text-gray-500">Bu işlem 20-40 saniye sürebilir...</p>
          </div>
        )}

        {/* Step: Mentor Ready - Ask for learning topic */}
        {step === "mentor-ready" && mentorData && (
          <div className="space-y-6">
            {/* Email Sent Success */}
            {emailSent && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm text-center">
                ✅ Mentorunuz <strong>{email}</strong> adresine gönderildi!
              </div>
            )}
            
            {/* Mentor Image */}
            {mentorData.characterImageUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">🎨 İşte Mentorun!</label>
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-gradient-to-br from-orange-50 to-purple-50">
                  <img 
                    src={mentorData.characterImageUrl} 
                    alt="Your mentor"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Learning Prompt Input */}
            <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <label className="text-sm font-medium text-gray-900">
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
                  className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Video Oluştur 🎬
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Bu kadar yeterli ✓
                </button>
              </div>
            </div>

            {/* Try Again */}
            <button
              onClick={handleReset}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Yeniden çiz
            </button>
          </div>
        )}

        {/* Step: Generating Video */}
        {step === "generating-video" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">{generationStatus}</p>
            <p className="text-sm text-gray-500">Video oluşturma 2-5 dakika sürebilir...</p>
            
            {/* Show mentor image while waiting */}
            {mentorData?.characterImageUrl && (
              <div className="mt-6 rounded-xl overflow-hidden border border-gray-200 max-w-[200px] mx-auto">
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
                <label className="text-sm font-medium text-gray-900">🎬 Mentorunun Videosu</label>
                <div className="rounded-xl overflow-hidden border border-gray-200">
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
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-200">
                <img 
                  src={mentorData.characterImageUrl} 
                  alt="Your mentor"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Mentorun</p>
                  <p className="text-xs text-gray-500">{learningPrompt} hakkında öğretiyor</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-6 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Yeni Mentor Oluştur
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Kapat
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-gray-400 mt-4">
          Demo amaçlıdır • fal.ai tarafından desteklenmektedir
        </p>
      </div>
    </div>
  );
}
