/**
 * Rate Limiting for Next.js API Routes
 * 
 * Simple in-memory rate limiter to prevent API abuse.
 * For production, consider using Redis or Upstash.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests per window */
  maxRequests: number;
}

/**
 * Check if a request should be rate limited
 * Returns true if request should be blocked
 */
export function isRateLimited(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No entry or expired window - allow request
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return false;
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > config.maxRequests) {
    return true; // Rate limited!
  }

  return false;
}

/**
 * Get rate limit info for a request
 */
export function getRateLimitInfo(identifier: string, config: RateLimitConfig) {
  const entry = rateLimitStore.get(identifier);
  const now = Date.now();

  if (!entry || now > entry.resetTime) {
    return {
      remaining: config.maxRequests,
      resetTime: now + config.windowMs,
    };
  }

  return {
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
  };
}

/**
 * Clean up expired entries (run periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

