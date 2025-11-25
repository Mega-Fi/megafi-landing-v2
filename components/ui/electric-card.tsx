"use client";

import React, { useMemo } from "react";
import Image from "next/image";

type Variant = "swirl" | "hue";

export type ElectricCardProps = {
  /** Visual style: "swirl" = displacement + traveling turbulence; "hue" = animated hue turbulence */
  variant?: Variant;
  /** Accent / border color (any valid CSS color). */
  color?: string;
  /** Badge text in the top pill. */
  badge?: string;
  /** Title text. */
  title?: string;
  /** Description text. */
  description?: string;

  /** Fixed card width (e.g. "22rem", "360px"). Default is 22rem (matches your demo). */
  width?: string;
  /** Aspect ratio of the card (e.g. "7 / 10", "3 / 4"). */
  aspectRatio?: string;

  /** Center image source (optional). */
  centerImage?: string;

  /** Extra class names for the outer wrapper (optional). */
  className?: string;
};

/**
 * ElectricCard
 * Animated, dramatic glass/electric card with SVG filters and layered glow.
 *
 * Render multiple instances safely — filter IDs are unique per component.
 */
const ElectricCard = ({
  variant = "swirl",
  color = "#dd8448", // original orange tone
  badge = "Dramatic",
  title = "Original",
  description = "MegaFi",
  width = "22rem",
  aspectRatio = "7 / 10",
  centerImage,
  className = "",
}: ElectricCardProps) => {
  // Make unique IDs so multiple components don't clash
  const ids = useMemo(() => {
    const key = Math.random().toString(36).slice(2, 8);
    return {
      swirl: `swirl-${key}`,
      hue: `hue-${key}`,
    };
  }, []);
 
  // Map variant -> CSS var that points to the proper filter url(#...)
  const filterURL = variant === "hue" ? `url(#${ids.hue})` : `url(#${ids.swirl})`;
  console.log('class name', className);
  return (
    <div className={`ec-wrap ${className} lg:pb-20`}>
      {/* Inline SVG defs with animated filters (unique IDs per instance) */}
      <svg className="svg-container" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          {/* SWIRL (↖️ in your demo) */}
          <filter id={ids.swirl} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise3" seed="2" />
            <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise4" seed="2" />
            <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>

          {/* HUE (🎨 in your demo) */}
          <filter id={ids.hue} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="7" />
            <feColorMatrix type="hueRotate" result="pt1">
              <animate attributeName="values" values="0;360;" dur=".6s" repeatCount="indefinite" calcMode="paced" />
            </feColorMatrix>
            <feComposite />
            <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="7" seed="5" />
            <feColorMatrix type="hueRotate" result="pt2">
              <animate
                attributeName="values"
                values="0; 333; 199; 286; 64; 168; 256; 157; 360;"
                dur="5s"
                repeatCount="indefinite"
                calcMode="paced"
              />
            </feColorMatrix>
            <feBlend in="pt1" in2="pt2" mode="normal" result="combinedNoise" />
            <feDisplacementMap in="SourceGraphic" scale="30" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>

      <div className="card-container" style={{ ["--electric-border-color" as any]: color, ["--f" as any]: filterURL }}>
        <div className="inner-container">
          <div className="border-outer">
            {/* this is the element that gets the SVG filter */}
            <div 
              className="main-card" 
              style={{ 
                width: width,
                aspectRatio: aspectRatio,
              }}
            />
          </div>
          <div className="glow-layer-1" />
          <div className="glow-layer-2" />
        </div>

        <div className="overlay-1" />
        <div className="overlay-2" />
        <div className="background-glow" />

        <div className="content-container">
          <div className="content-top">
            <div className="scrollbar-glass">{badge}</div>
          </div>

          {centerImage && (
            <div className="center-content">
              <div className="center-image-container">
                <Image src={centerImage} alt="NFT" width={120} height={120} className="center-image" />
              </div>
              <p className="title">{title}</p>
            </div>
          )}

          <hr className="divider" />

          <div className="content-bottom">
            <p className="description">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ElectricCard };

