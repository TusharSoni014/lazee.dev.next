/**
 * Simple in-memory rate limiter using a sliding window approach.
 * For production at scale, consider using Upstash Redis rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically (every 60 seconds)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60_000);

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Check rate limit for a given identifier (e.g., user email or IP).
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or expired window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowSeconds,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

// Pre-configured rate limits for different endpoints
export const RATE_LIMITS = {
  chat: { maxRequests: 20, windowSeconds: 60 }, // 20 requests per minute
  bulkFill: { maxRequests: 10, windowSeconds: 60 }, // 10 requests per minute
  coldDm: { maxRequests: 20, windowSeconds: 60 }, // 20 requests per minute
  feedback: { maxRequests: 5, windowSeconds: 300 }, // 5 requests per 5 minutes
  profile: { maxRequests: 30, windowSeconds: 60 }, // 30 requests per minute
} as const;
