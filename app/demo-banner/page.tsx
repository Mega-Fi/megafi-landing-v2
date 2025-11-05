import { OGNFTBanner } from '@/components/ui/og-nft-banner';

export default function DemoBanner() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3rem',
        padding: '2rem',
        backgroundColor: 'oklch(0.145 0 0)',
      }}
    >
      <div style={{ textAlign: 'center', marginTop: '6rem' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>
          OG NFT Banner Demo
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          This banner is displayed at the top of the page with a fixed position
        </p>
      </div>

      {/* Banner with default MegaFi color */}
      <OGNFTBanner color="#FF3A1E" visible={true} />

      <div style={{ textAlign: 'center', color: 'white', maxWidth: '700px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Features</h2>
        <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <li>✨ Animated electric border effect (swirl pattern)</li>
          <li>🎨 Customizable accent color</li>
          <li>📱 Fully responsive design (900-1200px wide on desktop)</li>
          <li>✋ Interactive hover states</li>
          <li>🔗 Links to /claim-og-megaeth-nft page</li>
          <li>⚡ Smooth slide-down animation on load</li>
          <li>💎 Glass morphism badge design</li>
          <li>🌟 Glowing CTA button</li>
          <li>📏 Expanded layout shows full text content</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', color: 'white', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Usage</h2>
        <pre
          style={{
            backgroundColor: 'oklch(0.2 0 0)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            textAlign: 'left',
            overflow: 'auto',
            fontSize: '0.875rem',
          }}
        >
          {`import { OGNFTBanner } from '@/components/ui/og-nft-banner';

// Basic usage
<OGNFTBanner />

// With custom color
<OGNFTBanner color="#FF3A1E" />

// Toggle visibility
<OGNFTBanner visible={true} />

// Add to hero section
<WordHeroPage
  showOGNFTBanner={true}
  accentColor="#FF3A1E"
  // ... other props
/>`}
        </pre>
      </div>
    </main>
  );
}

