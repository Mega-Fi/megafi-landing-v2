/**
 * CSRF Token Generation Endpoint
 * 
 * Generates a CSRF token for the current session.
 * Client should call this on page load and include token in subsequent requests.
 */

import { NextResponse } from 'next/server';
import { generateCSRFToken } from '@/lib/csrf';

export async function GET(request: Request) {
  try {
    // Use session ID or create one based on user agent + IP
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const sessionId = `${ip}:${userAgent}`.slice(0, 100);
    
    const csrfToken = generateCSRFToken(sessionId);
    
    return NextResponse.json({ csrfToken });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

