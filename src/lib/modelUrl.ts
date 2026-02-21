/**
 * Model dosyaları için URL.
 * Bunny CDN kullanmak için .env.local'e hem NEXT_PUBLIC_BUNNY_CDN_BASE_URL hem de
 * NEXT_PUBLIC_USE_BUNNY_CDN=true ekleyin (modeller CDN'de yüklü olmalı).
 * USE_BUNNY_CDN yoksa veya true değilse her zaman local /models/ kullanılır (404 önlenir).
 */
export function getModelUrl(path: string): string {
  const useCdn = process.env.NEXT_PUBLIC_USE_BUNNY_CDN === "true";
  const base = process.env.NEXT_PUBLIC_BUNNY_CDN_BASE_URL ?? "";
  if (!useCdn || !base) return path;
  const normalized = base.replace(/\/$/, "");
  return path.startsWith("/") ? `${normalized}${path}` : `${normalized}/${path}`;
}
