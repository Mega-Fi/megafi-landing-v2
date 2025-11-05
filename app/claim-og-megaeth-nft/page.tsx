'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '@/lib/contract-abi';
import { currentNetwork } from '@/lib/wagmi-config';
import { createSupabaseClient } from '@/lib/supabase';
import Image from 'next/image';
import { Check, X, Loader2, ExternalLink, Twitter } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

type Step = 'twitter' | 'eligibility' | 'wallet' | 'mint' | 'success';

export default function ClaimOGNFT() {
  const supabase = createSupabaseClient();
  const { address, isConnected } = useAccount();
  
  const [user, setUser] = useState<User | null>(null);
  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<Step>('twitter');
  const [eligibility, setEligibility] = useState<{ eligible: boolean; message?: string; reason?: string } | null>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { 
    data: hash, 
    writeContract, 
    isPending: isMintPending,
    isError: isMintError,
    error: mintError 
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Check auth status on mount and handle OAuth callback
  useEffect(() => {
    const checkUser = async () => {
      try {
        // First, check if we're coming back from OAuth
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Authentication error. Please try again.');
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          // Extract Twitter handle from user metadata
          const handle = session.user.user_metadata?.user_name || 
                         session.user.user_metadata?.preferred_username ||
                         session.user.user_metadata?.name;
          setTwitterHandle(handle);
          console.log('User authenticated:', { handle, metadata: session.user.user_metadata });
        }
      } catch (err) {
        console.error('Error checking user:', err);
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.user_metadata);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const handle = session.user.user_metadata?.user_name || 
                       session.user.user_metadata?.preferred_username ||
                       session.user.user_metadata?.name;
        setTwitterHandle(handle);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setTwitterHandle(null);
        setCurrentStep('twitter');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-check eligibility when Twitter is connected
  useEffect(() => {
    if (twitterHandle && currentStep === 'twitter') {
      checkEligibility(twitterHandle);
    }
  }, [twitterHandle, currentStep]);

  // Auto-advance to wallet step when eligible
  useEffect(() => {
    if (eligibility?.eligible && currentStep === 'eligibility') {
      setCurrentStep('wallet');
    }
  }, [eligibility, currentStep]);

  // Handle mint success
  useEffect(() => {
    if (isConfirmed && hash) {
      recordClaim(hash);
    }
  }, [isConfirmed, hash]);

  const signInWithTwitter = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/claim-og-megaeth-nft`,
        },
      });
      
      if (error) {
        setError('Failed to connect with Twitter: ' + error.message);
        console.error('Twitter OAuth error:', error);
      }
    } catch (err: any) {
      setError('Failed to connect with Twitter: ' + err.message);
      console.error('Twitter OAuth error:', err);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentStep('twitter');
    setEligibility(null);
    setError(null);
  };

  const checkEligibility = async (handle: string) => {
    setIsCheckingEligibility(true);
    setError(null);
    setCurrentStep('eligibility');
    
    try {
      const response = await fetch(`/api/claim/check-eligibility?twitter_handle=${encodeURIComponent(handle)}`);
      const data = await response.json();
      
      setEligibility(data);
      
      if (!data.eligible) {
        setError(data.reason || 'Not eligible');
      }
    } catch (err) {
      setError('Failed to check eligibility');
      setEligibility({ eligible: false, reason: 'Failed to check eligibility' });
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const handleMint = async () => {
    if (!address || !twitterHandle) {
      setError('Please connect both Twitter and wallet');
      return;
    }

    setError(null);
    setCurrentStep('mint');

    try {
      // Call the mint function on the contract
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_CONTRACT_ABI,
        functionName: 'mint',
        args: [address],
      });
    } catch (err: any) {
      setError(err.message || 'Failed to mint NFT');
      console.error('Mint error:', err);
    }
  };

  const recordClaim = async (txHash: `0x${string}`) => {
    if (!user || !twitterHandle) return;

    try {
      const response = await fetch('/api/claim/record-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          twitter_handle: twitterHandle,
          twitter_user_id: user.id,
          wallet_address: address,
          token_id: null, // Token ID would need to be extracted from transaction receipt
          transaction_hash: txHash,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep('success');
        setMintedTokenId(data.claim?.token_id || 'N/A');
      } else {
        setError(data.error || 'Failed to record claim');
      }
    } catch (err) {
      console.error('Failed to record claim:', err);
      // Still show success even if recording fails
      setCurrentStep('success');
    }
  };

  const getStepStatus = (step: Step): 'complete' | 'current' | 'upcoming' => {
    const steps: Step[] = ['twitter', 'eligibility', 'wallet', 'mint', 'success'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FF3A1E]" size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/megafi-logo.png"
              alt="MegaFi"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Claim Your <span className="text-[#FF3A1E]">MegaETH OG NFT</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Exclusive NFT for top 279 MegaETH community supporters
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Bar */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700 -z-10">
              <div 
                className="h-full bg-[#FF3A1E] transition-all duration-500"
                style={{ 
                  width: `${(['twitter', 'eligibility', 'wallet', 'mint', 'success'].indexOf(currentStep) / 4) * 100}%` 
                }}
              />
            </div>

            {[
              { key: 'twitter', label: 'Connect X', icon: Twitter },
              { key: 'eligibility', label: 'Verify', icon: Check },
              { key: 'wallet', label: 'Wallet', icon: Check },
              { key: 'mint', label: 'Mint', icon: Check },
              { key: 'success', label: 'Success', icon: Check },
            ].map(({ key, label, icon: Icon }) => {
              const status = getStepStatus(key as Step);
              return (
                <div key={key} className="flex flex-col items-center z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                      status === 'complete'
                        ? 'bg-[#FF3A1E] text-white'
                        : status === 'current'
                        ? 'bg-[#FF3A1E] text-white ring-4 ring-[#FF3A1E]/20'
                        : 'bg-gray-700 text-gray-500'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className={`text-xs md:text-sm font-medium ${
                    status === 'complete' || status === 'current' ? 'text-white' : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <X className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 md:p-12">
          {/* Step 1: Twitter Authentication */}
          {currentStep === 'twitter' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[#FF3A1E]/10 rounded-full flex items-center justify-center mx-auto">
                <Twitter className="text-[#FF3A1E]" size={40} />
              </div>
              <h2 className="text-2xl font-bold">Connect Your X Account</h2>
              <p className="text-gray-400">
                First, connect your X (Twitter) account to verify your eligibility
              </p>
              
              {user ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Connected as</p>
                    <p className="font-bold text-lg">@{twitterHandle}</p>
                  </div>
                  <button 
                    onClick={signOut}
                    className="btn-secondary"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithTwitter}
                  className="btn-primary"
                >
                  <Twitter size={20} />
                  Connect with X
                </button>
              )}
            </div>
          )}

          {/* Step 2: Eligibility Check */}
          {currentStep === 'eligibility' && (
            <div className="text-center space-y-6">
              {isCheckingEligibility ? (
                <>
                  <Loader2 className="animate-spin text-[#FF3A1E] mx-auto" size={60} />
                  <h2 className="text-2xl font-bold">Checking Eligibility...</h2>
                  <p className="text-gray-400">
                    Verifying @{twitterHandle} against the eligible list
                  </p>
                </>
              ) : eligibility?.eligible ? (
                <>
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Check className="text-green-500" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-green-500">You're Eligible!</h2>
                  <p className="text-gray-400">
                    Congratulations! Your X handle is on the MegaETH OG supporter list
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                    <X className="text-red-500" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-red-500">Not Eligible</h2>
                  <p className="text-gray-400">{eligibility?.reason}</p>
                  <button
                    onClick={() => {
                      signOut();
                      setEligibility(null);
                    }}
                    className="btn-secondary"
                  >
                    Try Different Account
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 3: Wallet Connection */}
          {currentStep === 'wallet' && (
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
              <p className="text-gray-400">
                Connect your Ethereum wallet to mint your OG NFT
              </p>
              
              <div className="flex justify-center">
                <ConnectButton />
              </div>

              {isConnected && address && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Wallet Connected</p>
                    <p className="font-mono text-sm">{address.slice(0, 6)}...{address.slice(-4)}</p>
                  </div>
                  <button
                    onClick={handleMint}
                    className="btn-primary"
                  >
                    Mint NFT
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Minting */}
          {currentStep === 'mint' && (
            <div className="text-center space-y-6">
              <Loader2 className="animate-spin text-[#FF3A1E] mx-auto" size={60} />
              <h2 className="text-2xl font-bold">
                {isMintPending && 'Confirm Transaction...'}
                {isConfirming && 'Minting Your NFT...'}
                {isConfirmed && 'Recording Claim...'}
              </h2>
              <p className="text-gray-400">
                {isMintPending && 'Please confirm the transaction in your wallet'}
                {isConfirming && 'Your transaction is being confirmed on the blockchain'}
                {isConfirmed && 'Almost done! Recording your claim...'}
              </p>
              {hash && (
                <a
                  href={`${currentNetwork.explorerUrl}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FF3A1E] hover:underline"
                >
                  View on {currentNetwork.isTestnet ? 'Arbiscan' : 'Etherscan'}
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="text-green-500" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-green-500">Success! 🎉</h2>
              <p className="text-gray-400">
                You've successfully claimed your MegaETH OG NFT!
              </p>

              <div className="space-y-3 text-left bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Network:</span>
                  <span className="font-medium">{currentNetwork.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction:</span>
                  <a
                    href={`${currentNetwork.explorerUrl}/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF3A1E] hover:underline flex items-center gap-1"
                  >
                    {hash?.slice(0, 10)}...{hash?.slice(-8)}
                    <ExternalLink size={14} />
                  </a>
                </div>
                {mintedTokenId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token ID:</span>
                    <span className="font-mono">{mintedTokenId}</span>
                  </div>
                )}
              </div>

              <div className="p-6 bg-[#FF3A1E]/10 border border-[#FF3A1E]/20 rounded-lg">
                <h3 className="font-bold text-lg mb-2">🎁 Your Benefits</h3>
                <p className="text-gray-300">
                  <span className="text-[#FF3A1E] font-bold">1.25x Multiplier</span> when MegaFi launches!
                </p>
              </div>

              <button
                onClick={() => window.location.href = '/'}
                className="btn-secondary"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-gray-900/30 border border-gray-800 rounded-lg">
          <h3 className="font-bold mb-2">ℹ️ Important Information</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• Only the top 270 MegaETH community supporters are eligible</li>
            <li>• Each X handle can only claim one NFT</li>
            <li>• You'll need ETH in your wallet to pay for gas fees</li>
            <li>• NFT holders get 1.25x multiplier benefits on MegaFi</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .btn-primary {
          @apply w-full max-w-xs mx-auto px-6 py-3 bg-[#FF3A1E] hover:bg-[#FF3A1E]/90 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed;
        }
        .btn-secondary {
          @apply w-full max-w-xs mx-auto px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2;
        }
      `}</style>
    </div>
  );
}
