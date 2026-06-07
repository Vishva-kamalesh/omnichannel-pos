import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageShell } from '@/shared/ui/PageShell'
import { AsyncBoundary } from '@/shared/ui/AsyncBoundary'
import { useAsync } from '@/shared/hooks/useAsync'
import { analyticsApi } from '../services/analyticsApi'
import type { SalesPoint } from '../services/analyticsApi'
import styles from './AnalyticsPage.module.css'

function formatINR(value: number): string {
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function SalesCard() {
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const { data, loading, error, status, refetch } = useAsync<SalesPoint[]>(
    () => analyticsApi.getSales(type),
    [type],
  )

  const chartData = (data ?? []).map((d) => ({
    date: d.date,
    sales: d.sales,
    orders: d.orders,
  }))

  return (
    <section className={[styles.card, styles.cardFull].join(' ')}>
      <header className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Sales trend</h3>
          <p className={styles.cardSub}>Revenue grouped by {type} window</p>
        </div>
        <div className={styles.toggle} role="tablist">
          {(['daily', 'weekly', 'monthly'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              role="tab"
              className={[
                styles.toggleBtn,
                opt === type ? styles.toggleActive : '',
              ].join(' ')}
              onClick={() => setType(opt)}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <AsyncBoundary
        loading={loading}
        error={error}
        status={status}
        onRetry={refetch}
        isEmpty={!loading && !error && chartData.length === 0}
        emptyMessage="No sales recorded in this period."
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatINR(v)} />
            <Tooltip
              formatter={(value, name) =>
                name === 'sales'
                  ? [formatINR(Number(value)), 'Sales']
                  : [String(value), 'Orders']
              }
            />
            <Bar dataKey="sales" fill="#295e8c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </AsyncBoundary>
    </section>
  )
}

function CashierCard() {
  const { data, loading, error, status, refetch } = useAsync(
    () => analyticsApi.getCashierPerformance(),
    [],
  )
  const rows = data ?? []

  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Cashier performance</h3>
          <p className={styles.cardSub}>Revenue per cashier</p>
        </div>
      </header>
      <AsyncBoundary
        loading={loading}
        error={error}
        status={status}
        onRetry={refetch}
        isEmpty={!loading && !error && rows.length === 0}
        emptyMessage="No cashier activity yet."
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cashier</th>
              <th className={styles.numericCol}>Orders</th>
              <th className={styles.numericCol}>Revenue</th>
              <th className={styles.numericCol}>Avg</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.cashierId}>
                <td>{row.cashierName}</td>
                <td className={styles.numericCol}>{row.totalOrders}</td>
                <td className={styles.numericCol}>
                  {formatINR(row.totalRevenue)}
                </td>
                <td className={styles.numericCol}>
                  {formatINR(row.avgTransactionValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AsyncBoundary>
    </section>
  )
}

function StoreCard() {
  const { data, loading, error, status, refetch } = useAsync(
    () => analyticsApi.getStorePerformance(),
    [],
  )
  const rows = data ?? []

  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Store performance</h3>
          <p className={styles.cardSub}>Revenue per location</p>
        </div>
      </header>
      <AsyncBoundary
        loading={loading}
        error={error}
        status={status}
        onRetry={refetch}
        isEmpty={!loading && !error && rows.length === 0}
        emptyMessage="No store activity yet."
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Store</th>
              <th className={styles.numericCol}>Orders</th>
              <th className={styles.numericCol}>Revenue</th>
              <th className={styles.numericCol}>AOV</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.storeId}>
                <td>{row.storeName}</td>
                <td className={styles.numericCol}>{row.totalOrders}</td>
                <td className={styles.numericCol}>
                  {formatINR(row.totalRevenue)}
                </td>
                <td className={styles.numericCol}>
                  {formatINR(row.avgOrderValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AsyncBoundary>
    </section>
  )
}

export function AnalyticsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Analytics"
        description="Sales trends, cashier output, and store performance"
      />

      <div className={styles.grid}>
        <SalesCard />
        <CashierCard />
        <StoreCard />
      </div>
    </PageShell>
  )
}
