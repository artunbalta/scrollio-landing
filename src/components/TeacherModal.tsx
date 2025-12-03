"use client";

import { useState } from "react";

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "upload" | "generating" | "result";

export default function TeacherModal({ isOpen, onClose }: TeacherModalProps) {
  const [step, setStep] = useState<Step>("upload");
  const [videoUrl, setVideoUrl] = useState("");
  const [lessonScript, setLessonScript] = useState("");
  const [generationStatus, setGenerationStatus] = useState("");
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!videoUrl.trim() || !lessonScript.trim()) {
      setError("Video URL ve ders scripti gerekli");
      return;
    }

    setStep("generating");
    setError(null);
    setGenerationStatus("Ses üretiliyor...");

    try {
      const response = await fetch("/api/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl,
          lessonScript,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setGenerationStatus("Tamamlandı!");
      setResultVideoUrl(data.videoUrl);
      setStep("result");

    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setStep("upload");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setResultVideoUrl(null);
    setError(null);
    setLessonScript("");
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
      <div className="relative w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">Öğretmen Modu</h2>
          <p className="text-sm text-[#9090a0]">
            {step === "upload" && "Videonuzu kullanarak AI ile sonsuz ders anlatın"}
            {step === "generating" && "Video oluşturuluyor..."}
            {step === "result" && "Dersiniz hazır! 🎉"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Step: Upload */}
        {step === "upload" && (
          <div className="space-y-6">
            {/* Video URL Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">1</span>
                Video URL&apos;i
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/teacher-video.mp4"
                className="input-field"
              />
              <p className="text-xs text-[#9090a0]">
                Kendinizi konuşurken çektiğiniz kısa bir video URL&apos;i yapıştırın. 
                Bu video tüm dersleriniz için kullanılacak.
              </p>
            </div>

            {/* Lesson Script Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 text-xs">2</span>
                Ders Scripti
              </label>
              <textarea
                value={lessonScript}
                onChange={(e) => setLessonScript(e.target.value)}
                placeholder="Merhaba çocuklar! Bugün güneş sistemini öğreneceğiz. Güneş sistemimizde 8 gezegen var..."
                rows={6}
                className="input-field resize-none"
              />
              <p className="text-xs text-[#9090a0]">
                AI&apos;ın okumasını istediğiniz ders içeriğini yazın. 
                Ne kadar detaylı yazarsanız o kadar iyi!
              </p>
            </div>

            {/* Example Section */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-[#9090a0] mb-2">💡 Örnek kullanım:</p>
              <ul className="text-xs text-[#9090a0] space-y-1">
                <li>• Matematik: &quot;Toplama işlemini öğrenelim...&quot;</li>
                <li>• Fen: &quot;Suyun halleri nelerdir?...&quot;</li>
                <li>• Türkçe: &quot;Bugün hikaye yazacağız...&quot;</li>
              </ul>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!videoUrl.trim() || !lessonScript.trim()}
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ders Videosunu Oluştur 🎬
            </button>
          </div>
        )}

        {/* Step: Generating */}
        {step === "generating" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-white mb-2">{generationStatus}</p>
            <p className="text-sm text-[#9090a0]">Bu işlem 1-3 dakika sürebilir...</p>
          </div>
        )}

        {/* Step: Result */}
        {step === "result" && resultVideoUrl && (
          <div className="space-y-6">
            {/* Video Player */}
            <div className="rounded-xl overflow-hidden border border-white/10">
              <video 
                src={resultVideoUrl} 
                controls
                autoPlay
                className="w-full h-auto"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-6 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
              >
                Yeni Ders Oluştur
              </button>
              <a
                href={resultVideoUrl}
                download
                className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity text-center"
              >
                İndir 📥
              </a>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-[#9090a0] mt-6">
          Demo amaçlıdır • ElevenLabs + Creatify Lipsync ile desteklenmektedir
        </p>
      </div>
    </div>
  );
}

