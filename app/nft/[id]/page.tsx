"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { usePublicClient } from "wagmi";
import Image from "next/image";
import { Loader2, ExternalLink, X, ArrowLeft } from "lucide-react";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "@/lib/contract-abi";
import { currentNetwork } from "@/lib/wagmi-config";
import { ElectricCard } from "@/components/ui/electric-card";
import { GridBackground } from "@/components/ui/grid-background";

const MAX_TOKEN_ID = 279;

export default function NFTDetailPage() {
  const params = useParams();
  const publicClient = usePublicClient();
  
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [currentTokenId, setCurrentTokenId] = useState<number | null>(null);

  // Validate and parse token ID from URL
  useEffect(() => {
    const id = params.id as string;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      setError("Invalid Token ID format. Must be a number.");
      setLoading(false);
      return;
    }

    if (parsedId < 1 || parsedId > MAX_TOKEN_ID) {
      setError(`Invalid Token ID. Must be between 1 and ${MAX_TOKEN_ID}.`);
      setLoading(false);
      return;
    }

    setTokenId(parsedId);
  }, [params.id]);

  // Fetch contract data
  useEffect(() => {
    if (!tokenId || !publicClient) return;

    const fetchContractData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get current token ID from contract
        const currentId = await publicClient.readContract({
          address: NFT_CONTRACT_ADDRESS,
          abi: NFT_CONTRACT_ABI,
          functionName: "getCurrentTokenId",
          args: [],
        });

        const currentTokenIdNumber = Number(currentId);
        setCurrentTokenId(currentTokenIdNumber);

        // Check if token has been minted yet
        if (tokenId > currentTokenIdNumber) {
          setError("This token has not been minted yet.");
          setLoading(false);
          return;
        }

        // Get owner of the token
        const owner = await publicClient.readContract({
          address: NFT_CONTRACT_ADDRESS,
          abi: NFT_CONTRACT_ABI,
          functionName: "ownerOf",
          args: [BigInt(tokenId)],
        });

        setOwnerAddress(owner as string);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching contract data:", err);
        setError(
          err.message?.includes("token doesn't exist")
            ? "This token has not been minted yet."
            : "Failed to load NFT data. Please try again."
        );
        setLoading(false);
      }
    };

    fetchContractData();
  }, [tokenId, publicClient]);

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Retry function
  const handleRetry = () => {
    if (tokenId && publicClient) {
      setError(null);
      setLoading(true);
      // Trigger re-fetch by updating a state or just reload
      window.location.reload();
    }
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
    <GridBackground variant="black" className="text-white overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
          {/* Back Button - Top Left */}
          <div className="mb-8">
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
              <span>Home</span>
            </button>
          </div>

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

          {/* Two-column layout */}
          {tokenId && (
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
              {/* Left column: NFT Card */}
              <div className="order-1">
                <ElectricCard
                  variant="swirl"
                  color="#FF3A1E"
                  badge={String(tokenId).padStart(3, "0")}
                  title="The 9.5% Pass"
                  description="Exclusive for top 279 supporters"
                  centerImage="/favicon.png"
                  width="22rem"
                  aspectRatio="7 / 10"
                />
              </div>

              {/* Right column: Details */}
              <div className="w-full lg:w-auto lg:flex-1 max-w-2xl order-2">
                <div className="rounded-2xl p-8 md:p-12 space-y-6">
                  {/* NFT Details */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white/80 mb-6">
                      NFT Details
                    </h2>

                    <div className="space-y-3 text-left rounded-lg p-6 bg-gray-800/20 border border-gray-700/30">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400/70">Token ID:</span>
                        <span className="font-mono text-lg text-white/80">
                          #{tokenId}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400/70">Owner:</span>
                        {ownerAddress ? (
                          <a
                            href={`${currentNetwork.explorerUrl}/address/${ownerAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-[#FF3A1E]/50 to-[#FF6B3D]/50 bg-clip-text text-transparent hover:from-[#FF6B3D]/50 hover:to-[#FF3A1E]/50 hover:underline flex items-center gap-1 transition-all font-mono"
                          >
                            {formatAddress(ownerAddress)}
                            <ExternalLink
                              size={14}
                              className="text-[#FF3A1E]/50"
                            />
                          </a>
                        ) : (
                          <span className="text-gray-500/70 italic">
                            Not yet minted
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400/70">Network:</span>
                        <span className="font-medium text-white/80">
                          {currentNetwork.name}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400/70">Contract:</span>
                        <a
                          href={`${currentNetwork.explorerUrl}/address/${NFT_CONTRACT_ADDRESS}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-[#FF3A1E]/50 to-[#FF6B3D]/50 bg-clip-text text-transparent hover:from-[#FF6B3D]/50 hover:to-[#FF3A1E]/50 hover:underline flex items-center gap-1 transition-all font-mono"
                        >
                          {formatAddress(NFT_CONTRACT_ADDRESS)}
                          <ExternalLink
                            size={14}
                            className="text-[#FF3A1E]/50"
                          />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div className="pass-benefits-card-outer">
                    <div className="pass-benefits-dot"></div>
                    <div className="pass-benefits-card">
                      <div className="pass-benefits-ray"></div>
                      
                      <h3 className="pass-benefits-title">
                        Awarded to MegaETH OG Supporters
                      </h3>
                      <p className="pass-benefits-message">
                        <span className="pass-benefits-highlight">
                          1.25x Multiplier
                        </span>{" "}
                        on points when MegaFi launches!
                      </p>

                      {/* Animated borders */}
                      <div className="pass-benefits-line pass-benefits-topl"></div>
                      <div className="pass-benefits-line pass-benefits-leftl"></div>
                      <div className="pass-benefits-line pass-benefits-bottoml"></div>
                      <div className="pass-benefits-line pass-benefits-rightl"></div>
                    </div>
                  </div>

                  {/* Claim Now Button */}
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => (window.location.href = "/claim-megaeth-nft")}
                      className="text-white font-semibold transition-all flex items-center justify-center gap-2"
                      style={{
                        padding: "16px 32px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, rgba(255, 58, 30, 0.8) 0%, rgba(255, 107, 61, 0.8) 100%)",
                        boxShadow: "0 0 20px rgba(255, 58, 30, 0.4), 0 0 40px rgba(255, 58, 30, 0.2)",
                        border: "2px solid rgba(255, 107, 61, 0.5)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(255, 107, 61, 0.9) 0%, rgba(255, 58, 30, 0.9) 100%)";
                        e.currentTarget.style.boxShadow = "0 0 30px rgba(255, 58, 30, 0.6), 0 0 60px rgba(255, 58, 30, 0.3)";
                        e.currentTarget.style.borderColor = "rgba(255, 107, 61, 0.8)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(255, 58, 30, 0.8) 0%, rgba(255, 107, 61, 0.8) 100%)";
                        e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 58, 30, 0.4), 0 0 40px rgba(255, 58, 30, 0.2)";
                        e.currentTarget.style.borderColor = "rgba(255, 107, 61, 0.5)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Claim Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Social Footer */}
        <div className="social-footer-section">
          <div className="social-footer-content">
            <h3 className="social-footer-title">Join Our Community</h3>
            <p className="social-footer-subtitle">
              Stay updated with the latest news and connect with other holders
            </p>
            <div className="social-footer-buttons">
              <a
                href="https://discord.com/invite/EFTrPCREfZ"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Join Discord</span>
              </a>
              <a
                href="https://x.com/megafi_app"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Follow on X</span>
              </a>
            </div>
          </div>
        </div>

        <style jsx>{`
          .social-footer-section {
            padding: 2rem 1rem 3rem;
          }

          .social-footer-content {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
          }

          .social-footer-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 0.5rem;
          }

          .social-footer-subtitle {
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 1.5rem;
          }

          .social-footer-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .social-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(
              135deg,
              rgba(255, 58, 30, 0.1) 0%,
              rgba(255, 107, 61, 0.1) 100%
            );
            border: 2px solid rgba(255, 107, 61, 0.3);
            border-radius: 12px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 600;
            font-size: 0.875rem;
            text-decoration: none;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 20px rgba(255, 58, 30, 0.2);
          }

          .social-btn:hover {
            background: linear-gradient(
              135deg,
              rgba(255, 58, 30, 0.2) 0%,
              rgba(255, 107, 61, 0.2) 100%
            );
            border-color: rgba(255, 107, 61, 0.6);
            box-shadow: 0 0 30px rgba(255, 58, 30, 0.4),
              0 0 60px rgba(255, 58, 30, 0.2);
            transform: translateY(-1px);
          }

          @media (max-width: 640px) {
            .social-footer-section {
              margin-top: 3rem;
              padding: 1.5rem 1rem 2rem;
            }
            .social-footer-title {
              font-size: 1rem;
            }
            .social-footer-subtitle {
              font-size: 0.8125rem;
            }
            .social-footer-buttons {
              gap: 0.75rem;
            }
            .social-btn {
              padding: 0.625rem 1.25rem;
              font-size: 0.8125rem;
            }
          }
        `}</style>
    </GridBackground>
  );
}

