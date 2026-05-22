import { formatINR } from '../../data/posMock'
import type { CartSummary } from '../../store/cartStore'
import styles from './OrderSummary.module.css'

type OrderSummaryProps = {
  summary: CartSummary
}

export function OrderSummary({ summary }: OrderSummaryProps) {
  const hasDiscount = summary.discountAmount > 0

  return (
    <dl className={styles.summary}>
      <div className={styles.row}>
        <dt>Subtotal</dt>
        <dd>{formatINR(summary.subtotal)}</dd>
      </div>

      <div className={styles.row}>
        <dt>
          Discount
          {summary.discountRate > 0 ? (
            <span className={styles.tag}>{summary.discountRate}%</span>
          ) : null}
        </dt>
        <dd className={hasDiscount ? styles.negative : undefined}>
          {hasDiscount
            ? `−${formatINR(summary.discountAmount)}`
            : formatINR(0)}
        </dd>
      </div>

      <div className={styles.row}>
        <dt>Tax (GST)</dt>
        <dd>{formatINR(summary.taxAmount)}</dd>
      </div>

      <div className={[styles.row, styles.totalRow].join(' ')}>
        <dt>
          Total
          <span className={styles.count}>
            {summary.unitCount} {summary.unitCount === 1 ? 'item' : 'items'}
          </span>
        </dt>
        <dd className={styles.total}>{formatINR(summary.total)}</dd>
      </div>
    </dl>
  )
}
