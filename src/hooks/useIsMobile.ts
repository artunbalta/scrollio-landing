"use client";

import { useSyncExternalStore } from "react";

/** Matches Tailwind `md` (768px): viewports narrower than this count as mobile. */
const MOBILE_QUERY = "(max-width: 767px)";

function getMobileSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_QUERY).matches;
}

function subscribeMobile(onStoreChange: () => void): () => void {
  const mq = window.matchMedia(MOBILE_QUERY);
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", onStoreChange);
    return () => mq.removeEventListener("change", onStoreChange);
  }
  // Safari < 14 / legacy: addListener
  mq.addListener(onStoreChange);
  return () => mq.removeListener(onStoreChange);
}

/**
 * True when viewport width is under 768px (Tailwind below md). SSR snapshot is false.
 * Resize and device rotation update the value.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribeMobile, getMobileSnapshot, () => false);
}
