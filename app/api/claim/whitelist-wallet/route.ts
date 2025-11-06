import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAddress, getAddress, createPublicClient, http } from "viem";
import { mainnet, arbitrum, arbitrumSepolia } from "viem/chains";
import { supabase } from "@/lib/supabase";
import { isRateLimited } from "@/lib/rate-limit";
import {
  verifyWalletSignature,
  isSignatureTimestampValid,
} from "@/lib/signature-verification";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "@/lib/contract-abi";

// Server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Verify user is authenticated via Supabase session
 */
async function verifyAuth(
  request: Request
): Promise<{ authenticated: boolean; userId?: string; error?: string }> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return { authenticated: false, error: "No authorization header" };
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.replace("Bearer ", "");

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return { authenticated: false, error: "Invalid or expired token" };
    }

    return { authenticated: true, userId: user.id };
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
 * API Route to whitelist a wallet address on the smart contract
 * This proxies the request to the whitelist-server running on port 3001
 */
export async function POST(request: Request) {
  try {
    // SECURITY: Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    if (
      isRateLimited(`whitelist:${clientIp}`, {
        windowMs: 60000,
        maxRequests: 5,
      })
    ) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // SECURITY: Verify user is authenticated
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { wallet_address, signature, message } = body;

    // Validate wallet address exists
    if (!wallet_address) {
      return NextResponse.json(
        { success: false, error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // SECURITY: Validate Ethereum address format
    if (!validateEthereumAddress(wallet_address)) {
      return NextResponse.json(
        { success: false, error: "Invalid Ethereum address format" },
        { status: 400 }
      );
    }

    // Normalize address (checksum)
    const normalizedAddress = getAddress(wallet_address);

    // SECURITY: Verify wallet ownership with signature (REQUIRED)
    if (!signature || !message) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Wallet signature required. Please sign the message with your wallet.",
        },
        { status: 400 }
      );
    }

    // Verify timestamp is recent (prevents replay attacks)
    if (!isSignatureTimestampValid(message)) {
      return NextResponse.json(
        { success: false, error: "Signature expired. Please sign again." },
        { status: 400 }
      );
    }

    // Verify signature matches address
    const isValidSignature = await verifyWalletSignature(
      normalizedAddress,
      message,
      signature
    );

    if (!isValidSignature) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid wallet signature. Please sign with the correct wallet.",
        },
        { status: 403 }
      );
    }

    // SECURITY: Verify user's Twitter handle is eligible before whitelisting
    // Get user's Twitter handle from auth session
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(
      request.headers.get("authorization")?.replace("Bearer ", "") || ""
    );

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Failed to get user info" },
        { status: 401 }
      );
    }

    const twitterHandle =
      user.user_metadata?.user_name ||
      user.user_metadata?.preferred_username ||
      user.user_metadata?.name;

    if (!twitterHandle) {
      return NextResponse.json(
        { success: false, error: "Twitter handle not found in user profile" },
        { status: 400 }
      );
    }

    // Normalize handle
    const normalizedHandle = twitterHandle
      .replace("@", "")
      .toLowerCase()
      .trim();

    // Check if handle is eligible
    const { data: eligibleData, error: eligibleError } = await supabaseAdmin
      .from("og_eligible_handles")
      .select("twitter_handle")
      .ilike("twitter_handle", normalizedHandle)
      .single();

    if (eligibleError || !eligibleData) {
      return NextResponse.json(
        {
          success: false,
          error: "Your Twitter account is not eligible for whitelisting",
        },
        { status: 403 }
      );
    }

    // SECURITY: Check if wallet has already minted on-chain
    try {
      const network = process.env.NEXT_PUBLIC_NETWORK || "testnet";
      const selectedChain =
        network === "mainnet"
          ? mainnet
          : network === "arbitrum"
          ? arbitrum
          : arbitrumSepolia; // default to testnet

      // Get RPC URL from environment or use default public RPCs
      let rpcUrl: string | undefined;

      if (network === "mainnet") {
        rpcUrl =
          process.env.NEXT_PUBLIC_MAINNET_RPC_URL ||
          process.env.NEXT_PUBLIC_RPC_URL ||
          "https://eth.llamarpc.com"; // Public fallback
      } else if (network === "arbitrum") {
        rpcUrl =
          process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
          process.env.NEXT_PUBLIC_RPC_URL ||
          "https://arb1.arbitrum.io/rpc"; // Public Arbitrum RPC
      } else {
        // testnet (Arbitrum Sepolia)
        rpcUrl =
          process.env.NEXT_PUBLIC_TESTNET_RPC_URL ||
          process.env.NEXT_PUBLIC_RPC_URL ||
          "https://sepolia-rollup.arbitrum.io/rpc"; // Public testnet RPC
      }

      const publicClient = createPublicClient({
        chain: selectedChain,
        transport: http(rpcUrl),
      });

      const hasMintedResult = await publicClient.readContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_CONTRACT_ABI,
        functionName: "hasMinted",
        args: [normalizedAddress as `0x${string}`],
      });

      if (hasMintedResult) {
        return NextResponse.json(
          {
            success: false,
            error:
              "This wallet has already minted an NFT. Each wallet can only mint once.",
          },
          { status: 409 }
        );
      }
    } catch (contractError) {
      // If contract check fails, log but don't block (could be network issue)
      console.error("Error checking hasMinted from contract:", contractError);
      // Continue with whitelisting - the contract will reject if hasMinted is true
    }

    // Check if already claimed (has token_id)
    const { data: existingClaim } = await supabaseAdmin
      .from("og_nft_claims")
      .select("id, wallet_address, token_id")
      .ilike("twitter_handle", normalizedHandle)
      .single();

    if (existingClaim?.token_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Your Twitter account has already claimed an NFT",
        },
        { status: 409 }
      );
    }

    // Check if wallet address is already saved for this Twitter handle
    if (existingClaim) {
      const savedWallet = existingClaim.wallet_address?.toLowerCase();
      const requestedWallet = normalizedAddress.toLowerCase();

      // If trying to use a different wallet, reject to prevent multiple whitelisting transactions
      if (savedWallet !== requestedWallet) {
        return NextResponse.json(
          {
            success: false,
            error:
              "You have already whitelisted a different wallet address. Please use the same wallet you whitelisted previously.",
          },
          { status: 409 }
        );
      }

      // Same wallet - check if already whitelisted on-chain
      const whitelistServerUrl =
        process.env.WHITELIST_SERVER_URL ||
        process.env.NEXT_PUBLIC_WHITELIST_SERVER_URL ||
        (process.env.NODE_ENV === "production"
          ? null
          : "http://localhost:3001");

      if (whitelistServerUrl) {
        const apiKey = process.env.WHITELIST_API_KEY || process.env.API_KEY;
        const statusResponse = await fetch(
          `${whitelistServerUrl}/api/status/${normalizedAddress}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(apiKey && { "X-API-Key": apiKey }),
            },
            signal: AbortSignal.timeout(10000),
          }
        );

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          if (statusData.whitelisted) {
            // Already whitelisted on-chain - ensure database is up to date
            // Get Twitter user ID from auth
            const {
              data: { user: authUser },
            } = await supabaseAdmin.auth.getUser(
              request.headers.get("authorization")?.replace("Bearer ", "") || ""
            );

            const twitterUserId = authUser?.id || "";

            // Update database to ensure wallet address is saved (may already exist)
            // Check if we already have whitelist_tx_hash - if yes, keep status as whitelisted
            const { data: existingRecord } = await supabaseAdmin
              .from("og_nft_claims")
              .select("whitelist_tx_hash, status, whitelisted_at")
              .ilike("twitter_handle", normalizedHandle)
              .single();

            const updateData: {
              twitter_handle: string;
              twitter_user_id: string;
              wallet_address: string;
              status?: string;
              whitelisted_at?: string;
            } = {
              twitter_handle: normalizedHandle,
              twitter_user_id: twitterUserId,
              wallet_address: normalizedAddress.toLowerCase(),
            };

            // If already whitelisted, preserve that status
            if (existingRecord?.whitelist_tx_hash) {
              updateData.status = "whitelisted";
              // Preserve existing whitelisted_at if it exists
              if (existingRecord.whitelisted_at) {
                // Don't overwrite existing timestamp
              } else {
                // Set timestamp if missing
                updateData.whitelisted_at = new Date().toISOString();
              }
            } else {
              // Not whitelisted yet, keep as pending
              updateData.status = "pending_whitelist";
            }

            await supabaseAdmin.from("og_nft_claims").upsert(updateData, {
              onConflict: "twitter_handle",
              ignoreDuplicates: false,
            });

            // Already whitelisted on-chain, return success
            return NextResponse.json(
              {
                success: true,
                alreadyWhitelisted: true,
                address: normalizedAddress,
                message: "Wallet is already whitelisted",
              },
              { status: 200 }
            );
          }
        }
      }
    }

    // Get whitelist server URL from environment
    // SECURITY: Require env var in production, fail if missing
    const whitelistServerUrl =
      process.env.WHITELIST_SERVER_URL ||
      process.env.NEXT_PUBLIC_WHITELIST_SERVER_URL ||
      (process.env.NODE_ENV === "production" ? null : "http://localhost:3001");

    if (!whitelistServerUrl) {
      console.error("[Whitelist API] WHITELIST_SERVER_URL not configured");
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error",
        },
        { status: 500 }
      );
    }

    // SECURITY: Get API key for whitelist-server authentication
    const apiKey = process.env.WHITELIST_API_KEY || process.env.API_KEY;

    // Call the whitelist-server with API key authentication
    const response = await fetch(`${whitelistServerUrl}/api/whitelist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey && { "X-API-Key": apiKey }), // Add API key if configured
      },
      body: JSON.stringify({ address: normalizedAddress }),
      // SECURITY: Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    const data = await response.json();

    if (!response.ok) {
      // Save error status to database
      const {
        data: { user: authUser },
      } = await supabaseAdmin.auth.getUser(
        request.headers.get("authorization")?.replace("Bearer ", "") || ""
      );

      const twitterUserId = authUser?.id || "";
      const errorMessage = data.error || "Failed to prepare wallet";

      // Update database with error status
      await supabaseAdmin.from("og_nft_claims").upsert(
        {
          twitter_handle: normalizedHandle,
          twitter_user_id: twitterUserId,
          wallet_address: normalizedAddress.toLowerCase(),
          status: "whitelist_failed",
          error_message: errorMessage,
        },
        {
          onConflict: "twitter_handle",
          ignoreDuplicates: false,
        }
      );

      // SECURITY: Don't expose internal error details
      return NextResponse.json(
        {
          success: false,
          error: "Failed to prepare wallet. Please try again.",
        },
        { status: response.status }
      );
    }

    // Save wallet address and whitelist transaction hash to database
    // Get Twitter user ID from auth
    const {
      data: { user: authUser },
    } = await supabaseAdmin.auth.getUser(
      request.headers.get("authorization")?.replace("Bearer ", "") || ""
    );

    const twitterUserId = authUser?.id || "";

    // Extract transaction hash from whitelist-server response
    const whitelistTxHash = data.transactionHash || null;

    // Prepare upsert data
    const upsertData: {
      twitter_handle: string;
      twitter_user_id: string;
      wallet_address: string;
      whitelist_tx_hash?: string | null;
      status?: string;
      whitelisted_at?: string | null;
    } = {
      twitter_handle: normalizedHandle,
      twitter_user_id: twitterUserId,
      wallet_address: normalizedAddress.toLowerCase(),
    };

    // If whitelisting transaction succeeded, update status and timestamps
    if (whitelistTxHash) {
      upsertData.whitelist_tx_hash = whitelistTxHash;
      upsertData.status = "whitelisted";
      upsertData.whitelisted_at = new Date().toISOString();
    } else {
      // If no transaction hash (shouldn't happen on success, but handle it)
      // Keep status as pending_whitelist
      upsertData.status = "pending_whitelist";
    }

    // Upsert: Update if exists, insert if new
    const { error: dbError } = await supabaseAdmin
      .from("og_nft_claims")
      .upsert(upsertData, {
        onConflict: "twitter_handle",
        ignoreDuplicates: false,
      });

    if (dbError) {
      console.error("[Whitelist API] Database error:", dbError);
      // Don't fail the request if DB save fails - on-chain whitelisting succeeded
      // But log it for monitoring
    } else if (whitelistTxHash) {
      console.log(
        `[Whitelist API] ✅ Whitelisted ${normalizedHandle}: tx=${whitelistTxHash}, status=whitelisted, whitelisted_at=${upsertData.whitelisted_at}`
      );
    } else {
      console.log(
        `[Whitelist API] ⚠️  Whitelisting succeeded but no transaction hash returned for ${normalizedHandle}`
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("[Whitelist API] Error:", error);
    // SECURITY: Generic error message
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check whitelist status
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet_address = searchParams.get("address");

    if (!wallet_address) {
      return NextResponse.json(
        {
          success: false,
          error: "Wallet address is required",
          whitelisted: false,
        },
        { status: 400 }
      );
    }

    // SECURITY: Validate Ethereum address format
    if (!validateEthereumAddress(wallet_address)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Ethereum address format",
          whitelisted: false,
        },
        { status: 400 }
      );
    }

    const whitelistServerUrl =
      process.env.WHITELIST_SERVER_URL ||
      process.env.NEXT_PUBLIC_WHITELIST_SERVER_URL ||
      (process.env.NODE_ENV === "production" ? null : "http://localhost:3001");

    if (!whitelistServerUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error",
          whitelisted: false,
        },
        { status: 500 }
      );
    }

    const apiKey = process.env.WHITELIST_API_KEY || process.env.API_KEY;

    const response = await fetch(
      `${whitelistServerUrl}/api/status/${getAddress(wallet_address)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey && { "X-API-Key": apiKey }),
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout for GET
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // If status check fails, assume not whitelisted
      return NextResponse.json(
        { success: false, error: "Failed to check status", whitelisted: false },
        { status: 200 } // Return 200 so frontend can handle it
      );
    }

    // Ensure whitelisted property is always present
    return NextResponse.json(
      {
        success: true,
        whitelisted: data.whitelisted || false,
        ...data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Whitelist API] Status check error:", error);
    // On error, return not whitelisted so user can proceed
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred. Please try again later.",
        whitelisted: false,
      },
      { status: 200 } // Return 200 so frontend can handle it
    );
  }
}
