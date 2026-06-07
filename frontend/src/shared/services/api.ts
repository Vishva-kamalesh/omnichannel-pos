import axios from 'axios'
// Imported from the store file directly (not the feature barrel) to avoid a
// circular import: the barrel pulls in authService, which imports this module.
import { useAuthStore } from '@/features/auth/store/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const { isAuthenticated, expireSession } = useAuthStore.getState()
      // Only tear down an established session. A 401 from a failed login attempt
      // (no session yet) is handled by the login form itself — touching the
      // store there would be pointless, and triggering a redirect would fight
      // the login page. For a real session, clear it so the router shows the
      // login screen with a "session expired" message — no full reload, so we
      // can't get stuck bouncing with a token the server keeps rejecting.
      if (isAuthenticated) {
        expireSession()
      }
    }
    return Promise.reject(error)
  },
)
