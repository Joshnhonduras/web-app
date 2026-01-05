# DNS & Email Configuration Guide - growthhubai.dev

## Current Status
⚠️ **MX record missing** - Email won't work
⚠️ **Email security records missing** - SPF, DMARC, DKIM
✅ Cloudflare DNS setup: Full
✅ Proxied traffic ready

---

## Part 1: DNS Records Setup

### What You Need to Add

These are the **minimum required** DNS records for growthhubai.dev:

```
ZONE APEX (Root Domain - @)
─────────────────────────────

Name: growthhubai.dev (or @)
Type: A or CNAME
Target: [Vercel IP or CNAME]
TTL: Auto
Proxy Status: Proxied (orange cloud)
Purpose: Frontend app loads here

─────────────────────────────

Name: www
Type: CNAME
Target: growthhubai.dev
TTL: Auto
Proxy Status: Proxied (orange cloud)
Purpose: www.growthhubai.dev redirects to main domain

─────────────────────────────

Name: api
Type: CNAME
Target: [Cloudflare Tunnel URL]
TTL: Auto
Proxy Status: Proxied (orange cloud)
Purpose: Backend API at api.growthhubai.dev
```

---

## Part 2: Email Records (CRITICAL!)

### Why Email Records Matter

Without these, emails from @growthhubai.dev will be marked as spam or bounce completely.

### 2a. MX Records (Mail Exchange)

**What it does:** Tells email servers where to send mail for @growthhubai.dev

**Option A: Use Porkbun Email Hosting (Recommended for start)**

```
Name: growthhubai.dev (or @)
Type: MX
Priority: 10
Mail Server: aspmx.l.google.com
TTL: 3600

─────────────────────────────

Name: growthhubai.dev (or @)
Type: MX
Priority: 20
Mail Server: alt1.aspmx.l.google.com
TTL: 3600

─────────────────────────────

Name: growthhubai.dev (or @)
Type: MX
Priority: 30
Mail Server: alt2.aspmx.l.google.com
TTL: 3600

─────────────────────────────

Name: growthhubai.dev (or @)
Type: MX
Priority: 40
Mail Server: alt3.aspmx.l.google.com
TTL: 3600

─────────────────────────────

Name: growthhubai.dev (or @)
Type: MX
Priority: 50
Mail Server: alt4.aspmx.l.google.com
TTL: 3600
```

(These route email to Google's spam filter - Porkbun can add these for you)

**Option B: Use Cloudflare Email Routing (Even Easier!)**

```
In Cloudflare Dashboard:
1. Go to Email → Email Routing
2. Click "Enable Email Routing"
3. Add route:
   - Catch-all: * → Forward to joshnhonduras@gmail.com
4. Done! All @growthhubai.dev emails forward to your Gmail
```

**I recommend Option B (Cloudflare) for now** - it's free and instant.

---

### 2b. SPF Record (Spam Prevention)

**What it does:** Tells email providers which servers can send email from @growthhubai.dev

**For Cloudflare Email Routing:**
```
Name: growthhubai.dev (or @)
Type: TXT
Value: v=spf1 include:cloudflare.net ~all
TTL: Auto
```

**For Gmail:**
```
Name: growthhubai.dev (or @)
Type: TXT
Value: v=spf1 include:_spf.google.com ~all
TTL: Auto
```

**For SendGrid (if using their email):**
```
Name: growthhubai.dev (or @)
Type: TXT
Value: v=spf1 include:sendgrid.net ~all
TTL: Auto
```

---

### 2c. DMARC Record (Email Authentication)

**What it does:** Tells email providers what to do with unauthenticated emails

```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:admin@growthhubai.dev; ruf=mailto:admin@growthhubai.dev; fo=1
TTL: Auto
```

**Breaking this down:**
- `p=quarantine` = Suspicious emails go to spam (not reject)
- `rua=` = Reports sent to admin@growthhubai.dev
- `fo=1` = Report on all auth failures

---

### 2d. DKIM Record (Email Signing)

**What it does:** Digitally signs emails to prove they came from @growthhubai.dev

**For Cloudflare Email Routing:**
Cloudflare auto-generates this. Go to Email → Email Routing → Get DKIM details

You'll get something like:
```
Name: default._domainkey
Type: TXT
Value: v=DKIM1; k=rsa; p=MIGfMA0BgkqhkiG...
TTL: Auto
```

**For Gmail:**
```
Name: google._domainkey
Type: TXT
Value: v=DKIM1; k=rsa; p=MIGfMA0BgkqhkiG9w0BAQEFAAOCAQ8AMIGfMA0BgkqhkiG...
TTL: Auto
```

(Gmail provides the exact value when you verify domain ownership)

---

### 2e. MTA-STS Record (Enforces Encryption)

**What it does:** Forces email providers to use encrypted connections when sending to @growthhubai.dev

```
Name: _mta-sts
Type: TXT
Value: v=STSv1; id=20260105001;
TTL: Auto
```

Also need:
```
Name: mta-sts
Type: CNAME
Target: mta-sts.growthhubai.dev
TTL: Auto
```

(This is optional for now - implement after basics work)

---

## Part 3: Step-by-Step DNS Setup in Cloudflare

### 3a. Add Web Records

**In Cloudflare Dashboard → DNS:**

1. **Add Record 1: Frontend (Zone Apex)**
```
Type: CNAME
Name: growthhubai.dev (leave @ as-is)
Content: cname.vercel.com
TTL: Auto
Proxy status: Proxied (orange cloud)
Save
```

2. **Add Record 2: www subdomain**
```
Type: CNAME
Name: www
Content: growthhubai.dev
TTL: Auto
Proxy status: Proxied (orange cloud)
Save
```

3. **Add Record 3: API Backend**
```
Type: CNAME
Name: api
Content: [Your Cloudflare Tunnel URL - you'll get after Step 5 of deployment]
TTL: Auto
Proxy status: Proxied (orange cloud)
Save
```

### 3b. Add MX Records (Choose ONE option)

**Option 1: Cloudflare Email Routing (EASIEST)**

```
1. Go to Email → Email Routing in Cloudflare
2. Click "Enable Email Routing"
3. Add route:
   - Catch-all: *
   - Forward to: joshnhonduras@gmail.com
4. Done! Cloudflare auto-adds MX records
```

**Option 2: Manual MX Setup (Advanced)**

```
Go back to DNS → Add Record

Type: MX
Name: growthhubai.dev (@)
Mail Server: aspmx.l.google.com
Priority: 10
TTL: Auto
Proxy status: DNS only (gray cloud)
Save

Repeat for other Google MX servers:
- alt1.aspmx.l.google.com (Priority 20)
- alt2.aspmx.l.google.com (Priority 30)
- alt3.aspmx.l.google.com (Priority 40)
- alt4.aspmx.l.google.com (Priority 50)
```

### 3c. Add Email Security Records

1. **Add SPF Record**
```
Type: TXT
Name: growthhubai.dev (@)
Content: v=spf1 include:cloudflare.net ~all
TTL: Auto
Proxy status: DNS only
Save
```

2. **Add DMARC Record**
```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=quarantine; rua=mailto:admin@growthhubai.dev; ruf=mailto:admin@growthhubai.dev; fo=1
TTL: Auto
Proxy status: DNS only
Save
```

3. **Add DKIM Record** (Get from Cloudflare Email Routing)
```
Type: TXT
Name: default._domainkey
Content: v=DKIM1; k=rsa; p=[long string from Cloudflare]
TTL: Auto
Proxy status: DNS only
Save
```

---

## Part 4: Verify Email Setup

### Test SPF
```bash
# Check SPF record
dig growthhubai.dev TXT | grep spf

# Should return:
# growthhubai.dev. IN TXT "v=spf1 include:cloudflare.net ~all"
```

### Test DMARC
```bash
# Check DMARC record
dig _dmarc.growthhubai.dev TXT

# Should return your DMARC policy
```

### Test DKIM
```bash
# Check DKIM record
dig default._domainkey.growthhubai.dev TXT

# Should return DKIM public key
```

### Test MX
```bash
# Check MX records
dig growthhubai.dev MX

# Should return multiple MX records with priorities
```

### Online Test
Use: https://mxtoolbox.com/
1. Enter: growthhubai.dev
2. Check: All records show properly
3. Verify: No warnings/errors

---

## Part 5: Email Setup on Backend

Once DNS is configured, you need to send emails from your app.

### Option A: Cloudflare Email Routing (Forward only)

**No setup needed!** Emails sent to @growthhubai.dev automatically forward.

**Example:**
```typescript
// In your backend
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'noreply@growthhubai.dev', // Sends from here
    pass: 'app_specific_password'
  }
});

// Send email
await transporter.sendMail({
  from: 'noreply@growthhubai.dev',
  to: customer_email,
  subject: 'Welcome to GrowthHub!',
  html: '<p>Your trial starts now...</p>'
});
```

### Option B: SendGrid (Production Email)

```typescript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: customer_email,
  from: 'noreply@growthhubai.dev', // Verified in SendGrid
  subject: 'Welcome to GrowthHub!',
  html: '<p>Your trial starts now...</p>'
});
```

### Option C: Gmail SMTP (Simple, Free)

```typescript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply@growthhubai.dev',
    pass: 'your_app_specific_password' // Not your Gmail password!
  }
});

await transporter.sendMail({
  from: 'noreply@growthhubai.dev',
  to: customer_email,
  subject: 'Welcome!',
  html: '<p>Get started here...</p>'
});
```

---

## Part 6: Complete DNS Records Checklist

### Web Traffic (Required)
- [ ] A or CNAME for growthhubai.dev → Vercel
- [ ] CNAME for www → growthhubai.dev
- [ ] CNAME for api → Cloudflare Tunnel

### Email (Required)
- [ ] MX records (5 records from Google or via Cloudflare Email Routing)
- [ ] SPF record (TXT: v=spf1 include:...)
- [ ] DMARC record (TXT: v=DMARC1; p=quarantine...)
- [ ] DKIM record (TXT: v=DKIM1; k=rsa; p=...)

### Email (Optional, Advanced)
- [ ] MTA-STS record (TXT: v=STSv1...)
- [ ] .well-known/mta-sts.txt file (hosted on domain)

---

## Complete DNS Record List

Here's everything you should have in Cloudflare DNS:

```
┌─────────────────────────────────────────────────────────┐
│ TYPE  │ NAME           │ CONTENT                │ PROXY │
├─────────────────────────────────────────────────────────┤
│ CNAME │ @              │ cname.vercel.com       │ ✅    │
│ CNAME │ www            │ growthhubai.dev        │ ✅    │
│ CNAME │ api            │ [tunnel-url]           │ ✅    │
│ MX    │ @              │ aspmx.l.google.com(10) │ ❌    │
│ MX    │ @              │ alt1.aspmx...com(20)   │ ❌    │
│ MX    │ @              │ alt2.aspmx...com(30)   │ ❌    │
│ MX    │ @              │ alt3.aspmx...com(40)   │ ❌    │
│ MX    │ @              │ alt4.aspmx...com(50)   │ ❌    │
│ TXT   │ @              │ v=spf1 include:...     │ ❌    │
│ TXT   │ _dmarc         │ v=DMARC1; p=quarantine │ ❌    │
│ TXT   │ default._dk    │ v=DKIM1; k=rsa; p=...  │ ❌    │
└─────────────────────────────────────────────────────────┘

✅ = Proxied (orange cloud)
❌ = DNS only (gray cloud)
```

---

## Troubleshooting

### "MX record not found"
**Solution:** Add MX records (see Part 3b) or enable Cloudflare Email Routing

### Emails going to spam
**Solution:** Verify SPF/DKIM records are correct using mxtoolbox.com

### Emails not delivering
**Cause:** MX records missing or wrong
**Solution:** Check with `dig growthhubai.dev MX`

### DNS changes not taking effect
**Cause:** TTL cache (Time To Live)
**Solution:** Wait 5-30 minutes, or reduce TTL to 300 seconds

### Cloudflare says "Your traffic is almost ready to proxy"
**Cause:** Not all records are configured
**Solution:** Complete all records above (especially MX)

---

## Implementation Order

1. **First:** Add web records (A/CNAME for frontend/api)
2. **Then:** Add MX records (pick Cloudflare Email Routing or Google)
3. **Then:** Add SPF, DMARC, DKIM
4. **Finally:** Test with mxtoolbox.com
5. **Deploy:** Backend email sending code

---

## What Happens After Setup

✅ **Emails work:** @growthhubai.dev addresses receive mail
✅ **SPF passes:** Emails won't go to spam
✅ **DKIM signs:** Emails authenticated as from your domain
✅ **DMARC policy:** Protects against email spoofing
✅ **Web proxied:** Cloudflare caches + protects traffic
✅ **API accessible:** api.growthhubai.dev routes to T7910

---

## Next Steps

1. **Right now:** Go to Cloudflare DNS and add all records above
2. **Test:** Use mxtoolbox.com to verify
3. **Then:** Setup email in backend (Part 5)
4. **Then:** Deploy and test sending emails from app

**Estimated time:** 20-30 minutes

