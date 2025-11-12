"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, arbitrumSepolia } from "wagmi/chains";

// Determine which network to use based on environment variable
// Options: 'testnet' | 'arbitrum' | 'base'
const network = process.env.NEXT_PUBLIC_NETWORK || "testnet";

// Debug logging (will be removed in production builds)
if (typeof window !== "undefined") {
  console.log(
    "[Network Config] NEXT_PUBLIC_NETWORK:",
    process.env.NEXT_PUBLIC_NETWORK
  );
  console.log("[Network Config] Resolved network:", network);
}

const selectedChain =
  network === "arbitrum"
    ? arbitrum
    : network === "base"
    ? base
    : arbitrumSepolia; // default to testnet

if (typeof window !== "undefined") {
  console.log(
    "[Network Config] Selected chain:",
    selectedChain.name,
    "Chain ID:",
    selectedChain.id
  );
}

export const config = getDefaultConfig({
  appName: "MegaFi - MegaETH OG NFT",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [selectedChain],
  ssr: true, // Enable server-side rendering support
});

// Export the current network info for use in components
export const currentNetwork = {
  name: selectedChain.name,
  chainId: selectedChain.id,
  isTestnet: network === "testnet",
  explorerUrl:
    selectedChain.blockExplorers?.default.url || "https://etherscan.io",
  network: network, // 'testnet' | 'arbitrum' | 'base'
};
