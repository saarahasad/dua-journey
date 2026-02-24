/**
 * Base path for the app (e.g. /memorise-dua on GitHub Pages). Empty when served at root.
 * Set at build time via NEXT_PUBLIC_BASE_PATH in the deploy workflow.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Build a URL for a public asset (e.g. /audio/foo.mp3) so it works with basePath. */
export function getAssetUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${p}`;
}
