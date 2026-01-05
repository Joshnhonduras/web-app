# Cloudflare Pages Setup for GrowthHub

## ⚠️ IMPORTANT: You're Using Cloudflare Pages, Not Vercel

You selected **Cloudflare Pages** instead of Vercel. That's fine! It's actually better (all in one platform).

But this changes the deployment slightly.

---

## Your Current Setup

```
Project name: [TO FILL]
Production branch: main (or master)
Framework preset: [TO SELECT]
Build command: [TO FILL]
Build output directory: [TO FILL]
Root directory: web-app
Environment variables: [TO FILL]
```

---

## What You Need to Know

Your frontend will be deployed to: **web-app-8sb.pages.dev**

You'll later point **growthhubai.dev** to this Cloudflare Pages URL.

---

## FILL IN THE FIELDS

### 1. Project Name
```
growthhub-frontend
```
(Can be anything, but use this for clarity)

### 2. Production Branch
```
main
```
(Or `master` if that's your default branch)

### 3. Framework Preset

**If using React:**
```
React
```

**If using Next.js:**
```
Next.js
```

**If using Vite:**
```
None (Vite isn't listed)
```

---

## 4. Build Command & Output Directory

**This depends on your project setup.**

Let me check your `web-app/` structure:

```bash
# Check what's in web-app
ls -la /mnt/hdd/growth_hub/web-app/
ls -la /mnt/hdd/growth_hub/web-app/package.json 2>/dev/null || echo "package.json not found"
```

---

## COMMON SETUPS

### If you have React + Vite:

```
Root directory: web-app
Framework preset: None
Build command: npm install && npm run build
Build output directory: dist
```

### If you have Next.js:

```
Root directory: web-app
Framework preset: Next.js
Build command: npm install && npm run build
Build output directory: .next
```

### If you have Create React App:

```
Root directory: web-app
Framework preset: React
Build command: npm install && npm run build
Build output directory: build
```

---

## 5. Environment Variables (Advanced)

Add these:

```
NEXT_PUBLIC_API_URL=https://api.growthhubai.dev
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxxxx
```

(Replace xxxxx with your actual Stripe publishable key)

---

## 6. Root Directory

```
web-app
```

(Cloudflare will look in the web-app folder for package.json)

---

## MY RECOMMENDATION

Since we don't know your exact setup yet, **SAFEST OPTION:**

```
Project name: growthhub-frontend
Production branch: main
Framework preset: None
Build command: npm install && npm run build
Build output directory: dist
Root directory: web-app
Environment variables:
  NEXT_PUBLIC_API_URL=https://api.growthhubai.dev
  NEXT_PUBLIC_STRIPE_KEY=pk_live_[your_key]
```

---

## VERIFY YOUR PROJECT STRUCTURE

Before clicking "Save and deploy", confirm you have:

```bash
cd /mnt/hdd/growth_hub/web-app

# Check for package.json
ls -la package.json

# Check build scripts
cat package.json | grep -A 5 '"scripts"'

# Check for build output folder (dist, build, or .next)
ls -la | grep -E "dist|build|\.next"
```

---

## AFTER CLICKING "SAVE AND DEPLOY"

Cloudflare will:
1. Clone your repo
2. Run `npm install`
3. Run `npm run build`
4. Upload the output to Cloudflare Pages
5. Deploy to: `web-app-8sb.pages.dev`

---

## THEN: CONNECT YOUR DOMAIN

Once deployment is done:

1. Go to Cloudflare Pages settings
2. Custom domain: Add `growthhubai.dev`
3. Cloudflare auto-adds DNS records
4. You're live at growthhubai.dev! 🎉

---

## TROUBLESHOOTING

### Build fails with "Command not found"
- Check package.json has `"build"` script
- Example: `"build": "vite build"`

### Deployment succeeds but blank page
- Check Build output directory is correct
- Try `dist`, `build`, or `.next`

### Environment variables not loading
- Must start with `NEXT_PUBLIC_` for frontend to access
- Cloudflare Pages rebuilds when env vars change

---

## NEXT STEPS

1. Check your project structure (see verification command above)
2. Fill in the fields with values from COMMON SETUPS section
3. Click "Save and deploy"
4. Wait 2-5 minutes for build
5. See deployment at `web-app-8sb.pages.dev`
6. Add custom domain `growthhubai.dev`

---

**TELL ME:** What's in your `package.json` under `"scripts"`?
Send me those lines and I'll give you exact values to use.

