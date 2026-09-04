import { create } from 'zustand'
import { authApi } from '../api/authApi.js'

export const useAuthStore = create((set) => ({
  user: null,
  initialized: false,
  needsSetup: false,
  loading: false,
  error: '',
  initialize: async () => {
    let needsSetup = false
    try {
      const status = await authApi.getSetupStatus()
      needsSetup = Boolean(status.needsSetup)
      if (needsSetup) {
        set({ user: null, needsSetup: true })
        return
      }
      const user = await authApi.getCurrentUser()
      set({ user, needsSetup: false })
    } catch {
      set({ user: null, needsSetup })
    } finally {
      set({ initialized: true })
    }
  },
  signupAdmin: async (details) => {
    set({ loading: true, error: '' })
    try {
      await authApi.signup(details)
      const result = await authApi.login({
        email: details.email,
        password: details.password,
      })
      set({ user: result.portalUser, needsSetup: false, loading: false })
      return result.portalUser
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },
  login: async (credentials) => {
    set({ loading: true, error: '' })
    try {
      const result = await authApi.login(credentials)
      set({ user: result.portalUser, loading: false })
      return result.portalUser
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },
  logout: async () => {
    set({ user: null, error: '' })
    try {
      await authApi.logout()
    } catch {
      // Local logout still completes if the server is unavailable.
    }
  },
  clearError: () => set({ error: '' }),
}))
