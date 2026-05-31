import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageShell } from '@/shared/ui/PageShell'
import { AsyncBoundary } from '@/shared/ui/AsyncBoundary'
import { useAsync } from '@/shared/hooks/useAsync'
import { productsApi } from '../services/productsApi'
import { ProductsTable, ProductsToolbar } from '../components'
import styles from './ProductsPage.module.css'

export function ProductsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')

  const { data, loading, error, refetch } = useAsync(
    () => productsApi.list(),
    [],
  )

  const products = data?.products ?? []
  const categories = data?.categories ?? []

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((product) => {
      if (category !== 'all' && product.category !== category) return false
      if (status !== 'all' && product.status !== status) return false
      if (term) {
        const haystack = `${product.name} ${product.sku}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [products, search, category, status])

  function resetFilters() {
    setSearch('')
    setCategory('all')
    setStatus('all')
  }

  return (
    <PageShell>
      <PageHeader
        title="Products"
        description={`${products.length} product${products.length !== 1 ? 's' : ''} in the catalog`}
        actions={
          <button
            type="button"
            className={styles.addBtn}
            disabled
            title="Coming soon — create products via the API"
          >
            <Plus size={15} strokeWidth={2.5} aria-hidden="true" />
            Add product
          </button>
        }
      />

      <AsyncBoundary
        loading={loading}
        error={error}
        onRetry={refetch}
        isEmpty={!loading && !error && products.length === 0}
        emptyMessage="No products in the catalog yet."
      >
        <div className={styles.panel}>
          <ProductsToolbar
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            status={status}
            onStatusChange={setStatus}
            categories={categories}
            resultCount={filteredProducts.length}
            totalCount={products.length}
            onReset={resetFilters}
          />
          <ProductsTable
            products={filteredProducts}
            onEdit={() => {
              /* edit modal disabled until backend variants ship */
            }}
          />
        </div>
      </AsyncBoundary>
    </PageShell>
  )
}
