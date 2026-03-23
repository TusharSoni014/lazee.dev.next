/**
 * Centralized CORS helper for API routes.
 * Validates origin against allowed patterns instead of using wildcard "*".
 */

const ALLOWED_ORIGINS = [
  /^chrome-extension:\/\//,
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/(.*\.)?lazee\.dev$/,
];

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const isValidOrigin =
    origin != null && ALLOWED_ORIGINS.some((pattern) => pattern.test(origin));

  return {
    "Access-Control-Allow-Origin": isValidOrigin ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}
