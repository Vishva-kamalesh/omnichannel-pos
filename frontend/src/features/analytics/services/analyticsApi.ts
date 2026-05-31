import { api } from '@/shared/services'

type ApiEnvelope<T> = { success: boolean; message: string; data: T }

export type SalesPoint = { date: string; sales: number; orders: number }
export type CashierRow = {
  cashierId: string
  cashierName: string
  totalRevenue: number
  totalOrders: number
  avgTransactionValue: number
}
export type StoreRow = {
  storeId: string
  storeName: string
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
}

export const analyticsApi = {
  async getSales(type: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    const { data } = await api.get<ApiEnvelope<SalesPoint[]>>(
      `/analytics/sales/${type}`,
    )
    return data.data
  },

  async getCashierPerformance() {
    const { data } = await api.get<ApiEnvelope<CashierRow[]>>(
      '/analytics/cashier-performance',
    )
    return data.data
  },

  async getStorePerformance() {
    const { data } = await api.get<ApiEnvelope<StoreRow[]>>(
      '/analytics/store-performance',
    )
    return data.data
  },
}
