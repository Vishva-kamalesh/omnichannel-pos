import { Skeleton } from './Skeleton'
import styles from './TableSkeleton.module.css'

type TableSkeletonProps = {
  rows?: number
  columns?: number
}

/** A table-shaped loading placeholder: a header strip plus shimmer rows. */
export function TableSkeleton({ rows = 8, columns = 5 }: TableSkeletonProps) {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.head}>
        {Array.from({ length: columns }).map((_, c) => (
          <span key={c} className={styles.cell}>
            <Skeleton height={11} width={c === 0 ? '45%' : '60%'} />
          </span>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className={styles.row}>
          {Array.from({ length: columns }).map((_, c) => (
            <span key={c} className={styles.cell}>
              <Skeleton height={14} width={c === 0 ? '75%' : '50%'} />
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
