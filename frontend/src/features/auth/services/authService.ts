import { api } from '@/shared/services'
import type { LoginCredentials, LoginResponse, AuthUser } from '../types/auth.types'

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials)
    return data.data
  },

  async getMe() {
    const { data } = await api.get<{
      success: boolean
      message: string
      data: { user: AuthUser }
    }>('/auth/me')
    return data.data.user
  },
}
