import { Search, X } from 'lucide-react'
import { INVENTORY_CATEGORIES, STOCK_LOCATIONS } from '../../data/inventoryMock'
import styles from './InventoryToolbar.module.css'

type InventoryToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  location: string
  onLocationChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  resultCount: number
  totalCount: number
  onReset: () => void
}

export function InventoryToolbar({
  search,
  onSearchChange,
  location,
  onLocationChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  resultCount,
  totalCount,
  onReset,
}: InventoryToolbarProps) {
  const stores = STOCK_LOCATIONS.filter((loc) => loc.type === 'store')
  const warehouses = STOCK_LOCATIONS.filter((loc) => loc.type === 'warehouse')
  const hasActiveFilters =
    search.trim() !== '' ||
    location !== 'all' ||
    category !== 'all' ||
    status !== 'all'

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
          aria-label="Search inventory"
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
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
          aria-label="Filter by location"
        >
          <option value="all">All locations</option>
          <optgroup label="Stores">
            {stores.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Warehouses">
            {warehouses.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </optgroup>
        </select>

        <select
          className={styles.select}
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {INVENTORY_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Filter by stock status"
        >
          <option value="all">All stock status</option>
          <option value="in-stock">In stock</option>
          <option value="low-stock">Low stock</option>
          <option value="out-of-stock">Out of stock</option>
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
