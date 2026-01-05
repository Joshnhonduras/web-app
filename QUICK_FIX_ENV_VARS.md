# Quick Fix: Environment Variable Mismatch

## Problem
Your code uses `process.env.REACT_APP_BACKEND_URL` but Vite expects `VITE_BACKEND_URL`

## Solution (2 minutes)

### Step 1: Update freeTierClient.ts

Replace this line:
```typescript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
```

With this:
```typescript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
```

### Step 2: Set Environment Variable in Cloudflare

In Cloudflare Pages setup, add:
```
Name: VITE_BACKEND_URL
Value: https://api.growthhubai.dev
```

### Step 3: Done! ✅

Now when Cloudflare deploys:
1. Vite will inject `VITE_BACKEND_URL` value during build
2. Your code will access it via `import.meta.env.VITE_BACKEND_URL`
3. It will be available to the browser

---

## What Changed?

| Before | After |
|--------|-------|
| `process.env.REACT_APP_BACKEND_URL` | `import.meta.env.VITE_BACKEND_URL` |
| Create React App style | Vite native style |
| Doesn't work with Vite by default | Works perfectly with Vite |

## Why?

- **Create React App**: Uses webpack, injects as `process.env.*`
- **Vite**: Uses esbuild/rollup, injects as `import.meta.env.*`
- Your project uses Vite, so use Vite's method ✅

---

## Files to Change

```
/mnt/hdd/growth_hub/web-app/src/lib/freeTierClient.ts
  Line ~25: Change process.env → import.meta.env
```

That's it!

