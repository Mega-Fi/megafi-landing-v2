'use client';

import React from 'react';
import Image from 'next/image';

export function MegaETHLogo() {
  return (
    <div className="megaeth-logo-bottom-left">
      <a
        href="https://www.fluffle.tools/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Fluffle Tools"
        className="megaeth-logo-link"
      >
        <Image
          src="/megaeth-logo.svg"
          alt="MegaETH Logo"
          width={120}
          height={45}
          className="megaeth-logo"
          priority
        />
      </a>
    </div>
  );
}

