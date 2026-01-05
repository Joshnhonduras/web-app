# GrowthPlus Implementation Checklist

## ✅ Already Done (Frontend)

- [x] Email collection modal (TrialWelcomeModal.tsx)
- [x] Trial exhaustion modal (TrialExhaustedModal.tsx)
- [x] Usage tracking service with email support
- [x] GrowthPlus upgrade function
- [x] Updated disclaimers for GrowthPlus
- [x] All messaging per requirements
- [x] Groq + OpenRouter direct links
- [x] "quick and easy <2min" messaging

## ⏳ Still Needed (Backend + Integration)

### Phase 1: Email Verification System

**Backend Endpoints:**
- [ ] `POST /api/trial/start` - Initialize free trial for email
  ```javascript
  Request: { email: "user@example.com" }
  Response: { credits: 1000, status: "active" }
  Logic: Check if email already used trial
  ```

- [ ] `POST /api/usage/record` - Record credit usage
  ```javascript
  Request: { email, tokensUsed: 150 }
  Response: { creditsRemaining: 850 }
  ```

- [ ] `GET /api/usage/check` - Check remaining credits
  ```javascript
  Request: ?email=user@example.com
  Response: { remaining: 850, isTrialActive: true, isPaid: false }
  ```

**Database:**
- [ ] Create `free_trials` table
  ```sql
  CREATE TABLE free_trials (
    email VARCHAR(255) PRIMARY KEY,
    credits_used INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    trial_started BOOLEAN DEFAULT FALSE
  );
  ```

**Frontend Integration:**
- [ ] Update Chat component to call `/api/trial/start` with email
- [ ] Store email locally in session
- [ ] Call `/api/usage/check` after each message
- [ ] Show credits remaining to user

---

### Phase 2: GrowthPlus Subscription System

**Backend Endpoints:**
- [ ] `POST /api/subscription/upgrade` - Handle GrowthPlus upgrade
  ```javascript
  Request: { email, stripeToken }
  Response: { success: true, newCredits: 10000 }
  ```

- [ ] `GET /api/subscription/status` - Check subscription status
  ```javascript
  Request: ?email=user@example.com
  Response: { isPaid: true, creditsRemaining: 11000, nextBillingDate: "2026-02-04" }
  ```

**Database:**
- [ ] Create `subscriptions` table
  ```sql
  CREATE TABLE subscriptions (
    email VARCHAR(255) PRIMARY KEY,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    status ENUM('active', 'canceled', 'past_due'),
    bonus_credits INT DEFAULT 10000,
    created_at TIMESTAMP DEFAULT NOW(),
    canceled_at TIMESTAMP NULL
  );
  ```

**Stripe Integration:**
- [ ] Create Stripe account
- [ ] Add Stripe API keys to backend
- [ ] Implement payment form in frontend
- [ ] Handle Stripe webhooks for subscription events
- [ ] Create billing portal link in Settings

**Frontend Components:**
- [ ] Create payment form component
- [ ] Add "Upgrade" button to TrialExhaustedModal
- [ ] Update Settings to show subscription status
- [ ] Add "Cancel Subscription" option

---

### Phase 3: Credit Deduction System

**Backend:**
- [ ] Calculate tokens per message (or receive from frontend)
- [ ] Deduct credits from user's allowance
- [ ] Return error if credits insufficient
- [ ] Track usage in `credit_usage` table

**Frontend:**
- [ ] Send token count estimate with each message
- [ ] Receive credit deduction confirmation
- [ ] Update displayed credits in real-time
- [ ] Show warning when credits < 500

**Database:**
- [ ] Create `credit_usage` table
  ```sql
  CREATE TABLE credit_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    tokens_used INT,
    timestamp TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (email) REFERENCES free_trials(email)
  );
  ```

---

### Phase 4: Bot Prevention & Rate Limiting

**Backend:**
- [ ] Implement rate limiting: 100 API calls/day per email
- [ ] Implement rate limiting: 10 calls/minute per email
- [ ] Add suspicious activity logging
- [ ] Create alerts for unusual patterns (e.g., 1000 tokens in 1 minute)
- [ ] IP-based rate limiting as backup
- [ ] Detect: Same IP with 100+ different emails
- [ ] Flag: Emails with 10+ signups from same IP

**Monitoring:**
- [ ] Log all trial starts with email + IP
- [ ] Log all credit usage by email
- [ ] Alert on: Usage spike, multiple emails same IP, unusual patterns
- [ ] Dashboard for fraud detection

---

### Phase 5: Testing & QA

**Email Verification Testing:**
- [ ] First email gets 1,000 credits ✓
- [ ] Same email second time shows "used" message ✓
- [ ] Different email gets new 1,000 credits ✓
- [ ] Credits deduct correctly per message ✓
- [ ] Exhaustion message appears at 0 credits ✓

**GrowthPlus Testing:**
- [ ] Stripe payment succeeds ✓
- [ ] Credits increase to 10,000 after upgrade ✓
- [ ] Subscription status reflects in API ✓
- [ ] Can cancel subscription ✓
- [ ] Refund/reactivation works ✓

**Bot Prevention Testing:**
- [ ] 100+ requests/day blocked ✓
- [ ] 10+ requests/min blocked ✓
- [ ] Multiple emails from same IP flagged ✓
- [ ] Suspicious patterns logged ✓

**User Flow Testing:**
- [ ] New user → Email → 1,000 credits ✓
- [ ] User exhausts → GrowthPlus offer shown ✓
- [ ] Click GrowthPlus → Payment form ✓
- [ ] After payment → 10,000 more credits ✓
- [ ] Click "Get API Key" → Setup guide ✓
- [ ] User returns with own key → Unlimited ✓

---

## 📋 Implementation Order

1. **Week 1:** Email verification + database
2. **Week 2:** GrowthPlus endpoints + Stripe setup
3. **Week 3:** Frontend integration + testing
4. **Week 4:** Rate limiting + bot prevention
5. **Week 5:** Final testing + deployment

---

## 🔧 Configuration Values

```javascript
// Token/Credit Constants
FREE_TRIAL_CREDITS = 1000
GROWTHPLUS_BONUS_CREDITS = 10000
TOTAL_MONTHLY_CREDITS = 11000 (if subscribed)

// Rate Limits
MAX_REQUESTS_PER_DAY = 100
MAX_REQUESTS_PER_MINUTE = 10

// Stripe
MONTHLY_PRICE = $9.99 = 999 (cents)
TRIAL_PERIOD = 0 (no trial, immediate activation)
BILLING_CYCLE = monthly
CANCELLATION = immediate

// Warning Thresholds
WARN_WHEN_CREDITS_BELOW = 500
SHOW_EXHAUSTION_AT = 0
```

---

## �� Success Metrics

After launch, track:
- Conversion: Free trial → GrowthPlus (target: 15-20%)
- Conversion: Free trial → Free API key (target: 30-50%)
- Churn: GrowthPlus cancellation rate (target: <5%)
- CAC: Cost per subscriber
- LTV: Lifetime value per subscriber
- Bot attempts caught
- MRR: Monthly recurring revenue

---

## 📝 Notes

- Users NEVER enter credit card for free trial (email only)
- Email prevents bot abuse WITHOUT friction
- GrowthPlus is ONE subscription tier ($9.99/month)
- Users can downgrade to free API key anytime
- No "premium features" - only subscription = more credits
- Same modules/courses/features for all users (free tier can access all)
- Difference: Free tier has 1K, GrowthPlus has 11K credits

---

Start with Phase 1! 🚀
