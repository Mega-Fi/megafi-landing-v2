/**
 * Next.js Middleware
 *
 * Runs on every request before reaching API routes or pages.
 * Used for: HTTPS enforcement, security headers, etc.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. HTTPS Enforcement (Production only)
  if (process.env.NODE_ENV === "production") {
    const protocol = request.headers.get("x-forwarded-proto") || "http";

    if (protocol !== "https") {
      const httpsUrl = new URL(request.url);
      httpsUrl.protocol = "https:";
      return NextResponse.redirect(httpsUrl);
    }
  }

  // 2. Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://cdn.mxpnl.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.base.org https://*.basescan.org https://*.ethereum.org https://*.walletconnect.com https://*.walletconnect.org https://api.web3modal.org https://*.web3modal.org https://cca-lite.coinbase.com https://*.coinbase.com https://api.mixpanel.com https://*.mixpanel.com; " +
      "frame-src 'self' https:;"
  );

  // 3. Permissions Policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
