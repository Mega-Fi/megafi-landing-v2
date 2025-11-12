"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { ElectricCard } from "@/components/ui/electric-card";
import { FuturisticAlienBackground } from "@/components/ui/futuristic-alien-background";
import { analytics } from "@/lib/mixpanel";
import { currentNetwork } from "@/lib/wagmi-config";

const CONTRACT_ADDRESS_TBA = "TBA";

export default function OGCollectionPage() {
  useEffect(() => {
    analytics.track("Page View - OG Collection");
  }, []);

  return (
    <>
      <div className="relative min-h-screen text-white overflow-hidden bg-black">
        <div className="fixed inset-0 z-0">
          <FuturisticAlienBackground />
        </div>
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
              <span className="bg-gradient-to-r from-[#FFD700]/80 to-[#FFA500]/80 bg-clip-text text-transparent">
                MegaFi OG NFT
              </span>
            </h1>
            <p className="text-gray-400/70 text-lg">
              Duration: Nov 12–25 (Scoring), Nov 26 (Announcement)
            </p>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Left column: NFT Card */}
            <div className="order-1">
              <ElectricCard
                variant="swirl"
                color="#FFD700"
                badge="60"
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
                <div className="og-benefits-card-outer">
                  <div className="og-benefits-dot"></div>
                  <div className="og-benefits-card">
                    <div className="og-benefits-ray"></div>
                    
                    <h3 className="og-benefits-title">
                      Awarded to MegaFi OG Supporters
                    </h3>
                    <p className="og-benefits-message">
                      <span className="og-benefits-highlight">
                        1.5x Multiplier (lifetime) + Fee Refunds (1 year after launch)
                      </span>
                    </p>

                    {/* Animated borders */}
                    <div className="og-benefits-line og-benefits-topl"></div>
                    <div className="og-benefits-line og-benefits-leftl"></div>
                    <div className="og-benefits-line og-benefits-bottoml"></div>
                    <div className="og-benefits-line og-benefits-rightl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Criteria Sections */}
          <div className="mt-16 space-y-6">
            {/* Eligibility Tiers */}
            <div className="rounded-lg p-6 bg-gray-800/20 border border-gray-700/30">
              <h3 className="font-bold text-2xl mb-6 text-white/90">
                Eligibility Tiers
              </h3>
              <div className="space-y-6 text-gray-400/70">
                <div>
                  <p className="font-semibold text-lg text-white/80 mb-3">
                    Tier 1: First 10 Discord Members (10 NFTs)
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                    <li>Guaranteed NFT by Discord join timestamp</li>
                    <li>Rewards earliest believers</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-lg text-white/80 mb-3">
                    Tier 2: Top 50 X Engagement (50 NFTs)
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                    <li>Must be Discord member</li>
                    <li>Ranked by X Engagement Score</li>
                    <li>Scoring Period: Nov 12–25, 23:59 UTC</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* High-Value Activities */}
            <div className="rounded-lg p-6 bg-gray-800/20 border border-gray-700/30">
              <h3 className="font-bold text-2xl mb-6 text-white/90">
                High-Value Activities
              </h3>
              <div className="space-y-6 text-gray-400/70">
                <div>
                  <p className="font-semibold text-lg text-white/80 mb-3">
                    Original Content (Highest Points)
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                    <li>Educational posts explaining MegaFi products (Hedge, Earn, Swap)</li>
                    <li>Posts about MegaETH speed/technology</li>
                    <li>Use case examples and strategy guides</li>
                    <li>Tag @megafi_app and use #MegaFi</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-lg text-white/80 mb-3">
                    Engagement Actions
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                    <li>Quote posts with added commentary and analysis</li>
                    <li>Thoughtful replies to @megafi_app (not just "gm 🔥")</li>
                    <li>Repost official content (quote posts score higher)</li>
                    <li>Answer community questions helpfully</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-lg text-white/80 mb-3">
                    Creative Content
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                    <li>Infographics, comparisons, memes</li>
                    <li>Visual explanations of features</li>
                    <li>Technical deep dives</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Best Practices & Red Flags */}
            <div className="rounded-lg p-6 bg-gray-800/20 border border-gray-700/30">
              <h3 className="font-bold text-2xl mb-6 text-white/90">
                Best Practices & Red Flags
              </h3>
              <div className="grid md:grid-cols-2 gap-8 text-gray-400/70">
                <div>
                  <p className="font-semibold text-lg text-green-400/90 mb-3">
                    ✅ Best Practices
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                    <li>Post 1-2 quality posts per day (spread across campaign period)</li>
                    <li>Mix content types (originals, quotes, replies)</li>
                    <li>Ask questions to drive engagement</li>
                    <li>Be original and add value</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-lg text-red-400/90 mb-3">
                    ❌ Red Flags
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                    <li>Posting &gt;10 times in 1 hour (spam)</li>
                    <li>Copy-pasting content (0.1x multiplier)</li>
                    <li>Buying fake engagement (disqualification)</li>
                    <li>Generic replies without substance</li>
                  </ul>
                </div>
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

