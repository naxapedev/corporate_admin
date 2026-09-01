const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) throw new Error('VITE_API_URL is not configured')

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (response.status === 401 && !options._retried && path !== '/portal/auth/access-token') {
    const refreshed = await fetch(`${API_URL}/portal/auth/access-token`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    if (refreshed.ok) return apiRequest(path, { ...options, _retried: true })
  }
  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = Array.isArray(body.message) ? body.message.join(', ') : body.message
    throw new Error(message || 'Something went wrong')
  }
  return body
}
