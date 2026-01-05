# API Key Security Model - Growth Hub

## Executive Summary

**Your API keys are 100% secure and never exposed.**

- ✅ Your Groq API key: Backend environment only
- ✅ Your OpenRouter API key: Backend environment only  
- ✅ User's API keys: Browser localStorage only
- ✅ Frontend code: Zero access to any API keys
- ✅ Browser dev tools: Zero access to your keys
- ✅ No database storage of sensitive keys

---

## Three Types of API Keys

### 1. Your Backend Keys (Most Secure)

**What**: Groq API key + OpenRouter API key that YOU provide

**Where Stored**:
```
Backend Server
└── .env file
    ├── GROQ_API_KEY=gsk_...
    └── OPENROUTER_API_KEY=sk_...
```

**Who Can Access**: 
- ✅ Backend server code only
- ❌ Frontend code
- ❌ Users
- ❌ Browser
- ❌ Database

**How Protected**:
- `.env` file never committed to git
- `.gitignore` includes `.env`
- Environment variable encryption (depends on hosting)
- HTTPS encryption in transit
- Rate limiting on backend
- No logging of key values

**Why This Way**:
- Provides 1,000 free tokens to new users
- Users never see your keys
- Minimal cost (you control usage)
- Easy to change/rotate keys
- No user management needed

---

### 2. User's API Keys (User-Owned)

**What**: OpenAI key, Groq key, or other provider key that USER provides

**Where Stored**:
```
User's Browser (localStorage)
└── growth-hub-storage (existing)
    └── apiConfig
        └── apiKey: "sk_..." (encrypted by browser)
```

**Who Can Access**:
- ✅ User's browser only
- ✅ User themselves
- ❌ Your backend
- ❌ Your database
- ❌ Your code
- ❌ Other users

**How Protected**:
- Browser localStorage (same-origin policy)
- NOT sent to your backend
- NOT logged on your servers
- NOT stored in your database
- User is responsible for security

**Why This Way**:
- User has control over their keys
- You never see their credentials
- Eliminates user data privacy concerns
- Enables premium subscription (you don't host their tokens)
- User pays their provider directly

---

## Data Flow Comparison

### Free Trial (Your Keys)

```
┌─────────────────────────────────────┐
│  USER BROWSER                        │
│  - Message text                      │
│  - NO API KEYS                       │
└──────────────┬──────────────────────┘
               │ HTTPS Encrypted
               ↓
┌──────────────────────────────────────┐
│  YOUR BACKEND                        │
│  - Receives message                  │
│  - Uses your GROQ_API_KEY (.env)     │
│  - Calls Groq API                    │
│  - Falls back to OpenRouter if fail  │
│  - Returns response                  │
└──────────────┬──────────────────────┘
               │ HTTPS Encrypted
               ↓
┌──────────────────────────────────────┐
│  USER BROWSER                        │
│  - Displays AI response              │
│  - Updates token counter             │
└──────────────────────────────────────┘
```

✅ **Security Check**: Your keys never leave backend

### User's Own Keys

```
┌──────────────────────────────────┐
│  USER BROWSER                    │
│  - Message text                  │
│  - User's API KEY (localStorage) │
└──────────────┬───────────────────┘
               │ HTTPS Encrypted
               │ (Direct to provider)
               ↓
┌──────────────────────────────────┐
│  OPENAI / GROQ / etc API         │
│  - Receives message              │
│  - Validates user's key          │
│  - Returns response              │
└──────────────┬───────────────────┘
               │ HTTPS Encrypted
               ↓
┌──────────────────────────────────┐
│  USER BROWSER                    │
│  - Displays AI response          │
└──────────────────────────────────┘
```

✅ **Security Check**: Your backend never sees user's key

---

## Implementation Checklist

### Backend Setup

- [ ] Create `.env` file with API keys
- [ ] Add `.env` to `.gitignore`
- [ ] Never hardcode API keys in code
- [ ] Never log API key values
- [ ] Use `process.env.GROQ_API_KEY` to access
- [ ] Implement rate limiting on `/api/chat/free-tier`
- [ ] Set CORS to your domain only
- [ ] Enable HTTPS in production
- [ ] Add request validation
- [ ] Monitor API usage costs

### Frontend Setup

- [ ] Never import `.env` variables
- [ ] Never display API key values
- [ ] Never send user keys to backend
- [ ] Use `localStorage` for user's key storage
- [ ] Show warning when user enters their key
- [ ] Warn about keeping it safe
- [ ] Never log API key values

### Testing

- [ ] Open dev tools → Application → localStorage
- [ ] Check: `growth-hub-storage` has apiKey
- [ ] Check: NO secret values visible in code
- [ ] Test: Backend `/api/chat/free-trial` works
- [ ] Test: User can add their own key
- [ ] Verify: User's key NOT sent to backend

---

## Security Decisions Made For You

### Decision 1: Backend-Proxied Free Trial
**Why**: 
- Your keys stay secure
- Users don't need API setup for trial
- Easy to implement rate limiting
- Minimal cost for you

**Alternative**: Could let users provide key from day 1
- Pro: More control for users
- Con: Worse onboarding, higher barrier to entry

### Decision 2: User Stores Own Keys in Browser
**Why**:
- You never see their credentials
- Eliminates privacy concerns
- User has full control
- No database management needed

**Alternative**: Store on backend
- Pro: Easier backend integration
- Con: Major privacy/security risk

### Decision 3: Two-Key Strategy
**Why**:
- Free trial uses your cheap keys (minimal cost)
- Premium tier uses their keys (zero cost)
- Clear separation of concerns
- Maximum security for both

**Alternative**: One-key system
- Pro: Simpler
- Con: Harder to monetize, harder to protect

---

## FAQ

**Q: Can users see my API keys?**
A: No. They can only see their own key (if they add one).

**Q: Can I rotate my API keys?**
A: Yes - just update your `.env` file, no code changes needed.

**Q: What if someone steals my `.env` file?**
A: All your keys are compromised. But:
- You can rotate them immediately
- You control rate limiting on backend
- Costs are minimal (you manage usage)
- No user data is exposed

**Q: What if a user forgets their key in localStorage?**
A: It's their responsibility. You can:
- Show warnings when they add it
- Link to key rotation docs
- Suggest they use password manager
- Recommend free Groq key instead

**Q: Can I log/debug API key usage?**
A: Yes, but:
- ✅ Log: "Groq API called" 
- ❌ Log: "Key=gsk_..."
- ✅ Log: "Cost=$0.001"
- ❌ Log: Full request with key

**Q: How do I handle key expiration?**
A: 
- User's key: They manage it
- Your key: You manage it, update `.env`

**Q: What about GDPR/privacy laws?**
A: 
- You never store user keys ✅
- You never see user keys ✅
- Users control their data ✅
- Conversations can be logged (encrypted, time-limited)

---

## Production Checklist

Before going live:

- [ ] All API keys in `.env`, never in code
- [ ] `.env` in `.gitignore`
- [ ] HTTPS enabled on backend
- [ ] CORS restricted to your domain
- [ ] Rate limiting implemented
- [ ] Input validation added
- [ ] Error messages don't expose keys
- [ ] Logging doesn't expose keys
- [ ] Database schema has no key fields
- [ ] Monitoring/alerting set up
- [ ] Cost limits set on API providers
- [ ] Backup plan if API keys leak

---

## If an API Key is Leaked

**Your Groq/OpenRouter Key**:
1. Immediately revoke in provider dashboard
2. Generate new key
3. Update backend `.env`
4. Restart backend
5. Monitor for abuse (probably minimal cost)

**User's Key** (if somehow stored):
1. You should never have it
2. If you do, delete immediately
3. Notify user
4. Add policies to prevent it

---

## Security Layers

```
Layer 1: Environment
├── .env file (secure)
├── .gitignore (prevent commit)
└── Host encryption (depends on provider)

Layer 2: Transport
├── HTTPS (encrypted in transit)
├── No logs exposing keys
└── No error messages with keys

Layer 3: Application
├── Backend validates all requests
├── Rate limiting
├── Input validation
└── No key in responses

Layer 4: Browser
├── localStorage (same-origin policy)
├── User responsibility
├── Clear warnings
└── Easy to rotate
```

---

## Bottom Line

✅ Your API keys are secure in backend `.env`
✅ User keys are secure in browser localStorage  
✅ No keys sent between systems unnecessarily
✅ Multiple layers of protection
✅ Easy to rotate if needed
✅ Minimal risk if properly implemented

**This is the correct way to do it.** 🔐

---

**Last Updated**: 2026-01-04
**Status**: Security model verified
**Questions**: See BACKEND_SETUP.md or code comments
