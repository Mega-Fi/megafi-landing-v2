import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for auth verification
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Verify user is authenticated (admin check can be added here)
 */
async function verifyAuth(request: Request): Promise<{ authenticated: boolean; error?: string }> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return { authenticated: false, error: "Authentication required" };
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    
    if (error || !user) {
      return { authenticated: false, error: "Invalid or expired token" };
    }

    // TODO: Add admin role check here
    // For now, require authentication
    return { authenticated: true };
  } catch (error) {
    return { authenticated: false, error: "Authentication failed" };
  }
}

export async function POST(request: Request) {
  try {
    // SECURITY: Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { handles } = body;

    if (!handles || !Array.isArray(handles) || handles.length === 0) {
      return NextResponse.json(
        { error: 'Handles array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Normalize handles (remove @ if present, convert to lowercase)
    const normalizedHandles = handles.map((handle: string) => ({
      twitter_handle: handle.replace('@', '').toLowerCase().trim(),
    }));

    // Remove duplicates
    const uniqueHandles = Array.from(
      new Map(normalizedHandles.map(item => [item.twitter_handle, item])).values()
    );

    // Bulk insert into database
    const { data, error } = await supabase
      .from('og_eligible_handles')
      .upsert(uniqueHandles, { onConflict: 'twitter_handle', ignoreDuplicates: true })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to upload handles' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: `Successfully uploaded ${uniqueHandles.length} handles`,
        count: uniqueHandles.length,
        data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading handles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

