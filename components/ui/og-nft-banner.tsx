'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

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
  color = '#FF3A1E',
  visible = true,
  className = '',
}: OGNFTBannerProps) => {
  // Unique filter ID per instance
  const filterId = useMemo(() => {
    return `banner-swirl-${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  if (!visible) return null;

  return (
    <div className={`nft-banner-wrap ${className}`}>
      {/* SVG filters for animated effect */}
      <svg className="banner-svg-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="8" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="500; 0" dur="8s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="8" result="noise2" seed="2" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dx" values="350; 0" dur="8s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feBlend in="offsetNoise1" in2="offsetNoise2" mode="color-dodge" result="combinedNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <Link href="/claim-og-megaeth-nft" className="banner-link">
        <div
          className="banner-container"
          style={
            {
              '--banner-color': color,
              '--banner-filter': `url(#${filterId})`,
            } as React.CSSProperties
          }
        >
          {/* Background with electric border effect */}
          <div className="banner-inner">
            <div className="banner-border">
              <div className="banner-card" />
            </div>
            <div className="banner-glow-1" />
            <div className="banner-glow-2" />
          </div>

          {/* Overlay effects */}
          <div className="banner-overlay-1" />
          <div className="banner-overlay-2" />
          <div className="banner-bg-glow" />

          {/* Content */}
          <div className="banner-content">
            {/* Badge */}
            <div className="banner-badge">
              <Sparkles size={14} />
              <span>LIMITED</span>
            </div>

            {/* Main text */}
            <div className="banner-text">
              <span className="banner-title">Claim Your OG MegaETH NFT</span>
              <span className="banner-subtitle">Top 279 Supporters • Exclusive 1.25x Multiplier</span>
            </div>

            {/* CTA Button */}
            <button className="banner-cta">
              <span>Claim Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Link>

      <style jsx>{`
        .nft-banner-wrap {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          animation: slideDown 0.6s ease-out;
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
          --banner-light-color: oklch(from var(--banner-color) l c h);
          --banner-gradient: oklch(from var(--banner-color) 0.3 calc(c / 2) h / 0.3);
          background: linear-gradient(-30deg, var(--banner-gradient), transparent, var(--banner-gradient)),
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
        }

        .banner-border {
          border: 1.5px solid oklch(from var(--banner-color) l c h / 0.5);
          border-radius: 1rem;
          padding-right: 0.1em;
          padding-bottom: 0.1em;
        }

        .banner-card {
          width: auto;
          min-width: 765px;
          max-width: 1020px;
          height: 80px;
          border-radius: 1rem;
          border: 1.5px solid var(--banner-color);
          margin-top: -3px;
          margin-left: -3px;
          filter: var(--banner-filter);
          background: oklch(0.145 0 0);
        }

        /* Responsive sizing */
        @media (max-width: 1024px) {
          .banner-card {
            min-width: 595px;
            height: 80px;
          }
        }

        @media (max-width: 768px) {
          .banner-card {
            min-width: 290px;
            height: 100px;
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

        .banner-overlay-1,
        .banner-overlay-2 {
          mix-blend-mode: overlay;
          transform: scale(1.05);
          filter: blur(12px);
          background: linear-gradient(-30deg, white, transparent 30%, transparent 70%, white);
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
          background: linear-gradient(-30deg, var(--banner-light-color), transparent, var(--banner-color));
        }

        /* Content */
        .banner-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .banner-content {
            flex-direction: column;
            padding: 1rem 1.5rem;
            gap: 0.75rem;
            justify-content: center;
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
        }

        .banner-badge::before {
          content: '';
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
        }

        @media (max-width: 768px) {
          .banner-title {
            font-size: 0.95rem;
            white-space: normal;
            text-align: center;
          }
        }

        .banner-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .banner-subtitle {
            font-size: 0.75rem;
            white-space: normal;
            text-align: center;
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
          padding: 0.75rem 1.75rem;
          font-size: 0.95rem;
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
            padding: 0.6rem 1.25rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

