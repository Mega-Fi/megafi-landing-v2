<!-- 71c0ada6-240d-4e89-af38-917aa1481ab8 b7f7cb68-2a37-41b1-875f-2fa13c3ed1ca -->
# Automated On-Chain Wallet Whitelisting

## Overview

After a user authenticates with Twitter and connects their wallet, the backend will automatically submit a transaction to whitelist their wallet address on the NFT contract before they can mint.

## Implementation Steps

### 1. Environment Configuration

Add new environment variables to `.env.local`:

```bash
# Whitelister Wallet Configuration
WHITELISTER_PRIVATE_KEY=0x...  # Dedicated wallet private key
WHITELISTER_ADDRESS=0x...      # Public address (for verification)
```

Update `env.example` with these new variables and documentation.

### 2. Create Backend Whitelisting Service

**New file:** `lib/whitelisting-service.ts`

Key responsibilities:

- Initialize viem wallet client with whitelister private key
- Provide `addWalletToWhitelist(address)` function
- Check if wallet is already whitelisted (avoid duplicate gas)
- Submit transaction to contract's `addToWhitelist([address])`
- Return transaction hash and status
- Handle gas estimation and error cases
```typescript
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from './contract-abi';
import { config } from './wagmi-config';

// Initialize whitelister wallet
// Check if address is already whitelisted
// Submit whitelisting transaction
// Return tx hash or error
```


### 3. Create Whitelisting API Endpoint

**New file:** `app/api/claim/whitelist-wallet/route.ts`

**Endpoint:** `POST /api/claim/whitelist-wallet`

**Request body:**

```json
{
  "wallet_address": "0x...",
  "twitter_handle": "username"
}
```

**Logic flow:**

1. Validate wallet address format
2. Verify Twitter handle is eligible (check `og_eligible_handles`)
3. Check if wallet already whitelisted on-chain (read contract)
4. If not whitelisted, call whitelisting service
5. Wait for transaction confirmation
6. Return success/failure with tx hash

**Response:**

```json
{
  "success": true,
  "alreadyWhitelisted": false,
  "transactionHash": "0x...",
  "message": "Wallet whitelisted successfully"
}
```

**Security considerations:**

- Rate limiting (prevent abuse)
- Verify Twitter handle ownership via session
- Log all whitelisting attempts
- Handle transaction failures gracefully

### 4. Update Claim Page Flow

**File:** `app/claim-og-megaeth-nft/page.tsx`

**New step added:** Between "wallet" and "mint"

Current steps: `twitter → eligibility → wallet → mint → success`

New steps: `twitter → eligibility → wallet → **whitelisting** → mint → success`

**Changes needed:**

1. Add new step type: `type Step = 'twitter' | 'eligibility' | 'wallet' | 'whitelisting' | 'mint' | 'success';`

2. Add whitelisting state:
```typescript
const [isWhitelisting, setIsWhitelisting] = useState(false);
const [whitelistTxHash, setWhitelistTxHash] = useState<string | null>(null);
```

3. Add auto-trigger when wallet connects:
```typescript
useEffect(() => {
  if (isConnected && address && currentStep === 'wallet' && eligibility?.eligible) {
    handleWhitelisting();
  }
}, [isConnected, address, currentStep, eligibility]);
```

4. Add whitelisting function:
```typescript
const handleWhitelisting = async () => {
  setIsWhitelisting(true);
  setCurrentStep('whitelisting');
  
  try {
    const response = await fetch('/api/claim/whitelist-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_address: address,
        twitter_handle: twitterHandle,
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      setWhitelistTxHash(data.transactionHash);
      setCurrentStep('mint');
    } else {
      setError(data.error || 'Failed to whitelist wallet');
    }
  } catch (err) {
    setError('Failed to whitelist wallet');
  } finally {
    setIsWhitelisting(false);
  }
};
```

5. Add UI for whitelisting step:
```tsx
{currentStep === 'whitelisting' && (
  <div className="text-center space-y-6">
    <Loader2 className="animate-spin text-[#FF3A1E] mx-auto" size={60} />
    <h2 className="text-2xl font-bold">Whitelisting Your Wallet...</h2>
    <p className="text-gray-400">
      Please wait while we add your wallet to the whitelist on-chain
    </p>
    {whitelistTxHash && (
      <a href={`${currentNetwork.explorerUrl}/tx/${whitelistTxHash}`} 
         target="_blank" 
         className="text-[#FF3A1E]">
        View Transaction
      </a>
    )}
  </div>
)}
```

6. Update progress indicator to include 6 steps instead of 5

### 5. Update Database Schema

**Optional but recommended:** Track whitelisting transactions

**New table:** `og_wallet_whitelist_logs`

```sql
CREATE TABLE og_wallet_whitelist_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  twitter_handle TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  transaction_hash TEXT,
  status TEXT CHECK (status IN ('pending', 'success', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

This helps with:

- Debugging failed transactions
- Preventing duplicate whitelisting attempts
- Audit trail for compliance

### 6. Add Whitelister Wallet Setup Script

**New file:** `scripts/setup-whitelister.ts`

Helper script to:

- Generate a new whitelister wallet (if needed)
- Check whitelister balance
- Estimate total gas needed for 279 transactions
- Instructions for funding the wallet
```typescript
// Generate new wallet
// Check current balance
// Calculate gas needed (estimate 50k gas per tx * 279 * current gas price)
// Display funding instructions
```


### 7. Error Handling & Edge Cases

Handle these scenarios:

1. **Insufficient gas:** Whitelister wallet runs out of funds

   - Check balance before each transaction
   - Alert admin when balance is low
   - Show user-friendly error message

2. **Transaction reverts:** Contract rejects whitelisting

   - Parse revert reason (e.g., "Already whitelisted", "Not owner")
   - Retry logic for network errors
   - Fallback to manual process

3. **Network congestion:** High gas prices or slow confirmations

   - Set reasonable gas limits
   - Implement timeout (30s max wait)
   - Allow users to retry

4. **Duplicate prevention:** User refreshes page

   - Check contract state before whitelisting
   - Cache whitelisting status in session

### 8. Security Considerations

1. **Private key protection:**

   - Never log private key
   - Store in secure environment variables only
   - Rotate key periodically
   - Limit funds in whitelister wallet (e.g., 0.1 ETH at a time)

2. **Access control:**

   - Verify Twitter session before whitelisting
   - Rate limit: Max 1 whitelisting per Twitter handle
   - IP-based rate limiting (prevent spam)

3. **Monitoring:**

   - Log all whitelisting attempts
   - Alert on unusual activity (multiple fails, rapid requests)
   - Track gas spending

### 9. Documentation Updates

Update these files:

- `README.md`: Add whitelister setup instructions
- `.cursor/rules/og-nft-claim.mdc`: Document new whitelisting step
- `env.example`: Add whitelister wallet variables
- Create new doc: `WHITELISTER_SETUP.md` with detailed instructions

### 10. Testing Checklist

Before production:

- [ ] Test whitelisting on testnet with test wallet
- [ ] Verify contract owner role for whitelister wallet
- [ ] Test error handling (insufficient gas, invalid address)
- [ ] Verify duplicate prevention works
- [ ] Check transaction confirmation timing
- [ ] Test full flow: Twitter auth → wallet connect → whitelist → mint
- [ ] Monitor gas costs per transaction
- [ ] Test with multiple users in succession

## Key Files to Create/Modify

**New files:**

- `lib/whitelisting-service.ts` - Core whitelisting logic
- `app/api/claim/whitelist-wallet/route.ts` - API endpoint
- `scripts/setup-whitelister.ts` - Setup utility
- `supabase/05_create_whitelist_logs.sql` - Logging table (optional)
- `WHITELISTER_SETUP.md` - Documentation

**Modified files:**

- `app/claim-og-megaeth-nft/page.tsx` - Add whitelisting step
- `env.example` - Add whitelister variables
- `.cursor/rules/og-nft-claim.mdc` - Update documentation
- `README.md` - Add setup instructions

## Estimated Gas Costs

- Per whitelisting tx: ~50,000 gas
- 279 users × 50,000 = ~13,950,000 gas total
- At 20 gwei: ~0.28 ETH (~$700 at $2500/ETH)
- At 50 gwei: ~0.70 ETH (~$1750)

**Recommendation:** Start with 0.5-1 ETH in whitelister wallet on mainnet, monitor and refill as needed.

### To-dos

- [ ] Add WHITELISTER_PRIVATE_KEY and WHITELISTER_ADDRESS to environment configuration
- [ ] Create lib/whitelisting-service.ts with wallet client and addToWhitelist function
- [ ] Create POST /api/claim/whitelist-wallet endpoint with validation and error handling
- [ ] Update claim page to add whitelisting step between wallet and mint
- [ ] Create optional whitelist logs table for audit trail
- [ ] Create scripts/setup-whitelister.ts helper for wallet setup and balance checks
- [ ] Update README, env.example, and create WHITELISTER_SETUP.md with instructions
- [ ] Test complete flow on testnet including error cases and edge scenarios