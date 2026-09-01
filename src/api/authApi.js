import { apiRequest } from './client.js'
import { endpoints } from './endpoints.js'

export const authApi = {
  login: (credentials) => apiRequest(endpoints.auth.login, {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getCurrentUser: () => apiRequest(endpoints.auth.profile),
  logout: () => apiRequest(endpoints.auth.logout, { method: 'POST' }),
}
