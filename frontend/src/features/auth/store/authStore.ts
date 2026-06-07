import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '../types/auth.types'

type AuthState = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  /** Set when the server rejects our token (401) so login can explain why. Transient — never persisted. */
  sessionExpired: boolean
  setSession: (user: AuthUser, token: string) => void
  logout: () => void
  /** Tear down a session the server no longer accepts, and flag it for the login screen. */
  expireSession: () => void
  clearSessionExpired: () => void
}

const TOKEN_STORAGE_KEY = 'access_token'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      sessionExpired: false,

      setSession: (user, token) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, token)
        set({ user, token, isAuthenticated: true, sessionExpired: false })
      },

      logout: () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          sessionExpired: false,
        })
      },

      expireSession: () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          sessionExpired: true,
        })
      },

      clearSessionExpired: () => set({ sessionExpired: false }),
    }),
    {
      name: 'auth-session',
      // Note: sessionExpired is intentionally NOT persisted — it's a one-shot
      // signal for the current navigation, not durable state.
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
