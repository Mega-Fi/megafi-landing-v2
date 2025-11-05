// NFT Contract Configuration - The 95 Pass
// ERC-721 NFT Contract with Whitelist functionality

import contractAbi from '../The95Pass.abi.json';

export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

// Import the full ABI from The95Pass.abi.json
export const NFT_CONTRACT_ABI = contractAbi as const;

// Key Functions Available:
// - mint(): Mint NFT to msg.sender (whitelisted addresses only, one per wallet)
// - isWhitelisted(address): Check if address is whitelisted
// - hasMinted(address): Check if address has already minted
// - getCurrentTokenId(): Get current token ID counter
// - balanceOf(address): Get NFT balance of address

// Contract Features:
// ✅ Whitelist-based minting
// ✅ One NFT per wallet (enforced by hasMinted mapping)
// ✅ No parameters needed for mint() - mints to msg.sender
// ✅ Owner can manage whitelist (addToWhitelist, removeFromWhitelist)
// ✅ Metadata URI support with custom URI option
