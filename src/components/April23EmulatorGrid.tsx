"use client";

import type { ReactNode } from "react";

export interface April23EmulatorGridProps {
  /**
   * Her emülatörün ekran içeriği (soldan sağa, en fazla 4).
   * Boş slotlarda ince placeholder gösterilir — buraya Image, video veya JSX ekleyin.
   */
  screens?: ReactNode[];
  /** Emülatörün altındaki kısa etiket (opsiyonel) */
  labels?: string[];
}

function PhoneShell({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-2 min-w-0">
      <div
        className="relative flex flex-col overflow-hidden rounded-[1.35rem] bg-[#1c1c1e] shadow-2xl"
        style={{
          width: "min(100%, clamp(104px, 19vw, 168px))",
          aspectRatio: "9 / 19.5",
          maxHeight: "min(52vh, 420px)",
          boxShadow:
            "0 16px 36px -10px rgba(0,0,0,0.35), 0 0 0 2px rgba(0,0,0,0.06)",
        }}
      >
        <div className="absolute top-1.5 left-1/2 z-10 h-[22px] w-[72px] -translate-x-1/2 rounded-full bg-black md:top-2 md:h-[26px] md:w-[90px]" />
        <div className="mx-1 mb-6 mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.1rem] bg-[#f2f2f7] md:mx-1.5 md:mb-8 md:mt-7 md:rounded-[1.5rem]">
          <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
        </div>
        <div className="absolute bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-black/40 md:bottom-2.5 md:w-28" />
      </div>
      {label ? (
        <span
          className="max-w-full truncate px-2 text-center text-[10px] font-semibold tracking-wide md:text-[11px]"
          style={{ color: "#9a3412" }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

function EmptyScreenSlot({ index }: { index: number }) {
  return (
    <div
      className="flex h-full min-h-[120px] flex-col items-center justify-center gap-1 px-1.5 py-3 text-center"
      style={{
        background: "linear-gradient(180deg, #fafafa 0%, #f2f2f7 100%)",
        border: "1px dashed rgba(0,0,0,0.12)",
      }}
    >
      <span className="text-[9px] font-semibold text-neutral-400 md:text-[10px]">
        Ekran {index + 1}
      </span>
      <span className="text-[8px] leading-tight text-neutral-400 md:text-[9px]">
        İçeriği buraya ekleyin
      </span>
    </div>
  );
}

export default function April23EmulatorGrid({
  screens = [],
  labels = [],
}: April23EmulatorGridProps) {
  const slots = [0, 1, 2, 3].map((i) => screens[i] ?? <EmptyScreenSlot index={i} />);

  return (
    <div className="flex w-full justify-center">
      <div className="grid w-full max-w-6xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 md:gap-4 lg:gap-6">
        {slots.map((content, i) => (
          <PhoneShell key={i} label={labels[i]}>
            {content}
          </PhoneShell>
        ))}
      </div>
    </div>
  );
}
