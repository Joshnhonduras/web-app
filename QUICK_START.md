# Quick Start - Free Trial System

## What You Have

✅ **Complete free trial system ready to integrate**

Files created:
- `src/lib/usage/usageService.ts` - Usage tracking
- `src/lib/freeTierClient.ts` - Backend API client  
- `src/lib/legal/disclaimers.ts` - Legal text
- `src/components/TrialWelcomeModal.tsx` - Welcome flow
- `src/components/DisclaimerBanner.tsx` - Legal banner
- `BACKEND_SETUP.md` - Backend guide
- `INTEGRATION_GUIDE.md` - How to integrate

## 3 Steps to Live

### 1️⃣ Integrate into Chat (2-3 hours)
Follow `INTEGRATION_GUIDE.md` to:
- Add `TrialWelcomeModal` to Chat component
- Use `sendMessageFreeTier()` for new users without API keys
- Add `DisclaimerBanner` to main app
- Track usage with `recordMessageUsage()`

**Key files to modify:**
- `src/modules/masculine-mentor/Chat.tsx`
- `src/Hub.tsx`

### 2️⃣ Set Up Backend (1-2 hours)
Follow `BACKEND_SETUP.md` to create:
- `POST /api/chat/free-tier` endpoint
- Get Groq API key from console.groq.com
- Get OpenRouter API key from openrouter.ai
- Add fallback logic (Groq → OpenRouter)

**Copy-paste Node.js example in BACKEND_SETUP.md**

### 3️⃣ Configure & Test (30 minutes)
- Set `REACT_APP_BACKEND_URL` in `.env.local`
- Test with fresh browser (incognito)
- Verify modal shows on first message
- Check localStorage for `growth-hub-usage`

## What Users Will See

**New user → Opens app:**
1. Disclaimer banner (must acknowledge)
2. Clicks chat
3. Tries to send message
4. Welcome modal explains 1K token free trial + options
5. Sends message using free tier (Groq/OpenRouter)
6. Token usage tracked

**Can do any time:**
- Add own API key in Settings → Switch to unlimited
- Subscribe $9.99/month → Unlimited + premium

## API Security

✅ Your Groq & OpenRouter keys stay on backend
✅ User's custom API key only in their browser  
✅ No sensitive data exposed in frontend

## To Customize

**Change token limit:**
```typescript
// src/lib/usage/usageService.ts
const FREE_TRIAL_TOKENS = 1000;  // Change to 500, 2000, etc
```

**Change disclaimer text:**
```typescript
// src/lib/legal/disclaimers.ts
export const disclaimers = {
  globalDisclaimer: `Your text here...`,
  // etc
}
```

**Change welcome modal text:**
Edit `src/components/TrialWelcomeModal.tsx`

## Common Questions

**Q: Can users use free tier forever?**
A: They get 1K tokens. Then they need to either:
- Get free Groq key (unlimited, we provide link)
- Subscribe $9.99/month
- Use their own API key

**Q: What if backend is down?**
A: Error message shown, suggest user adds their own key

**Q: How accurate is token counting?**
A: Frontend estimates. Backend tracks actual.

**Q: Do we need backend to start?**
A: Frontend works alone, but free tier needs backend

## Files Reference

```
🔐 Usage Tracking
  src/lib/usage/usageService.ts

🔌 API Client
  src/lib/freeTierClient.ts

⚖️ Legal
  src/lib/legal/disclaimers.ts

🎨 UI Components
  src/components/TrialWelcomeModal.tsx
  src/components/TrialWelcomeModal.css
  src/components/DisclaimerBanner.tsx
  src/components/DisclaimerBanner.css

📖 Documentation
  BACKEND_SETUP.md         ← Start here for backend
  INTEGRATION_GUIDE.md     ← How to integrate
  QUICK_START.md           ← This file
```

## Next: Subscription (After Free Trial Works)

Once free trial is live:
1. Add Stripe integration
2. Check if user is subscribed
3. If subscribed → Bypass free tier limits
4. Show subscription portal in Settings

~3-4 hours of work after free trial is done.

## Need Help?

All code is documented with comments. Key functions:

**Usage tracking:**
```typescript
import { recordMessageUsage, getRemainingTokens, getUsageSummary } from './lib/usage/usageService';

recordMessageUsage(messageLength);
const remaining = getRemainingTokens();
const summary = getUsageSummary();
```

**Free tier chat:**
```typescript
import { sendMessageFreeTier } from './lib/freeTierClient';

const response = await sendMessageFreeTier(messages, systemPrompt);
// response.content = AI response
// response.tokensUsed = tokens used
```

**Disclaimers:**
```typescript
import { getDisclaimerAcknowledgment, acknowledgeDisclaimers } from './lib/legal/disclaimers';

const ack = getDisclaimerAcknowledgment();
acknowledgeDisclaimers();
```

---

**Time to live: 4-5 hours**
**Time to monetization: 6-8 hours** (with subscription)

Let's build! 🚀
