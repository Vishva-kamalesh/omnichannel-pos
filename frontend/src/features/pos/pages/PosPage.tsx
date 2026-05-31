import { useMemo, useState } from 'react'
import { CATEGORIES, getCategoryMeta } from '../data/posMock'
import { posApi } from '../services/posApi'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '@/features/auth'
import { useAsync } from '@/shared/hooks/useAsync'
import { AsyncBoundary } from '@/shared/ui/AsyncBoundary'
import type { Product, ScanResult } from '../types/pos.types'
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
  const addProduct = useCartStore((s) => s.addProduct)
  const user = useAuthStore((s) => s.user)
  const storeId = user?.storeId

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

  // Reference category meta to silence unused-import lint while keeping export available.
  void getCategoryMeta

  if (!storeId) {
    return (
      <div className={styles.page}>
        <AsyncBoundary
          loading={false}
          error="Your account is not assigned to a store. Ask an admin to assign one."
        >
          <></>
        </AsyncBoundary>
      </div>
    )
  }

  return (
    <div className={styles.page}>
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
            loading={loading}
            error={error}
            isEmpty={!loading && !error && products.length === 0}
            emptyMessage="No products available for this store yet."
            onRetry={refetch}
          >
            <ProductGrid products={filteredProducts} />
          </AsyncBoundary>
        </div>
      </section>

      <aside className={styles.cart}>
        <CartPanel storeId={storeId} onCheckoutComplete={refetch} />
      </aside>
    </div>
  )
}
