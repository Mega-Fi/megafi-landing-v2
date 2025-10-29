'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { FileText } from 'lucide-react';
import { Waitlist } from './waitlist';

type Theme = 'system' | 'light' | 'dark';

export type ShipStickyHeaderProps = {
  /** Words that cycle under "you can …" */
  items?: string[];
  /** UI theme (affects color-scheme + switch color) */
  theme?: Theme;
  /** Enable view-timeline animations if supported */
  animate?: boolean;
  /** Accent hue (0–359) */
  hue?: number;
  /** Exact accent color (hex or any CSS color) - overrides hue */
  accentColor?: string;
  /** Path to logo image */
  logoSrc?: string;
  /** Logo alt text */
  logoAlt?: string;
  /** Social and docs links */
  links?: {
    twitter?: string;
    discord?: string;
    docs?: string;
  };
  /** Where the highlight band starts (vh) */
  startVh?: number; // default 50
  /** Space (vh) below the sticky header block */
  spaceVh?: number; // default 50
  /** Debug outline (for dev) */
  debug?: boolean;
  /** Optional custom intro text under the header */
  taglineHTML?: string; // allows <br />
};

function WordHeroPage({
  items = ['design.', 'prototype.', 'solve.', 'build.', 'develop.', 'cook.', 'ship.'],
  theme = 'system',
  animate = true,
  hue = 280,
  accentColor,
  logoSrc,
  logoAlt = 'Logo',
  links,
  startVh = 50,
  spaceVh = 50,
  debug = false,
  taglineHTML = `and i&apos;ll show you how.<br /><a href="https://rahil.pro">rahil.pro</a>.`,
}: ShipStickyHeaderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.animate = String(animate);
    root.dataset.debug = String(debug);
    root.style.setProperty('--hue', String(hue));
    if (accentColor) {
      root.style.setProperty('--accent-color', accentColor);
    }
    root.style.setProperty('--start', `${startVh}vh`);
    root.style.setProperty('--space', `${spaceVh}vh`);
  }, [theme, animate, debug, hue, accentColor, startVh, spaceVh]);

  return (
    <div
      className="min-h-screen w-screen"
      style={
        {
          // keep count in sync with CSS sticky offset math
          ['--count' as any]: items.length,
        } as React.CSSProperties
      }
    >
      {logoSrc && (
        <div className="logo-container">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={120}
            height={120}
            className="hero-logo"
            priority
          />
        </div>
      )}
      {links && (
        <nav className="nav-links">
          {links.twitter && (
            <a
              href={links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              aria-label="Follow us on X"
            >
              <svg width="20" height="20" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor"/>
              </svg>
            </a>
          )}
          {links.discord && (
            <a
              href={links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              aria-label="Join our Discord"
            >
              <svg width="20" height="20" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
              </svg>
            </a>
          )}
          {links.docs && (
            <a
              href={links.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link nav-link-text"
              aria-label="Read documentation"
            >
              <FileText size={18} />
              <span>Docs</span>
            </a>
          )}
        </nav>
      )}
      <header className="content fluid">
        <section className="content">
          <h1 className="sr-only sm:not-sr-only">
            <span aria-hidden="true">you can&nbsp;</span>
            <span className="sr-only">you can ship things.</span>
          </h1>

          {/* Visible cycling words (aria-hidden) */}
          <ul aria-hidden="true">
            {items.map((word, i) => (
              <li key={i} style={{ ['--i' as any]: i } as React.CSSProperties}>
                {word}
              </li>
            ))}
          </ul>
        </section>
      </header>

      <main>
        <section>
          <p
            className="fluid"
            dangerouslySetInnerHTML={{ __html: taglineHTML }}
          />
        </section>
      </main>

      {/* Footer with Waitlist */}
      <footer className="page-footer">
        <Waitlist />
      </footer>

      {/* Styles ported and condensed; uses CSS custom props like the original */}
      <style jsx global>{`
        @layer base, stick, demo, debug;

        :root {
          --start: 50vh;
          --space: 50vh;
          --hue: 280;
          --accent: light-dark(hsl(var(--hue) 100% 50%), hsl(var(--hue) 90% 75%));
          --switch: canvas;
          --font-size-min: 14;
          --font-size-max: 20;
          --font-ratio-min: 1.1;
          --font-ratio-max: 1.33;
          --font-width-min: 375;
          --font-width-max: 1500;
        }
        :root[style*="--accent-color"] {
          --accent: var(--accent-color);
        }
        [data-theme='dark'] { --switch: #000; color-scheme: dark only; }
        [data-theme='light'] { --switch: #fff; color-scheme: light only; }
        html { color-scheme: light dark; scrollbar-color: var(--accent) #0000; }
        *, *::before, *::after { box-sizing: border-box; }

        body {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica Neue, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji;
          background: light-dark(white, black);
        }

        /* Screen grid background */
        body::before {
          --size: 45px; --line: color-mix(in hsl, canvasText, transparent 80%);
          content: '';
          position: fixed; inset: 0; z-index: -1;
          background:
            linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size))
              calc(var(--size) * 0.36) 50% / var(--size) var(--size),
            linear-gradient(var(--line) 1px, transparent 1px var(--size)) 0%
              calc(var(--size) * 0.32) / var(--size) var(--size);
          mask: linear-gradient(-20deg, transparent 50%, white);
          pointer-events: none;
        }

        /* Utilities */
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
        }
        .fluid {
          --fluid-min: calc(var(--font-size-min) * pow(var(--font-ratio-min), var(--font-level, 0)));
          --fluid-max: calc(var(--font-size-max) * pow(var(--font-ratio-max), var(--font-level, 0)));
          --fluid-preferred: calc((var(--fluid-max) - var(--fluid-min)) / (var(--font-width-max) - var(--font-width-min)));
          --fluid-type: clamp(
            (var(--fluid-min) / 16) * 1rem,
            ((var(--fluid-min) / 16) * 1rem)
              - (((var(--fluid-preferred) * var(--font-width-min)) / 16) * 1rem)
              + (var(--fluid-preferred) * var(--variable-unit, 100vi)),
            (var(--fluid-max) / 16) * 1rem
          );
          font-size: var(--fluid-type);
        }

        /* Logo */
        .logo-container {
          position: fixed !important;
          top: 1rem !important;
          left: 1rem !important;
          z-index: 100 !important;
          display: flex !important;
          align-items: center !important;
        }
        .hero-logo {
          width: 50px !important;
          height: 50px !important;
          max-width: 50px !important;
          object-fit: contain !important;
          display: block !important;
        }
        
        @media (min-width: 640px) {
          .logo-container {
            top: 1.5rem !important;
            left: 1.5rem !important;
          }
          .hero-logo {
            width: 60px !important;
            height: 60px !important;
            max-width: 60px !important;
          }
        }
        
        @media (min-width: 1024px) {
          .logo-container {
            top: 2rem !important;
            left: 2rem !important;
          }
          .hero-logo {
            width: 70px !important;
            height: 70px !important;
            max-width: 70px !important;
          }
        }

        /* Navigation Links */
        .nav-links {
          position: fixed !important;
          top: 1rem !important;
          right: 1rem !important;
          z-index: 100 !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.75rem !important;
          height: 50px !important;
        }
        .nav-link {
          color: canvasText;
          opacity: 0.8;
          transition: opacity 0.2s ease, color 0.2s ease;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.5rem;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          height: 100%;
        }
        .nav-link svg {
          display: block;
        }
        .nav-link:hover {
          opacity: 1;
          color: var(--accent);
        }
        .nav-link-text span {
          display: none;
        }
        
        @media (min-width: 640px) {
          .nav-links {
            top: 1.5rem !important;
            right: 1.5rem !important;
            gap: 1rem !important;
            height: 60px !important;
          }
        }
        
        @media (min-width: 1024px) {
          .nav-links {
            top: 2rem !important;
            right: 2rem !important;
            gap: 1.5rem !important;
            height: 70px !important;
          }
          .nav-link-text span {
            display: inline-block;
          }
        }

        /* Sticky header logic */
        header {
          --font-level: 4;
          --font-size-min: 16;
          position: sticky;
          top: calc((var(--count) - 1) * -1lh);
          line-height: 1.2;
          display: flex;
          align-items: start;
          width: 100%;
          margin-bottom: var(--space);
          padding: 0 1rem;
        }
        header section:first-of-type {
          display: flex; width: 100%;
          align-items: start; justify-content: center;
          padding-top: calc(var(--start) - 0.5lh);
        }
        header section:first-of-type h1 {
          position: sticky; top: calc(var(--start) - 0.5lh);
          margin: 0; font-weight: 600;
        }
        
        @media (min-width: 640px) {
          header {
            --font-size-min: 20;
          }
        }
        
        @media (min-width: 1024px) {
          header {
            --font-size-min: 24;
            padding: 0;
          }
        }

        ul {
          font-weight: 600; list-style: none; padding: 0; margin: 0;
        }

        li {
          --dimmed: color-mix(in oklch, canvasText, #0000 80%);
          background:
            linear-gradient(
              180deg,
              var(--dimmed) 0 calc(var(--start) - 0.5lh),
              var(--accent) calc(var(--start) - 0.55lh) calc(var(--start) + 0.55lh),
              var(--dimmed) calc(var(--start) + 0.5lh)
            );
          background-attachment: fixed;
          color: #0000;
          background-clip: text;
        }

        main {
          width: 100%; height: 100vh; position: relative; z-index: 2; color: canvas;
        }
        main::before {
          content: ''; position: absolute; inset: 0; z-index: -1;
          background: light-dark(#000, #fff); border-radius: 1rem 1rem 0 0;
        }
        main section {
          --font-level: 4; --font-size-min: 16;
          height: 100%; width: 100%; display: flex; align-items: center; justify-content: center;
          padding: 0 1.5rem;
          padding-top: 10vh;
        }
        main section p {
          margin: 0; font-weight: 600; text-align: center;
          max-width: 95vw;
          word-wrap: break-word;
        }
        main section p br {
          display: block;
        }
        main section p div {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1.5rem;
        }
        main section p div img {
          max-width: 300px;
          width: 100%;
          height: auto;
        }
        main section a {
          color: var(--accent); text-decoration: none; text-underline-offset: 0.1lh;
        }
        main section a:is(:hover, :focus-visible) { text-decoration: underline; }
        
        @media (min-width: 640px) {
          main section {
            --font-size-min: 18;
          }
          main section p div img {
            max-width: 375px;
          }
        }
        
        @media (min-width: 1024px) {
          main section {
            --font-size-min: 20;
          }
          main section p {
            max-width: none;
          }
          main section p div img {
            max-width: 450px;
          }
        }

        /* Footer */
        .page-footer {
          width: 100%;
          background: light-dark(#000, #fff);
          color: light-dark(#fff, #000);
          position: relative;
          z-index: 2;
        }

        /* View-timeline progressive enhancement */
        @supports (animation-timeline: view()) {
          [data-animate='true'] main { view-timeline: --section; }
          [data-animate='true'] main::before {
            transform-origin: 50% 100%;
            scale: 0.9;
            animation: grow both ease-in-out;
            animation-timeline: --section;
            animation-range: entry 50%;
          }
          [data-animate='true'] main section p {
            position: fixed; 
            top: 35%; 
            left: 50%; 
            translate: -50% -50%;
            animation: reveal both ease-in-out;
            animation-timeline: --section;
            animation-range: entry 50%;
          }
          @keyframes reveal { from { opacity: 0; } to { opacity: 1; } }
          @keyframes grow { to { scale: 1; border-radius: 0; } }
        }

        /* Debug */
        [data-debug='true'] li { outline: 0.05em dashed currentColor; }
        [data-debug='true'] :is(h2, li:last-of-type) { outline: 0.05em dashed canvasText; }
      `}</style>
    </div>
  );
}

export { WordHeroPage };

