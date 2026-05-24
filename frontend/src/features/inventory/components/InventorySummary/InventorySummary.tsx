import type { InventorySummaryMetric } from '../../types/inventory.types'
import styles from './InventorySummary.module.css'

type InventorySummaryProps = {
  metrics: InventorySummaryMetric[]
}

export function InventorySummary({ metrics }: InventorySummaryProps) {
  return (
    <div className={styles.grid} role="list" aria-label="Inventory summary">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const iconClass = [
          styles.iconWrap,
          metric.tone === 'warning' ? styles.iconWarning : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <article key={metric.id} className={styles.card} role="listitem">
            <span className={iconClass} aria-hidden="true">
              <Icon size={16} strokeWidth={1.9} />
            </span>
            <div className={styles.body}>
              <p className={styles.label}>{metric.label}</p>
              <p className={styles.value}>{metric.value}</p>
              <p className={styles.hint}>{metric.hint}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
