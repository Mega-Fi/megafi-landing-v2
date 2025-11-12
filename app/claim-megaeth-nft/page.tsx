"use client";

import { useState, useEffect, useRef } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSignMessage,
  usePublicClient,
  useDisconnect,
} from "wagmi";
import { decodeEventLog } from "viem";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "@/lib/contract-abi";
import { currentNetwork } from "@/lib/wagmi-config";
import { createSupabaseClient } from "@/lib/supabase";
import Image from "next/image";
import {
  Check,
  X,
  Loader2,
  ExternalLink,
  Wallet,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { GridBackground } from "@/components/ui/grid-background";
import { ElectricCard } from "@/components/ui/electric-card";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { EligibilityCard } from "@/components/ui/eligibility-card";
import { WalletReadyCard } from "@/components/ui/wallet-ready-card";
import { WalletPrepareCard } from "@/components/ui/wallet-prepare-card";
import { analytics, MIXPANEL_EVENTS } from "@/lib/mixpanel";
import { toast, Toaster } from "sonner";
import { generateSignatureMessage } from "@/lib/signature-verification";

// X (Twitter) Logo Component
const XLogo = ({
  size = 20,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 1200 1227"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
      fill="currentColor"
    />
  </svg>
);

// Favicon Icon Component
const FaviconIcon = ({ size = 20 }: { size?: number }) => (
  <img
    src="/favicon.png"
    alt="MegaFi"
    width={size}
    height={size}
    style={{ objectFit: "contain" }}
  />
);

type Step = "start" | "twitter" | "eligibility" | "wallet" | "mint" | "success";

export default function ClaimOGNFT() {
  const supabase = createSupabaseClient();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const publicClient = usePublicClient();
  const { disconnect } = useDisconnect();

  const [user, setUser] = useState<User | null>(null);
  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<Step>("start");
  const [eligibility, setEligibility] = useState<{
    eligible: boolean;
    message?: string;
    reason?: string;
    token_id?: string;
    claimed_at?: string;
  } | null>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [claimRecordFailed, setClaimRecordFailed] = useState(false);
  const [lastMintHash, setLastMintHash] = useState<`0x${string}` | null>(null);
  const [lastTokenId, setLastTokenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null);
  const [isWhitelisting, setIsWhitelisting] = useState(false);
  const [nextTokenId, setNextTokenId] = useState<number>(1);
  const [isLoadingTokenId, setIsLoadingTokenId] = useState(true);
  const [isRecordingClaim, setIsRecordingClaim] = useState(false);
  const [hasMinted, setHasMinted] = useState<boolean | null>(null);
  const [isCheckingHasMinted, setIsCheckingHasMinted] = useState(false);
  // Removed whitelistTxHash - we don't want to show backend transaction details

  const {
    data: hash,
    writeContract,
    isPending: isMintPending,
    isError: isMintError,
    error: mintError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Track page view on mount
  useEffect(() => {
    analytics.track(MIXPANEL_EVENTS.PAGE_VIEW_NFT_CLAIM);
  }, []);

  // Function to fetch latest token ID
  const fetchLatestTokenId = async () => {
    setIsLoadingTokenId(true);
    try {
      const response = await fetch("/api/claim/latest-token");
      const data = await response.json();
      if (data.success && data.nextTokenId) {
        setNextTokenId(data.nextTokenId);
      }
    } catch (err) {
      console.error("Error fetching latest token ID:", err);
      // Keep default value of 1
    } finally {
      setIsLoadingTokenId(false);
    }
  };

  // Fetch latest token ID on mount
  useEffect(() => {
    fetchLatestTokenId();
  }, []);

  // Check auth status on mount and handle OAuth callback
  useEffect(() => {
    const checkUser = async () => {
      try {
        // First, check if we're coming back from OAuth
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError("Authentication error. Please try again.");
          analytics.track(MIXPANEL_EVENTS.TWITTER_AUTH_FAILED, {
            error: sessionError.message,
            error_code: sessionError.code,
          });
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          // Extract Twitter handle from user metadata
          const handle =
            session.user.user_metadata?.user_name ||
            session.user.user_metadata?.preferred_username ||
            session.user.user_metadata?.name;
          setTwitterHandle(handle);
          // Skip start step if already authenticated
          setCurrentStep("twitter");
          console.log("User authenticated:", {
            handle,
            metadata: session.user.user_metadata,
          });

          // Track successful auth
          analytics.track(MIXPANEL_EVENTS.TWITTER_AUTH_SUCCESS, {
            twitter_handle: handle,
          });
          analytics.identify(session.user.id, {
            twitter_handle: handle,
            twitter_id: session.user.id,
          });
        }
      } catch (err) {
        console.error("Error checking user:", err);
        setError("Failed to check authentication status");
        analytics.track(MIXPANEL_EVENTS.TWITTER_AUTH_FAILED, {
          error: String(err),
        });
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.user_metadata);

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        const handle =
          session.user.user_metadata?.user_name ||
          session.user.user_metadata?.preferred_username ||
          session.user.user_metadata?.name;
        setTwitterHandle(handle);
        setCurrentStep("twitter");

        // Track auth success
        analytics.track(MIXPANEL_EVENTS.TWITTER_AUTH_SUCCESS, {
          twitter_handle: handle,
        });
        analytics.identify(session.user.id, {
          twitter_handle: handle,
          twitter_id: session.user.id,
        });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setTwitterHandle(null);
        setCurrentStep("start");
        analytics.reset();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-check eligibility when Twitter is connected
  useEffect(() => {
    if (twitterHandle && currentStep === "twitter") {
      checkEligibility(twitterHandle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twitterHandle, currentStep]);

  // If user returns and has already claimed, skip directly to success
  useEffect(() => {
    if (
      eligibility?.reason === "already_claimed" &&
      eligibility?.token_id &&
      currentStep !== "success"
    ) {
      // User has already claimed - go directly to success screen
      setCurrentStep("success");
      setMintedTokenId(eligibility.token_id);
    }
  }, [eligibility, currentStep]);

  // If user is already on success screen and has claimed, keep them there
  // This prevents them from going back through the flow
  useEffect(() => {
    if (
      currentStep === "success" &&
      mintedTokenId &&
      eligibility?.reason === "already_claimed"
    ) {
      // User has already claimed - ensure they stay on success screen
      // Don't allow navigation back to previous steps
    }
  }, [currentStep, mintedTokenId, eligibility]);

  // Auto-advance to wallet step when eligible
  useEffect(() => {
    if (eligibility?.eligible && currentStep === "eligibility") {
      setCurrentStep("wallet");
    }
  }, [eligibility, currentStep]);

  // Check if wallet has already minted
  const checkHasMinted = async (walletAddress: string) => {
    if (!publicClient || !walletAddress) return false;

    setIsCheckingHasMinted(true);
    try {
      const result = await publicClient.readContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_CONTRACT_ABI,
        functionName: "hasMinted",
        args: [walletAddress as `0x${string}`],
      });

      setHasMinted(result as boolean);
      return result as boolean;
    } catch (err) {
      console.error("Error checking hasMinted:", err);
      setHasMinted(false); // Default to false on error
      return false;
    } finally {
      setIsCheckingHasMinted(false);
    }
  };

  // Track wallet connection and auto-whitelist
  // Use ref to prevent infinite loops when checking eligibility
  const hasCheckedEligibilityForWallet = useRef<string | null>(null);

  useEffect(() => {
    if (
      isConnected &&
      address &&
      currentStep === "wallet" &&
      eligibility?.eligible &&
      twitterHandle
    ) {
      // Prevent duplicate checks for the same wallet address
      if (hasCheckedEligibilityForWallet.current === address) {
        return;
      }

      hasCheckedEligibilityForWallet.current = address;

      analytics.track(MIXPANEL_EVENTS.WALLET_CONNECT_SUCCESS, {
        wallet_address: address,
        twitter_handle: twitterHandle,
        network: currentNetwork.name,
      });
      analytics.setUserProperties({
        wallet_address: address,
        network: currentNetwork.name,
      });

      // SECURITY: Re-check eligibility to ensure Twitter handle hasn't already claimed
      // This prevents users from claiming again with a different wallet
      const recheckEligibility = async () => {
        try {
          const response = await fetch(
            `/api/claim/check-eligibility?twitter_handle=${encodeURIComponent(
              twitterHandle
            )}`
          );
          const data = await response.json();

          // If Twitter handle has already claimed, show error and prevent proceeding
          if (data.reason === "already_claimed") {
            setEligibility(data);
            setCurrentStep("success");
            setMintedTokenId(data.token_id || null);
            setError(null);
            return false; // Prevent further checks
          }

          // Don't update eligibility state here to prevent infinite loop
          return data.eligible === true;
        } catch (err) {
          console.error("Error re-checking eligibility:", err);
          return true; // On error, allow to proceed (will be caught by other checks)
        }
      };

      recheckEligibility().then((isStillEligible) => {
        if (!isStillEligible) {
          return; // Already claimed, stop here
        }

        // After eligibility check, check if wallet has already minted
        checkHasMinted(address).then((hasMintedResult) => {
          if (hasMintedResult) {
            // Don't set error - we show a custom card instead
            setError(null);
            return;
          }
          // If eligibility is still valid and wallet hasn't minted, proceed with whitelist check
      checkWhitelistStatus(address);
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isConnected,
    address,
    currentStep,
    twitterHandle,
    eligibility?.eligible, // Only depend on the eligible flag, not the whole object
    publicClient,
  ]);

  // Track which transaction hashes we've already processed to prevent duplicate calls
  const processedHashes = useRef<Set<string>>(new Set());

  // Handle mint success - extract token ID from transaction receipt
  useEffect(() => {
    if (isConfirmed && hash && publicClient && !isRecordingClaim) {
      // Check if we've already processed this hash
      if (processedHashes.current.has(hash)) {
        console.log("Already processed hash:", hash);
        return;
      }

      // Mark this hash as being processed
      processedHashes.current.add(hash);

      const extractTokenId = async () => {
        try {
          // Get transaction receipt
          const receipt = await publicClient.getTransactionReceipt({ hash });

          // Find NFTMinted event in logs
          let tokenId: string | null = null;

          for (const log of receipt.logs) {
            try {
              // Try to decode NFTMinted event
              const decoded = decodeEventLog({
                abi: NFT_CONTRACT_ABI,
                data: log.data,
                topics: log.topics,
              }) as any; // Cast to any to avoid TypeScript unknown type error

              // Check if this is the NFTMinted event
              if (
                decoded.eventName === "NFTMinted" &&
                decoded.args &&
                typeof decoded.args === "object" &&
                "tokenId" in decoded.args
              ) {
                const args = decoded.args as {
                  tokenId: bigint | number | string;
                };
                tokenId = String(args.tokenId);
                break;
              }
            } catch (e) {
              // Not the event we're looking for, continue
              continue;
            }
          }

          // Record claim with token ID (sets isRecordingClaim flag internally)
          await recordClaim(hash, tokenId);
        } catch (err) {
          console.error("Error extracting token ID:", err);
          // Still record claim without token ID
          await recordClaim(hash, null);
        }
      };

      extractTokenId();
    }
  }, [isConfirmed, hash, publicClient, isRecordingClaim]);

  // Track mint errors and cancellations
  useEffect(() => {
    if (isMintError && mintError) {
      const errorMessage = mintError.message || String(mintError);
      const isCancelled =
        errorMessage.toLowerCase().includes("user rejected") ||
        errorMessage.toLowerCase().includes("user denied") ||
        errorMessage.toLowerCase().includes("cancelled");

      if (isCancelled) {
        // Track cancellation
        analytics.track(MIXPANEL_EVENTS.NFT_MINT_CANCELLED, {
          twitter_handle: twitterHandle,
          wallet_address: address,
          network: currentNetwork.name,
        });

        // Show toast notification for cancellation
        toast.error("Transaction Cancelled", {
          description:
            "You cancelled the minting transaction. You can try again whenever you're ready.",
          duration: 5000,
        });

        // Reset to wallet step so user can try again
        setCurrentStep("wallet");
        setError(null);
      } else {
        analytics.track(MIXPANEL_EVENTS.NFT_MINT_FAILED, {
          twitter_handle: twitterHandle,
          wallet_address: address,
          error: errorMessage,
          network: currentNetwork.name,
        });
      }
    }
  }, [isMintError, mintError, twitterHandle, address]);

  // Track when claim process actually starts (user moves past start screen)
  useEffect(() => {
    if (currentStep === "twitter" && !user) {
      analytics.track(MIXPANEL_EVENTS.NFT_CLAIM_STARTED);
    }
  }, [currentStep, user]);

  const signInWithTwitter = async () => {
    try {
      setError(null);

      // Track auth initiation
      analytics.track(MIXPANEL_EVENTS.TWITTER_AUTH_INITIATED);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "twitter",
        options: {
          redirectTo: `${window.location.origin}/claim-megaeth-nft`,
        },
      });

      if (error) {
        setError("Failed to connect with Twitter: " + error.message);
        console.error("Twitter OAuth error:", error);
        analytics.track(MIXPANEL_EVENTS.TWITTER_AUTH_FAILED, {
          error: error.message,
          error_code: error.code,
        });
      }
    } catch (err: any) {
      setError("Failed to connect with Twitter: " + err.message);
      console.error("Twitter OAuth error:", err);
      analytics.track(MIXPANEL_EVENTS.TWITTER_AUTH_FAILED, {
        error: err.message,
      });
    }
  };

  // Disconnect Twitter and reset to start
  const disconnectTwitter = async () => {
    await supabase.auth.signOut();
    setCurrentStep("start");
    setEligibility(null);
    setError(null);
    // Clear the minted token ID so card shows next available token
    setMintedTokenId(null);
    // Clear hasMinted state
    setHasMinted(null);
    // Refetch latest token ID to update the card display
    fetchLatestTokenId();
  };

  // Disconnect wallet only and go back to wallet step
  const disconnectWallet = () => {
    // Disconnect wallet if connected
    if (isConnected) {
      disconnect();
    }
    // Don't disconnect Twitter - keep it connected
    // Go back to wallet step so they can connect a different wallet
    setCurrentStep("wallet");
    setError(null);
    // Clear the minted token ID so card shows next available token
    setMintedTokenId(null);
    // Clear hasMinted state so user can try with different wallet
    setHasMinted(null);
    // Clear whitelist status
    setIsWhitelisted(null);
    // Reset the eligibility check ref so it can run again for new wallet
    hasCheckedEligibilityForWallet.current = null;
    // Refetch latest token ID to update the card display
    fetchLatestTokenId();
  };

  const checkEligibility = async (handle: string) => {
    setIsCheckingEligibility(true);
    setError(null);
    setCurrentStep("eligibility");

    // Track eligibility check start
    analytics.track(MIXPANEL_EVENTS.ELIGIBILITY_CHECK_STARTED, {
      twitter_handle: handle,
    });

    try {
      const response = await fetch(
        `/api/claim/check-eligibility?twitter_handle=${encodeURIComponent(
          handle
        )}`
      );
      const data = await response.json();

      setEligibility(data);

      if (data.eligible) {
        analytics.track(MIXPANEL_EVENTS.ELIGIBILITY_CHECK_ELIGIBLE, {
          twitter_handle: handle,
        });
      } else if (data.reason === "already_claimed") {
        // User has already claimed - show success screen
        setCurrentStep("success");
        setMintedTokenId(data.token_id || null);
        analytics.track(MIXPANEL_EVENTS.ELIGIBILITY_CHECK_NOT_ELIGIBLE, {
          twitter_handle: handle,
          reason: "already_claimed",
          token_id: data.token_id,
        });
      } else {
        analytics.track(MIXPANEL_EVENTS.ELIGIBILITY_CHECK_NOT_ELIGIBLE, {
          twitter_handle: handle,
          reason: data.reason,
        });
        setError(data.reason || "Not eligible");
      }
    } catch (err) {
      setError("Failed to check eligibility");
      setEligibility({
        eligible: false,
        reason: "Failed to check eligibility",
      });
      analytics.track(MIXPANEL_EVENTS.ELIGIBILITY_CHECK_FAILED, {
        twitter_handle: handle,
        error: String(err),
      });
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const checkWhitelistStatus = async (walletAddress: string) => {
    try {
      // Silently check whitelist status (no user-facing logs)
      const response = await fetch(
        `/api/claim/whitelist-wallet?address=${walletAddress}`
      );
      const data = await response.json();

      if (data.success && data.whitelisted) {
        setIsWhitelisted(true);
        return true;
      } else {
        // Wallet is not whitelisted - show Continue button
        setIsWhitelisted(false);
        return false;
      }
    } catch (err) {
      console.error("[Frontend] Error checking whitelist status:", err);
      // On error, assume not whitelisted so user can try to whitelist
      setIsWhitelisted(false);
      setError("Failed to check wallet status. Please try again.");
      return false;
    }
  };

  const whitelistWallet = async (walletAddress: string) => {
    setIsWhitelisting(true);
    setError(null);

    try {
      // Get auth token from Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Please connect your Twitter account first");
      }

      // SECURITY: Generate message for user to sign
      const message = generateSignatureMessage(walletAddress);

      // Request wallet signature to prove ownership
      toast.info("Please sign the message in your wallet to verify ownership");
      const signature = await signMessageAsync({ message });

      const response = await fetch("/api/claim/whitelist-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          signature,
          message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsWhitelisted(true);

        analytics.track("wallet_whitelisted", {
          wallet_address: walletAddress,
          transaction_hash: data.transactionHash || "hidden", // Backend-only, not displayed
          twitter_handle: twitterHandle,
        });
      } else {
        throw new Error(data.error || "Failed to prepare wallet");
      }
    } catch (err: any) {
      console.error("[Frontend] Wallet preparation error:", err);

      // Handle user rejection
      if (
        err.message?.includes("User rejected") ||
        err.message?.includes("denied")
      ) {
        setError("Signature rejected. Please sign the message to continue.");
      } else {
        setError("Failed to prepare wallet. Please try again.");
      }

      setIsWhitelisted(false);

      analytics.track("wallet_whitelist_failed", {
        wallet_address: walletAddress,
        error: err.message,
      });
    } finally {
      setIsWhitelisting(false);
    }
  };

  const handleMint = async () => {
    if (!address || !twitterHandle) {
      setError("Please connect both Twitter and wallet");
      return;
    }

    // SECURITY: Re-check if Twitter handle has already claimed (prevents double claiming with different wallet)
    try {
      const eligibilityResponse = await fetch(
        `/api/claim/check-eligibility?twitter_handle=${encodeURIComponent(
          twitterHandle
        )}`
      );
      const eligibilityData = await eligibilityResponse.json();

      if (eligibilityData.reason === "already_claimed") {
        // Twitter handle has already claimed - redirect to success screen
        setCurrentStep("success");
        setMintedTokenId(eligibilityData.token_id || null);
        setEligibility(eligibilityData);
        setError(null);
        return;
      }

      if (!eligibilityData.eligible) {
        setError("Your Twitter account is not eligible or has already claimed");
        return;
      }
    } catch (err) {
      console.error("Error checking eligibility before mint:", err);
      // Continue with other checks - this is a safety check
    }

    // SECURITY: Check if wallet has already minted
    const hasMintedResult = await checkHasMinted(address);
    if (hasMintedResult) {
      // Don't set error - we show a custom card instead
      setError(null);
      return;
    }

    // SECURITY: Verify wallet is whitelisted before minting
    if (isWhitelisted !== true) {
      setError(
        "Your wallet must be whitelisted before minting. Please complete the wallet preparation step."
      );
      return;
    }

    setError(null);
    setCurrentStep("mint");

    // Track mint initiation
    analytics.track(MIXPANEL_EVENTS.NFT_MINT_INITIATED, {
      twitter_handle: twitterHandle,
      wallet_address: address,
      network: currentNetwork.name,
      contract_address: NFT_CONTRACT_ADDRESS,
    });

    try {
      // Call the mint function on the contract
      // Note: The95Pass contract mint() takes no parameters - it mints to msg.sender
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_CONTRACT_ABI,
        functionName: "mint",
        args: [], // No args needed - contract mints to msg.sender
      });
    } catch (err: any) {
      setError(err.message || "Failed to mint NFT");
      console.error("Mint error:", err);
      analytics.track(MIXPANEL_EVENTS.NFT_MINT_FAILED, {
        twitter_handle: twitterHandle,
        wallet_address: address,
        error: err.message,
        error_code: err.code,
      });
    }
  };

  const recordClaim = async (
    txHash: `0x${string}`,
    tokenId: string | null = null
  ) => {
    // Set flag immediately to prevent duplicate calls
    setIsRecordingClaim(true);

    if (!user || !twitterHandle) {
      setIsRecordingClaim(false);
      return;
    }

    // Track successful mint
    analytics.track(MIXPANEL_EVENTS.NFT_MINT_SUCCESS, {
      twitter_handle: twitterHandle,
      wallet_address: address,
      transaction_hash: txHash,
      network: currentNetwork.name,
    });

    try {
      // Get auth token from Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/claim/record-claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          twitter_handle: twitterHandle,
          twitter_user_id: user.id,
          wallet_address: address,
          token_id: tokenId, // Use extracted token ID or null
          transaction_hash: txHash,
        }),
      });

      const data = await response.json();

      // Treat 409 (already recorded) as success
      if (response.ok || response.status === 409) {
        setCurrentStep("success");
        setMintedTokenId(data.claim?.token_id || tokenId || "N/A");
        setClaimRecordFailed(false);
        setLastMintHash(null);
        setLastTokenId(null);
        setIsLoadingTokenId(false); // Stop showing loading badge

        // Update next token ID for the card display
        if (tokenId) {
          const currentTokenId = parseInt(tokenId);
          setNextTokenId(currentTokenId + 1);
        }

        // Track claim recording success
        analytics.track(MIXPANEL_EVENTS.CLAIM_RECORD_SUCCESS, {
          twitter_handle: twitterHandle,
          wallet_address: address,
          transaction_hash: txHash,
          token_id: data.claim?.token_id || tokenId,
        });

        // Recording completed successfully - don't allow retry
        setIsRecordingClaim(true);
      } else {
        // Store hash and tokenId for retry
        setLastMintHash(txHash);
        setLastTokenId(tokenId);
        setClaimRecordFailed(true);
        setCurrentStep("success"); // Still show success screen
        setMintedTokenId(tokenId || "N/A");
        setError(
          `Failed to record claim: ${
            data.error || "Unknown error"
          }. Your NFT was minted successfully. You can retry recording below.`
        );
        analytics.track(MIXPANEL_EVENTS.CLAIM_RECORD_FAILED, {
          twitter_handle: twitterHandle,
          wallet_address: address,
          error: data.error,
        });

        // Allow retry by resetting the flag
        setIsRecordingClaim(false);
      }
    } catch (err) {
      console.error("Failed to record claim:", err);
      // Store hash and tokenId for retry
      setLastMintHash(txHash);
      setLastTokenId(tokenId);
      setClaimRecordFailed(true);
      setCurrentStep("success"); // Still show success screen
      setMintedTokenId(tokenId || "N/A");
      setError(
        `Failed to record claim: ${String(
          err
        )}. Your NFT was minted successfully. You can retry recording below.`
      );
      analytics.track(MIXPANEL_EVENTS.CLAIM_RECORD_FAILED, {
        twitter_handle: twitterHandle,
        wallet_address: address,
        error: String(err),
      });

      // Allow retry by resetting the flag
      setIsRecordingClaim(false);
    }
  };

  const getStepStatus = (step: Step): "complete" | "current" | "upcoming" => {
    const steps: Step[] = [
      "start",
      "twitter",
      "eligibility",
      "wallet",
      "mint",
      "success",
    ];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return "complete";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  if (loading) {
    return (
      <GridBackground variant="black" className="text-white overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Loader2
            className="animate-spin text-[#FF3A1E]/50"
            size={60}
            style={{ filter: "drop-shadow(0 0 12px rgba(255, 58, 30, 0.3))" }}
          />
        </div>
      </GridBackground>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            border: "1px solid rgba(255, 58, 30, 0.3)",
            color: "#fff",
          },
        }}
      />
      <GridBackground variant="black" className="text-white overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image
                src="/megafi-logo.png"
                alt="MegaFi"
                width={80}
                height={80}
                className="rounded-full opacity-80"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white/90">
              MegaFi × MegaETH –{" "}
              <span className="bg-gradient-to-r from-[#FF3A1E]/50 to-[#FF6B3D]/50 bg-clip-text text-transparent">
                The 9.5% Pass
              </span>
            </h1>
            <p className="text-gray-400/70 text-lg">
              Exclusive NFT for top 279 MegaETH community supporters{" "}
              <a
                href="https://x.com/NamikMuduroglu/status/1986055902131315056"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#FF3A1E]/50 to-[#FF6B3D]/50 bg-clip-text text-transparent hover:from-[#FF6B3D]/50 hover:to-[#FF3A1E]/50 underline transition-all"
              >
                here
              </a>
            </p>
          </div>

          {/* Progress Steps - Centered */}
          <div className="mb-12 max-w-4xl mx-auto">
            <Stepper
              value={[
                "start",
                "twitter",
                "eligibility",
                "wallet",
                "mint",
                "success",
              ].indexOf(currentStep)}
              className="w-full"
            >
              {[
                { key: "start", label: "Start", icon: FaviconIcon, step: 0 },
                { key: "twitter", label: "Connect X", icon: XLogo, step: 1 },
                { key: "eligibility", label: "Verify", icon: Check, step: 2 },
                { key: "wallet", label: "Wallet", icon: Wallet, step: 3 },
                { key: "mint", label: "Mint", icon: Sparkles, step: 4 },
                {
                  key: "success",
                  label: "Success",
                  icon: PartyPopper,
                  step: 5,
                },
              ].map(({ key, label, icon: Icon, step }, index, array) => {
                const status = getStepStatus(key as Step);
                const isLast = index === array.length - 1;

                return (
                  <StepperItem
                    key={key}
                    step={step}
                    completed={status === "complete"}
                    className={!isLast ? "flex-1" : ""}
                  >
                    <StepperTrigger asChild>
                      <div className="flex flex-col items-center cursor-default">
                        <StepperIndicator
                          asChild
                          className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 transition-all backdrop-blur-sm ${
                            status === "complete"
                              ? "bg-white/90 text-gray-900"
                              : status === "current"
                              ? "bg-white/90 text-gray-900 ring-3 ring-white/20"
                              : "bg-gray-700/40 text-gray-400"
                          }`}
                        >
                          <Icon size={15} />
                        </StepperIndicator>
                        <StepperTitle
                          className={`text-[10px] md:text-xs font-medium ${
                            status === "complete" || status === "current"
                              ? "text-white/80"
                              : "text-gray-500/60"
                          }`}
                        >
                          {label}
                        </StepperTitle>
                      </div>
                    </StepperTrigger>
                    {!isLast && (
                      <StepperSeparator
                        className={`h-0.5 mx-1 ${
                          status === "complete"
                            ? "bg-white/60"
                            : "bg-gray-700/30"
                        }`}
                      />
                    )}
                  </StepperItem>
                );
              })}
            </Stepper>
          </div>

          {/* Two-column layout container */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Left column: NFT Card */}
            <div className="order-1">
              <ElectricCard
                variant="swirl"
                color="#FF3A1E"
                badge={
                  mintedTokenId
                    ? String(parseInt(mintedTokenId)).padStart(3, "0")
                    : isLoadingTokenId
                    ? "..."
                    : String(nextTokenId).padStart(3, "0")
                }
                title="The 9.5% Pass"
                description="Exclusive for top 279 supporters"
                centerImage="/favicon.png"
                width="22rem"
                aspectRatio="7 / 10"
              />
            </div>

            {/* Right column: Claim form */}
            <div className="w-full lg:w-auto lg:flex-1 max-w-2xl order-2">
              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 border-2 border-red-500/30 rounded-lg flex items-start gap-3">
                  <X
                    className="text-red-500/80 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <p className="text-red-400/80">{error}</p>
                </div>
              )}

              {/* Content Area */}
              <div className="rounded-2xl p-8 md:p-12">
                {/* Step 0: Start/Info */}
                {currentStep === "start" && (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                      <FaviconIcon size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-white/80">
                      The 9.5% Pass
                    </h2>
                    <p className="text-gray-400/70 max-w-xl mx-auto">
                      An exclusive NFT for the top 279 MegaETH community
                      supporters. Holders receive a 1.25x multiplier on points
                      when MegaFi launches.
                    </p>

                    <div className="space-y-4 text-left max-w-lg mx-auto">
                      <div className="p-4 rounded-lg bg-gradient-to-r from-[#FF3A1E]/10 to-[#FF6B3D]/10 border border-[#FF3A1E]/20">
                        <h3 className="font-bold text-white/80 mb-2">
                          What You Get
                        </h3>
                        <ul className="text-sm text-gray-400/70 space-y-1">
                          <li>• Exclusive OG supporter status</li>
                          <li>• 1.25x points multiplier on MegaFi</li>
                          <li>• Limited to 279 MegaETH OGs</li>
                          <li>• ERC-721 NFT on Ethereum</li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
                        <h3 className="font-bold text-white/80 mb-2">
                          Requirements
                        </h3>
                        <ul className="text-sm text-gray-400/70 space-y-1">
                          <li>• X (Twitter) account verification</li>
                          <li>• Must be on eligible supporters list</li>
                          <li>• Ethereum wallet (MetaMask, etc.)</li>
                          <li>• ETH for gas fees</li>
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentStep("twitter")}
                      className="btn-primary"
                    >
                      Get Started
                    </button>
                  </div>
                )}

                {/* Step 1: Twitter Authentication */}
                {currentStep === "twitter" && (
                  <div className="text-center space-y-6">
                    {user ? (
                      <>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                          <XLogo
                            size={40}
                            className="text-[#FF3A1E]/50"
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(255, 58, 30, 0.25))",
                            }}
                          />
                        </div>
                        <h2 className="text-2xl font-bold text-white/80">
                          X Account Connected
                        </h2>
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
                            <p className="text-sm text-gray-400/70 mb-1">
                              Connected as
                            </p>
                            <p className="font-bold text-lg text-white/80">
                              @{twitterHandle}
                            </p>
                          </div>
                          <div className="flex flex-col gap-3 items-center">
                            <button
                              onClick={() =>
                                twitterHandle && checkEligibility(twitterHandle)
                              }
                              className="btn-primary"
                            >
                              Continue
                            </button>
                            <button
                              onClick={disconnectTwitter}
                              className="btn-secondary"
                            >
                              Disconnect & Use Different Account
                            </button>
                          </div>
                          <p className="text-xs text-gray-500/70 mt-2">
                            💡 Not your account? Disconnect and sign in with a
                            different X account
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                          <XLogo
                            size={40}
                            className="text-[#FF3A1E]/50"
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(255, 58, 30, 0.25))",
                            }}
                          />
                        </div>
                        <h2 className="text-2xl font-bold text-white/80">
                          Connect Your X Account
                        </h2>
                        <p className="text-gray-400/70">
                          First, connect your X (Twitter) account to verify your
                          eligibility
                        </p>
                        <button
                          onClick={signInWithTwitter}
                          className="btn-primary"
                        >
                          Authenticate X
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Step 2: Eligibility Check */}
                {currentStep === "eligibility" && (
                  <div className="text-center space-y-6">
                    {isCheckingEligibility ? (
                      <>
                        <Loader2
                          className="animate-spin text-[#FF3A1E]/50 mx-auto"
                          size={60}
                          style={{
                            filter:
                              "drop-shadow(0 0 12px rgba(255, 58, 30, 0.3))",
                          }}
                        />
                        <h2 className="text-2xl font-bold text-white/80">
                          Checking Eligibility...
                        </h2>
                        <p className="text-gray-400/70">
                          Verifying @{twitterHandle} against the eligible list
                        </p>
                      </>
                    ) : eligibility?.eligible ? (
                      <>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                          <Check className="text-green-500/80" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-green-500/80">
                          You&apos;re Eligible!
                        </h2>
                        <p className="text-gray-400/70">
                          Congratulations! Your X handle is on the MegaETH OG
                          supporter list
                        </p>
                      </>
                    ) : eligibility?.reason === "already_claimed" ? (
                      <>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                          <PartyPopper
                            className="text-green-500/80"
                            size={40}
                          />
                        </div>
                        <h2 className="text-2xl font-bold text-green-500/80">
                          You&apos;ve Already Claimed! 🎉
                        </h2>
                        <p className="text-gray-400/70">
                          You&apos;ve successfully claimed your MegaETH OG NFT!
                          {eligibility.token_id && (
                            <span className="block mt-2 text-green-400/80">
                              Token ID: #{eligibility.token_id}
                            </span>
                          )}
                        </p>
                        <button
                          onClick={() => setCurrentStep("success")}
                          className="btn-primary"
                        >
                          View Your NFT
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                          <X className="text-red-500/80" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-red-500/80">
                          Not Eligible
                        </h2>
                        <p className="text-gray-400/70 mb-4">
                          {eligibility?.reason}
                        </p>

                        {/* Show current account */}
                        {twitterHandle && (
                          <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30 mb-4">
                            <p className="text-sm text-gray-400/70 mb-1">
                              Currently connected as
                            </p>
                            <p className="font-semibold text-white/80">
                              @{twitterHandle}
                            </p>
                          </div>
                        )}

                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              disconnectTwitter();
                              setEligibility(null);
                            }}
                            className="btn-primary"
                          >
                            Try Different X Account
                          </button>
                          <p className="text-xs text-gray-500/70">
                            💡 Disconnect and sign in with another eligible X
                            account
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: Wallet Connection */}
                {currentStep === "wallet" && (
                  <div className="text-center space-y-6">
                    {/* Eligibility Confirmation - Show at top (always show if eligible, even if wallet has minted) */}
                    {eligibility?.eligible && twitterHandle && (
                      <EligibilityCard
                        twitterHandle={twitterHandle}
                        onDisconnect={disconnectTwitter}
                      />
                    )}

                    {/* Wallet Connection Section */}
                    {!isConnected ? (
                      <div className="space-y-4">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                          <Wallet
                            className="text-[#FF3A1E]/50"
                            size={40}
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(255, 58, 30, 0.25))",
                            }}
                          />
                        </div>
                        <h2 className="text-2xl font-bold text-white/80">
                          Connect Your Wallet
                        </h2>
                        <p className="text-gray-400/70">
                          Connect your Ethereum wallet to mint your OG NFT
                        </p>
                        <div className="flex justify-center pt-2">
                          <ConnectButton />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Show error if wallet has already minted */}
                        {hasMinted === true && address && (
                          <div className="eligibility-card-outer">
                            <div className="eligibility-dot"></div>
                            <div className="eligibility-card">
                              <div className="eligibility-ray"></div>
                              <div className="relative z-20">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                  <X className="text-red-400" size={24} />
                                  <h3 className="eligibility-title text-red-400">
                                    Already Minted
                                  </h3>
                                </div>
                                <p className="eligibility-message mt-2 text-center">
                                  This wallet has already minted an NFT. Each
                                  wallet can only mint once.
                                </p>
                                <p className="text-xs text-gray-400/70 mt-3 text-center">
                                  💡 Want to try with a different account or
                                  wallet?
                                </p>
                              </div>
                              <div className="eligibility-line eligibility-topl"></div>
                              <div className="eligibility-line eligibility-leftl"></div>
                              <div className="eligibility-line eligibility-bottoml"></div>
                              <div className="eligibility-line eligibility-rightl"></div>
                            </div>
                            {/* Button positioned outside card to avoid stacking context issues */}
                            <div className="mt-4">
                              <button
                                onClick={disconnectWallet}
                                className="w-full px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-gradient-to-r from-[#FF3A1E]/80 to-[#FF6B3D]/80 hover:from-[#FF6B3D]/90 hover:to-[#FF3A1E]/90 border-2 border-[#FF6B3D]/50 hover:border-[#FF6B3D]/80"
                                style={{
                                  position: "relative",
                                  zIndex: 1000,
                                  boxShadow:
                                    "0 0 20px rgba(255, 58, 30, 0.4), 0 0 40px rgba(255, 58, 30, 0.2)",
                                }}
                                type="button"
                              >
                                Go Back to Start
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Wallet Ready Card - Show when whitelisted and not already minted */}
                        {isWhitelisted && address && hasMinted !== true && (
                          <>
                            <div className="eligibility-card-outer">
                              <WalletReadyCard walletAddress={address} />
                            </div>
                            {/* Mint Button */}
                            <div className="max-w-[500px] mx-auto mt-4">
                              <button
                                onClick={handleMint}
                                className="w-full px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-[#FF3A1E]/80 to-[#FF6B3D]/80 hover:from-[#FF6B3D]/90 hover:to-[#FF3A1E]/90 border-2 border-[#FF6B3D]/50 hover:border-[#FF6B3D]/80"
                                style={{
                                  boxShadow:
                                    "0 0 20px rgba(255, 58, 30, 0.4), 0 0 40px rgba(255, 58, 30, 0.2)",
                                }}
                                disabled={
                                  isMintPending ||
                                  isConfirming ||
                                  isWhitelisted !== true ||
                                  isCheckingHasMinted
                                }
                              >
                                {isMintPending || isConfirming
                                  ? "Processing..."
                                  : isCheckingHasMinted
                                  ? "Checking..."
                                  : "Mint NFT"}
                              </button>
                            </div>
                          </>
                        )}

                        {/* Wallet Prepare Card - Show when not whitelisted and not already minted */}
                        {isWhitelisted === false &&
                          address &&
                          hasMinted !== true && (
                          <WalletPrepareCard
                            walletAddress={address}
                            onContinue={() =>
                              address && whitelistWallet(address)
                            }
                            isPreparing={isWhitelisting}
                          />
                        )}

                        {/* Checking Status - Show when status is unknown and not already minted */}
                        {isWhitelisted === null &&
                          !isWhitelisting &&
                          hasMinted !== true &&
                          address && (
                            <div className="eligibility-card-outer">
                              <div className="eligibility-dot"></div>
                              <div className="eligibility-card">
                                <div className="eligibility-ray"></div>
                                <div className="flex items-center justify-center gap-3">
                                  <Loader2
                                    className="animate-spin text-emerald-400"
                                    size={24}
                                  />
                                  <h3 className="eligibility-title">
                                    Checking Status...
                                  </h3>
                                </div>
                                <p className="eligibility-message mt-2 text-center">
                                  Verifying your wallet status
                                </p>
                                <button
                                  onClick={() => checkWhitelistStatus(address)}
                                  className="relative z-20 w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:scale-[1.02] active:scale-[0.98] mt-4"
                                >
                                  Check Status
                                </button>
                                <div className="eligibility-line eligibility-topl"></div>
                                <div className="eligibility-line eligibility-leftl"></div>
                                <div className="eligibility-line eligibility-bottoml"></div>
                                <div className="eligibility-line eligibility-rightl"></div>
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Minting */}
                {currentStep === "mint" && (
                  <div className="text-center space-y-6">
                    <Loader2
                      className="animate-spin text-[#FF3A1E]/50 mx-auto"
                      size={60}
                      style={{
                        filter: "drop-shadow(0 0 12px rgba(255, 58, 30, 0.3))",
                      }}
                    />
                    <h2 className="text-2xl font-bold text-white/80">
                      {isMintPending && "Confirm Transaction..."}
                      {isConfirming && "Minting Your NFT..."}
                      {isConfirmed && "Recording Claim..."}
                    </h2>
                    <p className="text-gray-400/70">
                      {isMintPending &&
                        "Please confirm the transaction in your wallet"}
                      {isConfirming &&
                        "Your transaction is being confirmed on the blockchain"}
                      {isConfirmed && "Almost done! Recording your claim..."}
                    </p>
                    {hash && (
                      <a
                        href={`${currentNetwork.explorerUrl}/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF3A1E]/50 to-[#FF6B3D]/50 bg-clip-text text-transparent hover:from-[#FF6B3D]/50 hover:to-[#FF3A1E]/50 underline transition-all"
                      >
                        View on{" "}
                        {currentNetwork.isTestnet ? "Arbiscan" : "Etherscan"}
                        <ExternalLink size={16} className="text-[#FF3A1E]/50" />
                      </a>
                    )}
                  </div>
                )}

                {/* Step 5: Success */}
                {currentStep === "success" && (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                      <PartyPopper className="text-green-500/80" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-green-500/80">
                      Success! 🎉
                    </h2>
                    <p className="text-gray-400/70">
                      You&apos;ve successfully claimed your MegaETH OG NFT!
                    </p>

                    {/* Show connected Twitter account */}
                    {twitterHandle && (
                      <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
                        <p className="text-sm text-gray-400/70 mb-1">
                          Claimed with
                        </p>
                        <p className="font-semibold text-white/80 mb-2">
                          @{twitterHandle}
                        </p>
                        <button
                          onClick={disconnectTwitter}
                          className="text-xs text-gray-400/70 hover:text-red-400/70 underline transition-colors"
                        >
                          Disconnect X Account
                        </button>
                      </div>
                    )}

                    <div className="space-y-3 text-left rounded-lg p-6">
                      <div className="flex justify-between">
                        <span className="text-gray-400/70">Network:</span>
                        <span className="font-medium text-white/80">
                          {currentNetwork.name}
                        </span>
                      </div>
                      {hash && (
                        <div className="flex justify-between">
                          <span className="text-gray-400/70">Transaction:</span>
                          <a
                            href={`${currentNetwork.explorerUrl}/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-[#FF3A1E]/50 to-[#FF6B3D]/50 bg-clip-text text-transparent hover:from-[#FF6B3D]/50 hover:to-[#FF3A1E]/50 hover:underline flex items-center gap-1 transition-all"
                          >
                            {hash?.slice(0, 10)}...{hash?.slice(-8)}
                            <ExternalLink
                              size={14}
                              className="text-[#FF3A1E]/50"
                            />
                          </a>
                        </div>
                      )}
                      {mintedTokenId && (
                        <div className="flex justify-between">
                          <span className="text-gray-400/70">Token ID:</span>
                          <span className="font-mono text-white/80">
                            {mintedTokenId}
                          </span>
                        </div>
                      )}
                    </div>

                    {claimRecordFailed && lastMintHash && (
                      <div className="p-4 border-2 border-yellow-500/30 bg-yellow-500/10 rounded-lg">
                        <p className="text-yellow-400/80 text-sm mb-3">
                          ⚠️ Claim recording failed. Your NFT was minted
                          successfully, but we couldn&apos;t save the record to
                          our database. Click below to retry.
                        </p>
                        <button
                          onClick={() => {
                            if (lastMintHash && lastTokenId) {
                              setError(null);
                              setClaimRecordFailed(false);
                              setIsRecordingClaim(false); // Reset flag to allow retry
                              recordClaim(lastMintHash, lastTokenId);
                            }
                          }}
                          className="w-full px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 font-semibold rounded-lg transition-all"
                        >
                          Retry Recording Claim
                        </button>
                      </div>
                    )}

                    <div
                      className="p-6 border-2 border-transparent bg-gradient-to-r from-[#FF3A1E]/10 to-[#FF6B3D]/10 rounded-lg"
                      style={{
                        borderImage:
                          "linear-gradient(to right, rgba(255, 58, 30, 0.5), rgba(255, 107, 61, 0.5)) 1",
                      }}
                    >
                      <h3 className="font-bold text-lg mb-2 text-white/80">
                        Awarded to MegaETH OG Supporters
                      </h3>
                      <p className="text-gray-300/80">
                        <span className="bg-gradient-to-r from-[#FF3A1E]/50 to-[#FF6B3D]/50 bg-clip-text text-transparent font-bold">
                          1.25x Multiplier
                        </span>{" "}
                        when MegaFi launches!
                      </p>
                    </div>

                    <button
                      onClick={() => (window.location.href = "/")}
                      className="btn-secondary"
                    >
                      Back to Home
                    </button>
                    {eligibility?.reason === "already_claimed" && (
                      <p className="text-xs text-gray-500/70 mt-2">
                        💡 When you return, you&apos;ll see your claimed NFT
                        automatically
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </GridBackground>
    </>
  );
}
