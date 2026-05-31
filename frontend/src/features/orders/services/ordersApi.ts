import { api } from '@/shared/services'

type ApiEnvelope<T> = { success: boolean; message: string; data: T }

export type BackendOrder = {
  _id: string
  orderNumber: string
  items: Array<{ name: string; sku: string; quantity: number }>
  totalAmount: number
  tax: number
  discount: number
  finalAmount: number
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit'
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
  status: 'completed' | 'cancelled' | 'returned'
  storeId?: { _id: string; name: string } | string
  cashierId?: { _id: string; name: string } | string
  createdAt: string
}

export const ordersApi = {
  async list(params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    paymentMethod?: string
  }) {
    const { data } = await api.get<
      ApiEnvelope<{
        orders: BackendOrder[]
        pagination: { total: number; page: number; pages: number }
      }>
    >('/orders', { params })
    return data.data
  },
}
