// Client-safe (no "server-only"): builds a public URL for an uploaded file
// path returned by the API. Uses NEXT_PUBLIC_API_URL, which Next.js inlines
// into the client bundle at build time.
export function getPublicUploadUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  return `${base}/uploads/${path}`;
}
