import { useMemo, useState } from 'react'
import type { ChartPeriod } from '../../types/dashboard.types'
import {
  MONTHLY_SALES,
  WEEKLY_SALES,
  formatINR,
  sumSales,
} from '../../data/dashboardMock'
import { DashboardPanel } from '../DashboardPanel'
import { SegmentedToggle } from '../SegmentedToggle'
import { SalesChart } from './SalesChart'
import styles from './SalesChartSection.module.css'

const PERIOD_OPTIONS = [
  { value: 'weekly' as const, label: 'Weekly' },
  { value: 'monthly' as const, label: 'Monthly' },
]

export function SalesChartSection() {
  const [period, setPeriod] = useState<ChartPeriod>('weekly')
  const chartData = period === 'weekly' ? WEEKLY_SALES : MONTHLY_SALES
  const total = useMemo(() => sumSales(chartData), [chartData])
  const orders = useMemo(
    () => chartData.reduce((acc, d) => acc + (d.orders ?? 0), 0),
    [chartData],
  )
  const periodLabel = period === 'weekly' ? 'Last 7 days' : 'Last 5 weeks'

  return (
    <DashboardPanel
      title="Sales"
      meta={periodLabel}
      actions={
        <SegmentedToggle
          options={PERIOD_OPTIONS}
          value={period}
          onChange={setPeriod}
          ariaLabel="Sales chart period"
        />
      }
    >
      <div className={styles.headline}>
        <div>
          <p className={styles.total}>{formatINR(total)}</p>
          <p className={styles.sub}>Gross merchandise value</p>
        </div>
        <div className={styles.sideStat}>
          <span className={styles.sideLabel}>Orders</span>
          <span className={styles.sideValue}>{orders.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <SalesChart data={chartData} />
    </DashboardPanel>
  )
}
