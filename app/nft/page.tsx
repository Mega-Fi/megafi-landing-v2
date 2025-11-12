"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ElectricCard } from "@/components/ui/electric-card";
import { GridBackground } from "@/components/ui/grid-background";
import { analytics, MIXPANEL_EVENTS } from "@/lib/mixpanel";

export default function NFTCollectionsPage() {
  useEffect(() => {
    analytics.track("Page View - NFT Collections");
  }, []);

  return (
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
              MegaFi NFT Collections
            </h1>
            <p className="text-gray-400/70 text-lg">
              Exclusive NFTs for MegaETH community supporters and early testers
            </p>
          </div>

          {/* NFT Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto">
            {/* 9.5% Pass Collection */}
            <Link href="/nft/9-5" className="block hover:scale-105 transition-transform duration-300">
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
            </Link>

            {/* MegaFi OG Collection */}
            <Link href="/nft/og" className="block hover:scale-105 transition-transform duration-300">
              <ElectricCard
                variant="swirl"
                color="#FFD700"
                badge="60"
                title="MegaFi OG NFT"
                description="Duration: Nov 12–25 (Scoring)"
                centerImage="/favicon.png"
                width="22rem"
                aspectRatio="7 / 10"
              />
            </Link>

            {/* MegaFi Pioneer Collection */}
            <Link href="/nft/pioneer" className="block hover:scale-105 transition-transform duration-300">
              <ElectricCard
                variant="swirl"
                color="#9333EA"
                badge="TBA"
                title="MegaFi Pioneer NFT"
                description="For MegaFi early testers"
                centerImage="/favicon.png"
                width="22rem"
                aspectRatio="7 / 10"
              />
            </Link>
          </div>

          {/* Back to Home Button */}
          <div className="flex justify-center mt-12">
            <button
              onClick={() => (window.location.href = "/")}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
    </GridBackground>
  );
}

