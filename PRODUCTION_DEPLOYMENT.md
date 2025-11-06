# Production Deployment Guide

Complete guide for deploying MegaFi NFT Claim app to production.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase production database set up
- [ ] Smart contract deployed to mainnet
- [ ] Twitter OAuth configured in Supabase
- [ ] Domain name configured (optional)
- [ ] Analytics tracking verified

---

## 🔐 Supabase Security Configuration

### Important: Supabase URL & Keys

**Supabase URLs and ANON keys are designed to be public** - this is by design. Security comes from:

- **Row Level Security (RLS) policies** in your database
- **Anon key** has limited permissions (only what RLS allows)
- **Service role key** (NEVER expose this) - only for server-side admin operations

### Current Setup (Secure ✅)

Your current setup is secure because:

1. Client-side uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
2. Server-side API routes use the same (which is fine for RLS-protected queries) ✅
3. RLS policies protect your data ✅

### Optional: Enhanced Security for Server-Side

If you want extra security for admin operations, you can add a service role key for server-side only:

```bash
# Add to .env.local (NEVER commit this!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Then update server-side operations to use it when needed (only for admin operations that bypass RLS).

**For your current setup, keeping the anon key is fine** - your RLS policies protect everything.

---

## 🚀 Frontend Deployment (Vercel)

### Step 1: Prepare Repository

1. **Commit all changes:**

   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Verify build works locally:**
   ```bash
   npm run build
   ```

### Step 2: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New Project"**
3. **Import your Git repository** (GitHub/GitLab/Bitbucket)
4. **Configure project:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `megafi-landing-v2`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

#### Required Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Network Configuration (use 'mainnet' for production)
NEXT_PUBLIC_NETWORK=mainnet

# NFT Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourMainnetContractAddress

# WalletConnect (Optional but recommended)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Mixpanel Analytics (Optional)
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token-here

# Whitelist Server URL (your deployed whitelist server)
WHITELIST_SERVER_URL=https://your-whitelist-server.vercel.app
```

#### Environment-Specific Variables

Set these for **Production** environment:

- `NEXT_PUBLIC_NETWORK=mainnet`
- `NEXT_PUBLIC_CONTRACT_ADDRESS=<mainnet-contract-address>`
- `WHITELIST_SERVER_URL=<production-whitelist-server-url>`

Set these for **Preview** environment (for testing):

- `NEXT_PUBLIC_NETWORK=testnet`
- `NEXT_PUBLIC_CONTRACT_ADDRESS=<testnet-contract-address>`
- `WHITELIST_SERVER_URL=<testnet-whitelist-server-url>`

### Step 4: Update Supabase OAuth Redirect URLs

1. **Go to Supabase Dashboard** → Authentication → URL Configuration
2. **Add your production URL to Redirect URLs:**
   ```
   https://your-domain.vercel.app/claim
   https://your-domain.vercel.app/**
   ```
3. **Update Twitter OAuth Callback URL:**
   - Go to Twitter Developer Portal → Your App → Settings
   - Add: `https://your-project-ref.supabase.co/auth/v1/callback`
   - (This should already be set, but verify it's correct)

### Step 5: Deploy

1. **Click "Deploy"** in Vercel
2. **Wait for build to complete**
3. **Test your production URL**

---

## 🖥️ Whitelist Server Deployment (Vercel)

### Step 1: Prepare Server Directory

```bash
cd MegaFi-9.5-Pass/whitelist-server
```

### Step 2: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New Project"**
3. **Import your Git repository**
4. **Configure project:**
   - **Framework Preset:** Other
   - **Root Directory:** `MegaFi-9.5-Pass/whitelist-server`
   - **Build Command:** (leave empty - no build needed)
   - **Output Directory:** (leave empty)

### Step 3: Configure Environment Variables

In Vercel Dashboard → Your Whitelist Server Project → Settings → Environment Variables:

```bash
# Ethereum Configuration
PRIVATE_KEY=your-contract-owner-private-key
CONTRACT_ADDRESS=0xYourMainnetContractAddress
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
# Or use Infura: https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Network
NETWORK=mainnet

# Security
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

**⚠️ CRITICAL SECURITY:**

- **NEVER commit `PRIVATE_KEY` to Git**
- Store it only in Vercel Environment Variables
- Use a dedicated wallet for the contract owner (not your main wallet)
- Fund it with minimal ETH needed for transactions

### Step 4: Update Frontend Configuration

After deploying the whitelist server, update your frontend's `WHITELIST_SERVER_URL`:

```bash
WHITELIST_SERVER_URL=https://your-whitelist-server.vercel.app
```

### Step 5: Test Deployment

1. **Check health endpoint:**

   ```
   https://your-whitelist-server.vercel.app/api/health
   ```

2. **Test whitelist endpoint** (from your frontend):
   ```bash
   curl -X POST https://your-whitelist-server.vercel.app/api/whitelist \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
     -d '{"wallet_address": "0x..."}'
   ```

---

## 🗄️ Supabase Production Setup

### Step 1: Create Production Database

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Create a new project** (or use existing)
3. **Note your project URL and anon key**

### Step 2: Run Database Migrations

1. **Go to SQL Editor** in Supabase Dashboard
2. **Run migrations in order:**
   - `supabase/01_create_waitlist_emails.sql`
   - `supabase/02_create_launch_config.sql`
   - `supabase/03_create_og_nft_claims.sql`
   - `supabase/04_populate_og_eligible_handles.sql` (if you have this)

### Step 3: Configure Row Level Security (RLS)

Verify RLS policies are enabled:

- `og_eligible_handles`: Public read access ✅
- `og_nft_claims`: Authenticated users can insert/update their own records ✅

### Step 4: Import Eligible Handles

Use your import script or manually import eligible Twitter handles:

```bash
# If you have a CSV import script
npm run import-handles -- --csv twitter_handles.csv
```

Or use Supabase Dashboard → Table Editor → Import data

### Step 5: Configure Twitter OAuth

1. **Go to Authentication → Providers → Twitter**
2. **Enable Twitter provider**
3. **Add your Twitter OAuth credentials:**
   - Client ID
   - Client Secret
4. **Verify callback URL** is set correctly

---

## 🔧 Post-Deployment Checklist

### Frontend

- [ ] Test Twitter OAuth login
- [ ] Test eligibility check
- [ ] Test wallet connection
- [ ] Test NFT minting flow
- [ ] Verify analytics tracking
- [ ] Check error handling
- [ ] Test on mobile devices
- [ ] Verify all links work

### Whitelist Server

- [ ] Health endpoint responds
- [ ] Whitelist endpoint works
- [ ] CORS configured correctly
- [ ] Rate limiting works
- [ ] Error handling works

### Database

- [ ] Eligible handles imported
- [ ] RLS policies working
- [ ] Claims can be recorded
- [ ] Duplicate prevention works

### Security

- [ ] Environment variables not exposed in client bundle
- [ ] Private keys stored securely
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation working

---

## 🌐 Custom Domain Setup (Optional)

### Step 1: Add Domain in Vercel

1. **Go to Project Settings → Domains**
2. **Add your domain** (e.g., `claim.megafi.app`)
3. **Follow DNS configuration instructions**

### Step 2: Update Supabase Redirect URLs

Add your custom domain to Supabase:

```
https://claim.megafi.app/claim
https://claim.megafi.app/**
```

### Step 3: Update Environment Variables

No changes needed - Vercel handles domain routing automatically.

---

## 🐛 Troubleshooting

### Frontend Issues

**Build fails:**

- Check all environment variables are set
- Verify `NEXT_PUBLIC_*` variables are prefixed correctly
- Check for TypeScript errors: `npm run build` locally

**OAuth redirect fails:**

- Verify redirect URL in Supabase matches your domain
- Check Twitter OAuth callback URL is correct
- Verify `redirectTo` in `signInWithTwitter` matches your domain

**API routes fail:**

- Check Supabase environment variables
- Verify RLS policies allow the operations
- Check server logs in Vercel Dashboard

### Whitelist Server Issues

**CORS errors:**

- Verify `ALLOWED_ORIGINS` includes your frontend domain
- Check CORS configuration in `server.js`

**Transaction failures:**

- Verify `PRIVATE_KEY` is correct
- Check wallet has enough ETH for gas
- Verify `CONTRACT_ADDRESS` is correct
- Check RPC endpoint is working

**Rate limiting:**

- Adjust rate limits in `server.js` if needed
- Check Vercel function timeout limits

---

## 📊 Monitoring & Analytics

### Vercel Analytics

- **Go to Vercel Dashboard → Analytics**
- Monitor page views, performance, errors

### Mixpanel (if configured)

- **Check Mixpanel Dashboard**
- Verify events are tracking correctly
- Set up alerts for critical events

### Supabase Monitoring

- **Go to Supabase Dashboard → Logs**
- Monitor API usage
- Check for errors
- Monitor database performance

---

## 🔄 Updating Production

### Frontend Updates

1. **Make changes locally**
2. **Test locally:** `npm run dev`
3. **Commit and push:** `git push origin main`
4. **Vercel auto-deploys** (or manually trigger)

### Whitelist Server Updates

1. **Make changes locally**
2. **Test locally:** `npm run dev`
3. **Commit and push:** `git push origin main`
4. **Vercel auto-deploys**

### Database Updates

1. **Create migration SQL file**
2. **Run in Supabase SQL Editor**
3. **Test in production database**
4. **Document changes**

---

## 🆘 Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **RainbowKit Docs:** https://rainbowkit.com/docs

---

## ✅ Final Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Production database set up
- [ ] Eligible handles imported
- [ ] Twitter OAuth working
- [ ] Smart contract deployed to mainnet
- [ ] Frontend deployed and tested
- [ ] Whitelist server deployed and tested
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking verified
- [ ] Error monitoring set up
- [ ] Documentation updated

**You're ready to launch! 🚀**
