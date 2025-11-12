"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ElectricCard } from "@/components/ui/electric-card";
import { FuturisticAlienBackground } from "@/components/ui/futuristic-alien-background";
import { analytics } from "@/lib/mixpanel";
import { currentNetwork } from "@/lib/wagmi-config";

const CONTRACT_ADDRESS_TBA = "TBA";

export default function PioneerCollectionPage() {
  useEffect(() => {
    analytics.track("Page View - Pioneer Collection");
  }, []);

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
              <span className="bg-gradient-to-r from-[#9333EA]/80 to-[#A855F7]/80 bg-clip-text text-transparent">
                MegaFi Pioneer NFT
              </span>
            </h1>
            <p className="text-gray-400/70 text-lg">
              For MegaFi early testers
            </p>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Left column: NFT Card */}
            <div className="order-1">
              <ElectricCard
                variant="swirl"
                color="#9333EA"
                badge="TBA"
                title="MegaFi Pioneer NFT"
                description="Early tester reward"
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
                  className="p-6 border-2 border-transparent bg-gradient-to-r from-[#9333EA]/10 to-[#A855F7]/10 rounded-lg"
                  style={{
                    borderImage:
                      "linear-gradient(to right, rgba(147, 51, 234, 0.5), rgba(168, 85, 247, 0.5)) 1",
                  }}
                >
                  <h3 className="font-bold text-lg mb-2 text-white/80">
                    Awarded to MegaFi Early Testers
                  </h3>
                  <p className="text-gray-300/80">
                    <span className="bg-gradient-to-r from-[#9333EA]/80 to-[#A855F7]/80 bg-clip-text text-transparent font-bold">
                      Rewards & Benefits: TBA
                    </span>
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

