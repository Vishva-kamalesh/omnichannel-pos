import type { LucideIcon } from 'lucide-react'

export type KpiMetric = {
  id: string
  label: string
  value: string
  delta: string
  deltaType: 'positive' | 'negative' | 'neutral'
  hint?: string
  icon: LucideIcon
}

export type ChartPeriod = 'weekly' | 'monthly'

export type ChartDataPoint = {
  label: string
  sales: number
  orders?: number
}

export type RevenueOverviewItem = {
  id: string
  label: string
  amount: number
  share: number
}

export type RevenueComparison = {
  label: string
  current: number
  previous: number
}

export type TransactionStatus =
  | 'completed'
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'picking'
  | 'cancelled'
  | 'refunded'

export type Transaction = {
  id: string
  customer: string
  store: string
  channel: 'in-store' | 'online' | 'warehouse'
  amount: string
  amountRaw: number
  status: TransactionStatus
  placedAt: string
}

export type LowStockItem = {
  id: string
  sku: string
  name: string
  store: string
  onHand: number
  reorderAt: number
  severity: 'critical' | 'warning'
}

export type TopProduct = {
  id: string
  name: string
  sku: string
  unitsSold: number
  revenue: string
  trend: number
}

/** @deprecated Use Transaction */
export type RecentOrder = Transaction

/** @deprecated Use TransactionStatus */
export type OrderStatus = TransactionStatus
