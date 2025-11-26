import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { isAddress } from "viem";
import { isRateLimited } from "@/lib/rate-limit";

// Server-side Supabase client for auth verification
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Verify user is authenticated and matches the Twitter handle
 */
async function verifyAuthAndTwitter(
  request: Request,
  twitterUserId: string
): Promise<{ authenticated: boolean; error?: string }> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return { authenticated: false, error: "Authentication required" };
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error,
    } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      return { authenticated: false, error: "Invalid or expired token" };
    }

    // Verify the Twitter user ID matches the authenticated user
    if (user.id !== twitterUserId) {
      return { authenticated: false, error: "Twitter account mismatch" };
    }

    return { authenticated: true };
  } catch (error) {
    return { authenticated: false, error: "Authentication failed" };
  }
}

/**
 * Validate Ethereum address format
 */
function validateEthereumAddress(address: string): boolean {
  try {
    return isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Validate transaction hash format
 */
function validateTransactionHash(hash: string): boolean {
  try {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // SECURITY: Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    if (
      isRateLimited(`record-claim-og-nft:${clientIp}`, {
        windowMs: 60000,
        maxRequests: 3,
      })
    ) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      twitter_handle,
      twitter_user_id,
      wallet_address,
      token_id,
      transaction_hash,
    } = body;

    console.log("[record-claim-og-nft] Request received:", {
      twitter_handle,
      twitter_user_id,
      wallet_address,
      token_id,
      transaction_hash,
      hasAuthHeader: !!request.headers.get("authorization"),
    });

    // Validate required fields
    if (!twitter_handle || !twitter_user_id || !wallet_address) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: twitter_handle, twitter_user_id, wallet_address",
        },
        { status: 400 }
      );
    }

    // SECURITY: Transaction hash is required for recording a claim
    if (!transaction_hash) {
      return NextResponse.json(
        {
          error: "Transaction hash is required to record a claim",
        },
        { status: 400 }
      );
    }

    // SECURITY: Verify user is authenticated and matches Twitter account
    const auth = await verifyAuthAndTwitter(request, twitter_user_id);
    if (!auth.authenticated) {
      console.error("[record-claim-og-nft] Auth failed:", {
        error: auth.error,
        twitter_user_id,
        twitter_handle,
      });
      return NextResponse.json(
        { error: auth.error || "Authentication required" },
        { status: 401 }
      );
    }

    // SECURITY: Validate wallet address format
    if (!validateEthereumAddress(wallet_address)) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    // SECURITY: Validate transaction hash format (required)
    if (!validateTransactionHash(transaction_hash)) {
      return NextResponse.json(
        { error: "Invalid transaction hash format" },
        { status: 400 }
      );
    }

    // SECURITY: Validate and sanitize Twitter handle
    // Twitter handles: 1-15 chars, alphanumeric and underscore only
    const handleRegex = /^[a-zA-Z0-9_]{1,15}$/;
    const normalizedHandle = twitter_handle
      .replace("@", "")
      .toLowerCase()
      .trim();

    if (!handleRegex.test(normalizedHandle)) {
      return NextResponse.json(
        { error: "Invalid Twitter handle format" },
        { status: 400 }
      );
    }

    // Check if handle is eligible (use OG NFT eligible handles table)
    const { data: eligibleData, error: eligibleError } = await supabase
      .from("megafi_og_eligible_handles")
      .select("twitter_handle")
      .ilike("twitter_handle", normalizedHandle)
      .single();

    if (eligibleError || !eligibleData) {
      console.error("[record-claim-og-nft] Handle not eligible:", {
        normalizedHandle,
        eligibleError: eligibleError?.message,
        eligibleErrorCode: eligibleError?.code,
      });
      return NextResponse.json(
        { error: "This X handle is not eligible" },
        { status: 403 }
      );
    }

    // Check if already claimed (has token_id) - USE MEGAFI_OG_CLAIMS TABLE
    const { data: existingClaim } = await supabase
      .from("megafi_og_claims")
      .select("id, wallet_address, token_id")
      .ilike("twitter_handle", normalizedHandle)
      .single();

    if (existingClaim?.token_id) {
      return NextResponse.json(
        { error: "This X handle has already claimed an NFT" },
        { status: 409 }
      );
    }

    // Verify wallet address matches (if record exists from whitelisting)
    if (existingClaim) {
      const savedWallet = existingClaim.wallet_address?.toLowerCase();
      const mintingWallet = wallet_address.toLowerCase();

      if (savedWallet !== mintingWallet) {
        console.error("[record-claim-og-nft] Wallet mismatch:", {
          normalizedHandle,
          savedWallet,
          mintingWallet,
        });
        return NextResponse.json(
          {
            error:
              "Wallet address mismatch. Please mint with the wallet you whitelisted.",
          },
          { status: 403 }
        );
      }

      // Update existing record with token_id, transaction_hash, and status
      // Note: status field may not exist in all database schemas
      const updateData: Record<string, any> = {
        token_id,
        transaction_hash,
        claimed_at: new Date().toISOString(),
      };

      // Only include status if we're updating (it may not exist in schema)
      // Supabase will ignore unknown columns, but to be safe we'll try without first
      const { data, error } = await supabase
        .from("megafi_og_claims")
        .update(updateData)
        .eq("twitter_handle", normalizedHandle)
        .select()
        .maybeSingle();

      // If update failed and it might be due to status column, try without it
      if (error && error.code === "42703") {
        // Column doesn't exist error - retry without status
        const { data: retryData, error: retryError } = await supabase
          .from("megafi_og_claims")
          .update({
            token_id,
            transaction_hash,
            claimed_at: new Date().toISOString(),
          })
          .eq("twitter_handle", normalizedHandle)
          .select()
          .maybeSingle();

        if (retryError) {
          throw retryError;
        }
        return NextResponse.json(
          {
            success: true,
            message: "Claim updated successfully",
            claim: retryData,
          },
          { status: 200 }
        );
      }

      if (error) {
        console.error("Supabase update error:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          normalizedHandle,
          token_id,
          transaction_hash,
        });
        return NextResponse.json(
          {
            error: "Failed to update claim record",
            details:
              process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
          },
          { status: 500 }
        );
      }

      // Handle case where no rows were updated (shouldn't happen, but handle gracefully)
      if (!data) {
        console.error("No rows updated for handle:", normalizedHandle);
        return NextResponse.json(
          { error: "No claim record found to update" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Claim updated successfully",
          claim: data,
        },
        { status: 200 }
      );
    }

    // Record new claim (shouldn't happen if whitelisting worked correctly, but handle it)
    const { data, error } = await supabase
      .from("megafi_og_claims")
      .insert([
        {
          twitter_handle: normalizedHandle,
          twitter_user_id,
          wallet_address: wallet_address.toLowerCase(),
          token_id,
          transaction_hash,
          // Don't set status - it's managed by whitelist flow and has check constraints
          claimed_at: new Date().toISOString(), // Set claimed_at timestamp
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);

      // Handle duplicate entry
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Claim already recorded" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Failed to record claim" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Claim recorded successfully",
        claim: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error recording claim:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
