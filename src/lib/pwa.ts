import { Workbox } from 'workbox-window'

let wb: Workbox | null = null
let swRegistration: ServiceWorkerRegistration | null = null

/**
 * Initialize PWA service worker registration
 */
export function initPWA(): void {
  // Skip if service workers are not supported
  if (!('serviceWorker' in navigator)) {
    console.info('Service Workers not supported')
    return
  }

  // Create Workbox instance
  wb = new Workbox('/sw.js')

  // Handle waiting state - prompt user to update
  wb.addEventListener('waiting', () => {
    promptUserToRefresh()
  })

  // Handle controlling state
  wb.addEventListener('controlling', () => {
    window.location.reload()
  })

  // Handle external waiting service worker
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })

  // Register the service worker
  wb.register()
    .then((registration) => {
      swRegistration = registration
      console.info('PWA registered successfully', registration)
    })
    .catch((error) => {
      console.error('PWA registration failed:', error)
    })
}

/**
 * Prompt user to refresh for new version
 */
function promptUserToRefresh(): void {
  if (swRegistration) {
    // Emit custom event that components can listen to
    const event = new CustomEvent('pwa-update-available', {
      detail: { registration: swRegistration },
    })
    window.dispatchEvent(event)

    // Optional: Show a simple alert if no UI component handles it
    setTimeout(() => {
      const userAccepts = confirm(
        'A new version of Growth Hub is available. Reload to update?'
      )
      if (userAccepts) {
        wb?.addEventListener('controlling', () => {
          window.location.reload()
        })
        wb?.messageSkipWaiting()
      }
    }, 1000)
  }
}

/**
 * Check for updates manually
 */
export async function checkForUpdates(): Promise<void> {
  if (wb) {
    await wb.update()
  }
}

/**
 * Skip waiting and activate new service worker
 */
export function skipWaitingAndReload(): void {
  if (swRegistration?.waiting) {
    wb?.addEventListener('controlling', () => {
      window.location.reload()
    })
    wb?.messageSkipWaiting()
  }
}

/**
 * Unregister PWA service worker
 */
export async function unregisterPWA(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
      }
      console.info('PWA unregistered')
    } catch (error) {
      console.error('Failed to unregister PWA:', error)
    }
  }
}

/**
 * Listen for PWA update events
 */
export function onPWAUpdateAvailable(
  callback: (registration: ServiceWorkerRegistration) => void
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent
    callback(customEvent.detail.registration)
  }
  window.addEventListener('pwa-update-available', handler)
  return () => window.removeEventListener('pwa-update-available', handler)
}
