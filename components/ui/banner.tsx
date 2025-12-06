"use client";

import React from 'react';
import { ExternalLink } from 'lucide-react';

export function Banner() {
  return (
    <div className="banner-container fixed top-0 left-0 right-0 z-[10000] hidden md:flex items-center justify-center px-4 pointer-events-none">
      <div className="flex items-center justify-center min-h-[42px] pointer-events-auto">
        <a
          href="https://testnet.megafi.app"
          target="_blank"
          rel="noopener noreferrer"
          className="orange-border relative w-full max-w-[490px] h-[42px] flex items-center justify-center gap-2 px-6 bg-black rounded-xl border-none text-white cursor-pointer font-medium text-sm transition-all duration-200 hover:bg-[#0a0a0a] group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3A1E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3A1E]"></span>
          </span>
          <span>Testnet is now LIVE</span>
          <ExternalLink size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
    </div>
  );
}

