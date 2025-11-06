import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { mainnet, arbitrum, arbitrumSepolia } from "viem/chains";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "@/lib/contract-abi";

export async function GET() {
  try {
    // Determine network from environment variable
    // Options: 'testnet' | 'mainnet' | 'arbitrum'
    const network = process.env.NEXT_PUBLIC_NETWORK || "testnet";
    const selectedChain = 
      network === "mainnet" ? mainnet :
      network === "arbitrum" ? arbitrum :
      arbitrumSepolia; // default to testnet

    // Create public client to read from contract
    const publicClient = createPublicClient({
      chain: selectedChain,
      transport: http(),
    });

    // Call getCurrentTokenId() on the contract
    // This returns the NEXT token ID that will be minted
    const currentTokenId = await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: NFT_CONTRACT_ABI,
      functionName: "getCurrentTokenId",
      args: [], // Empty args array required by viem
    });

    // Convert BigInt to number
    const nextTokenId = Number(currentTokenId);
    // Latest minted token ID is one less than the current counter
    // (since counter increments after minting)
    const latestTokenId = nextTokenId > 1 ? nextTokenId - 1 : 0;

    return NextResponse.json({
      success: true,
      latestTokenId,
      nextTokenId,
    });
  } catch (error: any) {
    console.error("Error fetching latest token ID from contract:", error);

    // Fallback: return default values if contract call fails
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch latest token ID from contract",
        latestTokenId: 0,
        nextTokenId: 1,
      },
      { status: 500 }
    );
  }
}
