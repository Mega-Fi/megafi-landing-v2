"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { ElectricCard } from "@/components/ui/electric-card";
import { GridBackground } from "@/components/ui/grid-background";
import { analytics } from "@/lib/mixpanel";
import { currentNetwork } from "@/lib/wagmi-config";

const CONTRACT_ADDRESS_TBA = "TBA";

export default function OGCollectionPage() {
  useEffect(() => {
    analytics.track("Page View - OG Collection");
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
              <span className="bg-gradient-to-r from-[#FFD700]/80 to-[#FFA500]/80 bg-clip-text text-transparent">
                MegaFi OG NFT
              </span>
            </h1>
            <p className="text-gray-400/70 text-lg">
              Duration: Nov 1–25 (Scoring), Nov 26 (Winners Announcement)
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
                      1.5× Points Multiplier on all products (lifetime)
                      <br />
                      100% Fee Rebates on all products for 1 year
                      <br />
                      Exclusive & early-access to the next phase of the MegaFi ecosystem
                      </span>
                    </p>

                    {/* Animated borders */}
                    <div className="og-benefits-line og-benefits-topl"></div>
                    <div className="og-benefits-line og-benefits-leftl"></div>
                    <div className="og-benefits-line og-benefits-bottoml"></div>
                    <div className="og-benefits-line og-benefits-rightl"></div>
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="rounded-lg p-6 bg-gray-800/20 border border-gray-700/30 mt-8">
                  <h3 className="font-bold text-2xl mb-6 text-white/90">
                    Eligibility Criteria for 50 NFTs
                  </h3>
                  <div className="space-y-6 text-gray-400/70">
                    <div>
                      <p className="font-semibold text-lg text-white/80 mb-3">
                        Ranked by Conviction Score
                      </p>
                      <div className="space-y-3 text-sm">
                        <p>From Nov 1–25, 50 community members will be chosen based on conviction, contribution, and engagement across X.</p>
                        <p>Engagement: Meaningful discussions and activity across X</p>
                        <p>Contribution: Help shape conversations, build community energy, and spread awareness</p>
                        <p>Consistency: Show up early, stay active, and lead from the front</p>
                        <p>Every action builds your Conviction Score.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Criteria Sections */}
          <div className="mt-16 space-y-6">

            {/* High-Value Activities */}
            <div className="rounded-lg p-6 bg-gray-800/20 border border-gray-700/30">
              <h3 className="font-bold text-2xl mb-6 text-white/90">
                High-Value Activities
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-400/70">
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
                    <li>Thoughtful replies to @megafi_app (not just &quot;gm 🔥&quot;)</li>
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
                    ✅ DOs
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                    <li>Tag @megafi_app or use #MegaFi in every post</li>
                    <li>Post 1-2 quality posts per day (spread across campaign period)</li>
                    <li>Mix content types (originals, quotes, replies)</li>
                    <li>Ask questions to drive engagement</li>
                    <li>Be original and add value</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-lg text-red-400/90 mb-3">
                    ❌ DON&apos;Ts
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                    <li>Posting {'>'}10 times in 1 hour (spam)</li>
                    <li>Copy-pasting content</li>
                    <li>Buying fake engagement (disqualification)</li>
                    <li>Generic replies without substance</li>
                  </ul>
                </div>
              </div>
            </div>
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

