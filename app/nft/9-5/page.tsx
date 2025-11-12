"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { ElectricCard } from "@/components/ui/electric-card";
import { FuturisticAlienBackground } from "@/components/ui/futuristic-alien-background";
import { analytics } from "@/lib/mixpanel";
import { NFT_CONTRACT_ADDRESS } from "@/lib/contract-abi";
import { currentNetwork } from "@/lib/wagmi-config";

export default function NinetyFivePassCollectionPage() {
  useEffect(() => {
    analytics.track("Page View - 9.5% Pass Collection");
  }, []);

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Left column: NFT Card */}
            <div className="order-1">
              <ElectricCard
                variant="swirl"
                color="#FF3A1E"
                badge="279"
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
                      1.25x Multiplier + 9.5% Fee Rebates
                    </span>{" "}
                    on points when MegaFi launches!
                  </p>
                </div>

                {/* Back to Home Button */}
                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full max-w-xs mx-auto px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  Back to Home
                </button>
              </div>
            </div>
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

