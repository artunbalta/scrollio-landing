"use client";

import { useIsMobile } from "@/hooks/useIsMobile";

type Props = { children: React.ReactNode };

/** Renders children only on viewports narrower than 768px (Tailwind below `md`). */
export function MobileOnly({ children }: Props) {
  const mobile = useIsMobile();
  if (!mobile) return null;
  return <>{children}</>;
}

/** Renders children only on viewports 768px and wider (Tailwind `md` and up). */
export function DesktopOnly({ children }: Props) {
  const mobile = useIsMobile();
  if (mobile) return null;
  return <>{children}</>;
}
