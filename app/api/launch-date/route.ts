import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get the launch date from Supabase
    const { data, error } = await supabase
      .from('launch_config')
      .select('launch_date')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch launch date' },
        { status: 500 }
      );
    }

    return NextResponse.json({ launch_date: data.launch_date }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

