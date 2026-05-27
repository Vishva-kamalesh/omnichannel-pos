import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import type { InventoryItem } from '../../types/inventory.types'
import styles from './InventoryPagination.module.css'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

type InventoryPaginationProps = {
  table: Table<InventoryItem>
}

export function InventoryPagination({ table }: InventoryPaginationProps) {
  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getCoreRowModel().rows.length
  const pageCount = table.getPageCount()
  const firstRow = pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <label className={styles.sizeLabel}>
          Rows per page
          <select
            className={styles.sizeSelect}
            value={pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <span className={styles.range}>
          {totalRows === 0
            ? 'No items'
            : `${firstRow}–${lastRow} of ${totalRows}`}
        </span>
      </div>

      <div className={styles.right}>
        <span className={styles.pageInfo}>
          Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
        </span>
        <div className={styles.btnGroup}>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
          >
            <ChevronsLeft size={15} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft size={15} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight size={15} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
          >
            <ChevronsRight size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
