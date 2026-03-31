import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getModelUrl(filename: string) {
  const cdnUrl = process.env.NEXT_PUBLIC_BUNNY_CDN_URL;
  // cdnUrl should be the base path where the GLB files are hosted (e.g., https://myzone.b-cdn.net)
  return cdnUrl ? `${cdnUrl}/${filename}` : `/models/${filename}`;
}
