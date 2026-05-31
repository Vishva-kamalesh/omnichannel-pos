import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  PackageSearch,
} from 'lucide-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortDirection,
  type SortingState,
} from '@tanstack/react-table'
import {
  formatINR,
  getAvailable,
  getStockStatus,
} from '../../data/inventoryMock'
import type {
  InventoryItem,
  StockLocation,
  StockStatus,
} from '../../types/inventory.types'
import { InventoryPagination } from '../InventoryPagination'
import { StockStatusBadge } from '../StockStatusBadge'
import styles from './InventoryTable.module.css'

/** Severity order so the Status column sorts worst-first. */
const STATUS_RANK: Record<StockStatus, number> = {
  'out-of-stock': 0,
  'low-stock': 1,
  'in-stock': 2,
}

/** Columns rendered right-aligned with tabular figures. */
const NUMERIC_COLUMNS = new Set([
  'onHand',
  'committed',
  'available',
  'reorderPoint',
  'stockValue',
])

const columnHelper = createColumnHelper<InventoryItem>()

const FALLBACK_LOCATION: StockLocation = {
  id: 'unknown',
  code: 'STR',
  name: 'Unknown store',
  type: 'store',
}

function buildColumns(locationsById: Map<string, StockLocation>) {
  return [
  columnHelper.accessor('name', {
    header: 'Product',
    cell: (ctx) => (
      <div className={styles.product}>
        <span className={styles.productName}>{ctx.getValue()}</span>
        <span className={styles.sku}>{ctx.row.original.sku}</span>
      </div>
    ),
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (ctx) => <span className={styles.category}>{ctx.getValue()}</span>,
  }),
  columnHelper.accessor('locationId', {
    id: 'location',
    header: 'Location',
    sortingFn: (rowA, rowB) => {
      const a = locationsById.get(rowA.original.locationId) ?? FALLBACK_LOCATION
      const b = locationsById.get(rowB.original.locationId) ?? FALLBACK_LOCATION
      return a.name.localeCompare(b.name)
    },
    cell: (ctx) => {
      const location = locationsById.get(ctx.getValue()) ?? FALLBACK_LOCATION
      return (
        <div className={styles.location}>
          <span className={styles.locationName}>{location.name}</span>
          <span className={styles.locationMeta}>
            {location.type === 'warehouse' ? 'Warehouse' : 'Store'} ·{' '}
            {location.code}
          </span>
        </div>
      )
    },
  }),
  columnHelper.accessor('onHand', {
    header: 'On hand',
    cell: (ctx) => (
      <span className={styles.num}>
        {ctx.getValue().toLocaleString('en-IN')}
      </span>
    ),
  }),
  columnHelper.accessor('committed', {
    header: 'Committed',
    cell: (ctx) => (
      <span className={styles.numMuted}>
        {ctx.getValue().toLocaleString('en-IN')}
      </span>
    ),
  }),
  columnHelper.accessor((row) => getAvailable(row), {
    id: 'available',
    header: 'Available',
    cell: (ctx) => {
      const value = ctx.getValue()
      return (
        <span
          className={
            value <= 0 ? `${styles.num} ${styles.numDanger}` : styles.num
          }
        >
          {value.toLocaleString('en-IN')}
        </span>
      )
    },
  }),
  columnHelper.accessor('reorderPoint', {
    header: 'Reorder point',
    cell: (ctx) => (
      <span className={styles.numMuted}>
        {ctx.getValue().toLocaleString('en-IN')}
      </span>
    ),
  }),
  columnHelper.accessor((row) => row.onHand * row.unitCost, {
    id: 'stockValue',
    header: 'Stock value',
    cell: (ctx) => (
      <span className={styles.num}>{formatINR(ctx.getValue())}</span>
    ),
  }),
  columnHelper.accessor((row) => getStockStatus(row), {
    id: 'status',
    header: 'Status',
    sortingFn: (rowA, rowB) =>
      STATUS_RANK[getStockStatus(rowA.original)] -
      STATUS_RANK[getStockStatus(rowB.original)],
    cell: (ctx) => <StockStatusBadge status={ctx.getValue()} />,
  }),
  ]
}

function SortIcon({ direction }: { direction: SortDirection | false }) {
  if (direction === 'asc') {
    return (
      <ChevronUp size={13} strokeWidth={2.5} className={styles.sortActive} />
    )
  }
  if (direction === 'desc') {
    return (
      <ChevronDown size={13} strokeWidth={2.5} className={styles.sortActive} />
    )
  }
  return <ChevronsUpDown size={13} strokeWidth={2} className={styles.sortIdle} />
}

type InventoryTableProps = {
  items: InventoryItem[]
  locations?: StockLocation[]
}

export function InventoryTable({ items, locations = [] }: InventoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'status', desc: false },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = useState(() =>
    buildColumns(new Map(locations.map((loc) => [loc.id, loc]))),
  )[0]

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const rows = table.getRowModel().rows
  const columnCount = table.getAllLeafColumns().length

  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const numeric = NUMERIC_COLUMNS.has(header.column.id)
                  const sorted = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={numeric ? styles.thNumeric : undefined}
                      aria-sort={
                        sorted === 'asc'
                          ? 'ascending'
                          : sorted === 'desc'
                            ? 'descending'
                            : 'none'
                      }
                    >
                      <button
                        type="button"
                        className={styles.sortButton}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                        <SortIcon direction={sorted} />
                      </button>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className={styles.emptyCell}>
                  <div className={styles.empty}>
                    <PackageSearch
                      size={26}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <p className={styles.emptyTitle}>
                      No inventory matches your filters
                    </p>
                    <p className={styles.emptyHint}>
                      Try a different search term, location, or status.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const numeric = NUMERIC_COLUMNS.has(cell.column.id)
                    return (
                      <td
                        key={cell.id}
                        className={numeric ? styles.tdNumeric : undefined}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <InventoryPagination table={table} />
    </div>
  )
}
