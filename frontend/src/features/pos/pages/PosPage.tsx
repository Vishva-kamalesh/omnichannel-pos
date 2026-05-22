import { useMemo, useState } from 'react'
import { CATEGORIES, POS_PRODUCTS, findProductByCode } from '../data/posMock'
import { useCartStore } from '../store/cartStore'
import type { Product } from '../types/pos.types'
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

  const categoryOptions = useMemo<CategoryOption[]>(() => {
    const options: CategoryOption[] = [
      { id: 'all', label: 'All items', count: POS_PRODUCTS.length },
    ]
    for (const meta of CATEGORIES) {
      options.push({
        id: meta.id,
        label: meta.label,
        accent: meta.accent,
        count: POS_PRODUCTS.filter((p) => p.category === meta.id).length,
      })
    }
    return options
  }, [])

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase()
    return POS_PRODUCTS.filter((product) => {
      if (category !== 'all' && product.category !== category) return false
      if (!term) return true
      return (
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        product.barcode.includes(term)
      )
    })
  }, [query, category])

  function handleBarcode(code: string): Product | null {
    const product = findProductByCode(code)
    if (product && product.stock > 0) {
      addProduct(product)
      return product
    }
    return null
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
          <ProductGrid products={filteredProducts} />
        </div>
      </section>

      <aside className={styles.cart}>
        <CartPanel />
      </aside>
    </div>
  )
}
