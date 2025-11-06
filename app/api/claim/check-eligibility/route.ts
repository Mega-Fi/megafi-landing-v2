import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isRateLimited } from '@/lib/rate-limit';

export async function GET(request: Request) {
  try {
    // SECURITY: Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(`eligibility:${clientIp}`, { windowMs: 60000, maxRequests: 20 })) {
      return NextResponse.json(
        { eligible: false, reason: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const twitter_handle = searchParams.get('twitter_handle');

    if (!twitter_handle) {
      return NextResponse.json(
        { eligible: false, reason: 'Twitter handle is required' },
        { status: 400 }
      );
    }

    // SECURITY: Validate and sanitize Twitter handle
    const handleRegex = /^[a-zA-Z0-9_]{1,15}$/;
    const normalizedHandle = twitter_handle.replace('@', '').toLowerCase().trim();
    
    if (!handleRegex.test(normalizedHandle)) {
      return NextResponse.json(
        { eligible: false, reason: 'Invalid Twitter handle format' },
        { status: 400 }
      );
    }

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

    // Check if handle has already claimed (only if token_id is set)
    // A record might exist from whitelisting, but that doesn't mean they've claimed yet
    const { data: claimData, error: claimError } = await supabase
      .from('og_nft_claims')
      .select('id, token_id, claimed_at')
      .ilike('twitter_handle', normalizedHandle)
      .single();

    // Only consider it claimed if token_id is set (meaning they actually minted)
    if (claimData && claimData.token_id) {
      return NextResponse.json(
        { 
          eligible: false, 
          reason: 'already_claimed', // Special reason code for already claimed
          token_id: claimData.token_id,
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

