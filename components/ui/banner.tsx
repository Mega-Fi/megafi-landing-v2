"use client";

import React from 'react';
import { ExternalLink } from 'lucide-react';

export function Banner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] flex items-center justify-center px-4 pb-4 pointer-events-none banner-container">
        <div className="relative flex items-center justify-center group pointer-events-auto">
          {/* Multiple glowing layers for depth effect */}
          <div className="banner-glow-1 absolute z-[-1] overflow-hidden h-full w-full max-h-[50px] max-w-[500px] rounded-xl blur-[3px] 
                          before:absolute before:content-[''] before:z-[-2] before:w-[999px] before:h-[999px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-60
                          before:bg-[conic-gradient(#000,#FF3A1E_5%,#000_38%,#000_50%,#FF6B3D_60%,#000_87%)]">
          </div>
          <div className="banner-glow-2 absolute z-[-1] overflow-hidden h-full w-full max-h-[48px] max-w-[498px] rounded-xl blur-[3px] 
                          before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                          before:bg-[conic-gradient(rgba(0,0,0,0),#8B1A0A,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#CC4A2E,rgba(0,0,0,0)_60%)]">
          </div>
          <div className="banner-glow-3 absolute z-[-1] overflow-hidden h-full w-full max-h-[46px] max-w-[496px] rounded-lg blur-[2px] 
                          before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg]
                          before:bg-[conic-gradient(rgba(0,0,0,0)_0%,#FF8C6B,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#FFB399,rgba(0,0,0,0)_58%)] before:brightness-140">
          </div>
          <div className="banner-glow-4 absolute z-[-1] overflow-hidden h-full w-full max-h-[44px] max-w-[494px] rounded-xl blur-[0.5px] 
                          before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-70
                          before:bg-[conic-gradient(#1c191c,#FF3A1E_5%,#1c191c_14%,#1c191c_50%,#FF6B3D_60%,#1c191c_64%)] before:brightness-130">
          </div>

          {/* Main banner content */}
          <a
            href="https://testnet.megafi.app"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-2 bg-[#010201] border-none w-full max-w-[490px] h-[42px] rounded-lg text-white px-6 text-sm font-medium hover:bg-[#0a0a0a] transition-all duration-300 group"
          >
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3A1E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3A1E]"></span>
              </span>
              <span>MegaFi testnet is now live</span>
              <ExternalLink size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </span>
          </a>
        </div>
      </div>
  );
}

