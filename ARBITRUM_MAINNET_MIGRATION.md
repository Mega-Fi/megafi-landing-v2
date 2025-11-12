# Arbitrum Mainnet Migration Checklist

## ✅ Code Status

**Good News:** All code already supports Arbitrum mainnet! No code changes needed.

The following files already have Arbitrum mainnet support:

- ✅ `lib/wagmi-config.ts` - Supports `arbitrum` chain
- ✅ `app/api/claim/latest-token/route.ts` - Supports `arbitrum` network
- ✅ `app/api/claim/whitelist-wallet/route.ts` - Supports `arbitrum` network
- ✅ `MegaFi-9.5-Pass/whitelist-server/config/config.js` - Supports `arbitrum` network

---

## 🔧 Required Changes

### 1. Frontend Environment Variables (Vercel)

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Update these variables:**

```bash
# Change from 'testnet' to 'arbitrum'
NEXT_PUBLIC_NETWORK=arbitrum

# Update to your Arbitrum mainnet contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourArbitrumMainnetContractAddress

# Optional: Set a custom RPC URL (recommended for production)
# If not set, will use public fallback: https://arb1.arbitrum.io/rpc
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_API_KEY
# Or: https://arbitrum-mainnet.infura.io/v3/YOUR_PROJECT_ID
```

**Keep these unchanged:**

- `NEXT_PUBLIC_SUPABASE_URL` - Same for all networks
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Same for all networks
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Same for all networks
- `NEXT_PUBLIC_MIXPANEL_TOKEN` - Same for all networks

---

### 2. Whitelist Server Environment Variables (Vercel)

Go to: **Vercel Dashboard → Whitelist Server Project → Settings → Environment Variables**

**Update these variables:**

```bash
# Change from 'testnet' to 'arbitrum'
NETWORK=arbitrum

# Update to your Arbitrum mainnet contract address
CONTRACT_ADDRESS=0xYourArbitrumMainnetContractAddress

# Optional: Set a custom RPC URL (recommended for production)
# If not set, will use public fallback: https://arb1.arbitrum.io/rpc
RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_API_KEY
# Or: https://arbitrum-mainnet.infura.io/v3/YOUR_PROJECT_ID

# Keep your contract owner's private key (same wallet, different network)
OWNER_PRIVATE_KEY=0xYourContractOwnerPrivateKey

# Keep production flag
NODE_ENV=production
```

**⚠️ Important:** Make sure the `OWNER_PRIVATE_KEY` wallet has:

- ✅ Deployed the contract on Arbitrum mainnet
- ✅ Has enough ETH on Arbitrum for gas fees
- ✅ Is the owner of the contract (for whitelisting)

---

### 3. Contract Deployment

**Before updating environment variables, ensure:**

- [ ] Contract is deployed to Arbitrum mainnet
- [ ] Contract address is correct
- [ ] Contract owner wallet has ETH on Arbitrum
- [ ] Contract functions are working (`mint`, `hasMinted`, `getCurrentTokenId`)

---

### 4. Testing Checklist

After updating environment variables:

- [ ] **Redeploy frontend** (Vercel will auto-deploy, or trigger manually)
- [ ] **Redeploy whitelist server** (Vercel will auto-deploy, or trigger manually)
- [ ] Test wallet connection (should connect to Arbitrum)
- [ ] Test eligibility check
- [ ] Test whitelist status check
- [ ] Test minting (with small test first!)
- [ ] Verify transaction appears on [Arbiscan](https://arbiscan.io)

---

### 5. Network-Specific URLs

**Update these in your code/docs if needed:**

- **Block Explorer:** `https://arbiscan.io` (already handled by `currentNetwork.explorerUrl`)
- **RPC Endpoints:**
  - Public: `https://arb1.arbitrum.io/rpc`
  - Alchemy: `https://arb-mainnet.g.alchemy.com/v2/YOUR_API_KEY`
  - Infura: `https://arbitrum-mainnet.infura.io/v3/YOUR_PROJECT_ID`

---

## 📝 Summary

**What needs to change:**

1. ✅ Environment variables (Frontend + Whitelist Server)
2. ✅ Contract address (Arbitrum mainnet)
3. ✅ Network setting (`testnet` → `arbitrum`)

**What doesn't need to change:**

- ✅ Code (already supports Arbitrum)
- ✅ Supabase configuration
- ✅ Twitter OAuth setup
- ✅ Database schema

---

## 🚀 Quick Migration Steps

1. **Deploy contract to Arbitrum mainnet** (if not already done)
2. **Update frontend env vars** in Vercel:
   - `NEXT_PUBLIC_NETWORK=arbitrum`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS=<arbitrum-address>`
3. **Update whitelist server env vars** in Vercel:
   - `NETWORK=arbitrum`
   - `CONTRACT_ADDRESS=<arbitrum-address>`
4. **Redeploy both services**
5. **Test end-to-end flow**

---

## ⚠️ Important Notes

- **Gas Fees:** Arbitrum mainnet has much lower gas fees than Ethereum mainnet
- **RPC Limits:** Consider using a paid RPC provider (Alchemy/Infura) for production
- **Contract Owner:** Ensure the wallet with `OWNER_PRIVATE_KEY` has ETH on Arbitrum
- **Testing:** Always test with a small transaction first before going live

---

## 🔍 Verification

After migration, verify:

```bash
# Check frontend is using Arbitrum
curl https://www.megafi.app/api/claim/latest-token
# Should show network: "arbitrum" in response

# Check whitelist server is using Arbitrum
curl https://server.megafi.app/api/health
# Should show network: "Arbitrum One" (chainId: 42161)
```

---

**Ready to migrate?** Follow the steps above and you'll be on Arbitrum mainnet! 🚀
