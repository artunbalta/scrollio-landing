"use client";

import { useRef, useState, useEffect } from "react";

export interface KidsModeDemoProps {
  onClose?: () => void;
  /** When true, used inline (e.g. split page); no top-right close button */
  embedded?: boolean;
  className?: string;
}

const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
];

const ERASER_COLOR = "#ffffff";

type Step = "draw" | "generating-mentor" | "mentor-ready" | "generating-video" | "video-ready";

export default function KidsModeDemo({ onClose, embedded, className = "" }: KidsModeDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  const [step, setStep] = useState<Step>("draw");
  const [generationStatus, setGenerationStatus] = useState("");
  const [learningPrompt, setLearningPrompt] = useState("");
  const [mentorData, setMentorData] = useState<{
    drawingDescription?: string;
    characterImageUrl?: string;
  } | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const init = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        setCtx(context);
      }
      setStep("draw");
      setMentorData(null);
      setVideoUrl(null);
      setError(null);
      setLearningPrompt("");
      setEmail("");
      setChildName("");
      setEmailSent(false);
      setHistory([]);
    };
    const t = setTimeout(init, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = isEraser ? ERASER_COLOR : currentColor;
      ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, [ctx, currentColor, brushSize, isEraser]);

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

  const saveToHistory = () => {
    if (!ctx || !canvasRef.current) return;
    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory((prev) => [...prev, imageData]);
  };

  const handleUndo = () => {
    if (!ctx || !canvasRef.current || history.length === 0) return;
    const newHistory = [...history];
    const previousState = newHistory.pop();
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
      setHistory(newHistory);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    e.preventDefault();
    saveToHistory();
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
    setHistory([]);
  };

  const handleGenerateMentor = async () => {
    if (!canvasRef.current || !email.trim()) return;
    setStep("generating-mentor");
    setError(null);
    setGenerationStatus("Creating your mentor in Pixar style...");
    try {
      const imageBase64 = canvasRef.current.toDataURL("image/png");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          generateVideo: false,
          email: email.trim(),
          childName: childName.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");
      setMentorData({
        drawingDescription: data.drawingDescription,
        characterImageUrl: data.characterImageUrl,
      });
      if (data.characterImageUrl && email.trim()) {
        setGenerationStatus("Sending your mentor to your email...");
        try {
          const emailResponse = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toEmail: email.trim(),
              childName: childName.trim(),
              originalDrawing: imageBase64,
              mentorImageUrl: data.characterImageUrl,
            }),
          });
          const emailResult = await emailResponse.json();
          if (emailResponse.ok && emailResult.success) setEmailSent(true);
        } catch (emailErr) {
          console.error("Email sending failed:", emailErr);
        }
      }
      setStep("mentor-ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("draw");
    }
  };

  const handleGenerateVideo = async () => {
    if (!mentorData?.characterImageUrl || !learningPrompt.trim()) return;
    setStep("generating-video");
    setError(null);
    setGenerationStatus("Creating educational video...");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterImageUrl: mentorData.characterImageUrl,
          learningPrompt,
          generateVideo: true,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        throw new Error(errorMsg || "Video generation failed");
      }
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setStep("video-ready");
      } else {
        throw new Error("Video could not be generated");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video could not be created");
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
    setIsEraser(false);
    setHistory([]);
    clearCanvas();
  };

  const content = (
    <>
      {onClose && !embedded && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className={`text-center flex-shrink-0 ${embedded ? "mb-3" : "mb-6"}`}>
        <h2 className={`font-bold gradient-text ${embedded ? "text-lg mb-1" : "text-2xl mb-2"}`}>Scrollio Kids Demo</h2>
        <p className="text-sm text-gray-500">
          {step === "draw" && "Draw your mentor!"}
          {step === "generating-mentor" && "AI is working its magic..."}
          {step === "mentor-ready" && "Here's your mentor!"}
          {step === "generating-video" && "Creating video..."}
          {step === "video-ready" && "Your video is ready!"}
        </p>
      </div>

      {error && (
        <div className="flex-shrink-0 mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {step === "draw" && (
        <>
          <div className={embedded ? "flex flex-col flex-1 min-h-0 gap-2 overflow-hidden" : "space-y-3"}>
            <div className="flex-shrink-0 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">✏️ Draw your mentor</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Undo
                </button>
                <button
                  onClick={clearCanvas}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded border border-gray-200 hover:border-gray-300"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Color:</span>
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => { setCurrentColor(color.value); setIsEraser(false); }}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${currentColor === color.value && !isEraser ? "border-gray-800 scale-110 ring-2 ring-orange-500" : "border-gray-300 hover:border-gray-500"}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              <button
                onClick={() => setIsEraser(!isEraser)}
                className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${isEraser ? "border-gray-800 scale-110 ring-2 ring-orange-500 bg-white" : "border-gray-300 hover:border-gray-500 bg-white"}`}
                title="Eraser"
              >
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 01-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0zm-1.41 1.42L6.93 12.88l4.24 4.24 7.9-7.9-4.24-4.24zM5.52 14.29l-.71.71 4.95 4.95.71-.71-4.95-4.95z" />
                </svg>
              </button>
            </div>
            <div className="flex-shrink-0 flex items-center gap-3">
              <span className="text-xs text-gray-500">{isEraser ? "Eraser size:" : "Brush size:"}</span>
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
            {embedded ? (
              <div className="flex-1 min-h-0 min-w-0 flex items-center justify-center">
                <div className="w-full max-h-full aspect-[4/3]">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={300}
                    className="w-full h-full rounded-xl border border-gray-200 cursor-crosshair touch-none bg-white shadow-inner"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full mx-auto rounded-xl border border-gray-200 cursor-crosshair touch-none bg-white shadow-inner block"
                style={{ aspectRatio: "4/3", maxWidth: "320px" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            )}
            <p className="flex-shrink-0 text-xs text-gray-500 text-center">Use your finger or mouse to draw your dream mentor</p>
          </div>
          <div className={`space-y-2 rounded-xl bg-orange-50 border border-orange-100 flex-shrink-0 ${embedded ? "mt-2 p-3" : "mt-4 p-4"}`}>
            <p className="text-sm text-gray-900 font-medium">📧 We&apos;ll send your mentor via email!</p>
            <div className="space-y-2">
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Your child's name (optional)"
                className="input-field"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address *"
                className="input-field"
                required
              />
            </div>
            <p className="text-xs text-gray-500">* We&apos;ll send the generated mentor to your email</p>
          </div>
          <button
            onClick={handleGenerateMentor}
            disabled={!email.trim()}
            className={`w-full py-3 px-6 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0 ${embedded ? "mt-2" : "mt-4"}`}
          >
            Create Mentor ✨
          </button>
        </>
      )}

      {step === "generating-mentor" && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-orange-200" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">{generationStatus}</p>
          <p className="text-sm text-gray-500">This may take 20-40 seconds...</p>
        </div>
      )}

      {step === "mentor-ready" && mentorData && (
        <div className="space-y-6">
          {emailSent && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm text-center">
              ✅ Your mentor has been sent to <strong>{email}</strong>!
            </div>
          )}
          {mentorData.characterImageUrl && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">🎨 Here&apos;s Your Mentor!</label>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-gradient-to-br from-orange-50 to-purple-50">
                <img src={mentorData.characterImageUrl} alt="Your mentor" className="w-full h-auto" />
              </div>
            </div>
          )}
          <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <label className="text-sm font-medium text-gray-900">💭 What would you like to learn from your mentor?</label>
            <input
              type="text"
              value={learningPrompt}
              onChange={(e) => setLearningPrompt(e.target.value)}
              placeholder="E.g., Dinosaurs, space, animals..."
              className="input-field"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleGenerateVideo}
                disabled={!learningPrompt.trim()}
                className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Create Video 🎬
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  That&apos;s enough ✓
                </button>
              )}
            </div>
          </div>
          <button onClick={handleReset} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← Draw again
          </button>
        </div>
      )}

      {step === "generating-video" && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-purple-200" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">{generationStatus}</p>
          <p className="text-sm text-gray-500">Video creation may take 2-5 minutes...</p>
          {mentorData?.characterImageUrl && (
            <div className="mt-6 rounded-xl overflow-hidden border border-gray-200 max-w-[200px] mx-auto">
              <img src={mentorData.characterImageUrl} alt="Your mentor" className="w-full h-auto opacity-50" />
            </div>
          )}
        </div>
      )}

      {step === "video-ready" && (
        <div className="space-y-6">
          {videoUrl && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">🎬 Your Mentor&apos;s Video</label>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <video src={videoUrl} controls autoPlay loop className="w-full h-auto" />
              </div>
            </div>
          )}
          {mentorData?.characterImageUrl && (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-200">
              <img src={mentorData.characterImageUrl} alt="Your mentor" className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="text-sm font-medium text-gray-900">Your Mentor</p>
                <p className="text-xs text-gray-500">Teaching about {learningPrompt}</p>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 px-6 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Create New Mentor
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-center text-gray-400 mt-4">For demo purposes • Powered by fal.ai</p>
    </>
  );

  if (embedded) {
    return (
      <div className={`relative w-full h-full flex flex-col overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-xl p-4 ${className}`}>
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${className}`}>
      {content}
    </div>
  );
}
