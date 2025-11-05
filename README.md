# Megafi Landing V2

A modern Next.js landing page featuring a stunning scroll hero section with animated text transitions.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Scroll Hero Section** with smooth animations
- **Waitlist System** with countdown timer
- **OG NFT Claim** for top 410 MegaETH supporters (NEW!)
- **Supabase Auth** with Twitter OAuth
- **Responsive Design** optimized for all devices
- **Light/Dark Mode** support

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm
- Supabase account

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up environment variables (create `.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress  # For NFT claim
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
megafi-landing-v2/
├── app/
│   ├── api/
│   │   ├── claim/                    # NFT claim endpoints
│   │   ├── launch-date/              # Launch date API
│   │   └── waitlist/                 # Waitlist API
│   ├── claim-og-megaeth-nft/         # NFT claim page
│   │   └── page.tsx
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Global styles
├── components/
│   └── ui/
│       ├── scroll-hero-section.tsx   # Main hero component
│       └── waitlist.tsx              # Countdown timer
├── lib/
│   ├── contract-abi.ts               # NFT contract config
│   ├── providers.tsx                 # Web3 providers
│   ├── supabase.ts                   # Supabase client
│   └── wagmi-config.ts               # Ethereum config
├── supabase/
│   ├── 01_create_waitlist_emails.sql
│   ├── 02_create_launch_config.sql
│   └── 03_create_og_nft_claims.sql   # NFT tables
├── scripts/
│   └── import-handles.ts             # CSV import utility
└── package.json
```

## OG NFT Claim Feature

We've added a complete NFT claiming system for the top 410 MegaETH community supporters!

### Quick Links

- **🚀 Quick Start:** [`OG_NFT_QUICKSTART.md`](OG_NFT_QUICKSTART.md) - **START HERE!**
- **📖 Full Documentation:** [`OG_NFT_IMPLEMENTATION.md`](OG_NFT_IMPLEMENTATION.md)
- **⚙️ Environment Setup:** [`ENV_SETUP_OG_NFT.md`](ENV_SETUP_OG_NFT.md)
- **✅ Setup Complete:** [`SETUP_COMPLETE.md`](SETUP_COMPLETE.md)
- **📊 CSV Import:** [`scripts/README.md`](scripts/README.md)

### What's Included

✅ **Supabase Auth** with Twitter OAuth (simpler than NextAuth!)  
✅ Eligibility verification against whitelist  
✅ RainbowKit wallet connection  
✅ On-chain NFT minting on Ethereum  
✅ Claim tracking in Supabase  
✅ Multi-step UI with progress indicators  
✅ CSV import utility for eligible handles  

### Access the Feature

Navigate to: `/claim-og-megaeth-nft`

### Setup (5 Minutes)

1. **Enable Twitter Auth in Supabase:**
   - Dashboard → Authentication → Providers → Twitter
   - Add your Twitter OAuth credentials
   - No environment variables needed!

2. **Add Contract Details:**
   - Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`
   - Update ABI in `lib/contract-abi.ts`

3. **Run Database Migration:**
   - Open Supabase SQL Editor
   - Run `supabase/03_create_og_nft_claims.sql`

4. **Import Eligible Handles:**
   ```bash
   npx tsx scripts/import-handles.ts twitter_handles.csv
   ```

5. **Test:**
   - Visit `/claim-og-megaeth-nft`
   - Connect with X account
   - Test the flow!

### Why Supabase Auth?

We chose Supabase Auth over NextAuth because:

- ✅ **Simpler** - No extra dependencies or config files
- ✅ **Better integrated** - Works seamlessly with your existing Supabase setup
- ✅ **Automatic** - Built-in session management and token refresh
- ✅ **Secure** - Enterprise-grade authentication
- ✅ **User-friendly** - Built-in user dashboard in Supabase
- ✅ **Cost-effective** - No additional auth service needed

## Component Usage

The `WordHeroPage` component accepts the following props:

- `items`: Array of words to cycle through
- `showFooter`: Show/hide footer (default: true)
- `theme`: Theme mode - 'system', 'light', or 'dark' (default: 'system')
- `animate`: Enable view-timeline animations (default: true)
- `hue`: Accent color hue 0-359 (default: 280)
- `startVh`: Where the highlight band starts in vh (default: 50)
- `spaceVh`: Space below the sticky header in vh (default: 50)
- `debug`: Show debug outlines (default: false)
- `taglineHTML`: Custom intro text with HTML support

### Example Usage

```tsx
import { WordHeroPage } from "@/components/ui/scroll-hero-section";

export default function Home() {
  return (
    <WordHeroPage
      items={['create.', 'innovate.', 'launch.', 'succeed.']}
      theme="dark"
      animate
      hue={200}
      taglineHTML={`your journey starts here.<br /><a href="https://example.com">learn more</a>.`}
    />
  );
}
```

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Supabase](https://supabase.com/) - Database & Auth
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection
- [wagmi](https://wagmi.sh/) - Ethereum interactions
- [viem](https://viem.sh/) - Ethereum utilities

## License

MIT
