// NFT Contract Configuration
// This file will contain the contract address and ABI for the MegaETH OG NFT
// USER ACTION REQUIRED: Replace these values with your actual contract details

export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

// Placeholder ABI - USER MUST REPLACE WITH ACTUAL CONTRACT ABI
// The ABI should include at least the mint function signature
export const NFT_CONTRACT_ABI = [
  // Example mint function - replace with your actual ABI
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
  },
  // Add other functions from your contract ABI here
] as const;

// Example of what a complete ERC-721 mint function might look like:
// If your contract has a different mint signature, update accordingly
// Common variations:
// - mint(address to)
// - mint(address to, uint256 tokenId)
// - safeMint(address to)
// - publicMint()
// - claim(bytes32[] proof) // for merkle tree verification

