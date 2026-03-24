/**
 * API configuration — resolves backend URL for local dev vs production.
 * In production (Vercel), uses NEXT_PUBLIC_API_URL env var pointing to Render.
 * Locally, falls back to http://127.0.0.1:8000.
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
