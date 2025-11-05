import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { twitter_handle, twitter_user_id, wallet_address, token_id, transaction_hash } = body;

    // Validate required fields
    if (!twitter_handle || !twitter_user_id || !wallet_address) {
      return NextResponse.json(
        { error: 'Missing required fields: twitter_handle, twitter_user_id, wallet_address' },
        { status: 400 }
      );
    }

    // Normalize handle
    const normalizedHandle = twitter_handle.replace('@', '').toLowerCase();

    // Check if handle is eligible
    const { data: eligibleData, error: eligibleError } = await supabase
      .from('og_eligible_handles')
      .select('twitter_handle')
      .ilike('twitter_handle', normalizedHandle)
      .single();

    if (eligibleError || !eligibleData) {
      return NextResponse.json(
        { error: 'This X handle is not eligible' },
        { status: 403 }
      );
    }

    // Check if already claimed
    const { data: existingClaim } = await supabase
      .from('og_nft_claims')
      .select('id')
      .ilike('twitter_handle', normalizedHandle)
      .single();

    if (existingClaim) {
      return NextResponse.json(
        { error: 'This X handle has already claimed an NFT' },
        { status: 409 }
      );
    }

    // Record the claim
    const { data, error } = await supabase
      .from('og_nft_claims')
      .insert([
        {
          twitter_handle: normalizedHandle,
          twitter_user_id,
          wallet_address: wallet_address.toLowerCase(),
          token_id,
          transaction_hash,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      // Handle duplicate entry
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Claim already recorded' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to record claim' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Claim recorded successfully',
        claim: data 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error recording claim:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

