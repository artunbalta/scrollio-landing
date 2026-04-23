"use client";

import Image from "next/image";
import April23EmulatorGrid from "@/components/April23EmulatorGrid";

/** Varsayılan: `public/23nisan/23nisanvideo.mp4`. İsterseniz env ile başka URL verin. */
const HERO_VIDEO_SRC =
  process.env.NEXT_PUBLIC_23NISAN_HERO_VIDEO_SRC ?? "/23nisan/23nisanvideo.mp4";

/** İsteğe bağlı kapak görseli (ör. `/23nisan/hero-poster.jpg` veya tam URL) */
const HERO_VIDEO_POSTER = process.env.NEXT_PUBLIC_23NISAN_HERO_VIDEO_POSTER;

/** Emülatör ekranları: `public/23nisan/ekler/` — soldan sağa sıra (dosya adlarını güncelleyebilirsiniz). */
const EMULATOR_EKLER_IMAGES = [
  "/23nisan/ekler/IMG_1360.jpeg",
  "/23nisan/ekler/IMG_1361.jpeg",
  "/23nisan/ekler/IMG_1362.jpeg",
  "/23nisan/ekler/IMG_1363.jpeg",
] as const;

export default function April23Page() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 600px at 15% 10%, rgba(254,226,226,0.9), transparent 60%), radial-gradient(1200px 600px at 85% 90%, rgba(255,237,213,0.9), transparent 60%), #fffaf5",
      }}
    >
      {/* Floating celebratory decorations */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {DECOR.map((d, i) => (
          <span
            key={i}
            className="absolute text-3xl md:text-4xl"
            style={{
              top: d.top,
              left: d.left,
              animation: `apr23-page-bob ${d.dur}s ease-in-out ${d.delay}s infinite`,
            }}
          >
            {d.emoji}
          </span>
        ))}
      </div>

      {/* Top ribbon — Atatürk görseli sayfa (max-w-6xl) geometrik ortasında */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 py-5 sm:px-6 md:px-10">
        <div className="relative flex min-h-[3.25rem] items-center justify-center sm:min-h-[3.5rem] md:min-h-16">
          <a
            href="/"
            className="absolute left-0 top-1/2 z-20 flex -translate-y-1/2 items-center gap-2 no-underline"
          >
            <Image src="/icon.png" alt="Scrollio" width={34} height={34} className="rounded-full" />
            <span className="hidden text-sm font-bold sm:inline" style={{ color: "#7c2d12" }}>
              Scrollio
            </span>
          </a>
          <div className="relative z-10 flex w-full justify-center px-12 sm:px-16 md:px-20">
            <Image
              src="/23nisan/ataturk.png"
              alt="Mustafa Kemal Atatürk"
              width={196}
              height={77}
              className="h-auto w-full max-w-[min(34vw,106px)] object-contain object-center sm:max-w-[min(29vw,123px)] md:max-w-[140px] lg:max-w-[154px]"
              priority
              unoptimized
            />
          </div>
          <span
            className="absolute right-0 top-1/2 z-20 inline-block -translate-y-1/2 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white sm:px-4 sm:text-xs sm:tracking-[0.18em]"
            style={{
              background: "linear-gradient(135deg, #dc2626, #f97316)",
              boxShadow: "0 6px 20px rgba(220,38,38,0.35)",
            }}
          >
            23 Nisan Özel
          </span>
        </div>
      </header>

      {/* En üst: hero video — dört figürün üstünde */}
      <section
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-10 pt-2 pb-4 md:pb-6"
        aria-label="23 Nisan tanıtım videosu"
      >
        <div
          className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl bg-black/5"
          style={{
            aspectRatio: "16 / 9",
            boxShadow:
              "0 24px 50px -18px rgba(220,38,38,0.35), 0 0 0 1px rgba(255,255,255,0.85) inset",
          }}
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={HERO_VIDEO_POSTER || undefined}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
            Video oynatılamıyor.
          </video>
        </div>
      </section>

      {/* Dört emülatör — videonun altında; ekranları `screens` ile doldurun */}
      <section
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pt-0 pb-6 md:pb-8"
        aria-label="23 Nisan emülatörleri"
      >
        <April23EmulatorGrid
          screens={EMULATOR_EKLER_IMAGES.map((src, i) => (
            <div key={src} className="absolute inset-0">
              <Image
                src={src}
                alt={`23 Nisan ekran ${i + 1}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 45vw, 168px"
                unoptimized
              />
            </div>
          ))}
        />
        <p
          className="mx-auto mt-6 max-w-3xl text-center text-sm italic leading-snug md:mt-8 md:text-base"
          style={{ color: "#7c2d12" }}
        >
          Bugünün mentorlarını uygulamamız değil, ilhamımız olan çocuklar yarattı.
        </p>
      </section>

      {/* Başlık ve metin */}
      <section className="relative z-10 px-4 sm:px-6 md:px-10 pb-10 md:pb-14 max-w-6xl mx-auto">
        <div className="text-center">
          <h1
            className="text-3xl md:text-6xl font-extrabold leading-[1.05] tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, #dc2626 0%, #ef4444 40%, #f97316 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            23 Nisan Ulusal Egemenlik
            <br />
            ve Çocuk Bayramı Kutlu Olsun!
          </h1>
          <p
            className="mt-4 md:mt-6 text-sm md:text-lg max-w-2xl mx-auto"
            style={{ color: "#7c2d12" }}
          >
            Çocuklara armağan edilen bu özel günde, hayal gücünün ve öğrenmenin
            gücünü birlikte kutluyoruz.
          </p>
        </div>

        {/* CTA row */}
        <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
          <a
            href="/"
            className="inline-block no-underline px-7 py-3 rounded-full text-sm md:text-base font-bold text-white transition-all hover:scale-[1.03] active:scale-95"
            style={{
              background: "linear-gradient(135deg, #dc2626, #f97316)",
              boxShadow: "0 10px 28px rgba(220,38,38,0.35)",
            }}
          >
            Scrollio Ana Sayfasına Dön
          </a>
          <a
            href="#kutlama"
            className="inline-block no-underline px-7 py-3 rounded-full text-sm md:text-base font-bold transition-all hover:scale-[1.03] active:scale-95"
            style={{
              background: "#ffffff",
              color: "#9a3412",
              border: "2px solid #fca5a5",
              boxShadow: "0 6px 18px rgba(220,38,38,0.12)",
            }}
          >
            Kutlama Mesajını Oku
          </a>
        </div>
      </section>

      {/* Celebration message */}
      <section id="kutlama" className="relative z-10 px-4 sm:px-6 md:px-10 pb-16 max-w-3xl mx-auto">
        <div
          className="rounded-[2rem] p-7 md:p-10"
          style={{
            background:
              "linear-gradient(160deg, #ffffff 0%, #fff7ed 60%, #fee2e2 100%)",
            border: "2px solid rgba(255,255,255,0.9)",
            boxShadow:
              "0 20px 60px -20px rgba(220,38,38,0.22), 0 0 0 1px rgba(255,255,255,0.6) inset",
          }}
        >
          <p className="text-sm md:text-base leading-relaxed text-center" style={{ color: "#7c2d12" }}>
            Mustafa Kemal Atatürk&apos;ün dünya çocuklarına armağan ettiği bu
            özel günde, tüm çocukların gülümsemesi, meraklı gözleri ve sınırsız
            hayal güçleri bizim için en büyük ilham kaynağıdır.
            <br />
            <br />
            Scrollio ailesi olarak, öğrenmeyi çocuklar için sihirli bir maceraya
            dönüştürme hedefimize bu güzel günde bir kez daha inanarak devam
            ediyoruz.
            <br />
            <br />
            <span className="font-bold" style={{ color: "#dc2626" }}>
              23 Nisan Ulusal Egemenlik ve Çocuk Bayramı Kutlu Olsun!
            </span>
          </p>
        </div>
      </section>

      <section
        className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-10 sm:px-6 md:px-10"
        aria-label="Yönetim bizde"
      >
        <div className="flex justify-center">
          <Image
            src="/23nisan/yonetimbizde.png"
            alt="Yönetim bizde"
            width={960}
            height={540}
            className="h-auto w-full max-w-full rounded-2xl object-contain md:rounded-3xl"
            style={{ boxShadow: "0 20px 50px -20px rgba(220,38,38,0.2)" }}
            unoptimized
          />
        </div>
      </section>

      <footer className="relative z-10 pb-10 text-center">
        <span className="text-xs" style={{ color: "#9a3412" }}>
          © 2026 Scrollio · 23 Nisan&apos;a özel sayfa
        </span>
      </footer>

      <style jsx global>{`
        @keyframes apr23-page-bob {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50% { transform: translateY(-18px) rotate(4deg); }
        }
      `}</style>
    </main>
  );
}

const DECOR = [
  { top: "8%",  left: "5%",  emoji: "🎈", dur: 6.5, delay: 0 },
  { top: "14%", left: "92%", emoji: "🎉", dur: 7.2, delay: 0.4 },
  { top: "62%", left: "4%",  emoji: "🧸", dur: 7.8, delay: 0.8 },
  { top: "76%", left: "90%", emoji: "🎈", dur: 6.9, delay: 0.2 },
  { top: "42%", left: "96%", emoji: "🪁", dur: 8.0, delay: 0.6 },
  { top: "34%", left: "3%",  emoji: "🪁", dur: 7.5, delay: 1.0 },
];
