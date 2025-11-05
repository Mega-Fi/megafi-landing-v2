# Environment Setup for OG NFT Claim Feature

## Required Environment Variables

Add these variables to your `.env.local` file:

```bash
# Existing Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Ethereum Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
NEXT_PUBLIC_NETWORK=testnet

# WalletConnect Project ID (Optional but recommended)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
```

## Setup Steps

### 1. Configure Twitter OAuth in Supabase (10 minutes)

Supabase handles all authentication! No need for NextAuth or additional services.

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Twitter** in the list
4. Click **Enable**

#### Get Twitter API Credentials

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or use an existing one
3. Navigate to your app settings
4. Under "User authentication settings", click **Set up**
5. Enable **OAuth 2.0**
6. Set App permissions to **Read**
7. Set Type of App to **Web App**
8. Add Callback URL: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Get your project ref from Supabase: Settings > API > Project URL
   - Example: `https://abcdefghijklm.supabase.co/auth/v1/callback`
9. Add Website URL: `http://localhost:3000` (for dev)
10. Copy your **Client ID** and **Client Secret**

#### Configure in Supabase

Back in Supabase Authentication > Providers > Twitter:

1. Paste your **Twitter Client ID**
2. Paste your **Twitter Client Secret**
3. Click **Save**

**That's it!** Supabase handles everything else including:
- OAuth flow
- Session management  
- Token refresh
- User metadata storage

### 2. NFT Smart Contract Configuration

Update `lib/contract-abi.ts` with your actual contract details:

1. Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local` with your deployed contract address
2. Replace the placeholder ABI in `lib/contract-abi.ts` with your actual contract ABI
3. Ensure the mint function signature matches your contract

Example contract ABI structure:
```typescript
export const NFT_CONTRACT_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'to', type: 'address' }
    ],
    outputs: [
      { name: 'tokenId', type: 'uint256' }
    ],
  },
  // ... other functions
] as const;
```

### 3. WalletConnect Project ID (Optional)

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID
4. Add to `.env.local` as `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

This enables better wallet connection experience.

### 4. Database Setup

Run the SQL migration in your Supabase dashboard:

1. Open Supabase SQL Editor
2. Run `supabase/03_create_og_nft_claims.sql`
3. Verify tables are created:
   - `og_eligible_handles`
   - `og_nft_claims`

### 5. Import Eligible Handles

Import the 410 eligible X handles using one of these methods:

**Method 1: Using the import script**
```bash
npx tsx scripts/import-handles.ts twitter_handles.csv
```

**Method 2: Via API endpoint**
```bash
curl -X POST http://localhost:3000/api/claim/upload-handles \
  -H "Content-Type: application/json" \
  -d '{"handles": ["user1", "user2", "user3"]}'
```

**Method 3: Direct SQL**
```sql
INSERT INTO og_eligible_handles (twitter_handle) VALUES
  ('user1'), ('user2'), ('user3')
ON CONFLICT (twitter_handle) DO NOTHING;
```

## Testing the Setup

1. Start the development server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/claim-og-megaeth-nft`

3. Test the flow:
   - Click "Connect with X"
   - Authorize the Supabase app
   - Verify eligibility (use a handle from your imported list)
   - Connect wallet
   - Test mint (on testnet first!)

## Production Deployment Checklist

- [ ] Update Twitter OAuth callback URL in Twitter Developer Portal to production
  - Format: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- [ ] Update Website URL in Twitter app to production domain
- [ ] Ensure contract is deployed to Ethereum Mainnet
- [ ] Import all 410 eligible handles
- [ ] Test complete flow on testnet first
- [ ] Verify gas estimation is reasonable
- [ ] Set up monitoring for failed transactions
- [ ] Prepare support documentation for users

## Why Supabase Auth is Better

✅ **No extra dependencies** - Uses your existing Supabase setup  
✅ **No additional environment variables** - Twitter creds stored in Supabase dashboard  
✅ **Automatic session management** - Built-in session handling  
✅ **Better security** - Credentials never exposed to client  
✅ **Easier maintenance** - One auth system instead of two  
✅ **Built-in user management** - View users in Supabase dashboard  

## Troubleshooting

### Twitter OAuth not working
- Verify callback URL matches exactly in Twitter Developer Portal
- Check OAuth 2.0 is enabled (not 1.0a)
- Ensure app permissions are set to "Read"
- Verify Twitter provider is enabled in Supabase

### Wallet not connecting
- Check WalletConnect Project ID is valid
- Verify network configuration in `lib/wagmi-config.ts`
- Test with multiple wallet providers

### Mint transaction failing
- Verify contract address is correct
- Check ABI matches deployed contract
- Ensure user has enough ETH for gas
- Test on testnet first

### Database errors
- Verify RLS policies are enabled
- Check Supabase credentials
- Ensure tables were created correctly

### "User metadata doesn't contain Twitter handle"
- Check that Twitter provider is properly configured in Supabase
- Verify user has completed OAuth flow
- Check user metadata in Supabase Authentication dashboard

## Support

For issues or questions:
1. Check the documentation in `/scripts/README.md`
2. Review the Supabase migration files
3. Test each component independently
4. Check Supabase Auth logs in dashboard
