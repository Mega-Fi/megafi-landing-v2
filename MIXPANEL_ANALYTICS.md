# Mixpanel Analytics Integration

## Overview

This document describes the comprehensive Mixpanel analytics integration for tracking the OG NFT claim funnel and user behavior across the MegaFi landing page.

## Setup

### 1. Install Dependencies

```bash
npm install mixpanel-browser
```

### 2. Environment Configuration

Add your Mixpanel project token to `.env.local`:

```bash
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token-here
```

Get your project token from:
1. Log in to [Mixpanel](https://mixpanel.com/)
2. Go to Project Settings → Project Token
3. Copy the token

### 3. Implementation Files

- **`lib/mixpanel.ts`** - Mixpanel service and event definitions
- **`app/page.tsx`** - Landing page tracking
- **`components/ui/og-nft-banner.tsx`** - Banner click tracking
- **`app/claim-og-megaeth-nft/page.tsx`** - NFT claim funnel tracking

## Tracked Events

### Landing Page Events

#### 1. **Page View - Landing**
**Event Name:** `PAGE_VIEW_LANDING`

**Triggered:** When user lands on the homepage

**Properties:**
- `url` - Full URL
- `path` - URL pathname
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/page.tsx`

---

#### 2. **NFT Banner Click**
**Event Name:** `NFT_BANNER_CLICK`

**Triggered:** When user clicks the OG NFT banner

**Properties:**
- `source` - 'landing_page'
- `banner_color` - Hex color of banner
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `components/ui/og-nft-banner.tsx`

---

### NFT Claim Page Events

#### 3. **Page View - NFT Claim**
**Event Name:** `PAGE_VIEW_NFT_CLAIM`

**Triggered:** When user lands on `/claim-og-megaeth-nft`

**Properties:**
- `url` - Full URL
- `path` - URL pathname
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx`

---

#### 4. **NFT Claim Started**
**Event Name:** `NFT_CLAIM_STARTED`

**Triggered:** When user begins the claim process (moves to Twitter auth step)

**Properties:**
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx`

---

### Twitter Authentication Events

#### 5. **Twitter Auth Initiated**
**Event Name:** `TWITTER_AUTH_INITIATED`

**Triggered:** When user clicks "Connect with X" button

**Properties:**
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → `signInWithTwitter()`

---

#### 6. **Twitter Auth Success**
**Event Name:** `TWITTER_AUTH_SUCCESS`

**Triggered:** When Twitter OAuth successfully completes

**Properties:**
- `twitter_handle` - User's Twitter handle
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**User Identification:** Sets user ID to Supabase user ID and stores Twitter handle

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → OAuth callback handler

---

#### 7. **Twitter Auth Failed**
**Event Name:** `TWITTER_AUTH_FAILED`

**Triggered:** When Twitter OAuth fails

**Properties:**
- `error` - Error message
- `error_code` - Error code (if available)
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → OAuth error handler

---

### Eligibility Check Events

#### 8. **Eligibility Check Started**
**Event Name:** `ELIGIBILITY_CHECK_STARTED`

**Triggered:** When eligibility verification begins

**Properties:**
- `twitter_handle` - User's Twitter handle
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → `checkEligibility()`

---

#### 9. **Eligibility Check - Eligible**
**Event Name:** `ELIGIBILITY_CHECK_ELIGIBLE`

**Triggered:** When user is confirmed eligible for NFT

**Properties:**
- `twitter_handle` - User's Twitter handle
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → `checkEligibility()`

---

#### 10. **Eligibility Check - Not Eligible**
**Event Name:** `ELIGIBILITY_CHECK_NOT_ELIGIBLE`

**Triggered:** When user is not eligible for NFT

**Properties:**
- `twitter_handle` - User's Twitter handle
- `reason` - Why user is not eligible
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → `checkEligibility()`

---

#### 11. **Eligibility Check Failed**
**Event Name:** `ELIGIBILITY_CHECK_FAILED`

**Triggered:** When eligibility check encounters an error

**Properties:**
- `twitter_handle` - User's Twitter handle
- `error` - Error message
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → `checkEligibility()` catch block

---

### Wallet Connection Events

#### 12. **Wallet Connect Success**
**Event Name:** `WALLET_CONNECT_SUCCESS`

**Triggered:** When user successfully connects their wallet

**Properties:**
- `wallet_address` - Connected wallet address
- `twitter_handle` - User's Twitter handle
- `network` - Network name (e.g., 'Ethereum Mainnet')
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**User Properties Updated:**
- `wallet_address` - Wallet address
- `network` - Network name

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → Wallet connection useEffect

---

### NFT Minting Events

#### 13. **NFT Mint Initiated**
**Event Name:** `NFT_MINT_INITIATED`

**Triggered:** When user clicks "Mint NFT" button

**Properties:**
- `twitter_handle` - User's Twitter handle
- `wallet_address` - User's wallet address
- `network` - Network name
- `contract_address` - NFT contract address
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → `handleMint()`

---

#### 14. **NFT Mint Success**
**Event Name:** `NFT_MINT_SUCCESS`

**Triggered:** When NFT is successfully minted on-chain

**Properties:**
- `twitter_handle` - User's Twitter handle
- `wallet_address` - User's wallet address
- `transaction_hash` - Blockchain transaction hash
- `network` - Network name
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → `recordClaim()`

---

#### 15. **NFT Mint Failed**
**Event Name:** `NFT_MINT_FAILED`

**Triggered:** When NFT minting fails (excluding user cancellation)

**Properties:**
- `twitter_handle` - User's Twitter handle
- `wallet_address` - User's wallet address
- `error` - Error message
- `error_code` - Error code (if available)
- `network` - Network name
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → Mint error handlers

---

#### 16. **NFT Mint Cancelled**
**Event Name:** `NFT_MINT_CANCELLED`

**Triggered:** When user rejects/cancels the mint transaction

**Detection:** Error message contains "user rejected", "user denied", or "cancelled"

**Properties:**
- `twitter_handle` - User's Twitter handle
- `wallet_address` - User's wallet address
- `network` - Network name
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → Mint error handler useEffect

---

### Claim Recording Events

#### 17. **Claim Record Success**
**Event Name:** `CLAIM_RECORD_SUCCESS`

**Triggered:** When claim is successfully recorded in database

**Properties:**
- `twitter_handle` - User's Twitter handle
- `wallet_address` - User's wallet address
- `transaction_hash` - Blockchain transaction hash
- `token_id` - NFT token ID (if available)
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → `recordClaim()`

---

#### 18. **Claim Record Failed**
**Event Name:** `CLAIM_RECORD_FAILED`

**Triggered:** When claim recording in database fails

**Properties:**
- `twitter_handle` - User's Twitter handle
- `wallet_address` - User's wallet address
- `error` - Error message
- `timestamp` - ISO timestamp
- `environment` - 'development' | 'production'

**Code Location:** `app/claim-og-megaeth-nft/page.tsx` → `recordClaim()` error handler

---

## User Identification

### When User Identity is Set

User identity is established using Supabase user ID when:
1. Twitter auth succeeds
2. Session is detected on page load

### User Properties Tracked

```typescript
{
  twitter_handle: string,
  twitter_id: string,
  wallet_address: string,
  network: string,
}
```

### Identity Reset

User identity is reset when:
- User signs out of Twitter

---

## Funnel Analysis

### Complete NFT Claim Funnel

1. **Landing Page View** → `PAGE_VIEW_LANDING`
2. **Banner Click** → `NFT_BANNER_CLICK`
3. **NFT Page View** → `PAGE_VIEW_NFT_CLAIM`
4. **Claim Started** → `NFT_CLAIM_STARTED`
5. **Twitter Auth** → `TWITTER_AUTH_INITIATED` → `TWITTER_AUTH_SUCCESS`
6. **Eligibility Check** → `ELIGIBILITY_CHECK_ELIGIBLE`
7. **Wallet Connect** → `WALLET_CONNECT_SUCCESS`
8. **Mint Initiated** → `NFT_MINT_INITIATED`
9. **Mint Success** → `NFT_MINT_SUCCESS`
10. **Claim Recorded** → `CLAIM_RECORD_SUCCESS`

### Key Drop-off Points to Monitor

1. **Banner Click Rate:** `NFT_BANNER_CLICK` / `PAGE_VIEW_LANDING`
2. **Auth Completion Rate:** `TWITTER_AUTH_SUCCESS` / `TWITTER_AUTH_INITIATED`
3. **Eligibility Rate:** `ELIGIBILITY_CHECK_ELIGIBLE` / `ELIGIBILITY_CHECK_STARTED`
4. **Wallet Connection Rate:** `WALLET_CONNECT_SUCCESS` / `ELIGIBILITY_CHECK_ELIGIBLE`
5. **Mint Completion Rate:** `NFT_MINT_SUCCESS` / `NFT_MINT_INITIATED`
6. **Cancellation Rate:** `NFT_MINT_CANCELLED` / `NFT_MINT_INITIATED`

---

## Mixpanel Dashboard Setup

### Recommended Reports

#### 1. **Funnel Report: NFT Claim Funnel**
- Step 1: Page View - NFT Claim
- Step 2: NFT Claim Started
- Step 3: Twitter Auth Success
- Step 4: Eligibility Check - Eligible
- Step 5: Wallet Connect Success
- Step 6: NFT Mint Success
- Step 7: Claim Record Success

#### 2. **Insights Report: Daily Claims**
- Event: Claim Record Success
- Group by: Date
- Visualize: Line chart

#### 3. **Insights Report: Eligibility Results**
- Event: Eligibility Check - Eligible vs. Not Eligible
- Group by: Event name
- Visualize: Pie chart

#### 4. **Insights Report: Mint Cancellation Rate**
- Events: NFT Mint Cancelled, NFT Mint Success
- Group by: Event name
- Formula: (Cancelled / (Cancelled + Success)) * 100

#### 5. **User Profile Report**
- Properties: twitter_handle, wallet_address, network
- Filter: Users with "Claim Record Success" event

---

## Testing in Development

### Development Mode

When `NODE_ENV === 'development'`:
- Events are logged to console
- Mixpanel debug mode is enabled
- Mock tracking if token not provided

### Testing Checklist

- [ ] Landing page view tracked
- [ ] Banner click tracked
- [ ] NFT page view tracked
- [ ] Twitter auth events tracked
- [ ] Eligibility check tracked (both eligible and not eligible)
- [ ] Wallet connection tracked
- [ ] Mint initiation tracked
- [ ] Successful mint tracked
- [ ] Failed mint tracked
- [ ] Cancelled mint tracked
- [ ] Claim recording tracked

### Test Commands

```bash
# View console logs for tracking
npm run dev

# Check Network tab for Mixpanel requests
# Look for POST requests to api.mixpanel.com
```

---

## Privacy & Compliance

### Data Collected

- **PII (Personal Identifiable Information):**
  - Twitter handle (public information)
  - Wallet address (blockchain public address)
  
- **Non-PII:**
  - Event timestamps
  - Transaction hashes (public blockchain data)
  - Error messages
  - Network information

### Do Not Track (DNT)

The implementation respects Do Not Track headers:

```typescript
ignore_dnt: false  // Respects DNT preference
```

### GDPR Considerations

- User data can be deleted via Mixpanel GDPR deletion API
- User properties are minimal and based on public blockchain data
- No sensitive personal information is collected

---

## Troubleshooting

### Events Not Appearing in Mixpanel

1. **Check token:** Verify `NEXT_PUBLIC_MIXPANEL_TOKEN` is set
2. **Check network:** Look for failed API calls in Network tab
3. **Check console:** Look for Mixpanel errors in console
4. **Verify environment:** Ensure you're not in ad-blocker or incognito mode

### Duplicate Events

- Ensure you're not calling `analytics.track()` in multiple places
- Check for React strict mode double-rendering in development

### Missing User Properties

- Verify `analytics.identify()` is called after Twitter auth
- Check that user properties are set with `analytics.setUserProperties()`

---

## Maintenance

### Adding New Events

1. Add event name to `MIXPANEL_EVENTS` in `lib/mixpanel.ts`
2. Call `analytics.track(MIXPANEL_EVENTS.YOUR_EVENT, properties)`
3. Document event in this file
4. Update funnel analysis if applicable

### Updating Event Properties

1. Add new property to tracking call
2. Document in this file
3. Update Mixpanel board/reports if needed

---

## Example Queries

### Find Users Who Cancelled Mint

```javascript
// In Mixpanel Insights
Event: NFT Mint Cancelled
Group by: twitter_handle
Date range: Last 30 days
```

### Calculate Conversion Rate

```javascript
// In Mixpanel Funnels
Funnel Steps:
1. Page View - NFT Claim
2. Twitter Auth Success  
3. NFT Mint Success

// Conversion rate automatically calculated
```

---

## Support

For issues or questions:
1. Check Mixpanel documentation: https://docs.mixpanel.com/
2. Review implementation in `lib/mixpanel.ts`
3. Check browser console for errors
4. Verify environment variables are set

---

**Last Updated:** November 5, 2025  
**Version:** 1.0.0  
**Status:** Production Ready

