"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, base, arbitrumSepolia } from "wagmi/chains";

// Determine which network to use based on environment variable
// Options: 'testnet' | 'mainnet' | 'base'
const network = process.env.NEXT_PUBLIC_NETWORK || "testnet";

const selectedChain =
  network === "mainnet"
    ? mainnet
    : network === "base"
    ? base
    : arbitrumSepolia; // default to testnet

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
  network: network, // 'testnet' | 'mainnet' | 'base'
};
