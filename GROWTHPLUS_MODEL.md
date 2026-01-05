# GrowthPlus Monetization Model

## The Correct Model (Updated)

### Free Tier: 1,000 Credits
- **Cost to user:** $0 (email verification only)
- **What they get:** Access to all modules, courses, features for 1,000 credits worth
- **Bot prevention:** Email verification prevents token scalping
- **Your cost:** ~$0.003-0.01 (minimal Groq free tier usage)
- **Your revenue:** $0

### GrowthPlus Membership: $9.99/month
- **Cost to user:** $9.99/month (becomes active immediately after signup)
- **What they get:** 10,000 ADDITIONAL credits + continues access to all modules/courses/features
- **Total credits available:** 1,000 (free) + 10,000 (paid) = 11,000 credits
- **Billing:** Monthly, can cancel anytime
- **Your cost:** $0 (they use your backend-proxied Groq/OpenRouter API)
- **Your revenue:** $9.99/month per subscriber

### User Provides Own API Key (Optional)
- **Cost to user:** $0 (free Groq) to $2-10/month (OpenAI)
- **What they get:** Unlimited credits if using free API key
- **Your cost:** $0 (they call API directly from their browser)
- **Your revenue:** $0 unless they also subscribe

---

## User Journeys

### Journey A: Free Trial → Free Forever
```
User opens app
  ↓
Enters email to get 1,000 free credits
  ↓
Uses 1,000 credits exploring features
  ↓
Credits exhausted, sees upsell
  ↓
Chooses "Get Free API Key" option
  ↓
Gets Groq or OpenRouter free API key (2 min setup)
  ↓
Has unlimited credits forever (costs them $0, costs you $0)
```

### Journey B: Free Trial → GrowthPlus
```
User opens app
  ↓
Enters email to get 1,000 free credits
  ↓
Uses 1,000 credits exploring features
  ↓
Credits exhausted, sees upsell
  ↓
Chooses "Become GrowthPlus Member"
  ↓
Pays $9.99/month, gets 10,000 more credits
  ↓
Now has 11,000 total credits for this month
  ↓
You earn $9.99/month recurring revenue
```

### Journey C: Free Trial → GrowthPlus + Own API Key
```
User opens app
  ↓
Enters email to get 1,000 free credits
  ↓
Uses 1,000 credits
  ↓
Credits exhausted
  ↓
Subscribes to GrowthPlus ($9.99/month) + gets own free Groq key
  ↓
Has GrowthPlus membership + unlimited free API credits
  ↓
You earn $9.99/month
  ↓
They have unlimited credits (best experience)
```

---

## Email Verification (Bot Prevention)

### Why Email?
- Prevents users from creating multiple accounts to get infinite 1,000-token trials
- Allows you to track who has used free credits
- Secure but simple (no credit card required)

### Implementation:
1. User enters email on first message attempt
2. Backend stores email + timestamp + initial token allocation
3. Backend checks if email has already used free tier
   - If yes: Deny new trial, show upsell
   - If no: Allow 1,000 credits
4. Store in your database: `{ email, tokensUsed, dateCreated }`

### Defense Against Abuse:
```javascript
// Pseudocode for bot detection
function canStartTrial(email) {
  const existing = db.findByEmail(email);
  
  if (existing && existing.tokensUsed > 0) {
    return false; // Already used trial
  }
  
  return true; // New email, allow trial
}
```

---

## Credit System Explained

### User Perspective
- "Credits" = abstract spending power
- 1,000 free credits = starting budget
- Each message uses ~X credits (you determine based on tokens)
- GrowthPlus gives 10,000 additional credits
- Run out = need to upgrade or get own API key

### Your Perspective
- Credits map to Groq API tokens
- Conversion: 1 credit ≈ 1 API token (you can adjust)
- Free users cost you minimal (shared backend)
- GrowthPlus users cost you minimal (shared backend)
- Users with own keys cost you $0 (they call APIs directly)

---

## Pricing Breakdown

### Per 100 New Users (Monthly)

```
100 start free trial
│
├─ 50 exhaust credits
│  ├─ 30 get free Groq key (never pay)
│  │  Cost to you: ~$0.01 (trial usage)
│  │  Revenue: $0
│  │
│  └─ 20 subscribe GrowthPlus
│     Cost to you: $0 (backend proxied)
│     Revenue: $9.99 × 20 = $199.80/month
│
└─ 50 don't exhaust credits (casual users)
   Cost to you: ~$0.005 (half trial usage)
   Revenue: $0
   (Value: Word-of-mouth marketing)

Total Cost to You: ~$0.015
Total Revenue: $199.80/month
ROI: 13,320x
```

---

## Implementation Checklist

### Backend Endpoints (New Requirements)

```javascript
// 1. Start free trial with email verification
POST /api/trial/start
  Input: { email }
  Output: { tokens: 1000, status: 'active' }
  Logic: Check if email has already used trial

// 2. Record token usage
POST /api/usage/record
  Input: { email, tokensUsed }
  Output: { remaining: number }

// 3. Check if user can continue
GET /api/usage/check
  Input: { email }
  Output: { remaining: number, isTrialActive: boolean }

// 4. Upgrade to GrowthPlus
POST /api/subscription/upgrade
  Input: { email, stripeToken }
  Output: { success: true, newTokens: 10000 }

// 5. Verify subscription status
GET /api/subscription/status
  Input: { email }
  Output: { isPaid: boolean, creditsRemaining: number }
```

### Frontend Changes

```typescript
// 1. Email entry modal (NEW)
TrialWelcomeModal:
  - Gets email from user
  - Calls /api/trial/start
  - Stores locally for reference
  
// 2. Credit tracking (UPDATED)
usageService:
  - Track credits not tokens
  - Show "X credits remaining"
  - Call /api/usage/record after each message

// 3. Exhaustion modal (NEW)
TrialExhaustedModal:
  - Shows when credits reach 0
  - Option 1: "Upgrade to GrowthPlus" → Stripe
  - Option 2: "Get Free API Key" → guide
  - No option to just continue
```

### Database Schema

```sql
-- New table for trial tracking
CREATE TABLE free_trials (
  email VARCHAR(255) PRIMARY KEY,
  credits_used INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  trial_used BOOLEAN DEFAULT FALSE
);

-- New table for subscriptions
CREATE TABLE subscriptions (
  email VARCHAR(255) PRIMARY KEY,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  status ENUM('active', 'canceled', 'past_due'),
  bonus_credits INT DEFAULT 10000,
  created_at TIMESTAMP DEFAULT NOW(),
  canceled_at TIMESTAMP NULL
);

-- Track credit usage per user
CREATE TABLE credit_usage (
  email VARCHAR(255),
  tokens_used INT,
  timestamp TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (email) REFERENCES free_trials(email)
);
```

---

## Fraud Prevention

### Email-Based Prevention
- One free trial per email address
- Easy to verify (send confirmation email if desired)
- Prevents multi-accounting for tokens

### Rate Limiting Prevention
- Limit API calls per email to ~100/day
- Limit free tier to max 10 requests/minute
- Flag suspicious patterns (e.g., 1000 tokens in 1 minute)

### Backend Validation
```javascript
function validateCreditsRemaining(email) {
  const trial = db.getFreeTrial(email);
  const subscription = db.getSubscription(email);
  
  let total = 0;
  
  if (trial && !trial.trial_used) {
    total += 1000; // Free trial
  }
  
  if (subscription && subscription.status === 'active') {
    total += subscription.bonus_credits; // GrowthPlus
  }
  
  return total; // Return available credits
}
```

---

## Transition Plan

### Right Now
- [ ] Update frontend to accept email
- [ ] Create TrialExhaustedModal component
- [ ] Update messaging to "credits" instead of "tokens"

### Before Launch
- [ ] Create backend endpoints (5 endpoints above)
- [ ] Setup database tables
- [ ] Integrate Stripe for subscriptions
- [ ] Test email verification flow
- [ ] Test credit exhaustion flow
- [ ] Test GrowthPlus upgrade flow

### After Launch
- [ ] Monitor credit usage patterns
- [ ] Adjust credit-to-token conversion if needed
- [ ] Track subscription conversion rates
- [ ] Monitor for fraud/abuse
- [ ] Optimize upsell messaging based on data

---

## Key Numbers for Your Business

| Metric | Target | Formula |
|--------|--------|---------|
| Free Trial → GrowthPlus Conversion | 15-20% | Depends on features |
| Free Trial → Free API Key Adoption | 30-50% | Word-of-mouth |
| Customer Lifetime Value | $50-200 | $9.99 × months active |
| Monthly Recurring Revenue | TBD | #Subscribers × $9.99 |
| Cost Per User | <$0.02 | API costs / users |
| Profit Margin | >95% | (Revenue - costs) / revenue |

---

## Stripe Integration (Next Phase)

When ready, you'll need:
1. Stripe account
2. Stripe API key (backend)
3. Stripe frontend library
4. Payment form component
5. Webhook handler for subscription events

Details in separate STRIPE_INTEGRATION.md when you're ready.

---

## Summary

✅ Users get 1,000 free credits with just an email
✅ One email = one trial (bot prevention)
✅ GrowthPlus = $9.99/month for 10,000 more credits
✅ Users can also get their own free API keys for unlimited access
✅ You only pay if they use YOUR keys (minimal cost)
✅ Users who upgrade pay for themselves (Groq/OpenAI)
✅ No hosting costs for token infrastructure
✅ Clean, simple, scalable model

You're not in the token business. You're in the module/features business.

