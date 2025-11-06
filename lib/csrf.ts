/**
 * CSRF Protection
 * 
 * Simple CSRF token generation and validation.
 * For production, consider using next-csrf or similar libraries.
 */

import { randomBytes } from 'crypto';

// In-memory store (use Redis in production)
const csrfTokens = new Map<string, { token: string; expires: number }>();

/**
 * Generate a CSRF token for a session
 */
export function generateCSRFToken(sessionId: string): string {
  const token = randomBytes(32).toString('hex');
  const expires = Date.now() + (60 * 60 * 1000); // 1 hour
  
  csrfTokens.set(sessionId, { token, expires });
  
  // Cleanup expired tokens
  for (const [key, value] of csrfTokens.entries()) {
    if (Date.now() > value.expires) {
      csrfTokens.delete(key);
    }
  }
  
  return token;
}

/**
 * Verify a CSRF token
 */
export function verifyCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored) return false;
  if (Date.now() > stored.expires) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  return stored.token === token;
}

/**
 * Get CSRF token from request headers
 */
export function getCSRFTokenFromRequest(request: Request): string | null {
  return request.headers.get('x-csrf-token');
}

