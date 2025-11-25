"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { analytics, MIXPANEL_EVENTS } from "@/lib/mixpanel";

export type OGNFTBannerProps = {
  /** Accent color for the banner */
  color?: string;
  /** Show/hide the banner */
  visible?: boolean;
  /** Custom class name */
  className?: string;
};

/**
 * OGNFTBanner
 * Compact, animated banner to promote the OG NFT claim feature.
 * Uses electric/glass styling to match the electric-card aesthetic.
 */
export const OGNFTBanner = ({
  color = "#FF3A1E",
  visible = true,
  className = "",
}: OGNFTBannerProps) => {
  // Unique filter ID per instance
  const filterId = useMemo(() => {
    return `banner-swirl-${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  // Unique filter ID for bottom border animation
  const bottomFilterId = useMemo(() => {
    return `banner-bottom-swirl-${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  if (!visible) return null;

  const handleBannerClick = () => {
    analytics.track(MIXPANEL_EVENTS.NFT_BANNER_CLICK, {
      source: "landing_page",
      banner_color: color,
    });
  };

  return (
    <div className={`nft-banner-wrap ${className}`}>
      {/* SVG filters for animated effect */}
      <svg
        className="banner-svg-defs"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise1"
              seed="1"
            />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate
                attributeName="dy"
                values="700; 0"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise2"
              seed="1"
            />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate
                attributeName="dy"
                values="0; -700"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise3"
              seed="2"
            />
            <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
              <animate
                attributeName="dx"
                values="490; 0"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise4"
              seed="2"
            />
            <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
              <animate
                attributeName="dx"
                values="0; -490"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feComposite
              in="offsetNoise1"
              in2="offsetNoise2"
              result="part1"
            />
            <feComposite
              in="offsetNoise3"
              in2="offsetNoise4"
              result="part2"
            />
            <feBlend
              in="part1"
              in2="part2"
              mode="color-dodge"
              result="combinedNoise"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>

          {/* Bottom border animation filter - more intense */}
          <filter
            id={bottomFilterId}
            colorInterpolationFilters="sRGB"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.025"
              numOctaves="12"
              result="noise1"
              seed="3"
            />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate
                attributeName="dy"
                values="800; 0"
                dur="5s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.025"
              numOctaves="12"
              result="noise2"
              seed="3"
            />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate
                attributeName="dy"
                values="0; -800"
                dur="5s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.025"
              numOctaves="12"
              result="noise3"
              seed="4"
            />
            <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
              <animate
                attributeName="dx"
                values="600; 0"
                dur="5s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.025"
              numOctaves="12"
              result="noise4"
              seed="4"
            />
            <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
              <animate
                attributeName="dx"
                values="0; -600"
                dur="5s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feComposite
              in="offsetNoise1"
              in2="offsetNoise2"
              result="part1"
            />
            <feComposite
              in="offsetNoise3"
              in2="offsetNoise4"
              result="part2"
            />
            <feBlend
              in="part1"
              in2="part2"
              mode="color-dodge"
              result="combinedNoise"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale="40"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <Link
        href="/nft/og"
        className="banner-link"
        onClick={handleBannerClick}
      > 
        <div
          className="banner-container"
          style={
            {
              "--banner-color": color,
              "--banner-filter": `url(#${filterId})`,
              "--banner-bottom-filter": `url(#${bottomFilterId})`,
            } as React.CSSProperties
          }
        >
          <div className="banner-inner">
            <div className="banner-border">
              <div className="banner-card" />
            </div>
            <div className="banner-glow-1" />
            <div className="banner-glow-2" />
            <div className="banner-bottom-border-animation" />
          </div>

          <div className="banner-overlay-1" />
          <div className="banner-overlay-2" />
          <div className="banner-bg-glow" />

          <div className="banner-content">
            <div className="banner-badge">
              <Sparkles size={14} />
              <span>LIMITED</span>
            </div>

            <div className="banner-text">
              <span className="banner-title">
                Claim Your MegaFi OG NFT
              </span>
              <span className="banner-subtitle">
                Top 60 MegaFi OGs • 100% Fee Rebates • Exclusive 1.5x Multiplier
              </span>
            </div>

            <button className="banner-cta">
              <span>Claim Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Link>

      <style jsx>{`
        .nft-banner-wrap {
          position: absolute;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          animation: slideDown 0.6s ease-out;
        }

          @media (max-width: 1500px) {
          .nft-banner-wrap {
            // top: 6rem;
            // width: 70%;
            left: 45%;
            // max-width: 420px;
          }
        }

         @media (max-width: 1200px) {
          .nft-banner-wrap {
            top: 6rem;
            // width: 70%;
            // left: 40%;
            // max-width: 420px;
          }
        }

        @media (max-width: 768px) {
          .nft-banner-wrap {
            top: 6rem;
            width: 95%;
            max-width: 420px;
          }
        }

        @media (max-width: 640px) {
          .nft-banner-wrap {
            top: 5rem;
            width: 95%;
            max-width: 420px;
            left: 50%;
          }
        }

        @media (max-width: 420px) {
          .nft-banner-wrap {
            top: 4.5rem;
            width: 96%;
            max-width: 360px;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-2rem);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .banner-svg-defs {
          position: absolute;
          width: 0;
          height: 0;
          overflow: hidden;
        }

        .banner-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .banner-container {
          padding: 2px;
          border-radius: 1rem;
          position: relative;
          overflow: hidden;
          --banner-light-color: oklch(from var(--banner-color) l c h);
          --banner-gradient: oklch(
            from var(--banner-color) 0.3 calc(c / 2) h / 0.3
          );
          background: linear-gradient(
              -30deg,
              var(--banner-gradient),
              transparent,
              var(--banner-gradient)
            ),
            linear-gradient(to bottom, oklch(0.185 0 0), oklch(0.185 0 0));
          color: oklch(0.985 0 0);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .banner-container:hover {
          transform: scale(1.02);
        }

        .banner-inner {
          position: relative;
          z-index: 1;
          overflow: hidden;
          border-radius: 1rem;
        }

        .banner-border {
          border: 1.5px solid oklch(from var(--banner-color) l c h / 0.5);
          border-radius: 1rem;
          padding: 0;
          position: relative;
          overflow: hidden;
        }
        .banner-border::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 1.5px solid var(--banner-color);
          filter: var(--banner-filter);
          pointer-events: none;
          box-sizing: border-box;
        }

        .banner-card {
          width: 100%;
          min-width: 900px;
          max-width: 1200px;
          height: 80px;
          border-radius: calc(1rem - 2px);
          border: none;
          background: oklch(0.145 0 0);
          box-sizing: border-box;
        }

        /* Responsive sizing */
        @media (max-width: 1024px) {
          .banner-card {
            min-width: 700px;
            height: 80px;
          }
        }

        @media (max-width: 768px) {
          .banner-card {
            min-width: 0;
            width: 100%;
            max-width: 100%;
            height: auto;
            min-height: 190px;
          }
        }

        @media (max-width: 420px) {
          .banner-card {
            min-width: 0;
            width: 100%;
            max-width: 100%;
            min-height: 210px;
          }
        }

        /* Glow effects */
        .banner-glow-1,
        .banner-glow-2,
        .banner-overlay-1,
        .banner-overlay-2,
        .banner-bg-glow {
          border-radius: 1rem;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .banner-glow-1 {
          border: 1.5px solid oklch(from var(--banner-color) l c h / 0.5);
          filter: blur(1px);
        }

        .banner-glow-2 {
          border: 1.5px solid var(--banner-light-color);
          filter: blur(3px);
        }

        .banner-bottom-border-animation {
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 8px;
          border-radius: 0 0 1rem 1rem;
          border: 2px solid var(--banner-color);
          filter: var(--banner-bottom-filter);
          pointer-events: none;
          z-index: 3;
          opacity: 0.9;
        }

        .banner-overlay-1,
        .banner-overlay-2 {
          mix-blend-mode: overlay;
          transform: scale(1.05);
          filter: blur(12px);
          background: linear-gradient(
            -30deg,
            white,
            transparent 30%,
            transparent 70%,
            white
          );
        }

        .banner-overlay-1 {
          opacity: 0.2;
        }
        .banner-overlay-2 {
          opacity: 0.1;
        }

        .banner-bg-glow {
          filter: blur(24px);
          transform: scale(1.1);
          opacity: 0.15;
          z-index: -1;
          background: linear-gradient(
            -30deg,
            var(--banner-light-color),
            transparent,
            var(--banner-color)
          );
        }

        /* Content */
        .banner-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          gap: 1.5rem;
          z-index: 2;
          pointer-events: none;
          box-sizing: border-box;
          overflow: hidden;
        }
        
        .banner-content > * {
          pointer-events: auto;
        }

        @media (max-width: 768px) {
          .banner-content {
            flex-direction: column;
            padding: 1rem 1.25rem 1.5rem;
            gap: 0.875rem;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            overflow: visible;
          }
        }

        @media (max-width: 420px) {
          .banner-content {
            padding: 0.875rem 1rem 1.25rem;
            gap: 0.75rem;
            width: 100%;
            overflow: visible;
          }
        }

        /* Badge */
        .banner-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: radial-gradient(
              47.2% 50% at 50.39% 88.37%,
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0) 100%
            ),
            rgba(255, 255, 255, 0.04);
          border-radius: 0.75rem;
          padding: 0.4rem 0.9rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.9);
          white-space: nowrap;
          position: relative;
          animation: pulse 2s ease-in-out infinite;
          isolation: isolate;
          flex-shrink: 0;
          max-width: 100%;
          box-sizing: border-box;
        }

        .banner-badge::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          background: linear-gradient(
            150deg,
            rgba(255, 255, 255, 0.4) 16.73%,
            rgba(255, 255, 255, 0.06) 30.2%,
            rgba(255, 255, 255, 0.06) 68.2%,
            rgba(255, 255, 255, 0.5) 81.89%
          );
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask-composite: xor;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @media (max-width: 768px) {
          .banner-badge {
            padding: 0.35rem 0.7rem;
            font-size: 0.7rem;
            gap: 0.4rem;
            max-width: calc(100% - 2.5rem);
            width: auto;
          }
        }

        @media (max-width: 420px) {
          .banner-badge {
            font-size: 0.65rem;
            padding: 0.3rem 0.6rem;
            gap: 0.35rem;
            max-width: calc(100% - 2rem);
            width: auto;
          }
          
          .banner-badge svg {
            width: 12px;
            height: 12px;
            flex-shrink: 0;
          }
        }

        /* Text content */
        .banner-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          min-width: 0;
        }

        .banner-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: white;
          white-space: nowrap;
          line-height: 1.3;
        }

        @media (max-width: 768px) {
          .banner-title {
            font-size: 1rem;
            white-space: normal;
            text-align: center;
            line-height: 1.3;
          }
        }

        @media (max-width: 420px) {
          .banner-title {
            font-size: 0.9rem;
          }
        }

        .banner-subtitle {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .banner-subtitle {
            font-size: 0.8rem;
            white-space: normal;
            text-align: center;
            line-height: 1.4;
          }
        }

        @media (max-width: 420px) {
          .banner-subtitle {
            font-size: 0.75rem;
          }
        }

        /* CTA Button */
        .banner-cta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--banner-color);
          color: white;
          border: none;
          border-radius: 0.75rem;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 0 20px var(--banner-color);
        }

        .banner-cta:hover {
          background: oklch(from var(--banner-color) calc(l + 0.1) c h);
          box-shadow: 0 0 30px var(--banner-color);
          transform: translateY(-1px);
        }

        .banner-cta:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .banner-cta {
            padding: 0.7rem 1.25rem;
            font-size: 0.85rem;
            width: auto;
            max-width: calc(100% - 2.5rem);
            min-width: 0;
            justify-content: center;
          }
        }

        @media (max-width: 420px) {
          .banner-cta {
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
            max-width: calc(100% - 2rem);
            width: auto;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
};
