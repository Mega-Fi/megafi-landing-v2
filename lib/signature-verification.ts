/**
 * Wallet Signature Verification
 *
 * Verifies that a user owns a wallet address by checking their signature.
 * This prevents users from submitting arbitrary wallet addresses.
 */

import { verifyMessage } from "viem";

/**
 * Generate a message for the user to sign
 * Include timestamp to prevent replay attacks
 */
export function generateSignatureMessage(address: string): string {
  const timestamp = Date.now();
  return `I am the owner of wallet address: ${address}\n\nTimestamp: ${timestamp}\n\nThis signature proves I own this wallet for MegaETH OG NFT claim.`;
}

/**
 * Verify that a signature is valid for a given address and message
 */
export async function verifyWalletSignature(
  address: string,
  message: string,
  signature: string
): Promise<boolean> {
  try {
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    return isValid;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

/**
 * Check if a signature timestamp is recent (within 5 minutes)
 * Prevents replay attacks with old signatures
 */
export function isSignatureTimestampValid(message: string): boolean {
  try {
    const timestampMatch = message.match(/Timestamp: (\d+)/);
    if (!timestampMatch) return false;

    const timestamp = parseInt(timestampMatch[1]);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return now - timestamp < fiveMinutes;
  } catch {
    return false;
  }
}
