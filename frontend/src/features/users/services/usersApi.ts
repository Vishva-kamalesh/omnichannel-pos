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

export type CreateUserPayload = {
  name: string
  email: string
  password: string
  role: 'admin' | 'manager' | 'cashier'
  storeId?: string
}

export type StoreOption = { id: string; name: string; location: string }

type BackendStore = { _id: string; name: string; location?: string }

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

  /** Create a staff account (admin only). */
  async create(payload: CreateUserPayload) {
    const { data } = await api.post<ApiEnvelope<BackendUser>>('/users', payload)
    return data.data
  },

  /** Deactivate (revoke access for) a user — admin only. Soft delete. */
  async deactivate(id: string) {
    const { data } = await api.delete<ApiEnvelope<BackendUser>>(`/users/${id}`)
    return data.data
  },

  /** Active stores, for the "assign store" picker in the create form. */
  async listStores(): Promise<StoreOption[]> {
    const { data } = await api.get<ApiEnvelope<{ stores: BackendStore[] }>>(
      '/stores',
      { params: { limit: 50, isActive: 'true' } },
    )
    return data.data.stores.map((s) => ({
      id: s._id,
      name: s.name,
      location: s.location ?? '',
    }))
  },
}
