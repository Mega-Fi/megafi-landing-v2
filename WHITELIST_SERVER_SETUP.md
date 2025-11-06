# Whitelist Server Integration - Setup Guide

## ✅ What Was Fixed

The frontend was **NOT calling the whitelist-server** at `http://localhost:3001/`. This has been fixed!

## 🔧 Changes Made

### 1. Created API Route
**File:** `app/api/claim/whitelist-wallet/route.ts`

This route proxies requests to your whitelist-server:
- `POST /api/claim/whitelist-wallet` - Whitelists a wallet address
- `GET /api/claim/whitelist-wallet?address=0x...` - Checks whitelist status

### 2. Updated Frontend
**File:** `app/claim-og-megaeth-nft/page.tsx`

Added:
- Auto-whitelisting when wallet connects
- Whitelist status checking
- UI feedback for whitelisting process
- Mint button only shows when wallet is whitelisted

### 3. Environment Variable
**File:** `env.example`

Added `WHITELIST_SERVER_URL` configuration

---

## 🚀 Setup Instructions

### Step 1: Add Environment Variable

Add to your `.env.local` file:

```bash
# Whitelist Server URL
WHITELIST_SERVER_URL=http://localhost:3001
```

**For Production:**
```bash
WHITELIST_SERVER_URL=https://your-whitelist-server.vercel.app
```

### Step 2: Start Whitelist Server

Make sure your whitelist-server is running:

```bash
cd MegaFi-9.5-Pass/whitelist-server
npm install
npm start
```

**Verify it's running:**
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "ok",
  "service": "whitelist-server",
  "ownerVerified": true,
  ...
}
```

### Step 3: Test the Flow

1. **Start Next.js dev server:**
   ```bash
   cd megafi-landing-v2
   npm run dev
   ```

2. **Visit:** `http://localhost:3000/claim-og-megaeth-nft`

3. **Connect Twitter** ✅

4. **Connect Wallet** ✅

5. **Watch the console:**
   - Should see: `[Frontend] Checking whitelist status for: 0x...`
   - Should see: `[Whitelist API] Calling whitelist-server at http://localhost:3001/api/whitelist`
   - Should see: `[Frontend] Wallet whitelisted successfully: 0x...`

6. **Check whitelist-server logs:**
   - Should see: `📝 Whitelisting address: 0x...`
   - Should see: `✅ Transaction confirmed!`

---

## 🔍 How It Works Now

### Flow Diagram:

```
1. User connects Twitter ✅
   ↓
2. Eligibility checked (Twitter handle in database) ✅
   ↓
3. User connects wallet ✅
   ↓
4. Frontend automatically calls:
   GET /api/claim/whitelist-wallet?address=0x...
   ↓
5. Next.js API route proxies to:
   GET http://localhost:3001/api/status/0x...
   ↓
6. If not whitelisted, frontend calls:
   POST /api/claim/whitelist-wallet
   ↓
7. Next.js API route proxies to:
   POST http://localhost:3001/api/whitelist
   ↓
8. Whitelist-server calls smart contract:
   contract.addToWhitelist([address])
   ↓
9. Transaction confirmed on blockchain ✅
   ↓
10. Frontend shows "Wallet Whitelisted!" ✅
   ↓
11. "Mint NFT" button appears ✅
   ↓
12. User clicks mint ✅
   ↓
13. NFT minted successfully! 🎉
```

---

## 🐛 Troubleshooting

### Issue: "Failed to connect to whitelist server"

**Cause:** Whitelist-server not running or wrong URL

**Fix:**
1. Check whitelist-server is running: `curl http://localhost:3001/api/health`
2. Verify `.env.local` has: `WHITELIST_SERVER_URL=http://localhost:3001`
3. Restart Next.js dev server after adding env var

### Issue: "Whitelist API Error: OWNER_PRIVATE_KEY is required"

**Cause:** Whitelist-server missing environment variables

**Fix:**
1. Check `MegaFi-9.5-Pass/whitelist-server/.env` exists
2. Must have:
   ```bash
   CONTRACT_ADDRESS=0xF182Ae21E8Bf69e043d4F3144bfA9182F9CB3949
   RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
   OWNER_PRIVATE_KEY=0x...  # Contract owner's private key
   ```

### Issue: "Transaction reverted" or "Signer address is not the contract owner"

**Cause:** Private key wallet is not the contract owner

**Fix:**
1. Verify contract owner: Check contract on Arbiscan
2. Ensure `OWNER_PRIVATE_KEY` in whitelist-server `.env` matches contract owner
3. Check whitelist-server logs: `GET /api/owner-info`

### Issue: "CORS error" in browser console

**Cause:** Whitelist-server CORS not configured for Next.js origin

**Fix:**
1. Check `whitelist-server/server.js` has:
   ```javascript
   app.use(cors({
     origin: process.env.CORS_ORIGIN || '*',
   }));
   ```
2. Or add to whitelist-server `.env`:
   ```bash
   CORS_ORIGIN=http://localhost:3000
   ```

### Issue: Frontend shows "Whitelisting..." forever

**Cause:** Transaction stuck or network issue

**Fix:**
1. Check whitelist-server logs for errors
2. Check RPC URL is correct and accessible
3. Verify contract owner has enough ETH for gas
4. Check network: `curl http://localhost:3001/api/owner-info`

---

## 📊 Testing Checklist

- [ ] Whitelist-server running on port 3001
- [ ] `.env.local` has `WHITELIST_SERVER_URL=http://localhost:3001`
- [ ] Whitelist-server `.env` has all required variables
- [ ] Contract owner wallet has ETH for gas
- [ ] Can access `http://localhost:3001/api/health`
- [ ] Frontend shows whitelisting status correctly
- [ ] Transaction appears on blockchain explorer
- [ ] Mint button appears after whitelisting
- [ ] NFT mints successfully

---

## 🔐 Security Notes

1. **Never commit `.env` files** with private keys
2. **Use server-side env vars** (`WHITELIST_SERVER_URL` not `NEXT_PUBLIC_WHITELIST_SERVER_URL`) when possible
3. **Whitelist-server should be behind authentication** in production
4. **Rate limiting** is already configured in whitelist-server
5. **Private key** should be stored securely (use Vercel Secrets in production)

---

## 📝 Next Steps

After testing locally:

1. **Deploy whitelist-server to Vercel:**
   ```bash
   cd MegaFi-9.5-Pass/whitelist-server
   vercel --prod
   ```

2. **Update production `.env.local`:**
   ```bash
   WHITELIST_SERVER_URL=https://your-whitelist-server.vercel.app
   ```

3. **Set environment variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `OWNER_PRIVATE_KEY`, `CONTRACT_ADDRESS`, `RPC_URL`

4. **Test production flow**

---

## ✅ Success Indicators

When everything is working:

1. ✅ Browser console shows: `[Frontend] Wallet whitelisted successfully`
2. ✅ Whitelist-server logs show: `✅ Transaction confirmed!`
3. ✅ UI shows green "Wallet Whitelisted!" message
4. ✅ "Mint NFT" button appears
5. ✅ Transaction hash links to blockchain explorer
6. ✅ NFT mints successfully

---

**Status:** Ready to test! 🚀

