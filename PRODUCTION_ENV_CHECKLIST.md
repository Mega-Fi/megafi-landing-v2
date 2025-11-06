# Production Environment Variables Checklist

Quick reference for all environment variables needed in production.

## 🔐 Frontend (Next.js) - Vercel Environment Variables

### Required Variables

```bash
# Supabase Configuration
# ⚠️ These ARE meant to be public - Supabase security comes from RLS policies
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Network Configuration
NEXT_PUBLIC_NETWORK=mainnet  # Use 'mainnet' for production

# NFT Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourMainnetContractAddress

# Whitelist Server URL
WHITELIST_SERVER_URL=https://your-whitelist-server.vercel.app
```

### Optional Variables

```bash
# WalletConnect (Recommended for better UX)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Mixpanel Analytics (Optional)
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token-here
```

### ⚠️ Security Notes

- **`NEXT_PUBLIC_*` variables are exposed to the browser** - this is intentional for Supabase
- Supabase security comes from **Row Level Security (RLS)** policies, not hiding the URL
- The anon key has limited permissions - only what RLS allows
- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` (if you add one) - keep it server-side only

---

## 🖥️ Whitelist Server - Vercel Environment Variables

### Required Variables

```bash
# Ethereum Configuration
OWNER_PRIVATE_KEY=0xYourContractOwnerPrivateKey  # ⚠️ NEVER commit this!
CONTRACT_ADDRESS=0xYourMainnetContractAddress
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
# Or: https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Network
NODE_ENV=production
NETWORK=mainnet
```

### Optional Variables

```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=10

# API Key for additional security (if implemented)
API_KEY=your-secret-api-key
WHITELIST_API_KEY=your-secret-api-key
```

### ⚠️ Critical Security

- **`OWNER_PRIVATE_KEY`** - NEVER commit to Git
- Store only in Vercel Environment Variables
- Use a dedicated wallet (not your main wallet)
- Fund with minimal ETH needed for gas

---

## 🗄️ Supabase Configuration

### Dashboard Settings

1. **Project URL:** `https://your-project-ref.supabase.co`
2. **Anon Key:** Found in Settings → API
3. **Service Role Key:** Found in Settings → API (keep secret!)

### OAuth Configuration

1. **Twitter OAuth:**
   - Go to Authentication → Providers → Twitter
   - Enable provider
   - Add Client ID and Client Secret
   - Callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`

2. **Redirect URLs:**
   - Add production domain: `https://your-domain.vercel.app/claim`
   - Add wildcard: `https://your-domain.vercel.app/**`

---

## 📝 Environment-Specific Values

### Development (.env.local)

```bash
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0xTestnetContractAddress
WHITELIST_SERVER_URL=http://localhost:3001
```

### Production (Vercel)

```bash
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0xMainnetContractAddress
WHITELIST_SERVER_URL=https://your-whitelist-server.vercel.app
```

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] All `NEXT_PUBLIC_*` variables are set
- [ ] `NEXT_PUBLIC_NETWORK=mainnet` for production
- [ ] Contract address is correct for mainnet
- [ ] Whitelist server URL is production URL
- [ ] Supabase URL and anon key are correct
- [ ] Twitter OAuth configured in Supabase
- [ ] Redirect URLs updated in Supabase
- [ ] Private keys stored securely (not in Git)
- [ ] RPC URL is production endpoint
- [ ] Owner wallet has sufficient ETH for gas

---

## 🔍 How to Verify Variables Are Set

### In Vercel Dashboard

1. Go to Project → Settings → Environment Variables
2. Check all variables are listed
3. Verify values are correct (not placeholder text)

### In Code (for debugging)

```typescript
// This will show in browser console (only for NEXT_PUBLIC_* vars)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// Server-side only (won't expose in browser)
console.log('Server URL:', process.env.WHITELIST_SERVER_URL);
```

### Build Verification

```bash
# Build locally to check for missing variables
npm run build

# Check build output for any warnings
```

---

## 🚨 Common Mistakes

1. ❌ **Using testnet values in production**
   - Always double-check `NEXT_PUBLIC_NETWORK=mainnet`

2. ❌ **Wrong contract address**
   - Verify mainnet contract address matches deployment

3. ❌ **Missing NEXT_PUBLIC_ prefix**
   - Client-side variables MUST have `NEXT_PUBLIC_` prefix

4. ❌ **Exposing service role key**
   - Never use `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`

5. ❌ **Committing .env files**
   - Always add `.env*` to `.gitignore`

6. ❌ **Using localhost URLs in production**
   - Update all URLs to production domains

---

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)

