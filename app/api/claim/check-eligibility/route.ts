import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const twitter_handle = searchParams.get('twitter_handle');

    if (!twitter_handle) {
      return NextResponse.json(
        { eligible: false, reason: 'Twitter handle is required' },
        { status: 400 }
      );
    }

    // Normalize handle (remove @ if present, convert to lowercase)
    const normalizedHandle = twitter_handle.replace('@', '').toLowerCase();

    // Check if handle is in the eligible list
    const { data: eligibleData, error: eligibleError } = await supabase
      .from('og_eligible_handles')
      .select('twitter_handle')
      .ilike('twitter_handle', normalizedHandle)
      .single();

    if (eligibleError || !eligibleData) {
      return NextResponse.json(
        { eligible: false, reason: 'This X handle is not in the eligible list' },
        { status: 200 }
      );
    }

    // Check if handle has already claimed
    const { data: claimData, error: claimError } = await supabase
      .from('og_nft_claims')
      .select('id, claimed_at')
      .ilike('twitter_handle', normalizedHandle)
      .single();

    if (claimData) {
      return NextResponse.json(
        { 
          eligible: false, 
          reason: 'This X handle has already claimed an NFT',
          claimed_at: claimData.claimed_at
        },
        { status: 200 }
      );
    }

    // Handle is eligible!
    return NextResponse.json(
      { eligible: true, message: 'Congratulations! You are eligible to claim an OG NFT' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return NextResponse.json(
      { eligible: false, reason: 'Internal server error' },
      { status: 500 }
    );
  }
}

