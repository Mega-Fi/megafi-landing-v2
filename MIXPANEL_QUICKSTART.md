# Mixpanel Analytics - Quick Start

## 🚀 5-Minute Setup

### 1. Get Your Mixpanel Token

1. Go to [Mixpanel](https://mixpanel.com/)
2. Create a project or use existing one
3. Copy your Project Token from Project Settings

### 2. Add to Environment

```bash
# .env.local
NEXT_PUBLIC_MIXPANEL_TOKEN=your-token-here
```

### 3. That's It!

Analytics are already integrated. Events will start tracking automatically.

---

## 📊 What's Being Tracked

### Landing Page
- ✅ Page views
- ✅ NFT banner clicks

### NFT Claim Flow
- ✅ Page view on claim page
- ✅ Claim process started
- ✅ Twitter authentication (initiated/success/failed)
- ✅ Eligibility checks (eligible/not eligible/failed)
- ✅ Wallet connection
- ✅ NFT minting (initiated/success/failed/cancelled)
- ✅ Claim recording

---

## 🔍 Quick Test

1. Start dev server: `npm run dev`
2. Open browser console
3. Navigate through the app
4. You'll see: `🔍 [Mixpanel Mock] EventName { properties }`

---

## 📈 View Data in Mixpanel

1. Log in to Mixpanel
2. Go to **Insights** for event data
3. Go to **Funnels** for conversion rates
4. Go to **Users** for user profiles

---

## 🎯 Key Metrics to Watch

### Conversion Funnel
```
Landing → Banner Click → Auth → Eligible → Wallet → Mint → Success
```

### Drop-off Points
- Banner click rate
- Auth completion
- Eligibility pass rate
- Mint completion
- Cancellation rate

---

## 🛠️ Troubleshooting

**Not seeing events?**
- Check token is set in `.env.local`
- Restart dev server
- Check browser console for errors
- Disable ad blockers

**Events in dev but not production?**
- Verify production env vars are set
- Check Mixpanel project is in production mode

---

## 📚 Full Documentation

See [MIXPANEL_ANALYTICS.md](./MIXPANEL_ANALYTICS.md) for complete documentation including:
- All event definitions
- Event properties
- User identification
- Privacy compliance
- Advanced queries

---

**Need Help?**
- Check [Mixpanel Docs](https://docs.mixpanel.com/)
- Review `lib/mixpanel.ts` for implementation
- See full docs in `MIXPANEL_ANALYTICS.md`

