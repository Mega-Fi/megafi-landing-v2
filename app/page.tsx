import { WordHeroPage } from "@/components/ui/scroll-hero-section";

export default function Home() {
  return (
    <WordHeroPage
      items={['swap.', 'earn.', 'hedge.', 'tokenize.', 'automate.']}
      theme="system"
      animate
      accentColor="#FF3A1E"
      logoSrc="/megafi-logo.png"
      logoAlt="MegaFi Logo"
      links={{
        twitter: 'https://x.com/megafi_app',
        discord: 'https://discord.gg/aaA7YPTW',
        docs: 'https://docs.megafi.app/',
      }}
      startVh={40}
      spaceVh={40}
      debug={false}
      taglineHTML={`The fastest app on the fastest chain.<br /><div style="margin-top: 1rem;"><img src="/megaeth-logo.svg" alt="MegaETH" /></div>`}
    />
  );
}

