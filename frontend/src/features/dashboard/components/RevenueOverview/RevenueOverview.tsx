import type {
  RevenueComparison,
  RevenueOverviewItem,
} from '../../types/dashboard.types'
import { formatINR } from '../../data/dashboardMock'
import { DashboardPanel } from '../DashboardPanel'
import styles from './RevenueOverview.module.css'

type RevenueOverviewProps = {
  channels: RevenueOverviewItem[]
  comparison: RevenueComparison[]
}

function formatMetricValue(_label: string, value: number): string {
  return formatINR(value)
}

export function RevenueOverview({ channels, comparison }: RevenueOverviewProps) {
  return (
    <DashboardPanel title="Revenue overview" meta="Last 30 days">
      <ul className={styles.channels}>
        {channels.map((channel) => (
          <li key={channel.id} className={styles.channelRow}>
            <div className={styles.channelMeta}>
              <span className={styles.channelLabel}>{channel.label}</span>
              <span className={styles.channelAmount}>
                {formatINR(channel.amount)}
              </span>
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${channel.share}%` }}
              />
            </div>
            <span className={styles.share}>{channel.share}%</span>
          </li>
        ))}
      </ul>

      <div className={styles.divider} />

      <table className={styles.comparison}>
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">Current</th>
            <th scope="col">Prior</th>
            <th scope="col">Δ</th>
          </tr>
        </thead>
        <tbody>
          {comparison.map((row) => {
            const change =
              row.previous === 0
                ? 0
                : ((row.current - row.previous) / row.previous) * 100
            const invertChange = row.label === 'Refunds'

            return (
              <tr key={row.label}>
                <td className={styles.metricName}>{row.label}</td>
                <td>{formatMetricValue(row.label, row.current)}</td>
                <td className={styles.muted}>
                  {formatMetricValue(row.label, row.previous)}
                </td>
                <td
                  className={[
                    styles.change,
                    (invertChange ? change <= 0 : change >= 0)
                      ? styles.changeUp
                      : styles.changeDown,
                  ].join(' ')}
                >
                  {change >= 0 ? '+' : ''}
                  {change.toFixed(1)}%
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </DashboardPanel>
  )
}
