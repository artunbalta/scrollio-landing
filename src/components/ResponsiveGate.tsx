"use client";

import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

type Props = { children: React.ReactNode };

/** Renders children only on viewports narrower than 768px (Tailwind below `md`).
 *  Waits until after hydration to avoid SSR/client mismatch crash. */
export function MobileOnly({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const mobile = useIsMobile();
  if (!mounted || !mobile) return null;
  return <>{children}</>;
}

/** Renders children only on viewports 768px and wider (Tailwind `md` and up).
 *  Waits until after hydration to avoid SSR/client mismatch crash. */
export function DesktopOnly({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const mobile = useIsMobile();
  if (!mounted || mobile) return null;
  return <>{children}</>;
}
