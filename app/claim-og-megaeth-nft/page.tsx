'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '@/lib/contract-abi';
import { currentNetwork } from '@/lib/wagmi-config';
import { createSupabaseClient } from '@/lib/supabase';
import Image from 'next/image';
import { Check, X, Loader2, ExternalLink, Info, Sparkles } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { ParticleCanvas } from '@/components/ui/particle-canvas';
import { ElectricCard } from '@/components/ui/electric-card';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';

// X (Twitter) Logo Component
const XLogo = ({ size = 20, className = "", style }: { size?: number; className?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor"/>
  </svg>
);

type Step = 'start' | 'twitter' | 'eligibility' | 'wallet' | 'mint' | 'success';

export default function ClaimOGNFT() {
  const supabase = createSupabaseClient();
  const { address, isConnected } = useAccount();
  
  const [user, setUser] = useState<User | null>(null);
  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<Step>('start');
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
          // Skip start step if already authenticated
          setCurrentStep('twitter');
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
        setCurrentStep('twitter');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setTwitterHandle(null);
        setCurrentStep('start');
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
    setCurrentStep('start');
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
      // Note: The95Pass contract mint() takes no parameters - it mints to msg.sender
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_CONTRACT_ABI,
        functionName: 'mint',
        args: [], // No args needed - contract mints to msg.sender
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
    const steps: Step[] = ['start', 'twitter', 'eligibility', 'wallet', 'mint', 'success'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (loading) {
    return (
      <>
        <div className="relative min-h-screen text-white overflow-hidden">
          <div className="fixed inset-0 z-0">
            <ParticleCanvas pointerSize={6} pointerColor="#FF3A1E" />
          </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-[#FF3A1E]/50" size={60} style={{ filter: 'drop-shadow(0 0 12px rgba(255, 58, 30, 0.3))' }} />
        </div>
        </div>
        <style jsx global>{`
          body {
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
              Helvetica Neue, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji;
          }
        `}</style>
      </>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <ParticleCanvas pointerSize={6} pointerColor="#FF3A1E" />
      </div>
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
            MegaFi × MegaETH – <span className="bg-gradient-to-r from-[#FF3A1E]/50 to-[#FF6B3D]/50 bg-clip-text text-transparent">The 9.5% Pass</span>
          </h1>
          <p className="text-gray-400/70 text-lg">
            Exclusive NFT for top 279 MegaETH community supporters{' '}
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
            value={['start', 'twitter', 'eligibility', 'wallet', 'mint', 'success'].indexOf(currentStep)}
            className="w-full"
          >
            {[
              { key: 'start', label: 'Start', icon: Sparkles, step: 0 },
              { key: 'twitter', label: 'Connect X', icon: XLogo, step: 1 },
              { key: 'eligibility', label: 'Verify', icon: Check, step: 2 },
              { key: 'wallet', label: 'Wallet', icon: Check, step: 3 },
              { key: 'mint', label: 'Mint', icon: Check, step: 4 },
              { key: 'success', label: 'Success', icon: Check, step: 5 },
            ].map(({ key, label, icon: Icon, step }, index, array) => {
              const status = getStepStatus(key as Step);
              const isLast = index === array.length - 1;
              
              return (
                <StepperItem 
                  key={key} 
                  step={step}
                  completed={status === 'complete'}
                  className={!isLast ? "flex-1" : ""}
                >
                  <StepperTrigger asChild>
                    <div className="flex flex-col items-center cursor-default">
                      <StepperIndicator 
                        asChild
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 transition-all backdrop-blur-sm ${
                          status === 'complete'
                            ? 'bg-white/90 text-gray-900'
                            : status === 'current'
                            ? 'bg-white/90 text-gray-900 ring-3 ring-white/20'
                            : 'bg-gray-700/40 text-gray-400'
                        }`}
                      >
                        <Icon size={15} />
                      </StepperIndicator>
                      <StepperTitle className={`text-[10px] md:text-xs font-medium ${
                        status === 'complete' || status === 'current' ? 'text-white/80' : 'text-gray-500/60'
                      }`}>
                        {label}
                      </StepperTitle>
                    </div>
                  </StepperTrigger>
                  {!isLast && (
                    <StepperSeparator 
                      className={`h-0.5 mx-1 ${
                        status === 'complete' 
                          ? 'bg-white/60' 
                          : 'bg-gray-700/30'
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
              badge="OG NFT"
              title="The 9.5% Pass"
              description="Exclusive for top 279 supporters"
              width="22rem"
              aspectRatio="7 / 10"
            />
          </div>
          
          {/* Right column: Claim form */}
          <div className="w-full lg:w-auto lg:flex-1 max-w-2xl order-2">
            {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 border-2 border-red-500/30 rounded-lg flex items-start gap-3">
            <X className="text-red-500/80 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-400/80">{error}</p>
          </div>
        )}

        {/* Content Area */}
        <div className="border border-gray-800/50 rounded-2xl p-8 md:p-12">
          {/* Step 0: Start/Info */}
          {currentStep === 'start' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="text-[#FF3A1E]/50" size={40} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 58, 30, 0.25))' }} />
              </div>
              <h2 className="text-2xl font-bold text-white/80">The 9.5% Pass</h2>
              <p className="text-gray-400/70 max-w-xl mx-auto">
                An exclusive NFT for the top 279 MegaETH community supporters. Holders receive a 1.25x multiplier on points when MegaFi launches.
              </p>
              
              <div className="space-y-4 text-left max-w-lg mx-auto">
                <div className="p-4 rounded-lg bg-gradient-to-r from-[#FF3A1E]/10 to-[#FF6B3D]/10 border border-[#FF3A1E]/20">
                  <h3 className="font-bold text-white/80 mb-2">✨ What You Get</h3>
                  <ul className="text-sm text-gray-400/70 space-y-1">
                    <li>• Exclusive OG supporter status</li>
                    <li>• 1.25x points multiplier on MegaFi</li>
                    <li>• Limited to 270 community members</li>
                    <li>• ERC-721 NFT on Ethereum</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
                  <h3 className="font-bold text-white/80 mb-2">📋 Requirements</h3>
                  <ul className="text-sm text-gray-400/70 space-y-1">
                    <li>• X (Twitter) account verification</li>
                    <li>• Must be on eligible supporters list</li>
                    <li>• Ethereum wallet (MetaMask, etc.)</li>
                    <li>• ETH for gas fees</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('twitter')}
                className="btn-primary"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Step 1: Twitter Authentication */}
          {currentStep === 'twitter' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <XLogo size={40} className="text-[#FF3A1E]/50" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 58, 30, 0.25))' }} />
              </div>
              <h2 className="text-2xl font-bold text-white/80">Connect Your X Account</h2>
              <p className="text-gray-400/70">
                First, connect your X (Twitter) account to verify your eligibility
              </p>
              
              {user ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg">
                    <p className="text-sm text-gray-400/70 mb-1">Connected as</p>
                    <p className="font-bold text-lg text-white/80">@{twitterHandle}</p>
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
                  Authenticate X
                </button>
              )}
            </div>
          )}

          {/* Step 2: Eligibility Check */}
          {currentStep === 'eligibility' && (
            <div className="text-center space-y-6">
              {isCheckingEligibility ? (
                <>
                  <Loader2 className="animate-spin text-[#FF3A1E]/50 mx-auto" size={60} style={{ filter: 'drop-shadow(0 0 12px rgba(255, 58, 30, 0.3))' }} />
                  <h2 className="text-2xl font-bold text-white/80">Checking Eligibility...</h2>
                  <p className="text-gray-400/70">
                    Verifying @{twitterHandle} against the eligible list
                  </p>
                </>
              ) : eligibility?.eligible ? (
                <>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <Check className="text-green-500/80" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-green-500/80">You're Eligible!</h2>
                  <p className="text-gray-400/70">
                    Congratulations! Your X handle is on the MegaETH OG supporter list
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <X className="text-red-500/80" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-red-500/80">Not Eligible</h2>
                  <p className="text-gray-400/70">{eligibility?.reason}</p>
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
              <h2 className="text-2xl font-bold text-white/80">Connect Your Wallet</h2>
              <p className="text-gray-400/70">
                Connect your Ethereum wallet to mint your OG NFT
              </p>
              
              <div className="flex justify-center">
                <ConnectButton />
              </div>

              {isConnected && address && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg">
                    <p className="text-sm text-gray-400/70 mb-1">Wallet Connected</p>
                    <p className="font-mono text-sm text-white/80">{address.slice(0, 6)}...{address.slice(-4)}</p>
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
              <Loader2 className="animate-spin text-[#FF3A1E]/50 mx-auto" size={60} style={{ filter: 'drop-shadow(0 0 12px rgba(255, 58, 30, 0.3))' }} />
              <h2 className="text-2xl font-bold text-white/80">
                {isMintPending && 'Confirm Transaction...'}
                {isConfirming && 'Minting Your NFT...'}
                {isConfirmed && 'Recording Claim...'}
              </h2>
              <p className="text-gray-400/70">
                {isMintPending && 'Please confirm the transaction in your wallet'}
                {isConfirming && 'Your transaction is being confirmed on the blockchain'}
                {isConfirmed && 'Almost done! Recording your claim...'}
              </p>
              {hash && (
                <a
                  href={`${currentNetwork.explorerUrl}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF3A1E]/50 to-[#FF6B3D]/50 bg-clip-text text-transparent hover:from-[#FF6B3D]/50 hover:to-[#FF3A1E]/50 underline transition-all"
                >
                  View on {currentNetwork.isTestnet ? 'Arbiscan' : 'Etherscan'}
                  <ExternalLink size={16} className="text-[#FF3A1E]/50" />
                </a>
              )}
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Check className="text-green-500/80" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-green-500/80">Success! 🎉</h2>
              <p className="text-gray-400/70">
                You've successfully claimed your MegaETH OG NFT!
              </p>

              <div className="space-y-3 text-left rounded-lg p-6">
                <div className="flex justify-between">
                  <span className="text-gray-400/70">Network:</span>
                  <span className="font-medium text-white/80">{currentNetwork.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400/70">Transaction:</span>
                  <a
                    href={`${currentNetwork.explorerUrl}/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-[#FF3A1E]/50 to-[#FF6B3D]/50 bg-clip-text text-transparent hover:from-[#FF6B3D]/50 hover:to-[#FF3A1E]/50 hover:underline flex items-center gap-1 transition-all"
                  >
                    {hash?.slice(0, 10)}...{hash?.slice(-8)}
                    <ExternalLink size={14} className="text-[#FF3A1E]/50" />
                  </a>
                </div>
                {mintedTokenId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400/70">Token ID:</span>
                    <span className="font-mono text-white/80">{mintedTokenId}</span>
                  </div>
                )}
              </div>

              <div className="p-6 border-2 border-transparent bg-gradient-to-r from-[#FF3A1E]/10 to-[#FF6B3D]/10 rounded-lg" style={{ borderImage: 'linear-gradient(to right, rgba(255, 58, 30, 0.5), rgba(255, 107, 61, 0.5)) 1' }}>
                <h3 className="font-bold text-lg mb-2 text-white/80">🎁 Your Benefits</h3>
                <p className="text-gray-300/80">
                  <span className="bg-gradient-to-r from-[#FF3A1E]/50 to-[#FF6B3D]/50 bg-clip-text text-transparent font-bold">1.25x Multiplier</span> when MegaFi launches!
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
          </div>
          
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 rounded-lg max-w-2xl mx-auto opacity-60">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Info className="text-[#FF3A1E]" size={20} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 58, 30, 0.5))' }} />
            <h3 className="font-bold text-white/80 text-sm">Important Information</h3>
          </div>
          <ul className="text-xs text-gray-400/70 space-y-2 max-w-md mx-auto px-4 text-center">
            <li>• NFT holders get 1.25x multiplier on points when MegaFi launches</li>
            <li>• Only the top 270 MegaETH community supporters are eligible</li>
            <li>• Each X handle can only claim one NFT</li>
            <li>• You'll need ETH in your wallet to pay for gas fees</li>
          </ul>
        </div>
      </div>

      <style jsx global>{`
        body {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica Neue, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji;
        }
      `}</style>
      <style jsx>{`
        .btn-primary {
          @apply w-full max-w-xs mx-auto text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed;
          padding: 16px 32px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255, 58, 30, 0.8) 0%, rgba(255, 107, 61, 0.8) 100%);
          box-shadow: 0 0 20px rgba(255, 58, 30, 0.4), 0 0 40px rgba(255, 58, 30, 0.2);
          border: 2px solid rgba(255, 107, 61, 0.5);
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, rgba(255, 107, 61, 0.9) 0%, rgba(255, 58, 30, 0.9) 100%);
          box-shadow: 0 0 30px rgba(255, 58, 30, 0.6), 0 0 60px rgba(255, 58, 30, 0.3);
          border-color: rgba(255, 107, 61, 0.8);
          transform: translateY(-1px);
        }
        .btn-secondary {
          @apply w-full max-w-xs mx-auto px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2;
        }
      `}</style>
    </div>
  );
}
