# PWA Implementation Guide

This project now includes a clean Progressive Web App (PWA) scaffold that enhances the user experience with offline functionality, installability, and caching strategies.

## What's Included

### 1. **Service Worker** (`public/sw.js`)
- Workbox-based service worker with intelligent caching strategies
- Precaches static assets (JS, CSS, HTML)
- Implements Cache-First strategy for images and fonts
- Uses Stale-While-Revalidate for static resources
- Network-First strategy for API calls
- Offline fallback for navigation requests

### 2. **PWA Configuration** (`vite.config.ts`)
- Integrated `vite-plugin-pwa` for automatic manifest generation
- Workbox integration for caching and precaching
- Auto-update strategy with user notifications
- Complete app manifest with icons and shortcuts

### 3. **PWA Utilities** (`src/lib/pwa.ts`)
- `initPWA()` - Initialize service worker registration
- `checkForUpdates()` - Manually trigger update check
- `skipWaitingAndReload()` - Force activate new service worker
- `onPWAUpdateAvailable()` - Listen for update events
- `unregisterPWA()` - Cleanup service worker

### 4. **React Hook** (`src/hooks/usePWAUpdate.ts`)
- `usePWAUpdate()` - Hook to handle PWA updates in components
- Provides state for update availability and registration
- Includes handlers for user interactions

### 5. **Update Prompt Component** (`src/components/PWAUpdatePrompt.tsx`)
- Beautiful toast notification for available updates
- "Update" and "Later" options
- Auto-dismissible with close button
- Accessible with proper ARIA labels

## Features

### Caching Strategies

| Asset Type | Strategy | Duration |
|-----------|----------|----------|
| HTML, CSS, JS | Stale-While-Revalidate | - |
| Images | Cache-First | 30 days |
| Fonts | Cache-First | ∞ |
| API calls | Network-First | 5 minutes |

### Offline Support
- Cached content loads when offline
- Navigation requests fallback to `index.html` for SPA
- API calls cached for limited time

### Installation
Users can:
- Install the app via browser install prompts
- Add to home screen (mobile)
- Open as standalone app
- Access offline functionality

## Usage

### For Developers

**Check for updates programmatically:**
```typescript
import { checkForUpdates } from './lib/pwa'

// Check for new service worker
await checkForUpdates()
```

**Listen for update events:**
```typescript
import { onPWAUpdateAvailable } from './lib/pwa'

const unsubscribe = onPWAUpdateAvailable((registration) => {
  console.log('Update available!', registration)
})

// Clean up when done
unsubscribe()
```

**Force update:**
```typescript
import { skipWaitingAndReload } from './lib/pwa'

skipWaitingAndReload()
```

**Unregister PWA (for testing):**
```typescript
import { unregisterPWA } from './lib/pwa'

await unregisterPWA()
```

### For Users

1. **Install the app:**
   - Look for install prompt in browser or address bar
   - Click "Install" or "Add to Home Screen"
   - Opens as standalone app

2. **Update notification:**
   - Blue notification appears when update is available
   - Click "Update" to reload with new version
   - Click "Later" to dismiss

3. **Offline access:**
   - Previously visited pages load from cache
   - API data cached for faster loading
   - Works offline for cached content

## Build & Deployment

The PWA is automatically built during production:

```bash
npm run build
```

This will:
1. Generate optimized bundles
2. Create precache manifest
3. Generate service worker
4. Include all PWA assets

## Configuration

### Customize Caching

Edit `vite.config.ts` in the `VitePWA` plugin:

**Add more file types to precache:**
```typescript
workbox: {
  globPatterns: [
    '**/*.{js,css,html,svg,png,ico,json,woff2}',
    '**/*.custom_ext', // Add your extensions
  ],
}
```

**Adjust cache durations:**
```typescript
{
  urlPattern: /^https:\/\/.*\.(png|jpg)$/,
  handler: 'CacheFirst',
  options: {
    cacheName: 'images-cache',
    expiration: {
      maxEntries: 100, // Increase limit
      maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
    },
  },
}
```

### Customize Manifest

Edit `vite.config.ts` `manifest` property:

```typescript
manifest: {
  name: 'Your App Name',
  short_name: 'App',
  start_url: '/',
  display: 'standalone',
  theme_color: '#075e54',
  background_color: '#ffffff',
  // ... more options
}
```

## Testing

### In Development
- Service Worker enabled: `npm run dev`
- Check DevTools → Application → Service Workers
- Open DevTools → Network and enable offline mode
- Install prompt may appear in localhost:5173

### Before Production
1. Test offline functionality
2. Verify caching behavior
3. Test update flow
4. Check on multiple devices
5. Use Lighthouse PWA audit

**Run Lighthouse audit:**
- Open DevTools (F12)
- Go to Lighthouse tab
- Run "Progressive Web App" audit

### Clearing Cache (Testing)
**Browser DevTools:**
1. Application → Service Workers → Unregister
2. Application → Cache Storage → Clear all
3. Hard refresh (Ctrl+Shift+R)

**Programmatically:**
```typescript
import { unregisterPWA } from './lib/pwa'
await unregisterPWA()
```

## Troubleshooting

### Service Worker not updating
- Clear browser cache
- Unregister service worker
- Hard refresh (Ctrl+Shift+R)
- Check DevTools → Application

### Update notification not appearing
- Verify `PWAUpdatePrompt` component is in App
- Check console for errors
- Ensure production build (PWA disabled in dev by default)

### App not installable
- Manifest missing required fields
- Icons not found or wrong format
- HTTPS required (except localhost)
- Check Lighthouse audit for requirements

### Offline page blank
- Ensure index.html is cached
- Check service worker console logs
- Verify navigateFallback setting in vite.config.ts

## Performance Impact

- **Bundle size**: +~50KB (Workbox library)
- **Cache storage**: Depends on configured limits
- **First load**: Same (service worker loads in background)
- **Subsequent loads**: Faster (from cache)
- **Updates**: Automatic with user notification

## No Breaking Changes

✅ All existing routing preserved  
✅ No changes to business logic  
✅ No changes to UX or components  
✅ Backward compatible with non-PWA browsers  
✅ Optional - users can still use as regular web app  

## Resources

- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [manifest.json Spec](https://www.w3.org/TR/appmanifest/)
