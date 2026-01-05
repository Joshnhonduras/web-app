# GrowthHub Web Deployment Guide

## What You Need to Get Online

### 1. Domain Name
- **Where to get:** Namecheap, GoDaddy, Cloudflare Registrar
- **Cost:** $8-15/year
- **What to do:** 
  - Register your domain (e.g., growthhub.com)
  - Update nameservers or point DNS

### 2. Hosting Provider (Backend)
**Options for your distributed inference setup:**

#### Option A: Simple Hosting (Recommended for start)
- **Vercel** (Frontend) - Free tier, great for React
- **Render/Railway** (Backend) - Free tier, Node.js support
- **Cost:** $0-50/month

#### Option B: VPS with Your T7910s
- **Cloudflare Tunnel** (reverse proxy, free)
- **Ngrok** (for development, free tier limited)
- **Tailscale** (VPN, free for personal)
- **Cost:** $0 (if using your own hardware)

#### Option C: Full Cloud Stack
- **AWS/Google Cloud/Azure** 
- **Cost:** $100-500/month (expensive, avoid for now)

### 3. SSL/HTTPS Certificate
- **Cloudflare** (free, automatic)
- **Let's Encrypt** (free, manual renewal)
- **Paid certs** (unnecessary, don't buy)

### 4. DNS Configuration
- **Setup:** A record points to your server IP
- **Or:** Use Cloudflare's nameservers (easier)

---

## My Recommendation: Cloudflare + Vercel + Your T7910

### Architecture

```
User Browser
    ↓
Cloudflare (DNS + cache + DDoS protection) - FREE
    ↓
Vercel (Frontend React app) - FREE
    ↓
Your Backend (T7910 + Colab via Cloudflare Tunnel) - FREE
    ↓
Inference (T7910 + Colab + Groq + OpenRouter) - FREE
```

---

## Step-by-Step: Get GrowthHub Online

### Step 1: Setup Cloudflare (5 minutes)

```bash
# 1. Go to cloudflare.com
# 2. Sign up (free)
# 3. Add your domain
# 4. Update nameservers at registrar to:
   - NS1.CLOUDFLARE.COM
   - NS2.CLOUDFLARE.COM
# 5. Wait 24-48 hours for DNS propagation
```

### Step 2: Setup Vercel (Frontend) (10 minutes)

```bash
# 1. Go to vercel.com
# 2. Sign up with GitHub
# 3. Connect your growth_hub repo
# 4. Deploy frontend (auto-deploys on push)
# 5. Custom domain: growthhub.com
# 6. Add environment variables

# .env.production
NEXT_PUBLIC_API_URL=https://api.growthhub.com
NEXT_PUBLIC_STRIPE_KEY=pk_...
```

**Cost:** FREE tier includes:
- Unlimited deployments
- Custom domain
- SSL/HTTPS
- 100GB bandwidth/month

### Step 3: Setup Backend (Your T7910)

**Option A: Cloudflare Tunnel (Easiest)**

```bash
# 1. Install cloudflared
curl https://pkg.cloudflare.com/cloudflare-release.key | sudo gpg --yes --dearmor --output /usr/share/keyrings/cloudflare-archive-keyring.gpg
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-archive-keyring.gpg] https://pkg.cloudflare.com/linux focal main' | sudo tee /etc/apt/sources.list.d/cloudflare-main.list
sudo apt-get install cloudflared

# 2. Authenticate
cloudflared login
# Opens browser, authorize your Cloudflare account

# 3. Create tunnel
cloudflared tunnel create growth-hub

# 4. Point to your backend
cloudflared tunnel route dns growth-hub api.growthhub.com

# 5. Start tunnel
cloudflared tunnel run growth-hub --url http://localhost:3001
```

**What this does:**
- Creates secure tunnel from your T7910 to internet
- Cloudflare acts as reverse proxy
- Your T7910 IP never exposed
- FREE tier: unlimited tunnels

**Cost:** $0

### Step 4: Setup Backend API (Node.js/Express)

```bash
# Your backend on T7910
cd /mnt/hdd/growth_hub/web-app/backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'DOTENV'
PORT=3001
NODE_ENV=production

# API Keys (never commit!)
GROQ_API_KEY_A=gsk_xxxxx
GROQ_API_KEY_B=gsk_yyyyy
OPENROUTER_API_KEY_A=sk_or_xxxxx
OPENROUTER_API_KEY_B=sk_or_yyyyy

# Colab URLs
COLAB_A_URL=https://xyz.ngrok.io
COLAB_B_URL=https://abc.ngrok.io

# Database
DATABASE_URL=postgresql://user:pass@localhost/growthhub

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# CORS
ALLOWED_ORIGINS=https://growthhub.com
DOTENV

# Start backend
npm start
```

### Step 5: Database Setup

**Option A: Cloud Database (Easiest)**
```bash
# Use Supabase (PostgreSQL)
# - Sign up at supabase.com
# - Create project
# - Copy connection string
# - Cost: FREE tier = 500MB storage

DATABASE_URL="postgresql://user:pass@db.supabase.co:5432/postgres"
```

**Option B: Local PostgreSQL (T7910)**
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb growthhub
sudo -u postgres createuser growthhub
sudo -u postgres psql -c "ALTER USER growthhub WITH PASSWORD 'secure_password';"

# Cost: FREE (runs on your T7910)
```

### Step 6: Stripe Integration (Payment Processing)

```bash
# 1. Go to stripe.com
# 2. Sign up
# 3. Get API keys:
#    - Publishable key (frontend)
#    - Secret key (backend)
#    - Webhook secret (for events)

# 4. Create product in Stripe dashboard:
#    - Name: "GrowthPlus"
#    - Price: $9.99/month
#    - Recurring: Yes

# 5. Add to .env
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Cost:** FREE until you process payments, then 2.9% + $0.30 per transaction

### Step 7: Email Service (Signup emails)

**Option A: SendGrid (Free tier)**
```bash
# 1. sendgrid.com
# 2. Sign up (free)
# 3. Verify sender email
# 4. Get API key
# 5. Cost: 100 emails/day free

SENDGRID_API_KEY=SG.xxxxx
```

**Option B: Gmail SMTP (Free)**
```bash
# Use your Gmail account
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
# Generate app password in Gmail settings
# Cost: FREE
```

---

## DNS Configuration (Critical!)

In Cloudflare DNS settings, add:

```
Type    Name            Content               TTL
A       growthhub.com   [Vercel IP]          Auto
CNAME   www             growthhub.com.       Auto
CNAME   api             [Your T7910 IP/Tunnel] Auto
```

Or let Cloudflare auto-detect (easier).

---

## Complete Infrastructure Map

```
growthhub.com (Domain)
    ↓
Cloudflare (FREE)
├─ DNS
├─ DDoS protection
├─ SSL/HTTPS
├─ Cache layer
└─ Tunnel to backend
    ↓
├─ Frontend: Vercel (FREE)
│  └─ React app deployed
│
└─ Backend: Your T7910 (FREE)
   ├─ Node.js API server
   ├─ Cloudflare Tunnel
   ├─ PostgreSQL database
   └─ Routes to:
      ├─ T7910 inference servers
      ├─ Colab GPUs
      ├─ Groq API
      └─ OpenRouter API
```

---

## Cost Breakdown

| Component | Cost | Notes |
|-----------|------|-------|
| Domain | $10/year | namecheap.com |
| Frontend (Vercel) | $0 | FREE tier |
| Backend (T7910) | $0 | You own it |
| Database (Supabase) | $0 | FREE tier (500MB) |
| Email (SendGrid) | $0 | 100/day free |
| SSL/HTTPS (Cloudflare) | $0 | FREE |
| Inference (Colab) | $0 | FREE tier |
| Inference (Groq) | $0 | FREE tier |
| Cloudflare Tunnel | $0 | FREE |
| **Total Monthly** | **$0.83/month** | (domain amortized) |

You're running an enterprise service for less than $1/month in infrastructure.

---

## Deployment Checklist

### Pre-Deployment
- [ ] Domain registered and pointing to Cloudflare
- [ ] Vercel project created and connected to GitHub
- [ ] Backend .env configured (no secrets in code)
- [ ] Database created and migrations run
- [ ] Stripe account setup with products
- [ ] SendGrid/Gmail configured for emails
- [ ] SSL certificates auto-generated
- [ ] Environment variables added to Vercel
- [ ] Environment variables added to T7910 backend

### Launch Day
- [ ] Start backend: `cloudflared tunnel run growth-hub`
- [ ] Push frontend changes → Vercel auto-deploys
- [ ] Test HTTPS: `curl https://api.growthhub.com/health`
- [ ] Test frontend loads
- [ ] Test signup flow
- [ ] Test free trial
- [ ] Test Stripe payment (test mode)
- [ ] Test email sending
- [ ] Monitor Cloudflare dashboard

### Post-Launch
- [ ] Setup monitoring (Sentry, New Relic, etc.)
- [ ] Setup error logging
- [ ] Monitor costs
- [ ] Watch rate limits on free APIs
- [ ] Backup database
- [ ] Setup SSL renewal (auto via Cloudflare)

---

## Troubleshooting

### Domain not resolving?
```bash
# Check DNS propagation
nslookup growthhub.com
dig growthhub.com

# Should return Cloudflare nameservers
# May take 24-48 hours to fully propagate
```

### Backend not accessible?
```bash
# Check tunnel is running
cloudflared tunnel info growth-hub

# Check backend is listening
netstat -tulpn | grep 3001

# Test locally
curl http://localhost:3001/health
```

### HTTPS not working?
```bash
# Check certificate
curl -vI https://api.growthhub.com

# Cloudflare should auto-issue cert
# May take 24 hours for first time
```

### Stripe not charging?
```bash
# Test mode vs Live mode
# Make sure you're in LIVE mode
# Test with Stripe test card: 4242 4242 4242 4242
# Only switches to live after account verification
```

---

## Going Live Checklist

Before accepting real payments:
- [ ] Stripe account fully verified
- [ ] HTTPS working on all domains
- [ ] Rate limiting in place on backend
- [ ] Bot prevention active (email verification)
- [ ] Error handling on all endpoints
- [ ] Monitoring setup for downtime
- [ ] Backup strategy for database
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Contact/support page
- [ ] Test full user flow end-to-end

---

## Next Steps (In Order)

1. **Week 1:** Setup domain + Cloudflare
2. **Week 2:** Deploy frontend to Vercel
3. **Week 3:** Setup backend on T7910 + Cloudflare Tunnel
4. **Week 4:** Integrate Stripe + database
5. **Week 5:** Setup email + monitoring
6. **Week 6:** Go live!

---

## Questions to Answer About Your Setup

Can you clarify what's shown in domain.png?
- Is it a domain registrar screenshot?
- Is it DNS settings?
- Is it a hosting provider dashboard?

Once I see it, I can give you exact next steps specific to your situation.

