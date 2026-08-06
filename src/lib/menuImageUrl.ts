/** Display sizes for menu cards (matches public/menu optimized assets). */
export const MENU_CARD_IMAGE_WIDTH = 480;
export const MENU_CARD_IMAGE_HEIGHT = 360;

/**
 * Prefer the storage URL already stored on the item.
 * Kept as a helper so call sites can share preload / size attributes.
 */
export function menuCardImageUrl(imageUrl: string | null | undefined): string {
  return (imageUrl ?? "").trim();
}

/** Preload the first N card images so above-the-fold drinks appear sooner. */
export function preloadMenuImages(urls: string[], limit = 6) {
  if (typeof document === "undefined") return;

  const seen = new Set(
    Array.from(document.head.querySelectorAll('link[rel="preload"][as="image"]')).map(
      (node) => (node as HTMLLinkElement).href,
    ),
  );

  urls
    .map((url) => url.trim())
    .filter(Boolean)
    .slice(0, limit)
    .forEach((url) => {
      if (seen.has(url)) return;
      seen.add(url);
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);
    });
}
