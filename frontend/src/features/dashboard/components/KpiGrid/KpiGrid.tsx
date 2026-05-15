import type { KpiMetric } from '../../types/dashboard.types'
import { KpiCard } from '../KpiCard'
import styles from './KpiGrid.module.css'

type KpiGridProps = {
  metrics: KpiMetric[]
}

export function KpiGrid({ metrics }: KpiGridProps) {
  return (
    <div className={styles.grid} role="list" aria-label="Key performance indicators">
      {metrics.map((metric) => (
        <div key={metric.id} role="listitem">
          <KpiCard metric={metric} />
        </div>
      ))}
    </div>
  )
}
