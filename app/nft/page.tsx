"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
          {/* Back Button - Top Left */}
          {/* <div className="mb-8">
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
              <span>Home</span>
            </button>
          </div> */}

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
              Exclusive NFTs for community supporters and early testers
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
                description="For top 279 MegaETH supporters"
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
                description="Duration: Nov 1–25 (Scoring)"
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

