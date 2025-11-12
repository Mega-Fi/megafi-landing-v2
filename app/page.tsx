"use client";

import { useEffect } from "react";
import { WordHeroPage } from "@/components/ui/scroll-hero-section";
import { analytics, MIXPANEL_EVENTS } from "@/lib/mixpanel";

export default function Home() {
  useEffect(() => {
    // Track landing page view
    analytics.track(MIXPANEL_EVENTS.PAGE_VIEW_LANDING);
  }, []);

  return (
    <WordHeroPage
      items={["swap.", "earn.", "hedge.", "tokenize.", "automate."]}
      theme="system"
      animate
      accentColor="#FF3A1E"
      logoSrc="/megafi-logo.png"
      logoAlt="MegaFi Logo"
      links={{
        twitter: "https://x.com/megafi_app",
        discord: "https://discord.com/invite/EFTrPCREfZ",
        docs: "https://docs.megafi.app/",
      }}
      startVh={40}
      spaceVh={40}
      debug={false}
      showOGNFTBanner={true}
      taglineHTML={`The fastest app on the fastest chain.<br /><div style="margin-top: 1rem;"><img src="/megaeth-logo.svg" alt="MegaETH" /></div>`}
    />
  );
}
