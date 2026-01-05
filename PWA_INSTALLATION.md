# PWA Installation & Setup for GrowthHub

## What is a PWA?

A **Progressive Web App** means users can:
- ✅ Install GrowthHub on their phone (like an app)
- ✅ Use it offline
- ✅ Get push notifications
- ✅ Add to home screen

Cost: $0 (built into web standard)

---

## Step 1: Create Web App Manifest

Create file: `public/manifest.json`

```json
{
  "name": "GrowthHub - AI-Powered Personal Growth",
  "short_name": "GrowthHub",
  "description": "Your AI coach for relationships, career, and personal development",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-192x192-maskable.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icon-512x512-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "categories": ["productivity", "education"],
  "screenshots": [
    {
      "src": "/screenshot-narrow.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshot-wide.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "Start Chat",
      "short_name": "Chat",
      "description": "Start a new coaching session",
      "url": "/chat",
      "icons": [
        {
          "src": "/icon-96x96.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "View Courses",
      "short_name": "Courses",
      "description": "Browse all courses",
      "url": "/courses",
      "icons": [
        {
          "src": "/icon-96x96.png",
          "sizes": "96x96"
        }
      ]
    }
  ]
}
```

---

## Step 2: Create Service Worker

Create file: `public/service-worker.js`

```javascript
const CACHE_NAME = 'growthhub-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/app.js',
  '/offline.html',
  '/icon-192x192.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event (cache-first strategy)
self.addEventListener('fetch', event => {
  // Network for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Background sync (when user comes back online)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncOfflineMessages());
  }
});

async function syncOfflineMessages() {
  const db = await openDB();
  const pendingMessages = await db.getAll('pending-messages');
  
  for (const msg of pendingMessages) {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify(msg)
      });
      await db.delete('pending-messages', msg.id);
    } catch (error) {
      console.error('Failed to sync message:', error);
    }
  }
}
```

---

## Step 3: Register Service Worker in App

In your main app file (e.g., `src/main.tsx` or `src/index.tsx`):

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
        
        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Detect online/offline
window.addEventListener('online', () => {
  console.log('Back online');
  // Sync pending messages
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(reg => {
      reg.sync.register('sync-messages');
    });
  }
});

window.addEventListener('offline', () => {
  console.log('Offline');
  // Show offline banner
});
```

---

## Step 4: Update HTML Head

In `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- PWA Manifest -->
  <link rel="manifest" href="/manifest.json" />
  
  <!-- Theme Color -->
  <meta name="theme-color" content="#667eea" />
  
  <!-- iOS Specific -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="GrowthHub" />
  
  <!-- Icons -->
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
  <link rel="apple-touch-icon" href="/icon-192x192.png" />
  
  <!-- Splashscreen (iOS) -->
  <link rel="apple-touch-startup-image" href="/splash-192x192.png" />
  
  <title>GrowthHub - AI Personal Coach</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

## Step 5: Create App Icons

You need these images in `public/`:

```
Icon Sizes Needed:
├─ icon-192x192.png (192x192 pixels)
├─ icon-192x192-maskable.png (192x192, safe area)
├─ icon-512x512.png (512x512 pixels)
├─ icon-512x512-maskable.png (512x512, safe area)
├─ icon-96x96.png (96x96 pixels)
├─ screenshot-narrow.png (540x720, mobile)
├─ screenshot-wide.png (1280x720, tablet)
└─ splash-192x192.png (splashscreen)
```

**Generate icons:**
```bash
# Using ImageMagick
convert logo.png -resize 192x192 public/icon-192x192.png
convert logo.png -resize 512x512 public/icon-512x512.png
convert logo.png -resize 96x96 public/icon-96x96.png

# Or use online tool: https://www.favicon-generator.org/
```

---

## Step 6: Create Offline Page

Create file: `public/offline.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - GrowthHub</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #f8f9fa;
      padding: 20px;
    }
    
    .container {
      text-align: center;
      max-width: 400px;
    }
    
    .icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    
    h1 {
      font-size: 24px;
      color: #333;
      margin: 0 0 10px 0;
    }
    
    p {
      color: #666;
      line-height: 1.6;
    }
    
    .actions {
      margin-top: 30px;
    }
    
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      margin: 5px;
    }
    
    button:hover {
      background: #764ba2;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📵</div>
    <h1>You're Offline</h1>
    <p>It looks like you don't have an internet connection right now.</p>
    <p>You can still review your previous conversations and notes while offline.</p>
    
    <div class="actions">
      <button onclick="location.href='/'">Go Home</button>
      <button onclick="location.reload()">Try Again</button>
    </div>
  </div>
</body>
</html>
```

---

## Step 7: Configure Build System

If using Vite (recommended):

`vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'GrowthHub',
        short_name: 'GrowthHub',
        description: 'AI-Powered Personal Growth',
        theme_color: '#667eea',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.growthhub\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      }
    })
  ]
})
```

Install dependency:
```bash
npm install -D vite-plugin-pwa
```

---

## Step 8: Test PWA Locally

```bash
# Build production
npm run build

# Serve built app
npm install -g serve
serve -s dist

# Open in browser: http://localhost:3000

# In Chrome DevTools:
# 1. Go to Application tab
# 2. Check "Manifest" loads
# 3. Check "Service Worker" is registered
# 4. Look for "Install" prompt
```

---

## Installation Behavior by Browser

### Chrome/Edge (Desktop & Mobile)
- Shows "Install" button in address bar
- Users click → app installs
- Appears in Start Menu (Windows) or Applications (Mac/Linux)

### Safari (iOS)
- No native install prompt
- Users: Share → Add to Home Screen
- Works with manifest.json + icons

### Firefox
- Shows install prompt if manifest is valid
- Installs to home screen on mobile

---

## Push Notifications Setup

To enable push notifications:

```typescript
// Request permission
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('Welcome to GrowthHub!', {
        body: 'Your AI coach is ready',
        icon: '/icon-192x192.png',
        badge: '/icon-96x96.png',
        tag: 'welcome',
        requireInteraction: false
      });
    });
  }
});
```

---

## Offline Message Handling

Store messages when offline, sync when online:

```typescript
async function sendMessage(msg: string) {
  if (navigator.onLine) {
    // Online: send directly
    return await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: msg })
    });
  } else {
    // Offline: store in IndexedDB
    const db = await openDatabase();
    await db.add('pending-messages', {
      id: Date.now(),
      message: msg,
      timestamp: new Date()
    });
    
    // Request background sync when back online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(reg => {
        reg.sync.register('sync-messages');
      });
    }
    
    return { queued: true };
  }
}
```

---

## Checklist

- [ ] Create manifest.json
- [ ] Create service-worker.js
- [ ] Register service worker in app
- [ ] Update HTML head with PWA tags
- [ ] Create app icons (192x192, 512x512)
- [ ] Create offline.html
- [ ] Test locally with DevTools
- [ ] Test on mobile (iOS + Android)
- [ ] Test offline functionality
- [ ] Test install prompt
- [ ] Deploy to production
- [ ] Verify PWA works on https://growthhub.com

---

## Result

After setup, users can:
✅ Install GrowthHub like an app
✅ Use offline (cached pages/data)
✅ Get push notifications
✅ Access from home screen
✅ Full native app experience

Cost: $0 (built-in web standard)

