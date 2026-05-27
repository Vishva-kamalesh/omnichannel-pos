import type { ProductStatus } from '../../types/product.types'
import styles from './ProductStatusBadge.module.css'

const STATUS_LABELS: Record<ProductStatus, string> = {
  active: 'Active',
  draft: 'Draft',
  archived: 'Archived',
}

const STATUS_CLASS: Record<ProductStatus, string> = {
  active: styles.active,
  draft: styles.draft,
  archived: styles.archived,
}

type ProductStatusBadgeProps = {
  status: ProductStatus
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  return (
    <span className={[styles.badge, STATUS_CLASS[status]].join(' ')}>
      <span className={styles.dot} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
