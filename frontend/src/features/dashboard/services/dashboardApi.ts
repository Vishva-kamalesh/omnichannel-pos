import { IndianRupee, Package, ShoppingCart, Users } from 'lucide-react'
import { api } from '@/shared/services'
import type {
  KpiMetric,
  LowStockItem,
  Transaction,
  TopProduct,
} from '../types/dashboard.types'

type ApiEnvelope<T> = { success: boolean; message: string; data: T }

type DashboardSummary = {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  lowStockProducts: number
  totalStores: number
  totalActiveCashiers: number
}

type InventoryStats = {
  totalInventoryValue: number
  lowStockItems: Array<{
    productId: string
    name: string
    sku: string
    currentStock: number
    minLevel: number
    store: string
  }>
}

type TopProductRow = {
  _id: string
  name: string
  sku: string
  totalQuantity: number
  totalRevenue: number
}

type OrderRow = {
  _id: string
  orderNumber: string
  finalAmount: number
  status: string
  paymentMethod: string
  storeId?: { name?: string } | string
  cashierId?: { name?: string } | string
  customerId?: { name?: string } | string
  createdAt: string
}

function formatINR(value: number): string {
  return `₹${value.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`
}

function formatCompactINR(value: number): string {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} L`
  return formatINR(value)
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diffMs = Date.now() - then
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

const STATUS_MAP: Record<string, Transaction['status']> = {
  completed: 'completed',
  cancelled: 'cancelled',
  returned: 'refunded',
}

const PAYMENT_TO_CHANNEL: Record<string, Transaction['channel']> = {
  cash: 'in-store',
  card: 'in-store',
  upi: 'in-store',
  credit: 'online',
}

export type DashboardData = {
  kpis: KpiMetric[]
  recentTransactions: Transaction[]
  topProducts: TopProduct[]
  lowStock: LowStockItem[]
}

export const dashboardApi = {
  async loadDashboard(): Promise<DashboardData> {
    const [summaryRes, invStatsRes, topProductsRes, ordersRes] =
      await Promise.all([
        api.get<ApiEnvelope<DashboardSummary>>('/analytics/dashboard'),
        api.get<ApiEnvelope<InventoryStats>>('/analytics/inventory-stats'),
        api.get<ApiEnvelope<TopProductRow[]>>('/analytics/top-products', {
          params: { limit: 5 },
        }),
        api.get<ApiEnvelope<{ orders: OrderRow[] }>>('/orders', {
          params: { limit: 8 },
        }),
      ])

    const summary = summaryRes.data.data
    const invStats = invStatsRes.data.data
    const topProductsRaw = topProductsRes.data.data
    const ordersRaw = ordersRes.data.data.orders

    const kpis: KpiMetric[] = [
      {
        id: 'revenue',
        label: 'Total revenue',
        value: formatCompactINR(summary.totalRevenue),
        delta: `${summary.totalOrders} orders`,
        deltaType: 'positive',
        hint: 'lifetime',
        icon: IndianRupee,
      },
      {
        id: 'orders',
        label: 'Completed orders',
        value: summary.totalOrders.toLocaleString('en-IN'),
        delta: `${summary.totalStores} stores`,
        deltaType: 'neutral',
        hint: 'across catalog',
        icon: ShoppingCart,
      },
      {
        id: 'staff',
        label: 'Active cashiers',
        value: summary.totalActiveCashiers.toString(),
        delta: 'live',
        deltaType: 'positive',
        hint: 'on shift',
        icon: Users,
      },
      {
        id: 'inventory',
        label: 'Inventory value',
        value: formatCompactINR(invStats.totalInventoryValue),
        delta:
          summary.lowStockProducts > 0
            ? `${summary.lowStockProducts} low`
            : 'healthy',
        deltaType: summary.lowStockProducts > 0 ? 'negative' : 'positive',
        hint: 'at sell price',
        icon: Package,
      },
    ]

    const recentTransactions: Transaction[] = ordersRaw.map((order) => {
      const storeName =
        typeof order.storeId === 'object' && order.storeId?.name
          ? order.storeId.name
          : 'Store'
      const customerName =
        typeof order.customerId === 'object' && order.customerId?.name
          ? order.customerId.name
          : typeof order.cashierId === 'object' && order.cashierId?.name
            ? `Cashier: ${order.cashierId.name}`
            : 'Walk-in'

      return {
        id: order.orderNumber,
        customer: customerName,
        store: storeName,
        channel: PAYMENT_TO_CHANNEL[order.paymentMethod] ?? 'in-store',
        amount: formatINR(order.finalAmount),
        amountRaw: order.finalAmount,
        status: STATUS_MAP[order.status] ?? 'processing',
        placedAt: formatRelative(order.createdAt),
      }
    })

    const topProducts: TopProduct[] = topProductsRaw.map((p) => ({
      id: p._id,
      name: p.name,
      sku: p.sku,
      unitsSold: p.totalQuantity,
      revenue: formatINR(p.totalRevenue),
      trend: 0,
    }))

    const lowStock: LowStockItem[] = invStats.lowStockItems.slice(0, 6).map(
      (item) => ({
        id: item.productId,
        sku: item.sku,
        name: item.name,
        store: item.store,
        onHand: item.currentStock,
        reorderAt: item.minLevel,
        severity: item.currentStock === 0 ? 'critical' : 'warning',
      }),
    )

    return { kpis, recentTransactions, topProducts, lowStock }
  },
}
