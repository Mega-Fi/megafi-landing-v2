"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { ElectricCard } from "@/components/ui/electric-card";
import { FuturisticAlienBackground } from "@/components/ui/futuristic-alien-background";
import { currentNetwork } from "@/lib/wagmi-config";

const MAX_TOKEN_ID = 60;
const CONTRACT_ADDRESS_TBA = "TBA";

export default function OGNFTDetailPage() {
  const params = useParams();
  
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate and parse token ID from URL
  useEffect(() => {
    const id = params.tokenId as string;
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
    setLoading(false);
  }, [params.tokenId]);

  if (loading) {
    return (
      <>
        <div className="relative min-h-screen text-white overflow-hidden bg-black">
          <div className="fixed inset-0 z-0">
            <FuturisticAlienBackground />
          </div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <Loader2
              className="animate-spin text-[#FFD700]/50"
              size={60}
              style={{ filter: "drop-shadow(0 0 12px rgba(255, 215, 0, 0.3))" }}
            />
          </div>
        </div>
        <style jsx global>{`
          body {
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI,
              Roboto, Helvetica Neue, Arial, Noto Sans, Apple Color Emoji,
              Segoe UI Emoji;
          }
        `}</style>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="relative min-h-screen text-white overflow-hidden bg-black">
          <div className="fixed inset-0 z-0">
            <FuturisticAlienBackground />
          </div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-red-400 text-xl mb-4">{error}</p>
              <button
                onClick={() => (window.location.href = "/nft/og")}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
              >
                Back to OG Collection
              </button>
            </div>
          </div>
        </div>
        <style jsx global>{`
          body {
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI,
              Roboto, Helvetica Neue, Arial, Noto Sans, Apple Color Emoji,
              Segoe UI Emoji;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="relative min-h-screen text-white overflow-hidden bg-black">
        <div className="fixed inset-0 z-0">
          <FuturisticAlienBackground />
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
              <span className="bg-gradient-to-r from-[#FFD700]/80 to-[#FFA500]/80 bg-clip-text text-transparent">
                MegaFi OG NFT
              </span>
            </h1>
            <p className="text-gray-400/70 text-lg">
              Duration: Nov 12–25 (Scoring), Nov 26 (Announcement)
            </p>
          </div>

          {/* Two-column layout */}
          {tokenId && (
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
              {/* Left column: NFT Card */}
              <div className="order-1">
                <ElectricCard
                  variant="swirl"
                  color="#FFD700"
                  badge={String(tokenId).padStart(2, "0")}
                  title="MegaFi OG NFT"
                  description="Exclusive OG supporter reward"
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
                        <span className="text-gray-400/70">Network:</span>
                        <span className="font-medium text-white/80">
                          {currentNetwork.name}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400/70">Contract:</span>
                        <span className="font-mono text-white/80">
                          {CONTRACT_ADDRESS_TBA}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div
                    className="p-6 border-2 border-transparent bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 rounded-lg"
                    style={{
                      borderImage:
                        "linear-gradient(to right, rgba(255, 215, 0, 0.5), rgba(255, 165, 0, 0.5)) 1",
                    }}
                  >
                    <h3 className="font-bold text-lg mb-2 text-white/80">
                      Awarded to MegaFi OG Supporters
                    </h3>
                    <p className="text-gray-300/80">
                      <span className="bg-gradient-to-r from-[#FFD700]/80 to-[#FFA500]/80 bg-clip-text text-transparent font-bold">
                        1.5x Multiplier (lifetime) + Fee Refunds (1 year after launch)
                      </span>
                    </p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => (window.location.href = "/nft/og")}
                      className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Back to Collection
                    </button>
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        body {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI,
            Roboto, Helvetica Neue, Arial, Noto Sans, Apple Color Emoji,
            Segoe UI Emoji;
        }
      `}</style>
    </>
  );
}

