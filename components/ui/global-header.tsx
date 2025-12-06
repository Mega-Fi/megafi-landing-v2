'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FileText, Sparkles } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';

export type GlobalHeaderProps = {
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
  /** Accent color for hover states */
  accentColor?: string;
};

export function GlobalHeader({
  logoSrc,
  logoAlt = 'MegaFi Logo',
  links,
  accentColor = '#FF3A1E',
}: GlobalHeaderProps) {
  return (
    <> 
      {logoSrc && logoSrc.trim() !== '' && (
        <div className="global-logo-container">
          <Link href="/" className="global-logo-link">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={120}
              height={120}
              // className="global-logo"
              priority
              className="h-8 w-auto sm:h-11 sm:w-auto lg:h-11 lg:w-auto hover:opacity-80 transition-opacity drop-shadow-lg"
            />
          </Link>
        </div>
      )}
      {links && (
        <nav 
          className="global-nav-links"
          style={{ '--accent-color': accentColor } as React.CSSProperties}
        >
          <Link href="/nft">
            <GlassButton size="sm" contentClassName="flex items-center gap-2">
              <Sparkles size={18} />
              <span>NFTs</span>
            </GlassButton>
          </Link>
          {links.docs && (
            <a
              href={links.docs}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read documentation"
            >
              <GlassButton size="sm" contentClassName="flex items-center gap-2">
                <FileText size={18} />
                <span>Docs</span>
              </GlassButton>
            </a>
          )}
        </nav>
      )}
    </>
  );
}

