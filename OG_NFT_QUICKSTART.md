# 🚀 Quick Start: OG NFT Claim Feature

## What You Need Right Now

### 1. Supabase Account ✅ YOU ALREADY HAVE THIS

You're already using Supabase for the waitlist! We'll just enable Twitter authentication in your existing project.

### 2. Twitter Developer Credentials ⚠️ REQUIRED

Set up a Twitter Developer account to enable X authentication:

1. Go to: https://developer.twitter.com/en/portal/dashboard
2. Create a new app
3. Enable OAuth 2.0 (NOT 1.0a!)
4. Set callback URL: `https://vvpuwzuxcvipdcnkbqsn.supabase.co/auth/v1/callback`
5. Copy your Client ID and Client Secret

### 3. NFT Contract Details ⚠️ REQUIRED

You need to provide:
- Contract address (Ethereum Mainnet)
- Contract ABI (JSON format)

Update these in:
- `.env.local` - Add `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `lib/contract-abi.ts` - Replace the placeholder ABI

### 4. CSV File with 410 X Handles ✅ YOU HAVE THIS

I can see `twitter_handles.csv` in your project! Ready to import.

## Setup in 5 Minutes

### Step 1: Enable Twitter Auth in Supabase (2 minutes)

1. Open Supabase Dashboard → **Authentication** → **Providers**
2. Find **Twitter** and click **Enable**
3. Paste your Twitter **Client ID**
4. Paste your Twitter **Client Secret**
5. Click **Save**

**Done!** No NextAuth, no extra config files, no additional environment variables needed.

### Step 2: Update Environment Variables (1 minute)

Your `.env.local` should have:

```bash
# You already have these from waitlist setup
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Add these new ones
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id  # Optional
```

### Step 3: Run Database Migration (30 seconds)

1. Open Supabase SQL Editor
2. Copy contents of `supabase/03_create_og_nft_claims.sql`
3. Paste and click **Run**

### Step 4: Import X Handles (30 seconds)

You have `twitter_handles.csv` ready! Import it:

```bash
npm run dev  # Make sure server is running first
npx tsx scripts/import-handles.ts twitter_handles.csv
```

### Step 5: Update Contract ABI (1 minute)

Edit `lib/contract-abi.ts` and replace the placeholder ABI with your actual contract ABI.

### Step 6: Test! (2 minutes)

Visit: http://localhost:3000/claim-og-megaeth-nft

## Why Supabase Auth is Better

**Before (NextAuth):**
- Install next-auth package ❌
- Create auth API routes ❌
- Add 4 environment variables ❌
- Generate NextAuth secret ❌
- Configure callbacks and sessions ❌
- Manage JWT tokens ❌

**Now (Supabase Auth):**
- Enable Twitter provider in dashboard ✅
- Done! ✅

## Comparison

| Feature | NextAuth | Supabase Auth |
|---------|----------|---------------|
| Setup Time | 15 minutes | 2 minutes |
| Environment Variables | 4 new | 0 new |
| Code Files | 3 files | 0 files |
| Dependencies | next-auth package | Already installed |
| Session Management | Manual JWT | Automatic |
| User Management | Custom DB | Built-in dashboard |

## What Each File Does

| File | Purpose |
|------|---------|
| `app/claim-og-megaeth-nft/page.tsx` | Main claim page UI with Supabase Auth |
| `app/api/claim/check-eligibility/route.ts` | Checks if X handle is eligible |
| `app/api/claim/record-claim/route.ts` | Records successful NFT claim |
| `app/api/claim/upload-handles/route.ts` | Bulk import X handles |
| `lib/wagmi-config.ts` | Ethereum network config |
| `lib/contract-abi.ts` | NFT contract details |
| `lib/providers.tsx` | Web3 providers |
| `lib/supabase.ts` | Supabase client (updated for auth) |
| `supabase/03_create_og_nft_claims.sql` | Database tables |
| `scripts/import-handles.ts` | CSV import utility |

## Twitter OAuth Setup (Detailed)

### Get Twitter API Credentials

1. Visit: https://developer.twitter.com/en/portal/dashboard
2. Create a new app (or use existing)
3. Go to app **Settings**
4. Click **Set up** under "User authentication settings"
5. Enable **OAuth 2.0**
6. Set **App permissions**: Read
7. Set **Type of App**: Web App
8. **Callback URLs**: Add your Supabase callback
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   Get YOUR_PROJECT_REF from Supabase dashboard (Settings > API > Project URL)
9. **Website URL**: `http://localhost:3000` (for dev)
10. Save and copy your **Client ID** and **Client Secret**

### Configure in Supabase

1. Supabase Dashboard → Authentication → Providers
2. Find Twitter, click to expand
3. Toggle **Enable Twitter provider**
4. Paste Client ID
5. Paste Client Secret
6. Save

## Testing Checklist

- [ ] Twitter auth works (can connect and see handle)
- [ ] Eligible handle shows "You're Eligible!"
- [ ] Non-eligible handle shows error
- [ ] Can connect wallet
- [ ] Mint button appears when wallet connected
- [ ] Transaction can be submitted (test on testnet first!)
- [ ] Success page shows after mint
- [ ] Claim is recorded in database

## Common Issues

### "Twitter OAuth not working"
- **Solution**: Check callback URL in Twitter app matches Supabase exactly
- Format: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- Verify OAuth 2.0 is enabled (not 1.0a)

### "Contract call failed"  
- **Solution**: Verify contract address and ABI are correct
- Make sure you're on Ethereum Mainnet
- User needs ETH for gas

### "Handle not eligible"  
- **Solution**: Verify handle was imported correctly
- Check database: `SELECT * FROM og_eligible_handles WHERE twitter_handle ILIKE '%handlename%';`

### "Twitter handle not found in user metadata"
- **Solution**: Complete OAuth flow fully
- Check user metadata in Supabase Auth dashboard
- Twitter handle is stored in `user_metadata.user_name`

## Production Checklist

Before going live:

- [ ] Twitter OAuth callback updated to production URL
- [ ] Twitter app website URL updated to production domain
- [ ] Contract deployed to Ethereum Mainnet
- [ ] All 410 handles imported
- [ ] Tested complete flow on testnet
- [ ] Monitoring set up for failed transactions
- [ ] User support documentation prepared

## Import Your Handles Now!

You have `twitter_handles.csv` ready. Let's import it:

```bash
# Start dev server (if not already running)
npm run dev

# In another terminal, import the handles
npx tsx scripts/import-handles.ts twitter_handles.csv
```

Expected output:
```
📁 Reading CSV: twitter_handles.csv

📊 Found 283 handles in CSV

📤 Sending to API endpoint...
✅ Success! 283 handles uploaded to database
```

## Verify Import

Check that handles were imported:

1. Open Supabase Dashboard
2. Go to Table Editor → `og_eligible_handles`
3. You should see 283 rows (or however many are in your CSV)

Or run in SQL Editor:
```sql
SELECT COUNT(*) FROM og_eligible_handles;
```

## Next Steps

1. ✅ Complete Twitter OAuth setup in Supabase
2. ✅ Import your X handles (you have the CSV!)
3. ✅ Add contract address and ABI
4. ✅ Test on localhost
5. 🚀 Deploy!

## Need Help?

- **Environment Setup:** See `ENV_SETUP_OG_NFT.md`
- **Full Documentation:** See `OG_NFT_IMPLEMENTATION.md`
- **Import CSV:** See `scripts/README.md`

---

**Total Setup Time:** ~5 minutes  
**Difficulty:** Easy (just enable Twitter in Supabase!)  
**Much simpler than NextAuth!** ✨
