import type { StockStatus } from '../../types/inventory.types'
import styles from './StockStatusBadge.module.css'

const STATUS_LABELS: Record<StockStatus, string> = {
  'in-stock': 'In stock',
  'low-stock': 'Low stock',
  'out-of-stock': 'Out of stock',
}

const STATUS_CLASS: Record<StockStatus, string> = {
  'in-stock': styles.inStock,
  'low-stock': styles.lowStock,
  'out-of-stock': styles.outOfStock,
}

type StockStatusBadgeProps = {
  status: StockStatus
}

export function StockStatusBadge({ status }: StockStatusBadgeProps) {
  return (
    <span className={[styles.badge, STATUS_CLASS[status]].join(' ')}>
      <span className={styles.dot} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
