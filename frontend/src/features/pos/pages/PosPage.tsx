import { useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Search, Store, X } from 'lucide-react'
import { CATEGORIES } from '../data/posMock'
import { posApi } from '../services/posApi'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '@/features/auth'
import { useAsync } from '@/shared/hooks/useAsync'
import { AsyncBoundary } from '@/shared/ui/AsyncBoundary'
import type { Product, ProductCategory, StoreOption } from '../types/pos.types'
import { CartPanel, ProductTile } from '../components'
import styles from './PosPage.module.css'

type CategoryId = 'all' | ProductCategory
type CategoryOption = { id: CategoryId; label: string; count: number }

export function PosPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId>('all')
  const [pickedStoreId, setPickedStoreId] = useState<string | undefined>()
  const addProduct = useCartStore((s) => s.addProduct)
  const user = useAuthStore((s) => s.user)

  // Cashiers/managers are bound to their store; an admin picks one in the header.
  const fixedStoreId = user?.storeId

  const {
    data: stores,
    loading: storesLoading,
    error: storesError,
    refetch: refetchStores,
  } = useAsync<StoreOption[]>(() => posApi.listStores(), [])

  const storeList = stores ?? []
  const storeId = fixedStoreId ?? pickedStoreId ?? storeList[0]?.id
  const activeStore = storeList.find((s) => s.id === storeId)
  const canChooseStore = !fixedStoreId

  const { data, loading, error, refetch } = useAsync<Product[]>(
    async () => (storeId ? posApi.listProductsWithStock(storeId) : []),
    [storeId],
  )
  const products = data ?? []

  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const options: CategoryOption[] = [
      { id: 'all', label: 'All', count: products.length },
    ]
    for (const meta of CATEGORIES) {
      options.push({
        id: meta.id,
        label: meta.label,
        count: products.filter((p) => p.category === meta.id).length,
      })
    }
    return options
  }, [products])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return products.filter((product) => {
      if (category !== 'all' && product.category !== category) return false
      if (!term) return true
      return (
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        product.barcode.includes(term)
      )
    })
  }, [query, category, products])

  // Enter on an exact barcode/SKU match adds it straight to the cart (scan flow).
  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return
    const code = query.trim().toLowerCase()
    if (!code) return
    const match = products.find(
      (p) => p.barcode === code || p.sku.toLowerCase() === code,
    )
    if (match && match.stock > 0) {
      addProduct(match)
      setQuery('')
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>POS Terminal</h1>
          <span className={styles.meta}>Register 02</span>
        </div>

        <div className={styles.storePicker}>
          <Store size={15} strokeWidth={2} aria-hidden="true" />
          {canChooseStore ? (
            <select
              className={styles.storeSelect}
              value={storeId ?? ''}
              onChange={(e) => setPickedStoreId(e.target.value)}
              disabled={storesLoading || storeList.length === 0}
              aria-label="Select store"
            >
              {storesLoading ? (
                <option value="">Loading stores…</option>
              ) : storeList.length === 0 ? (
                <option value="">No stores available</option>
              ) : (
                storeList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.location ? `${s.name} — ${s.location}` : s.name}
                  </option>
                ))
              )}
            </select>
          ) : (
            <span className={styles.storeFixed}>
              {activeStore
                ? activeStore.location
                  ? `${activeStore.name} — ${activeStore.location}`
                  : activeStore.name
                : 'Your store'}
            </span>
          )}
        </div>
      </header>

      <div className={styles.body}>
        <section className={styles.catalog} aria-label="Product catalog">
          <div className={styles.catalogHeader}>
            <div className={styles.search}>
              <Search size={16} strokeWidth={2} aria-hidden="true" />
              <input
                className={styles.searchInput}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products or scan a barcode…"
                aria-label="Search products"
              />
              {query ? (
                <button
                  type="button"
                  className={styles.clear}
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <X size={15} strokeWidth={2} />
                </button>
              ) : null}
            </div>

            <div
              className={styles.chips}
              role="group"
              aria-label="Filter products by category"
            >
              {categoryOptions.map((option) => {
                const isActive = option.id === category
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isActive}
                    className={[styles.chip, isActive ? styles.chipActive : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setCategory(option.id)}
                  >
                    {option.label}
                    <span className={styles.chipCount}>{option.count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className={styles.catalogBody}>
            <AsyncBoundary
              loading={storesLoading || loading}
              error={storesError || error}
              isEmpty={
                !storesLoading &&
                !loading &&
                !storesError &&
                !error &&
                filtered.length === 0
              }
              emptyMessage={
                storeId
                  ? products.length === 0
                    ? 'No products available for this store yet.'
                    : 'No products match your search.'
                  : 'Select a store to start a sale.'
              }
              onRetry={() => {
                refetchStores()
                refetch()
              }}
            >
              <div className={styles.grid}>
                {filtered.map((product) => (
                  <ProductTile key={product.id} product={product} />
                ))}
              </div>
            </AsyncBoundary>
          </div>
        </section>

        <aside className={styles.cart}>
          {storeId ? (
            <CartPanel storeId={storeId} onCheckoutComplete={refetch} />
          ) : null}
        </aside>
      </div>
    </div>
  )
}
