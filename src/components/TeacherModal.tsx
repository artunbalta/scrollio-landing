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
  const [topicPrompt, setTopicPrompt] = useState("");
  const [generationStatus, setGenerationStatus] = useState("");
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!videoUrl.trim() || !topicPrompt.trim()) {
      setError("Video URL ve konu gerekli");
      return;
    }

    setStep("generating");
    setError(null);
    setGenerationStatus("Ders scripti oluşturuluyor...");

    try {
      const response = await fetch("/api/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl,
          topicPrompt,
        }),
      });

      setGenerationStatus("Ses üretiliyor...");
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setGenerationStatus("Tamamlandı!");
      setGeneratedScript(data.generatedScript);
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
    setGeneratedScript(null);
    setError(null);
    setTopicPrompt("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">Öğretmen Modu</h2>
          <p className="text-sm text-gray-500">
            {step === "upload" && "Bir konu söyleyin, AI sizin yerinize ders anlatsın"}
            {step === "generating" && "Video oluşturuluyor..."}
            {step === "result" && "Dersiniz hazır! 🎉"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Step: Upload */}
        {step === "upload" && (
          <div className="space-y-6">
            {/* Video URL Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">1</span>
                Video URL&apos;i
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/teacher-video.mp4"
                className="input-field"
              />
              <p className="text-xs text-gray-500">
                Kendinizi konuşurken çektiğiniz kısa bir video URL&apos;i. 
                Bu video tüm dersleriniz için kullanılacak.
              </p>
            </div>

            {/* Topic Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xs font-bold">2</span>
                Ders Konusu
              </label>
              <textarea
                value={topicPrompt}
                onChange={(e) => setTopicPrompt(e.target.value)}
                placeholder="Örn: İlkokul 3. sınıf için toplama işlemi, eğlenceli ve basit anlatım"
                rows={3}
                className="input-field resize-none"
              />
              <p className="text-xs text-gray-500">
                Kısa bir açıklama yazın, AI detaylı ders scriptini oluşturacak.
              </p>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🪄</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">AI Sihiri</p>
                  <p className="text-xs text-gray-600">
                    Claude AI konunuzu alıp 20 saniyelik profesyonel bir ders scriptine dönüştürür. 
                    TTS ile doğal ses üretilir, Creatify ile videonuz senkronize edilir.
                  </p>
                </div>
              </div>
            </div>

            {/* Example Topics */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500">💡 Örnek konular:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Güneş sistemi hakkında",
                  "Toplama işlemi nasıl yapılır",
                  "Suyun üç hali",
                  "Dişlerimizi neden fırçalarız"
                ].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setTopicPrompt(topic)}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!videoUrl.trim() || !topicPrompt.trim()}
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Ders Videosunu Oluştur 🎬
            </button>
          </div>
        )}

        {/* Step: Generating */}
        {step === "generating" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">{generationStatus}</p>
            <p className="text-sm text-gray-500">Bu işlem 1-2 dakika sürebilir...</p>
            
            <div className="mt-6 text-left max-w-sm mx-auto">
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Claude ile script oluşturuluyor
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-300" />
                  TTS ile ses üretiliyor
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-200" />
                  Creatify ile video senkronize ediliyor
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Result */}
        {step === "result" && resultVideoUrl && (
          <div className="space-y-6">
            {/* Video Player */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
              <video 
                src={resultVideoUrl} 
                controls
                autoPlay
                className="w-full h-auto"
              />
            </div>

            {/* Generated Script */}
            {generatedScript && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">📝 Üretilen Script:</p>
                <p className="text-sm text-gray-700 leading-relaxed">{generatedScript}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-6 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Yeni Ders Oluştur
              </button>
              <a
                href={resultVideoUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity text-center shadow-lg"
              >
                İndir 📥
              </a>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-gray-400 mt-6">
          Demo amaçlıdır • Claude + TTS + Creatify ile desteklenmektedir
        </p>
      </div>
    </div>
  );
}
