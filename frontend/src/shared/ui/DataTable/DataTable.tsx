import type { ReactNode } from 'react'
import styles from './DataTable.module.css'

export type Column<T> = {
  /** Stable identifier for the column (used as React key). */
  key: string
  header: ReactNode
  render: (row: T) => ReactNode
  align?: 'left' | 'right'
  /** Extra class applied to this column's <th>. */
  headerClassName?: string
  /** Extra class applied to this column's <td> cells. */
  cellClassName?: string
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string
  /** Optional node rendered inside the card below the table (e.g. a pager). */
  footer?: ReactNode
}

const cx = (...parts: (string | undefined | false)[]) =>
  parts.filter(Boolean).join(' ')

/**
 * Shared list-table chrome (scroll wrapper, header strip, row borders/hover).
 * Pages supply column definitions with their own cell renderers, so bespoke
 * cells (badges, avatars, currency) stay per-page while the styling is shared.
 * Designed to sit directly under a filter toolbar (square top corners).
 */
export function DataTable<T>({ columns, data, rowKey, footer }: DataTableProps<T>) {
  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cx(
                    col.align === 'right' && styles.alignRight,
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cx(
                      col.align === 'right' && styles.alignRight,
                      col.cellClassName,
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  )
}
