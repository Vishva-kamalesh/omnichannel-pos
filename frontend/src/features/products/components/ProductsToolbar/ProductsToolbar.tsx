import { Search, X } from 'lucide-react'
import styles from './ProductsToolbar.module.css'

type ProductsToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  categories: readonly string[]
  resultCount: number
  totalCount: number
  onReset: () => void
}

export function ProductsToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  categories,
  resultCount,
  totalCount,
  onReset,
}: ProductsToolbarProps) {
  const hasActiveFilters =
    search.trim() !== '' || category !== 'all' || status !== 'all'

  return (
    <div className={styles.toolbar}>
      <div className={styles.searchField}>
        <Search size={15} strokeWidth={2} aria-hidden="true" />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by product name or SKU"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') onSearchChange('')
          }}
          aria-label="Search products"
        />
        {search ? (
          <button
            type="button"
            className={styles.clearSearch}
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        {hasActiveFilters ? (
          <div className={styles.resultGroup}>
            <span className={styles.count}>
              {resultCount} of {totalCount}
            </span>
            <button type="button" className={styles.reset} onClick={onReset}>
              <X size={13} strokeWidth={2.5} aria-hidden="true" />
              Clear
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
