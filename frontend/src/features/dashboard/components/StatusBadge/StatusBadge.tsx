import type { TransactionStatus } from '../../types/dashboard.types'
import styles from './StatusBadge.module.css'

const STATUS_LABELS: Record<TransactionStatus, string> = {
  completed: 'Completed',
  processing: 'Processing',
  shipped: 'Shipped',
  picking: 'Picking',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

type StatusBadgeProps = {
  status: TransactionStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={[styles.badge, styles[status]].join(' ')}>
      {STATUS_LABELS[status]}
    </span>
  )
}
