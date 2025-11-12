"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { ElectricCard } from "@/components/ui/electric-card";
import { GridBackground } from "@/components/ui/grid-background";
import { analytics } from "@/lib/mixpanel";
import { currentNetwork } from "@/lib/wagmi-config";

const CONTRACT_ADDRESS_TBA = "TBA";

export default function PioneerCollectionPage() {
  useEffect(() => {
    analytics.track("Page View - Pioneer Collection");
  }, []);

  return (
    <GridBackground variant="black" className="text-white overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
          {/* Back Button - Top Left */}
          <div className="mb-8">
            <button
              onClick={() => (window.location.href = "/nft")}
              className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
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
              <span className="bg-gradient-to-r from-[#9333EA]/80 to-[#A855F7]/80 bg-clip-text text-transparent">
                MegaFi Pioneer NFT
              </span>
            </h1>
            <p className="text-gray-400/70 text-lg">
              For MegaFi early testers. Details TBA.
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
                <div className="pioneer-benefits-card-outer">
                  <div className="pioneer-benefits-dot"></div>
                  <div className="pioneer-benefits-card">
                    <div className="pioneer-benefits-ray"></div>
                    
                    <h3 className="pioneer-benefits-title">
                      Awarded to MegaFi Early Testers
                    </h3>
                    <p className="pioneer-benefits-message">
                      <span className="pioneer-benefits-highlight">
                        Rewards & Benefits: TBA
                      </span>
                    </p>

                    {/* Animated borders */}
                    <div className="pioneer-benefits-line pioneer-benefits-topl"></div>
                    <div className="pioneer-benefits-line pioneer-benefits-leftl"></div>
                    <div className="pioneer-benefits-line pioneer-benefits-bottoml"></div>
                    <div className="pioneer-benefits-line pioneer-benefits-rightl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </GridBackground>
  );
}

