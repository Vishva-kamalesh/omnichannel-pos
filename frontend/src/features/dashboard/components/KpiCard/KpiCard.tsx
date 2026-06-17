import type { CSSProperties } from 'react'
import type { KpiMetric } from '../../types/dashboard.types'
import styles from './KpiCard.module.css'

/** Distinct top-accent per card, rotated by position: orange / blue / green / yellow.
    Pulls from the shared stat-accent tokens in variables.css. */
const ACCENTS = [
  'var(--color-stat-1)',
  'var(--color-stat-2)',
  'var(--color-stat-3)',
  'var(--color-stat-4)',
]

type KpiCardProps = {
  metric: KpiMetric
  index?: number
}

export function KpiCard({ metric, index = 0 }: KpiCardProps) {
  const Icon = metric.icon
  const deltaClass = `${styles.delta} ${styles[`delta_${metric.deltaType}`]}`
  const accentStyle = { '--kpi-accent': ACCENTS[index % ACCENTS.length] } as CSSProperties

  return (
    <article className={styles.card} style={accentStyle}>
      <div className={styles.top}>
        <p className={styles.label}>{metric.label}</p>
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon size={15} strokeWidth={1.75} />
        </span>
      </div>
      <p className={styles.value}>{metric.value}</p>
      <div className={styles.footer}>
        <span className={deltaClass}>{metric.delta}</span>
        {metric.hint ? <span className={styles.hint}>{metric.hint}</span> : null}
      </div>
    </article>
  )
}
