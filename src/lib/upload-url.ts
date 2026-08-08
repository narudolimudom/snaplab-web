import type { ProductImage } from './catalog-types';

// Client-safe (no "server-only"): builds a public URL for an uploaded file
// path returned by the API. Uses NEXT_PUBLIC_API_URL, which Next.js inlines
// into the client bundle at build time.
export function getPublicUploadUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  return `${base}/uploads/${path}`;
}

// Picks the primary image, falling back to the lowest sortOrder.
export function getPrimaryImage(images: ProductImage[]): ProductImage | undefined {
  return [...images].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  })[0];
}
