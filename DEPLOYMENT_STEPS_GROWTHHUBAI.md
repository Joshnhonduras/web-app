# GrowthHub Deployment Plan - growthhubai.dev

## Current Status
✅ Domain registered: **growthhubai.dev**
✅ Registrar: Porkbun
✅ Domain Lock: ON (secure)
✅ Auto Renew: OFF (need to fix)
❌ Nameservers: Still pointing to Porkbun defaults
❌ DNS records: Only 2 records (need to add Cloudflare)
❌ SSL: Not configured
❌ API Access: Not enabled

---

## STEP 1: Enable Auto Renewal (5 minutes)

**In Porkbun Dashboard:**
1. Go to Domain List
2. Click on **growthhubai.dev**
3. Scroll to "Auto Renew" section
4. Click **"Add renewal to Cart"** or toggle "Auto Renew" ON
5. Complete checkout (should be ~$12.87/year)

**Why:** Prevent domain expiration (loses everything)

---

## STEP 2: Setup Cloudflare (10 minutes)

Cloudflare will:
- Manage DNS automatically
- Provide FREE SSL/HTTPS
- Cache + DDoS protection
- Fast nameservers
- Reverse proxy for your T7910

**Process:**

### 2a. Create Cloudflare Account
```bash
# 1. Go to cloudflare.com
# 2. Sign up (free tier)
# 3. Verify email
```

### 2b. Add Domain to Cloudflare
```bash
# 1. In Cloudflare dashboard, click "Add a domain"
# 2. Enter: growthhubai.dev
# 3. Select FREE plan
# 4. Continue
# 5. Cloudflare shows nameservers to add
```

### 2c. Update Nameservers in Porkbun
Cloudflare will give you 2 nameservers like:
```
NS1: brenda.ns.cloudflare.com
NS2: cornell.ns.cloudflare.com
```

**Update in Porkbun:**
1. Go to **Porkbun Domain List**
2. Click **growthhubai.dev**
3. Scroll to "Nameservers" section
4. Click **"Manage"** or edit button
5. Replace the 4 Porkbun nameservers with Cloudflare's 2
6. Save changes
7. Wait 5-30 minutes for propagation

---

## STEP 3: Configure DNS Records in Cloudflare (10 minutes)

Once nameservers propagate, add DNS records:

### For Frontend (Vercel)
```
Type: A / CNAME
Name: growthhubai.dev (or just @)
Content: 76.76.19.21  (Vercel's IP - or use CNAME)
TTL: Auto
Proxy: Proxied (orange cloud)
```

**Or if using CNAME:**
```
Type: CNAME
Name: growthhubai.dev
Content: cname.vercel.com
TTL: Auto
Proxy: Proxied
```

### For Backend (T7910 via Cloudflare Tunnel)
```
Type: CNAME
Name: api
Content: [cloudflare-tunnel-url]
TTL: Auto
Proxy: Proxied
```

*(You'll get the tunnel URL after Step 5)*

### Also add www subdomain
```
Type: CNAME
Name: www
Content: growthhubai.dev
TTL: Auto
Proxy: Proxied
```

---

## STEP 4: Enable SSL in Cloudflare (5 minutes)

**In Cloudflare Dashboard:**
1. Go to **SSL/TLS** section
2. Select encryption mode: **Full (strict)**
3. Under "Edge Certificates", check:
   - Auto HTTPS Rewrites: ON
   - Always Use HTTPS: ON
   - Minimum TLS Version: 1.2

**Result:** All traffic forced to HTTPS 🔒

---

## STEP 5: Setup Cloudflare Tunnel (Backend) (15 minutes)

This exposes your T7910 backend securely:

```bash
# On your T7910:

# 1. Install cloudflared
curl https://pkg.cloudflare.com/cloudflare-release.key | sudo gpg --yes --dearmor --output /usr/share/keyrings/cloudflare-archive-keyring.gpg
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-archive-keyring.gpg] https://pkg.cloudflare.com/linux focal main' | sudo tee /etc/apt/sources.list.d/cloudflare-main.list
sudo apt-get update
sudo apt-get install cloudflared

# 2. Authenticate
cloudflared login
# Opens browser → authorize with Cloudflare account

# 3. Create tunnel
cloudflared tunnel create growth-hub

# 4. Configure tunnel (create config file)
mkdir -p ~/.cloudflared

cat > ~/.cloudflared/config.yml << 'TUNNEL'
tunnel: growth-hub
credentials-file: /home/[YOUR_USER]/.cloudflared/[TUNNEL_ID].json

ingress:
  - hostname: api.growthhubai.dev
    service: http://localhost:3001
  - hostname: growthhubai.dev
    service: http://localhost:3001
  - service: http_status:404
TUNNEL

# 5. Route DNS to tunnel
cloudflared tunnel route dns growth-hub api.growthhubai.dev
cloudflared tunnel route dns growth-hub growthhubai.dev

# 6. Start tunnel (run in background or systemd)
cloudflared tunnel run growth-hub

# Or setup systemd auto-start:
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

**Verify tunnel is working:**
```bash
# Check tunnel status
cloudflared tunnel info growth-hub

# Should show:
# Route configured: api.growthhubai.dev
# Route configured: growthhubai.dev
```

---

## STEP 6: Deploy Frontend to Vercel (10 minutes)

**In Vercel Dashboard:**

### 6a. Connect GitHub
1. Go to vercel.com
2. Sign up / login with GitHub
3. Click "New Project"
4. Select your growth_hub repository
5. Configure:
   - Framework: React / Next.js (auto-detected)
   - Root Directory: web-app
   - Build Command: `npm run build`
   - Output Directory: `dist` or `.next`

### 6b. Environment Variables
Add in Vercel Project Settings:

```
NEXT_PUBLIC_API_URL=https://api.growthhubai.dev
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxxxx
```

### 6c. Add Custom Domain
1. In Vercel Project Settings → Domains
2. Add: `growthhubai.dev`
3. Vercel shows DNS instructions
4. Confirm DNS is already set via Cloudflare
5. Should auto-verify within 24 hours

---

## STEP 7: Start Backend on T7910 (15 minutes)

**On T7910:**

```bash
cd /mnt/hdd/growth_hub/web-app

# Create .env file (NEVER commit this!)
cat > .env << 'DOTENV'
NODE_ENV=production
PORT=3001

# API Keys (keep secret!)
GROQ_API_KEY_A=gsk_xxxxx
GROQ_API_KEY_B=gsk_yyyyy
OPENROUTER_API_KEY_A=sk_or_xxxxx
OPENROUTER_API_KEY_B=sk_or_yyyyy

# Colab GPU URLs
COLAB_A_URL=https://xyz.ngrok.io
COLAB_B_URL=https://abc.ngrok.io

# Database
DATABASE_URL=postgresql://user:pass@localhost/growthhub

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# CORS
ALLOWED_ORIGINS=https://growthhubai.dev,https://api.growthhubai.dev
DOTENV

# Install dependencies
npm install

# Setup database (if using local PostgreSQL)
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb growthhub
sudo -u postgres createuser growthhub_user
sudo -u postgres psql -c "ALTER USER growthhub_user WITH PASSWORD 'your_secure_password';"

# Run migrations (if you have them)
npm run migrate

# Start backend
npm start

# Or use PM2 to keep running:
npm install -g pm2
pm2 start "npm start" --name "growthhub-api"
pm2 startup
pm2 save
```

---

## STEP 8: Configure Stripe (10 minutes)

**In Stripe Dashboard:**

### 8a. Create Product
1. Go to stripe.com/dashboard
2. Products → Add product
3. Name: "GrowthPlus"
4. Price: $9.99 USD
5. Billing period: Monthly
6. Save

### 8b. Get API Keys
1. Developers → API Keys
2. Copy:
   - **Publishable Key**: pk_live_xxxxx
   - **Secret Key**: sk_live_xxxxx
3. Add to `.env` on T7910

### 8c. Setup Webhook
1. Developers → Webhooks
2. Add endpoint: `https://api.growthhubai.dev/webhook/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy Webhook Secret → add to `.env`

---

## STEP 9: Setup Database (If Using Cloud)

**Option A: Supabase (Easiest)**
```bash
# 1. Go to supabase.com
# 2. Sign up
# 3. Create project
# 4. Copy connection string:
#    postgresql://user:password@db.supabase.co:5432/postgres
# 5. Add to .env as DATABASE_URL
```

**Option B: Local PostgreSQL (On T7910)**
Already done in Step 7.

---

## STEP 10: Test Everything (20 minutes)

```bash
# Test frontend loads
curl https://growthhubai.dev

# Test API backend
curl https://api.growthhubai.dev/health

# Test Stripe webhook
# (from Stripe dashboard, send test event)

# Test email
# (trigger signup email in app)

# Test in browser
# 1. Open https://growthhubai.dev
# 2. Should load frontend
# 3. Try signup
# 4. Try chat (should route to backend)
```

---

## STEP 11: Setup PWA (Offline Support) (20 minutes)

Already documented in `PWA_INSTALLATION.md`. Key files:

```bash
# Create these files in your frontend:

public/manifest.json          # PWA metadata
public/service-worker.js      # Offline caching
public/icon-192x192.png       # App icon
public/icon-512x512.png       # App icon
public/offline.html           # Offline page

# Deploy to Vercel → auto-available at https://growthhubai.dev
```

---

## Complete Checklist

### Pre-Launch (This Week)
- [ ] Enable auto-renew on domain (Porkbun)
- [ ] Setup Cloudflare (free DNS + SSL)
- [ ] Change nameservers in Porkbun to Cloudflare
- [ ] Wait for DNS propagation (5-30 min)
- [ ] Deploy frontend to Vercel
- [ ] Add growthhubai.dev as custom domain in Vercel
- [ ] Setup Cloudflare Tunnel on T7910
- [ ] Start backend on T7910
- [ ] Create Stripe account + product
- [ ] Setup database (Supabase or local PostgreSQL)
- [ ] Test all endpoints

### Before Going Live
- [ ] Test signup flow end-to-end
- [ ] Test free trial (1,000 credits)
- [ ] Test Stripe payment (test mode first)
- [ ] Test email sending
- [ ] Test Colab/Groq/OpenRouter integration
- [ ] Setup monitoring/logging
- [ ] Verify HTTPS works (green padlock)
- [ ] Test on mobile + desktop

### Day 1 Launch
- [ ] Switch Stripe to LIVE mode
- [ ] Double-check all secrets in .env (not in code)
- [ ] Monitor for errors (check logs)
- [ ] Be ready to troubleshoot

---

## Timeline

- **Today:** Steps 1-2 (15 min)
- **Tomorrow:** Steps 3-6 (1 hour)
- **Day 3:** Steps 7-11 (2-3 hours)
- **Day 4:** Full testing + fixes (1-2 hours)
- **Day 5:** LAUNCH! 🚀

**Total time: 4-5 hours of active work**

---

## Troubleshooting

### DNS not resolving?
```bash
nslookup growthhubai.dev
dig growthhubai.dev

# Should show Cloudflare nameservers
# Takes 5-48 hours to fully propagate
```

### Backend not accessible?
```bash
# Check tunnel running
cloudflared tunnel info growth-hub

# Check backend listening
netstat -tulpn | grep 3001

# Test locally
curl http://localhost:3001/health
```

### HTTPS certificate issue?
Cloudflare auto-issues SSL. May take 24 hours. Check:
```bash
curl -vI https://api.growthhubai.dev
# Should show "HTTP/2 200" with Cloudflare cert
```

### Vercel deployment failed?
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing NEXT_PUBLIC_ env vars
# - Build command wrong
# - Node version mismatch
```

---

## Cost Summary

| Item | Cost | Notes |
|------|------|-------|
| Domain renewal | $12.87/year | Auto-enable in Porkbun |
| Cloudflare | FREE | Unlimited tunnels |
| Vercel | FREE | 100GB bandwidth/month |
| T7910 | Already own | Free infrastructure |
| Database (Supabase) | FREE | 500MB storage |
| Stripe | 2.9% + $0.30 per transaction | Only when customers pay |
| **Total Monthly** | **~$1.07** | (amortized annually) |

---

## You're Now Ready! 🎉

After completing these steps:
✅ growthhubai.dev accessible worldwide
✅ HTTPS secured with FREE SSL
✅ Backend running on your T7910
✅ Frontend deployed to Vercel
✅ Users can signup + pay
✅ PWA installable on phones
✅ Offline support
✅ Zero infrastructure costs

Everything is FREE except domain renewal ($1/month amortized) and Stripe fees (when you get paid).

Next action: **Start with Step 1 today!** ⏰

