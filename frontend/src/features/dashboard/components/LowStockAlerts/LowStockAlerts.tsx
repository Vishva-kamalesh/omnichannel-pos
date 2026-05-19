import { AlertTriangle } from 'lucide-react'
import type { LowStockItem } from '../../types/dashboard.types'
import { DashboardPanel } from '../DashboardPanel'
import styles from './LowStockAlerts.module.css'

type LowStockAlertsProps = {
  items: LowStockItem[]
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  const criticalCount = items.filter((i) => i.severity === 'critical').length

  return (
    <DashboardPanel
      title="Low stock alerts"
      meta={`${criticalCount} critical`}
      actions={
        <button type="button" className={styles.viewAll}>
          View all
        </button>
      }
    >
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <span
              className={[
                styles.indicator,
                item.severity === 'critical'
                  ? styles.critical
                  : styles.warning,
              ].join(' ')}
              aria-hidden="true"
            >
              <AlertTriangle size={14} strokeWidth={2} />
            </span>
            <div className={styles.content}>
              <p className={styles.name}>{item.name}</p>
              <p className={styles.meta}>
                <span>{item.sku}</span>
                <span>{item.store}</span>
              </p>
            </div>
            <div className={styles.stock}>
              <span className={styles.onHand}>{item.onHand}</span>
              <span className={styles.reorder}>/ {item.reorderAt}</span>
            </div>
          </li>
        ))}
      </ul>
    </DashboardPanel>
  )
}
