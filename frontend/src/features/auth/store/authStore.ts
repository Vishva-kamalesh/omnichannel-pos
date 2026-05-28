import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '../types/auth.types'

type AuthState = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  setSession: (user: AuthUser, token: string) => void
  logout: () => void
}

const TOKEN_STORAGE_KEY = 'access_token'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setSession: (user, token) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, token)
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-session',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
