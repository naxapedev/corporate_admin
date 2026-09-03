import { useEffect } from 'react'

export default function ToastRegion({ error, success, onDismiss }) {
  const message = error || success
  useEffect(() => {
    if (!message) return undefined
    const timeout = window.setTimeout(onDismiss, 4500)
    return () => window.clearTimeout(timeout)
  }, [message, onDismiss])
  if (!message) return null
  return <div className="toast-region" aria-live={error ? 'assertive' : 'polite'} aria-atomic="true">
    <div className={`portal-toast ${error ? 'error' : 'success'}`} role={error ? 'alert' : 'status'}>
      <span className="toast-indicator" aria-hidden="true" />
      <div><strong>{error ? 'Action needed' : 'Changes saved'}</strong><p>{message}</p></div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification">×</button>
    </div>
  </div>
}
