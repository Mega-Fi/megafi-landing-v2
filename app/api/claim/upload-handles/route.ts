import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
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

