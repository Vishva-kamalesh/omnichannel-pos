import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageShell } from '@/shared/ui/PageShell'
import { PRODUCTS, PRODUCT_CATEGORIES } from '../data/productsMock'
import type { Product } from '../types/product.types'
import {
  ProductFormModal,
  ProductsTable,
  ProductsToolbar,
} from '../components'
import styles from './ProductsPage.module.css'

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

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

  function openCreateModal() {
    setEditingProduct(null)
    setModalOpen(true)
  }

  function openEditModal(product: Product) {
    setEditingProduct(product)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingProduct(null)
  }

  function handleSubmitProduct(product: Product) {
    setProducts((current) => {
      const exists = current.some((item) => item.id === product.id)
      return exists
        ? current.map((item) => (item.id === product.id ? product : item))
        : [product, ...current]
    })
    closeModal()
  }

  function resetFilters() {
    setSearch('')
    setCategory('all')
    setStatus('all')
  }

  return (
    <PageShell>
      <PageHeader
        title="Products"
        description={`${products.length} products in the catalog`}
        actions={
          <button
            type="button"
            className={styles.addBtn}
            onClick={openCreateModal}
          >
            <Plus size={15} strokeWidth={2.5} aria-hidden="true" />
            Add product
          </button>
        }
      />

      <div className={styles.panel}>
        <ProductsToolbar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
          categories={PRODUCT_CATEGORIES}
          resultCount={filteredProducts.length}
          totalCount={products.length}
          onReset={resetFilters}
        />
        <ProductsTable products={filteredProducts} onEdit={openEditModal} />
      </div>

      <ProductFormModal
        open={modalOpen}
        mode={editingProduct ? 'edit' : 'create'}
        product={editingProduct}
        categories={PRODUCT_CATEGORIES}
        onClose={closeModal}
        onSubmit={handleSubmitProduct}
      />
    </PageShell>
  )
}
