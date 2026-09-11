const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) throw new Error('VITE_API_URL is not configured')

let refreshRequest = null

const refreshAccessToken = async () => {
  if (!refreshRequest) {
    refreshRequest = fetch(`${API_URL}/portal/auth/access-token`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }).finally(() => {
      refreshRequest = null
    })
  }

  return refreshRequest
}

const shouldRefresh = (response, body, path, retried) => {
  if (retried || path === '/portal/auth/access-token' || path === '/portal/auth/login') return false
  return response.status === 401 || body?.statusCode === 401
}

const requestOptions = (options) => {
  const { _retried, ...fetchOptions } = options
  return {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  }
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, requestOptions(options))
  const body = await response.json().catch(() => ({}))

  if (shouldRefresh(response, body, path, options._retried)) {
    const refreshed = await refreshAccessToken()
    if (refreshed.ok) return apiRequest(path, { ...options, _retried: true })
  }

  if (!response.ok) {
    const message = Array.isArray(body.message) ? body.message.join(', ') : body.message
    throw new Error(message || 'Something went wrong')
  }
  return body
}
