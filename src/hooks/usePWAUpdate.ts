import { useEffect, useState } from 'react'
import { onPWAUpdateAvailable, skipWaitingAndReload } from '../lib/pwa'

export interface PWAUpdateEvent {
  registration: ServiceWorkerRegistration
}

export function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    const unsubscribe = onPWAUpdateAvailable((reg) => {
      setUpdateAvailable(true)
      setRegistration(reg)
    })

    return unsubscribe
  }, [])

  const handleUpdate = () => {
    skipWaitingAndReload()
  }

  const dismissUpdate = () => {
    setUpdateAvailable(false)
  }

  return {
    updateAvailable,
    registration,
    handleUpdate,
    dismissUpdate,
  }
}
