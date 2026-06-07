import { useMemo, useState } from 'react'
import { Store } from 'lucide-react'
import { CATEGORIES } from '../data/posMock'
import { posApi } from '../services/posApi'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '@/features/auth'
import { useAsync } from '@/shared/hooks/useAsync'
import { AsyncBoundary } from '@/shared/ui/AsyncBoundary'
import type { Product, ScanResult, StoreOption } from '../types/pos.types'
import {
  CartPanel,
  CategoryFilter,
  ProductGrid,
  ProductSearch,
} from '../components'
import type { CategoryId, CategoryOption } from '../components'
import styles from './PosPage.module.css'

export function PosPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId>('all')
  const [pickedStoreId, setPickedStoreId] = useState<string | undefined>()
  const addProduct = useCartStore((s) => s.addProduct)
  const user = useAuthStore((s) => s.user)

  // Cashiers/managers are bound to their own store; an admin floats and chooses
  // one from the header picker. Either way the terminal needs a concrete store.
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
      { id: 'all', label: 'All items', count: products.length },
    ]
    for (const meta of CATEGORIES) {
      options.push({
        id: meta.id,
        label: meta.label,
        accent: meta.accent,
        count: products.filter((p) => p.category === meta.id).length,
      })
    }
    return options
  }, [products])

  const filteredProducts = useMemo(() => {
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

  function findProductByCode(rawCode: string): Product | undefined {
    const code = rawCode.trim().toLowerCase()
    if (!code) return undefined
    return products.find(
      (p) => p.barcode === code || p.sku.toLowerCase() === code,
    )
  }

  function handleBarcode(code: string): ScanResult {
    const product = findProductByCode(code)
    if (!product) return { status: 'not-found' }
    const inCart =
      useCartStore
        .getState()
        .lines.find((l) => l.product.id === product.id)?.quantity ?? 0
    if (inCart >= product.stock) return { status: 'out-of-stock', product }
    addProduct(product)
    return { status: 'added', product }
  }

  return (
    <div className={styles.page}>
      <header className={styles.terminalHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.terminalTitle}>POS Terminal</h1>
          <span className={styles.terminalMeta}>Register 02</span>
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
            <ProductSearch
              query={query}
              onQueryChange={setQuery}
              onBarcodeSubmit={handleBarcode}
            />
            <CategoryFilter
              options={categoryOptions}
              active={category}
              onChange={setCategory}
              resultCount={filteredProducts.length}
            />
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
                products.length === 0
              }
              emptyMessage={
                storeId
                  ? 'No products available for this store yet.'
                  : 'Select a store to start a sale.'
              }
              onRetry={() => {
                refetchStores()
                refetch()
              }}
            >
              <ProductGrid products={filteredProducts} />
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
