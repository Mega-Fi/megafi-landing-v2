'use client';

import { usePathname } from 'next/navigation';
import { GlobalHeader } from '@/components/ui/global-header';
import { Banner } from '@/components/ui/banner';
import { SocialLinks } from '@/components/ui/social-links';
import { MegaETHLogo } from '@/components/ui/megaeth-logo';

export function ConditionalHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (!isHomePage) {
    return null;
  }

  return (
    <>
      <Banner />
      <GlobalHeader
        logoSrc="/megafi-logo.svg"
        links={{
          docs: "https://docs.megafi.app/",
        }}
        accentColor="#FF3A1E"
      />
      <MegaETHLogo />
    </>
  );
}

export function ConditionalFooter() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (!isHomePage) {
    return null;
  }

  return (
    <SocialLinks
      links={{
        twitter: "https://x.com/megafi_app",
        discord: "https://discord.com/invite/EFTrPCREfZ",
        github: "https://github.com/Mega-Fi",
      }}
    />
  );
}

