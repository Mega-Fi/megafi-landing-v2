import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { mainnet, arbitrum, arbitrumSepolia } from "viem/chains";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "@/lib/contract-abi";

export async function GET() {
  // Determine network from environment variable
  // Options: 'testnet' | 'mainnet' | 'arbitrum'
  const network = process.env.NEXT_PUBLIC_NETWORK || "testnet";
  
  // Get RPC URL from environment or use default public RPCs
  let rpcUrl: string | undefined;
  
  if (network === "mainnet") {
    rpcUrl = process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 
             process.env.NEXT_PUBLIC_RPC_URL ||
             "https://eth.llamarpc.com"; // Public fallback
  } else if (network === "arbitrum") {
    rpcUrl = process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 
             process.env.NEXT_PUBLIC_RPC_URL ||
             "https://arb1.arbitrum.io/rpc"; // Public Arbitrum RPC
  } else {
    // testnet (Arbitrum Sepolia)
    rpcUrl = process.env.NEXT_PUBLIC_TESTNET_RPC_URL || 
             process.env.NEXT_PUBLIC_RPC_URL ||
             "https://sepolia-rollup.arbitrum.io/rpc"; // Public testnet RPC
  }

  try {
    const selectedChain = 
      network === "mainnet" ? mainnet :
      network === "arbitrum" ? arbitrum :
      arbitrumSepolia; // default to testnet

    // Create public client to read from contract
    const publicClient = createPublicClient({
      chain: selectedChain,
      transport: http(rpcUrl),
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
    console.error("Network:", network);
    console.error("Contract Address:", NFT_CONTRACT_ADDRESS);
    console.error("RPC URL:", rpcUrl);

    // Fallback: return default values if contract call fails
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch latest token ID from contract",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
        latestTokenId: 0,
        nextTokenId: 1,
      },
      { status: 500 }
    );
  }
}
