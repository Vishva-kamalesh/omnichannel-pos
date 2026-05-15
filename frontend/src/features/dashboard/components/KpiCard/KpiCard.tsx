import type { KpiMetric } from '../../types/dashboard.types'
import styles from './KpiCard.module.css'

type KpiCardProps = {
  metric: KpiMetric
}

export function KpiCard({ metric }: KpiCardProps) {
  const Icon = metric.icon
  const deltaClass = `${styles.delta} ${styles[`delta_${metric.deltaType}`]}`

  return (
    <article className={styles.card}>
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
