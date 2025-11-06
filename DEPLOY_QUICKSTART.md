# 🚀 Quick Start: Deploy to Production

**TL;DR:** Follow these steps in order to deploy your app to production.

## 📋 Prerequisites

- [ ] Vercel account (free tier works)
- [ ] Supabase project created
- [ ] Smart contract deployed to mainnet
- [ ] Twitter OAuth app created
- [ ] Code pushed to Git repository

---

## ⚡ Quick Deployment Steps

### 1️⃣ Deploy Whitelist Server (5 minutes)

```bash
cd MegaFi-9.5-Pass/whitelist-server
vercel
```

**Set environment variables in Vercel:**
- `OWNER_PRIVATE_KEY` (contract owner's private key)
- `CONTRACT_ADDRESS` (mainnet contract address)
- `RPC_URL` (mainnet RPC endpoint)
- `NODE_ENV=production`

**Note the deployment URL:** `https://your-whitelist-server.vercel.app`

---

### 2️⃣ Deploy Frontend (10 minutes)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Add New Project** → Import your repository
3. **Configure:**
   - Root Directory: `megafi-landing-v2`
   - Framework: Next.js (auto-detected)

4. **Set Environment Variables:**

```bash
# Supabase (get from Supabase Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Network & Contract
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourMainnetContractAddress

# Whitelist Server (from step 1)
WHITELIST_SERVER_URL=https://your-whitelist-server.vercel.app

# Optional
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
NEXT_PUBLIC_MIXPANEL_TOKEN=your-token
```

5. **Deploy** → Wait for build to complete

---

### 3️⃣ Configure Supabase (5 minutes)

1. **Update Redirect URLs:**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add: `https://your-frontend.vercel.app/claim`
   - Add: `https://your-frontend.vercel.app/**`

2. **Verify Twitter OAuth:**
   - Go to Authentication → Providers → Twitter
   - Ensure it's enabled
   - Verify callback URL: `https://your-project.supabase.co/auth/v1/callback`

---

### 4️⃣ Test Everything (5 minutes)

- [ ] Visit your production URL
- [ ] Test Twitter OAuth login
- [ ] Test eligibility check
- [ ] Test wallet connection
- [ ] Test NFT minting (on testnet first!)

---

## 🔐 About Supabase URL Security

**Your Supabase URL is safe to be public!** ✅

- Supabase URLs and anon keys are **designed** to be public
- Security comes from **Row Level Security (RLS)** policies
- The anon key has limited permissions
- Your current setup is secure

**What to keep private:**
- ❌ `SUPABASE_SERVICE_ROLE_KEY` (if you add one)
- ❌ `OWNER_PRIVATE_KEY` (whitelist server)
- ❌ Any admin credentials

---

## 📚 Full Documentation

For detailed instructions, see:
- **[PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)** - Complete deployment guide
- **[PRODUCTION_ENV_CHECKLIST.md](./PRODUCTION_ENV_CHECKLIST.md)** - Environment variables reference

---

## 🆘 Common Issues

**Build fails:**
- Check all environment variables are set
- Verify `NEXT_PUBLIC_*` prefix for client-side vars

**OAuth doesn't work:**
- Check redirect URLs in Supabase
- Verify Twitter callback URL

**Whitelist server errors:**
- Check `OWNER_PRIVATE_KEY` is set
- Verify wallet has ETH for gas
- Check RPC URL is correct

---

## ✅ You're Done!

Your app should now be live at: `https://your-frontend.vercel.app`

🎉 **Congratulations on deploying to production!**

