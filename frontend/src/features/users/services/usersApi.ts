import { api } from '@/shared/services'

type ApiEnvelope<T> = { success: boolean; message: string; data: T }

export type BackendUser = {
  _id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'cashier'
  storeId?: { _id: string; name: string; location?: string } | string | null
  isActive: boolean
  createdAt: string
}

export const usersApi = {
  async list(params: { search?: string; role?: string }) {
    const { data } = await api.get<
      ApiEnvelope<{
        users: BackendUser[]
        pagination: { total: number; page: number; pages: number }
      }>
    >('/users', { params: { limit: 100, ...params } })
    return data.data
  },
}
