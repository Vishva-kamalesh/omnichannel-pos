import { IndianRupee, Package, ShoppingCart, Users } from 'lucide-react'
import type {
  ChartDataPoint,
  KpiMetric,
  LowStockItem,
  RevenueComparison,
  RevenueOverviewItem,
  Transaction,
  TopProduct,
} from '../types/dashboard.types'

export const KPI_METRICS: KpiMetric[] = [
  {
    id: 'revenue',
    label: 'Total revenue',
    value: '₹24,86,420',
    delta: '+12.4%',
    deltaType: 'positive',
    hint: 'vs prior 30d',
    icon: IndianRupee,
  },
  {
    id: 'orders',
    label: 'Orders',
    value: '3,842',
    delta: '+186',
    deltaType: 'positive',
    hint: 'this month',
    icon: ShoppingCart,
  },
  {
    id: 'customers',
    label: 'Customers',
    value: '2,614',
    delta: '+9.2%',
    deltaType: 'positive',
    hint: 'unique buyers',
    icon: Users,
  },
  {
    id: 'inventory',
    label: 'Inventory value',
    value: '₹1.12 Cr',
    delta: '-2.3%',
    deltaType: 'negative',
    hint: 'at landed cost',
    icon: Package,
  },
]

export const WEEKLY_SALES: ChartDataPoint[] = [
  { label: 'Mon', sales: 118400, orders: 142 },
  { label: 'Tue', sales: 142800, orders: 168 },
  { label: 'Wed', sales: 136200, orders: 155 },
  { label: 'Thu', sales: 158900, orders: 181 },
  { label: 'Fri', sales: 189400, orders: 224 },
  { label: 'Sat', sales: 224600, orders: 268 },
  { label: 'Sun', sales: 171300, orders: 198 },
]

export const MONTHLY_SALES: ChartDataPoint[] = [
  { label: 'W1', sales: 612000, orders: 720 },
  { label: 'W2', sales: 684200, orders: 798 },
  { label: 'W3', sales: 721800, orders: 841 },
  { label: 'W4', sales: 698400, orders: 812 },
  { label: 'W5', sales: 770020, orders: 671 },
]

export const REVENUE_BY_CHANNEL: RevenueOverviewItem[] = [
  { id: 'in-store', label: 'In-store', amount: 1442144, share: 58 },
  { id: 'online', label: 'Online', amount: 796608, share: 32 },
  { id: 'warehouse', label: 'Warehouse / B2B', amount: 248668, share: 10 },
]

export const REVENUE_COMPARISON: RevenueComparison[] = [
  { label: 'Gross sales', current: 2486420, previous: 2213800 },
  { label: 'Net sales', current: 2314360, previous: 2058920 },
  { label: 'Refunds', current: 48200, previous: 51800 },
  { label: 'Avg. order value', current: 647, previous: 612 },
]

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-28491',
    customer: 'Priya Sharma',
    store: 'Downtown Flagship',
    channel: 'in-store',
    amount: '₹4,280',
    amountRaw: 4280,
    status: 'completed',
    placedAt: '12 min ago',
  },
  {
    id: 'TXN-28490',
    customer: 'Rahul Mehta',
    store: 'Online FC',
    channel: 'online',
    amount: '₹1,150',
    amountRaw: 1150,
    status: 'processing',
    placedAt: '28 min ago',
  },
  {
    id: 'TXN-28489',
    customer: 'Walk-in',
    store: 'Mall Outlet',
    channel: 'in-store',
    amount: '₹890',
    amountRaw: 890,
    status: 'completed',
    placedAt: '41 min ago',
  },
  {
    id: 'TXN-28488',
    customer: 'Anita Desai',
    store: 'Warehouse — West',
    channel: 'warehouse',
    amount: '₹18,400',
    amountRaw: 18400,
    status: 'picking',
    placedAt: '1 hr ago',
  },
  {
    id: 'TXN-28487',
    customer: 'Vikram Singh',
    store: 'Online FC',
    channel: 'online',
    amount: '₹2,340',
    amountRaw: 2340,
    status: 'shipped',
    placedAt: '1 hr ago',
  },
  {
    id: 'TXN-28486',
    customer: 'Neha Kapoor',
    store: 'Downtown Flagship',
    channel: 'in-store',
    amount: '₹6,720',
    amountRaw: 6720,
    status: 'completed',
    placedAt: '2 hr ago',
  },
  {
    id: 'TXN-28485',
    customer: 'Metro Retail Pvt Ltd',
    store: 'Warehouse — West',
    channel: 'warehouse',
    amount: '₹42,100',
    amountRaw: 42100,
    status: 'processing',
    placedAt: '2 hr ago',
  },
  {
    id: 'TXN-28484',
    customer: 'Suresh Iyer',
    store: 'Mall Outlet',
    channel: 'in-store',
    amount: '₹1,980',
    amountRaw: 1980,
    status: 'completed',
    placedAt: '3 hr ago',
  },
]

export const LOW_STOCK_ITEMS: LowStockItem[] = [
  {
    id: '1',
    sku: 'SKU-8842',
    name: 'Wireless Earbuds Pro — Black',
    store: 'Downtown Flagship',
    onHand: 3,
    reorderAt: 15,
    severity: 'critical',
  },
  {
    id: '2',
    sku: 'SKU-3310',
    name: 'Organic Cotton Tee — M',
    store: 'Mall Outlet',
    onHand: 8,
    reorderAt: 25,
    severity: 'warning',
  },
  {
    id: '3',
    sku: 'SKU-1198',
    name: 'Stainless Water Bottle 750ml',
    store: 'Online FC',
    onHand: 5,
    reorderAt: 20,
    severity: 'critical',
  },
  {
    id: '4',
    sku: 'SKU-5521',
    name: 'Leather Belt — Brown 34',
    store: 'Downtown Flagship',
    onHand: 2,
    reorderAt: 10,
    severity: 'critical',
  },
  {
    id: '5',
    sku: 'SKU-7704',
    name: 'Running Socks — 3 Pack',
    store: 'Mall Outlet',
    onHand: 11,
    reorderAt: 30,
    severity: 'warning',
  },
]

export const TOP_PRODUCTS: TopProduct[] = [
  {
    id: '1',
    name: 'Wireless Earbuds Pro',
    sku: 'SKU-8842',
    unitsSold: 428,
    revenue: '₹8,56,000',
    trend: 14,
  },
  {
    id: '2',
    name: 'Everyday Backpack 28L',
    sku: 'SKU-2201',
    unitsSold: 312,
    revenue: '₹6,24,000',
    trend: 8,
  },
  {
    id: '3',
    name: 'Organic Cotton Tee',
    sku: 'SKU-3310',
    unitsSold: 891,
    revenue: '₹4,45,500',
    trend: -3,
  },
  {
    id: '4',
    name: 'Stainless Water Bottle',
    sku: 'SKU-1198',
    unitsSold: 267,
    revenue: '₹2,67,000',
    trend: 5,
  },
  {
    id: '5',
    name: 'Smart Watch Band',
    sku: 'SKU-9903',
    unitsSold: 198,
    revenue: '₹1,98,000',
    trend: 11,
  },
]

export function formatINR(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

export function sumSales(data: ChartDataPoint[]): number {
  return data.reduce((acc, point) => acc + point.sales, 0)
}

/** @deprecated */
export const WEEKLY_REVENUE = WEEKLY_SALES.map((d) => ({
  label: d.label,
  value: d.sales,
}))
/** @deprecated */
export const MONTHLY_REVENUE = MONTHLY_SALES.map((d) => ({
  label: d.label,
  value: d.sales,
}))
/** @deprecated */
export const RECENT_ORDERS = RECENT_TRANSACTIONS
