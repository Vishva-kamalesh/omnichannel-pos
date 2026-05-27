import { useMemo, useState } from 'react'
import { Download, PackagePlus } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageShell } from '@/shared/ui/PageShell'
import {
  INVENTORY_ITEMS,
  getInventorySummary,
  getStockStatus,
} from '../data/inventoryMock'
import {
  InventorySummary,
  InventoryTable,
  InventoryToolbar,
} from '../components'
import styles from './InventoryPage.module.css'

export function InventoryPage() {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('all')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')

  const summary = useMemo(() => getInventorySummary(INVENTORY_ITEMS), [])

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase()
    return INVENTORY_ITEMS.filter((item) => {
      if (location !== 'all' && item.locationId !== location) return false
      if (category !== 'all' && item.category !== category) return false
      if (status !== 'all' && getStockStatus(item) !== status) return false
      if (term) {
        const haystack = `${item.name} ${item.sku}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [search, location, category, status])

  function resetFilters() {
    setSearch('')
    setLocation('all')
    setCategory('all')
    setStatus('all')
  }

  return (
    <PageShell>
      <PageHeader
        title="Inventory"
        description="Stock levels across stores and warehouses"
        actions={
          <div className={styles.headerActions}>
            <button type="button" className={styles.secondaryBtn}>
              <Download size={15} strokeWidth={2} aria-hidden="true" />
              Export
            </button>
            <button type="button" className={styles.primaryBtn}>
              <PackagePlus size={15} strokeWidth={2} aria-hidden="true" />
              Receive stock
            </button>
          </div>
        }
      />

      <InventorySummary metrics={summary} />

      <div className={styles.panel}>
        <InventoryToolbar
          search={search}
          onSearchChange={setSearch}
          location={location}
          onLocationChange={setLocation}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
          resultCount={filteredItems.length}
          totalCount={INVENTORY_ITEMS.length}
          onReset={resetFilters}
        />
        <InventoryTable items={filteredItems} />
      </div>
    </PageShell>
  )
}
