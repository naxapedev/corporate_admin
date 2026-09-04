import { apiRequest } from './client.js'
import { endpoints } from './endpoints.js'

export const authApi = {
  signup: (details) => apiRequest(endpoints.auth.signup, {
    method: 'POST',
    body: JSON.stringify(details),
  }),
  getSetupStatus: () => apiRequest(endpoints.auth.setupStatus),
  login: (credentials) => apiRequest(endpoints.auth.login, {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getCurrentUser: () => apiRequest(endpoints.auth.profile),
  logout: () => apiRequest(endpoints.auth.logout, { method: 'POST' }),
}
