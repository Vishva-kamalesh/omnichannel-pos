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
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          {/* Dark-theme palette: faint white grid, legible white-ish axis
             labels, and the brand-orange bar (the old steel #295e8c was
             nearly invisible on the #15151f surface). */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'rgba(255, 255, 255, 0.6)' }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'rgba(255, 255, 255, 0.5)' }}
            tickFormatter={(v) => formatINR(Number(v), true)}
            width={52}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: 'rgba(244, 98, 42, 0.12)' }}
          />
          <Bar
            dataKey="sales"
            fill="#f4622a"
            radius={[3, 3, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
