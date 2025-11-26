// NFT Contract Configuration
// Supports both The 95 Pass and MegaFi OG NFT contracts

import the95PassAbi from "../The95Pass.abi.json";
import megaFiOGAbi from "../MegaFiOGNFT.abi.json";

// ====================================
// The 95 Pass NFT Contract (9.5 Pass)
// ====================================
export const THE_95_PASS_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

export const THE_95_PASS_CONTRACT_ABI = the95PassAbi as any;

// ====================================
// MegaFi OG NFT Contract
// ====================================
export const MEGAFI_OG_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_OG as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

export const MEGAFI_OG_CONTRACT_ABI = megaFiOGAbi as any;

// ====================================
// Legacy Exports (for backwards compatibility)
// ====================================
// Default to The 95 Pass for existing code that uses these
export const NFT_CONTRACT_ADDRESS = THE_95_PASS_CONTRACT_ADDRESS;
export const NFT_CONTRACT_ABI = THE_95_PASS_CONTRACT_ABI;

// ====================================
// Contract Selection Helper
// ====================================
export type ContractType = "95-pass" | "og-nft";

export function getContractConfig(type: ContractType) {
  switch (type) {
    case "95-pass":
      return {
        address: THE_95_PASS_CONTRACT_ADDRESS,
        abi: THE_95_PASS_CONTRACT_ABI,
        name: "The 95 Pass",
      };
    case "og-nft":
      return {
        address: MEGAFI_OG_CONTRACT_ADDRESS,
        abi: MEGAFI_OG_CONTRACT_ABI,
        name: "MegaFi OG NFT",
      };
    default:
      throw new Error(`Unknown contract type: ${type}`);
  }
}

// ====================================
// Key Functions Available (Both Contracts)
// ====================================
// - mint(): Mint NFT to msg.sender (whitelisted addresses only, one per wallet)
// - isWhitelisted(address): Check if address is whitelisted
// - hasMinted(address): Check if address has already minted
// - getCurrentTokenId(): Get current token ID counter
// - balanceOf(address): Get NFT balance of address
// - tokenURI(tokenId): Get metadata URI for a token

// ====================================
// Contract Features (Both Contracts)
// ====================================
// ✅ Whitelist-based minting
// ✅ One NFT per wallet (enforced by hasMinted mapping)
// ✅ No parameters needed for mint() - mints to msg.sender
// ✅ Owner can manage whitelist (addToWhitelist, removeFromWhitelist)
// ✅ Metadata URI support with custom URI option

// ====================================
// Usage Examples
// ====================================
/*
// For 95 Pass NFT:
import { THE_95_PASS_CONTRACT_ADDRESS, THE_95_PASS_CONTRACT_ABI } from '@/lib/contract-abi';
const contract = getContract({
  address: THE_95_PASS_CONTRACT_ADDRESS,
  abi: THE_95_PASS_CONTRACT_ABI,
});

// For OG NFT:
import { MEGAFI_OG_CONTRACT_ADDRESS, MEGAFI_OG_CONTRACT_ABI } from '@/lib/contract-abi';
const contract = getContract({
  address: MEGAFI_OG_CONTRACT_ADDRESS,
  abi: MEGAFI_OG_CONTRACT_ABI,
});

// Or using the helper:
import { getContractConfig } from '@/lib/contract-abi';
const config = getContractConfig('og-nft');
const contract = getContract({
  address: config.address,
  abi: config.abi,
});
*/
