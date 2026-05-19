import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartDataPoint } from '../../types/dashboard.types'
import { formatINR } from '../../data/dashboardMock'
import styles from './SalesChart.module.css'

type SalesChartProps = {
  data: ChartDataPoint[]
}

type TooltipProps = {
  active?: boolean
  payload?: Array<{ payload: ChartDataPoint }>
}

function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.[0]?.payload) return null
  const row = payload[0].payload

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{row.label}</p>
      <p className={styles.tooltipValue}>{formatINR(row.sales)}</p>
      {row.orders !== undefined && (
        <p className={styles.tooltipMeta}>{row.orders} orders</p>
      )}
    </div>
  )
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickFormatter={(v) => formatINR(Number(v), true)}
            width={52}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
          />
          <Bar
            dataKey="sales"
            fill="#6366f1"
            radius={[3, 3, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
