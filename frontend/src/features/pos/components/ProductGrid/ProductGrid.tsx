import { PackageSearch } from 'lucide-react'
import type { Product } from '../../types/pos.types'
import { ProductCard } from '../ProductCard'
import styles from './ProductGrid.module.css'

type ProductGridProps = {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <PackageSearch size={30} strokeWidth={1.5} aria-hidden="true" />
        <p className={styles.emptyTitle}>No products found</p>
        <p className={styles.emptyHint}>
          Adjust your search term or pick a different category.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
