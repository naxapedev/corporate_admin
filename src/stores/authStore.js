import { create } from 'zustand'
import { authApi } from '../api/authApi.js'

export const useAuthStore = create((set) => ({
  user: null,
  initialized: false,
  loading: false,
  error: '',
  initialize: async () => {
    try {
      const user = await authApi.getCurrentUser()
      set({ user })
    } catch {
      set({ user: null })
    } finally {
      set({ initialized: true })
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
