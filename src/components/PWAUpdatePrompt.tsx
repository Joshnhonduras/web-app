import { useEffect, useState } from 'react'
import { usePWAUpdate } from '../hooks/usePWAUpdate'

export function PWAUpdatePrompt() {
  const { updateAvailable, handleUpdate, dismissUpdate } = usePWAUpdate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (updateAvailable) {
      setIsVisible(true)
    }
  }, [updateAvailable])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-lg shadow-lg p-4 max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Update Available</h3>
          <p className="text-sm text-blue-100 mt-1">
            A new version of Growth Hub is available.
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            dismissUpdate()
          }}
          className="text-blue-200 hover:text-white text-lg"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleUpdate}
          className="flex-1 bg-white text-blue-600 font-semibold py-2 px-3 rounded text-sm hover:bg-blue-50 transition"
        >
          Update
        </button>
        <button
          onClick={() => {
            setIsVisible(false)
            dismissUpdate()
          }}
          className="flex-1 bg-blue-700 text-white font-semibold py-2 px-3 rounded text-sm hover:bg-blue-800 transition"
        >
          Later
        </button>
      </div>
    </div>
  )
}
